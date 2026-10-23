-- Tighten family_members INSERT policy to verify the subscription belongs to the authenticated owner
DROP POLICY IF EXISTS "Owners can add family members" ON public.family_members;

CREATE POLICY "Owners can add family members"
ON public.family_members
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = owner_id
  AND EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.id = subscription_id
      AND s.user_id = auth.uid()
  )
);