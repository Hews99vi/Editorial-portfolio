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
        <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <h1 className="text-display-md text-gradient mb-6">Services</h1>
                    <p className="text-xl text-graphite-300 max-w-2xl mb-16">
                        Comprehensive digital solutions from concept to deployment, delivered with technical excellence and creative thinking.
                    </p>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <FadeIn key={service.title} delay={index * 0.1}>
                            <Card className="p-8 h-full">
                                <div className="w-16 h-16 bg-accent-blue/10 rounded-xl flex items-center justify-center mb-6 text-accent-blue">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-graphite-100 mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-graphite-400">
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
