-- Performance indexes for mobile-first cached reads and admin polling.
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON public.profiles(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_user_roles_created_at ON public.user_roles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_updated_at ON public.subscriptions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_user_status_created ON public.payments(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tvet_categories_sort_created ON public.tvet_categories(sort_order, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tvet_courses_category_sort ON public.tvet_courses(category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_tvet_courses_created_at ON public.tvet_courses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tvet_levels_course_level ON public.tvet_levels(course_id, level);
CREATE INDEX IF NOT EXISTS idx_tvet_levels_created_at ON public.tvet_levels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tvet_modules_level_sort ON public.tvet_modules(level_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_tvet_modules_created_at ON public.tvet_modules(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tvet_resources_module_sort ON public.tvet_resources(module_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_tvet_resources_type_created ON public.tvet_resources(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tvet_resources_created_at ON public.tvet_resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tvet_resources_title_trgm ON public.tvet_resources USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_tvet_resources_content_trgm ON public.tvet_resources USING gin (content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_tvet_resources_content_fts ON public.tvet_resources
  USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,'') || ' ' || coalesce(extracted_text,'')));

CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_action_created ON public.usage_logs(action_type, created_at DESC);

DO $$
BEGIN
  IF to_regclass('public.tvet_import_jobs') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_tvet_import_jobs_status_created ON public.tvet_import_jobs(status, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_tvet_import_jobs_created_at ON public.tvet_import_jobs(created_at DESC);

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'tvet_import_jobs'
        AND column_name = 'updated_at'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_tvet_import_jobs_updated_at ON public.tvet_import_jobs(updated_at DESC);
    END IF;
  END IF;
END $$;
