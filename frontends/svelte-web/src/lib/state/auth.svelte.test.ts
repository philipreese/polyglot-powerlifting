import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAuth, getAuthToken } from './auth.svelte';
import { supabase } from '$lib/services/supabase';

// Mock Supabase completely so we don't accidentally execute auth callbacks against live project ID
vi.mock('$lib/services/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
            onAuthStateChange: vi.fn()
        }
    }
}));

describe('Auth State (Runes)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('successfully initializes globally and awaits session injection', async () => {
        vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
            data: {
                session: { access_token: 'real-token', user: { id: 'test-uuid' } }
            },
            error: null
        } as any);

        const state = getAuth();
        
        // Execute the async init sequence manually to bridge Vitest -> Svelte 5 window gap
        await state.init();

        expect(state.isLoading).toBe(false);
        expect(state.user?.id).toBe('test-uuid');
        
        // Verify exported simple-getter functions
        expect(getAuthToken()).toBe('real-token');
    });

    it('attaches listener callback cleanly on bootup', async () => {
        vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
            data: { session: null },
            error: null
        } as any);

        const state = getAuth();
        await state.init();

        // Verify it attached our auth subscription daemon
        expect(supabase.auth.onAuthStateChange).toHaveBeenCalledOnce();
        
        // Let's actually fire the callback! It's the first argument of the first call.
        const callback = vi.mocked(supabase.auth.onAuthStateChange).mock.calls[0][0];

        // Simulate log in via the active callback
        callback('SIGNED_IN', { access_token: 'callback-token', user: { id: 'callback-user' } } as any);

        // Verify the reactive graph absorbed it
        expect(state.user?.id).toBe('callback-user');
        expect(getAuthToken()).toBe('callback-token');
    });
});
