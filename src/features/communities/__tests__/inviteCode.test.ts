import { generateInviteCode, normalizeInviteCode } from '../domain/inviteCode';
import { INVITE_CODE_ALPHABET, INVITE_CODE_LENGTH } from '../types';

describe('generateInviteCode', () => {
  it('should generate a code with 6 characters from the alphabet', () => {
    for (let i = 0; i < 200; i++) {
      const code = generateInviteCode();
      expect(code).toHaveLength(INVITE_CODE_LENGTH);
      expect([...code].every((char) => INVITE_CODE_ALPHABET.includes(char))).toBe(true);
    }
  });

  it('should map the random source to the alphabet boundaries', () => {
    expect(generateInviteCode(() => 0)).toBe('AAAAAA');
    expect(generateInviteCode(() => 0.999999)).toBe('999999');
  });
});

describe('normalizeInviteCode', () => {
  it('should uppercase and remove all whitespace', () => {
    expect(normalizeInviteCode('  ab c\td2\n3 ')).toBe('ABCD23');
  });
});
