<script lang="ts">
  import type { Snippet } from 'svelte';
  
  let { id, label, value = $bindable(), children } = $props<{
    id: string;
    label: string;
    value: string;
    children: Snippet;
  }>();
</script>

<div class="space-y-2">
  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300" for={id}>{label}</label>
  <select 
    {id} 
    bind:value 
    class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-shadow"
  >
    {@render children()}
  </select>
</div>
