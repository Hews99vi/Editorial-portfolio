import { useEffect, useRef } from 'react';

interface AutosaveOptions<T> {
    key: string;
    data: T;
    enabled?: boolean;
    interval?: number; // ms, default 10000 (10 seconds)
}

export function useAutosave<T>({ key, data, enabled = true, interval = 10000 }: AutosaveOptions<T>) {
    const savedRef = useRef<string | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const timer = setInterval(() => {
            const serialized = JSON.stringify(data);

            // Only save if data has changed
            if (serialized !== savedRef.current) {
                localStorage.setItem(key, serialized);
                savedRef.current = serialized;
                console.log(`Autosaved ${key} at ${new Date().toLocaleTimeString()}`);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [key, data, enabled, interval]);

    const restore = (): T | null => {
        const saved = localStorage.getItem(key);
        if (!saved) return null;

        try {
            return JSON.parse(saved) as T;
        } catch {
            return null;
        }
    };

    const clear = () => {
        localStorage.removeItem(key);
        savedRef.current = null;
    };

    return { restore, clear };
}
