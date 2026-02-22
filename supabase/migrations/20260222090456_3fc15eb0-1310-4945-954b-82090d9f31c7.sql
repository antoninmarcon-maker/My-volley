ALTER TABLE public.saved_players
  ADD CONSTRAINT saved_players_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;