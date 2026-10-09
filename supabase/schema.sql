-- Script de criação das tabelas para o aplicativo GymBros no Supabase

-- 1. Tabela de Perfis de Usuários (Bros)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  initials VARCHAR(4) NOT NULL DEFAULT 'BR',
  avatar_color VARCHAR(16) NOT NULL DEFAULT '#0A84FF',
  pin_code VARCHAR(4) NOT NULL DEFAULT '1234',
  email TEXT,
  bro_points INT NOT NULL DEFAULT 0,
  streak INT NOT NULL DEFAULT 0,
  last_workout_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Fichas de Treino
CREATE TABLE IF NOT EXISTS public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  target_muscle TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Sessões de Treino
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  routine_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed'
  current_exercise TEXT,
  current_set INT DEFAULT 1,
  current_weight_kg NUMERIC(5,2) DEFAULT 0,
  bro_points_earned INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- 4. Tabela de Logs de Séries Concluídas
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  set_number INT NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL,
  reps INT NOT NULL,
  is_pr BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Provocações (Taunts/Nudges)
CREATE TABLE IF NOT EXISTS public.nudges (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_initials TEXT,
  receiver_id TEXT NOT NULL,
  nudge_text TEXT NOT NULL,
  category TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Realtime para workout_sessions, workout_logs, profiles e nudges
ALTER PUBLICATION supabase_realtime ADD TABLE public.workout_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workout_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.nudges;
