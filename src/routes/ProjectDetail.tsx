import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { SEO } from '@/components/SEO';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    problem: string;
    approach: string;
    outcome: string;
    metrics: any;
    tags: string[];
    tech_stack: string[];
    role: string;
    timeline: string;
    images: any;
    live_url: string | null;
    github_url: string | null;
}

export const ProjectDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!slug) {
                setLoading(false);
                return;
            }

            const { data } = await supabase
                .from('projects')
                .select('*')
                .eq('slug', slug)
                .eq('published', true)
                .single();

            setProject(data);
            setLoading(false);
        };

        fetchProject();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-graphite-400">Loading project...</div>
        </div>;
    }

    if (!project) {
        return (
            <>
                <SEO title="Project Not Found" description="The requested project could not be found." />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-graphite-100 mb-4">Project Not Found</h1>
                        <Link to="/projects" className="text-accent-blue hover:underline">
                            Back to Projects
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO
                title={project.title}
                description={project.summary}
                type="article"
                image={project.images?.[0]}
            />
            <div className="min-h-screen py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <FadeIn>
                        <Link to="/projects" className="inline-flex items-center gap-2 text-graphite-400 hover:text-accent-blue transition-colors mb-8">
                            <ArrowLeft size={18} />
                            Back to Projects
                        </Link>
                    </FadeIn>

                    {/* Header */}
                    <FadeIn delay={0.1}>
                        <h1 className="text-display-md text-gradient mb-4">{project.title}</h1>
                        <p className="text-xl text-graphite-300 mb-6">{project.summary}</p>

                        {/* Hero Image */}
                        {project.images && project.images.length > 0 && (
                            <div className="mb-8 rounded-xl overflow-hidden bg-dark-800">
                                <img
                                    src={project.images[0]}
                                    alt={project.title}
                                    className="w-full aspect-video object-cover"
                                />
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4 mb-8">
                            {project.live_url && (
                                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm">
                                        <ExternalLink size={16} />
                                        Live Demo
                                    </Button>
                                </a>
                            )}
                            {project.github_url && (
                                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                    <Button variant="secondary" size="sm">
                                        <Github size={16} />
                                        View Code
                                    </Button>
                                </a>
                            )}
                        </div>

                        <div className="flex gap-4 text-sm text-graphite-400 mb-8">
                            <div><span className="font-medium">Role:</span> {project.role}</div>
                            <div><span className="font-medium">Timeline:</span> {project.timeline}</div>
                        </div>
                    </FadeIn>

                    {/* Case Study Sections */}
                    <div className="space-y-12 mt-12">
                        {/* Context */}
                        <FadeIn delay={0.2}>
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold text-graphite-100 mb-4">The Challenge</h2>
                                <p className="text-graphite-300 whitespace-pre-line">{project.problem}</p>
                            </Card>
                        </FadeIn>

                        {/* Approach */}
                        <FadeIn delay={0.3}>
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold text-graphite-100 mb-4">The Approach</h2>
                                <p className="text-graphite-300 whitespace-pre-line">{project.approach}</p>
                            </Card>
                        </FadeIn>

                        {/* Outcome */}
                        <FadeIn delay={0.4}>
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold text-graphite-100 mb-4">The Outcome</h2>
                                <p className="text-graphite-300 whitespace-pre-line mb-6">{project.outcome}</p>

                                {project.metrics && Object.keys(project.metrics).length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                        {Object.entries(project.metrics).map(([key, value]) => (
                                            <div key={key} className="bg-dark-800/50 p-4 rounded-lg">
                                                <div className="text-2xl font-bold text-accent-blue">{String(value)}</div>
                                                <div className="text-sm text-graphite-400">{key}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </FadeIn>

                        {/* Tech Stack */}
                        {project.tech_stack && project.tech_stack.length > 0 && (
                            <FadeIn delay={0.5}>
                                <Card className="p-8">
                                    <h2 className="text-2xl font-bold text-graphite-100 mb-4">Tech Stack</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech_stack.map((tech: string) => (
                                            <Badge key={tech} variant="accent">{tech}</Badge>
                                        ))}
                                    </div>
                                </Card>
                            </FadeIn>
                        )}

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                            <FadeIn delay={0.6}>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag: string) => (
                                        <Badge key={tag}>{tag}</Badge>
                                    ))}
                                </div>
                            </FadeIn>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
