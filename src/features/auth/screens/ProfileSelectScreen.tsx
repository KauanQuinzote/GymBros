import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { BroProfile } from '../../../shared/types';
import { PinLoginModal } from '../components/PinLoginModal';
import { CreateProfileModal } from '../components/CreateProfileModal';
import { Award, ChevronRight, UserPlus, RefreshCw, Users } from 'lucide-react-native';

export const ProfileSelectScreen: React.FC = () => {
  const { profiles, loginWithPin, registerProfile, isLoading, loadProfiles } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<BroProfile | null>(null);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const handleSelect = (profile: BroProfile) => {
    setSelectedProfile(profile);
    setPinModalVisible(true);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: '#0A0D14',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
      }}
      className="bg-[#0A0D14] px-5 pt-20 pb-10"
      style={{ backgroundColor: '#0A0D14', flex: 1 }}
    >
      <View className="items-center mb-10" style={{ alignItems: 'center', marginBottom: 40 }}>
        <Text
          className="text-4xl font-extrabold text-slate-50 tracking-tight"
          style={{ fontSize: 36, fontWeight: '800', color: '#F8FAFC', letterSpacing: -0.5 }}
        >
          GymBros
        </Text>
        <Text
          className="text-slate-400 text-base mt-2 text-center"
          style={{ color: '#94A3B8', fontSize: 16, marginTop: 8, textAlign: 'center' }}
        >
          Selecione seu perfil para iniciar
        </Text>
      </View>

      {isLoading ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 16 }}>
          <ActivityIndicator size="large" color="#0A84FF" />
          <Text style={{ color: '#94A3B8', fontSize: 15, fontWeight: '500' }}>
            Carregando perfis do banco...
          </Text>
        </View>
      ) : profiles.length === 0 ? (
        <View
          style={{
            backgroundColor: '#161B26',
            borderRadius: 20,
            padding: 24,
            borderWidth: 1,
            borderColor: '#262F42',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#0A84FF15',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Users color="#0A84FF" size={28} />
          </View>

          <View style={{ alignItems: 'center', gap: 6 }}>
            <Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '700', textAlign: 'center' }}>
              Nenhum perfil encontrado
            </Text>
            <Text style={{ color: '#94A3B8', fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
              Crie o primeiro perfil de bro ou tente recarregar do banco de dados.
            </Text>
          </View>

          <View style={{ width: '100%', gap: 12, marginTop: 8 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0A84FF',
                borderRadius: 14,
                padding: 16,
                gap: 8,
              }}
              onPress={() => setCreateModalVisible(true)}
              activeOpacity={0.8}
            >
              <UserPlus color="#FFFFFF" size={18} />
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>
                Criar Novo Perfil
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1E2536',
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: '#262F42',
                gap: 8,
              }}
              onPress={() => loadProfiles()}
              activeOpacity={0.8}
            >
              <RefreshCw color="#94A3B8" size={16} />
              <Text style={{ color: '#94A3B8', fontWeight: '600', fontSize: 14 }}>
                Tentar Novamente
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="space-y-4 gap-4" style={{ gap: 16 }}>
          {profiles.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              className="flex-row items-center bg-[#161B26] rounded-2xl p-5 border border-[#262F42] gap-4"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#161B26',
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: '#262F42',
                gap: 16,
              }}
              onPress={() => handleSelect(profile)}
              activeOpacity={0.8}
            >
              <View
                style={{
                  backgroundColor: profile.avatar_color || '#0A84FF',
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                className="w-14 h-14 rounded-full justify-center items-center"
              >
                <Text className="text-white text-xl font-bold" style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700' }}>
                  {profile.initials}
                </Text>
              </View>

              <View className="flex-1" style={{ flex: 1 }}>
                <Text className="text-slate-50 text-lg font-bold tracking-tight" style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '700' }}>
                  {profile.name}
                </Text>

                <View className="flex-row items-center gap-1.5 mt-1" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Award color="#FFD60A" size={14} />
                  <Text className="text-[#FFD60A] font-semibold text-xs" style={{ color: '#FFD60A', fontWeight: '600', fontSize: 12 }}>
                    {profile.bro_points} Bro Points
                  </Text>
                </View>
              </View>

              <ChevronRight color="#64748B" size={20} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            className="flex-row items-center justify-center bg-[#161B26] border border-dashed border-[#0A84FF] rounded-2xl p-5 gap-3 mt-2"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#161B26',
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: '#0A84FF',
              borderRadius: 20,
              padding: 20,
              gap: 12,
              marginTop: 8,
            }}
            onPress={() => setCreateModalVisible(true)}
            activeOpacity={0.8}
          >
            <UserPlus color="#0A84FF" size={20} />
            <Text className="text-[#0A84FF] font-bold text-base" style={{ color: '#0A84FF', fontWeight: '700', fontSize: 16 }}>
              + Criar Perfil de Bro
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <PinLoginModal
        visible={pinModalVisible}
        profile={selectedProfile}
        onClose={() => setPinModalVisible(false)}
        onSuccess={(profileId, pin) => {
          setPinModalVisible(false);
          loginWithPin(profileId, pin);
        }}
      />

      <CreateProfileModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={async (data) => {
          const created = await registerProfile(data);
          setSelectedProfile(created);
          setCreateModalVisible(false);
        }}
      />
    </ScrollView>
  );
};
