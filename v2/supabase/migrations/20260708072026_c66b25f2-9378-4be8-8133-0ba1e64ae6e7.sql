
GRANT SELECT ON public.tvet_categories TO anon, authenticated;
GRANT ALL ON public.tvet_categories TO service_role;
GRANT SELECT ON public.tvet_courses TO anon, authenticated;
GRANT ALL ON public.tvet_courses TO service_role;
GRANT SELECT ON public.tvet_levels TO anon, authenticated;
GRANT ALL ON public.tvet_levels TO service_role;
GRANT SELECT ON public.tvet_modules TO anon, authenticated;
GRANT ALL ON public.tvet_modules TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tvet_resources TO authenticated;
GRANT ALL ON public.tvet_resources TO service_role;
