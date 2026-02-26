<script lang="ts">
  import { getAuth } from '$lib/state/auth.svelte';
  import { supabase } from '$lib/services/supabase';
  import { CircleUser, LogOut } from 'lucide-svelte';

  const authState = getAuth();

  async function handleLogout() {
    await supabase.auth.signOut();
  }
</script>

{#if !authState.isLoading}
  <div class="flex items-center gap-3">
    {#if authState.user}
      <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <CircleUser class="w-5 h-5 text-brand-primary" />
        <span class="hidden sm:inline">{authState.user.email}</span>
      </div>
      <button 
        onclick={handleLogout}
        class="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        title="Log out"
        aria-label="Log out"
      >
        <LogOut class="w-4 h-4" />
      </button>
    {:else}
      <a 
        href="/login"
        class="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-primary/10 dark:hover:bg-brand-primary/20 cursor-pointer"
      >
        Log In
      </a>
    {/if}
  </div>
{:else}
  <!-- Placeholder to avoid navbar layout shift -->
  <div class="w-24 h-8 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
{/if}
