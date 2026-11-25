/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./global.css', () => ({}));
jest.mock('./src/shared/utils/iconInterop', () => ({}));

jest.mock('./src/shared/services/supabaseClient', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

jest.mock('./src/shared/services/storage', () => ({
  DEFAULT_PROFILES: [],
  LocalStorageService: {
    getProfiles: jest.fn().mockResolvedValue([
      {
        id: 'profile-1',
        name: 'Ana Silva',
        initials: 'AS',
        avatar_color: '#0A84FF',
        pin_code: '1234',
        bro_points: 20,
        streak: 2,
      },
    ]),
    saveProfiles: jest.fn().mockResolvedValue(undefined),
    getRoutines: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock('./src/shared/services/notifications', () => ({
  NotificationService: {
    init: jest.fn(),
  },
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const SafeAreaProvider = ({ children }: { children: React.ReactNode }) => children;
  const SafeAreaView = ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children);
  return { SafeAreaProvider, SafeAreaView };
});

jest.mock('./src/features/workout', () => {
  const React = require('react');
  const WorkoutContext = React.createContext({ activeSession: null });

  return {
    WorkoutProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(WorkoutContext.Provider, {
        value: { activeSession: null },
        children,
      }),
    useWorkout: () => React.useContext(WorkoutContext),
    ActiveWorkoutScreen: () => null,
  };
});

jest.mock('./src/features/dashboard', () => {
  const React = require('react');
  return {
    HomeScreen: ({
      onNavigateToWorkout,
      onNavigateToRoutines,
      onNavigateToHistory,
      onNavigateToChilling,
    }: {
      onNavigateToWorkout: () => void;
      onNavigateToRoutines: () => void;
      onNavigateToHistory: () => void;
      onNavigateToChilling: () => void;
    }) =>
      React.createElement(
        'div',
        null,
        React.createElement('h1', null, 'Home principal'),
        React.createElement('button', { onClick: onNavigateToWorkout }, 'Atalho: Treinar'),
        React.createElement('button', { onClick: onNavigateToRoutines }, 'Atalho: Fichas'),
        React.createElement('button', { onClick: onNavigateToHistory }, 'Atalho: Histórico'),
        React.createElement('button', { onClick: onNavigateToChilling }, 'Atalho: Chilling')
      ),
  };
});

jest.mock('./src/features/routines', () => {
  const React = require('react');
  return {
    RoutinesScreen: ({ onStartWorkout }: { onStartWorkout: () => void }) =>
      React.createElement(
        'div',
        null,
        React.createElement('h1', null, 'Tela de fichas'),
        React.createElement('button', { onClick: onStartWorkout }, 'Começar ficha')
      ),
  };
});

jest.mock('./src/features/history', () => {
  const React = require('react');
  return {
    HistoryScreen: () => React.createElement('h1', null, 'Histórico e conquistas'),
  };
});

jest.mock('./src/features/chilling', () => ({
  ChillingProvider: ({ children }: { children: React.ReactNode }) => children,
  ChillingScreen: () => React.createElement('h1', null, 'Tela Chilling'),
  NudgeModal: () => null,
}));

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const Icon = () => null;
  return {
    Home: Icon,
    Dumbbell: Icon,
    Calendar: Icon,
    Award: Icon,
    Flame: Icon,
    ChevronRight: Icon,
    UserPlus: Icon,
    RefreshCw: Icon,
    Users: Icon,
    Delete: Icon,
    X: Icon,
  };
});

const enterPin = (digits: string[]) => {
  fireEvent.click(screen.getByText('Ana Silva'));
  digits.forEach((digit) => fireEvent.click(screen.getByText(digit)));
};

describe('App - navegação depois do PIN', () => {
  it('não entra na Home quando o PIN está incorreto', async () => {
    render(<App />);

    await screen.findByText('Ana Silva');
    enterPin(['0', '0', '0', '0']);

    expect(await screen.findByText('PIN incorreto. Tente novamente.')).toBeTruthy();
    expect(screen.queryByText('Home principal')).toBeNull();
  });

  it('abre a Home com PIN válido e navega pelas abas e atalhos', async () => {
    render(<App />);

    await screen.findByText('Ana Silva');
    enterPin(['1', '2', '3', '4']);

    expect(await screen.findByText('Home principal')).toBeTruthy();

    fireEvent.click(screen.getByText('Atalho: Fichas'));
    expect(await screen.findByText('Tela de fichas')).toBeTruthy();

    fireEvent.click(screen.getByText('Home'));
    fireEvent.click(screen.getByText('Atalho: Treinar'));
    expect(await screen.findByText('Tela de fichas')).toBeTruthy();

    fireEvent.click(screen.getByText('Home'));
    fireEvent.click(screen.getByText('Chilling'));
    expect(await screen.findByText('Tela Chilling')).toBeTruthy();

    fireEvent.click(screen.getByText('Conquistas'));
    expect(await screen.findByText('Histórico e conquistas')).toBeTruthy();

    fireEvent.click(screen.getByText('Home'));
    expect(await screen.findByText('Home principal')).toBeTruthy();

    fireEvent.click(screen.getByText('Atalho: Histórico'));
    expect(await screen.findByText('Histórico e conquistas')).toBeTruthy();

    fireEvent.click(screen.getByText('Home'));
    fireEvent.click(screen.getByText('Atalho: Chilling'));
    expect(await screen.findByText('Tela Chilling')).toBeTruthy();
  });
});
