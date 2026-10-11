import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { Platform } from 'react-native';

// Configuração padrão de exibição em primeiro plano
if (Platform.OS !== 'web') {
  try {
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (err) {
    console.warn('Falha ao configurar handler de notificações:', err);
  }
}

export class NotificationService {
  private static isInitialized = false;

  /**
   * Configura o canal de notificação para Android e solicita permissões
   */
  public static async init(): Promise<boolean> {
    if (this.isInitialized) return true;
    if (Platform.OS === 'web') {
      this.isInitialized = true;
      return false;
    }

    try {
      if (Platform.OS === 'android') {
        try {
          await setNotificationChannelAsync('gymbros_workouts', {
            name: 'Treinos da Equipe',
            importance: AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#0A84FF',
            sound: 'default',
          });
        } catch (channelError) {
          // No Expo Go ou em ambientes sem NotificationsChannelsProvider nativo registrado
          console.warn('Canal de notificação Android ignorado:', channelError);
        }
      }

      const { status: existingStatus } = await getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await requestPermissionsAsync();
        finalStatus = status;
      }

      this.isInitialized = true;
      return finalStatus === 'granted';
    } catch (error) {
      console.warn('Erro ao inicializar serviço de notificações:', error);
      return false;
    }
  }

  /**
   * Dispara uma notificação nativa quando outro bro inicia o treino
   */
  public static async notifyWorkoutStarted(broName: string, routineName: string): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      await scheduleNotificationAsync({
        content: {
          title: 'GymBros - Treino Iniciado',
          body: `${broName} acabou de iniciar o treino de ${routineName}.`,
          sound: 'default',
          data: { type: 'WORKOUT_STARTED', broName, routineName },
        },
        trigger: null, // Dispara imediatamente
      });
    } catch (error) {
      console.warn('Erro ao agendar notificação de início de treino:', error);
    }
  }
}
