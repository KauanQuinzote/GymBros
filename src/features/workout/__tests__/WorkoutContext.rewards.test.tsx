/**
 * @jest-environment jsdom
 */
import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { WorkoutProvider, useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../../auth/context/AuthContext';
import { LocalStorageService } from '../../../shared/services/storage';
import { WorkoutRoutine } from '../../../shared/types';

jest.mock('../../auth/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../shared/services/supabaseClient', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

jest.mock('../../../shared/services/notifications', () => ({
  NotificationService: {
    init: jest.fn(),
  },
}));

jest.mock('../../../shared/services/storage', () => ({
  LocalStorageService: {
    getRoutines: jest.fn().mockResolvedValue([]),
    saveSession: jest.fn().mockResolvedValue(undefined),
    saveSetLog: jest.fn().mockResolvedValue(undefined),
    getLastExerciseLog: jest.fn().mockResolvedValue(null),
  },
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const profile = {
  id: 'profile-1',
  name: 'Kauan',
  initials: 'K',
  avatar_color: '#0A84FF',
  pin_code: '1234',
  bro_points: 100,
  streak: 1,
};

const routine: WorkoutRoutine = {
  id: 'routine-1',
  title: 'Treino de Peito',
  target_muscle: 'Peito',
  exercises: [
    {
      id: 'exercise-1',
      name: 'Supino reto',
      defaultSets: 4,
      defaultReps: 10,
      targetMuscle: 'Peito',
    },
  ],
};

describe('WorkoutContext - pontuação do treino', () => {
  const addBroPoints = jest.fn().mockResolvedValue(undefined);
  const incrementStreak = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      activeProfile: profile,
      partnerProfile: null,
      profiles: [profile],
      isPartnerOnline: false,
      partnerStatus: 'OFFLINE',
      onlineBros: [],
      loginWithPin: jest.fn(),
      logout: jest.fn(),
      addBroPoints,
      incrementStreak,
      registerProfile: jest.fn().mockResolvedValue(profile),
      loadProfiles: jest.fn().mockResolvedValue(undefined),
      trackPresenceStatus: jest.fn().mockResolvedValue(undefined),
      isLoading: false,
    });
  });

  it('credita os pontos calculados ao finalizar mesmo com exercícios restantes', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WorkoutProvider>{children}</WorkoutProvider>
    );
    const { result } = renderHook(() => useWorkout(), { wrapper });

    await act(async () => {
      await result.current.startWorkout(routine);
    });
    await act(async () => {
      await result.current.logSet('Supino reto', 60, 10);
    });

    let finishResult = { broPointsEarned: 0 };
    await act(async () => {
      finishResult = await result.current.finishWorkout();
    });

    expect(finishResult.broPointsEarned).toBe(185);
    expect(addBroPoints).toHaveBeenCalledTimes(1);
    expect(addBroPoints).toHaveBeenCalledWith(185);
    expect(incrementStreak).toHaveBeenCalledTimes(1);
  });
});
