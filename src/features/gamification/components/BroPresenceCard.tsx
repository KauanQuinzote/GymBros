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
          toValue: 0.4,
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

  const ringBorderClass = isTraining
    ? 'border-2 border-emerald-500 shadow-lg shadow-emerald-500/60'
    : isOnline
    ? 'border-2 border-cyan-400 shadow-md shadow-cyan-500/50'
    : 'border border-slate-800 opacity-60';

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
      {/* Container do Avatar com Borda Neon e Badge */}
      <View className="relative" style={{ width: 68, height: 68, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          style={{
            width: 66,
            height: 66,
            borderRadius: 33,
            padding: 2.5,
            opacity: isActive ? pulseAnim : 1,
          }}
          className={`justify-center items-center ${ringBorderClass}`}
        >
          <View
            style={{
              backgroundColor: bro.avatar_color || '#0A84FF',
              width: '100%',
              height: '100%',
              borderRadius: 30,
            }}
            className="justify-center items-center"
          >
            <Text
              style={{ fontSize: 18, fontWeight: '800', color: '#FFFFFF' }}
              className="text-white text-lg font-extrabold"
            >
              {bro.initials}
            </Text>
          </View>
        </Animated.View>

        {/* Badge Neon Estilizado no Canto Inferior */}
        <View
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            paddingHorizontal: isTraining ? 6 : 5,
            paddingVertical: 1.5,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: '#0A0D14',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className={`border-slate-950 ${badgeBgClass}`}
        >
          <Text
            style={{ fontSize: isTraining ? 7.5 : 8, letterSpacing: 0.4 }}
            className={`uppercase ${badgeTextColor}`}
          >
            {badgeText}
          </Text>
        </View>
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
