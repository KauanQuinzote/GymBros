# Especificação Técnica: Notificação Persistente de Início de Treino para a Equipe

## 1. Visão Geral
Esta especificação descreve a implementação da notificação em tempo real e na barra de notificações nativa do celular (Android/iOS) quando qualquer Bro da comunidade iniciar um treino.

## 2. Requisitos Funcionais
1. **Solicitação de Permissões**:
   - Inicializar o serviço de notificações em `NotificationService`.
   - Pedir permissão ao usuário de forma não intrusiva e configurar canal padrão do Android com som e vibração.
2. **Persistência & Broadcast**:
   - Quando um Bro iniciar uma sessão (`startWorkout`), registrar a sessão em `workout_sessions` com status `in_progress`.
   - Propagar via canal do Supabase Broadcast `'team_workout_events'` ou `'public:workout_sessions'`.
3. **Recepção & Notificação no Sistema**:
   - Quando o evento de início de treino de outro Bro for detectado:
     - Título: `GymBros - Treino Iniciado`
     - Corpo: `<Nome do Bro> acabou de iniciar o treino de <Nome da Ficha>.`
     - Zero emojis nas notificações.
4. **Atualização de Estado de Presença**:
   - Atualizar a presença do Bro imediatamente para `TRAINING` no widget e no `AuthContext`.

## 3. Arquitetura de Código
- `src/shared/services/notifications.ts`: Serviço wrapper de `expo-notifications` (cross-platform, seguro para Web e Native).
- `src/features/workout/context/WorkoutContext.tsx`: Disparo e escuta dos eventos da sessão.
- `src/features/workout/__tests__/WorkoutNotification.test.ts`: Testes unitários para o fluxo de notificação.

## 4. Plano de Testes
- Testar que `NotificationService.notifyWorkoutStarted` dispara notificação local com formato correto.
- Testar que o evento não notifica o próprio usuário que iniciou o treino.
- Testar fallback gracioso em plataformas web ou sem suporte a notificações.
