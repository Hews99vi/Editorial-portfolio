-- =====================================================
-- DATABASE CONSTRAINTS FOR DATA INTEGRITY
-- Run this to add unique constraints and validation
-- =====================================================

-- =====================================================
-- UNIQUE SLUG CONSTRAINTS
-- Prevents duplicate slugs which would break routing
-- =====================================================

-- Add unique constraint to projects.slug
-- This ensures each project has a unique URL
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'projects_slug_unique'
    ) THEN
        ALTER TABLE projects 
        ADD CONSTRAINT projects_slug_unique UNIQUE (slug);
    END IF;
END $$;

-- Add unique constraint to client_portfolios.slug
-- This ensures each portfolio has a unique URL
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'client_portfolios_slug_unique'
    ) THEN
        ALTER TABLE client_portfolios 
        ADD CONSTRAINT client_portfolios_slug_unique UNIQUE (slug);
    END IF;
END $$;

-- =====================================================
-- ADDITIONAL VALIDATION CONSTRAINTS
-- =====================================================

-- Ensure slugs are not empty
ALTER TABLE projects 
ADD CONSTRAINT projects_slug_not_empty 
CHECK (length(trim(slug)) > 0);

ALTER TABLE client_portfolios 
ADD CONSTRAINT client_portfolios_slug_not_empty 
CHECK (length(trim(slug)) > 0);

-- Ensure titles are not empty
ALTER TABLE projects 
ADD CONSTRAINT projects_title_not_empty 
CHECK (length(trim(title)) > 0);

ALTER TABLE client_portfolios 
ADD CONSTRAINT client_portfolios_title_not_empty 
CHECK (length(trim(title)) > 0);

-- Ensure contact messages have required fields
ALTER TABLE contact_messages 
ADD CONSTRAINT contact_messages_name_not_empty 
CHECK (length(trim(name)) > 0);

ALTER TABLE contact_messages 
ADD CONSTRAINT contact_messages_email_not_empty 
CHECK (length(trim(email)) > 0);

ALTER TABLE contact_messages 
ADD CONSTRAINT contact_messages_message_not_empty 
CHECK (length(trim(message)) >= 10);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_client_portfolios_slug ON client_portfolios(slug);

-- Index on published for filtering
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_client_portfolios_published ON client_portfolios(published);

-- Index on featured for homepage queries
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured) WHERE featured = true;

-- Composite index for portfolio_projects lookups
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_portfolio_id 
ON portfolio_projects(portfolio_id, sort_order);

-- Index on contact_messages status for filtering
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

-- Index on timestamps for sorting
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
