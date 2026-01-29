import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FadeIn } from '@/components/motion/FadeIn';
import { ArrowRight, Code, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    tags: string[];
    images: any;
    featured: boolean;
}

interface SiteSettings {
    display_name: string;
    headline: string;
    subheadline: string;
    upwork_link: string | null;
    fiverr_link: string | null;
}

export const Home: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch settings
            const { data: settingsData } = await supabase
                .from('site_settings')
                .select('*')
                .single();

            if (settingsData) setSettings(settingsData);

            // Fetch featured projects
            const { data: projectsData } = await supabase
                .from('projects')
                .select('*')
                .eq('published', true)
                .eq('featured', true)
                .order('created_at', { ascending: false })
                .limit(3);

            if (projectsData) setProjects(projectsData);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-graphite-400">Loading...</div>
        </div>;
    }

    return (
        <>
            <SEO
                title="Home"
                description="Premium portfolio showcasing exceptional digital products, web development projects, and case studies."
                type="website"
            />
            <div className="min-h-screen">
                {/* Hero */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <FadeIn>
                        <h1 className="text-display-lg md:text-display-lg text-gradient mb-6">
                            {settings?.headline || 'Building Exceptional Digital Experiences'}
                        </h1>
                        <p className="text-xl md:text-2xl text-graphite-300 max-w-3xl mb-10">
                            {settings?.subheadline || 'Premium tech editorial portfolio showcasing world-class engineering and design.'}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/projects">
                                <Button size="lg">
                                    View Work <ArrowRight size={20} />
                                </Button>
                            </Link>
                            {settings?.upwork_link && (
                                <a href={settings.upwork_link} target="_blank" rel="noopener noreferrer">
                                    <Button variant="secondary" size="lg">
                                        Hire on Upwork
                                    </Button>
                                </a>
                            )}
                        </div>
                    </FadeIn>
                </section>

                {/* Selected Work */}
                {projects.length > 0 && (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <FadeIn>
                            <h2 className="text-display-sm mb-12 text-gradient">Selected Work</h2>
                        </FadeIn>
                        <div className="grid grid-cols-1 gap-8">
                            {projects.map((project, index) => (
                                <FadeIn key={project.id} delay={index * 0.1}>
                                    <Link to={`/projects/${project.slug}`}>
                                        <Card hover className="overflow-hidden">
                                            <div className="flex flex-col md:flex-row gap-0">
                                                {/* Project Image */}
                                                {project.images && project.images.length > 0 && (
                                                    <div className="md:w-2/5 relative aspect-video md:aspect-square overflow-hidden bg-dark-800">
                                                        <img
                                                            src={project.images[0]}
                                                            alt={project.title}
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                )}

                                                {/* Project Content */}
                                                <div className="flex-1 p-8">
                                                    <h3 className="text-2xl font-bold text-graphite-100 mb-3">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-graphite-400 mb-4">{project.summary}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.tags?.slice(0, 3).map((tag: string) => (
                                                            <span key={tag} className="px-3 py-1 bg-dark-600 text-graphite-300 text-xs rounded-full">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </FadeIn>
                            ))}
                        </div>
                        <FadeIn delay={0.3}>
                            <div className="text-center mt-12">
                                <Link to="/projects">
                                    <Button variant="secondary">
                                        View All Projects <ArrowRight size={18} />
                                    </Button>
                                </Link>
                            </div>
                        </FadeIn>
                    </section>
                )}

                {/* How I Work */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <FadeIn>
                        <h2 className="text-display-sm mb-12 text-gradient">How I Work</h2>
                    </FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FadeIn delay={0.1}>
                            <Card className="p-8">
                                <div className="w-12 h-12 bg-accent-blue/10 rounded-lg flex items-center justify-center mb-4">
                                    <Code className="text-accent-blue" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-graphite-100 mb-3">Engineering Excellence</h3>
                                <p className="text-graphite-400">
                                    Clean, maintainable code with modern best practices and comprehensive testing.
                                </p>
                            </Card>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <Card className="p-8">
                                <div className="w-12 h-12 bg-accent-purple/10 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="text-accent-purple" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-graphite-100 mb-3">Fast Execution</h3>
                                <p className="text-graphite-400">
                                    Rapid iteration cycles with continuous communication and transparent progress.
                                </p>
                            </Card>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <Card className="p-8">
                                <div className="w-12 h-12 bg-accent-cyan/10 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="text-accent-cyan" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-graphite-100 mb-3">Clear Communication</h3>
                                <p className="text-graphite-400">
                                    Regular updates, detailed documentation, and proactive problem-solving.
                                </p>
                            </Card>
                        </FadeIn>
                    </div>
                </section>
            </div>
        </>
    );
};
