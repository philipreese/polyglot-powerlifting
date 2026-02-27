import { setContext, getContext } from 'svelte';
import { getAuth } from '$lib/features/auth/auth.svelte';
import { LiftSchema } from '$lib/core/schemas';
import type { LiftResponse } from '$lib/core/schemas';
import { ApiService } from '$lib/core/services/api';
import type { HistoryState } from '$lib/features/history';

export class CalculatorFormState {
    bodyweight = $state(80.0);
    squat = $state(0.0);
    bench = $state(0.0);
    deadlift = $state(0.0);
    gender = $state<'male' | 'female'>('male');
    equipment = $state<'raw' | 'single-ply' | 'multi-ply'>('raw');

    wilks = $state<number | null>(null);
    dots = $state<number | null>(null);
    ipf_gl = $state<number | null>(null);
    reshel = $state<number | null>(null);

    isLoading = $state(false);
    error = $state<string | null>(null);
    preferredMetric = $state<'dots' | 'wilks' | 'ipf_gl' | 'reshel'>('dots');

    private historyState: HistoryState;

    constructor(historyState: HistoryState) {
        this.historyState = historyState;
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('preferred_metric') as any;
            if (stored && ['dots', 'wilks', 'ipf_gl', 'reshel'].includes(stored)) {
                this.preferredMetric = stored;
            }

            // Sync with auth changes
            $effect.root(() => {
                $effect(() => {
                    const user = getAuth().user;
                    if (!user) {
                        this.reset();
                    }
                });
            });
        }
    }

    reset() {
        this.bodyweight = 80.0;
        this.gender = 'male';
        this.equipment = 'raw';
        this.squat = 0.0;
        this.bench = 0.0;
        this.deadlift = 0.0;
        this.wilks = null;
        this.dots = null;
        this.ipf_gl = null;
        this.reshel = null;
        this.isLoading = false;
        this.error = null;
    }

    setPreferredMetric(metric: 'dots' | 'wilks' | 'ipf_gl' | 'reshel') {
        this.preferredMetric = metric;
        if (typeof window !== 'undefined') localStorage.setItem('preferred_metric', metric);
    }

    get total() {
        return this.squat + this.bench + this.deadlift;
    }

    async calculate() {
        this.error = null;
        const parsed = LiftSchema.safeParse({
            bodyweight: this.bodyweight, gender: this.gender, equipment: this.equipment,
            squat: this.squat, bench: this.bench, deadlift: this.deadlift
        });

        if (!parsed.success) {
            this.error = parsed.error.issues[0].message;
            return;
        }

        this.isLoading = true;
        try {
            const data: LiftResponse = await ApiService.calculateScores(parsed.data);
            this.wilks = data.wilks;
            this.dots = data.dots;
            this.ipf_gl = data.ipf_gl;
            this.reshel = data.reshel;

            this.historyState.addRecordToHistory(data);
        } catch (err: any) {
            this.error = err.message || "Failed to connect to API";
        } finally {
            this.isLoading = false;
        }
    }
}

const FORM_KEY = Symbol('CALCULATOR_FORM_STATE');
export function initCalculatorFormState(historyState: HistoryState) {
    const s = new CalculatorFormState(historyState);
    setContext(FORM_KEY, s);
    return s;
}
export function getCalculatorFormState() {
    return getContext<CalculatorFormState>(FORM_KEY);
}
