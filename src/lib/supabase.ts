import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Diagnostic logging (runs once at startup)
if (typeof window !== 'undefined') {
    console.group('🔧 Supabase Configuration');
    console.log('URL:', supabaseUrl || '❌ MISSING');
    console.log('Anon Key:', supabaseAnonKey ? `✅ ${supabaseAnonKey.substring(0, 20)}...` : '❌ MISSING');
    console.groupEnd();
}

// Fail-fast validation
if (!supabaseUrl || !supabaseAnonKey) {
    const missing = [];
    if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
    if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');

    throw new Error(
        `❌ Supabase configuration error!\n\n` +
        `Missing environment variables: ${missing.join(', ')}\n\n` +
        `Please check your .env file and ensure:\n` +
        `1. VITE_SUPABASE_URL=https://your-project.supabase.co\n` +
        `2. VITE_SUPABASE_ANON_KEY=eyJ... (long JWT token)\n\n` +
        `Then restart your dev server.`
    );
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    throw new Error(
        `❌ Invalid Supabase URL format!\n\n` +
        `Expected: https://<project-ref>.supabase.co\n` +
        `Got: ${supabaseUrl}\n\n` +
        `Please check your .env file.`
    );
}

// Validate anon key format (should be JWT starting with eyJ)
if (!supabaseAnonKey.startsWith('eyJ')) {
    console.warn(
        '⚠️ Anon key format warning!\n\n' +
        'Supabase anon keys typically start with "eyJ" (JWT format).\n' +
        'If you see auth errors, verify this is your PUBLIC/ANON key, not a secret key.\n' +
        'Find it in: Supabase Dashboard → Settings → API'
    );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// Helper to check if user is authenticated
export const isAuthenticated = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
};

// Helper to get current user
export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};
