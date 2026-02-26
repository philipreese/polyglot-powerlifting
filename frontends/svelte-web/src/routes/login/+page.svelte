<script lang="ts">
  import { supabase } from '$lib/services/supabase';
  import { goto } from '$app/navigation';
  import Card from '$lib/components/ui/Card.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let email = $state('');
  let password = $state('');
  let isRegistering = $state(false);
  let errorMsg = $state('');
  let loading = $state(false);
  let successMsg = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMsg = '';
    successMsg = '';
    loading = true;
    
    try {
      if (isRegistering) {
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password
        });
        
        if (signUpError) throw signUpError;
        
        if (data.session) {
          await goto('/');
        } else {
          // If Supabase is configured to require email confirm
          successMsg = 'Check your email to confirm your account';
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;
        
        await goto('/');
      }
    } catch (e: any) {
      errorMsg = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen w-full flex flex-col items-center justify-center p-4">
  <div class="w-full max-w-md">
    
    <!-- Header -->
    <div class="mb-8 text-center space-y-2">
      <a href="/" class="inline-block hover:opacity-80 transition-opacity mb-4">
         <h1 class="text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
          Polyglot<span class="text-brand-primary">Powerlifting</span>
        </h1>
      </a>
      <h2 class="text-xl font-heading font-semibold text-slate-700 dark:text-slate-200">
        {isRegistering ? 'Create your account' : 'Welcome back'}
      </h2>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        {isRegistering ? 'Sign up to sync your powerlifting history across all your devices.' : 'Log in to securely access your saved history.'}
      </p>
    </div>

    <Card class="p-6 sm:p-8">
      <form class="space-y-5" onsubmit={handleSubmit}>
        <Input 
          id="email" 
          label="Email address" 
          type="email" 
          inputmode="email"
          bind:value={email} 
        />
        
        <Input 
          id="password" 
          label="Password" 
          type="password" 
          bind:value={password} 
        />
        
        {#if errorMsg}
          <div class="p-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            {errorMsg}
          </div>
        {/if}

        {#if successMsg}
          <div class="p-3 text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg">
            {successMsg}
          </div>
        {/if}

        <div class="pt-2">
          <Button type="submit" disabled={loading}>
            {#if loading}
              <span class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              {isRegistering ? 'Signing Up...' : 'Logging In...'}
            {:else}
              {isRegistering ? 'Create Account' : 'Log In'}
            {/if}
          </Button>
        </div>

        <div class="text-center pt-2">
          <button 
            type="button" 
            class="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer"
            onclick={() => { 
              isRegistering = !isRegistering; 
              errorMsg = '';
              successMsg = '';
            }}
          >
            {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
    </Card>
  </div>
</div>
