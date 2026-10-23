# GymBros - TODO & Backlog

## Prioridade Próxima

### 1. Rebranding & Nomenclaturas
- [x] **Renomear Projeto & App**:
  - Atualizar o nome do projeto de **MyBroth** para **GymBros**.
  - Remover `app_temp` do `app.json` (`name`, `slug`) e do `package.json` (`name`), definindo o nome exibido no celular como **GymBros**.
- [x] **Identidade Visual & Ícone do App**:
  - Criar e configurar o ícone oficial do **GymBros** seguindo o padrão Apple Minimalist / Neon Dark (1024x1024 px).
  - Configurar ícones adaptativos do Android (`android-icon-foreground.png`, `android-icon-background.png`, `monochromeImage`) e `splash-icon.png`.
- [x] **Renomear Romance para Chilling**: Atualizar a feature/seção de romance para **Chilling**.
- [x] **Refatoração Global de Nomenclaturas e Pastas (`bromance` -> `chilling` / termos pertinentes)**:
  - Renomear o diretório `src/features/bromance/` para `src/features/chilling/` (ou `src/features/chill/`).
  - Renomear todos os arquivos com prefixo ou menção a bromance (ex: `src/features/bromance/context/BromanceContext.tsx` -> `ChillContext.tsx`, `BromanceScreen.tsx` -> `ChillingScreen.tsx`, testes `BromanceContext.taunts.test.tsx`, etc.).
  - Renomear hooks, tipos e contextos exportados (`useBromance` -> `useChilling`, `BromanceContext` -> `ChillingContext`, `BromanceProvider` -> `ChillingProvider`, `BromanceNudgeLog` -> `ChillingNudgeLog`, etc.).
  - Substituir chaves de persistência legadas (ex: `@mybroth_nudges_history` ou chaves de storage antigas) para o padrão `@gymbros_*`.
  - Atualizar todas as importações em `App.tsx`, componentes e testes automatizados.
- [ ] **Padronização de Cores & Tokens (Tailwind / NativeWind)**:
  - Mapear paleta completa no `tailwind.config.js` (ex: `neon-cyan`, `neon-green`, `neon-yellow`, `neon-red`, `apple-dark`, `apple-card`, `apple-border`).
  - Eliminar cores hexadecimais inline/hardcoded no Tailwind (ex: `[#00F0FF]`, `[#0A0D14]`, `[#161B26]`, `[#262F42]`), substituindo por classes de tokens semânticos (`bg-apple-dark`, `border-apple-border`, `text-neon-cyan`, etc.).
  - Centralizar constantes de cores em `src/shared/theme/colors.ts` para uso em ícones Lucide e props nativas.

### 2. Sincronização Real-time Cross-Device (PC <-> Celular)
- [ ] **Bug: Notificação de Início de Treino para Bros da Equipe**:
  - **Problema**: Ao iniciar um treino, isso não é notificado aos bros da mesma equipe/comunidade. Atualmente o evento/notificação só é disparado/recebido se o usuário estiver online no app naquele instante.
  - **Solução**: Garantir que o evento de início de treino seja persistido e propagado via Supabase Realtime / canais de comunidade e notificações push para que todos os bros da equipe sejam notificados confiavelmente, mesmo em background ou reabertura do app.
- [x] **Servidor de Sync LAN (Dev)** ou **Configuração do Supabase Realtime**:
  - **Motivo**: Atualmente, a presença online local (`AsyncStorage` / `BroadcastChannel`) funciona apenas entre abas do mesmo dispositivo (PC <-> PC).
  - **Solução Planejada**:
    - **Opção A (LAN Server)**: Servidor Node/WebSocket na rede local para sincronizar eventos em tempo real.
    - **Opção B (Supabase Cloud)**: Conectar `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` com canais de `Presence` e `Broadcast`.

### 3. Comunidades & Privacidade de Bros
- [x] **Sincronização Dinâmica de Perfis do Supabase**:
  - Garantir que o app carregue e liste todos os perfis cadastrados diretamente da tabela `profiles` do Supabase na inicialização (sem ficar restrito ao fallback local que só lista o usuário inicial).
  - Tratar mapeamento de campos (`name`, `avatar_emoji` / `avatar_color`, `pin_code`, `initials`) para que bros como o Fábio e novos usuários apareçam imediatamente na seleção de perfil.
- [ ] **Múltiplas Comunidades de Bros**: Possibilidade de criar várias comunidades/grupos de amigos.
  - Cada bro pode pertencer a 1..N comunidades.
  - Os treinos e atividades devem ser visíveis apenas para os membros das comunidades em que o bro participa (evitando que usuários desconhecidos vejam treinos).
- [ ] **Configuração e Ativação de RLS (Row Level Security) no Supabase**:
  - Habilitar RLS em todas as tabelas geradas no Supabase (`profiles`, `workout_routines`, `workout_exercises`, `workout_logs`, `communities`, `community_members`, `presence_events`, `bro_nudges`).
  - Definir e testar políticas restritivas de `SELECT`, `INSERT`, `UPDATE` e `DELETE` baseadas em `auth.uid()` e vínculo de membros de comunidade.
  - Garantir que migrações futuras mantenham idempotência e não bloqueiem operações anon/authenticated autorizadas.

