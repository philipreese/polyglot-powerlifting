import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalculatorState } from './calculator.svelte';
import { ApiService } from '$lib/services/api';

// 1) Mock the external services
vi.mock('$lib/services/api', () => ({
    ApiService: {
        getHistory: vi.fn().mockResolvedValue([]),
        calculateScores: vi.fn(),
        syncLocalLifts: vi.fn().mockResolvedValue(true),
        deleteHistoryRecord: vi.fn(),
        clearHistory: vi.fn()
    }
}));

// Mock the Auth State to simulate being logged OUT by default, but allow overrides
let mockUser: any = null;
vi.mock('$lib/state/auth.svelte', () => ({
    getAuth: () => ({ get user() { return mockUser; } })
}));

describe('CalculatorState (Svelte 5 Runes)', () => {
    let state: CalculatorState;

    beforeEach(() => {
        // Reset local storage
        localStorage.clear();
        vi.clearAllMocks();
        mockUser = null;
        
        state = new CalculatorState();
    });

    it('initializes with default zeroed values', () => {
        expect(state.bodyweight).toBe(80.0);
        expect(state.squat).toBe(0.0);
        expect(state.bench).toBe(0.0);
        expect(state.deadlift).toBe(0.0);
        expect(state.total).toBe(0.0); // Computed GETTER
        state.squat = 100;
        state.bench = 100;
        expect(state.total).toBe(200); // Proves Svelte runes reactivity graph updates
    });

    it('sets preferred metric and persists to localStorage', () => {
        state.setPreferredMetric('wilks');
        expect(state.preferredMetric).toBe('wilks');
        expect(localStorage.getItem('preferred_metric')).toBe('wilks');
    });

    it('fails calculation gracefully on invalid Zod input', async () => {
        state.bodyweight = -10; // Invalid according to Zod schema
        await state.calculate();
        
        expect(state.error).toContain('Too small: expected number to be >20');
        expect(ApiService.calculateScores).not.toHaveBeenCalled();
    });

    it('calls exact API correctly on valid calculate', async () => {
        const mockResponse = {
            id: '123',
            wilks: 400.5,
            dots: 410.2,
            ipf_gl: 80.3,
            reshel: 100.1,
            bodyweight: 80,
            gender: 'male',
            equipment: 'raw',
            squat: 200,
            bench: 150,
            deadlift: 250,
            total: 600,
            created_at: new Date().toISOString(),
            user_id: null
        };
        
        // Setup the mock resolve
        (ApiService.calculateScores as any).mockResolvedValueOnce(mockResponse);

        // Stage the inputs
        state.bodyweight = 80;
        state.squat = 200;
        state.bench = 150;
        state.deadlift = 250;

        await state.calculate();

        // 1. Verify ApiService was called precisely with the DTO mapping
        expect(ApiService.calculateScores).toHaveBeenCalledWith({
            bodyweight: 80,
            gender: 'male',
            equipment: 'raw',
            squat: 200,
            bench: 150,
            deadlift: 250
        });

        // 2. Verify State was bound to response
        expect(state.wilks).toBe(400.5);
        expect(state.dots).toBe(410.2);

        // 3. Verify Offline Persistence since mock user is Null
        expect(state.history.length).toBe(1);
        const stored = JSON.parse(localStorage.getItem('anonymous_lifts_history') || '[]');
        expect(stored.length).toBe(1);
        expect(stored[0].wilks).toBe(400.5);
    });

    it('deletes history record from local storage if anonymous', async () => {
        state.history = [{ id: '999', wilks: 123 } as any];
        await state.deleteHistoryRecord('999');
        
        expect(state.history.length).toBe(0);
        // Ensure remote wasn't called
        expect(ApiService.deleteHistoryRecord).not.toHaveBeenCalled();
    });

    it('deletes history record remotely if authenticated', async () => {
        mockUser = { id: 'uuid-123' };
        state.history = [{ id: '999', wilks: 123 } as any];
        (ApiService.deleteHistoryRecord as any).mockResolvedValueOnce(true);

        await state.deleteHistoryRecord('999');
        
        expect(ApiService.deleteHistoryRecord).toHaveBeenCalledWith('999');
        expect(state.history.length).toBe(0);
    });

    it('clears all history remotely if authenticated', async () => {
        mockUser = { id: 'uuid-123' };
        state.history = [{ id: '999' } as any];
        (ApiService.clearHistory as any).mockResolvedValueOnce(true);

        await state.clearHistory();
        
        expect(ApiService.clearHistory).toHaveBeenCalled();
        expect(state.history.length).toBe(0);
    });

    it('confirms sync pushes local storage to cloud and clears memory buffer', async () => {
        mockUser = { id: 'uuid-123' };
        const mockHistory = [{ id: 'offline-record' }];
        localStorage.setItem('anonymous_lifts_history', JSON.stringify(mockHistory));
        
        await state.confirmSync();

        expect(ApiService.syncLocalLifts).toHaveBeenCalledWith(mockHistory);
        expect(localStorage.getItem('anonymous_lifts_history')).toBeNull();
        expect(state.isSyncing).toBe(false);
        expect(state.showSyncPrompt).toBe(false);
    });

    it('dismiss sync wipes local storage buffer early', () => {
        localStorage.setItem('anonymous_lifts_history', JSON.stringify([{ id: 'a' }]));
        state.dismissSync();
        expect(localStorage.getItem('anonymous_lifts_history')).toBeNull();
        expect(state.showSyncPrompt).toBe(false);
    });
});
