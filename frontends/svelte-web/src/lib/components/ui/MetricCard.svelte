<script lang="ts">
  let { title, value, isPrimary = false, colSpan = 1 } = $props<{
    title: string;
    value: number | null | undefined;
    isPrimary?: boolean;
    colSpan?: number;
  }>();

  const primaryClass = "p-4 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-xl border border-brand-primary/20 dark:border-brand-primary/30 group transition-all duration-300 hover:shadow-lg dark:hover:shadow-brand-primary/10 hover:border-brand-primary/50";
  const secondaryClass = "p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 group transition-all duration-300 hover:shadow-md dark:hover:shadow-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600";
</script>

<div class="{isPrimary ? primaryClass : secondaryClass} {colSpan === 2 ? 'col-span-2' : ''}">
  <div class="text-sm font-medium transition-colors {isPrimary ? 'text-brand-primary dark:text-brand-primary' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'}">
    {title}
  </div>
  <div class="{isPrimary ? 'text-4xl' : 'text-2xl'} font-heading font-bold text-slate-900 dark:text-white mt-1">
    {value !== null && value !== undefined ? value.toFixed(2) : '--'}
  </div>
</div>
