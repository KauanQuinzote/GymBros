import AsyncStorage from '@react-native-async-storage/async-storage';
import { Community, CommunityMember, CreateCommunityPayload, JoinCommunityPayload } from '../types';
import { CommunityError, CommunityRepository } from './CommunityRepository';
import {
  CommunityState,
  InMemoryCommunityRepository,
  InMemoryCommunityRepositoryOptions,
} from './InMemoryCommunityRepository';

const COMMUNITIES_KEY = '@gymbros_communities';
const MEMBERS_KEY = '@gymbros_community_members';

/**
 * Fila compartilhada entre instancias: cada operacao le e regrava o estado inteiro,
 * entao execucoes concorrentes perderiam escritas.
 */
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task);
  queue = result.catch(() => undefined);
  return result;
}

/** Falha de leitura nao vira estado vazio, para nunca sobrescrever dados existentes. */
async function loadState(): Promise<CommunityState> {
  try {
    const communities = await AsyncStorage.getItem(COMMUNITIES_KEY);
    const members = await AsyncStorage.getItem(MEMBERS_KEY);
    return {
      communities: communities ? JSON.parse(communities) : [],
      members: members ? JSON.parse(members) : [],
    };
  } catch {
    throw new CommunityError('UNKNOWN', 'Nao foi possivel ler as comunidades salvas');
  }
}

async function saveState({ communities, members }: CommunityState): Promise<void> {
  try {
    await AsyncStorage.multiSet([
      [COMMUNITIES_KEY, JSON.stringify(communities)],
      [MEMBERS_KEY, JSON.stringify(members)],
    ]);
  } catch {
    throw new CommunityError('UNKNOWN', 'Nao foi possivel salvar as comunidades');
  }
}

/** Fallback offline: carrega o estado, aplica as regras do InMemory e persiste. */
export class LocalCommunityRepository implements CommunityRepository {
  constructor(private readonly options: InMemoryCommunityRepositoryOptions = {}) {}

  create(payload: CreateCommunityPayload): Promise<Community> {
    return this.write((repository) => repository.create(payload));
  }

  join(payload: JoinCommunityPayload): Promise<Community> {
    return this.write((repository) => repository.join(payload));
  }

  listForUser(userId: string): Promise<Community[]> {
    return this.read((repository) => repository.listForUser(userId));
  }

  listMembers(communityId: string): Promise<CommunityMember[]> {
    return this.read((repository) => repository.listMembers(communityId));
  }

  leave(communityId: string, userId: string): Promise<void> {
    return this.write((repository) => repository.leave(communityId, userId));
  }

  private read<T>(operation: (repository: InMemoryCommunityRepository) => Promise<T>): Promise<T> {
    return enqueue(async () =>
      operation(new InMemoryCommunityRepository(this.options, await loadState()))
    );
  }

  private write<T>(operation: (repository: InMemoryCommunityRepository) => Promise<T>): Promise<T> {
    return enqueue(async () => {
      const repository = new InMemoryCommunityRepository(this.options, await loadState());
      const result = await operation(repository);
      await saveState(repository.getState());
      return result;
    });
  }
}
