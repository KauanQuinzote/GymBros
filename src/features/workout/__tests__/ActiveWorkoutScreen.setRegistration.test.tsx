/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ActiveWorkoutScreen } from '../screens/ActiveWorkoutScreen';
import { useWorkout } from '../context/WorkoutContext';
import { WorkoutRoutine } from '../../../shared/types';

jest.mock('../context/WorkoutContext', () => ({
  useWorkout: jest.fn(),
}));

jest.mock('../components/RestTimerBar', () => ({
  RestTimerBar: () => null,
}));

jest.mock('../components/WorkoutFinishModal', () => ({
  WorkoutFinishModal: () => null,
}));

jest.mock('lucide-react-native', () => ({
  ArrowLeft: () => null,
  CheckCircle2: () => null,
  Dumbbell: () => null,
  Plus: () => null,
}));

const mockedUseWorkout = useWorkout as jest.MockedFunction<typeof useWorkout>;

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

describe('ActiveWorkoutScreen - registro de série', () => {
  const logSet = jest.fn().mockResolvedValue(undefined);
  const getLastExerciseLog = jest.fn().mockResolvedValue(null);

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseWorkout.mockReturnValue({
      activeSession: {
        id: 'session-1',
        user_id: 'profile-1',
        routine_id: routine.id,
        routine_name: routine.title,
        status: 'in_progress',
        current_exercise: 'Supino reto',
        current_set: 1,
        current_weight_kg: 0,
        bro_points_earned: 50,
        started_at: '2026-11-24T00:00:00.000Z',
      },
      partnerActiveSession: null,
      currentSetLogs: [],
      partnerSetLogs: [],
      routines: [routine],
      startWorkout: jest.fn().mockResolvedValue(undefined),
      logSet,
      finishWorkout: jest.fn().mockResolvedValue({ broPointsEarned: 150 }),
      cancelWorkout: jest.fn().mockResolvedValue(undefined),
      restTimerSeconds: 60,
      isTimerRunning: false,
      startRestTimer: jest.fn(),
      addRoutine: jest.fn().mockResolvedValue(routine),
      addExerciseToRoutine: jest.fn().mockResolvedValue(undefined),
      getLastExerciseLog,
    });
  });

  it('envia o exercício atual, a carga e as repetições ao registrar uma série válida', async () => {
    render(<ActiveWorkoutScreen onFinish={jest.fn()} />);

    await waitFor(() => {
      expect(getLastExerciseLog).toHaveBeenCalledWith('Supino reto');
    });

    fireEvent.change(screen.getByDisplayValue('20'), {
      target: { value: '82.5' },
    });
    fireEvent.change(screen.getByDisplayValue('10'), {
      target: { value: '8' },
    });
    fireEvent.click(screen.getByText('CONCLUIR SÉRIE (+10 pts)'));

    await waitFor(() => {
      expect(logSet).toHaveBeenCalledWith('Supino reto', 82.5, 8);
    });
  });
});
