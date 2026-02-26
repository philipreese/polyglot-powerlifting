import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'happy-dom',
		setupFiles: ['./vitest.setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			include: ['src/lib/**/*.{js,ts,svelte}'],
			exclude: ['src/lib/schemas/**']
		}
	},
	resolve: {
		conditions: ['browser']
	}
});
