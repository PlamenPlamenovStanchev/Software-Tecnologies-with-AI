-- Migration: Add user roles support
-- Description: Implement role-based access control (RBAC) with app_role ENUM and user_roles table
-- Date: 2026-02-15

-- ============================================
-- ENUMS
-- ============================================

-- Create app_role ENUM type
CREATE TYPE app_role AS ENUM ('user', 'admin');

-- ============================================
-- TABLES
-- ============================================

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    user_role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role app_role;
BEGIN
  SELECT u.user_role INTO user_role
  FROM user_roles u
  WHERE u.user_id = auth.uid();
  
  RETURN COALESCE(user_role = 'admin', FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is owner of a card
CREATE OR REPLACE FUNCTION is_owner(card_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM cards c
    WHERE c.id = card_id
    AND c.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION is_owner(UUID) TO authenticated, anon;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Everyone can read user_roles (for fetching user info, checking admin status)
CREATE POLICY "Everyone can read user_roles"
    ON user_roles FOR SELECT
    USING (TRUE);

-- Policy 2: Only admins can insert new user roles
CREATE POLICY "Only admins can insert user_roles"
    ON user_roles FOR INSERT
    WITH CHECK (is_admin());

-- Policy 3: Only admins can update user roles
CREATE POLICY "Only admins can update user_roles"
    ON user_roles FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- Policy 4: Only admins can delete user roles
CREATE POLICY "Only admins can delete user_roles"
    ON user_roles FOR DELETE
    USING (is_admin());

-- ============================================
-- UPDATE CARDS TABLE POLICIES
-- ============================================

-- Update cards table RLS policies to support admin editing
-- First, drop existing policies if they exist (optional, depending on current setup)
-- Note: We're keeping existing SELECT policies and updating UPDATE/DELETE

-- Policy: Owners and admins can update cards
CREATE POLICY "Owners and admins can update cards"
    ON cards FOR UPDATE
    USING (auth.uid() = user_id OR is_admin())
    WITH CHECK (auth.uid() = user_id OR is_admin());

-- Policy: Owners and admins can delete cards
CREATE POLICY "Owners and admins can delete cards"
    ON cards FOR DELETE
    USING (auth.uid() = user_id OR is_admin());

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant SELECT on user_roles to all authenticated users
GRANT SELECT ON user_roles TO authenticated, anon;

-- Grant INSERT, UPDATE, DELETE on user_roles to authenticated users (RLS will enforce admin-only)
GRANT INSERT, UPDATE, DELETE ON user_roles TO authenticated;

-- Grant USAGE on app_role ENUM
GRANT USAGE ON TYPE app_role TO authenticated, anon;

-- ============================================
-- INITIALIZATION (Optional)
-- ============================================
-- Uncomment the following to initialize admin users (replace with actual user IDs)
-- INSERT INTO user_roles (user_id, user_role) 
-- VALUES ('your-admin-user-id', 'admin')
-- ON CONFLICT (user_id) DO NOTHING;
