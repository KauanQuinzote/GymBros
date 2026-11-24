-- Migration: Multiplas Comunidades de Bros (Issue #7, ADR 006)
-- Idempotente: pode ser reaplicada sem efeitos colaterais.

-- 1. Tabelas
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 3 AND 50),
  description TEXT CHECK (description IS NULL OR char_length(description) <= 140),
  invite_code CHAR(6) NOT NULL UNIQUE CHECK (invite_code ~ '^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$'),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_members (
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (community_id, user_id)
);

CREATE INDEX IF NOT EXISTS community_members_user_id_idx ON public.community_members (user_id);

-- 2. Geracao de codigo de convite (alfabeto sem caracteres ambiguos 0/O/1/I)
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS CHAR(6)
LANGUAGE plpgsql
AS $$
DECLARE
  alphabet CONSTANT TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::INT, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.communities WHERE invite_code = code);
  END LOOP;
  RETURN code;
END;
$$;

-- 3. RPC: criar comunidade + criador como admin (transacional)
CREATE OR REPLACE FUNCTION public.create_community(p_name TEXT, p_description TEXT, p_user_id UUID)
RETURNS public.communities
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  created public.communities;
BEGIN
  -- Repete em caso de colisao concorrente do codigo de convite (UNIQUE)
  FOR attempt IN 1..5 LOOP
    BEGIN
      INSERT INTO public.communities (name, description, invite_code, created_by)
      VALUES (btrim(p_name), NULLIF(btrim(p_description), ''), public.generate_invite_code(), p_user_id)
      RETURNING * INTO created;
      EXIT;
    EXCEPTION WHEN unique_violation THEN
      IF attempt = 5 THEN RAISE; END IF;
    END;
  END LOOP;

  INSERT INTO public.community_members (community_id, user_id, role)
  VALUES (created.id, p_user_id, 'admin');

  RETURN created;
END;
$$;

-- 4. RPC: ingressar por codigo (idempotente). Nao exige listar communities.
CREATE OR REPLACE FUNCTION public.join_community(p_invite_code TEXT, p_user_id UUID)
RETURNS public.communities
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target public.communities;
BEGIN
  SELECT * INTO target
  FROM public.communities
  WHERE invite_code = upper(regexp_replace(p_invite_code, '\s', '', 'g'));

  IF NOT FOUND THEN
    RAISE EXCEPTION 'INVALID_INVITE_CODE' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.community_members (community_id, user_id, role)
  VALUES (target.id, p_user_id, 'member')
  ON CONFLICT (community_id, user_id) DO NOTHING;

  RETURN target;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_community(TEXT, TEXT, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.join_community(TEXT, UUID) TO anon, authenticated;

-- 5. RLS: mesmo padrao permissivo das demais tabelas (ADR 006, decisao 7).
--    O isolamento restritivo por auth.uid() depende da issue de Supabase Auth.
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on communities" ON public.communities;
CREATE POLICY "Allow public access on communities"
  ON public.communities FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on community_members" ON public.community_members;
CREATE POLICY "Allow public access on community_members"
  ON public.community_members FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 6. Backfill: comunidade padrao com todos os perfis existentes
DO $$
DECLARE
  default_id UUID;
  first_profile UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.communities WHERE name = 'GymBros Original') THEN
    SELECT id INTO first_profile FROM public.profiles ORDER BY created_at NULLS LAST LIMIT 1;

    INSERT INTO public.communities (name, description, invite_code, created_by)
    VALUES ('GymBros Original', 'Comunidade criada automaticamente com os bros existentes',
            public.generate_invite_code(), first_profile)
    RETURNING id INTO default_id;

    INSERT INTO public.community_members (community_id, user_id, role)
    SELECT default_id, p.id, CASE WHEN p.id = first_profile THEN 'admin' ELSE 'member' END
    FROM public.profiles p
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

-- 7. Realtime para membros (atualiza listas de membros ao vivo)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.community_members;
EXCEPTION WHEN duplicate_object THEN NULL;
END;
$$;
