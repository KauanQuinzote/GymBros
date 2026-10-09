import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BroPresenceState } from '../../auth/context/AuthContext';

interface BroPresenceCardProps {
  bro: BroPresenceState;
  onPress?: () => void;
  isCurrentUser?: boolean;
}

export const BroPresenceCard: React.FC<BroPresenceCardProps> = ({
  bro,
  onPress,
  isCurrentUser = false,
}) => {
  const isTraining = bro.status === 'TRAINING';
  const isOnline = bro.status === 'ONLINE' || isTraining;

  const ringBorderClass = isTraining
    ? 'border-2 border-emerald-500 shadow-emerald-500/40'
    : isOnline
    ? 'border-2 border-cyan-400 shadow-cyan-500/40'
    : 'border border-slate-800 opacity-60';

  const badgeBgClass = isTraining
    ? 'bg-emerald-500'
    : isOnline
    ? 'bg-cyan-400'
    : 'bg-slate-700';

  const badgeText = isTraining ? 'TREINANDO' : isOnline ? 'ON' : 'OFF';
  const badgeTextColor = isTraining || isOnline ? 'text-slate-950 font-black' : 'text-slate-300 font-bold';

  return (
    <TouchableOpacity
      className="items-center w-[74px] gap-1.5"
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Container do Avatar com Borda Neon e Badge de Status */}
      <View className="relative">
        <View
          className={`w-14 h-14 rounded-full justify-center items-center p-0.5 ${ringBorderClass}`}
        >
          <View
            style={{ backgroundColor: bro.avatar_color || '#0A84FF' }}
            className="w-full h-full rounded-full justify-center items-center"
          >
            <Text className="text-white text-sm font-extrabold tracking-tight">
              {bro.initials}
            </Text>
          </View>
        </View>

        {/* Micro-Badge no Canto Inferior */}
        <View
          className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full border border-slate-950 items-center justify-center ${badgeBgClass}`}
        >
          <Text className={`text-[8px] uppercase tracking-wider ${badgeTextColor}`}>
            {badgeText}
          </Text>
        </View>
      </View>

      {/* Nome do Bro */}
      <View className="items-center">
        <Text
          className={`text-xs font-bold text-center ${
            isTraining ? 'text-emerald-400' : isOnline ? 'text-slate-100' : 'text-slate-400'
          }`}
          numberOfLines={1}
        >
          {bro.user_name.split(' ')[0]}
        </Text>
        {isCurrentUser && (
          <Text className="text-slate-500 text-[9px] font-semibold">(Você)</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
