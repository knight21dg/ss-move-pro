
DROP TABLE IF EXISTS public.booking_tracking CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.support_tickets CASCADE;
DROP TABLE IF EXISTS public.user_addresses CASCADE;
DROP TYPE IF EXISTS public.booking_status CASCADE;
DROP TYPE IF EXISTS public.payment_status CASCADE;
DROP TYPE IF EXISTS public.ticket_status CASCADE;

DO $$ BEGIN
  CREATE TYPE public.enquiry_status AS ENUM ('new', 'contacted', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services public readable" ON public.services FOR SELECT USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage services" ON public.services FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  image_url text NOT NULL,
  category text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery public readable" ON public.gallery_images FOR SELECT USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage gallery" ON public.gallery_images FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_gallery_updated BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Videos public readable" ON public.videos FOR SELECT USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage videos" ON public.videos FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_videos_updated BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  rating int NOT NULL DEFAULT 5,
  message text NOT NULL,
  avatar_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials public readable" ON public.testimonials FOR SELECT USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  service text,
  moving_date date,
  from_city text,
  to_city text,
  message text,
  status public.enquiry_status NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone submit enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view enquiries" ON public.enquiries FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update enquiries" ON public.enquiries FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete enquiries" ON public.enquiries FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_enquiries_updated BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings public readable" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO storage.buckets (id, name, public) VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read site-media" ON storage.objects FOR SELECT USING (bucket_id = 'site-media');
CREATE POLICY "Admins upload site-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site-media" ON storage.objects FOR UPDATE USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site-media" ON storage.objects FOR DELETE USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (key, value) VALUES
  ('contact', '{"phone":"+91 9876543210","whatsapp":"+91 9876543210","email":"info@sspackersmovers.in","address":"Kakinada, Andhra Pradesh, India"}'::jsonb),
  ('hero', '{"title":"SS Packers & Movers","subtitle":"Trusted Relocation in Kakinada & Across India","cta":"Get Free Quote"}'::jsonb),
  ('about', '{"heading":"About SS Packers & Movers","body":"We are a trusted relocation company based in Kakinada with years of experience in safe, on-time moves across India.","years_experience":"10+","happy_customers":"5000+","cities_covered":"100+"}'::jsonb),
  ('social', '{"facebook":"","instagram":"","youtube":""}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.services (title, slug, description, icon, sort_order) VALUES
  ('Home Relocation', 'home-relocation', 'Safe and stress-free shifting of your household goods anywhere in India.', 'Home', 1),
  ('Office Relocation', 'office-relocation', 'Minimal-downtime office and commercial shifting with expert handling.', 'Building2', 2),
  ('Vehicle Transport', 'vehicle-transport', 'Door-to-door car and bike transportation using enclosed carriers.', 'Car', 3),
  ('Packing & Unpacking', 'packing-unpacking', 'Premium-grade packing materials and trained crew for safe transit.', 'Package', 4),
  ('Loading & Unloading', 'loading-unloading', 'Professional manpower for safe loading and unloading of goods.', 'Truck', 5),
  ('Warehousing & Storage', 'warehousing-storage', 'Secure short and long term storage facilities for your belongings.', 'Warehouse', 6)
ON CONFLICT (slug) DO NOTHING;
