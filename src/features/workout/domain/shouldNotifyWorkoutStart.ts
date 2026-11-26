interface WorkoutRealtimeEvent {
  eventType: string;
  session: { user_id?: string; status?: string } | null;
}

/**
 * Notifica apenas quando outro bro da comunidade ativa inicia um treino.
 * memberIds undefined (sem CommunityProvider) nao filtra por comunidade.
 */
export function shouldNotifyWorkoutStart(
  event: WorkoutRealtimeEvent,
  activeProfileId: string | undefined,
  memberIds: ReadonlySet<string> | undefined
): boolean {
  const { eventType, session } = event;
  if (eventType !== 'INSERT' || session?.status !== 'in_progress') return false;
  if (!session.user_id || session.user_id === activeProfileId) return false;
  return memberIds === undefined || memberIds.has(session.user_id);
}
