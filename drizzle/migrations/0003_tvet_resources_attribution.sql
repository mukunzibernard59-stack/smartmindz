ALTER TABLE public.tvet_resources
  ADD COLUMN author text,
  ADD COLUMN source_url text,
  ADD COLUMN license_note text,
  ADD COLUMN reviewed_at date,
  ADD COLUMN content_length integer GENERATED ALWAYS AS (coalesce(length(content), 0)) STORED;

COMMENT ON COLUMN public.tvet_resources.author IS 'Original author or institution of the material, when verified.';
COMMENT ON COLUMN public.tvet_resources.source_url IS 'Verified original source URL, when known.';
COMMENT ON COLUMN public.tvet_resources.license_note IS 'Rights or licence basis for sharing, when known.';
COMMENT ON COLUMN public.tvet_resources.reviewed_at IS 'Date the resource was last reviewed by an editor.';
COMMENT ON COLUMN public.tvet_resources.content_length IS 'Stored length of content, used to filter out empty/placeholder resources in public views.';