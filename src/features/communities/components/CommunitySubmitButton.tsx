import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface CommunitySubmitButtonProps {
  label: string;
  disabled?: boolean;
  onPress: () => void;
}

export const CommunitySubmitButton: React.FC<CommunitySubmitButtonProps> = ({
  label,
  disabled = false,
  onPress,
}) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={onPress}
    className={`py-4 rounded-xl items-center justify-center ${disabled ? 'bg-slate-800' : 'bg-blue-600'}`}
    activeOpacity={0.7}
  >
    <Text className="text-white font-bold text-base">{label}</Text>
  </TouchableOpacity>
);
