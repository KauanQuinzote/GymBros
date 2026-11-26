import { scopeToCommunity } from '../domain/scopeToCommunity';

const profiles = [{ id: 'ana' }, { id: 'bia' }, { id: 'caio' }];
const presences = [{ user_id: 'caio' }, { user_id: 'ana' }];

describe('scopeToCommunity', () => {
  it('should return items unchanged when memberIds is null', () => {
    expect(scopeToCommunity(profiles, null, (p) => p.id)).toBe(profiles);
  });

  it('should filter profiles by a set of member ids', () => {
    expect(scopeToCommunity(profiles, new Set(['ana', 'caio']), (p) => p.id)).toEqual([
      { id: 'ana' },
      { id: 'caio' },
    ]);
  });

  it('should filter presences by an array of member ids', () => {
    expect(scopeToCommunity(presences, ['ana'], (p) => p.user_id)).toEqual([{ user_id: 'ana' }]);
  });

  it('should return nothing when the community has no members', () => {
    expect(scopeToCommunity(profiles, [], (p) => p.id)).toEqual([]);
  });
});
