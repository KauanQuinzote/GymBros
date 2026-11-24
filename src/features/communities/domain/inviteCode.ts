import { INVITE_CODE_ALPHABET, INVITE_CODE_LENGTH } from '../types';

export function generateInviteCode(random: () => number = Math.random): string {
  let code = '';
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    code += INVITE_CODE_ALPHABET.charAt(Math.floor(random() * INVITE_CODE_ALPHABET.length));
  }
  return code;
}

export function normalizeInviteCode(raw: string): string {
  return raw.replace(/\s/g, '').toUpperCase();
}
