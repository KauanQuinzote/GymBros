# ADR 001: Arquitetura da Seção Chilling & Sistema de Provocações

## Status
Aceito (Accepted)

## Contexto
O aplicativo GymBros inclui funcionalidades sociais para interação e motivação entre parceiros de treino (bros). A tela anterior continha uma estrutura monolítica com problemas de reprodução de áudio em dispositivos móveis físicos (iOS/Android), falta de categorização eficiente no soundboard, ausência de seleção direcionada de destinatários e necessidade de suporte a frases personalizadas com leitura narrada (TTS).

## Decisões de Arquitetura

### 1. Estrutura de Navegação em 3 Abas
A tela **Chilling** será organizada com um Segmented Control superior em 3 abas dedicadas:
- **Trash Talk**: Catálogo de frases prontas para envio rápido, categorizadas por intensidade/estilo.
- **Soundboard**: Grade de memes e efeitos sonoros virais, organizada por filtros/chips de categorias (*Hardcore/Maromba*, *Frango/Zoeira*, *Motivação*, *Clássicos*).
- **Áudios de Voz**: Envio de frases personalizadas digitadas pelo usuário que são reproduzidas com narração de voz sintetizada (TTS) no dispositivo do destinatário.

### 2. Motor de Áudio Híbrido com Fallback
- Configuração de modo de áudio nativo (`setAudioModeAsync` com `playsInSilentMode: true` e `interruptionMode: 'duckOthers'`).
- Streaming direto de URLs remotas de áudio com tratamento de erros.
- Fallback automático para `SpeechService` (TTS via `expo-speech`) caso a URL de áudio falhe ou haja perda de conectividade.

### 3. Seleção de Destinatários
- Barra/seletor visual de bros com badge neon indicando status em tempo real (ONLINE / TREINANDO AGORA).
- Suporte a envio para um bro individual ou broadcast para "Todos os Bros".

### 4. Efeito Sonoro Taco Bell
- Áudio de sistema reservado (`taco-bell-bong.mp3`) que é disparado automaticamente no dispositivo do receptor quando uma nova provocação em tempo real chega via WebSocket/Supabase Realtime, antes da abertura do modal ou leitura da mensagem.

### 5. Modularização dos Dados do Soundboard
- Separação da estrutura de dados monolítica em schemas tipados com metadados: categoria, tags, nome e URL de streaming.

## Consequências
- **Positivas**: Interface mais limpa e rápida de navegar; garantia de que o áudio toca no celular; flexibilidade para o usuário enviar tanto memes quanto frases customizadas.
- **Negativas**: Necessidade de gerenciar múltiplos estados de abas e compatibilidade de áudio multiplataforma (Web vs. Expo Go / Android / iOS).
