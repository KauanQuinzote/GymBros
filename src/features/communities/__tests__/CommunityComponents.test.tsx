import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommunityEmptyState } from '../components/CommunityEmptyState';
import { CreateCommunitySheet } from '../components/CreateCommunitySheet';
import { JoinCommunitySheet } from '../components/JoinCommunitySheet';
import { CommunityMembersList } from '../components/CommunityMembersList';
import { LeaveCommunityButton } from '../components/LeaveCommunityButton';
import { CommunityContextType, useCommunity } from '../context/CommunityContext';
import { useAuth } from '../../auth/context/AuthContext';

jest.mock('../context/CommunityContext', () => ({ useCommunity: jest.fn() }));
jest.mock('../../auth/context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('lucide-react-native', () => ({
  Users: () => null,
  Plus: () => null,
  Key: () => null,
  ShieldCheck: () => null,
  X: () => null,
  Check: () => null,
  LogOut: () => null,
}));

const mockedUseCommunity = useCommunity as jest.MockedFunction<typeof useCommunity>;
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const community = {
  id: 'c-1',
  name: 'Bros do Ferro',
  invite_code: 'ABC234',
  created_by: 'user-1',
  created_at: '2026-11-24T00:00:00.000Z',
};

const buildContext = (overrides: Partial<CommunityContextType> = {}): CommunityContextType => ({
  communities: [],
  activeCommunity: null,
  members: [],
  memberIds: new Set<string>(),
  isScopeReady: true,
  isLoading: false,
  selectCommunity: jest.fn(),
  createCommunity: jest.fn(),
  joinCommunity: jest.fn(),
  leaveCommunity: jest.fn(),
  refresh: jest.fn(),
  ...overrides,
});

const EMPTY_TITLE = 'Você ainda não tem uma comunidade';

