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
    const speechText = text.trim()
    SpeechService.speak(speechText);
    setTimeout(() => setIsPlayingPreview(false), 5000);
  };

  const handleSend = async () => {
    if (!text.trim() || isSending) return;
    const toSend = text.trim();
    setText('');
    await onSendCustomTts(toSend);
  };


  return (
    <View className="bg-slate-900 p-5 mx-5 rounded-3xl border border-slate-800 gap-4">
      <View className="flex-row items-center gap-2.5">
        <View className="w-10 h-10 rounded-2xl bg-cyan-400/15 justify-center items-center">
          <Mic className="text-cyan-400" size={20} />
        </View>
        <View className="flex-1">
          <Text className="text-white text-base font-bold">Narração Customizada</Text>
          <Text className="text-slate-400 text-xs">
            Digite qualquer frase para a voz do robô falar no celular do seu bro
          </Text>
        </View>
      </View>

      {/* Input de Frase */}
      <View className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 focus:border-cyan-400">
        <TextInput
          className="text-slate-100 text-sm min-h-[70px] text-top leading-relaxed"
          placeholder="Digite a frase que a voz sintetizada vai falar no app do bro..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={3}
          value={text}
          onChangeText={setText}
          maxLength={200}
        />
        <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-slate-800">
          <Text className="text-slate-500 text-[11px]">{text.length}/200 caracteres</Text>

          {/* Botão Testar / Preview Local */}
          <TouchableOpacity
            className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800"
            onPress={handlePreview}
            disabled={!text.trim()}
            activeOpacity={0.7}
          >
            <Volume2 color={text.trim() ? '#00F0FF' : '#64748B'} size={14} />
            <Text
              className={`text-xs font-semibold ${text.trim() ? 'text-cyan-400' : 'text-slate-500'
                }`}
            >
              Testar Voz
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botão de Envio para o Bro */}
      <TouchableOpacity
        className={`py-3.5 px-4 rounded-xl flex-row justify-center items-center gap-2 shadow-lg ${text.trim() && !isSending ? 'bg-cyan-400' : 'bg-slate-800'
          }`}
        onPress={handleSend}
        disabled={!text.trim() || isSending}
        activeOpacity={0.8}
      >
        {isSending ? (
          <ActivityIndicator size="small" className="text-slate-950" />
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
