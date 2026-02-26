import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HistoryState } from './index';
import { ApiService } from '$lib/core/services/api';
import { getAuth } from '$lib/features/auth/auth.svelte';

vi.mock('$lib/features/auth/auth.svelte', () => ({
    getAuth: vi.fn(() => ({ user: null }))
}));

vi.mock('$lib/core/services/api', () => ({
    ApiService: {
        getHistory: vi.fn(),
        syncLocalLifts: vi.fn(),
        deleteHistoryRecord: vi.fn(),
        clearHistory: vi.fn()
    }
}));

describe('HistoryState', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('initializes with empty history when anonymous and no storage', () => {
        const state = new HistoryState();
        expect(state.history).toEqual([]);
    });

    it('loads anonymous history from localStorage', () => {
        const mockData = [{ id: '1', total: 300 }];
        localStorage.setItem('anonymous_lifts_history', JSON.stringify(mockData));
        
        const state = new HistoryState();
        expect(state.history).toEqual(mockData);
    });

    it('adds record to history and persists if anonymous', () => {
        const state = new HistoryState();
        const record = { id: '2', total: 400 } as any;
        
        state.addRecordToHistory(record);
        
        expect(state.history[0]).toEqual(record);
        expect(localStorage.getItem('anonymous_lifts_history')).toContain('400');
    });

    it('detects sync prompt when logging in with local data', async () => {
        localStorage.setItem('anonymous_lifts_history', JSON.stringify([{ id: '1' }]));
        
        const state = new HistoryState();
        // Manually trigger handleLogin as effects don't run automatically in unit tests easily without more setup
        await (state as any).handleLogin();
        
        expect(state.showSyncPrompt).toBe(true);
    });

    it('confirms sync and clears local storage', async () => {
        const localData = [{ id: 'local' }];
        localStorage.setItem('anonymous_lifts_history', JSON.stringify(localData));
        vi.mocked(getAuth).mockReturnValue({ user: { id: 'user1' } } as any);
        vi.mocked(ApiService.getHistory).mockResolvedValue([]);

        const state = new HistoryState();
        await state.confirmSync();

        expect(ApiService.syncLocalLifts).toHaveBeenCalledWith(localData);
        expect(localStorage.getItem('anonymous_lifts_history')).toBeNull();
        expect(state.showSyncPrompt).toBe(false);
    });

    it('dismisses sync and clears local storage', () => {
        localStorage.setItem('anonymous_lifts_history', JSON.stringify([{ id: 'local' }]));
        const state = new HistoryState();
        state.showSyncPrompt = true;

        state.dismissSync();

        expect(state.showSyncPrompt).toBe(false);
        expect(localStorage.getItem('anonymous_lifts_history')).toBeNull();
    });

    it('deletes record: calls API if authenticated', async () => {
        vi.mocked(getAuth).mockReturnValue({ user: { id: 'u1' } } as any);
        vi.mocked(ApiService.deleteHistoryRecord).mockResolvedValue(true);
        
        const state = new HistoryState();
        state.history = [{ id: 'delete-me' }] as any;

        await state.deleteHistoryRecord('delete-me');

        expect(ApiService.deleteHistoryRecord).toHaveBeenCalledWith('delete-me');
        expect(state.history.length).toBe(0);
    });

    it('clears history: calls API if authenticated', async () => {
        vi.mocked(getAuth).mockReturnValue({ user: { id: 'u1' } } as any);
        vi.mocked(ApiService.clearHistory).mockResolvedValue(true);

        const state = new HistoryState();
        state.history = [{ id: '1' }, { id: '2' }] as any;

        await state.clearHistory();

        expect(ApiService.clearHistory).toHaveBeenCalled();
        expect(state.history.length).toBe(0);
    });
});
