import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/admin/Toast';

export const SettingsAdmin: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [formData, setFormData] = useState({
        display_name: '',
        headline: '',
        subheadline: '',
        github: '',
        linkedin: '',
        twitter: '',
        upwork_link: '',
        fiverr_link: '',
        calendly_link: '',
        default_seo_title: '',
        default_seo_description: '',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase
                .from('site_settings')
                .select('*')
                .single();

            if (data) {
                const socials = (data as any).socials || {};
                setFormData({
                    display_name: (data as any).display_name || '',
                    headline: (data as any).headline || '',
                    subheadline: (data as any).subheadline || '',
                    github: socials.github || '',
                    linkedin: socials.linkedin || '',
                    twitter: socials.twitter || '',
                    upwork_link: (data as any).upwork_link || '',
                    fiverr_link: (data as any).fiverr_link || '',
                    calendly_link: (data as any).calendly_link || '',
                    default_seo_title: (data as any).default_seo_title || '',
                    default_seo_description: (data as any).default_seo_description || '',
                });
            }
            setLoading(false);
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);

        const dataToSave = {
            display_name: formData.display_name,
            headline: formData.headline,
            subheadline: formData.subheadline,
            socials: {
                github: formData.github,
                linkedin: formData.linkedin,
                twitter: formData.twitter,
            },
            upwork_link: formData.upwork_link,
            fiverr_link: formData.fiverr_link,
            calendly_link: formData.calendly_link,
            default_seo_title: formData.default_seo_title,
            default_seo_description: formData.default_seo_description,
        };

        try {
            // Update the single settings row
            const { error } = await (supabase
                .from('site_settings')
                .update as any)(dataToSave)
                .eq('id', '00000000-0000-0000-0000-000000000001');

            if (error) throw error;
            setToast({ message: 'Settings saved successfully!', type: 'success' });
        } catch (error: any) {
            setToast({ message: error.message || 'Failed to save settings', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-gray-600">Loading settings...</div>;
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Settings</h1>
                <p className="text-gray-600">Configure global site settings</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                {/* Profile */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Profile</h2>
                    <div className="space-y-4">
                        <Input
                            label="Display Name"
                            value={formData.display_name}
                            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                            placeholder="Your Name"
                        />
                        <Input
                            label="Main Headline"
                            value={formData.headline}
                            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                            placeholder="Building Exceptional Digital Experiences"
                        />
                        <Textarea
                            label="Subheadline"
                            value={formData.subheadline}
                            onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                            placeholder="Premium tech editorial portfolio..."
                            rows={2}
                        />
                    </div>
                </div>

                {/* Social Links */}
                <div className="border-t pt-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Social Links</h2>
                    <div className="space-y-4">
                        <Input
                            label="GitHub URL"
                            value={formData.github}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            placeholder="https://github.com/username"
                        />
                        <Input
                            label="LinkedIn URL"
                            value={formData.linkedin}
                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            placeholder="https://linkedin.com/in/username"
                        />
                        <Input
                            label="Twitter URL"
                            value={formData.twitter}
                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                            placeholder="https://twitter.com/username"
                        />
                    </div>
                </div>

                {/* Professional Links */}
                <div className="border-t pt-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Professional Links</h2>
                    <div className="space-y-4">
                        <Input
                            label="Upwork Profile"
                            value={formData.upwork_link}
                            onChange={(e) => setFormData({ ...formData, upwork_link: e.target.value })}
                            placeholder="https://upwork.com/freelancers/..."
                        />
                        <Input
                            label="Fiverr Profile"
                            value={formData.fiverr_link}
                            onChange={(e) => setFormData({ ...formData, fiverr_link: e.target.value })}
                            placeholder="https://fiverr.com/..."
                        />
                        <Input
                            label="Calendly Link"
                            value={formData.calendly_link}
                            onChange={(e) => setFormData({ ...formData, calendly_link: e.target.value })}
                            placeholder="https://calendly.com/..."
                        />
                    </div>
                </div>

                {/* SEO */}
                <div className="border-t pt-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Default SEO</h2>
                    <div className="space-y-4">
                        <Input
                            label="Default Page Title"
                            value={formData.default_seo_title}
                            onChange={(e) => setFormData({ ...formData, default_seo_title: e.target.value })}
                            placeholder="Premium Portfolio"
                        />
                        <Textarea
                            label="Default Meta Description"
                            value={formData.default_seo_description}
                            onChange={(e) => setFormData({ ...formData, default_seo_description: e.target.value })}
                            placeholder="Premium tech editorial portfolio showcasing exceptional work"
                            rows={2}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>
            </div>

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
};
