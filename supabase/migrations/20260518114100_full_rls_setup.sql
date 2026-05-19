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
  ('hero_images', jsonb_build_object(
    'home','',
    'about','',
    'services','',
    'gallery','',
    'videos','',
    'enquiry','',
    'contact',''
  )),
  ('home_why_us', jsonb_build_object(
    'eyebrow','Why Choose Us',
    'title','Moving made simple, safe and stress-free',
    'items', jsonb_build_array(
      jsonb_build_object('title','Safe & Insured','desc','Every shipment is handled with care and fully insured for peace of mind.'),
      jsonb_build_object('title','On-Time Delivery','desc','We respect deadlines. Scheduled and delivered on time, every time.'),
      jsonb_build_object('title','Trained Professionals','desc','Skilled packers and movers trained in modern handling techniques.'),
      jsonb_build_object('title','Pan-India Network','desc','Dedicated fleet covering Kakinada and all major Indian cities.')
    )
  )),
  ('home_process', jsonb_build_object(
    'eyebrow','Our Process',
    'title','A simple 4-step move',
    'items', jsonb_build_array(
      jsonb_build_object('step','01','title','Get a Free Quote','desc','Share your move details and receive a transparent estimate within hours.'),
      jsonb_build_object('step','02','title','Survey & Plan','desc','Our team plans packing, manpower and the right vehicle for your move.'),
      jsonb_build_object('step','03','title','Pack & Load','desc','Professional packing with quality materials. Safe loading by trained crew.'),
      jsonb_build_object('step','04','title','Transport & Deliver','desc','Careful unloading and unpacking at your new place.')
    )
  )),
  ('home_faqs', jsonb_build_object(
    'eyebrow','FAQ',
    'title','Frequently asked questions',
    'items', jsonb_build_array(
      jsonb_build_object('question','Do you provide service across India?','answer','Yes — we offer relocation, vehicle transport and warehousing across all major Indian cities from our Kakinada hub.'),
      jsonb_build_object('question','How are charges calculated?','answer','Charges depend on distance, volume of goods, type of service, packing material and floor access. Get a free transparent quote with no hidden fees.'),
      jsonb_build_object('question','Is my shipment insured?','answer','Yes, we offer transit insurance options to fully cover your goods during shifting.'),
      jsonb_build_object('question','How long does household shifting take?','answer','Local moves are usually completed in 1 day. Intercity moves take 2–7 days depending on distance.')
    )
  )),
  ('about',  jsonb_build_object(
    'heading','About SS Packers & Movers','body','We are a trusted relocation company based in Kakinada with years of experience in safe, on-time moves across India.',
    'years_experience','10+','happy_customers','5000+','cities_covered','100+')),
  ('social', jsonb_build_object('facebook','','instagram','','youtube','')),
  ('footer', jsonb_build_object('description','Your trusted partner for safe and reliable relocation services across India.','quick_links','Home, Services, About Us, Contact, Get Free Quote')),
  ('meta',   jsonb_build_object(
    'site_name','SS Packers & Movers','default_title','SS Packers & Movers - Trusted Relocation in Kakinada',
    'default_description','Professional packers and movers in Kakinada offering home, office and vehicle transport across India.',
    'keywords','packers movers kakinada,home relocation,office shifting,vehicle transport,andhra pradesh')),
  ('seo',    jsonb_build_object(
    'default', jsonb_build_object(
      'title','SS Packers & Movers Kakinada | Trusted Relocation & Transport',
      'description','Professional packers & movers in Kakinada — household shifting, office relocation, car transport, warehouse storage. Get a free quote today.',
      'keywords','packers and movers Kakinada, movers Kakinada, household shifting Kakinada, car transport Andhra Pradesh, office relocation Kakinada',
      'og_image','https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e'
    ),
    'pages', jsonb_build_object(
      'home', jsonb_build_object(
        'title','SS Packers & Movers Kakinada | Trusted Relocation & Transport',
        'description','Professional packers & movers in Kakinada — household shifting, office relocation, car transport, warehouse storage. Get a free quote today.',
        'keywords','packers and movers Kakinada, movers Kakinada, household shifting Kakinada, car transport Andhra Pradesh, office relocation Kakinada',
        'og_image','https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e'
      ),
      'about', jsonb_build_object(
        'title','About SS Packers & Movers Kakinada',
        'description','Learn about SS Packers & Movers — Kakinada''s trusted relocation company serving households and businesses across India.',
        'keywords','about SS Packers & Movers, Kakinada movers, relocation company Kakinada',
        'og_image','https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e'
      ),
      'services', jsonb_build_object(
        'title','Services — SS Packers & Movers Kakinada',
        'description','Household shifting, office relocation, car transport, warehousing, loading & unloading and more — across India from Kakinada.',
        'keywords','moving services Kakinada, office relocation, household shifting, vehicle transport',
        'og_image','https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e'
      ),
      'gallery', jsonb_build_object(
        'title','Gallery — SS Packers & Movers',
        'description','Photos from our packing, moving, warehousing and vehicle transport operations.',
        'keywords','packers movers gallery, relocation photos, moving company Kakinada',
        'og_image','https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e'
      ),
      'videos', jsonb_build_object(
        'title','Videos — SS Packers & Movers',
        'description','Watch how SS Packers & Movers handles your relocation.',
        'keywords','packers movers videos, relocation process, moving company videos',
        'og_image','https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e'
      ),
      'enquiry', jsonb_build_object(
        'title','Get a Free Quote — SS Packers & Movers Kakinada',
        'description','Tell us about your move and get a free, no-obligation quote from SS Packers & Movers.',
        'keywords','moving quote Kakinada, relocation estimate, packers movers enquiry',
        'og_image','https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e'
      ),
      'contact', jsonb_build_object(
        'title','Contact SS Packers & Movers Kakinada',
        'description','Reach SS Packers & Movers in Kakinada — phone, WhatsApp, email and address.',
        'keywords','contact packers movers Kakinada, moving company phone, relocation contact',
        'og_image','https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e'
      )
    )
  )),
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
