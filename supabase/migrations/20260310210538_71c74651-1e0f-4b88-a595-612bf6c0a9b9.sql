
-- Table: spots (using simple lat/lng columns instead of PostGIS geography)
CREATE TABLE public.spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'outdoor_hard',
  availability_period text,
  lat double precision,
  lng double precision,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spots_select_validated" ON public.spots FOR SELECT TO public USING (status = 'validated');
CREATE POLICY "spots_select_own" ON public.spots FOR SELECT TO public USING (auth.uid() = user_id);
CREATE POLICY "spots_insert_auth" ON public.spots FOR INSERT TO public WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "spots_update_owner" ON public.spots FOR UPDATE TO public USING (auth.uid() = user_id);
CREATE POLICY "spots_delete_owner" ON public.spots FOR DELETE TO public USING (auth.uid() = user_id);

-- View: spots_with_coords
CREATE OR REPLACE VIEW public.spots_with_coords AS
SELECT id, name, type, status, user_id, description, availability_period, created_at, lat, lng
FROM public.spots;

-- Table: spot_photos
CREATE TABLE public.spot_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id uuid NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  photo_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.spot_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spot_photos_select_public" ON public.spot_photos FOR SELECT TO public USING (true);
CREATE POLICY "spot_photos_insert_auth" ON public.spot_photos FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "spot_photos_delete_owner" ON public.spot_photos FOR DELETE TO public USING (auth.uid() = user_id);

-- Table: spot_comments
CREATE TABLE public.spot_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id uuid NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.spot_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spot_comments_select_public" ON public.spot_comments FOR SELECT TO public USING (true);
CREATE POLICY "spot_comments_insert_auth" ON public.spot_comments FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "spot_comments_delete_owner" ON public.spot_comments FOR DELETE TO public USING (auth.uid() = user_id);

-- Storage bucket for spot photos
INSERT INTO storage.buckets (id, name, public) VALUES ('spot-photos', 'spot-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "spot_photos_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'spot-photos');
CREATE POLICY "spot_photos_read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'spot-photos');
