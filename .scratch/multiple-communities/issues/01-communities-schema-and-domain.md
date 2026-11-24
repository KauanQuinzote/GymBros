# 01: Schema, contratos e repositório de Comunidades (TDD)

**What to build:** migração `communities`/`community_members` com RPCs e backfill; schemas zod; interface `CommunityRepository`; implementações InMemory, Local e Supabase; `scopeToCommunity`.

**Blocked by:** None

**Status:** ready-for-agent

## Acceptance Criteria
- [ ] Migração idempotente com tabelas, índices, `create_community`, `join_community` e comunidade padrão com todos os perfis.
- [ ] `should create new community and add creator as admin member`
- [ ] `should reject join with invalid invite code`
- [ ] `should isolate workouts between members of distinct communities`
- [ ] Join idempotente, normalização de código, validação de nome, sair da comunidade.
