<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import MetricCard from '$lib/components/ui/MetricCard.svelte';
  import { getCalculatorFormState } from '$lib/features/calculator/form.svelte';
  import { Calculator } from 'lucide-svelte';
  import { METRIC_CONFIG, type MetricKey } from '$lib/constants';

  const state = getCalculatorFormState();

  let primaryMetric = $derived(METRIC_CONFIG[state.preferredMetric]);
  let secondaryMetrics = $derived(
    Object.values(METRIC_CONFIG).filter(m => m.key !== state.preferredMetric)
  );
</script>

<Card class="h-full flex flex-col">
  <h2 class="text-xl font-heading font-semibold text-slate-900 dark:text-white mb-6">Results</h2>

  {#if state.wilks !== null}
    <div class="space-y-6 flex-grow">
      <!-- Primary Metric: Driven by User Preference -->
      <MetricCard title={primaryMetric.label + " Score"} value={state[primaryMetric.key as MetricKey]} isPrimary={true} />

      <!-- Other Coefficients -->
      <div class="grid grid-cols-2 gap-4">
        {#each secondaryMetrics as metric, i}
          <!-- Make the last metric span both columns so the grid is perfectly flush -->
          <MetricCard 
            title={metric.label} 
            value={state[metric.key as MetricKey]} 
            colSpan={i === 2 ? 2 : 1} 
          />
        {/each}
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
