import React from 'react';
import { View, Text } from 'react-native';

interface InviteCodeCardProps {
  code: string;
}

export const InviteCodeCard: React.FC<InviteCodeCardProps> = ({ code }) => (
  <View className="bg-slate-950 border border-slate-800 rounded-2xl p-4 items-center">
    <Text className="text-slate-400 text-xs font-semibold">Codigo de convite</Text>
    <Text selectable className="text-cyan-400 text-3xl font-extrabold tracking-widest my-1">
      {code}
    </Text>
    <Text className="text-slate-400 text-xs text-center">Compartilhe este codigo com seus bros</Text>
  </View>
);
