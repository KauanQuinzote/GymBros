# Catálogo Oficial de Tasks para GitHub Kanban - GymBros

Este documento reúne todas as tarefas do projeto mapeadas a partir do [TODO.md](./TODO.md), estruturadas com base no [Padrão de Tasks](./TASK_TEMPLATE.md), contratos TypeScript estritos, design patterns, ferramentas do Supabase e planos de testes TDD.

---

## 📑 Índice de Tarefas

1. [Refatoração do Diretório e Módulo bromance para chill (Concluída)](#refatoração-do-diretório-e-módulo-bromance-para-chill-concluída)
2. [Padronização de Cores e Tokens de Tema (Tailwind / NativeWind)](#padronização-de-cores-e-tokens-de-tema-tailwind--nativewind)
3. [Notificação Persistente de Início de Treino para a Equipe](#notificação-persistente-de-início-de-treino-para-a-equipe)
4. [Sincronização Real-time Cross-Device via Supabase Presence (Concluída)](#sincronização-real-time-cross-device-via-supabase-presence-concluída)
5. [Suporte a Múltiplas Comunidades de Bros e Isolamento de Privacidade](#suporte-a-múltiplas-comunidades-de-bros-e-isolamento-de-privacidade)
6. [Configuração de RLS (Row Level Security) e Migrações Idempotentes no Supabase](#configuração-de-rls-row-level-security-e-migrações-idempotentes-no-supabase)
7. [Séries Avançadas de Treino (Bi-set, Drop-set, Aquecimento)](#séries-avançadas-de-treino-bi-set-drop-set-aquecimento)
8. [Modalidades e Métricas Específicas de Cardio](#modalidades-e-métricas-específicas-de-cardio)
9. [Aviso Sonoro e Feedback Tátil ao Finalizar Timer de Descanso](#aviso-sonoro-e-feedback-tátil-ao-finalizar-timer-de-descanso)
10. [Painel de Status de Treino em Tempo Real dos Bros](#painel-de-status-de-treino-em-tempo-real-dos-bros)
11. [Dashboard de Evolução Física e Sobrecarga Progressiva](#dashboard-de-evolução-física-e-sobrecarga-progressiva)
12. [Envio de Fotos com Visualização Única (One-View)](#envio-de-fotos-com-visualização-única-one-view)
13. [Notificações Nativas no Sistema (Notification Shade / Status Bar)](#notificações-nativas-no-sistema-notification-shade--status-bar)
14. [Remoção de Gatilhos Automáticos de Provocação ao Finalizar Treino](#remoção-de-gatilhos-automáticos-de-provocação-ao-finalizar-treino)
15. [Hospedagem de Áudios do Soundboard no Supabase Storage CDN](#hospedagem-de-áudios-do-soundboard-no-supabase-storage-cdn)
16. [Expansão do Catálogo de Conquistas (50+ Achievements)](#expansão-do-catálogo-de-conquistas-50-achievements)
17. [Sistema de Desafios ("Verdade ou Desafio" / Bro Challenges)](#sistema-de-desafios-verdade-ou-desafio--bro-challenges)
18. [Pipeline de CI/CD com GitHub Actions para Tipos, Lint e Testes](#pipeline-de-cicd-com-github-actions-para-tipos-lint-e-testes)
19. [Agente de IA GymBros com Orquestração em Fila (Plano Pro / Gemini API)](#agente-de-ia-gymbros-com-orquestração-em-fila-plano-pro--gemini-api)
20. [Notificações Push Remotas (Expo Push Notifications)](#notificações-push-remotas-expo-push-notifications)

---

### Refatoração do Diretório e Módulo bromance para chill (Concluída)

## 📌 Contexto & Problema
O app foi renomeado e o conceito de romance foi ajustado para **Chilling**. O código-fonte possuía diretórios e nomenclaturas legadas (`src/features/bromance/`, `useBromance`, `BromanceContext`), gerando inconsistência com a nova identidade.

## ✅ Critérios de Aceite (DoD)
- [x] Renomear o diretório `src/features/bromance/` para `src/features/chill/`.
- [x] Renomear entidades: `useBromance` -> `useChill`, `BromanceContext` -> `ChillContext`, `BromanceProvider` -> `ChillProvider`, `BromanceScreen` -> `ChillScreen`, `BromanceNudgeLog` -> `ChillNudgeLog`.
- [x] Atualizar todas as importações em `App.tsx`, rotas e suíte de testes.
- [x] Garantir que nenhum teste unitário quebre e o bundle compile sem erros.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**: `ChillScreenTop.tsx`, `ChillScreenMid.tsx`, `ChillScreenBottom.tsx` (<100 LOC cada).
- **Iconografia**: `lucide-react-native` (`Flame`, `Volume2`, `Mic`, `Send`). **Zero Emojis**.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Facade Pattern em `src/features/chill/index.ts`.
- **Supabase**: Realtime Broadcast channel para eventos de `chill_nudge`.

## 📜 Contratos TypeScript & Schemas
```typescript
export interface ChillNudgeEvent {
  id: string;
  sender_id: string;
  recipient_ids: string[];
  type: 'soundboard' | 'tts' | 'phrase';
  payload: {
    audio_url?: string;
    text?: string;
    category?: string;
  };
  created_at: string;
}
```

## 🧪 Plano de Testes & TDD
- Testes unitários do `ChillProvider` e `useChill` com In-Memory Repository simulando dispatch de nudges.

## 🏷️ Metadados
- **Tipo**: `refactor`
- **Prioridade**: `alta`
- **Status**: Concluída ✅

---

### Padronização de Cores e Tokens de Tema (Tailwind / NativeWind)

## 📌 Contexto & Problema
Diversos componentes utilizam cores hexadecimais hardcoded inline no Tailwind (ex: `[#00F0FF]`, `[#0A0D14]`, `[#161B26]`), dificultando manutenção, consistência visual e suporte ao tema Dark Apple.

## ✅ Critérios de Aceite (DoD)
- [ ] Mapear paleta semântica completa no `tailwind.config.js` (`neon-cyan`, `neon-green`, `neon-yellow`, `neon-red`, `apple-dark`, `apple-card`, `apple-border`).
- [ ] Substituir todas as classes hexadecimais inline por tokens semânticos (`bg-apple-dark`, `border-apple-border`, `text-neon-cyan`).
- [ ] Centralizar constantes de cores em `src/shared/theme/colors.ts` para ícones Lucide e propriedades nativas.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Cores Semânticas Padronizadas**:
  - `bg-apple-dark` (`#0A0D14`)
  - `bg-apple-card` (`#161B26`)
  - `border-apple-border` (`#262F42`)
  - `text-neon-cyan` (`#00F0FF`)
  - `text-neon-green` (`#00FF88`)
- **Regra de LOC**: < 100 LOC por componente refatorado.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Theme Object Token Pattern centralizado em `src/shared/theme/tokens.ts`.

## 📜 Contratos TypeScript & Schemas
```typescript
export const ThemeTokens = {
  colors: {
    dark: '#0A0D14',
    card: '#161B26',
    border: '#262F42',
    cyan: '#00F0FF',
    green: '#00FF88',
    yellow: '#FFB800',
    red: '#FF3B30',
  }
} as const;

export type ThemeColorKey = keyof typeof ThemeTokens.colors;
```

## 🧪 Plano de Testes & TDD
- Validação com script de lint regex garantindo ausência de `[#` no código JSX/TSX.

## 🏷️ Metadados
- **Tipo**: `refactor`
- **Prioridade**: `média`
- **Branch Sugerida**: `feature/standardize-color-tokens`

---

### Notificação Persistente de Início de Treino para a Equipe

## 📌 Contexto & Problema
Quando um usuário inicia um treino, os outros membros da comunidade não recebem o aviso se não estiverem com o app aberto naquele exato segundo, pois o evento não era persistido no banco de dados.

## ✅ Critérios de Aceite (DoD)
- [ ] Persistir o evento de início de treino na tabela `workout_events` do Supabase.
- [ ] Propagar evento através do canal Broadcast do Supabase Realtime para a comunidade ativa.
- [ ] Exibir banner/notificação in-app quando o bro abrir o app e houver um treino ativo iniciado recentemente (< 90 minutos).

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**: `WorkoutActiveBanner.tsx` integrado no `HomeScreenTop.tsx`.
- **Feedback**: Borda pulsante sutil em `neon-cyan` e ícone `Dumbbell` animado.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Observer / Event-Driven Architecture.
- **Supabase**:
  - Tabela `workout_events` com colunas (`id`, `user_id`, `community_id`, `event_type`, `routine_name`, `started_at`, `status`).
  - Supabase Realtime Broadcast e Postgres Changes listener.

## 📜 Contratos TypeScript & Schemas
```typescript
import { z } from 'zod';

export const WorkoutStartEventSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  community_id: z.string().uuid(),
  event_type: z.literal('WORKOUT_STARTED'),
  routine_name: z.string().min(1),
  started_at: z.string().datetime(),
  status: z.enum(['in_progress', 'completed', 'cancelled']),
});

export type WorkoutStartEvent = z.infer<typeof WorkoutStartEventSchema>;
```

## 🧪 Plano de Testes & TDD
- Testes com `InMemoryWorkoutEventRepository`:
  - `should persist workout event when user starts workout`
  - `should broadcast event to active community subscribers`
  - `should fetch active workouts for team when app opens`

## 🏷️ Metadados
- **Tipo**: `bug`
- **Prioridade**: `alta`
- **Branch Sugerida**: `fix/team-workout-start-notification`

---

### Sincronização Real-time Cross-Device via Supabase Presence (Concluída)

## 📌 Contexto & Problema
O tracking de presença online funcionava localmente via `AsyncStorage`/`BroadcastChannel`, operando apenas entre abas do mesmo dispositivo. Usuários no celular e no computador precisavam enxergar a presença uns dos outros em tempo real.

## ✅ Critérios de Aceite (DoD)
- [x] Integrar Supabase Realtime Presence usando `channel.track({ user_id, status, active_workout })`.
- [x] Atualizar lista de bros ativos na Home em tempo real ao entrar/sair do aplicativo.
- [x] Tratar desconexões, reconexões com debounce e timeout de inatividade.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**: `ActiveBrosBar.tsx` na Home com anel de status neon verde (`online`) ou ciano (`treinando`).

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Presence Observer Pattern.
- **Supabase**: Supabase Realtime Presence Channel (`room:community_id`).

## 📜 Contratos TypeScript & Schemas
```typescript
export interface BroPresenceState {
  user_id: string;
  name: string;
  avatar_color: string;
  status: 'online' | 'working_out' | 'idle';
  active_routine?: string;
  last_seen: string;
}
```

## 🧪 Plano de Testes & TDD
- Teste unitário de sincronização de estado com ciclo de vida de conexão do canal.

## 🏷️ Metadados
- **Tipo**: `feature`
- **Prioridade**: `alta`
- **Status**: Concluída ✅

---

### Suporte a Múltiplas Comunidades de Bros e Isolamento de Privacidade

## 📌 Contexto & Problema
Atualmente o app suporta apenas um escopo global. É necessário permitir que um bro crie e participe de diferentes grupos/comunidades (ex: "Bros da Madrugada", "Galera do Crossfit"), isolando treinos e feeds.

## ✅ Critérios de Aceite (DoD)
- [ ] Criar tabelas `communities` e `community_members` no banco de dados.
- [ ] Permitir criar comunidade, gerar código/link de convite de 6 dígitos e ingressar.
- [ ] Filtrar treinos, ranking e presença apenas pelos membros da comunidade selecionada.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**:
  - `CommunitySelectorModal.tsx` (Bottom Sheet minimalista).
  - `CreateCommunitySheet.tsx` (<100 LOC).
  - `CommunityMembersList.tsx` (<100 LOC).
- **Iconografia**: `Users`, `Plus`, `Key`, `ShieldCheck` da `lucide-react-native`.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Repository Pattern (`CommunityRepository`) + Multi-tenancy Scoping.
- **Supabase**:
  - Tabelas: `communities`, `community_members`.
  - RLS Policies isolando `SELECT` onde `community_id IN (SELECT community_id FROM community_members WHERE user_id = auth.uid())`.

## 📜 Contratos TypeScript & Schemas
```typescript
import { z } from 'zod';

export const CommunitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(50),
  description: z.string().optional(),
  invite_code: z.string().length(6),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
});

export const JoinCommunityPayloadSchema = z.object({
  invite_code: z.string().length(6),
  user_id: z.string().uuid(),
});

export type Community = z.infer<typeof CommunitySchema>;
export type JoinCommunityPayload = z.infer<typeof JoinCommunityPayloadSchema>;
```

## 🧪 Plano de Testes & TDD
- `InMemoryCommunityRepository` validando:
  - `should create new community and add creator as admin member`
  - `should reject join with invalid invite code`
  - `should isolate workouts between members of distinct communities`

## 🏷️ Metadados
- **Tipo**: `feature`
- **Prioridade**: `alta`
- **Branch Sugerida**: `feature/multiple-communities`

---

### Configuração de RLS (Row Level Security) e Migrações Idempotentes no Supabase

## 📌 Contexto & Problema
O banco de dados precisa ter regras rígidas de segurança para garantir que usuários não autorizados não leiam nem modifiquem treinos ou dados de outros bros.

## ✅ Critérios de Aceite (DoD)
- [ ] Habilitar RLS em todas as tabelas (`profiles`, `workout_routines`, `workout_exercises`, `workout_logs`, `communities`, `community_members`, `bro_nudges`, `workout_events`).
- [ ] Criar políticas de `SELECT`, `INSERT`, `UPDATE` e `DELETE` baseadas em `auth.uid()` e vínculo de membros.
- [ ] Adicionar migração SQL idempotente na pasta de migrações (`supabase/migrations/`).

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- Tratamento gracioso de erros de autorização (403/RLS Error) exibindo alertas nativos sutis sem crashar a UI.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Security Guard Pattern via RLS.
- **Supabase**:
  - `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`
  - `CREATE POLICY "community_member_access" ON ... FOR ALL USING (...)`

## 📜 Contratos TypeScript & Schemas
```sql
-- Contrato de Migração SQL Idempotente
CREATE POLICY "Users can only edit their own logs"
ON workout_logs FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

## 🧪 Plano de Testes & TDD
- Teste de integração de segurança:
  - Validar rejeição de `SELECT * FROM workout_logs` para usuários fora da comunidade.
  - Validar permissão de escrita apenas para o próprio `user_id`.

## 🏷️ Metadados
- **Tipo**: `enhancement`
- **Prioridade**: `alta`
- **Branch Sugerida**: `feature/supabase-rls-policies`

---

### Séries Avançadas de Treino (Bi-set, Drop-set, Aquecimento)

## 📌 Contexto & Problema
Os treinos atualmente só suportam séries lineares padrão. Faltam opções essenciais para treino de hipertrofia avançado como Drop-sets, Bi-sets/Super-séries e séries de Aquecimento (Warm-up / Feeder sets).

## ✅ Critérios de Aceite (DoD)
- [ ] Adicionar campo `set_type` (`normal`, `warmup`, `feeder`, `dropset`, `biset`) no schema da série.
- [ ] Permitir agrupar 2 exercícios em Bi-set no fluxo de execução de treino.
- [ ] Suportar cargas e repetições independentes para cada sub-série de um Drop-set.
- [ ] Exibir badges visuais minimalistas (ex: "W" para Warm-up, "D" para Drop) na interface.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**:
  - `SetRowItem.tsx` (<80 LOC) com pill badges (`W` em cinza, `D` em amarelo neon, `B` em ciano).
  - `AddSetTypeSelectorModal.tsx` (<90 LOC).
- **Interação**: Haptic feedback (`expo-haptics`) ao alternar o tipo de série.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Strategy Pattern para cálculo de volume e 1RM dependendo do `set_type` (ex: séries de aquecimento não contam no volume de sobrecarga máxima).

## 📜 Contratos TypeScript & Schemas
```typescript
import { z } from 'zod';

export const SetTypeSchema = z.enum(['normal', 'warmup', 'feeder', 'dropset', 'biset']);
export type SetType = z.infer<typeof SetTypeSchema>;

export const WorkoutSetSchema = z.object({
  id: z.string().uuid(),
  exercise_id: z.string().uuid(),
  set_number: z.number().int().positive(),
  set_type: SetTypeSchema,
  weight_kg: z.number().nonnegative(),
  reps: z.number().int().positive(),
  rpe: z.number().min(1).max(10).optional(),
  completed: z.boolean().default(false),
  dropset_subsets: z.array(z.object({
    weight_kg: z.number().nonnegative(),
    reps: z.number().int().positive(),
  })).optional(),
  biset_linked_exercise_id: z.string().uuid().optional(),
});

export type WorkoutSet = z.infer<typeof WorkoutSetSchema>;
```

## 🧪 Plano de Testes & TDD
- Testes unitários com `WorkoutCalculatorService`:
  - `should exclude warmup sets from total effective workout volume calculation`
  - `should record dropset drops correctly in workout log`

## 🏷️ Metadados
- **Tipo**: `feature`
- **Prioridade**: `alta`
- **Branch Sugerida**: `feature/advanced-set-types`

---

### Modalidades e Métricas Específicas de Cardio

## 📌 Contexto & Problema
O cardio é tratado de forma genérica apenas por minutos. É necessário suportar diferentes modalidades (Esteira, Bike, Escada, Corrida na Rua, Elíptico) com métricas especializadas (distância em km, velocidade, ritmo/pace, calorias e inclinação).

## ✅ Critérios de Aceite (DoD)
- [ ] Adicionar suporte às modalidades: Esteira, Bicicleta Ergométrica, Simulador de Escada, Corrida Externa, Elíptico.
- [ ] Interface dinâmica de preenchimento baseada no tipo selecionado (ex: Esteira -> velocidade + inclinação; Corrida -> km + pace).
- [ ] Integração do cardio ao resumo geral do treino e histórico.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**:
  - `CardioTypeSelector.tsx` (Chips minimalistas com ícones Lucide: `Activity`, `Footprints`, `Timer`).
  - `CardioMetricsInputGrid.tsx` (<90 LOC).

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Factory Pattern (`CardioMetricFactory`) para instanciar campos dinâmicos por modalidade.

## 📜 Contratos TypeScript & Schemas
```typescript
import { z } from 'zod';

export const CardioModalitySchema = z.enum(['treadmill', 'bike', 'stairmaster', 'outdoor_run', 'elliptical']);

export const CardioLogEntrySchema = z.object({
  id: z.string().uuid(),
  workout_id: z.string().uuid(),
  modality: CardioModalitySchema,
  duration_minutes: z.number().positive(),
  distance_km: z.number().optional(),
  calories_burned: z.number().optional(),
  avg_speed_kmh: z.number().optional(),
  incline_percentage: z.number().optional(),
  pace_min_km: z.string().optional(),
});

export type CardioLogEntry = z.infer<typeof CardioLogEntrySchema>;
```

## 🧪 Plano de Testes & TDD
- `CardioServiceTest`:
  - `should format outdoor run pace correctly given distance and time`
  - `should validate required metrics for treadmill modality`

## 🏷️ Metadados
- **Tipo**: `feature`
- **Prioridade**: `média`
- **Branch Sugerida**: `feature/cardio-modalities`

---

### Aviso Sonoro e Feedback Tátil ao Finalizar Timer de Descanso

## 📌 Contexto & Problema
Durante os intervalos entre séries, o usuário pode estar longe da tela. Quando o timer de descanso chega a zero, não há aviso sonoro ou vibração expressiva avisando que é hora de começar a próxima série.

## ✅ Critérios de Aceite (DoD)
- [ ] Tocar efeito sonoro curto e nítido (`assets/sounds/timer-end.wav`) ao zerar a contagem regressiva.
- [ ] Disparar padrão de vibração tátil nativo via `expo-haptics` (`Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`).
- [ ] Respeitar preferências do usuário de som/vibração nas configurações locais.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**: `RestTimerDisplay.tsx` com anel circular de progresso e botão de atalho `+30s` / `Pular`.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: State Machine Pattern para o timer (`IDLE` -> `RUNNING` -> `PAUSED` -> `COMPLETED`).
- **Nativo**: `expo-av` e `expo-haptics`.

## 📜 Contratos TypeScript & Schemas
```typescript
export interface RestTimerState {
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  status: 'idle' | 'running' | 'paused' | 'completed';
}

export interface RestTimerSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  defaultRestDuration: number;
}
```

## 🧪 Plano de Testes & TDD
- Testes com `useRestTimer`:
  - `should trigger sound and haptic feedback when countdown reaches 0`
  - `should pause and resume rest timer seamlessly`

## 🏷️ Metadados
- **Tipo**: `enhancement`
- **Prioridade**: `média`
- **Branch Sugerida**: `feature/rest-timer-audio-feedback`

---

### Painel de Status de Treino em Tempo Real dos Bros

## 📌 Contexto & Problema
Ao ver que um bro está treinando na Home, o usuário deseja saber em qual exercício e série ele se encontra no momento, promovendo engajamento e motivação mútua.

## ✅ Critérios de Aceite (DoD)
- [ ] Ao clicar no card/avatar de um bro com treino ativo na Home, abrir modal com o status detalhado.
- [ ] Exibir: exercício atual, série/repetição atual, peso em uso, tempo total decorrido e último descanso.
- [ ] Botão de atalho para enviar provocação ou incentivo direto da tela de status.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**:
  - `BroLiveWorkoutModal.tsx` (<100 LOC).
  - `BroWorkoutProgressIndicator.tsx` (<80 LOC).
- **Design**: Cards pretos translúcidos com borda `border-apple-border` e tipografia San Francisco / Inter.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Observer Pattern consumindo canal Supabase Realtime de atualizações de log de treino.
- **Supabase**: Postgres Changes na tabela `workout_logs` filtrado pelo `user_id` em tempo real.

## 📜 Contratos TypeScript & Schemas
```typescript
import { z } from 'zod';

export const BroLiveStatusSchema = z.object({
  user_id: z.string().uuid(),
  user_name: z.string(),
  current_routine_name: z.string(),
  current_exercise_name: z.string(),
  current_set_index: z.number().int(),
  total_sets_in_exercise: z.number().int(),
  current_weight_kg: z.number(),
  elapsed_seconds: z.number().int(),
  last_updated_at: z.string().datetime(),
});

export type BroLiveStatus = z.infer<typeof BroLiveStatusSchema>;
```

## 🧪 Plano de Testes & TDD
- Testes unitários com `useBroWorkoutStatus`:
  - `should parse realtime payload and update live modal state`
  - `should handle user finishing workout while viewing modal`

## 🏷️ Metadados
- **Tipo**: `feature`
- **Prioridade**: `média`
- **Branch Sugerida**: `feature/bro-live-workout-status`

---

### Dashboard de Evolução Física e Sobrecarga Progressiva

## 📌 Contexto & Problema
Falta uma central analítica no app para o usuário visualizar sua evolução histórica de força (1RM estimada e sobrecarga progressiva), frequência semanal e volume de treino ao longo dos meses.

## ✅ Critérios de Aceite (DoD)
- [ ] Criar tela `DashboardScreen` com gráficos vetoriais minimalistas (`react-native-svg` ou `victory-native`).
- [ ] Gráfico de evolução de carga e 1RM por exercício selecionado.
- [ ] Métrica de frequência mensal e volume total levantado (em toneladas).
- [ ] Suporte a filtros de período (1 mês, 3 meses, 6 meses, 1 ano, Todo o período).

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**:
  - `DashboardScreenTop.tsx`: Métricas chave em cards (Volume, Frequência, Streak).
  - `DashboardScreenMid.tsx`: Gráfico de Sobrecarga Progressiva com seletor de exercício.
  - `DashboardScreenBottom.tsx`: Histórico recente e recordes pessoais (PRs).

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Repository Pattern (`WorkoutAnalyticsRepository`) com cálculos memoizados.
- **Supabase**: RPC Function no Postgres para agregação rápida de volume: `get_user_workout_analytics(p_user_id, p_start_date)`.

## 📜 Contratos TypeScript & Schemas
```typescript
export interface ProgressiveOverloadPoint {
  date: string;
  exercise_id: string;
  max_weight_kg: number;
  estimated_1rm: number;
  total_volume_kg: number;
}

export interface UserAnalyticsSummary {
  period: '1m' | '3m' | '6m' | '1y' | 'all';
  total_workouts: number;
  total_tonnage_kg: number;
  pr_count: number;
  overload_data: ProgressiveOverloadPoint[];
}
```

## 🧪 Plano de Testes & TDD
- `AnalyticsCalculatorTest`:
  - `should calculate 1RM correctly using Epley formula (weight * (1 + reps/30))`
  - `should aggregate monthly volume accurately from raw workout logs`

## 🏷️ Metadados
- **Tipo**: `feature`
- **Prioridade**: `média`
- **Branch Sugerida**: `feature/evolution-dashboard`

---

### Envio de Fotos com Visualização Única (One-View)

## 📌 Contexto & Problema
Para registrar momentos do treino ou o "shape do dia" sem manter a mídia persistida eternamente na galeria pública, é necessário um recurso de envio de foto temporária com visualização única.

## ✅ Critérios de Aceite (DoD)
- [ ] Tirar foto pela câmera nativa e enviar para o bro com flag `one_view: true`.
- [ ] Upload temporário em bucket privado no Supabase Storage.
- [ ] Após o destinatário abrir e fechar a visualização (ou timeout de 10s), apagar o arquivo do Storage e marcar como visualizada.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**:
  - `OneViewCameraModal.tsx` (<100 LOC).
  - `OneViewViewerScreen.tsx` (<100 LOC) com timer circular de visualização regressiva.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Adapter Pattern para Camera API (`expo-camera` / `expo-image-picker`).
- **Supabase**:
  - Bucket privado `one-view-media`.
  - Supabase Edge Function com cron/trigger para expurgo automático de arquivos com mais de 24h caso não abertos.

## 📜 Contratos TypeScript & Schemas
```typescript
import { z } from 'zod';

export const OneViewMediaPayloadSchema = z.object({
  id: z.string().uuid(),
  sender_id: z.string().uuid(),
  recipient_id: z.string().uuid(),
  storage_path: z.string(),
  expires_at: z.string().datetime(),
  viewed_at: z.string().datetime().nullable(),
});

export type OneViewMediaPayload = z.infer<typeof OneViewMediaPayloadSchema>;
```

## 🧪 Plano de Testes & TDD
- `OneViewMediaServiceTest`:
  - `should upload photo and return signed temporary access url`
  - `should delete storage object immediately after viewed event is recorded`

## 🏷️ Metadados
- **Tipo**: `feature`
- **Prioridade**: `baixa`
- **Branch Sugerida**: `feature/one-view-photos`

---

### Notificações Nativas no Sistema (Notification Shade / Status Bar)

## 📌 Contexto & Problema
Quando o bro da equipe inicia o treino, o usuário deve ser notificado diretamente na barra de notificações do Android/iOS, mesmo com o app em segundo plano.

## ✅ Critérios de Aceite (DoD)
- [ ] Configurar canal de notificações locais com `expo-notifications`.
- [ ] Disparar notificação do sistema com o texto: *"{Bro} acabou de iniciar o treino de {Rotina}!"*.
- [ ] Toque na notificação direciona direto para a tela de status do treino do bro.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- Ícone monocromático nativo para a status bar do Android (`android-icon-monochrome.png`).

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Notification Dispatcher Adapter.
- **Supabase**: Supabase Realtime background listener acionando `Notifications.scheduleNotificationAsync`.

## 📜 Contratos TypeScript & Schemas
```typescript
export interface SystemNotificationPayload {
  title: string;
  body: string;
  data: {
    type: 'WORKOUT_STARTED' | 'BRO_NUDGE' | 'CHALLENGE_RECEIVED';
    target_user_id: string;
    route: string;
  };
}
```

## 🧪 Plano de Testes & TDD
- `NotificationDispatcherTest`:
  - `should schedule local system notification with proper title and action deep link`

## 🏷️ Metadados
- **Tipo**: `feature`
- **Prioridade**: `alta`
- **Branch Sugerida**: `feature/status-bar-notifications`

---

### Remoção de Gatilhos Automáticos de Provocação ao Finalizar Treino

## 📌 Contexto & Problema
O app possui comportamentos legados onde mensagens ou sons de provocação podem ser disparados automaticamente na conclusão do treino. Toda interação social deve ser 100% deliberada e manual pelos bros.

## ✅ Critérios de Aceite (DoD)
- [ ] Auditar e remover quaisquer chamadas automáticas de provocação/soundboard no término de treinos.
- [ ] Garantir que o encerramento do treino exiba apenas o resumo comemorativo pessoal e atualização de pontos.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- `WorkoutSummaryScreen.tsx` limpo, focado em métricas pessoais e celebração sutil.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Refatoração do `WorkoutSessionManager` desacoplando dependência direta do módulo de Chilling.

## 📜 Contratos TypeScript & Schemas
```typescript
export interface WorkoutCompletionResult {
  workout_id: string;
  duration_minutes: number;
  total_volume_kg: number;
  points_earned: number;
  unlocked_achievements: string[];
}
```

## 🧪 Plano de Testes & TDD
- `WorkoutEndTest`:
  - `should complete workout without triggering any social nudge or sound event`

## 🏷️ Metadados
- **Tipo**: `bug`
- **Prioridade**: `alta`
- **Branch Sugerida**: `fix/remove-auto-nudges-on-workout-end`

---

### Hospedagem de Áudios do Soundboard no Supabase Storage CDN

## 📌 Contexto & Problema
Atualmente alguns arquivos de áudio externos podem sofrer instabilidade ou erro 403. É necessário centralizar o catálogo de áudios em um bucket público CDN no Supabase Storage.

## ✅ Critérios de Aceite (DoD)
- [ ] Criar bucket público `soundboard-audios` no Supabase Storage com políticas de leitura pública.
- [ ] Fazer upload de todos os efeitos sonoros e memes catalogados.
- [ ] Atualizar `soundboardData.ts` para consumir as URLs oficiais da CDN com cache local via `expo-file-system`.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- Botões de reprodução com indicador de download/cache sutil na primeira execução.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Cache-Aside Pattern para download e reprodução local de áudios.
- **Supabase**: Bucket `soundboard-audios` com CDN integrada.

## 📜 Contratos TypeScript & Schemas
```typescript
export interface SoundboardAudioItem {
  id: string;
  title: string;
  category: 'hardcore' | 'zoeira' | 'motivacao' | 'classicos';
  remote_storage_url: string;
  local_cached_path?: string;
  duration_seconds: number;
}
```

## 🧪 Plano de Testes & TDD
- `AudioCacheManagerTest`:
  - `should stream audio from remote CDN and cache to local filesystem`
  - `should play from local cache on second trigger`

## 🏷️ Metadados
- **Tipo**: `enhancement`
- **Prioridade**: `média`
- **Branch Sugerida**: `feature/supabase-soundboard-storage`

---

### Expansão do Catálogo de Conquistas (50+ Achievements)

## 📌 Contexto & Problema
O sistema atual possui poucas conquistas. Para aumentar o engajamento e a retenção, precisamos de um catálogo robusto com mais de 50 badges divididos por categorias (Força, Constância, Social, Cardio, Desafios).

## ✅ Critérios de Aceite (DoD)
- [ ] Criar estrutura de dados tipada para 50+ achievements no `src/features/gamification/data/achievements.ts`.
- [ ] Implementar verificação automática de desbloqueio ao finalizar treinos e ações sociais.
- [ ] Modal de celebração com animação minimalista ao desbloquear nova conquista.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**:
  - `AchievementsScreenTop.tsx`: Nível atual, total de pontos e barra de progresso.
  - `AchievementsCategoryList.tsx`: Grid de badges minimalistas em cards escuros.
  - `AchievementUnlockedModal.tsx`: Celebração com micro-vibração e brilho neon.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Specification Pattern / Rules Engine para avaliar critérios de desbloqueio de badges de forma desacoplada.

## 📜 Contratos TypeScript & Schemas
```typescript
import { z } from 'zod';

export const AchievementCategorySchema = z.enum(['strength', 'consistency', 'social', 'cardio', 'challenges']);

export const AchievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: AchievementCategorySchema,
  points_reward: z.number().int().positive(),
  icon_name: z.string(),
  is_secret: z.boolean().default(false),
  required_progress: z.number(),
});

export type Achievement = z.infer<typeof AchievementSchema>;
```

## 🧪 Plano de Testes & TDD
- `AchievementRulesEngineTest`:
  - `should unlock 'Century Club' when user logs 100 workouts`
  - `should unlock 'Iron Bro' when bench press exceeds 100kg`

## 🏷️ Metadados
- **Tipo**: `feature`
- **Prioridade**: `média`
- **Branch Sugerida**: `feature/expanded-achievements`

---

### Sistema de Desafios ("Verdade ou Desafio" / Bro Challenges)

## 📌 Contexto & Problema
Falta uma mecânica direta de interação lúdica competitiva, onde um bro possa desafiar outro (ex: "Fazer 100 flexões", "Correr 5km em 25min") valendo pontos de prestígio e apostas.

## ✅ Critérios de Aceite (DoD)
- [ ] Criar fluxo de envio de desafio com prazo, tipo e pontuação de recompensa.
- [ ] Interface de resposta: Aceitar, Recusar ou Concluir (com submissão de foto/registro).
- [ ] Validação: o desafiante aprova o cumprimento para creditar os pontos.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**:
  - `ChallengesScreenTop.tsx`: Desafios pendentes de aprovação e desafios ativos.
  - `CreateChallengeModal.tsx` (<100 LOC).
  - `ChallengeProofReviewSheet.tsx` (<100 LOC).

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Finite State Machine (`PENDING` -> `ACCEPTED` -> `SUBMITTED` -> `APPROVED` | `REJECTED`).
- **Supabase**: Tabela `bro_challenges` com triggers de transação para transferência de Bro Points.

## 📜 Contratos TypeScript & Schemas
```typescript
import { z } from 'zod';

export const ChallengeStatusSchema = z.enum(['pending', 'accepted', 'rejected', 'submitted', 'approved', 'expired']);

export const BroChallengeSchema = z.object({
  id: z.string().uuid(),
  creator_id: z.string().uuid(),
  challenged_id: z.string().uuid(),
  title: z.string().min(3).max(100),
  description: z.string(),
  points_reward: z.number().int().positive(),
  status: ChallengeStatusSchema,
  proof_media_url: z.string().optional(),
  expires_at: z.string().datetime(),
  created_at: z.string().datetime(),
});

export type BroChallenge = z.infer<typeof BroChallengeSchema>;
```

## 🧪 Plano de Testes & TDD
- `ChallengeStateMachineTest`:
  - `should transition from SUBMITTED to APPROVED and credit points to challenged user`
  - `should prevent unauthorised approval from non-creator`

## 🏷️ Metadados
- **Tipo**: `feature`
- **Prioridade**: `média`
- **Branch Sugerida**: `feature/bro-challenges-system`

---

### Pipeline de CI/CD com GitHub Actions para Tipos, Lint e Testes

## 📌 Contexto & Problema
Para garantir que nenhum Pull Request quebre a integridade do código, viole as regras de limite de LOC ou quebre a suíte de testes do Jest, é necessária uma esteira de validação automatizada no GitHub Actions.

## ✅ Critérios de Aceite (DoD)
- [ ] Criar workflow `.github/workflows/ci.yml` disparado em `pull_request` para a branch `main`.
- [ ] Executar checagem de tipos estrita (`npx tsc --noEmit`).
- [ ] Executar linter ESLint (`npm run lint`).
- [ ] Executar suíte completa de testes Jest com relatório de cobertura (`npm test -- --coverage`).

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- Integração de status checks no PR com badges verdes/vermelhos no GitHub.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Automated Quality Gate.

## 📜 Contratos TypeScript & Schemas
```yaml
# .github/workflows/ci.yml
name: CI Quality Gate
on:
  pull_request:
    branches: [ main ]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npm test -- --ci
```

## 🧪 Plano de Testes & TDD
- Validação do workflow em branch de teste garantindo falha em erro de tipagem e sucesso em código válido.

## 🏷️ Metadados
- **Tipo**: `enhancement`
- **Prioridade**: `alta`
- **Branch Sugerida**: `feature/github-actions-ci`

---

### Agente de IA GymBros com Orquestração em Fila (Plano Pro / Gemini API)

## 📌 Contexto & Problema
Implementação do assistente inteligente GymBro AI Coach para análise de evolução de treino, sobrecarga progressiva e motivação. O recurso é exclusivo do **Plano Pago (Pro)** e necessita de orquestração assíncrona robusta via fila de mensagens para não travar o cliente móvel durante o processamento com a **Gemini API**.

## ✅ Critérios de Aceite (DoD)
- [ ] **Gate de Assinatura (Plano Pro)**:
  - Verificar status da assinatura (`subscription_tier: 'pro'` e `subscription_status: 'active'`) no schema `profiles` via RLS e na Edge Function antes de enfileirar jobs.
  - Exibir paywall modal caso o usuário free tente acessar o recurso.
- [ ] **Orquestração de Fila com Supabase**:
  - Enfileirar requisição de análise na fila `ai_jobs_queue` utilizando **PGMQ (Postgres Message Queue)** / `pg_net`.
  - Processar requisição em segundo plano via **Supabase Edge Function** (`process-ai-job`) consumindo a **Gemini API** com a chave configurada no Supabase Secrets (`GEMINI_API_KEY`).
- [ ] **Notificação de Resposta em Tempo Real**:
  - Atualizar o status do job (`queued` -> `processing` -> `completed` / `failed`) e propagar a resposta estruturada via canal Supabase Realtime para o cliente móvel.
- [ ] **Chat & Análise Multimodal**:
  - Suportar análise de texto (histórico de treinos) e comparação de fotos de evolução física.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Componentes**:
  - `AICoachScreenTop.tsx`: Header com badge "PRO", status da IA (Online / Pensando) e histórico de conversas.
  - `AICoachScreenMid.tsx`: Feed de mensagens minimalistas em balões escuros com tipografia Apple e gráficos de recomendação inseridos.
  - `AICoachScreenBottom.tsx`: Input de texto com botão de anexo de foto de treino e microfone.
  - `ProSubscriptionPaywallModal.tsx`: Sheet minimalista destacando os benefícios do plano Pro.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Design Patterns**:
  - **Repository Pattern**: `AIChatRepository` abstraindo o acesso à fila e histórico.
  - **Adapter Pattern**: `GeminiClientAdapter` encapsulando a chamada à API do Google Gemini.
  - **Subscription Guard Pattern**: `SubscriptionService` com adapter preparado para validação de recibos da App Store / Google Play.
- **Ferramentas Supabase**:
  - Extensão **PGMQ** (`pgmq.send()`, `pgmq.read()`, `pgmq.delete()`) ou tabela de fila transacional `ai_jobs`.
  - **Supabase Edge Functions** em TypeScript (Deno runtime) executando a comunicação com a Gemini API.
  - **Supabase Realtime Broadcast** transmitindo os chunks / resposta final para o app.
  - **Row Level Security (RLS)** garantindo que apenas usuários com `subscription_tier = 'pro'` possam inserir jobs na fila.

## 📜 Contratos TypeScript & Schemas
```typescript
import { z } from 'zod';

export const AIJobStatusSchema = z.enum(['queued', 'processing', 'completed', 'failed']);

export const AIJobPayloadSchema = z.object({
  job_id: z.string().uuid(),
  user_id: z.string().uuid(),
  prompt: z.string().min(1).max(2000),
  context_type: z.enum(['workout_analysis', 'progressive_overload_advice', 'general_coach', 'photo_evolution']),
  image_urls: z.array(z.string().url()).optional(),
  created_at: z.string().datetime(),
});

export const AIJobResponseSchema = z.object({
  job_id: z.string().uuid(),
  status: AIJobStatusSchema,
  reply_text: z.string(),
  recommendations: z.array(z.object({
    exercise_id: z.string().optional(),
    suggested_weight_kg: z.number().optional(),
    suggested_reps: z.number().optional(),
    rationale: z.string(),
  })).optional(),
  tokens_used: z.number().optional(),
  completed_at: z.string().datetime().optional(),
});

export type AIJobPayload = z.infer<typeof AIJobPayloadSchema>;
export type AIJobResponse = z.infer<typeof AIJobResponseSchema>;
```

## 🧪 Plano de Testes & TDD (Red -> Green -> Refactor)
- **Padrão**: `InMemoryAIJobRepository` e `MockGeminiAdapter`.
- **Casos de Teste em Jest**:
  - `should block non-pro user from enqueuing AI coaching requests (SubscriptionGuard)`
  - `should successfully enqueue job to PGMQ for pro subscriber`
  - `should parse structured Gemini response and emit realtime completion event`
  - `should handle timeout or Gemini API rate limit with graceful error state`

## 🏷️ Metadados
- **Tipo**: `feature`
- **Prioridade**: `baixa`
- **Branch Sugerida**: `feature/ai-coach-gemini-queue`

---

### Notificações Push Remotas (Expo Push Notifications)

## 📌 Contexto & Problema
Para engajar o usuário quando ele estiver com o aplicativo completamente fechado (tela desligada ou app encerrado), é necessário o suporte a Push Notifications remotas via Expo Push Service / APNs / FCM.

## ✅ Critérios de Aceite (DoD)
- [ ] Registro do token de push do dispositivo no perfil do usuário no Supabase.
- [ ] Disparo de Edge Function no Supabase para envio de push ao iniciar treino, receber desafio ou ser provocado.
- [ ] Tratamento de permissões de notificação com modal explicativo no primeiro login.

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- Modal nativo de permissão com explicação clara do valor das notificações.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Pattern**: Push Notification Service Adapter.
- **Supabase**: Supabase Database Webhook acionando Edge Function `send-push-notification` ao inserir registros em `workout_events` ou `bro_nudges`.

## 📜 Contratos TypeScript & Schemas
```typescript
import { z } from 'zod';

export const RegisterPushTokenSchema = z.object({
  user_id: z.string().uuid(),
  expo_push_token: z.string().startsWith('ExponentPushToken['),
  platform: z.enum(['ios', 'android', 'web']),
});

export type RegisterPushTokenPayload = z.infer<typeof RegisterPushTokenSchema>;
```

## 🧪 Plano de Testes & TDD
- `PushNotificationServiceTest`:
  - `should register valid expo push token on database profile`
  - `should dispatch push payload correctly through expo push endpoint`

## 🏷️ Metadados
- **Tipo**: `feature`
- **Prioridade**: `baixa`
- **Branch Sugerida**: `feature/expo-push-notifications`
