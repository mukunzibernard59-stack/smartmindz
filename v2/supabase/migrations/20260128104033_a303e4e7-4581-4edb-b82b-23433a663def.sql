-- Fix SECURITY DEFINER functions to validate user identity (defense in depth)
-- This prevents misuse if RPC access controls change in the future

-- Update get_daily_usage to validate caller identity
CREATE OR REPLACE FUNCTION public.get_daily_usage(_user_id uuid, _action_type text)
RETURNS integer
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Defense in depth: Ensure caller can only query their own usage
    IF _user_id != auth.uid() AND auth.uid() IS NOT NULL THEN
        RAISE EXCEPTION 'Unauthorized: Cannot query usage for other users';
    END IF;
    
    RETURN (
        SELECT COUNT(*)::integer
        FROM public.usage_logs
        WHERE user_id = _user_id
          AND action_type = _action_type
          AND created_at >= CURRENT_DATE
    );
END;
$$;

-- Update has_active_subscription to validate caller identity
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Defense in depth: Ensure caller can only check their own subscription
    IF _user_id != auth.uid() AND auth.uid() IS NOT NULL THEN
        RAISE EXCEPTION 'Unauthorized: Cannot check subscription for other users';
    END IF;
    
    RETURN EXISTS (
        SELECT 1
        FROM public.subscriptions
        WHERE user_id = _user_id
          AND status = 'active'
          AND (expires_at IS NULL OR expires_at > now())
    );
END;
$$;

-- Update get_user_plan to validate caller identity
CREATE OR REPLACE FUNCTION public.get_user_plan(_user_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Defense in depth: Ensure caller can only get their own plan
    IF _user_id != auth.uid() AND auth.uid() IS NOT NULL THEN
        RAISE EXCEPTION 'Unauthorized: Cannot get plan for other users';
    END IF;
    
    RETURN COALESCE(
        (SELECT plan::text
         FROM public.subscriptions
         WHERE user_id = _user_id
           AND status = 'active'
           AND (expires_at IS NULL OR expires_at > now())
         ORDER BY created_at DESC
         LIMIT 1),
        'free'
    );
END;
$$;

-- Update check_and_log_usage to validate caller identity
CREATE OR REPLACE FUNCTION public.check_and_log_usage(_user_id uuid, _action_type text, _free_limit integer DEFAULT 10)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    _is_premium boolean;
    _current_usage integer;
    _plan text;
BEGIN
    -- Defense in depth: Ensure caller can only log usage for themselves
    -- Allow service role (auth.uid() IS NULL) for edge functions
    IF _user_id != auth.uid() AND auth.uid() IS NOT NULL THEN
        RAISE EXCEPTION 'Unauthorized: Cannot log usage for other users';
    END IF;

    -- Get user's subscription status using internal queries (not calling other functions to avoid circular checks)
    _is_premium := EXISTS (
        SELECT 1
        FROM public.subscriptions
        WHERE user_id = _user_id
          AND status = 'active'
          AND (expires_at IS NULL OR expires_at > now())
    );
    
    SELECT COALESCE(
        (SELECT plan::text
         FROM public.subscriptions
         WHERE user_id = _user_id
           AND status = 'active'
           AND (expires_at IS NULL OR expires_at > now())
         ORDER BY created_at DESC
         LIMIT 1),
        'free'
    ) INTO _plan;
    
    -- Premium users have unlimited access
    IF _is_premium THEN
        INSERT INTO public.usage_logs (user_id, action_type)
        VALUES (_user_id, _action_type);
        
        RETURN jsonb_build_object(
            'allowed', true,
            'is_premium', true,
            'plan', _plan,
            'usage_today', 0,
            'limit', -1
        );
    END IF;
    
    -- Check current daily usage for free users
    SELECT COUNT(*)::integer INTO _current_usage
    FROM public.usage_logs
    WHERE user_id = _user_id
      AND action_type = _action_type
      AND created_at >= CURRENT_DATE;
    
    -- Check if limit exceeded
    IF _current_usage >= _free_limit THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'is_premium', false,
            'plan', 'free',
            'usage_today', _current_usage,
            'limit', _free_limit,
            'message', 'ACCESS_LIMIT_REACHED'
        );
    END IF;
    
    -- Log the usage
    INSERT INTO public.usage_logs (user_id, action_type)
    VALUES (_user_id, _action_type);
    
    RETURN jsonb_build_object(
        'allowed', true,
        'is_premium', false,
        'plan', 'free',
        'usage_today', _current_usage + 1,
        'limit', _free_limit
    );
END;
$$;

-- Add UPDATE RLS policy for family_members to require member consent
-- This adds an extra check that only the member being added can update their own membership
CREATE POLICY "Members can update their own membership"
ON public.family_members FOR UPDATE
USING (auth.uid() = member_id)
WITH CHECK (auth.uid() = member_id);