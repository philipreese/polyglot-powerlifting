<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children, class: className = '' } = $props<{
    children: Snippet;
    class?: string;
  }>();
</script>

<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 {className}">
  {@render children()}
</div>
