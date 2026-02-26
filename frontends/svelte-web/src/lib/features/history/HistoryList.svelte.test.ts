/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HistoryList from './HistoryList.svelte';

let mockState: any;

vi.mock('$lib/features/history/history.svelte', () => ({
    getHistoryState: () => mockState
}));

// Mock the form state as well because HistoryItem deeply renders and needs the preferred metric
vi.mock('$lib/features/calculator/form.svelte', () => ({
    getCalculatorFormState: () => ({ preferredMetric: 'dots' })
}));

describe('HistoryList Component', () => {
    beforeEach(() => {
        mockState = {
            preferredMetric: 'dots',
            history: [],
            showSyncPrompt: false,
            isOnline: true,
            isSyncing: false,
            error: null,
            clearHistory: vi.fn(),
            dismissSync: vi.fn(),
            confirmSync: vi.fn(),
            deleteHistoryRecord: vi.fn()
        };
    });

    it('renders empty state initially', () => {
        render(HistoryList);
        expect(screen.getByText('No recorded history yet.')).toBeInTheDocument();
        expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('renders sync prompt and connects network actions', async () => {
        mockState.showSyncPrompt = true;
        render(HistoryList);
        
        expect(screen.getByText('Sync Offline History?')).toBeInTheDocument();
        
        // Assert Dismiss hook
        const dismissBtn = screen.getByTitle('Dismiss');
        await fireEvent.click(dismissBtn);
        expect(mockState.dismissSync).toHaveBeenCalledOnce();

        // Assert Sync Hook
        const syncBtn = screen.getByText('Sync to Cloud');
        await fireEvent.click(syncBtn);
        expect(mockState.confirmSync).toHaveBeenCalledOnce();
    });

    it('renders history grid and hooks clear button', async () => {
        mockState.history = [
            { 
                id: '123', 
                created_at: new Date().toISOString(), 
                total: 500, 
                wilks: 300, 
                dots: 310, 
                ipf_gl: 80, 
                reshel: 90 
            }
        ];
        
        render(HistoryList);
        
        // Expect Clear All bounded since there is >0 history
        const clearBtn = screen.getByText('Clear All');
        await fireEvent.click(clearBtn);
        expect(mockState.clearHistory).toHaveBeenCalledOnce();

        // Expect deep render of HistoryItem to show the total
        expect(screen.getByText('500kg')).toBeInTheDocument();
    });

    it('handles sync loading state visually', () => {
        mockState.showSyncPrompt = true;
        mockState.isSyncing = true;
        render(HistoryList);
        
        const syncBtn = screen.getByRole('button', { name: "Syncing..." });
        expect(syncBtn).toBeDisabled();
    });
});
