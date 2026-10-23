import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useAuth } from '../../auth/context/AuthContext';
import { Users } from 'lucide-react-native';

interface BroRecipientSelectorProps {
  selectedRecipientId: string | null; // null means 'ALL'
  onSelectRecipient: (recipientId: string | null) => void;
}

const PulsingStatusBadge: React.FC<{ isTraining: boolean }> = ({ isTraining }) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const color = isTraining ? '#00FF66' : '#00F0FF';
  const label = isTraining ? 'treinando agora' : 'on';

  return (
    <View className="flex-row items-center ml-1.5 gap-1 bg-slate-950 px-1.5 py-0.5 rounded-md border border-slate-800">
      <Animated.View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
          opacity: pulseAnim,
          transform: [
            {
              scale: pulseAnim.interpolate({
                inputRange: [0.35, 1],
                outputRange: [0.85, 1.25],
              }),
            },
          ],
        }}
      />
      <Text
        style={{
          color,
          fontSize: 9,
          fontWeight: '800',
          textTransform: 'lowercase',
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

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
          className={`flex-row items-center px-3.5 py-2 rounded-xl border ${selectedRecipientId === null
              ? 'bg-blue-600 border-blue-500'
              : 'bg-slate-900 border-slate-800'
            }`}
          onPress={() => onSelectRecipient(null)}
          activeOpacity={0.8}
        >
          <Users color={selectedRecipientId === null ? '#FFFFFF' : '#94A3B8'} size={15} />
          <Text
            className={`text-xs font-bold ml-1.5 ${selectedRecipientId === null ? 'text-white' : 'text-slate-300'
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
              className={`flex-row items-center px-3 py-1.5 rounded-xl border ${isSelected
                  ? 'bg-cyan-400/15 border-cyan-400'
                  : isTraining
                    ? 'bg-slate-900 border-emerald-500/60'
                    : 'bg-slate-900 border-slate-800'
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
                className={`text-xs font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-200'
                  }`}
              >
                {bro.name.split(' ')[0]}
              </Text>

              {/* Status indicator badge animado */}
              {isOnline && <PulsingStatusBadge isTraining={isTraining} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

