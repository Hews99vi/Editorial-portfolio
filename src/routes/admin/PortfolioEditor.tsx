import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ArrayInput } from '@/components/admin/ArrayInput';
import { Toast } from '@/components/admin/Toast';
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    slug: string;
}

interface SortableItemProps {
    id: string;
    project: Project;
    onRemove: () => void;
}

function SortableItem({ id, project, onRemove }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
            <div {...attributes} {...listeners} className="cursor-grab text-gray-400">
                <GripVertical size={20} />
            </div>
            <div className="flex-1">
                <div className="font-medium text-gray-900">{project.title}</div>
                <div className="text-sm text-gray-500">{project.slug}</div>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={onRemove}>
                Remove
            </Button>
        </div>
    );
}

export const PortfolioEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        client_name: '',
        intro_message: '',
        why_fit_bullets: [] as string[],
        accent_preset: 'blue',
        published: false,
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const fetchData = async () => {
            // Fetch all published projects
            const { data: projects } = await supabase
                .from('projects')
                .select('id, title, slug')
                .eq('published', true)
                .order('title');

            if (projects) setAllProjects(projects);

            // If editing, fetch portfolio data
            if (!isNew && id) {
                const { data: portfolio } = await supabase
                    .from('client_portfolios')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (portfolio) {
                    setFormData({
                        ...(portfolio as any),
                        why_fit_bullets: (portfolio as any).why_fit_bullets || [],
                    });
                }

                // Fetch selected projects
                const { data: portfolioProjects } = await supabase
                    .from('portfolio_projects')
                    .select('project_id, projects(id, title, slug)')
                    .eq('portfolio_id', id)
                    .order('sort_order');

                if (portfolioProjects && projects) {
                    const selected = portfolioProjects
                        .map((pp: any) => pp.projects)
                        .filter(Boolean);
                    setSelectedProjects(selected);
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [id, isNew]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setSelectedProjects((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleAddProject = (projectId: string) => {
        const project = allProjects.find((p) => p.id === projectId);
        if (project && !selectedProjects.find((p) => p.id === projectId)) {
            setSelectedProjects([...selectedProjects, project]);
        }
    };

    const handleRemoveProject = (projectId: string) => {
        setSelectedProjects(selectedProjects.filter((p) => p.id !== projectId));
    };

    const handleSave = async (publish: boolean = false) => {
        setSaving(true);

        const portfolioData = {
            ...formData,
            published: publish,
        };

        try {
            let portfolioId = id;

            if (isNew) {
                const { data, error } = await (supabase
                    .from('client_portfolios')
                    .insert as any)([portfolioData])
                    .select()
                    .single();

                if (error) throw error;
                portfolioId = (data as any).id;
            } else {
                const { error } = await (supabase
                    .from('client_portfolios')
                    .update as any)(portfolioData)
                    .eq('id', id!);

                if (error) throw error;

                // Delete existing project links
                await supabase
                    .from('portfolio_projects')
                    .delete()
                    .eq('portfolio_id', id!);
            }

            // Insert project links with sort order
            if (selectedProjects.length > 0 && portfolioId) {
                const projectLinks = selectedProjects.map((project, index) => ({
                    portfolio_id: portfolioId,
                    project_id: project.id,
                    sort_order: index,
                }));

                await (supabase.from('portfolio_projects').insert as any)(projectLinks);
            }

            setToast({ message: publish ? 'Portfolio published!' : 'Portfolio saved', type: 'success' });
            if (isNew) {
                setTimeout(() => navigate(`/admin/portfolios/${portfolioId}`), 1000);
            }
        } catch (error: any) {
            setToast({ message: error.message || 'Failed to save', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/p/${formData.slug}`;
        navigator.clipboard.writeText(link);
        setToast({ message: 'Link copied to clipboard!', type: 'success' });
    };

    if (loading) {
        return <div className="text-gray-600">Loading...</div>;
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin/portfolios" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isNew ? 'New Portfolio' : 'Edit Portfolio'}
                        </h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    {!isNew && (
                        <Button variant="secondary" onClick={handleCopyLink}>
                            <Copy size={16} />
                            Copy Link
                        </Button>
                    )}
                    {!isNew && formData.published && (
                        <a
                            href={`/p/${formData.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 px-4 py-2"
                        >
                            Preview <ExternalLink size={16} />
                        </a>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Portfolio Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: slugify(e.target.value) })}
                        placeholder="Portfolio for [Client Name]"
                        required
                    />

                    <Input
                        label="Client Name"
                        value={formData.client_name}
                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                        placeholder="Client or Company Name"
                        required
                    />

                    <div className="col-span-2">
                        <Input
                            label="Slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="client-slug"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">URL: /p/{formData.slug}</p>
                    </div>
                </div>

                <Textarea
                    label="Intro Message"
                    value={formData.intro_message}
                    onChange={(e) => setFormData({ ...formData, intro_message: e.target.value })}
                    placeholder="Personal message introducing yourself to this client"
                    rows={4}
                    required
                />

                <ArrayInput
                    label="Why I'm a Great Fit (Bullet Points)"
                    value={formData.why_fit_bullets}
                    onChange={(why_fit_bullets) => setFormData({ ...formData, why_fit_bullets })}
                    placeholder="Add reason..."
                />

                {/* Project Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Projects to Showcase</label>
                    <select
                        onChange={(e) => handleAddProject(e.target.value)}
                        value=""
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg mb-4"
                    >
                        <option value="">Choose a project to add...</option>
                        {allProjects
                            .filter((p) => !selectedProjects.find((sp) => sp.id === p.id))
                            .map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.title}
                                </option>
                            ))}
                    </select>

                    {selectedProjects.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-600 mb-3">Drag to reorder:</p>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={selectedProjects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-2">
                                        {selectedProjects.map((project) => (
                                            <SortableItem
                                                key={project.id}
                                                id={project.id}
                                                project={project}
                                                onRemove={() => handleRemoveProject(project.id)}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button onClick={() => handleSave(false)} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button onClick={() => handleSave(true)} disabled={saving}>
                        {saving ? 'Publishing...' : 'Publish'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/admin/portfolios')}>
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
