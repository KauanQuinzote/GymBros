import type { SupabaseClient } from '@supabase/supabase-js';
import { Community, CommunityMember, CreateCommunityPayload, JoinCommunityPayload } from '../types';
import { CommunityError, CommunityRepository } from './CommunityRepository';
import {
  invalidInviteCodeError,
  parseCreatePayload,
  parseJoinPayload,
} from './InMemoryCommunityRepository';

/** Linha de public.communities: description e created_by podem ser NULL no banco. */
type CommunityRow = Omit<Community, 'description' | 'created_by'> & {
  description: string | null;
  created_by: string | null;
};

const toCommunity = (row: CommunityRow): Community => ({
  id: row.id,
  name: row.name,
  description: row.description ?? undefined,
  invite_code: row.invite_code,
  created_by: row.created_by ?? '',
  created_at: row.created_at,
});

const unknownError = (message: string): CommunityError => new CommunityError('UNKNOWN', message);

export class SupabaseCommunityRepository implements CommunityRepository {
  constructor(private readonly client: SupabaseClient) {}

  async create(payload: CreateCommunityPayload): Promise<Community> {
    const { name, description, created_by } = parseCreatePayload(payload);
    const { data, error } = await this.client.rpc('create_community', {
      p_name: name,
      p_description: description ?? null,
      p_user_id: created_by,
    });
    if (error || !data) {
      throw unknownError(error?.message ?? 'Nao foi possivel criar a comunidade');
    }
    return toCommunity(data as CommunityRow);
  }

  async join(payload: JoinCommunityPayload): Promise<Community> {
    const { invite_code, user_id } = parseJoinPayload(payload);
    const { data, error } = await this.client.rpc('join_community', {
      p_invite_code: invite_code,
      p_user_id: user_id,
    });
    if (error?.message.includes('INVALID_INVITE_CODE')) {
      throw invalidInviteCodeError();
    }
    if (error || !data) {
      throw unknownError(error?.message ?? 'Nao foi possivel entrar na comunidade');
    }
    return toCommunity(data as CommunityRow);
  }

  async listForUser(userId: string): Promise<Community[]> {
    const { data, error } = await this.client
      .from('community_members')
      .select('communities(*)')
      .eq('user_id', userId);
    if (error) {
      throw unknownError(error.message);
    }
    const rows = (data ?? []) as unknown as { communities: CommunityRow | null }[];
    return rows
      .flatMap(({ communities }) => (communities ? [toCommunity(communities)] : []))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async listMembers(communityId: string): Promise<CommunityMember[]> {
    const { data, error } = await this.client
      .from('community_members')
      .select('*')
      .eq('community_id', communityId);
    if (error) {
      throw unknownError(error.message);
    }
    return (data ?? []) as CommunityMember[];
  }

  async leave(communityId: string, userId: string): Promise<void> {
    const { error } = await this.client
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', userId);
    if (error) {
      throw unknownError(error.message);
    }
  }
}
