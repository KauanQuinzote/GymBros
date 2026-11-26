/**
 * Mantem apenas os itens de membros da comunidade ativa.
 * memberIds null (sem comunidade ativa ou ainda nao carregada) nao filtra nada.
 */
export function scopeToCommunity<T>(
  items: T[],
  memberIds: ReadonlySet<string> | string[] | null,
  getUserId: (item: T) => string
): T[] {
  if (memberIds === null) {
    return items;
  }
  const members: ReadonlySet<string> = new Set(memberIds);
  return items.filter((item) => members.has(getUserId(item)));
}
