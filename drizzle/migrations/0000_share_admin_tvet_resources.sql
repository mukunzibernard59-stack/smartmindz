UPDATE public.tvet_resources
SET user_id = NULL
WHERE user_id IN (SELECT user_id FROM public.user_roles WHERE role = 'admin');