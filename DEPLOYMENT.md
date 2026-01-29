# Deployment Guide: Namecheap Shared Hosting

This guide walks you through deploying your Premium Portfolio to Name

cheap shared hosting.

---

## Prerequisites

✅ Supabase project created and configured  
✅ Admin user created in Supabase Auth  
✅ Environment variables configured  
✅ Production build tested locally  

---

## 1. Supabase Configuration

### 1.1 Run Database Scripts

In your Supabase SQL Editor, run the following files **in order**:

1. **`supabase/schema.sql`** - Creates all tables
2. **`supabase/constraints.sql`** - Adds uniqueness constraints and indexes
3. **`supabase/rls-policies.sql`** - Enforces row-level security
4. **`supabase/storage-setup.sql`** - Configures image storage bucket

### 1.2 Create Initial Admin User

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **Add User** → **Create New User**
3. Enter admin email and password
4. Save credentials securely

### 1.3 Initialize Site Settings

Run this SQL to create the default settings row:

```sql
INSERT INTO site_settings (id, display_name, headline, subheadline)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Your Name',
  'Building Exceptional Digital Experiences',
  'Premium tech editorial portfolio showcasing exceptional digital products.'
);
```

---

## 2. Configure Environment Variables

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Find these values in**: Supabase Dashboard → Settings → API

---

## 3. Build for Production

```bash
npm run build
```

This creates the `dist/` folder with all optimized files.

### Verify Build Output

Check that `dist/` contains:
- `index.html`
- `.htaccess` (for SPA routing)
- `robots.txt`
- `sitemap.xml`
- `assets/` folder with JS/CSS bundles

---

## 4. Update Sitemap

Before deploying, update `public/sitemap.xml`:

1. Replace `https://yourportfolio.com/` with your actual domain
2. Optionally, query Supabase for published projects/portfolios to add dynamic URLs

---

## 5. Upload to Namecheap

### 5.1 Access cPanel
1. Log in to Namecheap account
2. Go to **Hosting List** → **Manage** → **cPanel**

### 5.2 Upload Files
1. Open **File Manager**
2. Navigate to `public_html/`
3. **Delete default files** (index.html, etc.)
4. Upload **all contents** of `dist/` folder

### Critical Files Checklist:
- ✅ `index.html`
- ✅ `.htaccess`
- ✅ `robots.txt`
- ✅ `sitemap.xml`
- ✅ `assets/` folder

**IMPORTANT**: Make sure `.htaccess` is uploaded! It's hidden by default. Enable "Show Hidden Files" in File Manager settings.

---

## 6. Verify Deployment

### 6.1 Test Public Pages
- ✅ Homepage loads: `https://yourdomain.com/`
- ✅ Projects page: `https://yourdomain.com/projects`
- ✅ Deep link works after refresh: `https://yourdomain.com/projects/some-slug`
- ✅ Client portfolio: `https://yourdomain.com/p/client-slug`

### 6.2 Test Admin Access
1. Go to `https://yourdomain.com/admin/login`
2. Log in with Supabase admin credentials
3. Create a test project
4. Publish it and verify it appears on `/projects`

### 6.3 Test Contact Form
1. Fill out contact form
2. Verify submission creates entry in `contact_messages` table
3. Check spam protection works (try submitting twice within 60s)

---

## 7. Security Verification

### RLS Policies Active
```sql
-- Run in Supabase SQL Editor to verify policies
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

### Test Public Cannot See Drafts
1. Create a project but don't publish it (leave `published = false`)
2. Log out of admin
3. Visit `/projects` - draft should NOT appear
4. Try accessing `/projects/draft-slug` directly - should show 404 or empty

---

## 8. Post-Deployment Tasks

### 8.1 Add Sample Content
1. Create 2-3 showcase projects
2. Upload high-quality images
3. Create one client portfolio
4. Populate site settings (socials, links, SEO)

### 8.2 Update SEO
1. Edit `public/sitemap.xml` with your domain
2. Submit sitemap to Google Search Console
3. Add OG image at `/og-image.jpg` for social sharing

### 8.3 Configure DNS (if using custom domain)
If using a custom domain:
1. Point A record to Namecheap server IP
2. Wait for DNS propagation (up to 48 hours)
3. Enable SSL in cPanel (Let's Encrypt - free)

---

## 9. Ongoing Maintenance

### Content Updates
- Log in to `/admin` to add projects and portfolios
- Changes appear instantly (no redeploy needed!)

### Code Updates
1. Make changes locally
2. Run `npm run build`
3. Upload new `dist/` contents to `public_html/`

### Database Backups
- Supabase handles automatic backups
- Export data periodically via SQL dumps for safety

---

## Troubleshooting

### Issue: 404 on page refresh
**Solution**: Verify `.htaccess` is uploaded and contains correct redirects

### Issue: Admin login fails
**Solution**: 
1. Check `.env` has correct Supabase URL and anon key
2. Verify admin user exists in Supabase Auth
3. Check browser console for CORS errors

### Issue: Images not uploading
**Solution**:
1. Verify `storage-setup.sql` was run
2. Check bucket permissions in Supabase Storage
3. Verify `image-uploads` bucket exists and is public

### Issue: Contact form spam
**Solution**: 
- Honeypot and cooldown are active client-side
- Consider adding Supabase Edge Functions for server-side validation

---

## Quick Reference

### Admin Routes
- Login: `/admin/login`
- Dashboard: `/admin`
- Projects: `/admin/projects`
- Portfolios: `/admin/portfolios`
- Messages: `/admin/messages`
- Settings: `/admin/settings`

### Important Files
- **`.env`** - Environment variables (local only, not deployed)
- **`.htaccess`** - SPA routing configuration
- **`supabase/`** - Database setup scripts

---

## Support

For issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify RLS policies are active
4. Review this deployment guide

Your portfolio is now live and production-ready! 🚀
