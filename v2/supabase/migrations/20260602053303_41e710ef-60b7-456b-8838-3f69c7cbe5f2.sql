
-- TVET Library schema
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TYPE public.tvet_level AS ENUM ('L3','L4','L5');
CREATE TYPE public.tvet_resource_type AS ENUM ('pdf','note','link','quiz','video');

CREATE TABLE public.tvet_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  icon text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tvet_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.tvet_categories(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

CREATE TABLE public.tvet_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.tvet_courses(id) ON DELETE CASCADE,
  level public.tvet_level NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(course_id, level)
);

CREATE TABLE public.tvet_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id uuid NOT NULL REFERENCES public.tvet_levels(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  source_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tvet_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.tvet_modules(id) ON DELETE CASCADE,
  type public.tvet_resource_type NOT NULL DEFAULT 'pdf',
  title text NOT NULL,
  url text,
  extracted_text text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tvet_courses_category ON public.tvet_courses(category_id);
CREATE INDEX idx_tvet_levels_course ON public.tvet_levels(course_id);
CREATE INDEX idx_tvet_modules_level ON public.tvet_modules(level_id);
CREATE INDEX idx_tvet_resources_module ON public.tvet_resources(module_id);
CREATE INDEX idx_tvet_courses_title_trgm ON public.tvet_courses USING gin (title gin_trgm_ops);
CREATE INDEX idx_tvet_modules_title_trgm ON public.tvet_modules USING gin (title gin_trgm_ops);
CREATE INDEX idx_tvet_resources_fts ON public.tvet_resources USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(extracted_text,'')));

-- GRANTS (public-read library)
GRANT SELECT ON public.tvet_categories TO anon, authenticated;
GRANT ALL ON public.tvet_categories TO service_role;
GRANT SELECT ON public.tvet_courses TO anon, authenticated;
GRANT ALL ON public.tvet_courses TO service_role;
GRANT SELECT ON public.tvet_levels TO anon, authenticated;
GRANT ALL ON public.tvet_levels TO service_role;
GRANT SELECT ON public.tvet_modules TO anon, authenticated;
GRANT ALL ON public.tvet_modules TO service_role;
GRANT SELECT ON public.tvet_resources TO anon, authenticated;
GRANT ALL ON public.tvet_resources TO service_role;

ALTER TABLE public.tvet_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tvet_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tvet_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tvet_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tvet_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON public.tvet_categories FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON public.tvet_courses FOR SELECT USING (true);
CREATE POLICY "Public read levels" ON public.tvet_levels FOR SELECT USING (true);
CREATE POLICY "Public read modules" ON public.tvet_modules FOR SELECT USING (true);
CREATE POLICY "Public read resources" ON public.tvet_resources FOR SELECT USING (true);
