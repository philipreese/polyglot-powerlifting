<script lang="ts">
  import { mode, setMode, userPrefersMode } from "mode-watcher";
  import { Moon, Sun, Monitor } from "lucide-svelte";
</script>

<div class="flex gap-2 bg-gray-100 p-1 rounded-lg dark:bg-slate-800 w-fit">
  <button
    class="p-2 rounded-md transition-all {mode.current === 'light' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-400 hover:text-slate-200'}"
    onclick={() => setMode('light')}
    aria-label="Light Mode"
  >
    <Sun size={18} />
  </button>
  
  <button
    class="p-2 rounded-md transition-all {userPrefersMode.current === 'system' || !userPrefersMode.current ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-primary' : 'text-slate-400 hover:text-slate-200'}"
    onclick={() => setMode('system')}
    aria-label="System Mode"
  >
    <Monitor size={18} />
  </button>

  <button
    class="p-2 rounded-md transition-all {mode.current === 'dark' ? 'bg-slate-700 shadow-sm text-brand-primary' : 'text-slate-400 hover:text-slate-200'}"
    onclick={() => setMode('dark')}
    aria-label="Dark Mode"
  >
    <Moon size={18} />
  </button>
</div>
