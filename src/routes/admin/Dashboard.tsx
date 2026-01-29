import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, Users, Mail, Plus } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        projects: 0,
        portfolios: 0,
        unreadMessages: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [projectsRes, portfoliosRes, messagesRes] = await Promise.all([
                supabase.from('projects').select('id', { count: 'exact', head: true }),
                supabase.from('client_portfolios').select('id', { count: 'exact', head: true }),
                supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new'),
            ]);

            setStats({
                projects: projectsRes.count || 0,
                portfolios: portfoliosRes.count || 0,
                unreadMessages: messagesRes.count || 0,
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-gray-600">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Manage your portfolio content</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.projects}</div>
                            <div className="text-sm text-gray-600">Projects</div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.portfolios}</div>
                            <div className="text-sm text-gray-600">Client Portfolios</div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Mail className="text-green-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</div>
                            <div className="text-sm text-gray-600">Unread Messages</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <Link to="/admin/projects/new">
                        <Button>
                            <Plus size={18} />
                            New Project
                        </Button>
                    </Link>
                    <Link to="/admin/portfolios/new">
                        <Button variant="secondary">
                            <Plus size={18} />
                            New Client Portfolio
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};
