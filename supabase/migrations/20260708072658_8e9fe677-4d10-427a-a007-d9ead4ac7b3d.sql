GRANT SELECT ON public.tvet_resources TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tvet_resources TO authenticated;
GRANT ALL ON public.tvet_resources TO service_role;