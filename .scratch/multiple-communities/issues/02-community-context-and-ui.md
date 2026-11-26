# 02: CommunityContext e interface (seletor, criar, entrar, membros)

**What to build:** `CommunityProvider` com comunidade ativa persistida; componentes `CommunitySelectorModal`, `CreateCommunitySheet`, `JoinCommunitySheet`, `CommunityMembersList`, `CommunityEmptyState`, `CommunityHeaderButton` (<100 LOC cada).

**Blocked by:** 01

**Status:** ready-for-agent

## Acceptance Criteria
- [ ] Seleção da comunidade ativa persiste no AsyncStorage.
- [ ] Criar comunidade exibe o código gerado.
- [ ] Entrar com código inválido exibe erro.
- [ ] Estado vazio na Home quando o bro não tem comunidade.
