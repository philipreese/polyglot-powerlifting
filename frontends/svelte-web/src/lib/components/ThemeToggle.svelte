<script lang="ts">
  import { mode, setMode, userPrefersMode } from "mode-watcher";
  import { Moon, Sun, Monitor } from "lucide-svelte";

  const baseBtnClass = "p-2 rounded-md transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-primary";
  const activeClass = "bg-white dark:bg-slate-700 shadow-sm text-brand-primary dark:text-white";
  const inactiveClass = "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200";
</script>

<div class="flex gap-1 bg-slate-200 p-1 rounded-lg dark:bg-slate-900 w-fit">
  <button
    class="{baseBtnClass} {userPrefersMode.current === 'light' ? activeClass : inactiveClass}"
    onclick={() => setMode('light')}
    aria-label="Light Mode"
  >
    <Sun size={18} />
  </button>
  
  <button
    class="{baseBtnClass} {userPrefersMode.current === 'system' || userPrefersMode.current === undefined ? activeClass : inactiveClass}"
    onclick={() => setMode('system')}
    aria-label="System Mode"
  >
    <Monitor size={18} />
  </button>

  <button
    class="{baseBtnClass} {userPrefersMode.current === 'dark' ? activeClass : inactiveClass}"
    onclick={() => setMode('dark')}
    aria-label="Dark Mode"
  >
    <Moon size={18} />
  </button>
</div>
