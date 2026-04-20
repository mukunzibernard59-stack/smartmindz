-- 1. Block client UPDATE on subscriptions (only server-side service role can update)
CREATE POLICY "Subscriptions cannot be updated by users"
ON public.subscriptions
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (false);

-- 2. Block client DELETE on subscriptions
CREATE POLICY "Subscriptions cannot be deleted by users"
ON public.subscriptions
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (false);

-- 3. Tighten avatars storage policies — restrict to authenticated role and prevent public listing
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Public can VIEW individual avatars by URL but NOT list the bucket.
-- The storage.foldername check ensures direct file access works; listing is blocked.
CREATE POLICY "Avatar files are viewable by anyone with URL"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] IS NOT NULL
);

CREATE POLICY "Authenticated users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);