import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiService } from './api';
import * as authState from '$lib/state/auth.svelte';
import type { LiftResponse } from '$lib/schemas';

const mockZodiosClient = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
}));

vi.mock('$lib/schemas/openapi', () => ({
    createApiClient: vi.fn(() => mockZodiosClient)
}));

vi.mock('$lib/state/auth.svelte', () => ({
    getAuthToken: vi.fn()
}));

const validLift: LiftResponse = {
    id: "uuid-1234",
    user_id: "uuid-4567",
    created_at: new Date().toISOString(),
    bodyweight: 80,
    gender: "male",
    equipment: "raw",
    squat: 100,
    bench: 100,
    deadlift: 100,
    total: 300,
    wilks: 204.6,
    dots: 205.1,
    ipf_gl: 41.2,
    reshel: 300.5
};

describe('ApiService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('bypasses history sync completely if logged out', async () => {
        vi.mocked(authState.getAuthToken).mockReturnValue(undefined);
        const history = await ApiService.getHistory();
        expect(history.length).toBe(0);
        expect(mockZodiosClient.get).not.toHaveBeenCalled();
    });

    it('injects Bearer token and triggers get if authenticated', async () => {
        vi.mocked(authState.getAuthToken).mockReturnValue('fake-jwt-token');
        mockZodiosClient.get.mockResolvedValueOnce([validLift]);

        const history = await ApiService.getHistory();
        
        expect(history.length).toBe(1);
        expect(mockZodiosClient.get).toHaveBeenCalledWith(
            '/lifts/',
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': 'Bearer fake-jwt-token'
                })
            })
        );
    });

    it('aborts API call on timeout properly', async () => {
        vi.mocked(authState.getAuthToken).mockReturnValue(undefined);
        
        mockZodiosClient.post.mockRejectedValueOnce({ message: 'timeout' });

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
        mockZodiosClient.delete.mockResolvedValueOnce({});

        const success = await ApiService.deleteHistoryRecord('888');
        expect(success).toBe(true);
        expect(mockZodiosClient.delete).toHaveBeenCalledWith(
            '/lifts/:lift_id',
            undefined,
            expect.objectContaining({
                params: { lift_id: '888' }
            })
        );
    });

    it('clears all history safely', async () => {
        vi.mocked(authState.getAuthToken).mockReturnValue('fake');
        mockZodiosClient.delete.mockResolvedValueOnce({});

        const success = await ApiService.clearHistory();
        expect(success).toBe(true);
        expect(mockZodiosClient.delete).toHaveBeenCalledWith(
            '/lifts/',
            undefined,
            expect.any(Object)
        );
    });

    it('syncs local lifts upward correctly', async () => {
        vi.mocked(authState.getAuthToken).mockReturnValue('fake');
        mockZodiosClient.post.mockResolvedValueOnce([validLift]);

        const res = await ApiService.syncLocalLifts([validLift]);
        expect(res[0].id).toBe('uuid-1234');
        expect(mockZodiosClient.post).toHaveBeenCalledWith(
            '/lifts/sync',
            [validLift],
            expect.objectContaining({
                headers: { 'Authorization': 'Bearer fake' }
            })
        );
    });
});
