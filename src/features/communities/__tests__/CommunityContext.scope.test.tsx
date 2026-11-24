/**
 * @jest-environment jsdom
 */
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { CommunityProvider, useCommunity } from '../context/CommunityContext';
import { InMemoryCommunityRepository } from '../repositories/InMemoryCommunityRepository';
import { useAuth } from '../../auth/context/AuthContext';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('../../auth/context/AuthContext');
jest.mock('../../../shared/services/supabaseClient', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

const setPresenceScope = jest.fn();

const renderWith = (repo: InMemoryCommunityRepository) =>
  renderHook(() => useCommunity(), {
    wrapper: ({ children }) => <CommunityProvider repository={repo}>{children}</CommunityProvider>,
  });

describe('CommunityContext - escopo de membros', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ activeProfile: { id: 'me' }, setPresenceScope });
  });

  it('sem comunidade, o escopo contem apenas o proprio bro', async () => {
    const { result } = renderWith(new InMemoryCommunityRepository());
    await waitFor(() => expect(result.current.isScopeReady).toBe(true));
    expect([...result.current.memberIds]).toEqual(['me']);
    expect(setPresenceScope).toHaveBeenLastCalledWith(null);
  });

  it('carrega os membros da comunidade ativa e define o canal de presenca', async () => {
    const repo = new InMemoryCommunityRepository();
    const created = await repo.create({ name: 'Bros do Ferro', created_by: 'me' });
    await repo.join({ invite_code: created.invite_code, user_id: 'bro-2' });

    const { result } = renderWith(repo);
    await waitFor(() => expect(result.current.isScopeReady).toBe(true));

    expect(new Set(result.current.memberIds)).toEqual(new Set(['me', 'bro-2']));
    expect(setPresenceScope).toHaveBeenLastCalledWith(created.id);
  });

  it('ao trocar de comunidade nunca expoe os membros da anterior', async () => {
    const repo = new InMemoryCommunityRepository();
    const a = await repo.create({ name: 'Alpha Bros', created_by: 'me' });
    await repo.join({ invite_code: a.invite_code, user_id: 'only-in-a' });
    const b = await repo.create({ name: 'Beta Bros', created_by: 'me' });
    await repo.join({ invite_code: b.invite_code, user_id: 'only-in-b' });

    const { result } = renderWith(repo);
    await waitFor(() => expect(result.current.isScopeReady).toBe(true));
    expect(result.current.activeCommunity?.id).toBe(a.id);

    await act(async () => {
      await result.current.selectCommunity(b.id);
    });
    // Imediatamente apos a troca, os membros de A nao podem estar no escopo
    expect(result.current.memberIds.has('only-in-a')).toBe(false);

    await waitFor(() => expect(result.current.memberIds.has('only-in-b')).toBe(true));
    expect(result.current.memberIds.has('only-in-a')).toBe(false);
  });
});
