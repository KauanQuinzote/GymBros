# ADR 003: Padronização da Paleta Visual com Classes Nativas do Tailwind CSS

## Status
Aceito (Accepted)

## Contexto
O aplicativo continha classes CSS com valores hexadecimais inline hardcoded (ex: `bg-[#0A0D14]`, `bg-[#161B26]`, `border-[#262F42]`, `text-[#0A84FF]`, `text-[#00F0FF]`), o que poluía os arquivos JSX/TSX, dificultava a manutenção e causava inconsistências de estilo.

## Decisões de Arquitetura

### 1. Adoção Estrita das Cores Nativas do Tailwind CSS
Eliminar todos os valores arbitrários `[#...]` do código e mapeá-los para as classes oficiais do Tailwind:
- **Background Principal**: `bg-slate-950` (substitui `#0A0D14`)
- **Card / Surface**: `bg-slate-900` (substitui `#161B26`)
- **Bordas**: `border-slate-800` (substitui `#262F42`)
- **Ações Primárias / Azul**: `bg-blue-600` / `text-blue-500` / `border-blue-500` (substitui `#0A84FF`)
- **Ciano / Acentos Chilling**: `text-cyan-400` / `bg-cyan-400/15` / `border-cyan-400` (substitui `#00F0FF`)
- **Verde / Status / Treinando**: `text-emerald-400` / `bg-emerald-500` (substitui `#00FF88` / `#30D158`)
- **Amarelo / Pontos / Badges**: `text-amber-400` / `bg-amber-400/15` (substitui `#FFD60A` / `#FFB800`)
- **Vermelho / Alertas**: `text-rose-500` / `bg-rose-500/15` / `border-rose-500` (substitui `#FF453A` / `#FF3B30`)
- **Texto Principal**: `text-slate-50` / `text-white`
- **Texto Secundário / Muted**: `text-slate-400` / `text-slate-300`

### 2. Estilização de Ícones com Classes Tailwind
- Os ícones Lucide devem ser estilizados via classes Tailwind (ex: `className="text-blue-500"`, `className="text-slate-400"`, `className="text-emerald-400"`), eliminando a necessidade de hexadecimais na prop `color` ou arquivos adicionais de constantes.

## Consequências
- **Positivas**: Código muito mais limpo, consistente, legível e padrão Tailwind/NativeWind; facilidade total para ajuste de temas e dark mode.
- **Negativas**: Necessidade de varredura completa em todos os componentes para substituir classes inline antigas.
