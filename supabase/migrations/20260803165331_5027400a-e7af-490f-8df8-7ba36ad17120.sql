DROP POLICY IF EXISTS "Authenticated read tvet-resources" ON storage.objects;

CREATE POLICY "Read own or shared tvet-resources"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'tvet-resources'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.tvet_resources r
      WHERE r.user_id IS NULL
        AND r.url IS NOT NULL
        AND r.url LIKE '%' || storage.objects.name
    )
  )
);