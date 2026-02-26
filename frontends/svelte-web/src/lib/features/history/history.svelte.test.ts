import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HistoryState } from './index';
import { ApiService } from '$lib/core/services/api';
import { getAuth } from '$lib/features/auth/auth.svelte';

vi.mock('$lib/features/auth/auth.svelte', () => ({
    getAuth: vi.fn(() => ({ user: null }))
}));

vi.mock('$lib/core/services/api', () => ({
    ApiService: {
        getHistory: vi.fn(() => Promise.resolve([])),
        syncLocalLifts: vi.fn(() => Promise.resolve([])),
        deleteHistoryRecord: vi.fn(() => Promise.resolve(true)),
        clearHistory: vi.fn(() => Promise.resolve(true))
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
        // Manually trigger handleLogin
        await (state as any).handleLogin();
        
        expect(state.showSyncPrompt).toBe(true);
    });

    it('prevents sync and shows error when offline', async () => {
        const state = new HistoryState();
        state.isOnline = false;
        state.showSyncPrompt = true;

        await state.confirmSync();

        expect(state.error).toContain('offline');
        expect(ApiService.syncLocalLifts).not.toHaveBeenCalled();
        expect(state.isSyncing).toBe(false);
    });

    it('retains local data and keeps prompt open on sync failure', async () => {
        const localData = [{ id: 'local' }];
        localStorage.setItem('anonymous_lifts_history', JSON.stringify(localData));
        vi.mocked(getAuth).mockReturnValue({ user: { id: 'u1' } } as any);
        vi.mocked(ApiService.syncLocalLifts).mockRejectedValueOnce(new Error('API Down'));

        const state = new HistoryState();
        state.isOnline = true;
        await state.confirmSync();

        expect(state.error).toBe('Sync Failed: API Down');
        expect(localStorage.getItem('anonymous_lifts_history')).not.toBeNull();
        expect(state.showSyncPrompt).toBe(true);
    });

    it('confirms sync, clears storage, and closes prompt on success', async () => {
        const localData = [{ id: 'local' }];
        localStorage.setItem('anonymous_lifts_history', JSON.stringify(localData));
        vi.mocked(getAuth).mockReturnValue({ user: { id: 'user1' } } as any);
        vi.mocked(ApiService.getHistory).mockResolvedValue([]);

        const state = new HistoryState();
        state.isOnline = true;
        await state.confirmSync();

        expect(ApiService.syncLocalLifts).toHaveBeenCalledWith(localData);
        expect(localStorage.getItem('anonymous_lifts_history')).toBeNull();
        expect(state.showSyncPrompt).toBe(false);
        expect(state.error).toBeNull();
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
