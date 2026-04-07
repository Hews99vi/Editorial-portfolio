import React from 'react';
import { Card } from '@/components/ui/Card';
import { FadeIn } from '@/components/motion/FadeIn';
import { Code, Palette, Zap, Globe, Database, Smartphone } from 'lucide-react';

export const Services: React.FC = () => {
    const services = [
        {
            icon: <Code size={32} />,
            title: 'Web Development',
            description: 'Custom web applications built with modern frameworks like React, Next.js, and TypeScript.',
        },
        {
            icon: <Smartphone size={32} />,
            title: 'Mobile Development',
            description: 'Native and cross-platform mobile apps with React Native and Flutter.',
        },
        {
            icon: <Database size={32} />,
            title: 'Backend Development',
            description: 'Scalable backend systems with Node.js, Python, and cloud infrastructure.',
        },
        {
            icon: <Palette size={32} />,
            title: 'UI/UX Design',
            description: 'User-centered design with modern aesthetics and pixel-perfect implementation.',
        },
        {
            icon: <Zap size={32} />,
            title: 'Performance Optimization',
            description: 'Speed optimization, bundle analysis, and performance tuning for web apps.',
        },
        {
            icon: <Globe size={32} />,
            title: 'DevOps & Deployment',
            description: 'CI/CD pipelines, cloud deployment, and infrastructure automation.',
        },
    ];

    return (
        <div className="min-h-screen py-12 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-5xl font-semibold text-white mb-4">Services</h1>
                        <p className="text-base sm:text-lg text-graphite-400 max-w-2xl mx-auto">
                            Comprehensive digital solutions from concept to deployment, delivered with technical excellence and creative thinking.
                        </p>
                    </div>
                </FadeIn>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <FadeIn key={service.title} delay={index * 0.1}>
                            <Card className="p-8 h-full border-white/10 bg-white/5">
                                <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-6 text-white/80">
                                    {service.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-sm text-graphite-400">
                                    {service.description}
                                </p>
                            </Card>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </div>
    );
};
