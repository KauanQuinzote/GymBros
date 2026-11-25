/**
 * @jest-environment jsdom
 */
import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useWorkout } from '../../workout';
import { RoutinesScreen } from '../screens/RoutinesScreen';
import { WorkoutRoutine } from '../../../shared/types';

jest.mock('../../workout', () => ({
  useWorkout: jest.fn(),
}));

jest.mock('../../../shared/components/HeaderBar', () => ({
  HeaderBar: () => null,
}));

jest.mock('../components/RoutinesHeader', () => ({
  RoutinesHeader: ({ onCreatePress }: { onCreatePress: () => void }) => {
    const React = require('react');
    return React.createElement('button', { onClick: onCreatePress }, 'Abrir criação');
  },
}));

jest.mock('lucide-react-native', () => ({
  Plus: () => null,
  X: () => null,
  Dumbbell: () => null,
  Play: () => null,
}));

const mockedUseWorkout = useWorkout as jest.MockedFunction<typeof useWorkout>;

const createWorkoutValue = (
  addRoutine: (title: string, targetMuscle: string) => Promise<WorkoutRoutine>,
  addExerciseToRoutine = jest.fn().mockResolvedValue(undefined)
) => ({
  activeSession: null,
  partnerActiveSession: null,
  currentSetLogs: [],
  partnerSetLogs: [],
  routines: [],
  startWorkout: jest.fn().mockResolvedValue(undefined),
  logSet: jest.fn().mockResolvedValue(undefined),
  finishWorkout: jest.fn().mockResolvedValue({ broPointsEarned: 0 }),
  cancelWorkout: jest.fn().mockResolvedValue(undefined),
  restTimerSeconds: 60,
  isTimerRunning: false,
  startRestTimer: jest.fn(),
  addRoutine,
  addExerciseToRoutine,
  getLastExerciseLog: jest.fn().mockResolvedValue(null),
});

describe('RoutinesScreen - criação de ficha', () => {
  let addRoutine: jest.Mock;
  let addExerciseToRoutine: jest.Mock;
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    addRoutine = jest.fn().mockResolvedValue({
      id: 'routine-1',
      title: 'Treino de Peito',
      target_muscle: 'Peito',
      created_by: 'profile-1',
      exercises: [],
    });
    addExerciseToRoutine = jest.fn().mockResolvedValue(undefined);
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    mockedUseWorkout.mockReturnValue(createWorkoutValue(addRoutine, addExerciseToRoutine));
  });

  it.each([
    ['', 'Peito'],
    ['   ', 'Peito'],
    ['Treino de Peito', ''],
    ['Treino de Peito', '   '],
  ])('não cria a ficha quando nome ou grupo muscular está vazio', (title, target) => {
    render(<RoutinesScreen onStartWorkout={jest.fn()} />);

    fireEvent.click(screen.getByText('Abrir criação'));
    fireEvent.change(screen.getByPlaceholderText('Ex: Treino de Braço Monstro'), {
      target: { value: title },
    });
    fireEvent.change(screen.getByPlaceholderText('Ex: Bíceps e Tríceps'), {
      target: { value: target },
    });
    fireEvent.click(screen.getByText('CRIAR FICHA'));

    expect(alertSpy).toHaveBeenCalledWith(
      'Campos Obrigatórios',
      'Por favor, informe o nome da ficha e o grupo muscular alvo.'
    );
    expect(addRoutine).not.toHaveBeenCalled();
  });

  it('trim os campos, cria a ficha vazia e abre o modal para adicionar exercício', async () => {
    render(<RoutinesScreen onStartWorkout={jest.fn()} />);

    fireEvent.click(screen.getByText('Abrir criação'));
    fireEvent.change(screen.getByPlaceholderText('Ex: Treino de Braço Monstro'), {
      target: { value: '  Treino de Peito  ' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ex: Bíceps e Tríceps'), {
      target: { value: '  Peito  ' },
    });
    fireEvent.click(screen.getByText('CRIAR FICHA'));

    await waitFor(() => {
      expect(addRoutine).toHaveBeenCalledWith('Treino de Peito', 'Peito');
    });
    expect(await screen.findByText('Ficha: Treino de Peito')).toBeTruthy();
  });

  it('envia os dados do exercício para a ficha recém-criada', async () => {
    render(<RoutinesScreen onStartWorkout={jest.fn()} />);

    fireEvent.click(screen.getByText('Abrir criação'));
    fireEvent.change(screen.getByPlaceholderText('Ex: Treino de Braço Monstro'), {
      target: { value: 'Treino de Peito' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ex: Bíceps e Tríceps'), {
      target: { value: 'Peito' },
    });
    fireEvent.click(screen.getByText('CRIAR FICHA'));

    const exerciseName = await screen.findByPlaceholderText('Ex: Rosca Direta com Barra W');
    fireEvent.change(exerciseName, { target: { value: 'Supino reto' } });
    fireEvent.click(screen.getByText('SALVAR EXERCÍCIO'));

    await waitFor(() => {
      expect(addExerciseToRoutine).toHaveBeenCalledWith(
        'routine-1',
        'Supino reto',
        4,
        10,
        'Peito'
      );
    });
  });
});
