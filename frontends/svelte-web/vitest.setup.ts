import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/svelte';

// Mock Supabase globally to prevent import.meta.env errors in tests
vi.mock('$lib/core/services/supabase', () => ({
    supabase: {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            getUser: () => Promise.resolve({ data: { user: null }, error: null })
        }
    }
}));

// Ensure Svelte component wrappers are wiped from the document body after every individual `it()` block
afterEach(() => {
    cleanup();
});
