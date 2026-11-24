# 01: Isolar o histórico de provocações por perfil e por comunidade

**Origem:** encontrado no teste manual da issue #7 (múltiplas comunidades), em 2026-11-24.

**Blocked by:** None. Relacionado a #7 / ADR 006.

**Status:** needs-triage

## Problema
O histórico do Chilling (`nudgeHistory`) fica numa única chave do AsyncStorage, `@gymbros_nudges_history`
(`src/features/chilling/context/ChillingContext.tsx:9`). Essa chave é compartilhada por **todos os perfis do mesmo
aparelho/navegador** e não é filtrada pela comunidade ativa.

**Como reproduzir (modo local, sem Supabase):**
1. Logar como o perfil X e enviar provocações.
2. Sair, criar ou logar como o perfil Y, de outra comunidade.
3. Abrir o Chilling: o "Histórico de Provocações" mostra as provocações de X.

**Impacto:** vazamento de dados entre perfis e entre comunidades. É menor no celular (um perfil por aparelho na
prática), mas visível na web e em aparelhos compartilhados.

## Critérios de aceite (proposta)
- [ ] Chave do histórico por perfil (ex.: `@gymbros_nudges_history_<profileId>`), com migração ou descarte da chave antiga.
- [ ] Histórico exibido filtrado pela comunidade ativa (reaproveitar `isNudgeInScope` / `scopeToCommunity`).
- [ ] Testes: o perfil Y não vê o histórico do perfil X; um não-membro não aparece no histórico.

## Fora do escopo
- Incluir `community_id` no protocolo de provocações. Isso resolveria também o broadcast "Todos" cruzando comunidades
  (limitação registrada na ADR 006) e merece uma decisão própria.
