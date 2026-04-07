import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { FadeIn } from '@/components/motion/FadeIn';
import { Link } from 'react-router-dom';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    tags: string[];
    images: string[];
}

interface SiteSettings {
    display_name: string;
    headline: string;
    subheadline: string;
    socials?: {
        github?: string;
        linkedin?: string;
        twitter?: string;
    };
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const image = project.images?.[0];

    return (
        <Link to={`/projects/${project.slug}`}>
            <Card hover className="group overflow-hidden border-white/10 bg-white/5">
                <div className="relative aspect-[16/9] bg-white/5">
                    {image ? (
                        <img
                            src={image}
                            alt={project.title}
                            className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
                    )}
                </div>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                    <p className="mt-2 text-sm text-graphite-400">{project.summary}</p>
                    {project.tags?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3 text-xs font-mono text-emerald-400">
                            {project.tags.slice(0, 3).map((tag) => (
                                <span key={tag}>{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );
};

const ProjectSection: React.FC<{ id: string; title: string; projects: Project[] }> = ({ id, title, projects }) => {
    return (
        <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <FadeIn>
                <h2 className="text-2xl sm:text-3xl font-semibold text-center text-white">{title}</h2>
            </FadeIn>
            {projects.length === 0 ? (
                <div className="mt-10 text-center text-sm text-graphite-500">No projects yet.</div>
            ) : (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <FadeIn key={project.id} delay={index * 0.05}>
                            <ProjectCard project={project} />
                        </FadeIn>
                    ))}
                </div>
            )}
        </section>
    );
};

export const Home: React.FC = () => {
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [bestProjects, setBestProjects] = useState<Project[]>([]);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [settingsRes, featuredRes, recentRes, bestRes, allRecentRes] = await Promise.all([
                supabase.from('site_settings').select('*').single(),
                supabase
                    .from('projects')
                    .select('id, title, slug, summary, tags, images')
                    .eq('published', true)
                    .eq('home_featured', true)
                    .order('home_featured_order', { ascending: true, nullsFirst: false })
                    .order('created_at', { ascending: false }),
                supabase
                    .from('projects')
                    .select('id, title, slug, summary, tags, images')
                    .eq('published', true)
                    .eq('home_recent', true)
                    .order('home_recent_order', { ascending: true, nullsFirst: false })
                    .order('created_at', { ascending: false }),
                supabase
                    .from('projects')
                    .select('id, title, slug, summary, tags, images')
                    .eq('published', true)
                    .eq('home_best', true)
                    .order('home_best_order', { ascending: true, nullsFirst: false })
                    .order('created_at', { ascending: false }),
                supabase
                    .from('projects')
                    .select('id, title, slug, summary, tags, images')
                    .eq('published', true)
                    .order('created_at', { ascending: false })
                    .limit(3),
            ]);

            if (settingsRes.data) setSettings(settingsRes.data as SiteSettings);

            const featured = (featuredRes.data || []) as Project[];
            const recent = (recentRes.data || []) as Project[];
            const best = (bestRes.data || []) as Project[];
            const fallback = (allRecentRes.data || []) as Project[];

            setFeaturedProjects(featured.length > 0 ? featured : fallback);
            setRecentProjects(recent.length > 0 ? recent : fallback);
            setBestProjects(best.length > 0 ? best : fallback);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-graphite-400">Loading...</div>
            </div>
        );
    }

    const displayName = settings?.display_name || 'John Doe';
    const roleLine = settings?.headline || 'Senior Full-Stack Engineer';
    const githubLink = settings?.socials?.github || 'https://github.com';

    return (
        <>
            <SEO
                title="Home"
                description="Premium portfolio showcasing exceptional digital products, web development projects, and case studies."
                type="website"
            />
            <div className="min-h-screen">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 flex flex-col items-center gap-16 sm:gap-24">
                    <FadeIn>
                        <div id="terminal" className="w-full max-w-2xl">
                            <div className="rounded-2xl border border-white/10 bg-white/5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                                        <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                                        <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
                                    </div>
                                    <div className="text-xs font-mono text-graphite-400">zsh — 80x24</div>
                                    <div className="w-12" />
                                </div>
                                <div className="p-6 space-y-4 font-mono text-sm sm:text-base">
                                    <div className="flex items-center gap-2">
                                        <span className="text-graphite-400">&gt;</span>
                                        <span className="text-white">whoami</span>
                                    </div>
                                    <div className="text-graphite-200">{displayName}, {roleLine}</div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <span className="text-graphite-400">&gt;</span>
                                        <span className="text-white">cat skills.txt</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-emerald-400 font-bold">
                                        <span>React</span>
                                        <span>Node.js</span>
                                        <span>TypeScript</span>
                                        <span>AWS</span>
                                        <span>PostgreSQL</span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <span className="text-graphite-400">&gt;</span>
                                        <span className="inline-block h-5 w-2 bg-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/contact"
                                className="min-w-[160px] rounded-full bg-white px-8 py-3 text-center text-sm sm:text-base font-semibold text-black"
                            >
                                Contact Me
                            </Link>
                            <a
                                href={githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-w-[160px] rounded-full border border-white/20 bg-white/5 px-8 py-3 text-center text-sm sm:text-base font-semibold text-white backdrop-blur-md"
                            >
                                View GitHub
                            </a>
                        </div>
                    </FadeIn>
                </section>

                <ProjectSection id="projects" title="Featured Projects" projects={featuredProjects} />
                <ProjectSection id="experience" title="Recent Works" projects={recentProjects} />
                <ProjectSection id="best" title="Best Ranked" projects={bestProjects} />
            </div>
        </>
    );
};
