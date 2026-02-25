<script lang="ts">
  import type { Snippet } from 'svelte';

  let { 
    children, 
    class: className = '', 
    href,
    onclick, 
    disabled = false, 
    type = "button" 
  } = $props<{
    children: Snippet;
    class?: string;
    href?: string;
    onclick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
  }>();

  // Abstracted tailwind classes for all primary buttons in the application
  const baseClass = "inline-flex items-center justify-center gap-2 px-6 py-3 w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-medium rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800 focus-visible:ring-brand-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
</script>

{#if href}
  <a {href} class="{baseClass} {className}">
    {@render children()}
  </a>
{:else}
  <button 
    {type}
    {onclick}
    {disabled}
    class="{baseClass} {className}"
  >
    {@render children()}
  </button>
{/if}
