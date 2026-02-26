import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';

// Ensure Svelte component wrappers are wiped from the document body after every individual `it()` block
afterEach(() => {
    cleanup();
});
