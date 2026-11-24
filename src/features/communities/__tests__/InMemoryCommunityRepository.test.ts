import { scopeToCommunity } from '../domain/scopeToCommunity';
import { InMemoryCommunityRepository } from '../repositories/InMemoryCommunityRepository';
import { INVITE_CODE_LENGTH } from '../types';

const NOW = '2026-11-24T10:00:00.000Z';

const buildRepository = (codes: string[] = ['AAAAAA', 'BBBBBB', 'CCCCCC']) => {
  let id = 0;
  let code = 0;
  return new InMemoryCommunityRepository({
    now: () => NOW,
    generateId: () => `community-${++id}`,
    generateCode: () => codes[code++],
  });
};

describe('InMemoryCommunityRepository', () => {
  it('should create new community and add creator as admin member', async () => {
    const repository = buildRepository();

    const community = await repository.create({
      name: '  Bros da Madrugada  ',
      description: '  Treino cedo  ',
      created_by: 'ana',
    });

    expect(community).toEqual({
      id: 'community-1',
      name: 'Bros da Madrugada',
      description: 'Treino cedo',
      invite_code: 'AAAAAA',
      created_by: 'ana',
      created_at: NOW,
    });
    expect(await repository.listMembers(community.id)).toEqual([
      { community_id: community.id, user_id: 'ana', role: 'admin', joined_at: NOW },
    ]);
  });

  it('should reject join with invalid invite code', async () => {
    const repository = buildRepository();
    const community = await repository.create({ name: 'Crossfit', created_by: 'ana' });

    await expect(repository.join({ invite_code: 'ZZZZZZ', user_id: 'bia' })).rejects.toMatchObject({
      name: 'CommunityError',
      code: 'INVALID_INVITE_CODE',
      message: 'Codigo de convite invalido',
    });
    expect(await repository.listMembers(community.id)).toHaveLength(1);
  });

  it('should isolate workouts between members of distinct communities', async () => {
    const repository = buildRepository();
    const early = await repository.create({ name: 'Madrugada', created_by: 'ana' });
    const crossfit = await repository.create({ name: 'Crossfit', created_by: 'caio' });
    await repository.join({ invite_code: early.invite_code, user_id: 'bia' });
    await repository.join({ invite_code: crossfit.invite_code, user_id: 'davi' });
    const workouts = ['ana', 'bia', 'caio', 'davi'].map((user_id) => ({
      id: `session-${user_id}`,
      user_id,
    }));

    const scopedUsers = async (communityId: string) => {
      const memberIds = (await repository.listMembers(communityId)).map((m) => m.user_id);
      return scopeToCommunity(workouts, memberIds, (w) => w.user_id).map((w) => w.user_id);
    };

    expect(await scopedUsers(early.id)).toEqual(['ana', 'bia']);
    expect(await scopedUsers(crossfit.id)).toEqual(['caio', 'davi']);
  });

  it('should add a new bro as member when joining', async () => {
    const repository = buildRepository();
    const community = await repository.create({ name: 'Crossfit', created_by: 'ana' });

    const joined = await repository.join({ invite_code: community.invite_code, user_id: 'bia' });

    expect(joined).toEqual(community);
    expect(await repository.listMembers(community.id)).toContainEqual({
      community_id: community.id,
      user_id: 'bia',
      role: 'member',
      joined_at: NOW,
    });
  });

  it('should keep join idempotent without changing the role', async () => {
    const repository = buildRepository();
    const community = await repository.create({ name: 'Crossfit', created_by: 'ana' });

    await repository.join({ invite_code: community.invite_code, user_id: 'ana' });
    await repository.join({ invite_code: community.invite_code, user_id: 'bia' });
    await repository.join({ invite_code: community.invite_code, user_id: 'bia' });

    expect((await repository.listMembers(community.id)).map((m) => [m.user_id, m.role])).toEqual([
      ['ana', 'admin'],
      ['bia', 'member'],
    ]);
  });

  it('should normalize lowercase and spaced invite codes', async () => {
    const repository = buildRepository(['ABCD23']);
    const community = await repository.create({ name: 'Crossfit', created_by: 'ana' });

    await expect(
      repository.join({ invite_code: ' abc d23 ', user_id: 'bia' })
    ).resolves.toEqual(community);
  });

  it('should reject an invite code with the wrong length', async () => {
    await expect(buildRepository().join({ invite_code: 'ABC', user_id: 'bia' })).rejects.toMatchObject({
      code: 'INVALID_INPUT',
      message: 'O codigo tem 6 caracteres',
    });
  });

  it('should reject a short name without persisting anything', async () => {
    const repository = buildRepository();

    await expect(repository.create({ name: '  ab  ', created_by: 'ana' })).rejects.toMatchObject({
      code: 'INVALID_INPUT',
      message: 'Nome precisa ter ao menos 3 caracteres',
    });
    expect(await repository.listForUser('ana')).toEqual([]);
  });

  it('should store a blank description as undefined', async () => {
    const community = await buildRepository().create({
      name: 'Crossfit',
      description: '   ',
      created_by: 'ana',
    });

    expect(community.description).toBeUndefined();
  });

  it('should regenerate the invite code on collision', async () => {
    const repository = buildRepository(['AAAAAA', 'AAAAAA', 'BBBBBB']);

    const first = await repository.create({ name: 'Madrugada', created_by: 'ana' });
    const second = await repository.create({ name: 'Crossfit', created_by: 'ana' });

    expect([first.invite_code, second.invite_code]).toEqual(['AAAAAA', 'BBBBBB']);
  });

  it('should fail instead of looping forever when no unique code is available', async () => {
    const repository = new InMemoryCommunityRepository({ generateCode: () => 'AAAAAA' });
    await repository.create({ name: 'Madrugada', created_by: 'ana' });

    await expect(repository.create({ name: 'Crossfit', created_by: 'ana' })).rejects.toMatchObject({
      code: 'UNKNOWN',
    });
  });

  it('should generate unique ids and codes with the default generators', async () => {
    const repository = new InMemoryCommunityRepository();

    const first = await repository.create({ name: 'Madrugada', created_by: 'ana' });
    const second = await repository.create({ name: 'Crossfit', created_by: 'ana' });

    expect(first.id).not.toBe(second.id);
    expect(first.invite_code).toHaveLength(INVITE_CODE_LENGTH);
    expect(Number.isNaN(Date.parse(first.created_at))).toBe(false);
  });

  it('should list only my communities sorted by name', async () => {
    const repository = buildRepository();
    await repository.create({ name: 'Zeta', created_by: 'ana' });
    await repository.create({ name: 'Outra', created_by: 'caio' });
    await repository.create({ name: 'alfa', created_by: 'ana' });

    expect((await repository.listForUser('ana')).map((c) => c.name)).toEqual(['alfa', 'Zeta']);
  });

  it('should remove only my membership when leaving', async () => {
    const repository = buildRepository();
    const early = await repository.create({ name: 'Madrugada', created_by: 'ana' });
    const crossfit = await repository.create({ name: 'Crossfit', created_by: 'ana' });
    await repository.join({ invite_code: early.invite_code, user_id: 'bia' });

    await repository.leave(early.id, 'ana');

    expect(await repository.listForUser('ana')).toEqual([crossfit]);
    expect((await repository.listMembers(early.id)).map((m) => m.user_id)).toEqual(['bia']);
  });
});
