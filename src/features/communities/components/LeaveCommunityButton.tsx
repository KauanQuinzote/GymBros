import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { useCommunity } from '../context/CommunityContext';

interface LeaveCommunityButtonProps {
  communityId: string;
  communityName: string;
}

/** Sair da comunidade ativa (RF08), com confirmacao inline (Alert.alert nao funciona na web). */
export const LeaveCommunityButton: React.FC<LeaveCommunityButtonProps> = ({
  communityId,
  communityName,
}) => {
  const { leaveCommunity } = useCommunity();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLeave = async () => {
    setBusy(true);
    setError(null);
    try {
      await leaveCommunity(communityId);
      setConfirming(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao sair da comunidade');
    } finally {
      setBusy(false);
    }
  };

  if (!confirming) {
    return (
      <TouchableOpacity
        className="flex-row items-center justify-center gap-2 py-3 rounded-xl border border-rose-500"
        onPress={() => setConfirming(true)}
        activeOpacity={0.7}
      >
        <LogOut className="text-rose-500" size={18} />
        <Text className="text-rose-500 font-bold text-sm">Sair da comunidade</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View className="gap-3 bg-slate-950 p-4 rounded-xl border border-rose-500">
      <Text className="text-slate-50 text-sm font-bold">Sair de {communityName}?</Text>
      <Text className="text-slate-400 text-xs">
        Você deixa de ver o ranking e a presença dessa comunidade. Pode voltar com o código de convite.
      </Text>
      {error ? <Text className="text-rose-500 text-xs">{error}</Text> : null}
      <View className="flex-row gap-3">
        <TouchableOpacity
          className="flex-1 py-3 rounded-xl bg-slate-800 items-center"
          onPress={() => setConfirming(false)}
          disabled={busy}
          activeOpacity={0.7}
        >
          <Text className="text-white font-bold text-sm">Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-3 rounded-xl bg-rose-500 items-center"
          onPress={handleLeave}
          disabled={busy}
          activeOpacity={0.7}
        >
          <Text className="text-white font-bold text-sm">Confirmar saída</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
