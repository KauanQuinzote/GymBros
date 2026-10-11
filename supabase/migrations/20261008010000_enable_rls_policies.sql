-- Migration: Enable RLS and configure policies for GymBros tables
-- Enables RLS and grants full access to anon and authenticated roles for app operations

-- 1. Table: profiles
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on profiles" ON profiles;
CREATE POLICY "Allow public access on profiles"
  ON profiles FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 2. Table: routines
ALTER TABLE IF EXISTS routines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on routines" ON routines;
CREATE POLICY "Allow public access on routines"
  ON routines FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Table: workout_sessions
ALTER TABLE IF EXISTS workout_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on workout_sessions" ON workout_sessions;
CREATE POLICY "Allow public access on workout_sessions"
  ON workout_sessions FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Table: workout_logs
ALTER TABLE IF EXISTS workout_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on workout_logs" ON workout_logs;
CREATE POLICY "Allow public access on workout_logs"
  ON workout_logs FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Table: nudges
ALTER TABLE IF EXISTS nudges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on nudges" ON nudges;
CREATE POLICY "Allow public access on nudges"
  ON nudges FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
