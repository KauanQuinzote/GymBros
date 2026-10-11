import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Skull, Dumbbell, Sparkles } from 'lucide-react-native';
import { NudgeCategory } from '../types';

interface NudgeCategoryTabsProps {
  selectedCategory: NudgeCategory;
  onSelectCategory: (cat: NudgeCategory) => void;
}

export const NudgeCategoryTabs: React.FC<NudgeCategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View className="flex-row mx-5 my-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 justify-between">
      <TouchableOpacity
        className={`flex-1 py-2.5 rounded-xl items-center flex-row justify-center gap-1.5 ${selectedCategory === 'pesado' ? 'bg-rose-500' : ''}`}
        onPress={() => onSelectCategory('pesado')}
        activeOpacity={0.8}
      >
        <Skull color={selectedCategory === 'pesado' ? '#FFFFFF' : '#94A3B8'} size={16} />
        <Text className={`text-xs font-bold ${selectedCategory === 'pesado' ? 'text-white' : 'text-slate-400'}`}>Pesado</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-1 py-2.5 rounded-xl items-center flex-row justify-center gap-1.5 ${selectedCategory === 'frango' ? 'bg-amber-500' : ''}`}
        onPress={() => onSelectCategory('frango')}
        activeOpacity={0.8}
      >
        <Dumbbell color={selectedCategory === 'frango' ? '#FFFFFF' : '#94A3B8'} size={16} />
        <Text className={`text-xs font-bold ${selectedCategory === 'frango' ? 'text-white' : 'text-slate-400'}`}>Frango</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-1 py-2.5 rounded-xl items-center flex-row justify-center gap-1.5 ${selectedCategory === 'brother' ? 'bg-emerald-500' : ''}`}
        onPress={() => onSelectCategory('brother')}
        activeOpacity={0.8}
      >
        <Sparkles color={selectedCategory === 'brother' ? '#FFFFFF' : '#94A3B8'} size={16} />
        <Text className={`text-xs font-bold ${selectedCategory === 'brother' ? 'text-white' : 'text-slate-400'}`}>Brother</Text>
      </TouchableOpacity>
    </View>
  );
};
