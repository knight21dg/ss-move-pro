-- ============================================================
-- MIGRATION: Convert JSON home sections to typed columns
-- Creates new tables with typed columns and items tables
-- ============================================================

-- 1. Create home_why_us_items table
CREATE TABLE IF NOT EXISTS public.home_why_us_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_why_us_id number NOT NULL REFERENCES public.home_why_us_settings(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  desc text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create home_process_items table
CREATE TABLE IF NOT EXISTS public.home_process_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_process_id number NOT NULL REFERENCES public.home_process_settings(id) ON DELETE CASCADE,
  step text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  desc text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Create home_faqs_items table
CREATE TABLE IF NOT EXISTS public.home_faqs_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_faqs_id number NOT NULL REFERENCES public.home_faqs_settings(id) ON DELETE CASCADE,
  question text NOT NULL DEFAULT '',
  answer text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Add typed columns to home_why_us_settings (migrate data from JSON)
ALTER TABLE public.home_why_us_settings 
ADD COLUMN IF NOT EXISTS eyebrow text,
ADD COLUMN IF NOT EXISTS title text;

-- 5. Add typed columns to home_process_settings (migrate data from JSON)
ALTER TABLE public.home_process_settings 
ADD COLUMN IF NOT EXISTS eyebrow text,
ADD COLUMN IF NOT EXISTS title text;

-- 6. Add typed columns to home_faqs_settings (migrate data from JSON)
ALTER TABLE public.home_faqs_settings 
ADD COLUMN IF NOT EXISTS eyebrow text,
ADD COLUMN IF NOT EXISTS title text;

-- 7. Migrate existing JSON data to typed columns
UPDATE public.home_why_us_settings 
SET eyebrow = content->>'eyebrow',
    title = content->>'title'
WHERE eyebrow IS NULL OR title IS NULL;

UPDATE public.home_process_settings 
SET eyebrow = content->>'eyebrow',
    title = content->>'title'
WHERE eyebrow IS NULL OR title IS NULL;

UPDATE public.home_faqs_settings 
SET eyebrow = content->>'eyebrow',
    title = content->>'title'
WHERE eyebrow IS NULL OR title IS NULL;

-- 8. Migrate items from JSON to separate tables
-- Why Us items
INSERT INTO public.home_why_us_items (home_why_us_id, title, desc, sort_order)
SELECT 
  h.id,
  i.item->>'title' as title,
  i.item->>'desc' as desc,
  i.idx as sort_order
FROM public.home_why_us_settings h,
LATERAL jsonb_array_elements(content->'items') WITH ORDINALITY AS i(item, idx)
ON CONFLICT DO NOTHING;

-- Process items
INSERT INTO public.home_process_items (home_process_id, step, title, desc, sort_order)
SELECT 
  h.id,
  i.item->>'step' as step,
  i.item->>'title' as title,
  i.item->>'desc' as desc,
  i.idx as sort_order
FROM public.home_process_settings h,
LATERAL jsonb_array_elements(content->'items') WITH ORDINALITY AS i(item, idx)
ON CONFLICT DO NOTHING;

-- FAQs items
INSERT INTO public.home_faqs_items (home_faqs_id, question, answer, sort_order)
SELECT 
  h.id,
  i.item->>'question' as question,
  i.item->>'answer' as answer,
  i.idx as sort_order
FROM public.home_faqs_settings h,
LATERAL jsonb_array_elements(content->'items') WITH ORDINALITY AS i(item, idx)
ON CONFLICT DO NOTHING;

-- 9. Enable RLS on new tables
ALTER TABLE public.home_why_us_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_process_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_faqs_items ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies for new tables
CREATE POLICY IF NOT EXISTS "Home why us items public readable" 
  ON public.home_why_us_items FOR SELECT 
  USING (public.has_role(auth.uid()::text, 'admin') OR true);

CREATE POLICY IF NOT EXISTS "Admins manage home why us items" 
  ON public.home_why_us_items FOR ALL 
  USING (public.has_role(auth.uid()::text, 'admin')) 
  WITH CHECK (public.has_role(auth.uid()::text, 'admin'));

CREATE POLICY IF NOT EXISTS "Home process items public readable" 
  ON public.home_process_items FOR SELECT 
  USING (public.has_role(auth.uid()::text, 'admin') OR true);

CREATE POLICY IF NOT EXISTS "Admins manage home process items" 
  ON public.home_process_items FOR ALL 
  USING (public.has_role(auth.uid()::text, 'admin')) 
  WITH CHECK (public.has_role(auth.uid()::text, 'admin'));

CREATE POLICY IF NOT EXISTS "Home faqs items public readable" 
  ON public.home_faqs_items FOR SELECT 
  USING (public.has_role(auth.uid()::text, 'admin') OR true);

CREATE POLICY IF NOT EXISTS "Admins manage home faqs items" 
  ON public.home_faqs_items FOR ALL 
  USING (public.has_role(auth.uid()::text, 'admin')) 
  WITH CHECK (public.has_role(auth.uid()::text, 'admin'));

-- 11. Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = 'public';

DROP TRIGGER IF EXISTS trg_home_why_us_items_updated ON public.home_why_us_items;
CREATE TRIGGER trg_home_why_us_items_updated
  BEFORE UPDATE ON public.home_why_us_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_home_process_items_updated ON public.home_process_items;
CREATE TRIGGER trg_home_process_items_updated
  BEFORE UPDATE ON public.home_process_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_home_faqs_items_updated ON public.home_faqs_items;
CREATE TRIGGER trg_home_faqs_items_updated
  BEFORE UPDATE ON public.home_faqs_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 12. Insert default row if not exists
INSERT INTO public.home_why_us_settings (id, eyebrow, title) 
VALUES (1, 'Why Choose Us', 'Moving made simple, safe and stress-free')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.home_process_settings (id, eyebrow, title) 
VALUES (1, 'Our Process', 'A simple 4-step move')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.home_faqs_settings (id, eyebrow, title) 
VALUES (1, 'FAQ', 'Frequently asked questions')
ON CONFLICT (id) DO NOTHING;