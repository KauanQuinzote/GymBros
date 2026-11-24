import React from 'react';
import { Modal, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';

interface CommunitySheetShellProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const CommunitySheetShell: React.FC<CommunitySheetShellProps> = ({
  visible,
  title,
  onClose,
  children,
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-slate-950/90 justify-end"
    >
      <View className="bg-slate-900 rounded-t-3xl p-6 border-t border-slate-800">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-xl font-bold text-white tracking-tight">{title}</Text>
          <TouchableOpacity className="p-1" onPress={onClose} accessibilityLabel="Fechar">
            <X className="text-slate-400" size={22} />
          </TouchableOpacity>
        </View>
        {children}
      </View>
    </KeyboardAvoidingView>
  </Modal>
);
