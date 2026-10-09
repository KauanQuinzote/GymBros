import React from 'react';
import { View, Text } from 'react-native';
import { useAuth, BroPresenceState } from '../../auth/context/AuthContext';
import { BroPresenceCard } from './BroPresenceCard';
import { Wifi, Users } from 'lucide-react-native';

export const NeonBroPresenceWidget: React.FC = () => {
  const { onlineBros, partnerProfile, isPartnerOnline, partnerStatus } = useAuth();

  let activeBrosList: BroPresenceState[] = [...onlineBros];

  // Fallback caso partnerProfile esteja ativo via AuthContext legado mas não esteja no array onlineBros
  if (activeBrosList.length === 0 && partnerProfile && isPartnerOnline) {
    activeBrosList.push({
      user_id: partnerProfile.id,
      user_name: partnerProfile.name,
      initials: partnerProfile.initials,
      avatar_color: partnerProfile.avatar_color,
      status: partnerStatus,
      updated_at: new Date().toISOString(),
    });
  }

  const activeCount = activeBrosList.length;

  if (activeCount === 0) {
    return (
      <View className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mx-5 my-2.5">
        <View className="flex-row items-center gap-2 mb-2">
          <Wifi className="text-slate-500" size={16} />
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            STATUS DOS BROS
          </Text>
        </View>
        <Text className="text-slate-400 text-xs font-normal">
          Nenhum bro ativo no momento. Inicie um treino para notificar seu grupo!
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mx-5 my-2.5">
      {/* Header do Widget */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center gap-2">
          <Users className="text-cyan-400" size={18} />
          <Text className="text-slate-100 text-sm font-extrabold uppercase tracking-wider">
            BROS ATIVOS
          </Text>
        </View>
        <View className="bg-cyan-400/20 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
          <Text className="text-cyan-400 text-xs font-black">{activeCount} ONLINE</Text>
        </View>
      </View>

      {/* Lista de Cards dos Bros */}
      {activeBrosList.map((bro) => (
        <BroPresenceCard key={bro.user_id} bro={bro} />
      ))}
    </View>
  );
};
