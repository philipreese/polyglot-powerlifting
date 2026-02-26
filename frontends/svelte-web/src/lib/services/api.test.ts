import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiService } from './api';
import * as authState from '$lib/state/auth.svelte';

const mockFetch = vi.fn();
// Register fetch into Node/Vitest global
global.fetch = mockFetch as any;

vi.mock('$lib/state/auth.svelte', () => ({
    getAuthToken: vi.fn()
}));

describe('ApiService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFetch.mockReset();
    });

    it('bypasses history sync completely if logged out', async () => {
        vi.mocked(authState.getAuthToken).mockReturnValue(undefined);
        const history = await ApiService.getHistory();
        expect(history.length).toBe(0);
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('injects Bearer token and triggers fetch if authenticated', async () => {
        vi.mocked(authState.getAuthToken).mockReturnValue('fake-jwt-token');
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [{ id: '123' }]
        });

        const history = await ApiService.getHistory();
        
        expect(history.length).toBe(1);
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/lifts'),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer fake-jwt-token'
                }
            }
        );
    });

    it('aborts API call on timeout properly', async () => {
        vi.mocked(authState.getAuthToken).mockReturnValue(undefined);
        
        mockFetch.mockRejectedValueOnce({ name: 'AbortError' });

        await expect(ApiService.calculateScores({
            bodyweight: 80,
            gender: 'male',
            equipment: 'raw',
            squat: 100,
            bench: 100,
            deadlift: 100
        })).rejects.toThrow('Connection timed out. Is the local FastAPI server running?');
    });

    it('deletes history records properly', async () => {
        vi.mocked(authState.getAuthToken).mockReturnValue('fake');
        mockFetch.mockResolvedValueOnce({ ok: true });

        const success = await ApiService.deleteHistoryRecord('888');
        expect(success).toBe(true);
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/lifts/888'),
            expect.objectContaining({ method: 'DELETE' })
        );
    });

    it('clears all history safely', async () => {
        vi.mocked(authState.getAuthToken).mockReturnValue('fake');
        mockFetch.mockResolvedValueOnce({ ok: true });

        const success = await ApiService.clearHistory();
        expect(success).toBe(true);
    });

    it('syncs local lifts upward correctly', async () => {
        vi.mocked(authState.getAuthToken).mockReturnValue('fake');
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [{ id: 'returned-id' }]
        });

        const res = await ApiService.syncLocalLifts([{ total: 500 } as any]);
        expect(res[0].id).toBe('returned-id');
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/lifts/sync'),
            expect.objectContaining({ body: JSON.stringify([{ total: 500 }]) })
        );
    });
});
