import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { BroPresenceState } from '../../auth/context/AuthContext';

interface BroPresenceCardProps {
  bro: BroPresenceState;
  onPress?: () => void;
}

export const BroPresenceCard: React.FC<BroPresenceCardProps> = ({
  bro,
  onPress,
}) => {
  const isTraining = bro.status === 'TRAINING';
  const isOnline = bro.status === 'ONLINE' || isTraining;
  const isActive = isOnline; // Ativo quando Online ou Treinando

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isActive) {
      pulseAnim.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.25,
          duration: 900,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isActive, pulseAnim]);

  // Cores de status Neon
  const neonColor = isTraining ? '#10B981' : isOnline ? '#22D3EE' : '#262F42';
  const haloBgColor = isTraining
    ? 'rgba(16, 185, 129, 0.15)'
    : isOnline
    ? 'rgba(34, 211, 238, 0.15)'
    : 'transparent';

  // Sombra e Glow compatíveis com Web e Mobile
  const haloShadowStyle =
    Platform.OS === 'web' && isActive
      ? {
          boxShadow: isTraining
            ? '0 0 14px rgba(16, 185, 129, 0.7)'
            : '0 0 14px rgba(34, 211, 238, 0.7)',
        }
      : {
          shadowColor: neonColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 6,
        };

  const badgeBgColor = isTraining ? '#10B981' : isOnline ? '#22D3EE' : '#1E2536';
  const badgeText = isTraining ? 'TREINANDO' : isOnline ? 'ON' : 'OFF';
  const badgeTextColor = isTraining || isOnline ? '#0A0D14' : '#94A3B8';

  return (
    <TouchableOpacity
      className="items-center w-[80px] gap-1.5"
      style={{ width: 80, alignItems: 'center', overflow: 'visible' }}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Container do Avatar com Anel Halo Separado */}
      <View
        className="relative"
        style={{ width: 72, height: 72, alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}
      >
        {/* Camada 0: Halo Neon Pulsante Externo (Apenas a borda pulsa) */}
        {isActive && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 70,
                height: 70,
                borderRadius: 35,
                borderWidth: 2,
                borderColor: neonColor,
                backgroundColor: haloBgColor,
                opacity: pulseAnim,
              },
              haloShadowStyle as any,
            ]}
          />
        )}

        {/* Camada 1: Círculo Fixo do Avatar (100% NÍTIDO E SEM PISCAR) */}
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: bro.avatar_color || '#0A84FF',
            borderWidth: isActive ? 2 : 1,
            borderColor: isActive ? '#0A0D14' : '#262F42',
            opacity: isActive ? 1 : 0.6,
          }}
          className="justify-center items-center shadow-md"
        >
          <Text
            style={{ fontSize: 18, fontWeight: '800', color: '#FFFFFF' }}
            className="text-white text-lg font-extrabold"
          >
            {bro.initials}
          </Text>
        </View>

        {/* Camada 2: Badge Neon Pulsante no Canto Inferior */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            paddingHorizontal: isTraining ? 6 : 5,
            paddingVertical: 1.5,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: '#0A0D14',
            backgroundColor: badgeBgColor,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isActive ? pulseAnim : 1,
          }}
        >
          <Text
            style={{
              fontSize: isTraining ? 7.5 : 8,
              letterSpacing: 0.4,
              fontWeight: '900',
              color: badgeTextColor,
            }}
            className="uppercase"
          >
            {badgeText}
          </Text>
        </Animated.View>
      </View>

      {/* Nome do Bro */}
      <View className="items-center w-full mt-0.5">
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            textAlign: 'center',
            color: isTraining ? '#34D399' : isOnline ? '#F8FAFC' : '#94A3B8',
          }}
          numberOfLines={1}
        >
          {bro.user_name.split(' ')[0]}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
