<script lang="ts">
  import CalculatorInput from '$lib/features/calculator/CalculatorInput.svelte';
  import CalculatorResults from '$lib/features/calculator/CalculatorResults.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import HistoryList from '$lib/features/history/HistoryList.svelte';
  import AuthStatus from '$lib/features/auth/AuthStatus.svelte';
</script>

<div class="min-h-screen p-4 lg:p-8 overflow-x-hidden">
  <div class="w-full max-w-5xl mx-auto space-y-8">
    
    <!-- Header row -->
    <header class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-2xl lg:text-4xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
        Polyglot<span class="text-brand-primary">Powerlifting</span>
      </h1>
      <div class="shrink-0 flex items-center gap-3">
        <AuthStatus />
        <div class="w-[1px] h-6 bg-slate-200 dark:bg-slate-700"></div>
        <ThemeToggle />
      </div>
    </header>

    <!-- Main Layout Grid -->
    <main class="space-y-8">
      
      <!-- Top Row: Input / Output -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column: Inputs -->
        <section>
          <CalculatorInput />
        </section>

        <!-- Right Column: Results -->
        <section>
          <CalculatorResults />
        </section>
      </div>

      <!-- Bottom Row: History Panel -->
      <section>
        <HistoryList />
      </section>

    </main>
  </div>
</div>
