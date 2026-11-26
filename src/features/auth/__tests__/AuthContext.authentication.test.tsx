/**
 * @jest-environment jsdom
 */
import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { LocalStorageService } from '../../../shared/services/storage';
import { BroProfile } from '../../../shared/types';

jest.mock('../../../shared/services/supabaseClient', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

jest.mock('../../../shared/services/storage', () => ({
  DEFAULT_PROFILES: [],
  LocalStorageService: {
    getProfiles: jest.fn().mockResolvedValue([]),
    saveProfiles: jest.fn().mockResolvedValue(undefined),
  },
}));

const profile: BroProfile = {
  id: 'profile-1',
  name: 'Ana Silva',
  initials: 'AS',
  avatar_color: '#0A84FF',
  pin_code: '1234',
  email: 'ana@example.com',
  bro_points: 20,
  streak: 2,
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext - autenticação e cadastro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(LocalStorageService.getProfiles).mockResolvedValue([profile]);
    jest.mocked(LocalStorageService.saveProfiles).mockResolvedValue(undefined);
  });

  it('autentica quando o perfil e o PIN correspondem', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let authenticated = false;
    act(() => {
      authenticated = result.current.loginWithPin(profile.id, '1234');
    });

    expect(authenticated).toBe(true);
    expect(result.current.activeProfile).toEqual(profile);
  });

  it.each([
    ['PIN incorreto', profile.id, '0000'],
    ['perfil inexistente', 'unknown-profile', '1234'],
  ])('recusa autenticação com %s', async (_case, profileId, pin) => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let authenticated = true;
    act(() => {
      authenticated = result.current.loginWithPin(profileId, pin);
    });

    expect(authenticated).toBe(false);
    expect(result.current.activeProfile).toBeNull();
  });

  it('cadastra o perfil com pontuação inicial zerada e salva a lista local', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let createdProfile: BroProfile | undefined;
    await act(async () => {
      createdProfile = await result.current.registerProfile({
        name: 'Bruno Costa',
        initials: 'BC',
        avatar_color: '#30D158',
        pin_code: '5678',
        email: 'bruno@example.com',
      });
    });

    expect(createdProfile).toEqual(
      expect.objectContaining({
        name: 'Bruno Costa',
        initials: 'BC',
        avatar_color: '#30D158',
        pin_code: '5678',
        email: 'bruno@example.com',
        bro_points: 0,
        streak: 0,
      })
    );
    expect(createdProfile?.id).toBeTruthy();
    expect(result.current.profiles).toContainEqual(createdProfile);
    expect(LocalStorageService.saveProfiles).toHaveBeenLastCalledWith(result.current.profiles);
  });
});
