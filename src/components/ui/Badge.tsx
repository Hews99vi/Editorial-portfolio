import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'accent';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
    const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';

    const variants = {
        default: 'bg-dark-600 text-graphite-300 border border-graphite-700',
        accent: 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20',
    };

    return (
        <span className={cn(baseStyles, variants[variant], className)}>
            {children}
        </span>
    );
};
