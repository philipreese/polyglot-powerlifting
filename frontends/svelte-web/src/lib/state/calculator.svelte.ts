import { setContext, getContext } from 'svelte';
import { getAuth } from '$lib/state/auth.svelte';
import { LiftSchema } from '$lib/schemas';
import type { LiftResponse } from '$lib/schemas';
import { ApiService } from '$lib/services/api';

export class CalculatorState {
    bodyweight = $state(80.0);
    squat = $state(0.0);
    bench = $state(0.0);
    deadlift = $state(0.0);
    gender = $state<'male' | 'female'>('male');
    equipment = $state<'raw' | 'single-ply' | 'multi-ply'>('raw');

    // API Result Fields
    wilks = $state<number | null>(null);
    dots = $state<number | null>(null);
    ipf_gl = $state<number | null>(null);
    reshel = $state<number | null>(null);

    // Network & Validation States
    isLoading = $state(false);
    error = $state<string | null>(null);

    // Persistence
    history = $state<LiftResponse[]>([]);
    preferredMetric = $state<'dots' | 'wilks' | 'ipf_gl' | 'reshel'>('dots');
    
    // Auth syncing capability
    showSyncPrompt = $state(false);
    isSyncing = $state(false);

    constructor() {
        if (typeof window !== 'undefined') {
            const storedMetric = localStorage.getItem('preferred_metric') as 'dots' | 'wilks' | 'ipf_gl' | 'reshel';
            if (storedMetric && ['dots', 'wilks', 'ipf_gl', 'reshel'].includes(storedMetric)) {
                this.preferredMetric = storedMetric;
            }

            // Immediately load offline history securely
            this.loadHistory();

            // Svelte 5 Effect that runs exactly when `getAuth().user` changes (login or logout)
            $effect.root(() => {
                $effect(() => {
                    const user = getAuth().user;
                    if (user) {
                        this.handleLogin();
                    } else {
                        // User logged out, revert to offline storage view
                        this.loadHistory();
                    }
                });
            });
        }
    }

    private loadHistory() {
        if (getAuth().user) {
            // Background fetch from cloud
            ApiService.getHistory().then(serverHistory => {
               this.history = serverHistory; 
            }).catch(console.error);
        } else {
            // Fetch from local browser storage
            const storedHistory = localStorage.getItem('anonymous_lifts_history');
            if (storedHistory) {
                try {
                    this.history = JSON.parse(storedHistory);
                } catch (e) {
                    console.error("Failed to parse local history");
                    this.history = [];
                }
            } else {
                this.history = [];
            }
        }
    }

    private async handleLogin() {
        // Did they just log in, and do they have anonymous history sitting in their browser?
        const storedHistory = localStorage.getItem('anonymous_lifts_history');
        if (storedHistory) {
            try {
                const localLifts = JSON.parse(storedHistory);
                if (localLifts.length > 0) {
                    // Activate UI prompt
                    this.showSyncPrompt = true;
                    // Intentionally don't load the cloud history YET until they dismiss the prompt,
                    // so we don't accidentally wipe what they are looking at in the array
                    return;
                }
            } catch (e) {
                console.error("Ignoring malformed local history");
            }
        }
        
        // No local history? Standard login procedure
        this.loadHistory();
    }

    async confirmSync() {
        this.isSyncing = true;
        try {
            const storedHistory = localStorage.getItem('anonymous_lifts_history');
            if (storedHistory) {
                const localLifts = JSON.parse(storedHistory);
                if (localLifts.length > 0) {
                    // 1. Bulk import to FastAPI
                    await ApiService.syncLocalLifts(localLifts);
                    
                    // 2. Clear local storage buffer
                    localStorage.removeItem('anonymous_lifts_history');
                }
            }
        } catch (err: any) {
            this.error = "Sync Failed: " + err.message;
        } finally {
            this.isSyncing = false;
            this.showSyncPrompt = false;
            this.loadHistory();
        }
    }

    dismissSync() {
        this.showSyncPrompt = false;
        // User explicitly denied sync. Go ahead and wipe it locally so we don't prompt again.
        localStorage.removeItem('anonymous_lifts_history');
        this.loadHistory();
    }

    setPreferredMetric(metric: 'dots' | 'wilks' | 'ipf_gl' | 'reshel') {
        this.preferredMetric = metric;
        if (typeof window !== 'undefined') {
            localStorage.setItem('preferred_metric', metric);
        }
    }

    // Derived values using native JS getters
    get total() {
        return this.squat + this.bench + this.deadlift;
    }

    async calculate() {
        this.error = null;
        
        const parsed = LiftSchema.safeParse({
            bodyweight: this.bodyweight,
            gender: this.gender,
            equipment: this.equipment,
            squat: this.squat,
            bench: this.bench,
            deadlift: this.deadlift
        });

        if (!parsed.success) {
            this.error = parsed.error.issues[0].message;
            return;
        }

        this.isLoading = true;
        try {
            const data = await ApiService.calculateScores(parsed.data);
            
            this.wilks = data.wilks;
            this.dots = data.dots;
            this.ipf_gl = data.ipf_gl;
            this.reshel = data.reshel;

            // Notice we do NOT manually assign a random UUID here.
            // If logged in, FastAPI assigns a UUID and returns the saved block.
            // If anonymous, FastAPI actually assigns a UUID and returns it anyway!
            
            this.history = [data, ...this.history];
            this._persistStateLocallyIfAnonymous();

        } catch (err: any) {
            this.error = err.message || "Failed to connect to API";
        } finally {
            this.isLoading = false;
        }
    }

    async deleteHistoryRecord(id: string) {
        if (getAuth().user) {
            const success = await ApiService.deleteHistoryRecord(id);
            if (!success) {
                this.error = "Failed to delete record remotely";
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
                this.error = "Failed to clear history remotely";
                return;
            }
        }
        
        this.history = [];
        this._persistStateLocallyIfAnonymous();
    }

    private _persistStateLocallyIfAnonymous() {
        // We strictly ONLY write to localStorage if logged OUT.
        // If logged IN, the cloud is the absolute source of truth.
        if (typeof window !== 'undefined' && !getAuth().user) {
            localStorage.setItem('anonymous_lifts_history', JSON.stringify(this.history));
        }
    }
}

// SVELTEKIT SSR SAFETY PATTERN:
// Instead of exporting a global `const state = new CalculatorState()` which would break
// and leak data between users on the server, we use Svelte's Context API.
const STATE_KEY = Symbol('CALCULATOR_STATE');

export function initCalculatorState() {
    const state = new CalculatorState();
    setContext(STATE_KEY, state);
    return state;
}

export function getCalculatorState() {
    return getContext<CalculatorState>(STATE_KEY);
}
