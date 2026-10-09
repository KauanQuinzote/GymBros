import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { HeaderBar } from '../../../shared/components/HeaderBar';
import { BROMANCE_NUDGES } from '../data/nudges';
import { useBromance } from '../context/BromanceContext';
import { NudgeCategory, BromanceNudgeItem } from '../types';
import { NudgeCategoryTabs } from '../components/NudgeCategoryTabs';
import { NudgeCard } from '../components/NudgeCard';
import { NudgeHistoryList } from '../components/NudgeHistoryList';
import { SoundboardPicker } from '../components/SoundboardPicker';
import { BroRecipientSelector } from '../components/BroRecipientSelector';
import { CustomTtsInput } from '../components/CustomTtsInput';
import { Skull, Music, Mic } from 'lucide-react-native';

type ChillingTabType = 'trash_talk' | 'soundboard' | 'voice_tts';

export const BromanceScreen: React.FC = () => {
  const { sendNudge, nudgeHistory } = useBromance();
  const [activeTab, setActiveTab] = useState<ChillingTabType>('trash_talk');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<NudgeCategory>('pesado');
  const [sentSuccessId, setSentSuccessId] = useState<string | null>(null);
  const [isSendingCustom, setIsSendingCustom] = useState(false);

  const filteredNudges = BROMANCE_NUDGES.filter((n) => n.category === selectedCategory);

  const handleSendNudge = async (nudge: BromanceNudgeItem) => {
    await sendNudge(nudge.text, nudge.category, undefined, selectedRecipientId);
    setSentSuccessId(nudge.id);
    setTimeout(() => setSentSuccessId(null), 2000);
  };

  const handleSendCustomTts = async (text: string) => {
    setIsSendingCustom(true);
    await sendNudge(text, 'pesado', undefined, selectedRecipientId);
    setIsSendingCustom(false);
  };

  return (
    <View className="flex-1 bg-slate-950">
      <HeaderBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Banner do Chilling */}
        <View className="bg-slate-900 p-5 mx-5 my-3 rounded-3xl border border-slate-800">
          <View className="flex-row items-center gap-2 mb-2">
            <Skull color="#FF453A" size={22} />
            <Text className="text-white text-lg font-bold">Chilling & Social</Text>
          </View>
          <Text className="text-slate-400 text-xs leading-relaxed">
            Envie provocações instantâneas, memes sonoros ao vivo e mensagens com voz narrada para os seus parceiros de treino.
          </Text>
        </View>

        {/* Seletor de Destinatários */}
        <BroRecipientSelector
          selectedRecipientId={selectedRecipientId}
          onSelectRecipient={setSelectedRecipientId}
        />

        {/* Segmented Control - 3 Abas do Chilling */}
        <View className="flex-row bg-slate-900 mx-5 p-1 rounded-2xl border border-slate-800 mb-3">
          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 ${
              activeTab === 'trash_talk' ? 'bg-slate-950 border border-slate-800' : ''
            }`}
            onPress={() => setActiveTab('trash_talk')}
            activeOpacity={0.7}
          >
            <Skull color={activeTab === 'trash_talk' ? '#FF453A' : '#64748B'} size={15} />
            <Text
              className={`text-xs font-bold ${
                activeTab === 'trash_talk' ? 'text-rose-500' : 'text-slate-400'
              }`}
            >
              Trash Talk
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 ${
              activeTab === 'soundboard' ? 'bg-slate-950 border border-slate-800' : ''
            }`}
            onPress={() => setActiveTab('soundboard')}
            activeOpacity={0.7}
          >
            <Music color={activeTab === 'soundboard' ? '#00F0FF' : '#64748B'} size={15} />
            <Text
              className={`text-xs font-bold ${
                activeTab === 'soundboard' ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              Soundboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 ${
              activeTab === 'voice_tts' ? 'bg-slate-950 border border-slate-800' : ''
            }`}
            onPress={() => setActiveTab('voice_tts')}
            activeOpacity={0.7}
          >
            <Mic color={activeTab === 'voice_tts' ? '#FFD60A' : '#64748B'} size={15} />
            <Text
              className={`text-xs font-bold ${
                activeTab === 'voice_tts' ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              Áudios de Voz
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo da Aba 1: Trash Talk (Frases Prontas) */}
        {activeTab === 'trash_talk' && (
          <View>
            <NudgeCategoryTabs
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <View className="px-5 my-3 gap-3">
              {filteredNudges.map((nudge) => (
                <NudgeCard
                  key={nudge.id}
                  nudge={nudge}
                  isSent={sentSuccessId === nudge.id}
                  onSend={handleSendNudge}
                />
              ))}
            </View>
          </View>
        )}

        {/* Conteúdo da Aba 2: Soundboard & Memes */}
        {activeTab === 'soundboard' && (
          <View className="px-5">
            <SoundboardPicker selectedRecipientId={selectedRecipientId} />
          </View>
        )}

        {/* Conteúdo da Aba 3: Áudios de Voz / TTS Customizado */}
        {activeTab === 'voice_tts' && (
          <View>
            <CustomTtsInput
              onSendCustomTts={handleSendCustomTts}
              isSending={isSendingCustom}
            />
          </View>
        )}

        {/* Histórico Recente de Provocações */}
        <NudgeHistoryList nudgeHistory={nudgeHistory} />
      </ScrollView>
    </View>
  );
};
