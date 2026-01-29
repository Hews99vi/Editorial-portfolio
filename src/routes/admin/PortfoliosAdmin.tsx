import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Toast } from '@/components/admin/Toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Portfolio {
    id: string;
    title: string;
    slug: string;
    client_name: string;
    published: boolean;
}

export const PortfoliosAdmin: React.FC = () => {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const fetchPortfolios = async () => {
        const { data } = await supabase
            .from('client_portfolios')
            .select('id, title, slug, client_name, published')
            .order('created_at', { ascending: false });

        if (data) setPortfolios(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;

        const { error } = await supabase
            .from('client_portfolios')
            .delete()
            .eq('id', deleteId);

        if (!error) {
            setPortfolios(portfolios.filter(p => p.id !== deleteId));
            setToast({ message: 'Portfolio deleted', type: 'success' });
        } else {
            setToast({ message: 'Failed to delete', type: 'error' });
        }
        setDeleteId(null);
    };

    if (loading) {
        return <div className="text-gray-600">Loading portfolios...</div>;
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Portfolios</h1>
                    <p className="text-gray-600">Manage custom portfolio pages for clients</p>
                </div>
                <Link to="/admin/portfolios/new">
                    <Button>
                        <Plus size={18} />
                        New Portfolio
                    </Button>
                </Link>
            </div>

            {portfolios.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-600 mb-4">No client portfolios yet</p>
                    <Link to="/admin/portfolios/new">
                        <Button>Create Your First Portfolio</Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Portfolio Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Client Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {portfolios.map((portfolio) => (
                                <tr key={portfolio.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{portfolio.title}</div>
                                        <div className="text-sm text-gray-500">/p/{portfolio.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        {portfolio.client_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${portfolio.published
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {portfolio.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/admin/portfolios/${portfolio.id}`}>
                                                <button className="text-blue-600 hover:text-blue-700 p-2">
                                                    <Edit size={18} />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(portfolio.id)}
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
                    title="Delete Portfolio"
                    message="Are you sure you want to delete this client portfolio? This action cannot be undone."
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
