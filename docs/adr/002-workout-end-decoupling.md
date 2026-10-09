# ADR 002: Desacoplamento Total de Ações Sociais e Fim de Treino

## Status
Aceito (Accepted)

## Contexto
Anteriormente, o sistema previa possíveis gatilhos automáticos ou sonoros ao concluir um treino ou registrar sets (ex: taunts automáticos, áudios disparados sem intenção explícita do usuário). Isso gerava ruído, interrupções indesejadas e tirava o controle do praticante durante o treino.

## Decisões de Arquitetura

### 1. Interações Sociais 100% Deliberadas e Manuais
- Nenhuma provocação, meme, TTS ou som de zoeira deve ser disparado de forma automática em resposta a eventos de treino (como iniciar treino, concluir treino, bater PR ou registrar sets).
- Todas as interações sociais pertencem estritamente à tela **Chilling** e exigem ação explícita e manual do usuário (botão "Enviar" ou toque no soundboard).

### 2. Encerramento de Treino Estritamente Pessoal
- O encerramento de treino (`finishWorkout`) é uma operação puramente de dados e de gamificação pessoal:
  - Salva a sessão como concluída (`status: 'completed'`).
  - Atribui BroPoints e atualiza Streak.
  - Atualiza o banco Supabase / LocalStorage silenciosamente.
  - Exibe apenas o modal de resumo pessoal (`WorkoutFinishModal`) sem triggers de áudio social.

### 3. Desacoplamento de Contextos
- O `WorkoutContext` e o fluxo de treino não importam nem dependem diretamente dos serviços de reprodução social de áudio (`AudioService` ou disparadores de `nudge`).

## Consequências
- **Positivas**: Experiência de treino focada e não invasiva; zero notificações ou áudios indesejados disparados sem consentimento do usuário; arquitetura limpa e desacoplada.
- **Negativas**: Usuário precisa ir manualmente à aba Chilling caso deseje provocar ou interagir com os amigos após treinar.
