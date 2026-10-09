# Padrão Oficial de Tasks & Issues - GymBros

Este documento define o formato detalhado de especificação para todas as tarefas e issues do **GymBros** no GitHub Kanban, alinhado à arquitetura Feature-Based, Design System Apple Minimalist e esteira Spec-Driven (Matt Pocock).

---

## 🏷️ Taxonomia de Labels (Sistema Simples 2D)

### 1. Tipo de Tarefa
- `feature`: Nova funcionalidade ou módulo no app.
- `bug`: Correção de comportamento incorreto, erro de sincronização ou falha visual.
- `enhancement`: Melhoria de UX/UI, performance ou expansão de feature existente.
- `refactor`: Reestruturação de código interno, renomeação de diretórios ou padronização sem alterar comportamento final.

### 2. Prioridade
- `alta`: Bloqueante ou indispensável para o fluxo de treino e sync real-time.
- `média`: Funcionalidade de valor social, gamificação ou automação relevante.
- `baixa`: Funcionalidade futura, polimento estético avançado ou IA.

---

## 📋 Template Padrão de Issue / Task

```markdown
## 📌 Contexto & Problema
<!-- Explicação clara da dor atual, motivação e valor entregue pela tarefa -->

## ✅ Critérios de Aceite (DoD)
- [ ] Critério 1 verificável
- [ ] Critério 2 verificável
- [ ] Critério 3 verificável

## 📱 Arquitetura de Interface & Design System (Apple Minimalist)
- **Regra de LOC**: Arquivos < 100 LOC (modularizar tela em `[Feature]Top`, `[Feature]Mid` e `[Feature]Bottom`).
- **Iconografia**: Estritamente vetorial (`lucide-react-native`). **Zero Emojis**.
- **Tokens Semânticos**: `bg-apple-dark`, `border-apple-border`, `text-neon-cyan`, `bg-apple-card`, etc.
- **Componentes / Modais**: Uso de ActionSheets/Modais nativos, feedback tátil (`expo-haptics`) e estados de loading esqueleto/otimistas.

## ⚙️ Design Patterns & Ferramentas Supabase
- **Design Patterns**: Repository Pattern (abstração de acesso a dados), Observer / Pub-Sub (eventos real-time), State Machine (estados de treino/desafio), Adapter (APIs externas / Pagamentos).
- **Recursos Supabase**: 
  - Realtime (`Presence` & `Broadcast` channels)
  - Banco de Dados & RLS (Políticas seguras com `auth.uid()`)
  - Storage (Buckets CDN públicos/privados)
  - Edge Functions & Filas (`pgmq` / `pg_net` / Webhooks assíncronos)

## 📜 Contratos TypeScript & Schemas (Zod)
```typescript
// Exemplo de interfaces de entrada, saída e schemas de validação
export interface FeaturePayload { ... }
export interface FeatureResponse { ... }
export const FeatureSchema = z.object({ ... });
```

## 🧪 Plano de Testes & TDD (Red -> Green -> Refactor)
- **Padrão**: In-Memory Repository Mock e validação estrita de contratos.
- **Casos de Teste em Jest**:
  - Teste 1: Validação de input com schema Zod
  - Teste 2: Execução do caso de sucesso (Happy path)
  - Teste 3: Tratamento de exceção / borda / falha de conexão
- **Testes de UI**: React Native Testing Library verificando renderização condicional e acessibilidade.

## 🏷️ Metadados
- **Tipo**: `feature` | `bug` | `enhancement` | `refactor`
- **Prioridade**: `alta` | `média` | `baixa`
- **Branch Sugerida**: `feature/<slug-da-task>` ou `fix/<slug-da-task>`
```
