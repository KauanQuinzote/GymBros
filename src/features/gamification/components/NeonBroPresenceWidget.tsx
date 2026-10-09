import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuth, BroPresenceState } from '../../auth/context/AuthContext';
import { BroPresenceCard } from './BroPresenceCard';
import { BroTelemetryModal } from './BroTelemetryModal';
import { Users } from 'lucide-react-native';

interface NeonBroPresenceWidgetProps {
  onNavigateToChilling?: () => void;
}

export const NeonBroPresenceWidget: React.FC<NeonBroPresenceWidgetProps> = ({
  onNavigateToChilling,
}) => {
  const { profiles, onlineBros, activeProfile, partnerProfile, isPartnerOnline, partnerStatus } = useAuth();
  const [selectedBro, setSelectedBro] = useState<BroPresenceState | null>(null);

  // Filtra outros perfis da comunidade (ignora o próprio usuário logado)
  const otherProfiles = profiles.filter((p) => p.id !== activeProfile?.id);

  const communityBros: BroPresenceState[] = otherProfiles.map((p) => {
    const livePresence = onlineBros.find((b) => b.user_id === p.id);
    if (livePresence) return livePresence;

    if (partnerProfile && partnerProfile.id === p.id && isPartnerOnline) {
      return {
        user_id: p.id,
        user_name: p.name,
        initials: p.initials,
        avatar_color: p.avatar_color,
        status: partnerStatus,
        updated_at: new Date().toISOString(),
      };
    }

    return {
      user_id: p.id,
      user_name: p.name,
      initials: p.initials,
      avatar_color: p.avatar_color,
      status: 'OFFLINE',
      updated_at: p.last_workout_date || new Date().toISOString(),
    };
  });

  // Ordena: Treinando primeiro, depois Online, depois Offline
  communityBros.sort((a, b) => {
    const rank = (s: string) => (s === 'TRAINING' ? 3 : s === 'ONLINE' ? 2 : 1);
    return rank(b.status) - rank(a.status);
  });

  const activeCount = communityBros.filter((b) => b.status === 'ONLINE' || b.status === 'TRAINING').length;

  if (otherProfiles.length === 0) {
    return null;
  }

  return (
    <View className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mx-5 my-2.5">
      {/* Header do Widget */}
      <View className="flex-row justify-between items-center mb-3.5">
        <View className="flex-row items-center gap-2">
          <Users className="text-cyan-400" size={18} />
          <Text className="text-slate-100 text-sm font-extrabold uppercase tracking-wider">
            COMUNIDADE DOS BROS
          </Text>
        </View>
        <View className="bg-cyan-400/20 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
          <Text className="text-cyan-400 text-xs font-black">{activeCount} Monstro(s)</Text>
        </View>
      </View>

      {/* Carrossel / Linha Horizontal dos Bros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingVertical: 2 }}
      >
        {communityBros.map((bro) => (
          <BroPresenceCard
            key={bro.user_id}
            bro={bro}
            onPress={() => setSelectedBro(bro)}
          />
        ))}
      </ScrollView>

      {/* Modal de Telemetria e Detalhes ao Tocar no Bro */}
      <BroTelemetryModal
        bro={selectedBro}
        onClose={() => setSelectedBro(null)}
        onSendNudge={() => {
          setSelectedBro(null);
          if (onNavigateToChilling) onNavigateToChilling();
        }}
      />
    </View>
  );
};
