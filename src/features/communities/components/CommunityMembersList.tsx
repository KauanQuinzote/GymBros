import React from 'react';
import { View, Text } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { useAuth } from '../../auth/context/AuthContext';
import { useCommunity } from '../context/CommunityContext';

export const CommunityMembersList: React.FC = () => {
  const { members } = useCommunity();
  const { profiles } = useAuth();

  return (
    <View className="gap-2">
      <Text className="text-slate-400 text-xs font-bold">Membros ({members.length})</Text>
      {members.map((member) => {
        const profile = profiles.find((p) => p.id === member.user_id);
        return (
          <View
            key={member.user_id}
            className="flex-row items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800"
          >
            <View className="flex-row items-center gap-2.5">
              <View
                style={profile?.avatar_color ? { backgroundColor: profile.avatar_color } : undefined}
                className="w-8 h-8 rounded-full bg-blue-600 justify-center items-center"
              >
                <Text className="text-white text-xs font-bold">{profile?.initials ?? '?'}</Text>
              </View>
              <Text className="text-slate-200 text-sm font-bold">
                {profile?.name ?? 'Bro desconhecido'}
              </Text>
            </View>
            {member.role === 'admin' && (
              <View accessibilityLabel={`Administrador: ${profile?.name ?? 'Bro desconhecido'}`}>
                <ShieldCheck className="text-emerald-400" size={18} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};
