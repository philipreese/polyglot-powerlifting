<script lang="ts">
  import { ChevronDown, Check } from 'lucide-svelte';
  import { fly } from 'svelte/transition';
  
  let { id, label, value = $bindable(), options } = $props<{
    id: string;
    label: string;
    value: string;
    options: { value: string; label: string }[];
  }>();

  let isOpen = $state(false);
  let selectContainer: HTMLDivElement | undefined = $state();

  function handleWindowClick(e: MouseEvent) {
    if (isOpen && selectContainer && !selectContainer.contains(e.target as Node)) {
      isOpen = false;
    }
  }

  let selectedLabel = $derived(options.find((o: { value: string; label: string }) => o.value === value)?.label || "Select...");
</script>

<svelte:window onclick={handleWindowClick} />

<div class="space-y-2" bind:this={selectContainer}>
  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer" for={id}>{label}</label>
  <div class="relative">
    <button 
      {id}
      type="button"
      class="w-full flex items-center justify-between rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white cursor-pointer focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-shadow"
      onclick={() => isOpen = !isOpen}
    >
      <span class="truncate pr-2">{selectedLabel}</span>
      <ChevronDown class="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400 transition-transform {isOpen ? 'rotate-180' : ''}" />
    </button>
    
    {#if isOpen}
      <div 
        transition:fly={{ y: -10, duration: 250 }}
        class="absolute z-50 mt-2 w-full origin-top-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden focus:outline-none"
      >
        <ul class="max-h-60 overflow-auto">
          {#each options as option}
            <li>
              <button
                type="button"
                class="w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors cursor-pointer {value === option.value ? 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}"
                onclick={() => { value = option.value; isOpen = false; }}
              >
                {option.label}
                {#if value === option.value}
                   <Check class="w-4 h-4 text-brand-primary" />
                {/if}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div>
