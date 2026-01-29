# 🔧 Supabase Setup & Connectivity Fix Guide

## 🚨 DIAGNOSIS SUMMARY

**Status:** ❌ Database not initialized  
**Impact:** All API endpoints return 404, admin login fails

**Root Causes Found:**
1. ❌ Database schema not executed (tables don't exist)
2. ⚠️ Anon key format appears incorrect

---

## ✅ STEP-BY-STEP FIX

### Step 1: Verify Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project: `yidvgexaoeyucdbtokoc`
3. Go to **Settings** → **API**
4. Copy the correct values:

```env
# Project URL
URL: https://yidvgexaoeyucdbtokoc.supabase.co

# Project API Keys
anon/public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANT:** The anon key should be a long JWT token starting with `eyJ...`, NOT `sb_publishable_...`

5. Update your `.env` file with the correct anon key

---

### Step 2: Create Database Tables

Your `schema.sql` is ready but hasn't been executed. Run it now:

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the **entire contents** of:
   ```
   e:\2026 Projects\MYP\supabase\schema.sql
   ```
4. Click **Run** (or press F5)
5. Wait for "Success. No rows returned"

**What this creates:**
- ✅ `projects` table
- ✅ `client_portfolios` table  
- ✅ `portfolio_projects` junction table
- ✅ `contact_messages` table
- ✅ `site_settings` table (with default row)
- ✅ All RLS policies
- ✅ Indexes for performance

---

### Step 3: Run Additional Scripts (Optional but Recommended)

After schema.sql succeeds, run these in order:

**3a. Constraints & Indexes** (if not already in schema.sql)
```sql
-- Run: e:\2026 Projects\MYP\supabase\constraints.sql
```

**3b. Enhanced RLS Policies**
```sql
-- Run: e:\2026 Projects\MYP\supabase\rls-policies.sql
```

**3c. Storage Setup**
```sql
-- Run: e:\2026 Projects\MYP\supabase\storage-setup.sql
```

---

### Step 4: Create Admin User

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create New User**
3. Enter:
   - Email: `your-email@example.com`
   - Password: `YourSecurePassword123!`
   - ✅ Check "Auto Confirm User" (important!)
4. Click **Create User**
5. Save credentials securely

---

### Step 5: Verify Tables Exist

Run this query in SQL Editor to confirm:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected output:**
```
client_portfolios
contact_messages
portfolio_projects
projects
site_settings
```

---

### Step 6: Test Connectivity

1. **Restart your dev server:**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. **Check browser console** - errors should be gone!

3. **Test admin login:**
   - Go to `http://localhost:5173/admin/login`
   - Use the admin credentials from Step 4
   - Should redirect to `/admin` dashboard

---

## 🔍 VERIFICATION CHECKLIST

After completing all steps, verify:

- [ ] No 404 errors in browser console
- [ ] No 400 auth errors
- [ ] `/admin/login` accepts credentials
- [ ] `/admin` dashboard shows "0" for all stats (initially)
- [ ] Can create a test project
- [ ] Public pages load without errors

---

## 🐛 TROUBLESHOOTING

### Issue: Still getting 404 errors
**Solution:** 
- Verify schema.sql ran successfully (check for SQL errors)
- Confirm tables exist using Step 5 query
- Check that RLS is enabled: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`

### Issue: Auth 400 error persists  
**Solution:**
- Double-check anon key is correct JWT format (starts with `eyJ...`)
- Verify user was created with "Auto Confirm" checked
- Try creating a new user if the first one has issues

### Issue: "User already registered" but can't login
**Solution:**
- Go to Auth → Users in Supabase Dashboard
- Find the user
- Click user → Set/Reset password
- Use new password to login

### Issue: Can see tables but no data loads
**Solution:**
- RLS policies may be too restrictive
- Run the enhanced RLS policies from `rls-policies.sql`
- Verify you're logged in as an authenticated user

---

## 📋 Quick Reference

**Supabase Project:**
- URL: `https://yidvgexaoeyucdbtokoc.supabase.co`
- Project Ref: `yidvgexaoeyucdbtokoc`

**Files to Run (in order):**
1. `supabase/schema.sql` ← **CRITICAL**
2. `supabase/constraints.sql`
3. `supabase/rls-policies.sql`
4. `supabase/storage-setup.sql`

**Test Endpoints:**
```
✅ Auth: https://yidvgexaoeyucdbtokoc.supabase.co/auth/v1/token
✅ REST: https://yidvgexaoeyucdbtokoc.supabase.co/rest/v1/projects
```

---

## ✨ After Setup Complete

Once everything works:

1. **Add sample content** via admin panel
2. **Test public pages** (projects should show published items only)
3. **Create a client portfolio** to test the `/p/:slug` feature
4. **Submit contact form** to verify spam protection
5. **Review deployment guide** in `DEPLOYMENT.md` for production

---

**Estimated Time:** 10-15 minutes  
**Difficulty:** Easy (just copy-paste SQL)

Your application code is perfect - you just need to initialize the database! 🚀
