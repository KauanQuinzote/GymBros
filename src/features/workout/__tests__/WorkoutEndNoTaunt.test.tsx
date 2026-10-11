/**
 * @jest-environment jsdom
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { WorkoutProvider, useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../../auth/context/AuthContext';
import { AudioService } from '../../bromance/services/audioService';
import { SpeechService } from '../../bromance/services/speechService';
import { WorkoutRoutine } from '../../../shared/types';

jest.mock('../../auth/context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    activeProfile: {
      id: 'user-1',
      name: 'Kauan',
      initials: 'K',
      avatar_color: '#0A84FF',
      pin_code: '1234',
      bro_points: 100,
      streak: 1,
    },
    partnerProfile: null,
    addBroPoints: jest.fn().mockResolvedValue(undefined),
    incrementStreak: jest.fn().mockResolvedValue(undefined),
    trackPresenceStatus: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('../../bromance/services/audioService', () => ({
  AudioService: {
    playUrl: jest.fn().mockResolvedValue(true),
    stop: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock('../../bromance/services/speechService', () => ({
  SpeechService: {
    speak: jest.fn(),
    stop: jest.fn(),
  },
}));

jest.mock('../../../shared/services/supabaseClient', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

jest.mock('../../../shared/services/storage', () => ({
  LocalStorageService: {
    getProfiles: jest.fn().mockResolvedValue([
      { id: 'user-1', name: 'Kauan', is_online: true, is_training: false, bro_points: 100, streak_days: 1 },
    ]),
    saveProfiles: jest.fn().mockResolvedValue(true),
    getActiveProfileId: jest.fn().mockResolvedValue('user-1'),
    saveActiveProfileId: jest.fn().mockResolvedValue(true),
    getRoutines: jest.fn().mockResolvedValue([]),
    saveRoutines: jest.fn().mockResolvedValue(true),
    addRoutine: jest.fn().mockResolvedValue(true),
    getHistory: jest.fn().mockResolvedValue([]),
    saveSession: jest.fn().mockResolvedValue(true),
    saveSetLog: jest.fn().mockResolvedValue(true),
    getLastExerciseLog: jest.fn().mockResolvedValue(null),
  },
}));

describe('WorkoutEndTest (Issue #16 - Desacoplamento de Áudio/Nudges Sociais)', () => {
  const routine: WorkoutRoutine = {
    id: 'routine-test-1',
    title: 'Treino Peito Monstro',
    target_muscle: 'Peito',
    exercises: [
      {
        id: 'ex-1',
        name: 'Supino Reto',
        defaultSets: 4,
        defaultReps: 10,
        targetMuscle: 'Peito',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <WorkoutProvider>{children}</WorkoutProvider>
  );

  it('deve concluir o treino sem disparar nenhuma provocação ou evento sonoro automático', async () => {
    const { result } = renderHook(() => useWorkout(), { wrapper });

    // 1. Iniciar um treino
    await act(async () => {
      await result.current.startWorkout(routine);
    });

    expect(result.current.activeSession).toBeTruthy();
    expect(result.current.activeSession?.routine_name).toBe('Treino Peito Monstro');

    // 2. Registrar um set
    await act(async () => {
      await result.current.logSet('Supino Reto', 80, 10);
    });

    // 3. Finalizar o treino
    let finishResult: { broPointsEarned: number } = { broPointsEarned: 0 };
    await act(async () => {
      finishResult = await result.current.finishWorkout();
    });

    // Asserções de estado e pontos
    expect(finishResult.broPointsEarned).toBeGreaterThan(0);
    expect(result.current.activeSession).toBeNull();
    expect(result.current.currentSetLogs).toEqual([]);

    // Garantir que nenhum áudio ou voz foi disparado
    expect(AudioService.playUrl).not.toHaveBeenCalled();
    expect(SpeechService.speak).not.toHaveBeenCalled();
  });
});
