import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../features/auth/context/AuthContext';
import { Flame, Award, LogOut } from 'lucide-react-native';

export const HeaderBar: React.FC = () => {
  const { activeProfile, logout } = useAuth();

  if (!activeProfile) return null;

  return (
    <View style={{ paddingTop: 50 }} className="flex-row justify-between items-center px-5 pb-4 bg-slate-950 border-b border-slate-800">
      <View className="flex-row items-center space-x-3 gap-3">
        <View style={{ backgroundColor: activeProfile.avatar_color || '#0A84FF' }} className="w-10 h-10 rounded-full justify-center items-center">
          <Text className="text-white font-bold text-base">{activeProfile.initials}</Text>
        </View>
        <View>
          <Text className="text-slate-50 text-base font-bold tracking-tight">{activeProfile.name}</Text>
        </View>
      </View>

      <View className="flex-row items-center space-x-2 gap-2">
        <View className="flex-row items-center bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-2xl gap-1">
          <Flame color="#FF9F0A" size={16} />
          <Text className="text-amber-500 font-bold text-xs">{activeProfile.streak}d</Text>
        </View>

        <View className="flex-row items-center bg-yellow-950/40 border border-yellow-500/30 px-2.5 py-1 rounded-2xl gap-1">
          <Award color="#FFD60A" size={16} />
          <Text className="text-amber-400 font-bold text-xs">{activeProfile.bro_points} pts</Text>
        </View>

        <TouchableOpacity className="p-2 bg-slate-900 rounded-xl border border-slate-800" onPress={logout} activeOpacity={0.7}>
          <LogOut color="#94A3B8" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
