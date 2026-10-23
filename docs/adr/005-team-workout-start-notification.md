# ADR 005: Notificação Persistente de Início de Treino via Supabase Realtime & Status Bar

## Status
Aceito

## Contexto
Quando um membro da equipe/comunidade inicia um treino, os outros bros não eram notificados caso não estivessem com o app aberto naquele exato segundo. O tracking era pontual e não enviava aviso local para o sistema operacional móvel.
Precisamos:
1. Persistir o status de treino em tempo real no Supabase na tabela `workout_sessions` (`status: 'in_progress'`).
2. Transmitir o evento via canal de broadcast / postgres changes para todos os dispositivos dos bros.
3. Disparar notificação nativa na barra de status do Android/iOS utilizando `expo-notifications`.
4. Atualizar o estado de presença em `AuthContext` e `WorkoutContext` para que a comunidade reconheça o bro como `TRAINING` imediatamente.

## Decisões de Arquitetura
1. **Reutilização da tabela `workout_sessions`**:
   - `workout_sessions` armazena `id`, `user_id`, `routine_name`, `status` ('in_progress' | 'completed' | 'cancelled') e `started_at`.
   - Evita duplicação desnecessária de schema criando uma tabela extra apenas para início de treino.
2. **Notificações do Sistema (`expo-notifications`)**:
   - Criar módulo de serviço `NotificationService` em `src/shared/services/notifications.ts`.
   - Solicitar permissões em runtime e configurar canal Android para prioridade alta com som/vibração.
   - Quando um broadcast ou inserção de `workout_sessions` com `status === 'in_progress'` de outro usuário for recebido, disparar notificação local informando: *"<Nome do Bro> acabou de iniciar o treino de <Ficha>!"*.
3. **Sincronização em `WorkoutContext` e `AuthContext`**:
   - Inscrição em canal Postgres Changes para `workout_sessions` abrangendo toda a comunidade (não apenas o `partnerProfile` estático).
   - Ao iniciar treino, propagar atualização imediata de presença no canal `bro_presence` com `status: 'TRAINING'`.

## Consequências
- **Positivas**:
  - Os bros recebem notificação visual na barra de notificações do celular mesmo com o app minimizado ou aberto em outra tela.
  - Conformidade estrita com o Design System Apple Minimalist (Zero Emojis nas mensagens da notificação).
  - Testabilidade completa via mocks de `expo-notifications` e testes unitários.
- **Negativas**:
  - Requer que o usuário conceda permissão de notificação no celular.
