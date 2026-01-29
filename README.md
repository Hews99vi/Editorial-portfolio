# Premium Tech Editorial Portfolio

A sophisticated, uncommon tech editorial portfolio **Single Page Application (SPA)** built with Vite + React + TypeScript and Supabase. Designed for static deployment on Namecheap shared hosting with **instant content updates** via client-side data fetching.

## Features

- ✨ **Premium dark-first design** with glassmorphism and noise textures
- 🚀 **SPA architecture** - new content appears instantly without redeploys
- 🎨 **Clean URLs** via .htaccess rewrites (`/projects/my-project`, `/p/client-slug`)
- 📱 **Fully responsive** mobile-friendly design
- 🔒 **Secure admin panel** with Supabase Auth
- 📊 **Dynamic content** from Supabase (projects, portfolios, contact messages)
- 🖼️ **Image uploads** to Supabase Storage
- 📝 **Custom client portfolios** with personalized content

## Tech Stack

### Frontend
- **Vite** - Build tool
- **React 19** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend-as-a-Service
- **Supabase** (FREE tier)
  - PostgreSQL database
  - Authentication
  - Storage (images)
  - Row Level Security

## Getting Started

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up

### 2. Set Up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the SQL from `supabase/schema.sql` to create all tables
3. Run the SQL from `supabase/storage-setup.sql` to set up image storage

### 3. Create Admin User

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add User** → **Create new user**
3. Enter email and password for your admin account
4. Confirm the user manually if needed

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in your Supabase dashboard under **Settings** → **API**.

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your portfolio.

## Building for Production

### 1. Build the Project

```bash
npm run build
```

This creates a production build in the `dist/` folder.

### 2. Test the Build Locally

```bash
npm run preview
```

### 3. Deploy to Namecheap Shared Hosting

1. **Access cPanel File Manager** or use FTP
2. **Navigate to `public_html`** (or your domain's root directory)
3. **Upload all files from `dist/`** including:
   - `index.html`
   - `assets/` folder
   - `.htaccess`
   - `robots.txt`
4. **Verify .htaccess is uploaded** - This is critical for routing!

### 4. Verify Deployment

- Visit your domain
- Navigate to `/projects` - should work without showing 404
- Try creating a project in admin and visiting `/projects/new-slug` - should work instantly

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── motion/          # Animation components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Nav.tsx          # Navigation
│   └── Footer.tsx       # Footer
├── routes/
│   ├── Home.tsx         # Home page
│   ├── Projects.tsx     # Projects index with search/filter
│   ├── ProjectDetail.tsx    # Individual project case study
│   ├── ClientPortfolio.tsx  # Custom client portfolio (/p/:slug)
│   ├── Services.tsx     # Services page
│   ├── About.tsx        # About page
│   ├── Contact.tsx      # Contact form
│   └── admin/           # Admin CMS (TODO)
├── lib/
│   ├── supabase.ts      # Supabase client
│   ├── database.types.ts # TypeScript types
│   ├── image-upload.ts  # Image upload utilities
│   ├── seo.ts           # SEO helpers
│   └── utils.ts         # Utility functions
├── styles/
│   └── global.css       # Global styles + Tailwind
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## Admin Panel (TODO)

The admin panel is partially implemented. You'll need to create:

- `/src/routes/admin/Login.tsx` - Admin login
- `/src/routes/admin/Dashboard.tsx` - Dashboard
- `/src/routes/admin/ProjectsAdmin.tsx` - Projects management
- `/src/routes/admin/ProjectEditor.tsx` - Project editor
- `/src/routes/admin/PortfoliosAdmin.tsx` - Portfolios management
- `/src/routes/admin/PortfolioEditor.tsx` - Portfolio editor with drag & drop
- `/src/routes/admin/Messages.tsx` - Contact messages viewer
- `/src/routes/admin/Settings.tsx` - Site settings editor
- `/src/components/admin/AuthGuard.tsx` - Protected route wrapper

## How Client-Side Routing Works

1. **User visits `/projects/my-slug`**
2. **Apache (via .htaccess)** rewrites to `index.html`
3. **React Router** reads the URL and loads the correct component
4. **Component fetches data** from Supabase using the slug
5. **Content renders** - all client-side, no server needed!

## Adding Content

### Via Admin Panel (TODO)
Once the admin panel is built, you can manage all content through the UI.

### Via Supabase Dashboard (Manual)
1. Go to **Table Editor** in Supabase
2. Add rows directly to `projects`, `client_portfolios`, etc.
3. Set `published = true` to make content visible
4. Content appears instantly on your site!

## Customization

### Update Site Settings
Edit the `site_settings` table in Supabase to change:
- Display name
- Headline and subheadline
- Social links
- Upwork/Fiverr/Calendly links
- Default SEO metadata

### Customize Design
- Colors: Edit `tailwind.config.js`
- Global styles: Edit `src/styles/global.css`
- Components: Edit files in `src/components/ui/`

## Support

For issues or questions:
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- React Router: [reactrouter.com](https://reactrouter.com)
- Vite: [vitejs.dev](https://vitejs.dev)

## License

MIT License - feel free to use this for your own portfolio!

---

**Built with ❤️ using modern web technologies**
