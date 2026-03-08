
-- Fix all RLS policies: drop RESTRICTIVE ones and recreate as PERMISSIVE

-- ===== PROFILES =====
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ===== SUBSCRIPTIONS =====
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;

CREATE POLICY "Users can insert their own subscription" ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ===== PAYMENTS =====
DROP POLICY IF EXISTS "Payments cannot be deleted by users" ON public.payments;
DROP POLICY IF EXISTS "Payments cannot be updated by users" ON public.payments;
DROP POLICY IF EXISTS "Users can create their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;

CREATE POLICY "Users can create their own payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id);
-- Restrictive deny policies for update/delete (these layer on top of the permissive ones above)
CREATE POLICY "Payments cannot be updated by users" ON public.payments AS RESTRICTIVE FOR UPDATE TO authenticated USING (false);
CREATE POLICY "Payments cannot be deleted by users" ON public.payments AS RESTRICTIVE FOR DELETE TO authenticated USING (false);

-- ===== USAGE_LOGS =====
DROP POLICY IF EXISTS "Users can create their own usage logs" ON public.usage_logs;
DROP POLICY IF EXISTS "Users can view their own usage logs" ON public.usage_logs;

CREATE POLICY "Users can create their own usage logs" ON public.usage_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own usage logs" ON public.usage_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ===== FAMILY_MEMBERS =====
DROP POLICY IF EXISTS "Members can update their own membership" ON public.family_members;
DROP POLICY IF EXISTS "Owners can add family members" ON public.family_members;
DROP POLICY IF EXISTS "Owners can remove family members" ON public.family_members;
DROP POLICY IF EXISTS "Owners can view their family members" ON public.family_members;

CREATE POLICY "Owners can view their family members" ON public.family_members FOR SELECT TO authenticated USING ((auth.uid() = owner_id) OR (auth.uid() = member_id));
CREATE POLICY "Owners can add family members" ON public.family_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can remove family members" ON public.family_members FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Members can update their own membership" ON public.family_members FOR UPDATE TO authenticated USING (auth.uid() = member_id) WITH CHECK (auth.uid() = member_id);

-- ===== Remove redundant email from profiles =====
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Update handle_new_user to not copy email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id::text
  );
  RETURN NEW;
END;
$$;
