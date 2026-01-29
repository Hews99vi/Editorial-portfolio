import { useCallback } from 'react';
import { useBeforeUnload } from 'react-router-dom';

export function useUnsavedChanges(isDirty: boolean, message: string = 'You have unsaved changes. Are you sure you want to leave?') {
    // Browser alert on page close/refresh
    useBeforeUnload(
        useCallback((event) => {
            if (isDirty) {
                event.preventDefault();
                return message;
            }
        }, [isDirty, message])
    );

    // Optional: You can also block React Router navigation
    // This requires additional setup with useBlocker from react-router-dom v6.4+
}
