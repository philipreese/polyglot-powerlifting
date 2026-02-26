/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ThemeToggle from './ThemeToggle.svelte';
import * as modeWatcher from 'mode-watcher';

// Mock the mode-watcher library explicitly
vi.mock('mode-watcher', () => ({
    setMode: vi.fn(),
    mode: { current: 'light', subscribe: vi.fn() },
    userPrefersMode: { current: 'system', subscribe: vi.fn() }
}));

describe('ThemeToggle Component', () => {
    it('renders all three mode buttons seamlessly', () => {
        render(ThemeToggle);
        expect(screen.getByLabelText('Light Mode')).toBeInTheDocument();
        expect(screen.getByLabelText('System Mode')).toBeInTheDocument();
        expect(screen.getByLabelText('Dark Mode')).toBeInTheDocument();
    });

    it('dispatches the correct theme preference on click', async () => {
        render(ThemeToggle);
        
        // Assert Set Mode: Dark
        await fireEvent.click(screen.getByLabelText('Dark Mode'));
        expect(modeWatcher.setMode).toHaveBeenCalledWith('dark');
        
        // Assert Set Mode: Light
        await fireEvent.click(screen.getByLabelText('Light Mode'));
        expect(modeWatcher.setMode).toHaveBeenCalledWith('light');
    });
});
