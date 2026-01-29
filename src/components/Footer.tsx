import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-graphite-800/50 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold text-gradient mb-4">Portfolio</h3>
                        <p className="text-graphite-400 text-sm">
                            Premium tech editorial portfolio showcasing exceptional work.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-graphite-200 mb-4">Quick Links</h4>
                        <div className="flex flex-col gap-2">
                            <Link to="/projects" className="text-graphite-400 hover:text-accent-blue text-sm transition-colors">
                                Projects
                            </Link>
                            <Link to="/services" className="text-graphite-400 hover:text-accent-blue text-sm transition-colors">
                                Services
                            </Link>
                            <Link to="/about" className="text-graphite-400 hover:text-accent-blue text-sm transition-colors">
                                About
                            </Link>
                            <Link to="/contact" className="text-graphite-400 hover:text-accent-blue text-sm transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-sm font-semibold text-graphite-200 mb-4">Connect</h4>
                        <div className="flex gap-4">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-graphite-400 hover:text-accent-blue transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-graphite-400 hover:text-accent-blue transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-graphite-400 hover:text-accent-blue transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="mailto:hello@example.com" className="text-graphite-400 hover:text-accent-blue transition-colors">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-graphite-800/50 text-center text-sm text-graphite-500">
                    © {currentYear} Premium Portfolio. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
