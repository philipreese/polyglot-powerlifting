import { createClient } from '@supabase/supabase-js';

// Standardized environment variables shared with the backend
// Using import.meta.env as it is already configured with envPrefix in vite.config.ts
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_KEY;

// Resilient initialization: Don't crash the entire app if env vars are missing at build time
export const supabase = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing. Some features will be disabled.');
    return null as any; 
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null as any;
  }
})();
