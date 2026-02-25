import { setContext, getContext } from 'svelte';
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

    constructor() {
        if (typeof window !== 'undefined') {
            const storedHistory = localStorage.getItem('anonymous_lifts_history');
            if (storedHistory) {
                try {
                    this.history = JSON.parse(storedHistory);
                } catch (e) {
                    console.error("Failed to parse local history");
                }
            }

            const storedMetric = localStorage.getItem('preferred_metric') as 'dots' | 'wilks' | 'ipf_gl' | 'reshel';
            if (storedMetric && ['dots', 'wilks', 'ipf_gl', 'reshel'].includes(storedMetric)) {
                this.preferredMetric = storedMetric;
            }
        }
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
        
        // 1. Frontend Zod Validation
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

        // 2. Fetch from FastAPI Backend
        this.isLoading = true;
        try {
            const data = await ApiService.calculateScores(parsed.data);
            
            // 3. Update reactive state with results!
            this.wilks = data.wilks;
            this.dots = data.dots;
            this.ipf_gl = data.ipf_gl;
            this.reshel = data.reshel;

            // 4. Save to anonymous local history
            const newRecord: LiftResponse = {
                ...data,
                id: crypto.randomUUID(),
                created_at: new Date().toISOString()
            };
            
            this.history = [newRecord, ...this.history];
            this._persistHistory();

        } catch (err: any) {
            this.error = err.message || "Failed to connect to API";
        } finally {
            this.isLoading = false;
        }
    }

    deleteHistoryRecord(id: string) {
        this.history = this.history.filter(record => record.id !== id);
        this._persistHistory();
    }

    clearHistory() {
        this.history = [];
        this._persistHistory();
    }

    private _persistHistory() {
        if (typeof window !== 'undefined') {
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
