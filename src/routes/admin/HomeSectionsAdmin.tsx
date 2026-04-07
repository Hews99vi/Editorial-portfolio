import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/admin/Toast';
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverEvent, closestCenter, useDroppable } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, X } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    updated_at: string;
    home_featured: boolean;
    home_recent: boolean;
    home_best: boolean;
    home_featured_order: number | null;
    home_recent_order: number | null;
    home_best_order: number | null;
}

type SectionKey = 'home_featured' | 'home_recent' | 'home_best';

type OrderKey = 'home_featured_order' | 'home_recent_order' | 'home_best_order';

const SECTION_CONFIG: Array<{
    key: SectionKey;
    orderKey: OrderKey;
    label: string;
    description: string;
    accent: string;
}> = [
        {
            key: 'home_featured',
            orderKey: 'home_featured_order',
            label: 'Featured Projects',
            description: 'Primary showcase on the home page.',
            accent: 'border-purple-200 bg-purple-50 text-purple-700',
        },
        {
            key: 'home_recent',
            orderKey: 'home_recent_order',
            label: 'Recent Works',
            description: 'Latest releases or currently active work.',
            accent: 'border-blue-200 bg-blue-50 text-blue-700',
        },
        {
            key: 'home_best',
            orderKey: 'home_best_order',
            label: 'Best Ranked',
            description: 'Top-performing or most impactful projects.',
            accent: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        },
    ];

const SECTION_KEYS = SECTION_CONFIG.map((section) => section.key);

const buildSectionOrders = (projects: Project[]) => {
    return SECTION_CONFIG.reduce((acc, section) => {
        const items = projects
            .filter((project) => project[section.key])
            .sort((a, b) => {
                const aOrder = a[section.orderKey];
                const bOrder = b[section.orderKey];
                if (aOrder == null && bOrder == null) {
                    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                }
                if (aOrder == null) return 1;
                if (bOrder == null) return -1;
                return aOrder - bOrder;
            })
            .map((project) => project.id);
        acc[section.key] = items;
        return acc;
    }, {} as Record<SectionKey, string[]>);
};

