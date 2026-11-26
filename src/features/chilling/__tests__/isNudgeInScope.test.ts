import { isNudgeInScope } from '../domain/isNudgeInScope';

describe('isNudgeInScope', () => {
  const members: ReadonlySet<string> = new Set(['user-1', 'user-2']);

  it('should accept a broadcast from a member', () => {
    expect(isNudgeInScope({ sender_id: 'user-2', receiver_id: 'ALL' }, members)).toBe(true);
  });

  it('should reject a broadcast from a non-member', () => {
    expect(isNudgeInScope({ sender_id: 'user-9', receiver_id: 'ALL' }, members)).toBe(false);
  });

  it('should accept a direct nudge regardless of the active community', () => {
    expect(isNudgeInScope({ sender_id: 'user-9', receiver_id: 'user-1' }, members)).toBe(true);
  });

  it('should not filter when memberIds is undefined', () => {
    expect(isNudgeInScope({ sender_id: 'user-9', receiver_id: 'ALL' }, undefined)).toBe(true);
  });
});
