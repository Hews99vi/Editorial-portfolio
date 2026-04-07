import React from 'react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-sm text-graphite-500">
                © {currentYear} Premium Portfolio. Built with terminal aesthetics.
            </div>
        </footer>
    );
};
