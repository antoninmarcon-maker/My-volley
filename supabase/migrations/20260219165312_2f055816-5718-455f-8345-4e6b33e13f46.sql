
-- Saved players pool per user per sport
CREATE TABLE IF NOT EXISTS public.saved_players (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  sport text NOT NULL DEFAULT 'volleyball',
  number text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, sport, number, name)
);

ALTER TABLE public.saved_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved players" ON public.saved_players FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their saved players" ON public.saved_players FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their saved players" ON public.saved_players FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their saved players" ON public.saved_players FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_players_user_sport ON public.saved_players(user_id, sport);

CREATE TRIGGER update_saved_players_updated_at
  BEFORE UPDATE ON public.saved_players
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
