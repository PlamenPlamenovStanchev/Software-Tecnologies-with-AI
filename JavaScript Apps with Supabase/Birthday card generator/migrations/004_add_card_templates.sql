-- ============================================
-- MIGRATION: Add Card Templates Table
-- ============================================
-- Purpose: Store card template metadata (name, description)
-- Images are stored in Supabase Storage (card-templates bucket)

-- Create card_templates table
CREATE TABLE IF NOT EXISTS card_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    image_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_card_templates_template_id ON card_templates(template_id);
CREATE INDEX IF NOT EXISTS idx_card_templates_created_at ON card_templates(created_at DESC);

-- Enable RLS
ALTER TABLE card_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Everyone can read card templates
CREATE POLICY "Everyone can read card_templates"
    ON card_templates FOR SELECT
    TO public
    USING (true);

-- Only admins can insert card templates
CREATE POLICY "Only admins can insert card_templates"
    ON card_templates FOR INSERT
    TO authenticated
    WITH CHECK (is_admin());

-- Only admins can update card templates
CREATE POLICY "Only admins can update card_templates"
    ON card_templates FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Only admins can delete card templates
CREATE POLICY "Only admins can delete card_templates"
    ON card_templates FOR DELETE
    TO authenticated
    USING (is_admin());

-- Grant execute permissions on helper functions
GRANT EXECUTE ON FUNCTION is_admin() TO anon, authenticated;
