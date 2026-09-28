import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BroRecipientSelector } from '../components/BroRecipientSelector';
import { CustomTtsInput } from '../components/CustomTtsInput';
import { useAuth } from '../../auth/context/AuthContext';
import { useBromance } from '../context/BromanceContext';
import { SpeechService } from '../services/speechService';

jest.mock('../../auth/context/AuthContext');
jest.mock('../context/BromanceContext');
jest.mock('lucide-react-native', () => ({
  Users: () => null,
  User: () => null,
  Mic: () => null,
  Send: () => null,
  Volume2: () => null,
  Sparkles: () => null,
  Music: () => null,
  Link: () => null,
  Search: () => null,
  Play: () => null,
}));
jest.mock('../services/speechService', () => ({
  SpeechService: {
    speak: jest.fn(),
    stop: jest.fn(),
  },
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedUseBromance = useBromance as jest.MockedFunction<typeof useBromance>;

describe('Chilling Components Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      activeProfile: {
        id: 'user-1',
        name: 'Kauan Domingues',
        initials: 'KD',
        avatar_color: '#0A84FF',
        pin_code: '1234',
        bro_points: 100,
        streak: 3,
      },
      partnerProfile: null,
      profiles: [
        {
          id: 'user-1',
          name: 'Kauan Domingues',
          initials: 'KD',
          avatar_color: '#0A84FF',
          pin_code: '1234',
          bro_points: 100,
          streak: 3,
        },
        {
          id: 'user-2',
          name: 'Lucas Bro',
          initials: 'LB',
          avatar_color: '#00F0FF',
          pin_code: '1234',
          bro_points: 80,
          streak: 2,
        },
      ],
      isPartnerOnline: false,
      partnerStatus: 'OFFLINE',
      onlineBros: [],
      loginWithPin: jest.fn(),
      logout: jest.fn(),
      addBroPoints: jest.fn(),
      incrementStreak: jest.fn(),
      registerProfile: jest.fn(),
      loadProfiles: jest.fn(),
      isLoading: false,
    });

    mockedUseBromance.mockReturnValue({
      nudgeHistory: [],
      activeIncomingNudge: null,
      sendNudge: jest.fn().mockResolvedValue(undefined),
      dismissIncomingNudge: jest.fn().mockResolvedValue(undefined),
    });
  });

  describe('BroRecipientSelector', () => {
    it('should render "Todos os Bros" and list other profiles', () => {
      const onSelect = jest.fn();
      render(
        <BroRecipientSelector
          selectedRecipientId={null}
          onSelectRecipient={onSelect}
        />
      );

      expect(screen.getAllByText('Todos os Bros').length).toBeGreaterThan(0);
      expect(screen.getByText('Lucas')).toBeTruthy();
    });

    it('should call onSelectRecipient when a bro chip is clicked', () => {
      const onSelect = jest.fn();
      render(
        <BroRecipientSelector
          selectedRecipientId={null}
          onSelectRecipient={onSelect}
        />
      );

      const broChip = screen.getByText('Lucas');
      fireEvent.click(broChip);

      expect(onSelect).toHaveBeenCalledWith('user-2');
    });
  });

  describe('CustomTtsInput', () => {
    it('should render text input and trigger onSendCustomTts', async () => {
      const onSend = jest.fn().mockResolvedValue(undefined);
      render(<CustomTtsInput onSendCustomTts={onSend} />);

      const input = screen.getByPlaceholderText(/Digite a frase que a voz sintetizada vai falar/i);
      fireEvent.change(input, { target: { value: 'Bora puxar ferro!' } });

      const sendButton = screen.getByText(/ENVIAR E FALAR NO APP DO BRO/i);
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(onSend).toHaveBeenCalledWith('Bora puxar ferro!');
      });
    });

    it('should trigger SpeechService speak on preview button click', () => {
      const onSend = jest.fn();
      render(<CustomTtsInput onSendCustomTts={onSend} />);

      const input = screen.getByPlaceholderText(/Digite a frase que a voz sintetizada vai falar/i);
      fireEvent.change(input, { target: { value: 'Testando áudio' } });

      const testVoiceButton = screen.getByText('Testar Voz');
      fireEvent.click(testVoiceButton);

      expect(SpeechService.speak).toHaveBeenCalledWith('Testando áudio');
    });
  });
});
