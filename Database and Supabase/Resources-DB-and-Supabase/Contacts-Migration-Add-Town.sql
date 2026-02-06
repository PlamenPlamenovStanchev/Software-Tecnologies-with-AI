-- Supabase Database Migration: Add town column to contacts table

-- Add town column to contacts table
ALTER TABLE contacts ADD COLUMN town VARCHAR(255);

-- Create index on town for faster location-based queries
CREATE INDEX idx_contacts_town ON contacts(town);
