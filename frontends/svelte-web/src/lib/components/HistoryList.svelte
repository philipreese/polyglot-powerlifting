<script lang="ts">
  import { getCalculatorState } from '$lib/state/calculator.svelte';
  import { History } from 'lucide-svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import HistoryItem from '$lib/components/ui/HistoryItem.svelte';

  const state = getCalculatorState();

  // Limit History rendered items so it doesn't get infinitely huge
  let displayedHistory = $derived(state.history.slice(0, 15));
</script>

<Card class="space-y-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <History class="w-5 h-5 text-slate-500 dark:text-slate-400" />
      <h2 class="text-xl font-heading font-semibold text-slate-900 dark:text-white">Recent Calculations</h2>
    </div>
    {#if state.history.length > 0}
      <button 
        onclick={() => state.clearHistory()}
        class="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
      >
        Clear All
      </button>
    {/if}
  </div>

  {#if state.history.length === 0}
    <div class="flex flex-col items-center py-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
      <p class="text-sm text-slate-500 dark:text-slate-400">No recorded history yet.</p>
      <p class="text-xs text-slate-400 mt-1">Calculations will be saved here locally.</p>
    </div>
  {:else}
    <!-- Grid format handles width much better than pure list -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      {#each displayedHistory as record (record.id)}
        <HistoryItem 
          {record} 
          onDelete={(id) => state.deleteHistoryRecord(id)}
        />
      {/each}
    </div>
    
    {#if state.history.length > 10}
      <div class="text-center text-sm text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
        Showing 10 most recent. ({state.history.length - 10} older records hidden)
      </div>
    {/if}
  {/if}
</Card>

<style>
  /* Base custom scrollbar styles for history container */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 9999px;
  }
  :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #475569;
  }
</style>
