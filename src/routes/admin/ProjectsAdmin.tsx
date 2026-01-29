import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Toast } from '@/components/admin/Toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Project {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    featured: boolean;
    updated_at: string;
}

export const ProjectsAdmin: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const fetchProjects = async () => {
        const { data } = await supabase
            .from('projects')
            .select('id, title, slug, published, featured, updated_at')
            .order('updated_at', { ascending: false });

        if (data) setProjects(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleToggle = async (id: string, field: 'published' | 'featured', currentValue: boolean) => {
        const { error } = await (supabase
            .from('projects')
            .update as any)({ [field]: !currentValue })
            .eq('id', id);

        if (!error) {
            setProjects(projects.map(p => p.id === id ? { ...p, [field]: !currentValue } : p));
            setToast({ message: 'Updated successfully', type: 'success' });
        } else {
            setToast({ message: 'Failed to update', type: 'error' });
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', deleteId);

        if (!error) {
            setProjects(projects.filter(p => p.id !== deleteId));
            setToast({ message: 'Project deleted', type: 'success' });
        } else {
            setToast({ message: 'Failed to delete', type: 'error' });
        }
        setDeleteId(null);
    };

    if (loading) {
        return <div className="text-gray-600">Loading projects...</div>;
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
                    <p className="text-gray-600">Manage your project case studies</p>
                </div>
                <Link to="/admin/projects/new">
                    <Button>
                        <Plus size={18} />
                        New Project
                    </Button>
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-600 mb-4">No projects yet</p>
                    <Link to="/admin/projects/new">
                        <Button>Create Your First Project</Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Published
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Featured
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Updated
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{project.title}</div>
                                        <div className="text-sm text-gray-500">{project.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggle(project.id, 'published', project.published)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${project.published
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {project.published ? 'Published' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggle(project.id, 'featured', project.featured)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${project.featured
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {project.featured ? 'Featured' : 'Normal'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {format(new Date(project.updated_at), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/admin/projects/${project.id}`}>
                                                <button className="text-blue-600 hover:text-blue-700 p-2">
                                                    <Edit size={18} />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(project.id)}
                                                className="text-red-600 hover:text-red-700 p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {deleteId && (
                <ConfirmDialog
                    title="Delete Project"
                    message="Are you sure you want to delete this project? This action cannot be undone."
                    confirmLabel="Delete"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}

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
