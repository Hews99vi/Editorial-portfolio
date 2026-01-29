import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { FadeIn } from '@/components/motion/FadeIn';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    tags: string[];
    images: any;
}

export const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await supabase
                .from('projects')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (data) {
                setProjects(data);
                setFilteredProjects(data);

                // Extract all unique tags
                const tags = new Set<string>();
                data.forEach((project: Project) => {
                    project.tags?.forEach((tag: string) => tags.add(tag));
                });
                setAllTags(Array.from(tags));
            }
            setLoading(false);
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        let filtered = projects;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.summary.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by selected tag
        if (selectedTag) {
            filtered = filtered.filter(project =>
                project.tags?.includes(selectedTag)
            );
        }

        setFilteredProjects(filtered);
    }, [searchQuery, selectedTag, projects]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-graphite-400">Loading projects...</div>
        </div>;
    }

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <h1 className="text-display-md text-gradient mb-6">Projects</h1>
                    <p className="text-xl text-graphite-300 max-w-2xl mb-12">
                        A collection of my work spanning web applications, mobile apps, and design systems.
                    </p>
                </FadeIn>

                {/* Search and Filter */}
                <FadeIn delay={0.1}>
                    <div className="mb-12 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-graphite-500" size={20} />
                            <Input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12"
                            />
                        </div>

                        {allTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTag === null
                                        ? 'bg-accent-blue text-white'
                                        : 'bg-dark-700 text-graphite-300 hover:bg-dark-600'
                                        }`}
                                >
                                    All
                                </button>
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTag === tag
                                            ? 'bg-accent-blue text-white'
                                            : 'bg-dark-700 text-graphite-300 hover:bg-dark-600'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* Projects Grid */}
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-graphite-400">No projects found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredProjects.map((project, index) => (
                            <FadeIn key={project.id} delay={index * 0.05}>
                                <Link to={`/projects/${project.slug}`}>
                                    <Card hover className="overflow-hidden group h-full flex flex-col">
                                        {/* Project Image */}
                                        {project.images && project.images.length > 0 && (
                                            <div className="relative aspect-video overflow-hidden bg-dark-800">
                                                <img
                                                    src={project.images[0]}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}

                                        {/* Project Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-2xl font-bold text-graphite-100 mb-3">
                                                {project.title}
                                            </h3>
                                            <p className="text-graphite-400 mb-4 line-clamp-2 flex-1">
                                                {project.summary}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                {project.tags?.slice(0, 3).map((tag: string) => (
                                                    <Badge key={tag}>{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
