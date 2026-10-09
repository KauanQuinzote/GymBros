import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dumbbell, Play } from 'lucide-react-native';
import { WorkoutRoutine } from '../../../shared/types';

interface QuickRoutinesListProps {
  routines: WorkoutRoutine[];
  onSeeAll: () => void;
  onStartRoutine: (routine: WorkoutRoutine) => void;
}

export const QuickRoutinesList: React.FC<QuickRoutinesListProps> = ({
  routines,
  onSeeAll,
  onStartRoutine,
}) => {
  return (
    <View>
      <View className="flex-row justify-between items-center px-5 mt-5 mb-3">
        <Text className="text-slate-50 text-lg font-bold tracking-tight">Iniciar Treino do Dia</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text className="text-blue-500 text-sm font-semibold">Ver Todas</Text>
        </TouchableOpacity>
      </View>

      <View className="px-5 gap-3.5">
        {routines.slice(0, 3).map((routine) => (
          <TouchableOpacity
            key={routine.id}
            className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
            onPress={() => onStartRoutine(routine)}
            activeOpacity={0.8}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Dumbbell className="text-blue-500" size={20} />
              <Text className="text-blue-500 text-xs font-semibold bg-blue-500/15 px-2.5 py-1 rounded-xl">
                {routine.target_muscle}
              </Text>
            </View>
            <Text className="text-slate-50 text-base font-bold">{routine.title}</Text>
            <Text className="text-slate-400 text-xs mt-1 mb-4">{routine.exercises.length} Exercícios</Text>

            <View className="flex-row items-center justify-center bg-blue-600 py-3 rounded-xl gap-2">
              <Play className="text-white" size={14} fill="currentColor" className="text-white" />
              <Text className="text-white font-bold text-xs">INICIAR FICHA (+50 pts)</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
