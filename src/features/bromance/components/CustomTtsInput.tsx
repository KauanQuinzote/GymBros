import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Mic, Send, Volume2, Sparkles } from 'lucide-react-native';
import { SpeechService } from '../services/speechService';

interface CustomTtsInputProps {
  onSendCustomTts: (text: string) => Promise<void>;
  isSending?: boolean;
}

export const CustomTtsInput: React.FC<CustomTtsInputProps> = ({
  onSendCustomTts,
  isSending = false,
}) => {
  const [text, setText] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const handlePreview = () => {
    if (!text.trim()) return;
    setIsPlayingPreview(true);
    SpeechService.speak(text.trim());
    setTimeout(() => setIsPlayingPreview(false), 3000);
  };

  const handleSend = async () => {
    if (!text.trim() || isSending) return;
    const toSend = text.trim();
    setText('');
    await onSendCustomTts(toSend);
  };


  return (
    <View className="bg-[#161B26] p-5 mx-5 rounded-3xl border border-[#262F42] gap-4">
      <View className="flex-row items-center gap-2.5">
        <View className="w-10 h-10 rounded-2xl bg-[#00F0FF]/15 justify-center items-center">
          <Mic color="#00F0FF" size={20} />
        </View>
        <View className="flex-1">
          <Text className="text-white text-base font-bold">Narração Customizada</Text>
          <Text className="text-slate-400 text-xs">
            Digite qualquer frase para a voz do robô falar no celular do seu bro
          </Text>
        </View>
      </View>

      {/* Input de Frase */}
      <View className="bg-[#0A0D14] border border-[#262F42] rounded-2xl p-3.5 focus:border-[#00F0FF]">
        <TextInput
          className="text-slate-100 text-sm min-h-[70px] text-top leading-relaxed"
          placeholder="Digite a frase que a voz sintetizada vai falar no app do bro..."
          placeholderTextColor="#64748B"
          multiline
          numberOfLines={3}
          value={text}
          onChangeText={setText}
          maxLength={200}
        />
        <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-[#1E293B]">
          <Text className="text-slate-500 text-[11px]">{text.length}/200 caracteres</Text>

          {/* Botão Testar / Preview Local */}
          <TouchableOpacity
            className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E293B]"
            onPress={handlePreview}
            disabled={!text.trim()}
            activeOpacity={0.7}
          >
            <Volume2 color={text.trim() ? '#00F0FF' : '#64748B'} size={14} />
            <Text
              className={`text-xs font-semibold ${text.trim() ? 'text-[#00F0FF]' : 'text-slate-500'
                }`}
            >
              Testar Voz
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botão de Envio para o Bro */}
      <TouchableOpacity
        className={`py-3.5 px-4 rounded-xl flex-row justify-center items-center gap-2 shadow-lg ${text.trim() && !isSending ? 'bg-[#00F0FF]' : 'bg-[#262F42]'
          }`}
        onPress={handleSend}
        disabled={!text.trim() || isSending}
        activeOpacity={0.8}
      >
        {isSending ? (
          <ActivityIndicator size="small" color="#0A0D14" />
        ) : (
          <>
            <Send color={text.trim() ? '#0A0D14' : '#64748B'} size={18} />
            <Text
              className={`font-bold text-sm uppercase tracking-wider ${text.trim() ? 'text-slate-950 font-extrabold' : 'text-slate-500'
                }`}
            >
              ENVIAR E FALAR NO APP DO BRO
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
