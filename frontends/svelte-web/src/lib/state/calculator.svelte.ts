import { setContext, getContext } from 'svelte';

export class CalculatorState {
    bodyweight = $state(80.0);
    squat = $state(0.0);
    bench = $state(0.0);
    deadlift = $state(0.0);
    gender = $state<'male' | 'female'>('male');
    equipment = $state<'raw' | 'single-ply' | 'multi-ply'>('raw');

    // Derived values using native JS getters
    get total() {
        return this.squat + this.bench + this.deadlift;
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
