import type { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseCommunityRepository } from '../repositories/SupabaseCommunityRepository';

const row = {
  id: 'c1',
  name: 'Crossfit',
  description: null,
  invite_code: 'ABCD23',
  created_by: 'ana',
  created_at: '2026-11-24T10:00:00.000Z',
};
const community = { ...row, description: undefined };

type Result = { data: unknown; error: { message: string } | null };

const mockRpc = (result: Result) => {
  const rpc = jest.fn().mockResolvedValue(result);
  const repository = new SupabaseCommunityRepository({ rpc } as unknown as SupabaseClient);
  return { rpc, repository };
};

/** Query builder falso: encadeavel e "awaitable", como o do supabase-js. */
const mockQuery = (result: Result) => {
  const query = {
    select: jest.fn(),
    delete: jest.fn(),
    eq: jest.fn(),
    then: (resolve: (value: Result) => unknown) => Promise.resolve(result).then(resolve),
  };
  query.select.mockReturnValue(query);
  query.delete.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  const from = jest.fn().mockReturnValue(query);
  const repository = new SupabaseCommunityRepository({ from } as unknown as SupabaseClient);
  return { from, query, repository };
};

const failure: Result = { data: null, error: { message: 'boom' } };

describe('SupabaseCommunityRepository', () => {
  it('should create through the create_community rpc', async () => {
    const { rpc, repository } = mockRpc({ data: row, error: null });

    await expect(repository.create({ name: '  Crossfit ', created_by: 'ana' })).resolves.toEqual(community);
    expect(rpc).toHaveBeenCalledWith('create_community', {
      p_name: 'Crossfit',
      p_description: null,
      p_user_id: 'ana',
    });
  });

  it('should join through the join_community rpc with a normalized code', async () => {
    const { rpc, repository } = mockRpc({ data: row, error: null });

    await expect(repository.join({ invite_code: ' abc d23', user_id: 'bia' })).resolves.toEqual(community);
    expect(rpc).toHaveBeenCalledWith('join_community', { p_invite_code: 'ABCD23', p_user_id: 'bia' });
  });

  it('should validate input before calling the rpc', async () => {
    const { rpc, repository } = mockRpc({ data: row, error: null });

    await expect(repository.create({ name: 'ab', created_by: 'ana' })).rejects.toMatchObject({
      code: 'INVALID_INPUT',
    });
    await expect(repository.join({ invite_code: 'abc', user_id: 'bia' })).rejects.toMatchObject({
      code: 'INVALID_INPUT',
    });
    expect(rpc).not.toHaveBeenCalled();
  });

  it('should map the INVALID_INVITE_CODE database error', async () => {
    const { repository } = mockRpc({ data: null, error: { message: 'P0002: INVALID_INVITE_CODE' } });

    await expect(repository.join({ invite_code: 'ZZZZZZ', user_id: 'bia' })).rejects.toMatchObject({
      code: 'INVALID_INVITE_CODE',
      message: 'Codigo de convite invalido',
    });
  });

  it('should map other rpc errors to UNKNOWN', async () => {
    const { repository } = mockRpc(failure);

    await expect(repository.create({ name: 'Crossfit', created_by: 'ana' })).rejects.toMatchObject({
      code: 'UNKNOWN',
    });
    await expect(repository.join({ invite_code: 'ABCD23', user_id: 'bia' })).rejects.toMatchObject({
      code: 'UNKNOWN',
    });
  });

  it('should treat an empty rpc response as UNKNOWN', async () => {
    const { repository } = mockRpc({ data: null, error: null });

    await expect(repository.create({ name: 'Crossfit', created_by: 'ana' })).rejects.toMatchObject({
      code: 'UNKNOWN',
    });
  });

  it('should list my communities sorted by name', async () => {
    const { from, query, repository } = mockQuery({
      data: [
        { communities: { ...row, id: 'z', name: 'Zeta' } },
        { communities: { ...row, id: 'a', name: 'alfa' } },
        { communities: null },
      ],
      error: null,
    });

    const result = await repository.listForUser('ana');

    expect(result.map((c) => c.name)).toEqual(['alfa', 'Zeta']);
    expect(result[0].description).toBeUndefined();
    expect(from).toHaveBeenCalledWith('community_members');
    expect(query.select).toHaveBeenCalledWith('communities(*)');
    expect(query.eq).toHaveBeenCalledWith('user_id', 'ana');
  });

  it('should list the members of a community', async () => {
    const member = { community_id: 'c1', user_id: 'ana', role: 'admin', joined_at: row.created_at };
    const { from, query, repository } = mockQuery({ data: [member], error: null });

    await expect(repository.listMembers('c1')).resolves.toEqual([member]);
    expect(from).toHaveBeenCalledWith('community_members');
    expect(query.eq).toHaveBeenCalledWith('community_id', 'c1');
  });

  it('should leave by deleting only my membership', async () => {
    const { from, query, repository } = mockQuery({ data: null, error: null });

    await repository.leave('c1', 'ana');

    expect(from).toHaveBeenCalledWith('community_members');
    expect(query.delete).toHaveBeenCalled();
    expect(query.eq.mock.calls).toEqual([
      ['community_id', 'c1'],
      ['user_id', 'ana'],
    ]);
  });

  it('should map query errors to UNKNOWN', async () => {
    const { repository } = mockQuery(failure);

    await expect(repository.listForUser('ana')).rejects.toMatchObject({ code: 'UNKNOWN' });
    await expect(repository.listMembers('c1')).rejects.toMatchObject({ code: 'UNKNOWN' });
    await expect(repository.leave('c1', 'ana')).rejects.toMatchObject({ code: 'UNKNOWN' });
  });
});
