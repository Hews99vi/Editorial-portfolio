import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';
import { Mail, Send } from 'lucide-react';
import { SEO } from '@/components/SEO';

const COOLDOWN_KEY = 'contact_form_last_submit';
const COOLDOWN_MS = 60000; // 60 seconds

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        honeypot: '', // Honeypot field (should remain empty)
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [cooldownRemaining, setCooldownRemaining] = useState(0);

    // Check cooldown on mount
    useEffect(() => {
        const checkCooldown = () => {
            const lastSubmit = localStorage.getItem(COOLDOWN_KEY);
            if (lastSubmit) {
                const elapsed = Date.now() - parseInt(lastSubmit);
                if (elapsed < COOLDOWN_MS) {
                    setCooldownRemaining(Math.ceil((COOLDOWN_MS - elapsed) / 1000));
                }
            }
        };

        checkCooldown();
        const interval = setInterval(() => {
            const lastSubmit = localStorage.getItem(COOLDOWN_KEY);
            if (lastSubmit) {
                const elapsed = Date.now() - parseInt(lastSubmit);
                if (elapsed < COOLDOWN_MS) {
                    setCooldownRemaining(Math.ceil((COOLDOWN_MS - elapsed) / 1000));
                } else {
                    setCooldownRemaining(0);
                    clearInterval(interval);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitted(false);
        setError('');

        // Honeypot check (bots fill this field)
        if (formData.honeypot) {
            console.log('Bot detected');
            setSubmitting(false);
            return;
        }

        // Cooldown check
        const lastSubmit = localStorage.getItem(COOLDOWN_KEY);
        if (lastSubmit) {
            const elapsed = Date.now() - parseInt(lastSubmit);
            if (elapsed < COOLDOWN_MS) {
                setError(`Please wait ${Math.ceil((COOLDOWN_MS - elapsed) / 1000)} seconds before submitting again.`);
                setSubmitting(false);
                return;
            }
        }

        // Validation: minimum message length
        if (formData.message.trim().length < 50) {
            setError('Please provide a more detailed message (at least 50 characters).');
            setSubmitting(false);
            return;
        }

        try {
            const { error: insertError } = await (supabase
                .from('contact_messages')
                .insert as any)({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    status: 'new',
                });

            if (insertError) throw insertError;

            // Store submission time
            localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
            setCooldownRemaining(60);

            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
        } catch (err: any) {
            setError(err.message || 'Failed to send message. Please try again.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <SEO
                title="Contact"
                description="Get in touch to discuss your next project. Professional web development and digital solutions."
            />
            <div className="min-h-screen py-20">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn>
                        <div className="text-center mb-12">
                            <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Mail className="text-accent-blue" size={32} />
                            </div>
                            <h1 className="text-display-md text-gradient mb-4">Get in Touch</h1>
                            <p className="text-xl text-graphite-300">
                                Have a project in mind? Let's discuss how we can work together.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <Card className="p-8">
                            {submitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send className="text-green-500" size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-graphite-100 mb-2">Message Sent!</h3>
                                    <p className="text-graphite-400 mb-6">
                                        Thank you for reaching out. I'll get back to you soon.
                                    </p>
                                    <Button variant="secondary" onClick={() => setSubmitted(false)}>
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Input
                                        label="Name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Your name"
                                    />

                                    <Input
                                        label="Email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your.email@example.com"
                                    />

                                    <Input
                                        label="Subject"
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="What's this about?"
                                    />

                                    <Textarea
                                        label="Message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell me about your project... (minimum 50 characters)"
                                        rows={6}
                                        required
                                    />
                                    <p className="text-sm text-graphite-500 -mt-2">
                                        {formData.message.length}/50 characters minimum
                                    </p>

                                    {/* Honeypot field - hidden from users, visible to bots */}
                                    <input
                                        type="text"
                                        name="website"
                                        value={formData.honeypot}
                                        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                                        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                                        tabIndex={-1}
                                        autoComplete="off"
                                        aria-hidden="true"
                                    />

                                    {error && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={submitting || cooldownRemaining > 0 || formData.message.length < 50}
                                    >
                                        <Send size={18} />
                                        {submitting
                                            ? 'Sending...'
                                            : cooldownRemaining > 0
                                                ? `Wait ${cooldownRemaining}s`
                                                : 'Send Message'
                                        }
                                    </Button>
                                </form>
                            )}
                        </Card>
                    </FadeIn>
                </div>
            </div>
        </>
    );
};
