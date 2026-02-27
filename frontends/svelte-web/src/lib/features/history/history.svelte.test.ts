// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { tick } from 'svelte';
import { HistoryState } from './history.svelte';
import { ApiService } from '$lib/core/services/api';

// Simple mock user variable
let mockUser: any = null;
let activeState: HistoryState | null = null;

vi.mock('$lib/features/auth/auth.svelte', () => ({
    getAuth: () => ({
        get user() { return mockUser; }
    })
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
        mockUser = null;
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.mocked(ApiService.getHistory).mockResolvedValue([]);
    });

    afterEach(() => {
        if (activeState) {
            activeState.destroy();
            activeState = null;
        }
    });

    function createState() {
        activeState = new HistoryState();
        return activeState;
    }

    it('initializes empty', () => {
        const state = createState();
        expect(state.history).toEqual([]);
    });

    it('loads local history', () => {
        localStorage.setItem('anonymous_lifts_history', JSON.stringify([{ id: 'l1' }]));
        const state = createState();
        expect(state.history.length).toBe(1);
    });

    it('handles malformed storage JSON', () => {
        localStorage.setItem('anonymous_lifts_history', '!!!');
        const state = createState();
        expect(state.history).toEqual([]);
        expect(console.error).toHaveBeenCalled();
    });

    it('loads cloud history on init', async () => {
        mockUser = { id: 'u1' };
        vi.mocked(ApiService.getHistory).mockResolvedValue([{ id: 'c1' }] as any);
        const state = createState();
        await vi.waitFor(() => expect(state.history.length).toBe(1));
    });

    it('handles offline/online window events and sync rejection', async () => {
        const state = createState();
        expect(state.isOnline).toBe(true);
        
        window.dispatchEvent(new Event('offline'));
        await tick();
        expect(state.isOnline).toBe(false);

        await state.confirmSync();
        expect(state.error).toContain('offline');

        window.dispatchEvent(new Event('online'));
        await tick();
        expect(state.isOnline).toBe(true);
    });

    it('syncs successfully', async () => {
        localStorage.setItem('anonymous_lifts_history', JSON.stringify([{ id: 'l1' }]));
        mockUser = { id: 'u1' };
        vi.mocked(ApiService.syncLocalLifts).mockResolvedValue([] as any);
        const state = createState();
        await state.confirmSync();
        expect(localStorage.getItem('anonymous_lifts_history')).toBeNull();
    });

    it('handles sync failures', async () => {
        localStorage.setItem('anonymous_lifts_history', JSON.stringify([{ id: 'l1' }]));
        mockUser = { id: 'u1' };
        vi.mocked(ApiService.syncLocalLifts).mockRejectedValue(new Error('fail'));
        const state = createState();
        await state.confirmSync();
        expect(String(state.error)).toContain('fail');
    });

    it('adds/deletes locally', () => {
        const state = createState();
        state.addRecordToHistory({ id: '1' } as any);
        expect(state.history.length).toBe(1);
        state.deleteHistoryRecord('1');
        expect(state.history.length).toBe(0);
    });

    it('adds/deletes remotely', async () => {
        mockUser = { id: 'u1' };
        vi.mocked(ApiService.getHistory).mockResolvedValue([{ id: 'c1' }] as any);
        vi.mocked(ApiService.deleteHistoryRecord).mockResolvedValue(true);
        const state = createState();
        await vi.waitFor(() => expect(state.history.length).toBe(1));
        
        await state.deleteHistoryRecord('c1');
        expect(state.history.length).toBe(0);
    });

    it('handles remote delete failure', async () => {
        mockUser = { id: 'u1' };
        vi.mocked(ApiService.getHistory).mockResolvedValue([{ id: 'c1' }] as any);
        vi.mocked(ApiService.deleteHistoryRecord).mockResolvedValue(false);
        const state = createState();
        await vi.waitFor(() => expect(state.history.length).toBe(1));
        
        await state.deleteHistoryRecord('c1');
        expect(String(state.error)).toBe('Failed to remote delete');
        expect(state.history.length).toBe(1);
    });

    it('clears history locally and remotely', async () => {
        const state = createState();
        state.addRecordToHistory({ id: '1' } as any);
        state.clearHistory();
        expect(state.history.length).toBe(0);

        mockUser = { id: 'u1' };
        vi.mocked(ApiService.clearHistory).mockResolvedValue(true);
        const stateCloud = createState();
        (stateCloud as any)._cloudHistory = [{ id: 'c1' }];
        await stateCloud.clearHistory();
        expect(stateCloud.history.length).toBe(0);
    });

    it('handles remote clear failure', async () => {
        mockUser = { id: 'u1' };
        vi.mocked(ApiService.clearHistory).mockResolvedValue(false);
        const state = createState();
        await state.clearHistory();
        expect(state.error).toBe('Failed to clear remotely');
    });

    it('reacts to auth changes via effects', async () => {
        const state = createState();
        
        // 1. Log in
        mockUser = { id: 'u1' };
        await tick();
        await vi.waitFor(() => expect(ApiService.getHistory).toHaveBeenCalled());

        // 2. Log out
        mockUser = null;
        await tick();
        expect(state.history).toEqual([]);
    });

    it('shows sync prompt correctly', () => {
        localStorage.setItem('anonymous_lifts_history', JSON.stringify([{ id: 'l1' }]));
        mockUser = { id: 'u1' };
        const state = createState();
        expect(state.showSyncPrompt).toBe(true);
    });

    it('accurate localHistoryCount and duplicate prevention', () => {
        const state = createState();
        state.addRecordToHistory({ id: '1' } as any);
        state.addRecordToHistory({ id: '1' } as any);
        expect(state.localHistoryCount).toBe(1);
    });

    it('handles null ID in delete', () => {
        const state = createState();
        state.deleteHistoryRecord(null);
        expect(ApiService.deleteHistoryRecord).not.toHaveBeenCalled();
    });
});
