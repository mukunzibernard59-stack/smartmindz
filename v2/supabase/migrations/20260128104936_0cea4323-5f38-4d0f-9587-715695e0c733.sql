-- Fix: Payment Records Lack UPDATE and DELETE Protection
-- Payment records should be immutable after creation - only backend services should modify them

-- Prevent users from updating payments via client
CREATE POLICY "Payments cannot be updated by users"
ON public.payments FOR UPDATE
USING (false);

-- Prevent users from deleting payments via client
CREATE POLICY "Payments cannot be deleted by users"
ON public.payments FOR DELETE
USING (false);