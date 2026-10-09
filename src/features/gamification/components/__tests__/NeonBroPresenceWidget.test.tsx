/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NeonBroPresenceWidget } from '../NeonBroPresenceWidget';
import { useAuth, BroPresenceState } from '../../../auth/context/AuthContext';
import { useWorkout } from '../../../workout/context/WorkoutContext';

jest.mock('../../../auth/context/AuthContext');
jest.mock('../../../workout/context/WorkoutContext');
jest.mock('lucide-react-native', () => ({
  Activity: () => null,
  Dumbbell: () => null,
  UserCheck: () => null,
  Zap: () => null,
  Wifi: () => null,
  Users: () => null,
  X: () => null,
  Flame: () => null,
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedUseWorkout = useWorkout as jest.MockedFunction<typeof useWorkout>;

describe('NeonBroPresenceWidget (Stories Inline Community Presence)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseWorkout.mockReturnValue({
      activeSession: null,
      partnerActiveSession: null,
      routines: [],
      startWorkout: jest.fn(),
      finishWorkout: jest.fn(),
      cancelWorkout: jest.fn(),
      logExerciseSet: jest.fn(),
    } as any);
  });

  it('should render other community bros with respective status badges and exclude current logged in user', () => {
    const mockProfiles = [
      { id: 'user-1', name: 'Kauan Quinzote', initials: 'KQ', avatar_color: '#00F0FF', pin_code: '1234', bro_points: 100, streak: 3 },
      { id: 'bro-2', name: 'Lucas Bro', initials: 'LB', avatar_color: '#0A84FF', pin_code: '0000', bro_points: 50, streak: 1 },
      { id: 'bro-3', name: 'Matheus Fit', initials: 'MF', avatar_color: '#00FF66', pin_code: '1111', bro_points: 200, streak: 5 },
    ];

    const mockOnlineBros: BroPresenceState[] = [
      {
        user_id: 'bro-2',
        user_name: 'Lucas Bro',
        initials: 'LB',
        avatar_color: '#0A84FF',
        status: 'ONLINE',
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 'bro-3',
        user_name: 'Matheus Fit',
        initials: 'MF',
        avatar_color: '#00FF66',
        status: 'TRAINING',
        routine_name: 'Leg Day Monstro',
        current_exercise: 'Agachamento Livre',
        current_weight_kg: 140,
        current_set: 3,
        updated_at: new Date().toISOString(),
      },
    ];

    mockedUseAuth.mockReturnValue({
      activeProfile: mockProfiles[0],
      partnerProfile: null,
      profiles: mockProfiles,
      isPartnerOnline: false,
      partnerStatus: 'OFFLINE',
      onlineBros: mockOnlineBros,
      loginWithPin: jest.fn(),
      logout: jest.fn(),
      addBroPoints: jest.fn(),
      incrementStreak: jest.fn(),
      registerProfile: jest.fn(),
      loadProfiles: jest.fn(),
      isLoading: false,
    });

    render(<NeonBroPresenceWidget />);

    expect(screen.getByText('COMUNIDADE DOS BROS')).toBeTruthy();
    expect(screen.getByText(/ATIVOS/i)).toBeTruthy();

    // Verifica que o próprio usuário NÃO aparece no carrossel de outros bros
    expect(screen.queryByText('Kauan')).toBeNull();

    // Verifica que os outros membros aparecem no widget
    expect(screen.getByText('Lucas')).toBeTruthy();
    expect(screen.getByText('Matheus')).toBeTruthy();

    // Verifica os badges
    expect(screen.getAllByText('ON').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('TREINANDO')).toBeTruthy();
  });

  it('should open telemetry modal with full workout details when clicking a training bro avatar', () => {
    const mockProfiles = [
      { id: 'user-1', name: 'Kauan Quinzote', initials: 'KQ', avatar_color: '#00F0FF', pin_code: '1234', bro_points: 100, streak: 3 },
      { id: 'bro-3', name: 'Matheus Fit', initials: 'MF', avatar_color: '#00FF66', pin_code: '1111', bro_points: 200, streak: 5 },
    ];

    const mockTrainingBro: BroPresenceState = {
      user_id: 'bro-3',
      user_name: 'Matheus Fit',
      initials: 'MF',
      avatar_color: '#00FF66',
      status: 'TRAINING',
      routine_name: 'Leg Day Monstro',
      current_exercise: 'Agachamento Livre',
      current_weight_kg: 140,
      current_set: 3,
      updated_at: new Date().toISOString(),
    };

    mockedUseAuth.mockReturnValue({
      activeProfile: mockProfiles[0],
      partnerProfile: null,
      profiles: mockProfiles,
      isPartnerOnline: true,
      partnerStatus: 'TRAINING',
      onlineBros: [mockTrainingBro],
      loginWithPin: jest.fn(),
      logout: jest.fn(),
      addBroPoints: jest.fn(),
      incrementStreak: jest.fn(),
      registerProfile: jest.fn(),
      loadProfiles: jest.fn(),
      isLoading: false,
    });

    render(<NeonBroPresenceWidget />);

    // Clica no avatar do Matheus
    const matheusAvatar = screen.getByText('Matheus');
    fireEvent.click(matheusAvatar);

    // O modal deve exibir a telemetria do treino
    expect(screen.getByText('Treinando Agora')).toBeTruthy();
    expect(screen.getByText(/Leg Day Monstro/i)).toBeTruthy();
    expect(screen.getByText(/Agachamento Livre/i)).toBeTruthy();
    expect(screen.getByText(/140 kg/i)).toBeTruthy();
  });
});
