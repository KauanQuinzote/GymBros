import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Award, Zap } from 'lucide-react-native';

interface WorkoutFinishModalProps {
  visible: boolean;
  earnedPoints: number;
  onConfirm: () => void;
}

export const WorkoutFinishModal: React.FC<WorkoutFinishModalProps> = ({
  visible,
  earnedPoints,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-slate-950/90 justify-center items-center p-5">
        <View className="bg-slate-900 rounded-3xl p-8 items-center w-full max-w-[320px] border border-amber-400">
          <View className="w-18 h-18 rounded-full bg-amber-400/15 justify-center items-center mb-4 p-4">
            <Award color="#FFD60A" size={40} />
          </View>
          <Text className="text-slate-50 text-2xl font-extrabold text-center">Treino Concluído</Text>
          <Text className="text-slate-400 text-sm mt-1 text-center">Seus dados e pontos foram atualizados.</Text>

          <View className="flex-row items-center bg-amber-400/15 border border-amber-400 px-4 py-2.5 rounded-2xl gap-2 my-5">
            <Zap color="#FFD60A" size={24} />
            <Text className="text-amber-400 text-lg font-extrabold">+{earnedPoints} Bro Points</Text>
          </View>

          <TouchableOpacity className="bg-emerald-500 w-full py-3.5 rounded-2xl items-center" onPress={onConfirm} activeOpacity={0.8}>
            <Text className="text-white font-bold text-sm">CONCLUIR & SALVAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
