import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuração padrão de exibição em primeiro plano
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
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
        await Notifications.setNotificationChannelAsync('gymbros_workouts', {
          name: 'Treinos da Equipe',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#0A84FF',
          sound: 'default',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
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
      await Notifications.scheduleNotificationAsync({
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
