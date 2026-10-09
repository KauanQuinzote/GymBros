import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { BroPresenceState } from '../../auth/context/AuthContext';
import { Activity, Dumbbell, X, Zap, UserCheck, Flame } from 'lucide-react-native';

interface BroTelemetryModalProps {
  bro: BroPresenceState | null;
  onClose: () => void;
  onSendNudge?: (bro: BroPresenceState) => void;
}

export const BroTelemetryModal: React.FC<BroTelemetryModalProps> = ({
  bro,
  onClose,
  onSendNudge,
}) => {
  if (!bro) return null;

  const isTraining = bro.status === 'TRAINING';
  const isOnline = bro.status === 'ONLINE' || isTraining;

  return (
    <Modal visible={Boolean(bro)} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          {/* Header com Avatar e Fechar */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-row items-center gap-3">
              <View
                style={{ backgroundColor: bro.avatar_color || '#0A84FF' }}
                className="w-12 h-12 rounded-full justify-center items-center"
              >
                <Text className="text-white text-base font-bold">{bro.initials}</Text>
              </View>
              <View>
                <Text className="text-slate-50 text-lg font-bold">{bro.user_name}</Text>
                <Text className="text-slate-400 text-xs">
                  {isTraining ? 'Treinando Agora' : isOnline ? 'Online no App' : 'Offline'}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} className="p-1">
              <X className="text-slate-400" size={20} />
            </TouchableOpacity>
          </View>

          {/* Telemetria e Status */}
          {isTraining ? (
            <View className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 gap-2.5 my-2">
              <View className="flex-row items-center gap-2">
                <Dumbbell className="text-emerald-400" size={18} />
                <Text className="text-slate-200 text-xs flex-1">
                  Ficha: <Text className="font-extrabold text-white">{bro.routine_name || 'Treino Ativo'}</Text>
                </Text>
              </View>

              {bro.current_exercise && (
                <View className="flex-row items-center gap-2">
                  <Activity className="text-cyan-400" size={18} />
                  <Text className="text-slate-200 text-xs flex-1">
                    Exercício: <Text className="font-extrabold text-white">{bro.current_exercise}</Text>
                  </Text>
                </View>
              )}

              {bro.current_weight_kg && (
                <View className="flex-row items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-xl self-start">
                  <Zap className="text-amber-400" size={16} />
                  <Text className="text-amber-400 text-xs font-bold">
                    Carga Atual: {bro.current_weight_kg} kg {bro.current_set ? `• Série ${bro.current_set}` : ''}
                  </Text>
                </View>
              )}
            </View>
          ) : isOnline ? (
            <View className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex-row items-center gap-3 my-2">
              <UserCheck className="text-cyan-400" size={20} />
              <Text className="text-slate-300 text-xs flex-1">
                Seu bro está ativo e navegando no app agora mesmo.
              </Text>
            </View>
          ) : (
            <View className="bg-slate-950 border border-slate-800 rounded-2xl p-4 items-center my-2">
              <Text className="text-slate-400 text-xs">
                Este bro está offline no momento.
              </Text>
            </View>
          )}

          {/* Ações */}
          <View className="flex-row gap-3 mt-4">
            {onSendNudge && (
              <TouchableOpacity
                className="flex-1 bg-blue-600 py-3 rounded-xl flex-row justify-center items-center gap-2"
                onPress={() => {
                  onClose();
                  onSendNudge(bro);
                }}
                activeOpacity={0.8}
              >
                <Flame className="text-white" size={16} />
                <Text className="text-white font-bold text-xs">PROVOCAR BRO</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="px-5 bg-slate-800 py-3 rounded-xl justify-center items-center"
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text className="text-slate-300 font-semibold text-xs">Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
