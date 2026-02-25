<script lang="ts">
  import { page } from '$app/state';
  import { House, TriangleAlert } from 'lucide-svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
  <Card class="max-w-md w-full text-center space-y-6 p-8">
    <div class="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
      <TriangleAlert class="w-10 h-10 text-red-600 dark:text-red-500" />
    </div>
    
    <div class="space-y-2">
      <h1 class="text-3xl font-heading font-bold text-slate-900 dark:text-white">
        {page.status} Error
      </h1>
      <p class="text-slate-500 dark:text-slate-400">
        {page.error?.message || "Something went unexpectedly wrong. We've logged the error."}
      </p>
    </div>

    <div class="pt-6">
      <Button href="/">
        <House size={18} />
        Return to Calculator
      </Button>
    </div>
  </Card>
</div>
