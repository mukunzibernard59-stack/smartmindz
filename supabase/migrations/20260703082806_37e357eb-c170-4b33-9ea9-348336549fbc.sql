
-- 1. Harden has_role to prevent role enumeration
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow checking self, unless caller is admin
  IF _user_id <> auth.uid() AND NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN FALSE;
  END IF;
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
END;
$$;

-- 2. Drop overly-permissive policies on tvet_resources
DROP POLICY IF EXISTS "Public read resources" ON public.tvet_resources;
DROP POLICY IF EXISTS "allow all reads" ON public.tvet_resources;
DROP POLICY IF EXISTS "allow all inserts" ON public.tvet_resources;

-- 3. Scoped SELECT: anon sees only admin-published (user_id IS NULL); authed sees own + admin content; admins see all
CREATE POLICY "Public read admin resources"
  ON public.tvet_resources FOR SELECT
  USING (user_id IS NULL);

CREATE POLICY "Users read own resources"
  ON public.tvet_resources FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins read all resources"
  ON public.tvet_resources FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. INSERT restricted to owner or admin
CREATE POLICY "Users insert own resources"
  ON public.tvet_resources FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 5. Owners and admins can update/delete
CREATE POLICY "Owners update resources"
  ON public.tvet_resources FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners delete resources"
  ON public.tvet_resources FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
