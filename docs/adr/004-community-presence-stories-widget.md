# ADR 004: Redesign do Widget de Presença da Comunidade em Formato Inline 'Stories'

## Status
Aceito (Accepted)

## Contexto
O widget anterior de presença (`BroPresenceCard` e `NeonBroPresenceWidget`) renderizava múltiplos cartões empilhados verticalmente com informações detalhadas expandidas. Essa abordagem causava poluição visual e ocupava espaço vertical excessivo na tela inicial (`HomeScreen`), além de omitir membros que estivessem offline.

## Decisões de Arquitetura

### 1. Layout Inline em Linha Horizontal (Stories / Status)
- O `NeonBroPresenceWidget` passa a renderizar um `ScrollView` horizontal compacto com todos os Bros da comunidade.
- Cada membro da comunidade é representado por um item compacto (`BroPresenceCard` ou `BroPresenceAvatarItem`) composto por:
  - Avatar circular com as iniciais do Bro.
  - Borda reativa com cores neon do Tailwind de acordo com o status:
    - **Treinando**: Borda verde neon (`border-emerald-500`), anel brilhante, badge verde `TREINANDO`.
    - **Online**: Borda ciano neon (`border-cyan-400`), badge ciano `ON`.
    - **Offline**: Borda cinza discreta (`border-slate-800`), opacidade sutil (`opacity-60`), badge `OFF`.
  - Primeiro nome do Bro logo abaixo do avatar.

### 2. Exibição Completa da Comunidade
- O widget lista todos os perfis registrados no sistema (`profiles`), destacando quem está online/treinando e mantendo os membros offline visíveis com opacidade reduzida.
- O próprio usuário ativo pode ser indicado com uma tag "(Você)" ou filtrado como cabeçalho de comunidade.

### 3. Telemetria de Treino sob Demanda (On-Demand Modal/Sheet)
- Para evitar poluição visual, os detalhes de exercício atual, carga e repetições não ficam expostos diretamente no card inline.
- Ao tocar no avatar de um Bro que está em status `TRAINING` ou `ONLINE`, abre-se um modal minimalista com as informações em tempo real e atalho para interações de provocação/chilling.

## Consequências
- **Positivas**:
  - Interface muito mais limpa, moderna (Apple Minimalist) e dinâmica na Home.
  - Visibilidade total de todos os membros do grupo sem rolagem vertical excessiva.
  - Experiência interativa enriquecida com detalhes sob demanda.
- **Negativas**:
  - Telemetria de carga de quem está treinando exige um toque para visualização.
