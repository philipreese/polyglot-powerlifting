<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { initCalculatorState } from '$lib/state/calculator.svelte';

	// Initialize the global calculator state directly in the root layout.
	// This prevents SSR leakage and makes the state accessible via getCalculatorState() to all child pages.
	initCalculatorState();

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
{@render children()}
