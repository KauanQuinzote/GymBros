import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import {
  MEME_SOUNDBOARD,
  SOUNDBOARD_CATEGORIES,
  SoundboardCategory,
  SoundboardMemeItem,
} from '../data/soundboardData';
import { useChilling } from '../context/ChillingContext';
import { AudioService } from '../services/audioService';
import { Volume2, Music, Send, Link as LinkIcon, Search, Play } from 'lucide-react-native';

interface SoundboardPickerProps {
  selectedRecipientId?: string | null;
}

export const SoundboardPicker: React.FC<SoundboardPickerProps> = ({
  selectedRecipientId,
}) => {
  const { sendNudge } = useChilling();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SoundboardCategory | 'todos'>('todos');
  const [customUrl, setCustomUrl] = useState('');
  const [customText, setCustomText] = useState('');
  const [sendingId, setSendingId] = useState<string | null>(null);

  const filteredMemes = MEME_SOUNDBOARD.filter((meme) => {
    const matchesCategory =
      selectedCategory === 'todos' || meme.category === selectedCategory;
    const textToMatch = (meme.name || meme.title || '').toLowerCase();
    const matchesSearch = textToMatch.includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  const handleSendMeme = async (item: SoundboardMemeItem) => {
    setSendingId(item.id);
    const textToSend = item.name || item.title || item.nudge_text || 'Áudio Meme!';
    const audioUrlToSend = item.url || item.audio_url || '';
    await sendNudge(textToSend, item.category || 'pesado', audioUrlToSend, selectedRecipientId);
    setSendingId(null);
  };

  const handlePreviewLocal = (item: SoundboardMemeItem) => {
    AudioService.playUrl(item.url, item.name);
  };

  const handleSendCustomUrl = async () => {
    if (!customUrl.trim()) return;
    const textToSend = customText.trim() || 'Provocação em Áudio Customizada!';
    setSendingId('custom');
    await sendNudge(textToSend, 'pesado', customUrl.trim(), selectedRecipientId);
    setCustomUrl('');
    setCustomText('');
    setSendingId(null);
  };

  return (
    <View className="bg-slate-900 border border-slate-800 rounded-3xl p-5 my-3 shadow-xl">
      <View className="flex-row items-center gap-2.5 mb-4">
        <Music className="text-cyan-400" size={22} />
        <View className="flex-1">
          <Text className="text-white font-extrabold text-base uppercase tracking-wider">
            SOUNDBOARD DE MEMES ({filteredMemes.length})
          </Text>
          <Text className="text-slate-400 text-xs font-medium">
            Toque no card para enviar ao vivo ou no play para ouvir
          </Text>
        </View>
      </View>

      {/* Chips de Categorias do Soundboard */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
      >
        {SOUNDBOARD_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            className={`px-3.5 py-2 rounded-xl border ${
              selectedCategory === cat.id
                ? 'bg-cyan-400 border-cyan-400'
                : 'bg-slate-950 border-slate-800'
            }`}
            onPress={() => setSelectedCategory(cat.id)}
            activeOpacity={0.8}
          >
            <Text
              className={`text-xs font-bold ${
                selectedCategory === cat.id ? 'text-slate-950 font-black' : 'text-slate-300'
              }`}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Busca de Memes */}
      <View className="bg-slate-950 flex-row items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-800 mb-4">
        <Search className="text-slate-400" size={16} />
        <TextInput
          className="flex-1 text-slate-100 text-xs py-1"
          placeholder="Buscar meme (ex: sirene, chaves, goku, lula...)"
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Grid de Memes */}
      <View className="flex-row flex-wrap justify-between gap-y-2.5 mb-5">
        {filteredMemes.map((meme) => {
          const isSending = sendingId === meme.id;
          const displayName = meme.name || meme.title || meme.id;
          return (
            <View
              key={meme.id}
              className={`p-3 rounded-2xl border flex-row items-center justify-between w-[48%] ${
                isSending
                  ? 'bg-cyan-400/20 border-cyan-400'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <TouchableOpacity
                className="flex-1 mr-2"
                onPress={() => handleSendMeme(meme)}
                disabled={isSending}
                activeOpacity={0.7}
              >
                <Text className="text-slate-100 font-bold text-xs" numberOfLines={2}>
                  {displayName}
                </Text>
                <Text className="text-cyan-400 font-semibold text-[10px] mt-1 uppercase">
                  Enviar ➔
                </Text>
              </TouchableOpacity>

              {/* Botão de Preview Local */}
              <TouchableOpacity
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 justify-center items-center"
                onPress={() => handlePreviewLocal(meme)}
                activeOpacity={0.7}
              >
                <Play className="text-slate-400" size={12} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Envio de URL Customizada (ex: MyInstants) */}
      <View className="bg-slate-950 p-4 rounded-2xl border border-slate-800 gap-3">
        <View className="flex-row items-center gap-2">
          <LinkIcon className="text-amber-400" size={16} />
          <Text className="text-slate-200 text-xs font-bold uppercase">
            LINK CUSTOMIZADO (MYINSTANTS / MP3)
          </Text>
        </View>

        <TextInput
          className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs"
          placeholder="Cole a URL do áudio MP3 (ex: myinstants.com/...)"
          placeholderTextColor="#94a3b8"
          value={customUrl}
          onChangeText={setCustomUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs"
          placeholder="Frase do alerta (Opcional)"
          placeholderTextColor="#94a3b8"
          value={customText}
          onChangeText={setCustomText}
        />

        <TouchableOpacity
          className={`py-3 px-4 rounded-xl flex-row justify-center items-center gap-2 ${
            customUrl.trim() ? 'bg-cyan-400' : 'bg-slate-800'
          }`}
          onPress={handleSendCustomUrl}
          disabled={!customUrl.trim() || sendingId === 'custom'}
          activeOpacity={0.8}
        >
          <Send color={customUrl.trim() ? '#0A0D14' : '#64748B'} size={16} />
          <Text
            className={`font-bold text-xs uppercase ${
              customUrl.trim() ? 'text-slate-950' : 'text-slate-500'
            }`}
          >
            DISPARAR ÁUDIO MEME
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
