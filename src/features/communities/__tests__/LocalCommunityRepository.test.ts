import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalCommunityRepository } from '../repositories/LocalCommunityRepository';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const readJson = async (key: string) => JSON.parse((await AsyncStorage.getItem(key)) ?? 'null');

describe('LocalCommunityRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should persist the community and admin membership under the storage keys', async () => {
    const community = await new LocalCommunityRepository().create({
      name: 'Crossfit',
      created_by: 'ana',
    });

    expect(await readJson('@gymbros_communities')).toEqual([community]);
    expect(await readJson('@gymbros_community_members')).toMatchObject([
      { community_id: community.id, user_id: 'ana', role: 'admin' },
    ]);
  });

  it('should share persisted state between instances for join, list and leave', async () => {
    const community = await new LocalCommunityRepository().create({
      name: 'Crossfit',
      created_by: 'ana',
    });
    const repository = new LocalCommunityRepository();

    await repository.join({ invite_code: community.invite_code.toLowerCase(), user_id: 'bia' });

    expect(await new LocalCommunityRepository().listForUser('bia')).toEqual([community]);
    await repository.leave(community.id, 'bia');
    expect(await repository.listForUser('bia')).toEqual([]);
    expect((await repository.listMembers(community.id)).map((m) => m.user_id)).toEqual(['ana']);
  });

  it('should not persist anything when the input is invalid', async () => {
    await expect(
      new LocalCommunityRepository().create({ name: 'ab', created_by: 'ana' })
    ).rejects.toMatchObject({ code: 'INVALID_INPUT' });

    expect(await AsyncStorage.getItem('@gymbros_communities')).toBeNull();
  });

  it('should reject an unknown invite code', async () => {
    await expect(
      new LocalCommunityRepository().join({ invite_code: 'ZZZZZZ', user_id: 'bia' })
    ).rejects.toMatchObject({ code: 'INVALID_INVITE_CODE' });
  });

  it('should not lose writes made concurrently', async () => {
    const first = new LocalCommunityRepository();
    const second = new LocalCommunityRepository();

    await Promise.all([
      first.create({ name: 'Madrugada', created_by: 'ana' }),
      second.create({ name: 'Crossfit', created_by: 'ana' }),
    ]);

    expect((await first.listForUser('ana')).map((c) => c.name)).toEqual(['Crossfit', 'Madrugada']);
  });

  it('should regenerate a code that collides with a persisted one', async () => {
    const codes = ['AAAAAA', 'AAAAAA', 'BBBBBB'];
    const options = { generateCode: () => codes.shift() as string };
    await new LocalCommunityRepository(options).create({ name: 'Madrugada', created_by: 'ana' });

    const second = await new LocalCommunityRepository(options).create({
      name: 'Crossfit',
      created_by: 'ana',
    });

    expect(second.invite_code).toBe('BBBBBB');
  });

  it('should fail without overwriting corrupted storage', async () => {
    await AsyncStorage.setItem('@gymbros_communities', '{broken');

    await expect(
      new LocalCommunityRepository().create({ name: 'Crossfit', created_by: 'ana' })
    ).rejects.toMatchObject({ code: 'UNKNOWN' });

    expect(await AsyncStorage.getItem('@gymbros_communities')).toBe('{broken');
  });
});
