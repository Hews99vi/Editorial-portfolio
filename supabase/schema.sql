-- Premium Tech Editorial Portfolio Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PROJECTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    problem TEXT NOT NULL,
    approach TEXT NOT NULL,
    outcome TEXT NOT NULL,
    metrics JSONB DEFAULT '{}'::jsonb,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    tech_stack TEXT[] DEFAULT ARRAY[]::TEXT[],
    role TEXT NOT NULL,
    timeline TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    live_url TEXT,
    github_url TEXT,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- ========================================
-- CLIENT PORTFOLIOS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS client_portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_logo_url TEXT,
    intro_message TEXT NOT NULL,
    why_fit_bullets TEXT[] DEFAULT ARRAY[]::TEXT[],
    accent_preset TEXT DEFAULT 'blue',
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_portfolios_slug ON client_portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_client_portfolios_published ON client_portfolios(published);

-- ========================================
-- PORTFOLIO_PROJECTS JOIN TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
    portfolio_id UUID NOT NULL REFERENCES client_portfolios(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    PRIMARY KEY (portfolio_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_sort ON portfolio_projects(portfolio_id, sort_order);

-- ========================================
-- CONTACT MESSAGES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- ========================================
-- SITE SETTINGS TABLE (Single Row)
-- ========================================
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name TEXT DEFAULT 'Your Name',
    headline TEXT DEFAULT 'Building Exceptional Digital Experiences',
    subheadline TEXT DEFAULT 'Premium tech editorial portfolio showcasing world-class work',
    socials JSONB DEFAULT '{"github": "", "linkedin": "", "twitter": ""}'::jsonb,
    upwork_link TEXT,
    fiverr_link TEXT,
    calendly_link TEXT,
    default_seo_title TEXT DEFAULT 'Premium Portfolio',
    default_seo_description TEXT DEFAULT 'Premium tech editorial portfolio showcasing exceptional work'
);

-- Insert default settings row
INSERT INTO site_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (published content only)
CREATE POLICY "Public can view published projects"
    ON projects FOR SELECT
    USING (published = true);

CREATE POLICY "Public can view published portfolios"
    ON client_portfolios FOR SELECT
    USING (published = true);

CREATE POLICY "Public can view portfolio projects"
    ON portfolio_projects FOR SELECT
    USING (true);

CREATE POLICY "Public can read site settings"
    ON site_settings FOR SELECT
    USING (true);

-- ADMIN WRITE POLICIES (authenticated users only)
CREATE POLICY "Authenticated users can insert projects"
    ON projects FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update projects"
    ON projects FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete projects"
    ON projects FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage portfolios"
    ON client_portfolios FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage portfolio_projects"
    ON portfolio_projects FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage contact messages"
    ON contact_messages FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update site settings"
    ON site_settings FOR UPDATE
    USING (auth.role() = 'authenticated');

-- PUBLIC CAN INSERT CONTACT MESSAGES
CREATE POLICY "Anyone can insert contact messages"
    ON contact_messages FOR INSERT
    WITH CHECK (true);

-- ========================================
-- UPDATED_AT TRIGGER
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_portfolios_updated_at BEFORE UPDATE ON client_portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- COMPLETED!
-- ========================================
-- Your database schema is now set up.
-- Next steps:
-- 1. Create a Storage bucket called 'project-images' for uploads
-- 2. Set the bucket to public
-- 3. Create an admin user via Supabase Auth dashboard
