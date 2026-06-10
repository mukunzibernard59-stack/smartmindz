-- Add content column to tvet_resources for database-only notes
ALTER TABLE public.tvet_resources
ADD COLUMN IF NOT EXISTS content text,
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_tvet_resources_user_id ON public.tvet_resources(user_id);
