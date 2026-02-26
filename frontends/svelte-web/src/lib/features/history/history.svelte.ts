import { setContext, getContext } from 'svelte';
import { getAuth } from '$lib/features/auth/auth.svelte';
import type { LiftResponse } from '$lib/core/schemas';
import { ApiService } from '$lib/core/services/api';

export class HistoryState {
    history = $state<LiftResponse[]>([]);
    showSyncPrompt = $state(false);
    isOnline = $state(true);
    isSyncing = $state(false);
    error = $state<string | null>(null);

    constructor() {
        if (typeof window !== 'undefined') {
            this.isOnline = window.navigator.onLine;
            window.addEventListener('online', () => (this.isOnline = true));
            window.addEventListener('offline', () => (this.isOnline = false));

            this.loadHistory();
            $effect.root(() => {
                $effect(() => {
                    const user = getAuth().user;
                    if (user) {
                        this.handleLogin();
                    } else {
                        this.loadHistory();
                    }
                });
            });
        }
    }

    private loadHistory() {
        if (getAuth().user) {
            ApiService.getHistory().then(h => this.history = h).catch(console.error);
        } else {
            const stored = localStorage.getItem('anonymous_lifts_history');
            if (stored) {
                try {
                    this.history = JSON.parse(stored);
                } catch {
                    this.history = [];
                }
            } else {
                this.history = [];
            }
        }
    }

    private async handleLogin() {
        const stored = localStorage.getItem('anonymous_lifts_history');
        if (stored) {
            try {
                const local = JSON.parse(stored);
                if (local.length > 0) {
                    this.showSyncPrompt = true;
                    return;
                }
            } catch {}
        }
        this.loadHistory();
    }

    async confirmSync() {
        if (!this.isOnline) {
            this.error = "Cannot sync while offline. Please check your connection.";
            return;
        }

        this.isSyncing = true;
        this.error = null;
        
        try {
            const stored = localStorage.getItem('anonymous_lifts_history');
            if (stored) {
                const local = JSON.parse(stored);
                if (local.length > 0) {
                    await ApiService.syncLocalLifts(local);
                    // CRITICAL: Only clear local data AFTER server confirms success
                    localStorage.removeItem('anonymous_lifts_history');
                    this.showSyncPrompt = false;
                }
            }
        } catch (err: any) {
            // Keep the prompt open if it fails so users can retry
            this.error = "Sync Failed: " + (err.message || "Unknown Error");
        } finally {
            this.isSyncing = false;
            this.loadHistory();
        }
    }

    dismissSync() {
        this.showSyncPrompt = false;
        this.error = null;
        localStorage.removeItem('anonymous_lifts_history');
        this.loadHistory();
    }

    addRecordToHistory(record: LiftResponse) {
        // Defensive check against duplicates (prevents Svelte crash)
        if (record.id && this.history.some(r => r.id === record.id)) return;
        
        this.history = [record, ...this.history];
        this._persistStateLocallyIfAnonymous();
    }

    async deleteHistoryRecord(id: string | null | undefined) {
        if (!id) return;

        if (getAuth().user) {
            const success = await ApiService.deleteHistoryRecord(id);
            if (!success) {
                this.error = "Failed to remote delete";
                return;
            }
        }
        this.history = this.history.filter(record => record.id !== id);
        this._persistStateLocallyIfAnonymous();
    }

    async clearHistory() {
        if (getAuth().user) {
            const success = await ApiService.clearHistory();
            if (!success) {
                this.error = "Failed to clear remotely";
                return;
            }
        }
        this.history = [];
        this._persistStateLocallyIfAnonymous();
    }

    private _persistStateLocallyIfAnonymous() {
        if (typeof window !== 'undefined' && !getAuth().user) {
            localStorage.setItem('anonymous_lifts_history', JSON.stringify(this.history));
        }
    }
}

const HISTORY_KEY = Symbol('HISTORY_STATE');
export function initHistoryState() {
    const s = new HistoryState();
    setContext(HISTORY_KEY, s);
    return s;
}
export function getHistoryState() {
    return getContext<HistoryState>(HISTORY_KEY);
}
