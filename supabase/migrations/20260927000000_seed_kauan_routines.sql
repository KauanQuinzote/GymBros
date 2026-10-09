-- Migração: Inserção idempotente e segura das rotinas de treino para o perfil Kauan
-- Garante que se o perfil ou as rotinas já existirem, elas NUNCA sejam sobrescritas nem duplicadas

DO $$
DECLARE
  v_kauan_id UUID;
BEGIN
  -- 1. Buscar o ID do Kauan existente na tabela profiles ou criar caso não exista
  SELECT id INTO v_kauan_id 
  FROM public.profiles 
  WHERE name ILIKE '%Kauan%' 
  ORDER BY created_at ASC 
  LIMIT 1;

  IF v_kauan_id IS NULL THEN
    INSERT INTO public.profiles (name, initials, avatar_color, pin_code, email, bro_points, streak)
    VALUES ('Kauan Domingues', 'KD', '#0A84FF', '1234', 'kauandominguesdesouza@gmail.com', 0, 0)
    RETURNING id INTO v_kauan_id;
  END IF;

  -- 2. Inserir as rotinas com verificação WHERE NOT EXISTS (Idempotente)

  -- Treino 1: Peito + Ombro + Abdômen
  IF NOT EXISTS (
    SELECT 1 FROM public.routines 
    WHERE created_by = v_kauan_id AND title = 'Peito + Ombro + Abdômen'
  ) THEN
    INSERT INTO public.routines (title, target_muscle, created_by, exercises)
    VALUES (
      'Peito + Ombro + Abdômen',
      'Peito, Ombros e Abdômen',
      v_kauan_id,
      '[
        {"id": "ex-supino-inc-halter", "name": "Supino Inclinado (Halter)", "defaultSets": 3, "defaultReps": 9, "defaultWeight": 28, "targetMuscle": "Peito"},
        {"id": "ex-supino-reto-halter", "name": "Supino Reto (Halter)", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 26, "targetMuscle": "Peito"},
        {"id": "ex-crossover-polia-alta", "name": "Crossover Polia Alta", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 30, "targetMuscle": "Peito"},
        {"id": "ex-desenvolvimento-maq", "name": "Desenvolvimento Máquina", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 22, "targetMuscle": "Ombros"},
        {"id": "ex-elevacao-lateral", "name": "Elevação Lateral", "defaultSets": 2, "defaultReps": 10, "defaultWeight": 36, "targetMuscle": "Ombros"},
        {"id": "ex-abdomen-maquina", "name": "Abdômen Máquina", "defaultSets": 3, "defaultReps": 9, "defaultWeight": 80, "targetMuscle": "Abdômen"}
      ]'::jsonb
    );
  END IF;

  -- Treino 2: Pernas
  IF NOT EXISTS (
    SELECT 1 FROM public.routines 
    WHERE created_by = v_kauan_id AND title = 'Pernas'
  ) THEN
    INSERT INTO public.routines (title, target_muscle, created_by, exercises)
    VALUES (
      'Pernas',
      'Quadríceps, Posterior e Panturrilha',
      v_kauan_id,
      '[
        {"id": "ex-hack", "name": "Hack", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 60, "targetMuscle": "Quadríceps"},
        {"id": "ex-stiff-rdl", "name": "Stiff / RDL", "defaultSets": 3, "defaultReps": 9, "defaultWeight": 22, "targetMuscle": "Posterior"},
        {"id": "ex-extensora-unilateral", "name": "Cadeira Extensora Unilateral", "defaultSets": 3, "defaultReps": 10, "defaultWeight": 50, "targetMuscle": "Quadríceps"},
        {"id": "ex-flexora", "name": "Cadeira Flexora", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 80, "targetMuscle": "Posterior"},
        {"id": "ex-leg-press", "name": "Leg Press", "defaultSets": 3, "defaultReps": 9, "defaultWeight": 80, "targetMuscle": "Pernas"},
        {"id": "ex-panturrilha", "name": "Panturrilha", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 40, "targetMuscle": "Panturrilha"}
      ]'::jsonb
    );
  END IF;

  -- Treino 3: Costas + Deltoide Posterior + Bíceps + Abdômen
  IF NOT EXISTS (
    SELECT 1 FROM public.routines 
    WHERE created_by = v_kauan_id AND title = 'Costas + Deltoide Posterior + Bíceps + Abdômen'
  ) THEN
    INSERT INTO public.routines (title, target_muscle, created_by, exercises)
    VALUES (
      'Costas + Deltoide Posterior + Bíceps + Abdômen',
      'Costas, Deltoide, Bíceps e Abdômen',
      v_kauan_id,
      '[
        {"id": "ex-puxada-frente", "name": "Puxada Frente Polia", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 75, "targetMuscle": "Costas"},
        {"id": "ex-cavalinho", "name": "Cavalinho Neutro", "defaultSets": 3, "defaultReps": 9, "defaultWeight": 35, "targetMuscle": "Costas"},
        {"id": "ex-serrote", "name": "Remada Unilateral (Serrote)", "defaultSets": 3, "defaultReps": 9, "defaultWeight": 35, "targetMuscle": "Costas"},
        {"id": "ex-crucifixo-inverso", "name": "Crucifixo Inverso", "defaultSets": 3, "defaultReps": 10, "defaultWeight": 40, "targetMuscle": "Deltoide Posterior"},
        {"id": "ex-rosca-zottman", "name": "Rosca Zottman", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 10, "targetMuscle": "Bíceps/Antebraço"},
        {"id": "ex-abs-inclinado", "name": "Abdômen Inclinado", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 3, "targetMuscle": "Abdômen"}
      ]'::jsonb
    );
  END IF;

  -- Treino 4: Peito + Bi-set Tríceps/Bíceps
  IF NOT EXISTS (
    SELECT 1 FROM public.routines 
    WHERE created_by = v_kauan_id AND title = 'Peito + Bi-set Tríceps/Bíceps'
  ) THEN
    INSERT INTO public.routines (title, target_muscle, created_by, exercises)
    VALUES (
      'Peito + Bi-set Tríceps/Bíceps',
      'Peito, Tríceps e Bíceps',
      v_kauan_id,
      '[
        {"id": "ex-supino-inc-45", "name": "Supino Inclinado 45°", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 27, "targetMuscle": "Peito"},
        {"id": "ex-peck-deck", "name": "Peck Deck", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 40, "targetMuscle": "Peito"},
        {"id": "ex-triceps-corda", "name": "Tríceps Corda (Bi-set 1)", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 50, "targetMuscle": "Tríceps"},
        {"id": "ex-rosca-scott", "name": "Rosca Scott (Bi-set 1)", "defaultSets": 3, "defaultReps": 9, "defaultWeight": 55, "targetMuscle": "Bíceps"},
        {"id": "ex-triceps-frances-polia", "name": "Tríceps Francês na Polia (Bi-set 2)", "defaultSets": 3, "defaultReps": 9, "defaultWeight": 50, "targetMuscle": "Tríceps"},
        {"id": "ex-rosca-alt-inclinada", "name": "Rosca Alternada Inclinada (Bi-set 2)", "defaultSets": 3, "defaultReps": 8, "defaultWeight": 12, "targetMuscle": "Bíceps"}
      ]'::jsonb
    );
  END IF;

END $$;
