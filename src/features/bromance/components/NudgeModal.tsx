import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useBromance } from '../context/BromanceContext';
import { AudioService } from '../services/audioService';
import { Flame, X, MessageSquareReply, Volume2 } from 'lucide-react-native';

interface NudgeModalProps {
  onReplyPress?: () => void;
}

export const NudgeModal: React.FC<NudgeModalProps> = ({ onReplyPress }) => {
  const { activeIncomingNudge, dismissIncomingNudge } = useBromance();

  useEffect(() => {
    if (activeIncomingNudge) {
      if (activeIncomingNudge.audio_url) {
        AudioService.playUrl(activeIncomingNudge.audio_url, activeIncomingNudge.nudge_text);
      } else {
        // Toca o som do Taco Bell e narra a frase via TTS
        AudioService.playTacoBell().then(() => {
          setTimeout(() => {
            AudioService.playUrl(null, activeIncomingNudge.nudge_text);
          }, 800);
        });
      }
    } else {
      AudioService.stop();
    }
  }, [activeIncomingNudge]);

  if (!activeIncomingNudge) return null;

  const handleReplayAudio = () => {
    AudioService.playUrl(activeIncomingNudge.audio_url, activeIncomingNudge.nudge_text);
  };

  const handleClose = async () => {
    await AudioService.stop();
    await dismissIncomingNudge();
  };

  return (
    <Modal animationType="slide" transparent visible={Boolean(activeIncomingNudge)}>
      <View className="flex-1 bg-slate-950/95 justify-center items-center p-6">
        <View className="w-full bg-slate-900 border border-rose-500 rounded-3xl p-6 items-center shadow-2xl">
          {/* Header Warning */}
          <View className="w-14 h-14 rounded-full bg-rose-500/15 justify-center items-center mb-4">
            <Flame className="text-rose-500" size={30} />
          </View>

          <Text className="text-rose-500 font-extrabold text-xs tracking-widest uppercase mb-1">
            PROVOCAÇÃO RECEBIDA DO BRO!
          </Text>

          <Text className="text-white text-xl font-black text-center my-2">
            {activeIncomingNudge.sender_name} manda avisar:
          </Text>

          {/* Card da Frase */}
          <View className="bg-slate-950 w-full p-5 rounded-2xl border border-slate-800 my-3">
            <Text className="text-slate-100 font-bold text-base text-center italic leading-relaxed">
              "{activeIncomingNudge.nudge_text}"
            </Text>
          </View>

          {/* Botão de Ouvir de Novo */}
          <TouchableOpacity
            className="flex-row items-center gap-2 bg-amber-400/15 px-4 py-2.5 rounded-xl border border-amber-400 my-2"
            onPress={handleReplayAudio}
            activeOpacity={0.8}
          >
            <Volume2 className="text-amber-400" size={18} />
            <Text className="text-amber-400 font-bold text-xs uppercase">OUVIR EM ÁUDIO NOVAMENTE</Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View className="w-full gap-3 mt-4">
            <TouchableOpacity
              className="bg-blue-600 py-3.5 px-4 rounded-xl flex-row justify-center items-center gap-2"
              onPress={() => {
                handleClose();
                if (onReplyPress) onReplyPress();
              }}
              activeOpacity={0.8}
            >
              <MessageSquareReply className="text-white" size={18} />
              <Text className="text-white font-bold text-sm uppercase">REVIDAR AGORA</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-slate-800/60 py-3 px-4 rounded-xl flex-row justify-center items-center gap-2 border border-slate-800"
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X className="text-slate-400" size={18} />
              <Text className="text-slate-300 font-semibold text-xs uppercase">ENGOLIR & FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
