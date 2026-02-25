export function createCalculatorState() {
    let bodyweight = $state(80.0);
    let squat = $state(0.0);
    let bench = $state(0.0);
    let deadlift = $state(0.0);
    let gender = $state<'male' | 'female'>('male');
    let equipment = $state<'raw' | 'single-ply' | 'multi-ply'>('raw');
    
    // Derived values
    let total = $derived(squat + bench + deadlift);
    
    return {
        get bodyweight() { return bodyweight },
        set bodyweight(v) { bodyweight = v },
        
        get squat() { return squat },
        set squat(v) { squat = v },
        
        get bench() { return bench },
        set bench(v) { bench = v },
        
        get deadlift() { return deadlift },
        set deadlift(v) { deadlift = v },
        
        get gender() { return gender },
        set gender(v) { gender = v },
        
        get equipment() { return equipment },
        set equipment(v) { equipment = v },
        
        // Read-only derived properties
        get total() { return total }
    }
}

// A global singleton instance for the app to share
export const calculatorState = createCalculatorState();
