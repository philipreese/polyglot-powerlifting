<script lang="ts">
  import { getHistoryState } from '$lib/features/history/history.svelte';
  import { History } from 'lucide-svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import HistoryItem from '$lib/features/history/HistoryItem.svelte';

  const state = getHistoryState();

  // Limit History rendered items so it doesn't get infinitely huge
  let displayedHistory = $derived(state.history.slice(0, 15));
</script>

<Card class="space-y-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <History class="w-5 h-5 text-slate-500 dark:text-slate-400" />
      <h2 class="text-xl font-heading font-semibold text-slate-900 dark:text-white">Recent Calculations</h2>
    </div>
    {#if state.history.length > 0 && !state.showSyncPrompt}
      <button 
        onclick={() => state.clearHistory()}
        class="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
      >
        Clear All
      </button>
    {/if}
  </div>

  {#if state.showSyncPrompt}
    <div class="bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800 rounded-xl p-4 flex flex-col gap-3">
      <div class="flex justify-between items-start">
        <h3 class="font-medium text-indigo-900 dark:text-indigo-200">
          {#if !state.isOnline}
            Offline - Sync Paused
          {:else if state.error}
            Sync Failed
          {:else}
            Sync Offline History?
          {/if}
        </h3>
      </div>

      {#if state.error}
        <p class="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
          {state.error}
        </p>
      {:else}
        <p class="text-sm text-indigo-700 dark:text-indigo-300">
          {#if !state.isOnline}
            We'll sync your {state.localHistoryCount} calculations as soon as you're back online.
          {:else}
            We found {state.localHistoryCount} un-synced calculations on this device. Merge them into your account?
          {/if}
        </p>
      {/if}

      <div class="flex gap-2">
        <button 
          class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onclick={() => state.confirmSync()}
          disabled={state.isSyncing || !state.isOnline}
        >
          {#if state.isSyncing}
            <span class="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
            Syncing...
          {:else if !state.isOnline}
            Waiting for Connection...
          {:else if state.error}
            Retry Sync
          {:else}
            Sync to Cloud
          {/if}
        </button>
        <button 
          class="flex-1 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-medium py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors cursor-pointer disabled:opacity-50"
          onclick={() => state.clearLocalStorage()}
          disabled={state.isSyncing}
        >
          Clear Local
        </button>
      </div>
    </div>
  {/if}

  {#if state.isLoading && state.history.length === 0}
    <div class="flex flex-col items-center py-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
      <div class="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
      <p class="text-sm text-slate-500 dark:text-slate-400">Loading your history...</p>
    </div>
  {:else if state.history.length === 0 && !state.showSyncPrompt}
    <div class="flex flex-col items-center py-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
      <p class="text-sm text-slate-500 dark:text-slate-400">No recorded history yet.</p>
      <p class="text-xs text-slate-400 mt-1">Calculations will be saved here locally.</p>
    </div>
  {:else}
    <!-- Grid format handles width much better than pure list -->
    <div class="relative">
      {#if state.isLoading}
        <div class="absolute inset-0 bg-white/50 dark:bg-slate-900/50 z-10 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
           <div class="w-6 h-6 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      {/if}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar {state.isLoading ? 'opacity-50' : ''}">
        {#each displayedHistory as record, i (record.id ?? `local-${i}`)}
          <HistoryItem 
            {record} 
            onDelete={(id) => state.deleteHistoryRecord(id)}
          />
        {/each}
      </div>
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
