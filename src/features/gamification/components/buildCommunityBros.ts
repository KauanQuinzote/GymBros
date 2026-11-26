import type { BroPresenceState } from '../../auth/context/AuthContext';
import type { BroProfile } from '../../../shared/types';

interface BuildCommunityBrosParams {
  profiles: BroProfile[];
  onlineBros: BroPresenceState[];
  partnerProfile: BroProfile | null;
  isPartnerOnline: boolean;
  partnerStatus: BroPresenceState['status'];
}

const statusRank = (s: string) => (s === 'TRAINING' ? 3 : s === 'ONLINE' ? 2 : 1);

/** Monta a presenca de cada bro, ordenando: Treinando, Online, Offline. */
export function buildCommunityBros({
  profiles,
  onlineBros,
  partnerProfile,
  isPartnerOnline,
  partnerStatus,
}: BuildCommunityBrosParams): BroPresenceState[] {
  const bros = profiles.map((p): BroPresenceState => {
    const livePresence = onlineBros.find((b) => b.user_id === p.id);
    if (livePresence) return livePresence;

    const base = {
      user_id: p.id,
      user_name: p.name,
      initials: p.initials,
      avatar_color: p.avatar_color,
    };

    if (partnerProfile && partnerProfile.id === p.id && isPartnerOnline) {
      return { ...base, status: partnerStatus, updated_at: new Date().toISOString() };
    }

    return { ...base, status: 'OFFLINE', updated_at: p.last_workout_date || new Date().toISOString() };
  });

  return bros.sort((a, b) => statusRank(b.status) - statusRank(a.status));
}