const SortableItem: React.FC<{
    id: string;
    title: string;
    slug: string;
    published: boolean;
    accent: string;
    onRemove: () => void;
}> = ({ id, title, slug, published, accent, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${accent} ${
                isDragging ? 'shadow-lg ring-2 ring-offset-2 ring-gray-200' : ''
            }`}
        >
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="cursor-grab text-gray-500 hover:text-gray-700"
                    {...attributes}
                    {...listeners}
                    aria-label="Drag to reorder"
                >
                    <GripVertical size={16} />
                </button>
                <div>
                    <div className="font-medium text-gray-900">{title}</div>
                    <div className="text-xs text-gray-500">/{slug}{published ? '' : ' • Draft'}</div>
                </div>
            </div>
            <button
                type="button"
                onClick={onRemove}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Remove from section"
            >
                <X size={16} />
            </button>
        </li>
    );
};

const SectionDropZone: React.FC<{
    id: SectionKey;
    children: React.ReactNode;
}> = ({ id, children }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`rounded-lg border border-gray-200 bg-white p-4 transition-shadow ${isOver ? 'shadow-md ring-2 ring-blue-200' : ''}`}
        >
            {children}
        </div>
    );
};

export const HomeSectionsAdmin: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [sectionOrders, setSectionOrders] = useState<Record<SectionKey, string[]>>({
        home_featured: [],
        home_recent: [],
        home_best: [],
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [pendingAdds, setPendingAdds] = useState<Record<SectionKey, string>>({
        home_featured: '',
        home_recent: '',
        home_best: '',
    });

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select(
                    'id, title, slug, published, updated_at, home_featured, home_recent, home_best, home_featured_order, home_recent_order, home_best_order'
                )
                .order('updated_at', { ascending: false });

            if (error) {
                setToast({ message: error.message || 'Failed to load projects', type: 'error' });
                setLoading(false);
                return;
            }

            const loaded = (data || []) as Project[];
            setProjects(loaded);
            setSectionOrders(buildSectionOrders(loaded));
            setLoading(false);
        };

        fetchProjects();
    }, []);

    const projectMap = useMemo(() => {
        return new Map(projects.map((project) => [project.id, project]));
    }, [projects]);

    const availableProjects = useMemo(() => {
        return SECTION_CONFIG.reduce((acc, section) => {
            const selected = new Set(sectionOrders[section.key]);
            acc[section.key] = projects.filter(
                (project) => project.published && !selected.has(project.id)
            );
            return acc;
        }, {} as Record<SectionKey, Project[]>);
    }, [projects, sectionOrders]);

    const handleAddToSection = (section: SectionKey) => {
        const projectId = pendingAdds[section];
        if (!projectId) return;
        setSectionOrders((prev) => ({
            ...prev,
            [section]: [...prev[section], projectId],
        }));
        setPendingAdds((prev) => ({ ...prev, [section]: '' }));
    };

    const handleRemoveFromSection = (section: SectionKey, projectId: string) => {
        setSectionOrders((prev) => ({
            ...prev,
            [section]: prev[section].filter((id) => id !== projectId),
        }));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeSection = SECTION_CONFIG.find((section) => sectionOrders[section.key].includes(String(active.id)))?.key;
        const overSection = SECTION_CONFIG.find((section) => sectionOrders[section.key].includes(String(over.id)))?.key;

        if (!activeSection || !overSection || activeSection !== overSection) return;

        setSectionOrders((prev) => {
            const items = prev[activeSection];
            const oldIndex = items.indexOf(String(active.id));
            const newIndex = items.indexOf(String(over.id));
            return {
                ...prev,
                [activeSection]: arrayMove(items, oldIndex, newIndex),
            };
        });
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        const activeSection = SECTION_CONFIG.find((section) => sectionOrders[section.key].includes(activeId))?.key;
        const overSection = SECTION_KEYS.includes(overId as SectionKey)
            ? (overId as SectionKey)
            : SECTION_CONFIG.find((section) => sectionOrders[section.key].includes(overId))?.key;

        if (!activeSection || !overSection || activeSection === overSection) return;

        setSectionOrders((prev) => {
            const activeItems = prev[activeSection];
            const overItems = prev[overSection];

            const activeIndex = activeItems.indexOf(activeId);
            if (activeIndex === -1) return prev;

            const nextActive = activeItems.filter((id) => id !== activeId);

            let newIndex = overItems.length;
            if (!SECTION_KEYS.includes(overId as SectionKey)) {
                const overIndex = overItems.indexOf(overId);
                if (overIndex >= 0) newIndex = overIndex;
            }

            const nextOver = [
                ...overItems.slice(0, newIndex),
                activeId,
                ...overItems.slice(newIndex),
            ];

            return {
                ...prev,
                [activeSection]: nextActive,
                [overSection]: nextOver,
            };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = projects.map((project) => {
                const featuredIndex = sectionOrders.home_featured.indexOf(project.id);
                const recentIndex = sectionOrders.home_recent.indexOf(project.id);
                const bestIndex = sectionOrders.home_best.indexOf(project.id);

                return {
                    id: project.id,
                    home_featured: featuredIndex >= 0,
                    home_featured_order: featuredIndex >= 0 ? featuredIndex + 1 : null,
                    home_recent: recentIndex >= 0,
                    home_recent_order: recentIndex >= 0 ? recentIndex + 1 : null,
                    home_best: bestIndex >= 0,
                    home_best_order: bestIndex >= 0 ? bestIndex + 1 : null,
                };
            });

            const { error } = await supabase
                .from('projects')
                .upsert(updates, { onConflict: 'id' });

            if (error) throw error;

            const updatedProjects = projects.map((project) => {
                const featuredIndex = sectionOrders.home_featured.indexOf(project.id);
                const recentIndex = sectionOrders.home_recent.indexOf(project.id);
                const bestIndex = sectionOrders.home_best.indexOf(project.id);
                return {
                    ...project,
                    home_featured: featuredIndex >= 0,
                    home_featured_order: featuredIndex >= 0 ? featuredIndex + 1 : null,
                    home_recent: recentIndex >= 0,
                    home_recent_order: recentIndex >= 0 ? recentIndex + 1 : null,
                    home_best: bestIndex >= 0,
                    home_best_order: bestIndex >= 0 ? bestIndex + 1 : null,
                };
            });

            setProjects(updatedProjects);
            setToast({ message: 'Home sections updated', type: 'success' });
        } catch (error: any) {
            setToast({ message: error.message || 'Failed to save home sections', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setSectionOrders(buildSectionOrders(projects));
    };

    if (loading) {
        return <div className="text-gray-600">Loading home sections...</div>;
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Sections Manager</h1>
                    <p className="text-gray-600">Select projects and drag to set their order per section.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Reset
                    </button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
                Only published projects appear on the public home page. Draft projects are hidden, even if selected here.
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
            >
                <div className="grid gap-6 lg:grid-cols-3">
                    {SECTION_CONFIG.map((section) => {
                        const items = sectionOrders[section.key];
                        const available = availableProjects[section.key];
                        return (
                            <SectionDropZone key={section.key} id={section.key}>
                                <div className="mb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">{section.label}</h2>
                                            <p className="text-xs text-gray-500">{section.description}</p>
                                        </div>
                                        <span className={`rounded-full border px-2 py-1 text-xs font-medium ${section.accent}`}>
                                            {items.length} selected
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mb-4">
                                    <select
                                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                                        value={pendingAdds[section.key]}
                                        onChange={(event) =>
                                            setPendingAdds((prev) => ({ ...prev, [section.key]: event.target.value }))
                                        }
                                    >
                                        <option value="">Add a project...</option>
                                        {available.map((project) => (
                                            <option key={project.id} value={project.id}>
                                                {project.title}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => handleAddToSection(section.key)}
                                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        <Plus size={16} />
                                        Add
                                    </button>
                                </div>

                                {items.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
                                        Drag projects here or add from the list.
                                    </div>
                                ) : (
                                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                        <ul className="space-y-2">
                                            {items.map((projectId) => {
                                                const project = projectMap.get(projectId);
                                                if (!project) return null;
                                                return (
                                                    <SortableItem
                                                        key={project.id}
                                                        id={project.id}
                                                        title={project.title}
                                                        slug={project.slug}
                                                        published={project.published}
                                                        accent={section.accent}
                                                        onRemove={() => handleRemoveFromSection(section.key, project.id)}
                                                    />
                                                );
                                            })}
                                        </ul>
                                    </SortableContext>
                                )}
                            </SectionDropZone>
                        );
                    })}
                </div>
            </DndContext>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};
