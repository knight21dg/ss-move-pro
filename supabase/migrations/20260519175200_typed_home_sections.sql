-- ============================================================
-- MIGRATION: Convert JSON home sections to typed columns
-- ============================================================

-- 1. Create home_why_us_items table
CREATE TABLE IF NOT EXISTS public.home_why_us_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_why_us_settings_id int NOT NULL REFERENCES public.home_why_us_settings(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create home_process_items table
CREATE TABLE IF NOT EXISTS public.home_process_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_process_settings_id int NOT NULL REFERENCES public.home_process_settings(id) ON DELETE CASCADE,
  step text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Create home_faqs_items table
CREATE TABLE IF NOT EXISTS public.home_faqs_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_faqs_settings_id int NOT NULL REFERENCES public.home_faqs_settings(id) ON DELETE CASCADE,
  question text NOT NULL DEFAULT '',
  answer text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Add typed columns to home_why_us_settings
ALTER TABLE public.home_why_us_settings ADD COLUMN IF NOT EXISTS eyebrow text;
ALTER TABLE public.home_why_us_settings ADD COLUMN IF NOT EXISTS title text;

-- 5. Add typed columns to home_process_settings
ALTER TABLE public.home_process_settings ADD COLUMN IF NOT EXISTS eyebrow text;
ALTER TABLE public.home_process_settings ADD COLUMN IF NOT EXISTS title text;

-- 6. Add typed columns to home_faqs_settings
ALTER TABLE public.home_faqs_settings ADD COLUMN IF NOT EXISTS eyebrow text;
ALTER TABLE public.home_faqs_settings ADD COLUMN IF NOT EXISTS title text;

-- 7. Migrate existing JSON data to typed columns
UPDATE public.home_why_us_settings SET eyebrow = content->>'eyebrow', title = content->>'title';
UPDATE public.home_process_settings SET eyebrow = content->>'eyebrow', title = content->>'title';
UPDATE public.home_faqs_settings SET eyebrow = content->>'eyebrow', title = content->>'title';

-- 8. Migrate items from JSON to separate tables
INSERT INTO public.home_why_us_items (home_why_us_settings_id, title, description, sort_order)
SELECT h.id, i.item->>'title', i.item->>'desc', i.idx
FROM public.home_why_us_settings h, LATERAL jsonb_array_elements(content->'items') WITH ORDINALITY AS i(item, idx);

INSERT INTO public.home_process_items (home_process_settings_id, step, title, description, sort_order)
SELECT h.id, i.item->>'step', i.item->>'title', i.item->>'desc', i.idx
FROM public.home_process_settings h, LATERAL jsonb_array_elements(content->'items') WITH ORDINALITY AS i(item, idx);

INSERT INTO public.home_faqs_items (home_faqs_settings_id, question, answer, sort_order)
SELECT h.id, i.item->>'question', i.item->>'answer', i.idx
FROM public.home_faqs_settings h, LATERAL jsonb_array_elements(content->'items') WITH ORDINALITY AS i(item, idx);

-- 9. Enable RLS
ALTER TABLE public.home_why_us_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_process_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_faqs_items ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies
CREATE POLICY IF NOT EXISTS "WhyUsItems public readable" ON public.home_why_us_items FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admins manage WhyUsItems" ON public.home_why_us_items FOR ALL USING (public.has_role(auth.uid()::text, 'admin')) WITH CHECK (public.has_role(auth.uid()::text, 'admin'));

CREATE POLICY IF NOT EXISTS "ProcessItems public readable" ON public.home_process_items FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admins manage ProcessItems" ON public.home_process_items FOR ALL USING (public.has_role(auth.uid()::text, 'admin')) WITH CHECK (public.has_role(auth.uid()::text, 'admin'));

CREATE POLICY IF NOT EXISTS "FaqItems public readable" ON public.home_faqs_items FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admins manage FaqItems" ON public.home_faqs_items FOR ALL USING (public.has_role(auth.uid()::text, 'admin')) WITH CHECK (public.has_role(auth.uid()::text, 'admin'));

-- 11. Create updated_at triggers
DROP TRIGGER IF EXISTS trg_home_why_us_items_updated ON public.home_why_us_items;
CREATE TRIGGER trg_home_why_us_items_updated BEFORE UPDATE ON public.home_why_us_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_home_process_items_updated ON public.home_process_items;
CREATE TRIGGER trg_home_process_items_updated BEFORE UPDATE ON public.home_process_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_home_faqs_items_updated ON public.home_faqs_items;
CREATE TRIGGER trg_home_faqs_items_updated BEFORE UPDATE ON public.home_faqs_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 12. Insert default rows
INSERT INTO public.home_why_us_settings (id, eyebrow, title) VALUES (1, 'Why Choose Us', 'Moving made simple, safe and stress-free') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.home_process_settings (id, eyebrow, title) VALUES (1, 'Our Process', 'A simple 4-step move') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.home_faqs_settings (id, eyebrow, title) VALUES (1, 'FAQ', 'Frequently asked questions') ON CONFLICT (id) DO NOTHING;
