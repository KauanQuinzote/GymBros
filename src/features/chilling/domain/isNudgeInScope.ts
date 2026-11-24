import type { ChillingNudgeLog } from '../types';

/**
 * Broadcasts ('ALL') so valem se o remetente for membro da comunidade ativa.
 * Provocacoes diretas sempre chegam. memberIds undefined (sem provider) nao filtra.
 */
export function isNudgeInScope(
  nudge: Pick<ChillingNudgeLog, 'sender_id' | 'receiver_id'>,
  memberIds: ReadonlySet<string> | undefined
): boolean {
  if (nudge.receiver_id !== 'ALL' || !memberIds) return true;
  return memberIds.has(nudge.sender_id);
}
