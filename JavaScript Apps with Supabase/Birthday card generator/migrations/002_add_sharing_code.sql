-- Migration: Add sharing code to cards table
-- Description: Enable card sharing via unique 5-character sharing codes
-- Date: 2026-02-15

-- Add sharing_code column to cards table (nullable initially)
ALTER TABLE cards ADD COLUMN IF NOT EXISTS sharing_code VARCHAR(5) UNIQUE;

-- Add index on sharing_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_cards_sharing_code ON cards(sharing_code);

-- Create function to generate random 5-character sharing code
CREATE OR REPLACE FUNCTION generate_sharing_code()
RETURNS VARCHAR AS $$
DECLARE
  code VARCHAR(5);
  chars VARCHAR := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  i INT;
BEGIN
  code := '';
  FOR i IN 1..5 LOOP
    code := code || substr(chars, (random() * 35)::INT + 1, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Create a view for public access to shared cards
CREATE OR REPLACE VIEW public_cards AS
SELECT id, person_name, greeting_text, template_id, created_at, sharing_code
FROM cards
WHERE sharing_code IS NOT NULL;

-- Create a stored function to get card by sharing code (public access)
CREATE OR REPLACE FUNCTION get_shared_card(p_sharing_code VARCHAR)
RETURNS TABLE (
  id UUID,
  person_name VARCHAR,
  greeting_text TEXT,
  template_id VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  sharing_code VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cards.id,
    cards.person_name,
    cards.greeting_text,
    cards.template_id,
    cards.created_at,
    cards.sharing_code
  FROM cards
  WHERE cards.sharing_code = p_sharing_code;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to anonymous users and authenticated users
GRANT EXECUTE ON FUNCTION get_shared_card(VARCHAR) TO anon;
GRANT EXECUTE ON FUNCTION get_shared_card(VARCHAR) TO authenticated;

-- Update RLS policies to support sharing
-- Disable and re-enable RLS to ensure clean policy state
ALTER TABLE cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own cards when authenticated
CREATE POLICY "Users can view own cards" 
    ON cards FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy 2: Anyone can view cards with a sharing code (for sharing)
CREATE POLICY "Public can view shared cards" 
    ON cards FOR SELECT 
    USING (sharing_code IS NOT NULL AND (auth.uid() = user_id OR auth.uid() IS NULL));

-- Keep existing update and delete policies for authenticated users
CREATE POLICY "Users can update their own cards" 
    ON cards FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards" 
    ON cards FOR DELETE 
    USING (auth.uid() = user_id);

-- Keep existing insert policy
CREATE POLICY "Users can insert their own cards" 
    ON cards FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

