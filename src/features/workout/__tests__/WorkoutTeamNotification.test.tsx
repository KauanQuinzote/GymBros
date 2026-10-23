/**
 * @jest-environment jsdom
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { WorkoutProvider, useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../../auth/context/AuthContext';
import { NotificationService } from '../../../shared/services/notifications';
import { WorkoutRoutine } from '../../../shared/types';

jest.mock('../../auth/context/AuthContext');
jest.mock('../../../shared/services/notifications');
jest.mock('../../../shared/services/supabaseClient', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));
jest.mock('../../../shared/services/storage', () => ({
  LocalStorageService: {
    getRoutines: jest.fn().mockResolvedValue([]),
    saveSession: jest.fn().mockResolvedValue(true),
    saveSetLog: jest.fn().mockResolvedValue(true),
    getLastExerciseLog: jest.fn().mockResolvedValue(null),
  },
}));

describe('WorkoutContext - Team Workout Start & Tracking Presence (TDD)', () => {
  const mockTrackPresenceStatus = jest.fn().mockResolvedValue(undefined);
  const mockAddBroPoints = jest.fn().mockResolvedValue(undefined);
  const mockIncrementStreak = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      activeProfile: {
        id: 'user-1',
        name: 'Kauan',
        initials: 'KQ',
        avatar_color: '#0A84FF',
        pin_code: '1234',
        bro_points: 100,
        streak: 1,
      },
      partnerProfile: null,
      profiles: [
        { id: 'user-1', name: 'Kauan' },
        { id: 'user-2', name: 'Fábio' },
      ],
      trackPresenceStatus: mockTrackPresenceStatus,
      addBroPoints: mockAddBroPoints,
      incrementStreak: mockIncrementStreak,
    });
  });

  it('should initialize NotificationService on mount', () => {
    renderHook(() => useWorkout(), {
      wrapper: ({ children }) => <WorkoutProvider>{children}</WorkoutProvider>,
    });

    expect(NotificationService.init).toHaveBeenCalled();
  });

  it('should update presence status to TRAINING when user starts workout', async () => {
    const { result } = renderHook(() => useWorkout(), {
      wrapper: ({ children }) => <WorkoutProvider>{children}</WorkoutProvider>,
    });

    const mockRoutine: WorkoutRoutine = {
      id: 'routine-peito',
      title: 'Peito e Tríceps',
      target_muscle: 'Peito',
      exercises: [{ id: 'ex-1', name: 'Supino Reto', defaultSets: 4, defaultReps: 10, targetMuscle: 'Peito' }],
    };

    await act(async () => {
      await result.current.startWorkout(mockRoutine);
    });

    expect(result.current.activeSession).toBeTruthy();
    expect(result.current.activeSession?.routine_name).toBe('Peito e Tríceps');
    expect(mockTrackPresenceStatus).toHaveBeenCalledWith('TRAINING', expect.objectContaining({
      routine_name: 'Peito e Tríceps',
      current_exercise: 'Supino Reto',
    }));
  });

  it('should return presence status to ONLINE when workout is completed', async () => {
    const { result } = renderHook(() => useWorkout(), {
      wrapper: ({ children }) => <WorkoutProvider>{children}</WorkoutProvider>,
    });

    const mockRoutine: WorkoutRoutine = {
      id: 'routine-peito',
      title: 'Peito e Tríceps',
      target_muscle: 'Peito',
      exercises: [{ id: 'ex-1', name: 'Supino Reto', defaultSets: 4, defaultReps: 10, targetMuscle: 'Peito' }],
    };

    await act(async () => {
      await result.current.startWorkout(mockRoutine);
    });

    await act(async () => {
      await result.current.finishWorkout();
    });

    expect(result.current.activeSession).toBeNull();
    expect(mockTrackPresenceStatus).toHaveBeenCalledWith('ONLINE');
  });

  it('should return presence status to ONLINE when workout is cancelled', async () => {
    const { result } = renderHook(() => useWorkout(), {
      wrapper: ({ children }) => <WorkoutProvider>{children}</WorkoutProvider>,
    });

    const mockRoutine: WorkoutRoutine = {
      id: 'routine-peito',
      title: 'Peito e Tríceps',
      target_muscle: 'Peito',
      exercises: [{ id: 'ex-1', name: 'Supino Reto', defaultSets: 4, defaultReps: 10, targetMuscle: 'Peito' }],
    };

    await act(async () => {
      await result.current.startWorkout(mockRoutine);
    });

    await act(async () => {
      await result.current.cancelWorkout();
    });

    expect(result.current.activeSession).toBeNull();
    expect(mockTrackPresenceStatus).toHaveBeenCalledWith('ONLINE');
  });
});
