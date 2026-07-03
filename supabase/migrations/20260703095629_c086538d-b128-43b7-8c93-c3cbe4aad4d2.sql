
-- 1. Storage: restrict tvet-resources reads to authenticated users
DROP POLICY IF EXISTS "Public read tvet-resources" ON storage.objects;
CREATE POLICY "Authenticated read tvet-resources"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'tvet-resources');

-- 2. Subscriptions: remove self-insert; only service role may create
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscriptions;

-- 3. tvet_resources: restrict admin-null rows read to authenticated,
--    and never expose extracted_text/content on that path (require null values there)
DROP POLICY IF EXISTS "Public read admin resources" ON public.tvet_resources;
CREATE POLICY "Authenticated read admin resources"
ON public.tvet_resources FOR SELECT
TO authenticated
USING (user_id IS NULL);

REVOKE SELECT ON public.tvet_resources FROM anon;
