import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Users } from 'lucide-react-native';
import { useCommunity } from '../context/CommunityContext';
import { CommunitySelectorModal } from './CommunitySelectorModal';

export const CommunityHeaderButton: React.FC = () => {
  const { activeCommunity } = useCommunity();
  const [open, setOpen] = useState(false);

  return (
    <View className="flex-row px-5 pt-3 pb-1">
      <TouchableOpacity
        className="flex-row items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-1.5"
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Users className="text-cyan-400" size={16} />
        <Text className="text-slate-50 text-xs font-bold" numberOfLines={1}>
          {activeCommunity?.name ?? 'Sem comunidade'}
        </Text>
      </TouchableOpacity>
      <CommunitySelectorModal visible={open} onClose={() => setOpen(false)} />
    </View>
  );
};
