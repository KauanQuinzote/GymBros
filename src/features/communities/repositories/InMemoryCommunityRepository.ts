import { generateInviteCode, normalizeInviteCode } from '../domain/inviteCode';
import {
  Community,
  CommunityMember,
  CommunityRole,
  CreateCommunityPayload,
  CreateCommunityPayloadSchema,
  JoinCommunityPayload,
  JoinCommunityPayloadSchema,
} from '../types';
import { CommunityError, CommunityRepository } from './CommunityRepository';

const MAX_CODE_ATTEMPTS = 100;

/** Valida e limpa a entrada de criacao; compartilhado por todas as implementacoes. */
export function parseCreatePayload(payload: CreateCommunityPayload): CreateCommunityPayload {
  const result = CreateCommunityPayloadSchema.safeParse(payload);
  if (!result.success) {
    throw new CommunityError('INVALID_INPUT', result.error.issues[0].message);
  }
  const { name, description, created_by } = result.data;
  return { name, description: description || undefined, created_by };
}

/** Normaliza o codigo antes de validar a entrada de ingresso. */
export function parseJoinPayload(payload: JoinCommunityPayload): JoinCommunityPayload {
  const result = JoinCommunityPayloadSchema.safeParse({
    ...payload,
    invite_code: normalizeInviteCode(payload.invite_code),
  });
  if (!result.success) {
    throw new CommunityError('INVALID_INPUT', result.error.issues[0].message);
  }
  return result.data;
}

export const invalidInviteCodeError = (): CommunityError =>
  new CommunityError('INVALID_INVITE_CODE', 'Codigo de convite invalido');

export interface InMemoryCommunityRepositoryOptions {
  now?: () => string;
  generateId?: () => string;
  generateCode?: () => string;
}

export interface CommunityState {
  communities: Community[];
  members: CommunityMember[];
}

const defaultGenerateId = (): string =>
  `community-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export class InMemoryCommunityRepository implements CommunityRepository {
  private communities: Community[];
  private members: CommunityMember[];
  private readonly now: () => string;
  private readonly generateId: () => string;
  private readonly generateCode: () => string;

  constructor(options: InMemoryCommunityRepositoryOptions = {}, initialState?: CommunityState) {
    this.now = options.now ?? (() => new Date().toISOString());
    this.generateId = options.generateId ?? defaultGenerateId;
    this.generateCode = options.generateCode ?? (() => generateInviteCode());
    this.communities = [...(initialState?.communities ?? [])];
    this.members = [...(initialState?.members ?? [])];
  }

  /** Copia do estado atual, usada por implementacoes que persistem em outro lugar. */
  getState(): CommunityState {
    return { communities: [...this.communities], members: [...this.members] };
  }

  async create(payload: CreateCommunityPayload): Promise<Community> {
    const { name, description, created_by } = parseCreatePayload(payload);
    const community: Community = {
      id: this.generateId(),
      name,
      description,
      invite_code: this.nextUniqueCode(),
      created_by,
      created_at: this.now(),
    };
    this.communities.push(community);
    this.addMember(community.id, created_by, 'admin');
    return community;
  }

  async join(payload: JoinCommunityPayload): Promise<Community> {
    const { invite_code, user_id } = parseJoinPayload(payload);
    const community = this.communities.find((c) => c.invite_code === invite_code);
    if (!community) {
      throw invalidInviteCodeError();
    }
    if (!this.members.some((m) => m.community_id === community.id && m.user_id === user_id)) {
      this.addMember(community.id, user_id, 'member');
    }
    return community;
  }

  async listForUser(userId: string): Promise<Community[]> {
    const mine = new Set(
      this.members.filter((m) => m.user_id === userId).map((m) => m.community_id)
    );
    return this.communities
      .filter((c) => mine.has(c.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async listMembers(communityId: string): Promise<CommunityMember[]> {
    return this.members.filter((m) => m.community_id === communityId);
  }

  async leave(communityId: string, userId: string): Promise<void> {
    this.members = this.members.filter(
      (m) => !(m.community_id === communityId && m.user_id === userId)
    );
  }

  private addMember(communityId: string, userId: string, role: CommunityRole): void {
    this.members.push({
      community_id: communityId,
      user_id: userId,
      role,
      joined_at: this.now(),
    });
  }

  private nextUniqueCode(): string {
    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const code = this.generateCode();
      if (!this.communities.some((c) => c.invite_code === code)) {
        return code;
      }
    }
    throw new CommunityError('UNKNOWN', 'Nao foi possivel gerar um codigo de convite unico');
  }
}
