import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalculatorState } from './calculator.svelte';
import { ApiService } from '$lib/services/api';

// 1) Mock the external services
vi.mock('$lib/services/api', () => ({
    ApiService: {
        getHistory: vi.fn().mockResolvedValue([]),
        calculateScores: vi.fn(),
        syncLocalLifts: vi.fn().mockResolvedValue(true)
    }
}));

// Mock the Auth State to simulate being logged OUT by default
vi.mock('$lib/state/auth.svelte', () => ({
    getAuth: () => ({ user: null })
}));

describe('CalculatorState (Svelte 5 Runes)', () => {
    let state: CalculatorState;

    beforeEach(() => {
        // Reset local storage
        localStorage.clear();
        vi.clearAllMocks();
        
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
});
