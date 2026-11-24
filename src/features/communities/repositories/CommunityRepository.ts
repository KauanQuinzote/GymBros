import {
  Community,
  CommunityMember,
  CreateCommunityPayload,
  JoinCommunityPayload,
} from '../types';

export type CommunityErrorCode = 'INVALID_INPUT' | 'INVALID_INVITE_CODE' | 'NOT_FOUND' | 'UNKNOWN';

export class CommunityError extends Error {
  constructor(public readonly code: CommunityErrorCode, message: string) {
    super(message);
    this.name = 'CommunityError';
  }
}

/**
 * Contrato de persistencia de comunidades (Repository Pattern).
 * Implementacoes: InMemory (testes), Local (AsyncStorage, offline) e Supabase (producao).
 * Todas validam a entrada com zod e lancam CommunityError em caso de falha.
 */
export interface CommunityRepository {
  /** Cria a comunidade com codigo unico e adiciona o criador como admin. */
  create(payload: CreateCommunityPayload): Promise<Community>;
  /** Ingressa pelo codigo (normalizado). Idempotente. Lanca INVALID_INVITE_CODE se nao existir. */
  join(payload: JoinCommunityPayload): Promise<Community>;
  /** Comunidades das quais o usuario e membro, ordenadas por nome. */
  listForUser(userId: string): Promise<Community[]>;
  /** Membros de uma comunidade. */
  listMembers(communityId: string): Promise<CommunityMember[]>;
  /** Remove a associacao do usuario. */
  leave(communityId: string, userId: string): Promise<void>;
}
