import { isSupabaseConfigured, supabase } from '../../../shared/services/supabaseClient';
import { CommunityRepository } from './CommunityRepository';
import { LocalCommunityRepository } from './LocalCommunityRepository';
import { SupabaseCommunityRepository } from './SupabaseCommunityRepository';

export * from './CommunityRepository';
export * from './InMemoryCommunityRepository';
export * from './LocalCommunityRepository';
export * from './SupabaseCommunityRepository';
export * from '../domain/inviteCode';
export * from '../domain/scopeToCommunity';

export function createCommunityRepository(): CommunityRepository {
  return isSupabaseConfigured && supabase
    ? new SupabaseCommunityRepository(supabase)
    : new LocalCommunityRepository();
}
