-- =====================================================
-- COMPREHENSIVE ROW LEVEL SECURITY POLICIES
-- Run this AFTER schema.sql to enforce proper access control
-- =====================================================

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROJECTS TABLE POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public users can view published projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can view all projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;

-- Public: SELECT only published projects
CREATE POLICY "Public users can view published projects"
ON projects FOR SELECT
TO anon
USING (published = true);

-- Authenticated: Full access to all projects
CREATE POLICY "Authenticated users can view all projects"
ON projects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
ON projects FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
ON projects FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- CLIENT_PORTFOLIOS TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Public users can view published portfolios" ON client_portfolios;
DROP POLICY IF EXISTS "Authenticated users can view all portfolios" ON client_portfolios;
DROP POLICY IF EXISTS "Authenticated users can insert portfolios" ON client_portfolios;
DROP POLICY IF EXISTS "Authenticated users can update portfolios" ON client_portfolios;
DROP POLICY IF EXISTS "Authenticated users can delete portfolios" ON client_portfolios;

-- Public: SELECT only published portfolios
CREATE POLICY "Public users can view published portfolios"
ON client_portfolios FOR SELECT
TO anon
USING (published = true);

-- Authenticated: Full access
CREATE POLICY "Authenticated users can view all portfolios"
ON client_portfolios FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert portfolios"
ON client_portfolios FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update portfolios"
ON client_portfolios FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete portfolios"
ON client_portfolios FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- PORTFOLIO_PROJECTS TABLE POLICIES
-- Public can only see links where BOTH portfolio AND project are published
-- =====================================================

DROP POLICY IF EXISTS "Public users can view published portfolio projects" ON portfolio_projects;
DROP POLICY IF EXISTS "Authenticated users can view all portfolio projects" ON portfolio_projects;
DROP POLICY IF EXISTS "Authenticated users can insert portfolio projects" ON portfolio_projects;
DROP POLICY IF EXISTS "Authenticated users can update portfolio projects" ON portfolio_projects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio projects" ON portfolio_projects;

-- Public: SELECT only where both portfolio and project are published
CREATE POLICY "Public users can view published portfolio projects"
ON portfolio_projects FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM client_portfolios
    WHERE client_portfolios.id = portfolio_projects.portfolio_id
    AND client_portfolios.published = true
  )
  AND EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = portfolio_projects.project_id
    AND projects.published = true
  )
);

-- Authenticated: Full access
CREATE POLICY "Authenticated users can view all portfolio projects"
ON portfolio_projects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert portfolio projects"
ON portfolio_projects FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update portfolio projects"
ON portfolio_projects FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete portfolio projects"
ON portfolio_projects FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- CONTACT_MESSAGES TABLE POLICIES
-- Public can INSERT only (submit contact form)
-- Authenticated can SELECT and UPDATE (view and archive)
-- =====================================================

DROP POLICY IF EXISTS "Public users can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;

-- Public: INSERT only
CREATE POLICY "Public users can insert contact messages"
ON contact_messages FOR INSERT
TO anon
WITH CHECK (true);

-- Authenticated: SELECT and UPDATE
CREATE POLICY "Authenticated users can view contact messages"
ON contact_messages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update contact messages"
ON contact_messages FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- SITE_SETTINGS TABLE POLICIES
-- Public can SELECT (read settings for display)
-- Authenticated can UPDATE (admin can modify settings)
-- =====================================================

DROP POLICY IF EXISTS "Public users can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON site_settings;

-- Public: SELECT only
CREATE POLICY "Public users can view site settings"
ON site_settings FOR SELECT
TO anon
USING (true);

-- Authenticated: UPDATE only (single row, no INSERT/DELETE needed)
CREATE POLICY "Authenticated users can update site settings"
ON site_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- VERIFICATION QUERIES
-- Run these to test your policies are working correctly
-- =====================================================

-- Test 1: Verify anon users can only see published projects
-- SET ROLE anon;
-- SELECT id, title, published FROM projects;
-- RESET ROLE;

-- Test 2: Verify authenticated users can see all projects
-- SET ROLE authenticated;
-- SELECT id, title, published FROM projects;
-- RESET ROLE;

-- Test 3: Verify portfolio_projects respects both published flags
-- SET ROLE anon;
-- SELECT * FROM portfolio_projects;
-- RESET ROLE;
