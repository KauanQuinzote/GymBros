import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChillingNudgeLog } from '../types';
import { useAuth } from '../../auth/context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../../shared/services/supabaseClient';

const NUDGES_STORAGE_KEY = '@gymbros_nudges_history';

interface ChillingContextType {
  nudgeHistory: ChillingNudgeLog[];
  activeIncomingNudge: ChillingNudgeLog | null;
  sendNudge: (text: string, category: any, audioUrl?: string, recipientId?: string | null) => Promise<void>;
  dismissIncomingNudge: () => Promise<void>;
}

const ChillingContext = createContext<ChillingContextType>({} as ChillingContextType);

export const ChillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeProfile, partnerProfile, profiles } = useAuth();
  const [nudgeHistory, setNudgeHistory] = useState<ChillingNudgeLog[]>([]);
  const [activeIncomingNudge, setActiveIncomingNudge] = useState<ChillingNudgeLog | null>(null);

  useEffect(() => {
    loadNudgeHistory();
  }, []);

  const loadNudgeHistory = async () => {
    try {
      const data = await AsyncStorage.getItem(NUDGES_STORAGE_KEY);
      if (data) {
        setNudgeHistory(JSON.parse(data));
      }
    } catch (e) {
      console.warn('Error loading nudges:', e);
    }
  };

  const checkedProfileIdRef = React.useRef<string | null>(null);

  // Buscar provocações pendentes (não exibidas) enviadas enquanto esteve offline
  useEffect(() => {
    if (!activeProfile) {
      checkedProfileIdRef.current = null;
      return;
    }

    // Executa a busca de pendentes apenas uma vez por login/troca de perfil (evita re-execução em ganho de pontos/treino)
    if (checkedProfileIdRef.current === activeProfile.id) {
      return;
    }
    checkedProfileIdRef.current = activeProfile.id;

    const fetchPendingUnreadNudges = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('nudges')
            .select('*')
            .or(`receiver_id.eq.${activeProfile.id},receiver_id.eq.ALL`)
            .or('exhibited.is.null,exhibited.eq.false')
            .is('read_at', null)
            .order('created_at', { ascending: true });

          if (!error && data && data.length > 0) {
            const pendingNudge = data[0] as ChillingNudgeLog;
            setActiveIncomingNudge(pendingNudge);

            // Marca imediatamente no banco como exibido (exhibited = true) para não repetir
            await supabase
              .from('nudges')
              .update({ exhibited: true })
              .eq('id', pendingNudge.id);
          }
        } catch (err) {
          console.warn('Error fetching pending nudges from Supabase:', err);
        }
      }
    };

    fetchPendingUnreadNudges();
  }, [activeProfile?.id]);

  // Listener de Tempo Real via Supabase Realtime WebSocket ('bro_nudges')
  useEffect(() => {
    if (!activeProfile) return;

    let nudgeChannel: any = null;

    if (isSupabaseConfigured && supabase) {
      nudgeChannel = supabase.channel('bro_nudges');

      nudgeChannel
        .on('broadcast', { event: 'nudge_event' }, (payload: any) => {
          const incoming = payload.payload as ChillingNudgeLog;
          if (
            incoming &&
            (incoming.receiver_id === activeProfile.id || incoming.receiver_id === 'ALL') &&
            incoming.sender_id !== activeProfile.id
          ) {
            setActiveIncomingNudge(incoming);
            setNudgeHistory((prev) => [incoming, ...prev]);
            saveHistoryToStorage([incoming, ...nudgeHistory]);
          }
        })
        .subscribe();
    }

    return () => {
      if (nudgeChannel && supabase) {
        supabase.removeChannel(nudgeChannel);
      }
    };
  }, [activeProfile, nudgeHistory]);

  const saveHistoryToStorage = async (history: ChillingNudgeLog[]) => {
    try {
      await AsyncStorage.setItem(NUDGES_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Error saving nudges:', e);
    }
  };

  const sendNudge = async (
    text: string,
    category: any,
    audioUrl?: string,
    recipientId?: string | null
  ) => {
    if (!activeProfile) return;

    // Se recipientId for null, envia como broadcast para 'ALL' ou para o partner
    const targetReceiverId =
      recipientId !== undefined
        ? recipientId || 'ALL'
        : partnerProfile?.id || 'ALL';

    const newNudge: ChillingNudgeLog = {
      id: `nudge_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sender_id: activeProfile.id,
      sender_name: activeProfile.name,
      sender_initials: activeProfile.initials,
      receiver_id: targetReceiverId,
      nudge_text: text,
      category,
      audio_url: audioUrl || null,
      exhibited: false,
      read_at: null,
      created_at: new Date().toISOString(),
    };

    const updatedHistory = [newNudge, ...nudgeHistory];
    setNudgeHistory(updatedHistory);
    await saveHistoryToStorage(updatedHistory);

    if (isSupabaseConfigured && supabase) {
      try {
        // 1. Transmitir via Realtime WebSocket para entrega instantânea
        const nudgeChannel = supabase.channel('bro_nudges');
        await nudgeChannel.send({
          type: 'broadcast',
          event: 'nudge_event',
          payload: newNudge,
        });

        // 2. Persistir no Postgres para entrega assíncrona
        await supabase.from('nudges').insert([
          {
            id: newNudge.id,
            sender_id: newNudge.sender_id,
            sender_name: newNudge.sender_name,
            sender_initials: newNudge.sender_initials,
            receiver_id: newNudge.receiver_id,
            nudge_text: newNudge.nudge_text,
            category: newNudge.category,
            audio_url: newNudge.audio_url,
            exhibited: false,
            read_at: null,
            created_at: newNudge.created_at,
          },
        ]);
      } catch (err) {
        console.warn('Error sending realtime nudge to Supabase:', err);
      }
    }
  };

  const dismissIncomingNudge = async () => {
    if (activeIncomingNudge && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('nudges')
          .update({ read_at: new Date().toISOString() })
          .eq('id', activeIncomingNudge.id);
      } catch (err) {
        console.warn('Error updating nudge read_at status:', err);
      }
    }
    setActiveIncomingNudge(null);
  };

  return (
    <ChillingContext.Provider
      value={{
        nudgeHistory,
        activeIncomingNudge,
        sendNudge,
        dismissIncomingNudge,
      }}
    >
      {children}
    </ChillingContext.Provider>
  );
};

export const useChilling = () => useContext(ChillingContext);

// Aliases para retrocompatibilidade
export const BromanceProvider = ChillingProvider;
export const useBromance = useChilling;

