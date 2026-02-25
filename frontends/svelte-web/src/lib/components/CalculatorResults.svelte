<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import MetricCard from '$lib/components/ui/MetricCard.svelte';
  import { getCalculatorState } from '$lib/state/calculator.svelte';
  import { Calculator } from 'lucide-svelte';

  const state = getCalculatorState();
</script>

<Card class="h-full flex flex-col">
  <h2 class="text-xl font-heading font-semibold text-slate-900 dark:text-white mb-6">Results</h2>

  {#if state.wilks !== null}
    <div class="space-y-6 flex-grow">
      <!-- Primary Metric: DOTS (Industry Standard) -->
      <MetricCard title="DOTS Score" value={state.dots} isPrimary={true} />

      <!-- Other Coefficients -->
      <div class="grid grid-cols-2 gap-4">
        <MetricCard title="IPF GL" value={state.ipf_gl} />
        <MetricCard title="Wilks" value={state.wilks} />
        <MetricCard title="Reshel" value={state.reshel} colSpan={2} />
      </div>
    </div>
  {:else}
    <!-- Empty State -->
    <div class="flex-grow flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
      <div class="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Calculator class="w-8 h-8 text-slate-300 dark:text-slate-600" />
      </div>
      <p class="font-medium text-lg text-slate-600 dark:text-slate-400">Awaiting Data</p>
      <p class="text-sm text-center mt-1">Enter your lifts and hit Calculate to see your coefficient scores.</p>
    </div>
  {/if}
</Card>
