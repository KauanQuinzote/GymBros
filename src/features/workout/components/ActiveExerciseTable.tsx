import React from 'react';
import { View, Text } from 'react-native';
import { Dumbbell, CheckCircle2 } from 'lucide-react-native';
import { ExerciseDefinition, WorkoutSetLog } from '../../../shared/types';

interface ActiveExerciseTableProps {
  currentExercise: ExerciseDefinition;
  logsForCurrentExercise: WorkoutSetLog[];
  lastHistoryText: string | null;
}

export const ActiveExerciseTable: React.FC<ActiveExerciseTableProps> = ({
  currentExercise,
  logsForCurrentExercise,
  lastHistoryText,
}) => {
  return (
    <View className="mb-4">
      <View className="flex-row items-center gap-2.5">
        <Dumbbell className="text-blue-500" size={22} />
        <Text className="text-slate-50 text-lg font-bold flex-1">{currentExercise.name}</Text>
      </View>
      <Text className="text-slate-400 text-xs mt-1.5 mb-1">
        Alvo: {currentExercise.targetMuscle} | Meta: {currentExercise.defaultSets} Séries x {currentExercise.defaultReps} Reps
      </Text>

      {lastHistoryText && (
        <Text className="text-blue-500 text-[11px] font-semibold mb-4 bg-blue-500/10 self-start px-2.5 py-1 rounded-lg">
          {lastHistoryText}
        </Text>
      )}

      <View className="bg-slate-950 rounded-2xl p-3">
        <View className="flex-row justify-between pb-2 border-b border-slate-800">
          <Text className="text-slate-500 text-xs font-semibold flex-1 text-center">Série</Text>
          <Text className="text-slate-500 text-xs font-semibold flex-1 text-center">Carga (kg)</Text>
          <Text className="text-slate-500 text-xs font-semibold flex-1 text-center">Reps</Text>
          <Text className="text-slate-500 text-xs font-semibold flex-1 text-center">Status</Text>
        </View>

        {logsForCurrentExercise.map((log) => (
          <View key={log.id} className="flex-row justify-between items-center py-2.5 border-b border-slate-800">
            <Text className="text-blue-500 text-sm font-bold flex-1 text-center">#{log.set_number}</Text>
            <Text className="text-slate-50 text-sm flex-1 text-center">{log.weight_kg} kg</Text>
            <Text className="text-slate-50 text-sm flex-1 text-center">{log.reps} reps</Text>
            <View className="flex-1 flex-row justify-center items-center gap-1">
              {log.is_pr && <Text className="text-amber-400 text-[10px] font-bold">PR (+25 pts)</Text>}
              <CheckCircle2 className="text-emerald-400" size={18} />
            </View>
          </View>
        ))}

        {logsForCurrentExercise.length === 0 && (
          <Text className="text-slate-500 text-center py-3 text-xs">Nenhuma série registrada ainda neste exercício.</Text>
        )}
      </View>
    </View>
  );
};
