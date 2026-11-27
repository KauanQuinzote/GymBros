/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BroProfile } from '../../../shared/types';
import { CreateProfileModal } from '../components/CreateProfileModal';
import { PinLoginModal } from '../components/PinLoginModal';

jest.mock('lucide-react-native', () => ({
  Delete: () => null,
  UserPlus: () => null,
  X: () => null,
}));

const profile: BroProfile = {
  id: 'profile-1',
  name: 'Ana Silva',
  initials: 'AS',
  avatar_color: '#0A84FF',
  pin_code: '1234',
  bro_points: 20,
  streak: 2,
};

describe('Auth components - PIN e cadastro', () => {
  it('chama o sucesso ao digitar o PIN correto de quatro dígitos', () => {
    const onSuccess = jest.fn();
    render(
      <PinLoginModal
        visible
        profile={profile}
        onClose={jest.fn()}
        onSuccess={onSuccess}
      />
    );

    for (const digit of ['1', '2', '3', '4']) {
      fireEvent.click(screen.getByText(digit));
    }

    expect(onSuccess).toHaveBeenCalledWith(profile.id, profile.pin_code);
    expect(screen.queryByText('PIN incorreto. Tente novamente.')).toBeNull();
  });

  it('mostra erro e permite tentar novamente quando o PIN está incorreto', () => {
    const onSuccess = jest.fn();
    render(
      <PinLoginModal
        visible
        profile={profile}
        onClose={jest.fn()}
        onSuccess={onSuccess}
      />
    );

    for (const digit of ['0', '0', '0', '0']) {
      fireEvent.click(screen.getByText(digit));
    }

    expect(screen.getByText('PIN incorreto. Tente novamente.')).toBeTruthy();
    expect(onSuccess).not.toHaveBeenCalled();

    for (const digit of ['1', '2', '3', '4']) {
      fireEvent.click(screen.getByText(digit));
    }

    expect(onSuccess).toHaveBeenCalledWith(profile.id, profile.pin_code);
    expect(screen.queryByText('PIN incorreto. Tente novamente.')).toBeNull();
  });

  it('impede cadastro sem nome ou PIN completo e envia os dados do novo perfil', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();
    render(<CreateProfileModal visible onClose={onClose} onSubmit={onSubmit} />);

    const submitButton = screen.getByText('Cadastrar Bro');
    fireEvent.click(submitButton);
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText('Nome Completo'), {
      target: { value: ' Bruno Costa ' },
    });
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: ' bruno@example.com ' },
    });
    fireEvent.change(screen.getByPlaceholderText('PIN de Acesso (4 dígitos)'), {
      target: { value: '123' },
    });
    fireEvent.click(submitButton);
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText('PIN de Acesso (4 dígitos)'), {
      target: { value: '5678' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Bruno Costa',
        email: 'bruno@example.com',
        pin_code: '5678',
        initials: 'BC',
        avatar_color: '#0A84FF',
      });
    });
    expect(onClose).toHaveBeenCalled();
  });
});
