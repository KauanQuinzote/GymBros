import React from 'react';
import { View, Text } from 'react-native';
import { BroPresenceState } from '../../auth/context/AuthContext';
import { Activity, Dumbbell, UserCheck, Zap } from 'lucide-react-native';

interface BroPresenceCardProps {
  bro: BroPresenceState;
}

export const BroPresenceCard: React.FC<BroPresenceCardProps> = ({ bro }) => {
  const isTraining = bro.status === 'TRAINING';
  const isOnline = bro.status === 'ONLINE' || isTraining;

  return (
    <View
      className={`rounded-2xl p-4 my-2 border ${
        isTraining
          ? 'bg-emerald-950/50 border-emerald-500/50 shadow-emerald-500/30'
          : isOnline
          ? 'bg-cyan-950/50 border-cyan-400/40 shadow-cyan-500/30'
          : 'bg-slate-900 border-slate-800'
      }`}
    >
      <View className="flex-row justify-between items-center">
        {/* Informações do Bro */}
        <View className="flex-row items-center gap-3">
          <View
            style={{ backgroundColor: bro.avatar_color || (isTraining ? '#00FF66' : '#00F0FF') }}
            className="w-10 h-10 rounded-full justify-center items-center shadow-lg"
          >
            <Text className="text-slate-950 text-sm font-extrabold">{bro.initials}</Text>
          </View>
          <View>
            <Text className="text-slate-50 text-base font-bold">{bro.user_name}</Text>
            <Text className="text-slate-400 text-xs font-medium">Parceiro de Treino</Text>
          </View>
        </View>

        {/* Badges Neon de Status */}
        {isTraining ? (
          <View className="flex-row items-center bg-emerald-500/15 px-3 py-1.5 rounded-xl gap-2 border border-emerald-500/40">
            <View className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <Text className="text-emerald-400 text-[11px] font-extrabold tracking-wider">
              TREINANDO AGORA
            </Text>
          </View>
        ) : isOnline ? (
          <View className="flex-row items-center bg-cyan-400/15 px-3 py-1.5 rounded-xl gap-2 border border-cyan-400/40">
            <View className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <Text className="text-cyan-400 text-[11px] font-extrabold tracking-wider">
              ONLINE NO APP
            </Text>
          </View>
        ) : (
          <View className="bg-slate-800 px-3 py-1.5 rounded-xl">
            <Text className="text-slate-400 text-[11px] font-semibold">OFFLINE</Text>
          </View>
        )}
      </View>

      {/* Telemetria do Treino ou Navegação */}
      {isTraining ? (
        <View className="mt-3.5 pt-3.5 border-t border-emerald-500/20 gap-2">
          {bro.routine_name ? (
            <View className="flex-row items-center gap-2">
              <Dumbbell color="#00FF66" size={16} />
              <Text className="text-slate-300 text-xs">
                Treino: <Text className="font-extrabold text-slate-50">{bro.routine_name}</Text>
              </Text>
            </View>
          ) : null}

          {bro.current_exercise ? (
            <View className="flex-row items-center gap-2">
              <Activity color="#00F0FF" size={16} />
              <Text className="text-slate-300 text-xs">
                Exercício: <Text className="font-extrabold text-slate-50">{bro.current_exercise}</Text>
              </Text>
            </View>
          ) : null}

          {bro.current_weight_kg ? (
            <View className="flex-row items-center gap-2 bg-emerald-500/10 px-2.5 py-1 rounded-lg self-start">
              <Zap color="#FFD60A" size={14} />
              <Text className="text-amber-400 text-xs font-bold">
                Carga: {bro.current_weight_kg} kg {bro.current_set ? `• Série ${bro.current_set}` : ''}
              </Text>
            </View>
          ) : null}
        </View>
      ) : isOnline ? (
        <View className="mt-3 pt-3 border-t border-cyan-400/20 flex-row items-center gap-2">
          <UserCheck color="#00F0FF" size={16} />
          <Text className="text-slate-300 text-xs font-medium">
            Seu bro está ativo e navegando no app agora!
          </Text>
        </View>
      ) : null}
    </View>
  );
};
