import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';
import { ExternalLink, Check } from 'lucide-react';

interface Portfolio {
    id: string;
    title: string;
    slug: string;
    client_name: string;
    intro_message: string;
    why_fit_bullets: string[];
    accent_preset: string;
}

interface ProjectDetails {
    id: string;
    title: string;
    slug: string;
    summary: string;
    tags: string[];
}

export const ClientPortfolio: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [projects, setProjects] = useState<ProjectDetails[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) {
                setLoading(false);
                return;
            }

            // Fetch portfolio
            const { data: portfolioData } = await supabase
                .from('client_portfolios')
                .select('*')
                .eq('slug', slug)
                .eq('published', true)
                .single();

            if (!portfolioData) {
                setLoading(false);
                return;
            }

            setPortfolio(portfolioData as Portfolio);

            // Fetch settings
            const { data: settingsData } = await supabase
                .from('site_settings')
                .select('*')
                .single();

            setSettings(settingsData);

            // Fetch portfolio projects
            const { data: portfolioProjects } = await supabase
                .from('portfolio_projects')
                .select(`
          project_id,
          sort_order,
          projects (
            id,
            title,
            slug,
            summary,
            tags
          )
        `)
                .eq('portfolio_id', (portfolioData as Portfolio).id)
                .order('sort_order', { ascending: true });

            if (portfolioProjects) {
                setProjects(portfolioProjects.map((pp: any) => pp.projects));
            }

            setLoading(false);
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-graphite-400">Loading portfolio...</div>
        </div>;
    }

    if (!portfolio) {
        return <div className="min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-graphite-100 mb-4">Portfolio not found</h2>
            <Link to="/">
                <Button variant="secondary">Go Home</Button>
            </Link>
        </div>;
    }

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <FadeIn>
                    <h1 className="text-display-md text-gradient mb-6">
                        {portfolio.title}
                    </h1>
                    <p className="text-xl text-graphite-300 mb-12 whitespace-pre-line">
                        {portfolio.intro_message}
                    </p>
                </FadeIn>

                {/* Why Fit */}
                {portfolio.why_fit_bullets && portfolio.why_fit_bullets.length > 0 && (
                    <FadeIn delay={0.1}>
                        <Card className="p-8 mb-12">
                            <h2 className="text-2xl font-bold text-graphite-100 mb-6">Why I'm a Great Fit</h2>
                            <div className="space-y-4">
                                {portfolio.why_fit_bullets.map((bullet, index) => (
                                    <div key={index} className="flex gap-3">
                                        <Check className="text-accent-blue flex-shrink-0" size={20} />
                                        <span className="text-graphite-300">{bullet}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </FadeIn>
                )}

                {/* Selected Projects */}
                {projects.length > 0 && (
                    <div className="mb-12">
                        <FadeIn delay={0.2}>
                            <h2 className="text-2xl font-bold text-graphite-100 mb-6">Selected Work</h2>
                        </FadeIn>
                        <div className="space-y-6">
                            {projects.map((project, index) => (
                                <FadeIn key={project.id} delay={0.3 + index * 0.1}>
                                    <Link to={`/projects/${project.slug}`}>
                                        <Card hover className="p-6">
                                            <h3 className="text-xl font-bold text-graphite-100 mb-2">
                                                {project.title}
                                            </h3>
                                            <p className="text-graphite-400 mb-3">{project.summary}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags?.slice(0, 3).map((tag: string) => (
                                                    <span key={tag} className="px-3 py-1 bg-dark-600 text-graphite-300 text-xs rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </Card>
                                    </Link>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <FadeIn delay={0.6}>
                    <Card className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-graphite-100 mb-4">Let's Work Together</h2>
                        <p className="text-graphite-300 mb-6">
                            Ready to start your project? Get in touch today.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {settings?.upwork_link && (
                                <a href={settings.upwork_link} target="_blank" rel="noopener noreferrer">
                                    <Button>
                                        <ExternalLink size={18} />
                                        Hire on Upwork
                                    </Button>
                                </a>
                            )}
                            {settings?.calendly_link && (
                                <a href={settings.calendly_link} target="_blank" rel="noopener noreferrer">
                                    <Button variant="secondary">
                                        Schedule a Call
                                    </Button>
                                </a>
                            )}
                        </div>
                    </Card>
                </FadeIn>
            </div>
        </div>
    );
};
