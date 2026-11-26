import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useCommunity } from '../context/CommunityContext';
import { CommunitySheetShell } from './CommunitySheetShell';
import { CommunitySubmitButton } from './CommunitySubmitButton';
import { InviteCodeCard } from './InviteCodeCard';

interface CreateCommunitySheetProps {
  visible: boolean;
  onClose: () => void;
}

const INPUT_CLASS = 'bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-base';

export const CreateCommunitySheet: React.FC<CreateCommunitySheetProps> = ({ visible, onClose }) => {
  const { createCommunity } = useCommunity();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setName('');
    setDescription('');
    setError(null);
    setInviteCode(null);
    onClose();
  };

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const created = await createCommunity(name.trim(), description.trim() || undefined);
      setInviteCode(created.invite_code);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommunitySheetShell visible={visible} title="Criar comunidade" onClose={handleClose}>
      {inviteCode ? (
        <View className="gap-4">
          <InviteCodeCard code={inviteCode} />
          <CommunitySubmitButton label="Concluir" onPress={handleClose} />
        </View>
      ) : (
        <View className="gap-4">
          <TextInput placeholder="Nome da comunidade" placeholderTextColor="#94a3b8" maxLength={50}
            value={name} onChangeText={setName} className={INPUT_CLASS} />
          <TextInput placeholder="Descrição (opcional)" placeholderTextColor="#94a3b8" maxLength={140}
            value={description} onChangeText={setDescription} className={INPUT_CLASS} />
          {error && <Text className="text-rose-500 text-xs font-semibold">{error}</Text>}
          <CommunitySubmitButton label={loading ? 'Criando...' : 'Criar'}
            disabled={loading || !name.trim()} onPress={handleCreate} />
        </View>
      )}
    </CommunitySheetShell>
  );
};
