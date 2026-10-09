import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
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
  const isActive = isOnline; // Pisca para Online ou Treinando

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
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isActive, pulseAnim]);

  const haloBorderClass = isTraining
    ? 'border-2 border-emerald-500 bg-emerald-500/15 shadow-lg shadow-emerald-500/60'
    : isOnline
    ? 'border-2 border-cyan-400 bg-cyan-400/15 shadow-md shadow-cyan-500/50'
    : '';

  const badgeBgClass = isTraining
    ? 'bg-emerald-500'
    : isOnline
    ? 'bg-cyan-400'
    : 'bg-slate-800';

  const badgeText = isTraining ? 'TREINANDO' : isOnline ? 'ON' : 'OFF';
  const badgeTextColor = isTraining || isOnline ? 'text-slate-950 font-black' : 'text-slate-400 font-bold';

  return (
    <TouchableOpacity
      className="items-center w-[78px] gap-1.5"
      style={{ width: 78, alignItems: 'center' }}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Container do Avatar com Anel Halo Separado */}
      <View
        className="relative"
        style={{ width: 70, height: 70, alignItems: 'center', justifyContent: 'center' }}
      >
        {/* Camada 0: Halo Neon Pulsante Externo (Apenas a borda pulsa) */}
        {isActive && (
          <Animated.View
            style={{
              position: 'absolute',
              width: 70,
              height: 70,
              borderRadius: 35,
              opacity: pulseAnim,
            }}
            className={`justify-center items-center ${haloBorderClass}`}
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
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isActive ? pulseAnim : 1,
          }}
          className={`border-slate-950 ${badgeBgClass}`}
        >
          <Text
            style={{ fontSize: isTraining ? 7.5 : 8, letterSpacing: 0.4 }}
            className={`uppercase ${badgeTextColor}`}
          >
            {badgeText}
          </Text>
        </Animated.View>
      </View>

      {/* Nome do Bro */}
      <View className="items-center w-full mt-0.5">
        <Text
          style={{ fontSize: 12, fontWeight: '700', textAlign: 'center' }}
          className={`text-xs font-bold text-center ${
            isTraining ? 'text-emerald-400' : isOnline ? 'text-slate-100' : 'text-slate-400'
          }`}
          numberOfLines={1}
        >
          {bro.user_name.split(' ')[0]}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
