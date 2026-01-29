
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { AuthGuard } from './components/admin/AuthGuard';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Routes (loaded immediately)
import { Home } from './routes/Home';
import { Projects } from './routes/Projects';
import { ProjectDetail } from './routes/ProjectDetail';
import { ClientPortfolio } from './routes/ClientPortfolio';
import { Services } from './routes/Services';
import { About } from './routes/About';
import { Contact } from './routes/Contact';

// Admin Routes (lazy loaded)
const AdminLogin = lazy(() => import('./routes/admin/Login').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./routes/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const ProjectsAdmin = lazy(() => import('./routes/admin/ProjectsAdmin').then(m => ({ default: m.ProjectsAdmin })));
const ProjectEditor = lazy(() => import('./routes/admin/ProjectEditor').then(m => ({ default: m.ProjectEditor })));
const PortfoliosAdmin = lazy(() => import('./routes/admin/PortfoliosAdmin').then(m => ({ default: m.PortfoliosAdmin })));
const PortfolioEditor = lazy(() => import('./routes/admin/PortfolioEditor').then(m => ({ default: m.PortfolioEditor })));
const MessagesAdmin = lazy(() => import('./routes/admin/MessagesAdmin').then(m => ({ default: m.MessagesAdmin })));
const SettingsAdmin = lazy(() => import('./routes/admin/SettingsAdmin').then(m => ({ default: m.SettingsAdmin })));

import './styles/global.css';

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-gray-600">Loading...</div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:slug" element={<ProjectDetail />} />
            <Route path="p/:slug" element={<ClientPortfolio />} />
            <Route path="services" element={<Services />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Login (unprotected but lazy loaded) */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />

          {/* Admin Routes (protected and lazy loaded) */}
          <Route
            path="/admin"
            element={
              <AuthGuard>
                <AdminLayout />
              </AuthGuard>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminDashboard />
                </Suspense>
              }
            />
            <Route
              path="projects"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProjectsAdmin />
                </Suspense>
              }
            />
            <Route
              path="projects/:id"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProjectEditor />
                </Suspense>
              }
            />
            <Route
              path="portfolios"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PortfoliosAdmin />
                </Suspense>
              }
            />
            <Route
              path="portfolios/:id"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PortfolioEditor />
                </Suspense>
              }
            />
            <Route
              path="messages"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <MessagesAdmin />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <SettingsAdmin />
                </Suspense>
              }
            />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
                <p className="text-xl text-graphite-300 mb-8">Page not found</p>
                <a
                  href="/"
                  className="inline-block px-6 py-3 bg-accent-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
