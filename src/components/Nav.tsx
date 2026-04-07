import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Nav: React.FC = () => {
    const location = useLocation();

    const links = [
        { to: '/about', label: 'About Me' },
        { to: '/services', label: 'Experience' },
        { to: '/projects', label: 'Projects' },
        { to: '/#terminal', label: 'Terminal' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-6 sm:gap-8 px-5 sm:px-6 py-2 rounded-full bg-dark-800/60 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-md text-xs sm:text-sm">
                {links.map((link) => {
                    const active = isActive(link.to);
                    const baseClass = `font-medium transition-colors ${active ? 'text-white' : 'text-white/80 hover:text-white'}`;

                    if (link.to.startsWith('/#')) {
                        return (
                            <a key={link.to} href={link.to} className={baseClass}>
                                {link.label}
                            </a>
                        );
                    }

                    return (
                        <Link key={link.to} to={link.to} className={baseClass}>
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
