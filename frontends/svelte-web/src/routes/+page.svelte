<script lang="ts">
  import CalculatorInput from '$lib/components/CalculatorInput.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import Card from '$lib/components/ui/Card.svelte';
</script>

<div class="min-h-screen p-4 md:p-8">
  <div class="max-w-4xl mx-auto space-y-8">
    
    <!-- Header row -->
    <header class="flex items-center justify-between">
      <h1 class="text-3xl font-heading font-bold text-slate-900 dark:text-white">
        Polyglot<span class="text-brand-primary">Powerlifting</span>
      </h1>
      <ThemeToggle />
    </header>

    <!-- Main Layout Grid -->
    <main class="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <!-- Left Column: Inputs -->
      <section>
        <CalculatorInput />
      </section>

      <!-- Right Column: Results (Future Phase) -->
      <section>
        <Card class="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
          <p class="font-medium">Calculation Results</p>
          <p class="text-sm">Scores will appear here...</p>
        </Card>
      </section>

    </main>
  </div>
</div>
