import React from 'react';
import { View, Text } from 'react-native';
import { Users } from 'lucide-react-native';
import { useCommunity } from '../context/CommunityContext';
import { useCommunitySheets } from './CommunityActions';

/**
 * Decide sozinho quando exibir o card. Deve ficar sempre montado: assim a sheet de
 * criacao continua exibindo o codigo depois que a primeira comunidade passa a existir.
 */
export const CommunityEmptyState: React.FC = () => {
  const { communities, isLoading } = useCommunity();
  const { buttons, sheets } = useCommunitySheets();
  const showCard = !isLoading && communities.length === 0;

  return (
    <>
      {showCard && (
        <View className="bg-slate-900 rounded-3xl p-5 mx-5 my-2.5 border border-slate-800 gap-4">
          <View className="items-center gap-2">
            <Users className="text-cyan-400" size={32} />
            <Text className="text-slate-50 text-lg font-bold tracking-tight">
              Voce ainda nao tem uma comunidade
            </Text>
            <Text className="text-slate-400 text-sm text-center">
              Crie a sua ou entre com o codigo de um bro para disputar o placar juntos.
            </Text>
          </View>
          {buttons}
        </View>
      )}
      {sheets}
    </>
  );
};
