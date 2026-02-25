<script lang="ts">
  import { Plus, Minus } from 'lucide-svelte';

  let { id, label, value = $bindable(), type = "text", step, inputmode } = $props<{
    id: string;
    label: string;
    value: number | string;
    type?: string;
    step?: string;
    inputmode?: "text" | "search" | "none" | "tel" | "url" | "email" | "numeric" | "decimal";
  }>();

  function handleIncrement() {
    if (type === 'number') {
      const stepVal = parseFloat(step || "1");
      const current = parseFloat(value as string) || 0;
      value = parseFloat((current + stepVal).toFixed(2));
    }
  }

  function handleDecrement() {
    if (type === 'number') {
      const stepVal = parseFloat(step || "1");
      const current = parseFloat(value as string) || 0;
      value = parseFloat(Math.max(0, current - stepVal).toFixed(2));
    }
  }
</script>

<div class="space-y-2">
  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer" for={id}>{label}</label>
  <div class="relative flex items-center">
    <input 
      {id} 
      {type} 
      {step}
      {inputmode}
      min="0"
      bind:value 
      class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-shadow {type === 'number' ? 'pr-16' : ''}" 
    />
    
    {#if type === "number"}
      <div class="absolute right-1 flex items-center bg-transparent border-l border-slate-200 dark:border-slate-600 pl-1 h-3/4">
        <button 
          type="button" 
          tabindex="-1"
          class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded cursor-pointer transition-colors"
          onclick={handleDecrement}
          aria-label="Decrease"
        >
          <Minus class="w-4 h-4" />
        </button>
        <button 
          type="button" 
          tabindex="-1"
          class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded cursor-pointer transition-colors"
          onclick={handleIncrement}
          aria-label="Increase"
        >
          <Plus class="w-4 h-4" />
        </button>
      </div>
    {/if}
  </div>
</div>
