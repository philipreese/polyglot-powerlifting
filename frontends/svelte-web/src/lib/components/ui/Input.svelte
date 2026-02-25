<script lang="ts">
  let { id, label, value = $bindable(), type = "text", step, inputmode } = $props<{
    id: string;
    label: string;
    value: number | string;
    type?: string;
    step?: string;
    inputmode?: "text" | "search" | "none" | "tel" | "url" | "email" | "numeric" | "decimal";
  }>();
</script>

<div class="space-y-2">
  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300" for={id}>{label}</label>
  <input 
    {id} 
    {type} 
    {step}
    {inputmode}
    min="0"
    bind:value 
    class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-shadow" 
  />
</div>
