<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { initHistoryState } from '$lib/state/history.svelte';
	import { initCalculatorFormState } from '$lib/state/form.svelte';

	// Decoupled Architectural State Initialization Layer
	const historyState = initHistoryState();
	initCalculatorFormState(historyState);

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
{@render children()}
