import { setContext, getContext } from 'svelte';
import { LiftSchema } from '$lib/core/schemas';
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
        }
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
            const data = await ApiService.calculateScores(parsed.data);
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
