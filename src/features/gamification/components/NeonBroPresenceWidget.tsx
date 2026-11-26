import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuth, BroPresenceState } from '../../auth/context/AuthContext';
import { BroPresenceCard } from './BroPresenceCard';
import { BroTelemetryModal } from './BroTelemetryModal';
import { buildCommunityBros } from './buildCommunityBros';
import { useCommunity, scopeToCommunity } from '../../communities';
import { Users } from 'lucide-react-native';

interface NeonBroPresenceWidgetProps {
  onNavigateToChilling?: () => void;
}

export const NeonBroPresenceWidget: React.FC<NeonBroPresenceWidgetProps> = ({
  onNavigateToChilling,
}) => {
  const { profiles, onlineBros, activeProfile, partnerProfile, isPartnerOnline, partnerStatus } = useAuth();
  const [selectedBro, setSelectedBro] = useState<BroPresenceState | null>(null);

  const { memberIds } = useCommunity();

  // Apenas membros da comunidade ativa, ignorando o próprio usuário logado
  const otherProfiles = scopeToCommunity(profiles, memberIds ?? null, (p) => p.id).filter(
    (p) => p.id !== activeProfile?.id
  );

  const communityBros = buildCommunityBros({
    profiles: otherProfiles,
    onlineBros,
    partnerProfile,
    isPartnerOnline,
    partnerStatus,
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
        style={{ overflow: 'visible' }}
        contentContainerStyle={{ gap: 14, paddingVertical: 8, paddingHorizontal: 4 }}
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
