import React from 'react';
import { Card } from '@/components/ui/Card';
import { FadeIn } from '@/components/motion/FadeIn';

export const About: React.FC = () => {
    return (
        <div className="min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <h1 className="text-display-md text-gradient mb-6">About</h1>
                    <p className="text-xl text-graphite-300 mb-12">
                        Building exceptional digital experiences with modern technology.
                    </p>
                </FadeIn>

                <div className="space-y-8">
                    <FadeIn delay={0.1}>
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-graphite-100 mb-4">My Story</h2>
                            <p className="text-graphite-300 mb-4">
                                I'm a passionate developer and designer dedicated to creating beautiful, functional, and performant digital products.
                            </p>
                            <p className="text-graphite-300">
                                With expertise spanning full-stack development, UI/UX design, and cloud infrastructure, I bring a holistic approach to every project.
                            </p>
                        </Card>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-graphite-100 mb-4">Skills & Technologies</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Tailwind CSS', 'PostgreSQL', 'AWS', 'Docker'].map(skill => (
                                    <div key={skill} className="text-graphite-300">• {skill}</div>
                                ))}
                            </div>
                        </Card>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-graphite-100 mb-4">Philosophy</h2>
                            <p className="text-graphite-300">
                                I believe in clean code, clear communication, and continuous learning. Every project is an opportunity to push boundaries and deliver exceptional results.
                            </p>
                        </Card>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};
