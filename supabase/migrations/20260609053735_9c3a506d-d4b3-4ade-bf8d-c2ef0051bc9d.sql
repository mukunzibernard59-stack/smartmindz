
-- Public read for tvet-resources, admin write
CREATE POLICY "Public read tvet-resources"
ON storage.objects FOR SELECT
USING (bucket_id = 'tvet-resources');

CREATE POLICY "Admins upload tvet-resources"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tvet-resources' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update tvet-resources"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'tvet-resources' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete tvet-resources"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tvet-resources' AND public.has_role(auth.uid(), 'admin'));
