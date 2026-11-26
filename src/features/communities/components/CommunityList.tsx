import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { useCommunity } from '../context/CommunityContext';

interface CommunityListProps {
  onSelected: () => void;
}

export const CommunityList: React.FC<CommunityListProps> = ({ onSelected }) => {
  const { communities, activeCommunity, selectCommunity } = useCommunity();

  return (
    <View className="gap-2">
      {communities.map((community) => {
        const isActive = community.id === activeCommunity?.id;
        return (
          <TouchableOpacity
            key={community.id}
            className={`flex-row items-center justify-between bg-slate-950 p-4 rounded-xl border ${
              isActive ? 'border-blue-500' : 'border-slate-800'
            }`}
            onPress={async () => {
              await selectCommunity(community.id);
              onSelected();
            }}
            accessibilityState={{ selected: isActive }}
            activeOpacity={0.7}
          >
            <View className="flex-1">
              <Text className="text-slate-50 font-bold text-sm">{community.name}</Text>
              {community.description ? (
                <Text className="text-slate-400 text-xs mt-0.5">{community.description}</Text>
              ) : null}
            </View>
            {isActive && <Check className="text-emerald-400" size={18} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
