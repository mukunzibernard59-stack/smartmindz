-- Create usage_logs table to track all user actions
CREATE TABLE public.usage_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    action_type text NOT NULL CHECK (action_type IN ('chat', 'voice', 'quiz', 'notes', 'pdf_download')),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Create index for efficient querying by user and date
CREATE INDEX idx_usage_logs_user_date ON public.usage_logs (user_id, created_at DESC);
CREATE INDEX idx_usage_logs_action_type ON public.usage_logs (user_id, action_type, created_at DESC);

-- Enable RLS
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own usage logs
CREATE POLICY "Users can view their own usage logs"
ON public.usage_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own usage logs
CREATE POLICY "Users can create their own usage logs"
ON public.usage_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create a security definer function to check usage limits
CREATE OR REPLACE FUNCTION public.get_daily_usage(
    _user_id uuid,
    _action_type text
)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(*)::integer
    FROM public.usage_logs
    WHERE user_id = _user_id
      AND action_type = _action_type
      AND created_at >= CURRENT_DATE
$$;

-- Create function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.subscriptions
        WHERE user_id = _user_id
          AND status = 'active'
          AND (expires_at IS NULL OR expires_at > now())
    )
$$;

-- Create function to get user's current plan
CREATE OR REPLACE FUNCTION public.get_user_plan(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(
        (SELECT plan::text
         FROM public.subscriptions
         WHERE user_id = _user_id
           AND status = 'active'
           AND (expires_at IS NULL OR expires_at > now())
         ORDER BY created_at DESC
         LIMIT 1),
        'free'
    )
$$;

-- Create function to log usage and check limits in one atomic operation
CREATE OR REPLACE FUNCTION public.check_and_log_usage(
    _user_id uuid,
    _action_type text,
    _free_limit integer DEFAULT 10
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _is_premium boolean;
    _current_usage integer;
    _plan text;
BEGIN
    -- Get user's subscription status
    _is_premium := public.has_active_subscription(_user_id);
    _plan := public.get_user_plan(_user_id);
    
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
    _current_usage := public.get_daily_usage(_user_id, _action_type);
    
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