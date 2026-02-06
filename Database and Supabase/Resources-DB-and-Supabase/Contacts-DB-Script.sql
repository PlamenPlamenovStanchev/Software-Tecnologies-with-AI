-- Supabase Database Schema for Contacts

-- Create Contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  comments TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_contacts_email ON contacts(email);

-- Create index on phone for faster lookups
CREATE INDEX idx_contacts_phone ON contacts(phone);

-- Create index on name for faster searches
CREATE INDEX idx_contacts_name ON contacts(name);
