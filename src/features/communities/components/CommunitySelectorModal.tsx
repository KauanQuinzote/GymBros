import React from 'react';
import { View, ScrollView } from 'react-native';
import { useCommunity } from '../context/CommunityContext';
import { CommunitySheetShell } from './CommunitySheetShell';
import { CommunityList } from './CommunityList';
import { CommunityMembersList } from './CommunityMembersList';
import { InviteCodeCard } from './InviteCodeCard';
import { LeaveCommunityButton } from './LeaveCommunityButton';
import { useCommunitySheets } from './CommunityActions';

interface CommunitySelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CommunitySelectorModal: React.FC<CommunitySelectorModalProps> = ({
  visible,
  onClose,
}) => {
  const { activeCommunity } = useCommunity();
  const { buttons, sheets } = useCommunitySheets();

  return (
    <CommunitySheetShell visible={visible} title="Suas comunidades" onClose={onClose}>
      <ScrollView className="max-h-96 mb-4">
        <View className="gap-4">
          <CommunityList onSelected={onClose} />
          {activeCommunity && (
            <>
              <InviteCodeCard code={activeCommunity.invite_code} />
              <CommunityMembersList />
              <LeaveCommunityButton
                key={activeCommunity.id}
                communityId={activeCommunity.id}
                communityName={activeCommunity.name}
              />
            </>
          )}
        </View>
      </ScrollView>
      {buttons}
      {/* Aninhadas no modal: o iOS nao apresenta modais irmaos ao mesmo tempo. */}
      {sheets}
    </CommunitySheetShell>
  );
};