describe('Community Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseCommunity.mockReturnValue(buildContext());
  });

  describe('CommunityEmptyState', () => {
    it('should render the card and open the create sheet', () => {
      render(<CommunityEmptyState />);
      expect(screen.getByText(EMPTY_TITLE)).toBeTruthy();

      fireEvent.click(screen.getByText('Criar comunidade'));

      expect(screen.getByPlaceholderText('Nome da comunidade')).toBeTruthy();
    });

    it('should open the join sheet', () => {
      render(<CommunityEmptyState />);

      fireEvent.click(screen.getByText('Entrar com código'));

      expect(screen.getByPlaceholderText('Código de 6 caracteres')).toBeTruthy();
    });

    it('should hide the card while loading', () => {
      mockedUseCommunity.mockReturnValue(buildContext({ isLoading: true }));
      render(<CommunityEmptyState />);

      expect(screen.queryByText(EMPTY_TITLE)).toBeNull();
    });

    it('should keep the invite code visible after the first community exists', async () => {
      const createCommunity = jest.fn().mockResolvedValue(community);
      mockedUseCommunity.mockReturnValue(buildContext({ createCommunity }));
      const { rerender } = render(<CommunityEmptyState />);
      fireEvent.click(screen.getByText('Criar comunidade'));
      fireEvent.change(screen.getByPlaceholderText('Nome da comunidade'), {
        target: { value: 'Bros do Ferro' },
      });
      fireEvent.click(screen.getByText('Criar'));
      expect(await screen.findByText('ABC234')).toBeTruthy();

      mockedUseCommunity.mockReturnValue(buildContext({ communities: [community] }));
      rerender(<CommunityEmptyState />);

      expect(screen.queryByText(EMPTY_TITLE)).toBeNull();
      expect(screen.getByText('ABC234')).toBeTruthy();
    });
  });

  describe('JoinCommunitySheet', () => {
    it('should show the error message when joinCommunity rejects', async () => {
      const joinCommunity = jest.fn().mockRejectedValue(new Error('Código de convite inválido'));
      mockedUseCommunity.mockReturnValue(buildContext({ joinCommunity }));
      const onClose = jest.fn();
      render(<JoinCommunitySheet visible onClose={onClose} />);

      fireEvent.change(screen.getByPlaceholderText('Código de 6 caracteres'), {
        target: { value: 'ZZZZZZ' },
      });
      fireEvent.click(screen.getByText('Entrar'));

      expect(await screen.findByText('Código de convite inválido')).toBeTruthy();
      expect(joinCommunity).toHaveBeenCalledWith('ZZZZZZ');
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('CreateCommunitySheet', () => {
    it('should show the invite code after success', async () => {
      const createCommunity = jest.fn().mockResolvedValue(community);
      mockedUseCommunity.mockReturnValue(buildContext({ createCommunity }));
      render(<CreateCommunitySheet visible onClose={jest.fn()} />);

      fireEvent.change(screen.getByPlaceholderText('Nome da comunidade'), {
        target: { value: 'Bros do Ferro' },
      });
      fireEvent.click(screen.getByText('Criar'));

      expect(await screen.findByText('ABC234')).toBeTruthy();
      expect(screen.getByText('Compartilhe este código com seus bros')).toBeTruthy();
      expect(createCommunity).toHaveBeenCalledWith('Bros do Ferro', undefined);
    });
  });

  describe('LeaveCommunityButton', () => {
    it('should ask for confirmation before leaving', () => {
      const leaveCommunity = jest.fn();
      mockedUseCommunity.mockReturnValue(buildContext({ leaveCommunity }));
      render(<LeaveCommunityButton communityId="c-1" communityName="Bros do Ferro" />);

      fireEvent.click(screen.getByText('Sair da comunidade'));

      expect(screen.getByText('Sair de Bros do Ferro?')).toBeTruthy();
      expect(leaveCommunity).not.toHaveBeenCalled();
    });

    it('should go back without leaving when cancelled', () => {
      const leaveCommunity = jest.fn();
      mockedUseCommunity.mockReturnValue(buildContext({ leaveCommunity }));
      render(<LeaveCommunityButton communityId="c-1" communityName="Bros do Ferro" />);

      fireEvent.click(screen.getByText('Sair da comunidade'));
      fireEvent.click(screen.getByText('Cancelar'));

      expect(screen.getByText('Sair da comunidade')).toBeTruthy();
      expect(leaveCommunity).not.toHaveBeenCalled();
    });

    it('should leave the community after confirming', async () => {
      const leaveCommunity = jest.fn().mockResolvedValue(undefined);
      mockedUseCommunity.mockReturnValue(buildContext({ leaveCommunity }));
      render(<LeaveCommunityButton communityId="c-1" communityName="Bros do Ferro" />);

      fireEvent.click(screen.getByText('Sair da comunidade'));
      fireEvent.click(screen.getByText('Confirmar saída'));

      expect(await screen.findByText('Sair da comunidade')).toBeTruthy();
      expect(leaveCommunity).toHaveBeenCalledWith('c-1');
    });

    it('should show the error when leaving fails', async () => {
      const leaveCommunity = jest.fn().mockRejectedValue(new Error('Falha de rede'));
      mockedUseCommunity.mockReturnValue(buildContext({ leaveCommunity }));
      render(<LeaveCommunityButton communityId="c-1" communityName="Bros do Ferro" />);

      fireEvent.click(screen.getByText('Sair da comunidade'));
      fireEvent.click(screen.getByText('Confirmar saída'));

      expect(await screen.findByText('Falha de rede')).toBeTruthy();
    });
  });

  describe('CommunityMembersList', () => {
    it('should mark only admins', () => {
      const joined_at = community.created_at;
      mockedUseCommunity.mockReturnValue(
        buildContext({
          members: [
            { community_id: 'c-1', user_id: 'user-1', role: 'admin', joined_at },
            { community_id: 'c-1', user_id: 'user-2', role: 'member', joined_at },
          ],
        })
      );
      mockedUseAuth.mockReturnValue({
        profiles: [
          { id: 'user-1', name: 'Kauan Domingues', initials: 'KD' },
          { id: 'user-2', name: 'Lucas Bro', initials: 'LB' },
        ],
      } as unknown as ReturnType<typeof useAuth>);

      render(<CommunityMembersList />);

      expect(screen.getByText('Kauan Domingues')).toBeTruthy();
      expect(screen.getByText('Lucas Bro')).toBeTruthy();
      expect(screen.getByLabelText('Administrador: Kauan Domingues')).toBeTruthy();
      expect(screen.queryByLabelText('Administrador: Lucas Bro')).toBeNull();
    });
  });
});
