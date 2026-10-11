import { NotificationService } from '../services/notifications';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notif_123'),
  AndroidImportance: {
    HIGH: 4,
  },
}));

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize and request permissions on native platforms', async () => {
    Platform.OS = 'android';
    const granted = await NotificationService.init();

    expect(granted).toBe(true);
    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      'gymbros_workouts',
      expect.objectContaining({
        name: 'Treinos da Equipe',
      })
    );
  });

  it('should schedule notification when bro starts workout with zero emojis', async () => {
    Platform.OS = 'android';
    await NotificationService.notifyWorkoutStarted('Fábio', 'Peito e Tríceps');

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: 'GymBros - Treino Iniciado',
        body: 'Fábio acabou de iniciar o treino de Peito e Tríceps.',
        sound: 'default',
        data: {
          type: 'WORKOUT_STARTED',
          broName: 'Fábio',
          routineName: 'Peito e Tríceps',
        },
      },
      trigger: null,
    });
  });
});
