import { setContext, getContext } from 'svelte';
import { getAuth } from '$lib/features/auth/auth.svelte';
import type { LiftResponse } from '$lib/core/schemas';
import { ApiService } from '$lib/core/services/api';

export class HistoryState {
    private _localHistory = $state<LiftResponse[]>([]);
    private _cloudHistory = $state<LiftResponse[]>([]);
    
    isOnline = $state(true);
    isSyncing = $state(false);
    error = $state<string | null>(null);
    private _cleanup: (() => void) | null = null;
    private _lastLoadedUserId: string | null = null;
    isLoading = $state(false);

    // Derived: Only show sync prompt if logged in AND we have local data
    showSyncPrompt = $derived(getAuth().user != null && this._localHistory.length > 0);

    constructor() {
        if (typeof window !== 'undefined') {
            this.isOnline = window.navigator.onLine;
            window.addEventListener('online', () => (this.isOnline = true));
            window.addEventListener('offline', () => (this.isOnline = false));

            this._loadInitialData();
            
            
            // React to auth changes
            this._cleanup = $effect.root(() => {
                $effect(() => {
                    const user = getAuth().user;
                    if (user) {
                        this._loadCloudHistory();
                    } else {
                        this.handleLogout();
                    }
                });
            });
        }
    }

    /**
     * Primary getter for the UI. 
     * If logged in: Shows ONLY cloud history.
     * If logged out: Shows ONLY local history.
     */
    get history() {
        return getAuth().user ? this._cloudHistory : this._localHistory;
    }

    /**
     * Accurate count of unique local unsynced items.
     */
    get localHistoryCount() {
        return this._localHistory.length;
    }

    private _loadInitialData() {
        this._loadLocalHistory();
    }

    private _loadLocalHistory() {
        const stored = localStorage.getItem('anonymous_lifts_history');
        if (stored) {
            try {
                this._localHistory = JSON.parse(stored);
            } catch (err) {
                console.error("Failed to parse local history", err);
                this._localHistory = [];
            }
        }
    }

    private async _loadCloudHistory() {
        const user = getAuth().user;
        if (!user || this.isLoading) return;
        
        // Stability guard: We only want to try loading ONCE per user-session 
        // to avoid infinite loops if the API fails or is empty.
        if (this._lastLoadedUserId === user.id) {
            return;
        }

        this.isLoading = true;
        try {
            this._cloudHistory = await ApiService.getHistory();
        } catch (err) {
            console.error("Failed to load cloud history:", err);
        } finally {
            this._lastLoadedUserId = user.id;
            this.isLoading = false;
        }
    }

    private handleLogout() {
        if (this._lastLoadedUserId === null && this._cloudHistory.length === 0) return;
        
        this._cloudHistory = [];
        this._lastLoadedUserId = null; // Reset so the next user can load
        this._loadLocalHistory(); // Restore local context
        this.isLoading = false;
        this.error = null;
    }

    async confirmSync() {
        if (!this.isOnline) {
            this.error = "Cannot sync while offline. Please check your connection.";
            return;
        }

        this.isSyncing = true;
        this.error = null;
        
        try {
            if (this._localHistory.length > 0) {
                await ApiService.syncLocalLifts(this._localHistory);
                // SUCCESS: Wipe local data
                this.clearLocalStorage();
            }
        } catch (err: any) {
            this.error = "Sync Failed: " + (err.message || "Unknown Error");
        } finally {
            this.isSyncing = false;
            await this._loadCloudHistory();
        }
    }

    /**
     * Wipes local storage/state without syncing to server.
     */
    clearLocalStorage() {
        this._localHistory = [];
        localStorage.removeItem('anonymous_lifts_history');
    }

    addRecordToHistory(record: LiftResponse) {
        const user = getAuth().user;

        // Logged In: Add to cloud list directly (optimistic UI)
        if (user) {
            if (!this._cloudHistory.some(r => r.id === record.id)) {
                this._cloudHistory = [record, ...this._cloudHistory];
            }
        } else {
            // Anonymous: Add to local list and save
            if (!this._localHistory.some(r => r.id === record.id)) {
                this._localHistory = [record, ...this._localHistory];
                localStorage.setItem('anonymous_lifts_history', JSON.stringify(this._localHistory));
            }
        }
    }

    async deleteHistoryRecord(id: string | null | undefined) {
        if (!id) return;

        if (getAuth().user) {
            const success = await ApiService.deleteHistoryRecord(id);
            if (success) {
                this._cloudHistory = this._cloudHistory.filter(r => r.id !== id);
            } else {
                this.error = "Failed to remote delete";
            }
        } else {
            this._localHistory = this._localHistory.filter(r => r.id !== id);
            localStorage.setItem('anonymous_lifts_history', JSON.stringify(this._localHistory));
        }
    }

    async clearHistory() {
        if (getAuth().user) {
            const success = await ApiService.clearHistory();
            if (success) {
                this._cloudHistory = [];
            } else {
                this.error = "Failed to clear remotely";
            }
        } else {
            this.clearLocalStorage();
        }
    }

    destroy() {
        if (this._cleanup) {
            this._cleanup();
            this._cleanup = null;
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
