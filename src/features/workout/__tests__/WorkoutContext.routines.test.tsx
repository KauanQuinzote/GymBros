/**
 * @jest-environment jsdom
 */
import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { WorkoutProvider, useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../../auth/context/AuthContext';
import { LocalStorageService } from '../../../shared/services/storage';
import { BroProfile, WorkoutRoutine } from '../../../shared/types';

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
    addRoutine: jest.fn().mockResolvedValue(undefined),
    updateRoutine: jest.fn().mockResolvedValue(undefined),
    getLastExerciseLog: jest.fn().mockResolvedValue(null),
  },
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const profile: BroProfile = {
  id: 'profile-1',
  name: 'Kauan',
  initials: 'K',
  avatar_color: '#0A84FF',
  pin_code: '1234',
  bro_points: 100,
  streak: 1,
};

describe('WorkoutContext - criação de ficha', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(LocalStorageService.getRoutines).mockResolvedValue([]);
    jest.mocked(LocalStorageService.addRoutine).mockResolvedValue(undefined);
    jest.mocked(LocalStorageService.updateRoutine).mockResolvedValue(undefined);
    mockedUseAuth.mockReturnValue({
      activeProfile: profile,
      partnerProfile: null,
      profiles: [profile],
      isPartnerOnline: false,
      partnerStatus: 'OFFLINE',
      onlineBros: [],
      loginWithPin: jest.fn(),
      logout: jest.fn(),
      addBroPoints: jest.fn().mockResolvedValue(undefined),
      incrementStreak: jest.fn().mockResolvedValue(undefined),
      registerProfile: jest.fn().mockResolvedValue(profile),
      loadProfiles: jest.fn().mockResolvedValue(undefined),
      trackPresenceStatus: jest.fn().mockResolvedValue(undefined),
      setPresenceScope: jest.fn(),
      isLoading: false,
    });
  });

  it('associa a ficha ao perfil ativo e persiste uma ficha inicialmente sem exercícios', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WorkoutProvider>{children}</WorkoutProvider>
    );
    const { result } = renderHook(() => useWorkout(), { wrapper });

    await waitFor(() => {
      expect(LocalStorageService.getRoutines).toHaveBeenCalledWith(profile.id);
    });

    let createdRoutine;
    await act(async () => {
      createdRoutine = await result.current.addRoutine('Treino de Peito', 'Peito');
    });

    expect(createdRoutine).toEqual(
      expect.objectContaining({
        title: 'Treino de Peito',
        target_muscle: 'Peito',
        created_by: profile.id,
        exercises: [],
      })
    );
    expect(result.current.routines).toContainEqual(createdRoutine);
    expect(LocalStorageService.addRoutine).toHaveBeenCalledWith(createdRoutine);
  });

  it('adiciona o exercício à ficha existente e persiste a ficha atualizada', async () => {
    const routine: WorkoutRoutine = {
      id: 'routine-1',
      title: 'Treino de Peito',
      target_muscle: 'Peito',
      created_by: profile.id,
      exercises: [],
    };
    jest.mocked(LocalStorageService.getRoutines).mockResolvedValue([routine]);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WorkoutProvider>{children}</WorkoutProvider>
    );
    const { result } = renderHook(() => useWorkout(), { wrapper });

    await waitFor(() => {
      expect(result.current.routines).toEqual([routine]);
    });

    await act(async () => {
      await result.current.addExerciseToRoutine(routine.id, 'Supino reto', 4, 10, '');
    });

    const updatedRoutine = result.current.routines[0];
    expect(updatedRoutine).toEqual(
      expect.objectContaining({
        ...routine,
        exercises: [
          expect.objectContaining({
            name: 'Supino reto',
            defaultSets: 4,
            defaultReps: 10,
            targetMuscle: 'Peito',
          }),
        ],
      })
    );
    expect(LocalStorageService.updateRoutine).toHaveBeenCalledWith(updatedRoutine);
  });
});
