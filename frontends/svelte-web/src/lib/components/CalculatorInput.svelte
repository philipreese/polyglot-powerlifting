<script lang="ts">
  import { getCalculatorFormState } from '$lib/state/form.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { METRIC_CONFIG } from '$lib/constants';
 
  // Retrieve the reactive Svelte 5 state from the context
  const state = getCalculatorFormState();
</script>

<Card class="space-y-6">
  <h2 class="text-xl font-heading font-semibold text-slate-900 dark:text-white">Lifter Profile</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Select id="gender" label="Gender" bind:value={state.gender} options={[
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ]} />

    <Select id="equipment" label="Equipment" bind:value={state.equipment} options={[
      { value: 'raw', label: 'Raw' },
      { value: 'single-ply', label: 'Single-ply' },
      { value: 'multi-ply', label: 'Multi-ply' }
    ]} />

    <Select id="preferredMetric" label="Preferred Metric" bind:value={state.preferredMetric} options={
      Object.values(METRIC_CONFIG).map(m => ({ value: m.key, label: m.label }))
    } />
  </div>

  {#if typeof window !== 'undefined'}
    {@const _ = state.preferredMetric && localStorage.setItem('preferred_metric', state.preferredMetric)}
  {/if}

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

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

  <Button 
    onclick={() => state.calculate()} 
    disabled={state.isLoading}
  >
    {#if state.isLoading}
      <span class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
      Calculating...
    {:else}
      Calculate Scores
    {/if}
  </Button>
</Card>
