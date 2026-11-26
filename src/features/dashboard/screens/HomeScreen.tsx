import React from 'react';
import { View, ScrollView } from 'react-native';
import { useAuth } from '../../auth/context/AuthContext';
import { useWorkout } from '../../workout/context/WorkoutContext';
import { NeonBroPresenceWidget } from '../../gamification';
import {
  CommunityEmptyState,
  CommunityHeaderButton,
  scopeToCommunity,
  useCommunity,
} from '../../communities';
import { HeaderBar } from '../../../shared/components/HeaderBar';
import { ActiveWorkoutBanner } from '../components/ActiveWorkoutBanner';
import { LeaderboardCard } from '../components/LeaderboardCard';
import { QuickRoutinesList } from '../components/QuickRoutinesList';

interface HomeScreenProps {
  onNavigateToWorkout: () => void;
  onNavigateToRoutines: () => void;
  onNavigateToHistory: () => void;
  onNavigateToChilling?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToWorkout,
  onNavigateToRoutines,
  onNavigateToChilling,
}) => {
  const { activeProfile, profiles } = useAuth();
  const { activeSession, routines, startWorkout } = useWorkout();
  const { memberIds } = useCommunity();

  if (!activeProfile) return null;

  const communityProfiles = scopeToCommunity(profiles, memberIds ?? null, (p) => p.id);

  return (
    <View className="flex-1 bg-slate-950">
      <HeaderBar />
      <CommunityHeaderButton />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <CommunityEmptyState />
        <NeonBroPresenceWidget onNavigateToChilling={onNavigateToChilling} />
        {activeSession && (
          <ActiveWorkoutBanner session={activeSession} onNavigate={onNavigateToWorkout} />
        )}
        <LeaderboardCard profiles={communityProfiles} activeProfile={activeProfile} />
        <QuickRoutinesList
          routines={routines}
          onSeeAll={onNavigateToRoutines}
          onStartRoutine={async (routine) => {
            await startWorkout(routine);
            onNavigateToWorkout();
          }}
        />
      </ScrollView>
    </View>
  );
};
