
-- GymBros - Issue #8
-- Vinculo entre perfil existente e Supabase Auth.
-- Preserva os registros existentes.

BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS auth_user_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND conname = 'profiles_auth_user_id_fkey'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_auth_user_id_fkey
      FOREIGN KEY (auth_user_id)
      REFERENCES auth.users (id)
      ON DELETE SET NULL;
  END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_auth_user_id_uidx
  ON public.profiles (auth_user_id)
  WHERE auth_user_id IS NOT NULL;

COMMENT ON COLUMN public.profiles.auth_user_id IS
  'Supabase Auth user linked to this legacy profile. NULL means not yet linked.';

COMMIT;