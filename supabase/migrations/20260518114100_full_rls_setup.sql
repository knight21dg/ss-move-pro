-- ============================================================
-- SUPABASE SETUP: Auth helpers + profiles + user_roles + RLS
-- Run this in Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- 1. Enums (guard against double-creation)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.enquiry_status AS ENUM ('new', 'contacted', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Helper: touch updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = 'public';

-- 3. Helper: has_role (used in every RLS policy)
CREATE OR REPLACE FUNCTION public.has_role(_user_id TEXT, _role public.app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id  = _user_id
      AND role     = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- 4. profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id    TEXT PRIMARY KEY,
  full_name  TEXT,
  phone      TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "profiles_self_read"
  ON public.profiles FOR SELECT
  USING ( user_id = auth.uid()::text OR public.has_role(auth.uid()::text, 'admin') );

CREATE POLICY IF NOT EXISTS "profiles_self_update"
  ON public.profiles FOR UPDATE
  USING ( user_id = auth.uid()::text )
  WITH CHECK ( user_id = auth.uid()::text );

CREATE POLICY IF NOT EXISTS "profiles_admin_update"
  ON public.profiles FOR UPDATE
  USING ( public.has_role(auth.uid()::text, 'admin') )
  WITH CHECK ( public.has_role(auth.uid()::text, 'admin') );

DROP TRIGGER IF EXISTS trg_profiles_updated ON public.profiles;
CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 5. user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   TEXT NOT NULL,
  role      public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "admins_manage_roles"
  ON public.user_roles FOR ALL
  USING ( public.has_role(auth.uid()::text, 'admin') )
  WITH CHECK ( public.has_role(auth.uid()::text, 'admin') );

DROP TRIGGER IF EXISTS trg_roles_updated ON public.user_roles;
CREATE TRIGGER trg_roles_updated
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Users can read their own role (needed for useAuth checkAdmin)
DROP POLICY IF EXISTS "users_read_own_role" ON public.user_roles;
CREATE POLICY "users_read_own_role"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid()::text);

-- Unique constraint on user_id so ON CONFLICT works
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_key;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);

-- 6. Auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE has_admin BOOLEAN;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  ) ON CONFLICT (user_id) DO NOTHING;

  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO has_admin;
  IF NOT has_admin THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

DROP TRIGGER IF EXISTS trg_handle_new_user ON auth.users;
CREATE TRIGGER trg_handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Storage bucket + RLS (guard against double-creation)
INSERT INTO storage.buckets (id, name, public) VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "Public read site-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');

CREATE POLICY IF NOT EXISTS "Admins upload site-media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid()::text, 'admin'));

CREATE POLICY IF NOT EXISTS "Admins update site-media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid()::text, 'admin'));

CREATE POLICY IF NOT EXISTS "Admins delete site-media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid()::text, 'admin'));

-- 8. Sample site_settings (idempotent)
INSERT INTO public.site_settings (key, value) VALUES
  ('contact', jsonb_build_object(
    'phone', '+91 9876543210', 'whatsapp', '+91 9876543210',
    'email', 'info@sspackersmovers.in', 'address', 'Kakinada, Andhra Pradesh, India',
    'whatsapp_enquiry_message', 'Hi, I''m interested in your services. Can you please share a quote based on my details?')),
  ('hero',   jsonb_build_object('title','SS Packers & Movers','subtitle','Trusted Relocation in Kakinada & Across India','cta','Get Free Quote')),
  ('about',  jsonb_build_object(
    'heading','About SS Packers & Movers','body','We are a trusted relocation company based in Kakinada with years of experience in safe, on-time moves across India.',
    'years_experience','10+','happy_customers','5000+','cities_covered','100+')),
  ('social', jsonb_build_object('facebook','','instagram','','youtube','')),
  ('footer', jsonb_build_object('description','Your trusted partner for safe and reliable relocation services across India.','quick_links','Home, Services, About Us, Contact, Get Free Quote')),
  ('meta',   jsonb_build_object(
    'site_name','SS Packers & Movers','default_title','SS Packers & Movers - Trusted Relocation in Kakinada',
    'default_description','Professional packers and movers in Kakinada offering home, office and vehicle transport across India.',
    'keywords','packers movers kakinada,home relocation,office shifting,vehicle transport,andhra pradesh')),
  ('cta',    jsonb_build_object('banner_text','Get a Free Quote Today!','banner_link','#contact','banner_button','Request Quote','show_banner',true))
ON CONFLICT (key) DO NOTHING;

-- 9. Sample services (idempotent)
INSERT INTO public.services (title, slug, description, icon, sort_order) VALUES
  ('Home Relocation', 'home-relocation', 'Safe and stress-free shifting of your household goods anywhere in India.', 'Home', 1),
  ('Office Relocation', 'office-relocation', 'Minimal-downtime office and commercial shifting with expert handling.', 'Building2', 2),
  ('Vehicle Transport', 'vehicle-transport', 'Door-to-door car and bike transportation using enclosed carriers.', 'Car', 3),
  ('Packing & Unpacking', 'packing-unpacking', 'Premium-grade packing materials and trained crew for safe transit.', 'Package', 4),
  ('Loading & Unloading', 'loading-unloading', 'Professional manpower for safe loading and unloading of goods.', 'Truck', 5),
  ('Warehousing & Storage', 'warehousing-storage', 'Secure short and long term storage facilities for your belongings.', 'Warehouse', 6)
ON CONFLICT (slug) DO NOTHING;
