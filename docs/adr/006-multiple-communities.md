# ADR 006: Múltiplas Comunidades de Bros e Isolamento por Comunidade

## Status
Aceito

## Contexto
Até aqui o GymBros operava em um único escopo global: todos os perfis aparecem no ranking, todos compartilham o mesmo canal de presença (`bro_presence`), todos recebem a notificação de início de treino de qualquer bro e qualquer bro pode ser alvo de provocações. A issue #7 pede que um bro possa criar e participar de várias comunidades (ex.: "Bros da Madrugada", "Galera do Crossfit") e que treinos, ranking e presença fiquem isolados por comunidade.

Restrição importante: o app **não usa Supabase Auth**. O login é feito por PIN validado no cliente e todas as requisições chegam ao banco como `anon`. Logo, `auth.uid()` é sempre `NULL` e políticas RLS baseadas nele são inviáveis sem antes introduzir autenticação real.

## Decisões

1. **Modelo de dados (multi-tenancy por associação)**
   - `communities (id, name, description, invite_code, created_by, created_at)`.
   - `community_members (community_id, user_id, role, joined_at)` com PK composta; `role ∈ {admin, member}`.
   - O **treino pertence ao usuário**, não à comunidade: `workout_sessions` não ganha `community_id`. Um treino é visível para todos os membros das comunidades que o bro compartilha com quem está vendo. Evita ter que escolher comunidade ao iniciar treino.

2. **Código de convite**: 6 caracteres alfanuméricos maiúsculos sem caracteres ambíguos (alfabeto `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, sem `0/O/1/I`). ~1 bilhão de combinações vs. 1 milhão com apenas dígitos. Único por comunidade.

3. **Repository Pattern** (`CommunityRepository`) com três implementações:
   - `InMemoryCommunityRepository` — testes (TDD).
   - `LocalCommunityRepository` — fallback offline via AsyncStorage (mantém a filosofia atual do app de funcionar sem Supabase).
   - `SupabaseCommunityRepository` — produção; criação e ingresso via RPC (`create_community`, `join_community`) para que um não-membro nunca precise listar a tabela `communities` para validar um código.

4. **Escopo aplicado no cliente** através de `CommunityContext` (comunidade ativa + `memberIds`) e da função pura `scopeToCommunity`. Pontos filtrados: ranking, widget de presença, seletor de destinatários do Chilling e notificação de início de treino.

5. **Presença por canal de comunidade**: o canal global `bro_presence` passa a ser `presence:community:<id>` quando há comunidade ativa, para que dados de presença não trafeguem para não-membros.

6. **Migração dos dados existentes**: a migração cria a comunidade padrão "GymBros Original" e insere todos os perfis existentes como membros, para que nenhum usuário perca visibilidade de seus bros após o deploy.

7. **RLS restritivo fica fora desta entrega** e vira issue própria ("Autenticação real com Supabase Auth + RLS por comunidade"). A política proposta na issue (`community_id IN (SELECT ... WHERE user_id = auth.uid())`) depende dela.

8. **Bro sem comunidade enxerga apenas a si mesmo** (ranking, presença, destinatários e notificações). É intencional: o isolamento vale também para quem ainda não entrou em nenhuma comunidade, e a Home mostra o estado vazio com "Criar" / "Entrar com código". Perfis criados depois da migração não entram automaticamente na comunidade padrão; precisam do código.

## Consequências
- **Positivas**: isolamento funcional por comunidade; domínio testável sem rede; app continua funcionando offline; nenhuma quebra para usuários existentes.
- **Negativas / riscos aceitos**: enquanto a issue de autenticação não for entregue, o isolamento é garantido pelo cliente e pelas RPCs, não pelo banco — um cliente malicioso com a anon key ainda consegue ler as tabelas diretamente. Isso está explicitamente documentado e rastreado.
- **Gap conhecido nas RPCs**: `create_community` e `join_community` são `SECURITY DEFINER` e recebem `p_user_id` do cliente. Sem Supabase Auth, qualquer cliente com a anon key pode inscrever outro perfil numa comunidade ou criar comunidades em nome de outro. A correção (derivar o usuário de `auth.uid()`) faz parte da issue de autenticação.
