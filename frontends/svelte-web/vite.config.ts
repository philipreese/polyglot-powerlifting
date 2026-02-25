import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// @ts-expect-error - pnpm workspace strict dependency resolution causes conflicting Vite Plugin types
	plugins: [tailwindcss(), sveltekit()]
});
