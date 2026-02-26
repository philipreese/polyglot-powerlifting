import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalculatorFormState } from './form.svelte';
import { ApiService } from '$lib/core/services/api';

// Simple mock for HistoryState
const mockHistoryState = {
    addRecordToHistory: vi.fn()
} as any;

vi.mock('$lib/core/services/api', () => ({
    ApiService: {
        calculateScores: vi.fn()
    }
}));

describe('CalculatorFormState', () => {
    let state: CalculatorFormState;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        state = new CalculatorFormState(mockHistoryState);
    });

    it('initializes with default values', () => {
        expect(state.bodyweight).toBe(80);
        expect(state.squat).toBe(0);
        expect(state.total).toBe(0);
        expect(state.isLoading).toBe(false);
    });

    it('loads preferred metric from localStorage on init', () => {
        localStorage.setItem('preferred_metric', 'wilks');
        const newState = new CalculatorFormState(mockHistoryState);
        expect(newState.preferredMetric).toBe('wilks');
    });

    it('updates derived total correctly', () => {
        state.squat = 100;
        state.bench = 50;
        state.deadlift = 150;
        expect(state.total).toBe(300);
    });

    it('sets preferred metric and persists to localStorage', () => {
        state.setPreferredMetric('reshel');
        expect(state.preferredMetric).toBe('reshel');
        expect(localStorage.getItem('preferred_metric')).toBe('reshel');
    });

    it('sets error on validation failure', async () => {
        state.bodyweight = -10; // Invalid weight
        await state.calculate();
        expect(state.error).toBeDefined();
        expect(state.isLoading).toBe(false);
        expect(ApiService.calculateScores).not.toHaveBeenCalled();
    });

    it('updates scores and adds to history on successful calculation', async () => {
        const mockResponse = {
            wilks: 100,
            dots: 110,
            ipf_gl: 120,
            reshel: 130
        };
        vi.mocked(ApiService.calculateScores).mockResolvedValueOnce(mockResponse as any);

        state.bodyweight = 80;
        state.squat = 100;
        state.bench = 100;
        state.deadlift = 100;

        await state.calculate();

        expect(state.isLoading).toBe(false);
        expect(state.wilks).toBe(100);
        expect(state.dots).toBe(110);
        expect(mockHistoryState.addRecordToHistory).toHaveBeenCalledWith(mockResponse);
    });

    it('handles API errors gracefully', async () => {
        vi.mocked(ApiService.calculateScores).mockRejectedValueOnce(new Error('Network Error'));

        state.bodyweight = 80;
        state.squat = 100;

        await state.calculate();

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Network Error');
    });
});
