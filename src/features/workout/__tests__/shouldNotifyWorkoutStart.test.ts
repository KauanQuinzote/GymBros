import { shouldNotifyWorkoutStart } from '../domain/shouldNotifyWorkoutStart';

describe('shouldNotifyWorkoutStart', () => {
  const members: ReadonlySet<string> = new Set(['user-1', 'user-2']);
  const insert = (userId: string, status = 'in_progress') => ({
    eventType: 'INSERT',
    session: { user_id: userId, status },
  });

  it('should notify when a community member starts a workout', () => {
    expect(shouldNotifyWorkoutStart(insert('user-2'), 'user-1', members)).toBe(true);
  });

  it('should not notify when the bro is not a member of the active community', () => {
    expect(shouldNotifyWorkoutStart(insert('user-9'), 'user-1', members)).toBe(false);
  });

  it('should not notify about the active profile own workout', () => {
    expect(shouldNotifyWorkoutStart(insert('user-1'), 'user-1', members)).toBe(false);
  });

  it('should not notify on UPDATE events', () => {
    const event = { ...insert('user-2'), eventType: 'UPDATE' };
    expect(shouldNotifyWorkoutStart(event, 'user-1', members)).toBe(false);
  });

  it('should not notify for completed sessions', () => {
    expect(shouldNotifyWorkoutStart(insert('user-2', 'completed'), 'user-1', members)).toBe(false);
  });

  it('should not filter by membership when memberIds is undefined', () => {
    expect(shouldNotifyWorkoutStart(insert('user-9'), 'user-1', undefined)).toBe(true);
  });

  it('should not notify without a session or user id', () => {
    expect(shouldNotifyWorkoutStart({ eventType: 'INSERT', session: null }, 'user-1', members)).toBe(false);
    expect(
      shouldNotifyWorkoutStart({ eventType: 'INSERT', session: { status: 'in_progress' } }, 'user-1', undefined)
    ).toBe(false);
  });
});
