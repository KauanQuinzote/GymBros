import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useCommunity } from '../context/CommunityContext';
import { INVITE_CODE_LENGTH } from '../types';
import { CommunitySheetShell } from './CommunitySheetShell';
import { CommunitySubmitButton } from './CommunitySubmitButton';

interface JoinCommunitySheetProps {
  visible: boolean;
  onClose: () => void;
}

export const JoinCommunitySheet: React.FC<JoinCommunitySheetProps> = ({ visible, onClose }) => {
  const { joinCommunity } = useCommunity();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setCode('');
    setError(null);
    onClose();
  };

  const handleJoin = async () => {
    setLoading(true);
    setError(null);
    try {
      await joinCommunity(code);
      handleClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommunitySheetShell visible={visible} title="Entrar com codigo" onClose={handleClose}>
      <View className="gap-4">
        <TextInput
          placeholder="Codigo de 6 caracteres"
          placeholderTextColor="#94a3b8"
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={INVITE_CODE_LENGTH}
          value={code}
          onChangeText={setCode}
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-lg text-center"
        />
        {error && <Text className="text-rose-500 text-xs font-semibold">{error}</Text>}
        <CommunitySubmitButton
          label={loading ? 'Entrando...' : 'Entrar'}
          disabled={loading || !code.trim()}
          onPress={handleJoin}
        />
      </View>
    </CommunitySheetShell>
  );
};
