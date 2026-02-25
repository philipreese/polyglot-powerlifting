import { setContext, getContext } from 'svelte';
import { LiftSchema } from '$lib/schemas/lift';

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
            const { ApiService } = await import('$lib/services/api');
            const data = await ApiService.calculateScores(parsed.data);
            
            // 3. Update reactive state with results!
            this.wilks = data.wilks;
            this.dots = data.dots;
            this.ipf_gl = data.ipf_gl;
            this.reshel = data.reshel;

        } catch (err: any) {
            this.error = err.message || "Failed to connect to API";
        } finally {
            this.isLoading = false;
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
