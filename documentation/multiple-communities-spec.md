# Especificação Técnica: Múltiplas Comunidades de Bros (Issue #7)

Decisões de arquitetura: [ADR 006](../docs/adr/006-multiple-communities.md).

## 1. Visão Geral
Permitir que um bro crie comunidades, convide outros bros por um código de 6 caracteres, participe de várias comunidades e alterne entre elas. Ranking, presença, notificações de início de treino e destinatários de provocações passam a considerar apenas os membros da comunidade ativa.

## 2. Requisitos Funcionais
| ID | Requisito |
|---|---|
| RF01 | O bro cria uma comunidade informando nome (3–50 caracteres) e descrição opcional (até 140). |
| RF02 | Ao criar, o sistema gera um código de convite único de 6 caracteres e adiciona o criador como `admin`. |
| RF03 | O bro ingressa em uma comunidade informando o código (case-insensitive, espaços ignorados). Código inexistente é rejeitado com mensagem clara. |
| RF04 | Ingressar numa comunidade da qual já é membro não duplica a associação (idempotente). |
| RF05 | O bro lista suas comunidades e seleciona uma como ativa; a seleção persiste entre aberturas do app. |
| RF06 | Sem nenhuma comunidade, a Home exibe um estado vazio com as ações "Criar comunidade" e "Entrar com código". |
| RF07 | O bro visualiza os membros da comunidade ativa, com destaque para administradores. |
| RF08 | O bro pode sair de uma comunidade. |
| RF09 | Ranking, widget de presença e seletor de destinatários exibem apenas membros da comunidade ativa. |
| RF10 | A notificação de início de treino só é disparada se o bro que iniciou for membro da comunidade ativa. |

## 3. Requisitos Não Funcionais
- RNF01: Funcionar sem Supabase configurado (fallback local via AsyncStorage).
- RNF02: Componentes de UI com menos de 100 LOC (docs/RULES.md); sem emojis; ícones `lucide-react-native` (`Users`, `Plus`, `Key`, `ShieldCheck`).
- RNF03: Paleta Tailwind padrão (CONTEXT.md) — sem hexadecimais arbitrários em classes.
- RNF04: Validação de entrada com `zod` antes de chegar ao repositório.
- RNF05: Domínio coberto por testes unitários com `InMemoryCommunityRepository`.

## 4. Modelo de Dados
Ver `supabase/migrations/20261124000000_create_communities.sql`.

```
communities 1 ──< community_members >── 1 profiles
```

## 5. Arquitetura de Código
```
src/features/communities/
  types/index.ts                         # schemas zod + tipos
  domain/inviteCode.ts                   # geração/normalização do código
  domain/scopeToCommunity.ts             # filtro puro por membros
  repositories/CommunityRepository.ts    # interface + erros
  repositories/InMemoryCommunityRepository.ts
  repositories/LocalCommunityRepository.ts
  repositories/SupabaseCommunityRepository.ts
  context/CommunityContext.tsx           # comunidade ativa, memberIds, ações
  components/CommunitySelectorModal.tsx
  components/CreateCommunitySheet.tsx
  components/JoinCommunitySheet.tsx
  components/CommunityMembersList.tsx
  components/CommunityEmptyState.tsx
  components/CommunityHeaderButton.tsx
  index.ts
```
Ordem dos providers: `Auth > Community > Workout > Chilling`.

## 6. Plano de Testes
- `should create new community and add creator as admin member`
- `should reject join with invalid invite code`
- `should isolate workouts between members of distinct communities`
- join idempotente; normalização do código; validação de nome; sair da comunidade; listar só as minhas.
- `scopeToCommunity` filtra perfis e presenças.
- Notificação de treino não dispara para não-membros.

## 7. Fora do Escopo
- RLS restritivo com `auth.uid()` (depende de Supabase Auth — issue separada).
- Regenerar código de convite, remover membros por admin, link profundo de convite.
