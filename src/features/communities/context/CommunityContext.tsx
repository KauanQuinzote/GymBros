import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../auth/context/AuthContext';
import { Community, CommunityMember } from '../types';
import { CommunityRepository } from '../repositories/CommunityRepository';
import { createCommunityRepository } from '../repositories';

const ACTIVE_COMMUNITY_KEY = '@gymbros_active_community';

export interface CommunityContextType {
  communities: Community[];
  activeCommunity: Community | null;
  members: CommunityMember[];
  /** Ids visiveis no escopo atual. Sem comunidade ativa, apenas o proprio bro. */
  memberIds: ReadonlySet<string>;
  /** true quando a lista de comunidades e os membros da comunidade ativa ja foram carregados. */
  isScopeReady: boolean;
  isLoading: boolean;
  selectCommunity: (communityId: string) => Promise<void>;
  createCommunity: (name: string, description?: string) => Promise<Community>;
  joinCommunity: (inviteCode: string) => Promise<Community>;
  leaveCommunity: (communityId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType>({} as CommunityContextType);

const activeKey = (profileId: string) => `${ACTIVE_COMMUNITY_KEY}_${profileId}`;

interface CommunityProviderProps {
  children: React.ReactNode;
  /** Injecao para testes; por padrao usa Supabase ou AsyncStorage. */
  repository?: CommunityRepository;
}

export const CommunityProvider: React.FC<CommunityProviderProps> = ({ children, repository }) => {
  const { activeProfile, setPresenceScope } = useAuth();
  const repo = useMemo(() => repository ?? createCommunityRepository(), [repository]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  /** Comunidade a que `members` pertence; evita usar a lista de outra comunidade durante a troca. */
  const [membersOf, setMembersOf] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const profileId = activeProfile?.id ?? null;

  const persistActive = useCallback(
    async (id: string | null) => {
      setActiveId(id);
      if (!profileId) return;
      try {
        if (id) await AsyncStorage.setItem(activeKey(profileId), id);
        else await AsyncStorage.removeItem(activeKey(profileId));
      } catch (e) {
        console.warn('Erro ao salvar comunidade ativa:', e);
      }
    },
    [profileId]
  );

  const refresh = useCallback(async () => {
    if (!profileId) {
      setCommunities([]);
      setActiveId(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const list = await repo.listForUser(profileId);
      setCommunities(list);
      let stored: string | null = null;
      try {
        stored = await AsyncStorage.getItem(activeKey(profileId));
      } catch {
        stored = null;
      }
      const next = list.find((c) => c.id === stored)?.id ?? list[0]?.id ?? null;
      setActiveId(next);
    } catch (e) {
      console.warn('Erro ao carregar comunidades:', e);
      setCommunities([]);
      setActiveId(null);
    } finally {
      setIsLoading(false);
    }
  }, [profileId, repo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;
    setMembers([]);
    setMembersOf(null);
    if (!activeId) return;
    repo
      .listMembers(activeId)
      .then((list) => {
        if (cancelled) return;
        setMembers(list);
        setMembersOf(activeId);
      })
      .catch((e) => console.warn('Erro ao carregar membros:', e));
    return () => {
      cancelled = true;
    };
  }, [activeId, repo]);

  useEffect(() => {
    setPresenceScope?.(activeId);
  }, [activeId, setPresenceScope]);

  const requireProfile = (): string => {
    if (!profileId) throw new Error('Nenhum bro logado');
    return profileId;
  };

  const createCommunity = async (name: string, description?: string) => {
    const created = await repo.create({ name, description, created_by: requireProfile() });
    await refresh();
    await persistActive(created.id);
    return created;
  };

  const joinCommunity = async (inviteCode: string) => {
    const joined = await repo.join({ invite_code: inviteCode, user_id: requireProfile() });
    await refresh();
    await persistActive(joined.id);
    return joined;
  };

  const leaveCommunity = async (communityId: string) => {
    await repo.leave(communityId, requireProfile());
    if (communityId === activeId) await persistActive(null);
    await refresh();
  };

  const selectCommunity = async (communityId: string) => {
    if (communities.some((c) => c.id === communityId)) await persistActive(communityId);
  };

  const activeCommunity = communities.find((c) => c.id === activeId) ?? null;

  const membersLoaded = Boolean(activeCommunity) && membersOf === activeCommunity?.id;
  const isScopeReady = !isLoading && (!activeCommunity || membersLoaded);

  // Sem comunidade (ou enquanto os membros carregam) o escopo e apenas o proprio bro:
  // nunca expomos a lista de outra comunidade (ADR 006).
  const memberIds = useMemo<ReadonlySet<string>>(() => {
    const ids = new Set<string>(profileId ? [profileId] : []);
    if (membersLoaded) members.forEach((m) => ids.add(m.user_id));
    return ids;
  }, [membersLoaded, members, profileId]);

  return (
    <CommunityContext.Provider
      value={{
        communities,
        activeCommunity,
        members,
        memberIds,
        isScopeReady,
        isLoading,
        selectCommunity,
        createCommunity,
        joinCommunity,
        leaveCommunity,
        refresh,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => useContext(CommunityContext);
