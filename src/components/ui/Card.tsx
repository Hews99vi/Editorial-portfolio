import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = false, children, ...props }, ref) => {
        const baseStyles = 'bg-dark-700/40 backdrop-blur-md border border-graphite-800/50 rounded-xl';
        const hoverStyles = hover
            ? 'transition-all duration-300 hover:bg-dark-700/60 hover:border-graphite-700/70 hover:shadow-xl hover:shadow-black/20'
            : '';

        return (
            <div
                ref={ref}
                className={cn(baseStyles, hoverStyles, className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
