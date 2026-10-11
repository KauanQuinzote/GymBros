import './global.css';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth, ProfileSelectScreen } from './src/features/auth';
import { WorkoutProvider, useWorkout, ActiveWorkoutScreen } from './src/features/workout';
import { HomeScreen } from './src/features/dashboard';
import { RoutinesScreen } from './src/features/routines';
import { HistoryScreen } from './src/features/history';
import { BromanceProvider, BromanceScreen, NudgeModal } from './src/features/bromance';
import { Home, Dumbbell, Calendar, Award, Flame } from 'lucide-react-native';

type TabType = 'home' | 'workout' | 'routines' | 'chilling' | 'history';

const MainNavigation: React.FC = () => {
  const { activeProfile } = useAuth();
  const { activeSession } = useWorkout();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  if (!activeProfile) {
    return <ProfileSelectScreen />;
  }

  if (activeSession && activeTab === 'workout') {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <NudgeModal onReplyPress={() => setActiveTab('chilling')} />
        <ActiveWorkoutScreen onFinish={() => setActiveTab('home')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" backgroundColor="#0A0D14" />
      <NudgeModal onReplyPress={() => setActiveTab('chilling')} />

      {/* Main Content Area */}
      <View className="flex-1">
        {activeTab === 'home' && (
          <HomeScreen
            onNavigateToWorkout={() => setActiveTab('workout')}
            onNavigateToRoutines={() => setActiveTab('routines')}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        )}
        {activeTab === 'workout' && !activeSession && (
          <RoutinesScreen onStartWorkout={() => setActiveTab('workout')} />
        )}
        {activeTab === 'routines' && (
          <RoutinesScreen onStartWorkout={() => setActiveTab('workout')} />
        )}
        {activeTab === 'chilling' && <BromanceScreen />}
        {activeTab === 'history' && <HistoryScreen />}
      </View>

      {/* Bottom Navigation Bar */}
      <View className="flex-row bg-slate-900 border-t border-slate-800 py-2.5 px-2 justify-around">
        <TouchableOpacity
          className={`items-center py-1 px-2.5 rounded-xl ${activeTab === 'home' ? 'bg-slate-950' : ''}`}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}
        >
          <Home color={activeTab === 'home' ? '#0A84FF' : '#64748B'} size={18} />
          <Text className={`text-[10px] font-semibold mt-1 ${activeTab === 'home' ? 'text-blue-500 font-bold' : 'text-slate-400'}`}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`items-center py-1 px-2.5 rounded-xl ${activeTab === 'workout' ? 'bg-slate-950' : ''}`}
          onPress={() => setActiveTab('workout')}
          activeOpacity={0.7}
        >
          <View className={activeSession ? 'border-2 border-emerald-500 rounded-xl p-0.5' : ''}>
            <Dumbbell color={activeTab === 'workout' ? '#0A84FF' : '#64748B'} size={18} />
          </View>
          <Text className={`text-[10px] font-semibold mt-1 ${activeTab === 'workout' ? 'text-blue-500 font-bold' : 'text-slate-400'}`}>
            {activeSession ? 'Em Treino' : 'Treinar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`items-center py-1 px-2.5 rounded-xl ${activeTab === 'routines' ? 'bg-slate-950' : ''}`}
          onPress={() => setActiveTab('routines')}
          activeOpacity={0.7}
        >
          <Calendar color={activeTab === 'routines' ? '#0A84FF' : '#64748B'} size={18} />
          <Text className={`text-[10px] font-semibold mt-1 ${activeTab === 'routines' ? 'text-blue-500 font-bold' : 'text-slate-400'}`}>
            Fichas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`items-center py-1 px-2.5 rounded-xl ${activeTab === 'chilling' ? 'bg-slate-950' : ''}`}
          onPress={() => setActiveTab('chilling')}
          activeOpacity={0.7}
        >
          <Flame color={activeTab === 'chilling' ? '#FF453A' : '#64748B'} size={18} />
          <Text className={`text-[10px] font-semibold mt-1 ${activeTab === 'chilling' ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
            Chilling
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`items-center py-1 px-2.5 rounded-xl ${activeTab === 'history' ? 'bg-slate-950' : ''}`}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Award color={activeTab === 'history' ? '#0A84FF' : '#64748B'} size={18} />
          <Text className={`text-[10px] font-semibold mt-1 ${activeTab === 'history' ? 'text-blue-500 font-bold' : 'text-slate-400'}`}>
            Conquistas
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#0A0D14' }}>
      <AuthProvider>
        <WorkoutProvider>
          <BromanceProvider>
            <MainNavigation />
          </BromanceProvider>
        </WorkoutProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
