import React from 'react';
import { Card } from '@/components/ui/Card';
import { FadeIn } from '@/components/motion/FadeIn';

export const About: React.FC = () => {
    return (
        <div className="min-h-screen py-12 sm:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-5xl font-semibold text-white mb-4">About Me</h1>
                        <p className="text-base sm:text-lg text-graphite-400 max-w-2xl mx-auto">
                            Building exceptional digital experiences with modern technology and a systems-first mindset.
                        </p>
                    </div>
                </FadeIn>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FadeIn delay={0.1}>
                        <Card className="p-8 border-white/10 bg-white/5">
                            <h2 className="text-xl font-semibold text-white mb-4">My Story</h2>
                            <p className="text-sm text-graphite-300 mb-4">
                                I'm a passionate developer and designer dedicated to creating beautiful, functional, and performant digital products.
                            </p>
                            <p className="text-sm text-graphite-300">
                                With expertise spanning full-stack development, UI/UX design, and cloud infrastructure, I bring a holistic approach to every project.
                            </p>
                        </Card>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <Card className="p-8 border-white/10 bg-white/5">
                            <h2 className="text-xl font-semibold text-white mb-4">Skills & Technologies</h2>
                            <div className="flex flex-wrap gap-3 text-xs font-mono text-emerald-400">
                                {['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Tailwind CSS', 'PostgreSQL', 'AWS', 'Docker'].map(skill => (
                                    <span key={skill}>{skill}</span>
                                ))}
                            </div>
                        </Card>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <Card className="p-8 border-white/10 bg-white/5 md:col-span-2">
                            <h2 className="text-xl font-semibold text-white mb-4">Philosophy</h2>
                            <p className="text-sm text-graphite-300">
                                I believe in clean code, clear communication, and continuous learning. Every project is an opportunity to push boundaries and deliver exceptional results.
                            </p>
                        </Card>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};
