<script lang="ts">
  import { getCalculatorState } from '$lib/state/calculator.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  // Retrieve the reactive Svelte 5 state from the context
  const state = getCalculatorState();
</script>

<Card class="space-y-6">
  <h2 class="text-xl font-heading font-semibold text-slate-900 dark:text-white">Lifter Profile</h2>
  
  <div class="grid grid-cols-2 gap-4">
    <Select id="gender" label="Gender" bind:value={state.gender}>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </Select>

    <Select id="equipment" label="Equipment" bind:value={state.equipment}>
      <option value="raw">Raw</option>
      <option value="single-ply">Single-ply</option>
      <option value="multi-ply">Multi-ply</option>
    </Select>
  </div>

  <div class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
    <h3 class="text-lg font-heading font-medium text-slate-900 dark:text-white">Lifts (kg)</h3>

    <Input 
      id="bodyweight" 
      label="Bodyweight" 
      type="number" 
      step="0.1" 
      inputmode="decimal" 
      bind:value={state.bodyweight} 
    />

    <div class="grid grid-cols-3 gap-4">
      <Input 
        id="squat" 
        label="Squat" 
        type="number" 
        step="2.5" 
        inputmode="decimal" 
        bind:value={state.squat} 
      />

      <Input 
        id="bench" 
        label="Bench" 
        type="number" 
        step="2.5" 
        inputmode="decimal" 
        bind:value={state.bench} 
      />

      <Input 
        id="deadlift" 
        label="Deadlift" 
        type="number" 
        step="2.5" 
        inputmode="decimal" 
        bind:value={state.deadlift} 
      />
    </div>
  </div>
  
  <div class="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
    <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Total</span>
    <span class="text-2xl font-heading font-bold text-brand-primary dark:text-brand-primary">{state.total} <span class="text-sm font-normal text-slate-500">kg</span></span>
  </div>

  {#if state.error}
    <div class="p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm font-medium">
      {state.error}
    </div>
  {/if}

  <button 
    onclick={() => state.calculate()} 
    disabled={state.isLoading}
    class="w-full py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary dark:focus-visible:ring-offset-slate-800"
  >
    {#if state.isLoading}
      <span class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
      Calculating...
    {:else}
      Calculate Scores
    {/if}
  </button>
</Card>
