CREATE POLICY "Anyone can read shared TVET resources"
ON public.tvet_resources
FOR SELECT
TO anon
USING (user_id IS NULL);