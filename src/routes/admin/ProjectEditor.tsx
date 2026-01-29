import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ArrayInput } from '@/components/admin/ArrayInput';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Toast } from '@/components/admin/Toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export const ProjectEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        summary: '',
        problem: '',
        approach: '',
        outcome: '',
        metrics: {} as Record<string, string>,
        tags: [] as string[],
        tech_stack: [] as string[],
        role: '',
        timeline: '',
        images: [] as string[],
        live_url: '',
        github_url: '',
        featured: false,
        published: false,
    });

    useEffect(() => {
        if (!isNew && id) {
            const fetchProject = async () => {
                const { data } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (data) {
                    setFormData({
                        ...(data as any),
                        images: (data as any).images || [],
                        tags: (data as any).tags || [],
                        tech_stack: (data as any).tech_stack || [],
                        metrics: (data as any).metrics || {},
                    });
                }
                setLoading(false);
            };
            fetchProject();
        }
    }, [id, isNew]);

    const handleTitleChange = (value: string) => {
        setFormData({ ...formData, title: value, slug: slugify(value) });
    };

    const handleMetricChange = (key: string, value: string) => {
        setFormData({
            ...formData,
            metrics: { ...formData.metrics, [key]: value },
        });
    };

    const handleSave = async (publish: boolean = false) => {
        setSaving(true);

        const dataToSave = {
            ...formData,
            published: publish,
        };

        try {
            if (isNew) {
                const { data, error } = await (supabase
                    .from('projects')
                    .insert as any)([dataToSave])
                    .select()
                    .single();

                if (error) throw error;
                setToast({ message: publish ? 'Project published!' : 'Project saved as draft', type: 'success' });
                setTimeout(() => navigate(`/admin/projects/${(data as any).id}`), 1000);
            } else {
                const { error } = await (supabase
                    .from('projects')
                    .update as any)(dataToSave)
                    .eq('id', id!);

                if (error) throw error;
                setToast({ message: publish ? 'Project published!' : 'Project saved', type: 'success' });
            }
        } catch (error: any) {
            setToast({ message: error.message || 'Failed to save', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-gray-600">Loading...</div>;
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin/projects" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isNew ? 'New Project' : 'Edit Project'}
                        </h1>
                    </div>
                </div>
                {!isNew && formData.published && (
                    <a
                        href={`/projects/${formData.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                    >
                        Preview <ExternalLink size={16} />
                    </a>
                )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <Input
                            label="Title"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Project title"
                            required
                        />
                    </div>

                    <Input
                        label="Slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="project-slug"
                        required
                    />

                    <Input
                        label="Role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g. Full Stack Developer"
                        required
                    />

                    <Input
                        label="Timeline"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        placeholder="e.g. 3 months"
                        required
                    />
                </div>

                <Textarea
                    label="Summary"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Brief project summary"
                    rows={3}
                    required
                />

                {/* Case Study Sections */}
                <Textarea
                    label="The Challenge"
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    placeholder="Describe the problem or challenge"
                    rows={4}
                    required
                />

                <Textarea
                    label="The Approach"
                    value={formData.approach}
                    onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                    placeholder="Explain your approach and solution"
                    rows={4}
                    required
                />

                <Textarea
                    label="The Outcome"
                    value={formData.outcome}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                    placeholder="Describe the results and impact"
                    rows={4}
                    required
                />

                {/* Metrics */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metrics (key: value)</label>
                    <div className="space-y-2">
                        {Object.entries(formData.metrics).map(([key, value]) => (
                            <div key={key} className="flex gap-2">
                                <Input
                                    value={key}
                                    onChange={(e) => {
                                        const newMetrics = { ...formData.metrics };
                                        delete newMetrics[key];
                                        newMetrics[e.target.value] = value;
                                        setFormData({ ...formData, metrics: newMetrics });
                                    }}
                                    placeholder="Metric name"
                                    className="flex-1"
                                />
                                <Input
                                    value={value}
                                    onChange={(e) => handleMetricChange(key, e.target.value)}
                                    placeholder="Value"
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        const newMetrics = { ...formData.metrics };
                                        delete newMetrics[key];
                                        setFormData({ ...formData, metrics: newMetrics });
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleMetricChange('New Metric', '')}
                        >
                            Add Metric
                        </Button>
                    </div>
                </div>

                {/* Arrays */}
                <ArrayInput
                    label="Tags"
                    value={formData.tags}
                    onChange={(tags) => setFormData({ ...formData, tags })}
                    placeholder="Add tag..."
                />

                <ArrayInput
                    label="Tech Stack"
                    value={formData.tech_stack}
                    onChange={(tech_stack) => setFormData({ ...formData, tech_stack })}
                    placeholder="Add technology..."
                />

                {/* URLs */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Live URL (optional)"
                        value={formData.live_url || ''}
                        onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                        placeholder="https://example.com"
                    />

                    <Input
                        label="GitHub URL (optional)"
                        value={formData.github_url || ''}
                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                        placeholder="https://github.com/..."
                    />
                </div>

                {/* Images */}
                <ImageUploader
                    images={formData.images}
                    onChange={(images) => setFormData({ ...formData, images })}
                />

                {/* Toggles */}
                <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Featured Project</span>
                    </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button onClick={() => handleSave(false)} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button onClick={() => handleSave(true)} disabled={saving}>
                        {saving ? 'Publishing...' : 'Publish'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/admin/projects')}>
                        Cancel
                    </Button>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};
