-- Migração: Adicionar coluna 'exhibited' à tabela nudges e limpar fila legada
-- Data: 2026-10-08

-- 1. Adiciona a coluna exhibited com valor padrão FALSE
ALTER TABLE public.nudges 
ADD COLUMN IF NOT EXISTS exhibited BOOLEAN DEFAULT FALSE;

-- 2. Limpa o backlog legado de nudges antigos acumulados marcando como já exibidos
UPDATE public.nudges 
SET exhibited = TRUE 
WHERE exhibited IS NULL OR exhibited = FALSE;
