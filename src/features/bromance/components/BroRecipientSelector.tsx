import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../auth/context/AuthContext';
import { Users } from 'lucide-react-native';

interface BroRecipientSelectorProps {
  selectedRecipientId: string | null; // null means 'ALL'
  onSelectRecipient: (recipientId: string | null) => void;
}

export const BroRecipientSelector: React.FC<BroRecipientSelectorProps> = ({
  selectedRecipientId,
  onSelectRecipient,
}) => {
  const { profiles, onlineBros, activeProfile } = useAuth();

  // Filtrar outros perfis (não mostrar a si próprio como destinatário)
  const otherProfiles = profiles.filter((p) => p.id !== activeProfile?.id);

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between px-5 mb-2.5">
        <Text className="text-slate-300 font-bold text-xs uppercase tracking-wider">
          ENVIAR PARA
        </Text>
        <Text className="text-slate-500 text-[11px] font-medium">
          {selectedRecipientId === null
            ? 'Todos os Bros'
            : otherProfiles.find((p) => p.id === selectedRecipientId)?.name || 'Bro Selecionado'}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {/* Opção: Todos os Bros */}
        <TouchableOpacity
          className={`flex-row items-center px-3.5 py-2 rounded-xl border ${
            selectedRecipientId === null
              ? 'bg-[#0A84FF] border-[#0A84FF]'
              : 'bg-[#161B26] border-[#262F42]'
          }`}
          onPress={() => onSelectRecipient(null)}
          activeOpacity={0.8}
        >
          <Users color={selectedRecipientId === null ? '#FFFFFF' : '#94A3B8'} size={15} />
          <Text
            className={`text-xs font-bold ml-1.5 ${
              selectedRecipientId === null ? 'text-white' : 'text-slate-300'
            }`}
          >
            Todos os Bros
          </Text>
        </TouchableOpacity>

        {/* Lista de Bros individuais */}
        {otherProfiles.map((bro) => {
          const isSelected = selectedRecipientId === bro.id;
          const presence = onlineBros.find((b) => b.user_id === bro.id);
          const isTraining = presence?.status === 'TRAINING';
          const isOnline = presence?.status === 'ONLINE' || isTraining;

          return (
            <TouchableOpacity
              key={bro.id}
              className={`flex-row items-center px-3 py-1.5 rounded-xl border ${
                isSelected
                  ? 'bg-[#00F0FF]/15 border-[#00F0FF]'
                  : isTraining
                  ? 'bg-[#161B26] border-[#00FF66]/60'
                  : 'bg-[#161B26] border-[#262F42]'
              }`}
              onPress={() => onSelectRecipient(bro.id)}
              activeOpacity={0.8}
            >
              <View
                style={{
                  backgroundColor: bro.avatar_color || '#0A84FF',
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 6,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>
                  {bro.initials}
                </Text>
              </View>

              <Text
                className={`text-xs font-bold ${
                  isSelected ? 'text-[#00F0FF]' : 'text-slate-200'
                }`}
              >
                {bro.name.split(' ')[0]}
              </Text>

              {/* Status indicator dot */}
              {isOnline && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isTraining ? '#00FF66' : '#00F0FF',
                    marginLeft: 6,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
