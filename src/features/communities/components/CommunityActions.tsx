import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus, Key } from 'lucide-react-native';
import { CreateCommunitySheet } from './CreateCommunitySheet';
import { JoinCommunitySheet } from './JoinCommunitySheet';

type OpenSheet = 'create' | 'join' | null;

/** Botoes de criar/entrar e as respectivas sheets. */
export const useCommunitySheets = () => {
  const [open, setOpen] = useState<OpenSheet>(null);
  const close = () => setOpen(null);

  const buttons = (
    <View className="flex-row gap-3">
      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-blue-600"
        onPress={() => setOpen('create')}
        activeOpacity={0.7}
      >
        <Plus className="text-white" size={18} />
        <Text className="text-white font-bold text-sm">Criar comunidade</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-slate-800"
        onPress={() => setOpen('join')}
        activeOpacity={0.7}
      >
        <Key className="text-cyan-400" size={18} />
        <Text className="text-white font-bold text-sm">Entrar com código</Text>
      </TouchableOpacity>
    </View>
  );

  const sheets = (
    <>
      <CreateCommunitySheet visible={open === 'create'} onClose={close} />
      <JoinCommunitySheet visible={open === 'join'} onClose={close} />
    </>
  );

  return { buttons, sheets };
};