### 4. Treinos & Cardio
- [ ] **Tipos Avançados de Séries & Exercícios**:
  - Registrar exercícios e séries especiais: **Bi-set**, **Drop-set**, **Aquecimento** (Warm-up / Feeder sets).
  - Cada série/variação deve suportar suas próprias **cargas** e **repetições** personalizadas e independentes.
- [ ] **Diferentes Tipos de Cardio**: Adicionar suporte a múltiplos tipos e modalidades de cardio no treino (esteira, bike, escada, corrida externa, etc., com métricas apropriadas como tempo, distância, calorias, velocidade).
- [ ] **Aviso Sonoro de Fim de Descanso**: Tocar um som/efeito sonoro ou vibração automaticamente quando o timer de descanso entre séries/exercícios chegar a zero.
- [ ] **Status do Treino em Tempo Real**: Ao clicar no ícone do bro na Home (ativo no treino), visualizar exatamente em qual momento do treino ele está (qual exercício, série/rep, peso, cardio em andamento, tempo decorrido).
- [ ] **Dashboard de Evolução**: Painel completo para acompanhar o progresso e histórico de ganhos em exercícios (sobrecarga progressiva/1RM), peso corporal, cardio e frequência.

### 5. Social, Provocações & Mídia
- [x] **Seleção de Destinatários em Provocações**: Ao enviar provocações, selecionar 1..N bros da sua comunidade (com destaque para quem estiver ativo/treinando naquele momento).
- [x] **Efeito Sonoro do Taco Bell**: O som do Taco Bell deve tocar automaticamente no dispositivo de quem receber uma provocação (áudio de gatilho do sistema, não disponível como opção enviável na lista).
- [ ] **Fotos de Visualização Única**: Envio de fotos temporárias/one-view entre bros.
- [x] **Frase Personalizada com Leitura Narrada (TTS)**: Enviar frases customizadas que são faladas por voz sintetizada/narração no app do bro.
- [x] **Aba Chilling Reestruturada**: Separar a tela de Chilling em 3 abas dedicadas:
  - Aba 1: Trash Talk (frases prontas com filtros).
  - Aba 2: Soundboard com botões de memes e efeitos sonoros categorizados.
  - Aba 3: Áudios de Voz / TTS customizado com preview.
- [x] **Classificação dos Áudios por Categorias**:
  - Organizar e classificar o catálogo de áudios/memes em categorias (Pesado/Hardcore, Frango/Zoeira, Motivação, Clássicos).
  - Adicionar navegação por chips de categorias no Soundboard para busca e seleção rápida.
- [x] **Refatoração da Arquitetura de Áudios & Soundboard**:
  - Modularização dos dados de áudios em schemas tipados por categoria (`soundboardData.ts`).
- [x] **Investigação & Fix de Áudio no Mobile vs. Web**:
  - Configuração do modo de áudio nativo (`setAudioModeAsync` com `playsInSilentMode: true` e `interruptionMode: 'duckOthers'`) com fallback automático para TTS.
- [ ] **Notificações na Barra de Notificação do Celular (Início de Treino do Bro)**:
  - Disparar notificação do sistema (Android notification shade / status bar) assim que um bro da comunidade iniciar o treino.
  - Exibir nome do bro, horário e treino iniciado (ex: *"Kauan acabou de iniciar o treino de Peito + Ombro!"*).
  - Permitir toque na notificação para abrir direto o app e acompanhar o status ou mandar uma provocação/motivação.
- [ ] **Remoção de Provocações Automáticas ao Finalizar Treino**:
  - Eliminar qualquer lógica que dispare provocações ou áudios automáticos no término do treino (provocações e memes devem ser 100% manuais e intencionais disparados pelos bros).
- [ ] **Hospedagem de Áudios no Supabase Storage**:
  - Criar bucket público `soundboard-audios` no Supabase Storage para hospedar todos os memes e efeitos sonoros com CDN rápida e sem bloqueio 403.
  - Atualizar `soundboardData.ts` para consumir URLs oficiais do Storage.

### 6. Gamificação, Desafios & Conquistas
- [ ] **Expansão de Conquistas (Achievements)**: Adicionar catálogo amplo de categorias e conquistas na gamificação (no mínimo 50 achievements divididos em categorias como Força, Constância, Social, Cardio, Desafios, etc.).
- [ ] **Sistema de Desafios ("Verdade ou Desafio" / Bro Challenges)**:
  - Desafios valendo Bro Points ou apostas/prêmios personalizados definidos pelo emissor.
  - Fluxo de validação: o bro que completa o desafio submete comprovação e o bro desafiante precisa validar/aprovar para liberar os pontos/prêmio.

### 7. DevOps, Qualidade & CI/CD
- [ ] **CLI & Automação de Checagem em PRs**:
  - Criar ferramenta CLI / script de validação de integridade (tipagem TypeScript, lint e suíte de testes unitários/integração).
  - Configurar GitHub Actions workflow para executar automaticamente essa CLI/validação toda vez que um Pull Request for aberto ou atualizado no GitHub (`pull_request`).

---

## Futuras Funcionalidades & IA
- [ ] **Agente de IA GymBros**: Integração com agente inteligente para:
  - Interação direta e motivação com o bro.
  - Acompanhamento da evolução física via análise de fotos.
  - Monitoramento e sugestões de evolução de treino, sobrecarga e dieta.
- [ ] **Notificações Push**: Alertas push quando o bro iniciar treino, mandar desafio ou enviar provocação.
