<script lang="ts">
  import type { LiftResponse } from '$lib/schemas';
  import { getCalculatorFormState } from '$lib/state/form.svelte';
  import { Trash2, Star } from 'lucide-svelte';
  import { METRIC_CONFIG, type MetricKey } from '$lib/constants';

  const state = getCalculatorFormState();

  let { record, onDelete, onFeature, featuredId } = $props<{
    record: LiftResponse;
    onDelete: (id: string) => void;
    onFeature?: (id: string) => void;
    featuredId?: string | null;
  }>();

  let isFeatured = $derived(featuredId === record.id);

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Unknown Date';
    return new Date(isoString).toLocaleDateString([], { 
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
  };

  let primaryMetric = $derived(METRIC_CONFIG[state.preferredMetric]);
  let secondaryMetrics = $derived(
    Object.values(METRIC_CONFIG).filter(m => m.key !== state.preferredMetric)
  );

</script>

<div class="relative group bg-slate-50 dark:bg-slate-800/80 rounded-xl border p-4 transition-all hover:shadow-md {isFeatured ? 'border-amber-400 dark:border-amber-500 bg-amber-50/30 dark:bg-amber-900/10' : 'border-slate-200 dark:border-slate-700 dark:hover:border-slate-600'}">
  
  <!-- Action buttons (visible on hover or if featured) -->
  <div class="absolute top-3 right-3 flex gap-2 {isFeatured ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity">
    {#if onFeature}
      <button 
        class="transition-colors {isFeatured ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}"
        onclick={() => { if(record.id) onFeature(record.id) }}
        aria-label={isFeatured ? "Unfeature calculation" : "Feature calculation"}
        title="Set as featured score"
      >
        <Star class="w-4 h-4 {isFeatured ? 'fill-amber-500' : ''}" />
      </button>
    {/if}
    <button 
      class="text-slate-400 hover:text-red-500 transition-colors"
      onclick={() => { if(record.id) onDelete(record.id) }}
      aria-label="Delete calculation"
      title="Delete record"
    >
      <Trash2 class="w-4 h-4" />
    </button>
  </div>

  <div class="flex flex-col gap-3">
     <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 pr-12">
       <span class="text-2xl font-heading font-bold whitespace-nowrap {isFeatured ? 'text-amber-600 dark:text-amber-500' : 'text-brand-primary'}">
         {record[primaryMetric.key as MetricKey]?.toFixed(2) || '--'} 
         <span class="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">{primaryMetric.label}</span>
       </span>
       <span class="text-sm text-slate-500 mt-1">{formatDate(record.created_at)}</span>
     </div>

     <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 border-t {isFeatured ? 'border-amber-200 dark:border-amber-800/50' : 'border-slate-200 dark:border-slate-700'} pt-3">
        {#snippet metric(label: string, value: string | number)}
          <div>
            <div class="text-[10px] uppercase font-bold text-slate-400">{label}</div>
            <div class="font-medium text-slate-800 dark:text-slate-200">{value}</div>
          </div>
        {/snippet}

        {@render metric("Total", `${record.total}kg`)}
        {#each secondaryMetrics as metricDef}
          {@render metric(metricDef.label, record[metricDef.key as MetricKey]?.toFixed(2) || '--')}
        {/each}
     </div>
  </div>
</div>
