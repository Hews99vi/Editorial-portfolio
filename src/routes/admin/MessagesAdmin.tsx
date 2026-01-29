import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Toast } from '@/components/admin/Toast';
import { format } from 'date-fns';
import { Archive } from 'lucide-react';

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'archived';
    created_at: string;
}

export const MessagesAdmin: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [filter, setFilter] = useState<'new' | 'archived' | 'all'>('new');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const fetchMessages = async () => {
        let query = supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        const { data } = await query;
        if (data) setMessages(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMessages();
    }, [filter]);

    const handleArchive = async (id: string) => {
        const { error } = await (supabase
            .from('contact_messages')
            .update as any)({ status: 'archived' })
            .eq('id', id);

        if (!error) {
            setMessages(messages.map((m) => (m.id === id ? { ...m, status: 'archived' as const } : m)));
            setToast({ message: 'Message archived', type: 'success' });
        } else {
            setToast({ message: 'Failed to archive', type: 'error' });
        }
    };

    if (loading) {
        return <div className="text-gray-600">Loading messages...</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Messages</h1>
                <p className="text-gray-600">View and manage contact form submissions</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {(['new', 'archived', 'all'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filter === tab
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {messages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-600">No messages to display</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{message.subject}</h3>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${message.status === 'new'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {message.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-1">
                                        <span className="font-medium">{message.name}</span> ({message.email})
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {format(new Date(message.created_at), 'MMM d, yyyy \'at\' h:mm a')}
                                    </div>
                                </div>
                                {message.status === 'new' && (
                                    <button
                                        onClick={() => handleArchive(message.id)}
                                        className="text-gray-600 hover:text-gray-900 p-2"
                                        title="Archive"
                                    >
                                        <Archive size={20} />
                                    </button>
                                )}
                            </div>
                            <div className="text-gray-700 whitespace-pre-line border-t pt-4">
                                {message.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
};
