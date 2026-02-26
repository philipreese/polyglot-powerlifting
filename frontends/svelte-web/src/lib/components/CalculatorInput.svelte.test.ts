/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CalculatorInput from './CalculatorInput.svelte';

let mockState: any;

vi.mock('$lib/state/calculator.svelte', () => ({
    getCalculatorState: () => mockState
}));

describe('CalculatorInput Component', () => {
    beforeEach(() => {
        mockState = {
            gender: 'male',
            equipment: 'raw',
            preferredMetric: 'dots',
            bodyweight: 80.0,
            squat: 100,
            bench: 100,
            deadlift: 100,
            total: 300,
            error: null,
            isLoading: false,
            calculate: vi.fn()
        };
    });

    it('renders all form inputs and calculated total getter', () => {
        render(CalculatorInput);
        
        // Assert deep custom inputs load correctly
        expect(screen.getByLabelText('Gender')).toBeInTheDocument();
        expect(screen.getByLabelText('Bodyweight')).toBeInTheDocument();
        expect(screen.getByLabelText('Squat')).toBeInTheDocument();

        // Assert the derived getter `total` reactive injection
        expect(screen.getByText('300')).toBeInTheDocument();
    });

    it('renders error notifications when present in state', () => {
        mockState.error = "Fatal Zod Validation Error";
        render(CalculatorInput);
        
        expect(screen.getByText('Fatal Zod Validation Error')).toBeInTheDocument();
    });

    it('disables calculation and displays spinner when loading', () => {
        mockState.isLoading = true;
        const { container } = render(CalculatorInput);
        
        // Expect text transition
        expect(screen.getByText('Calculating...')).toBeInTheDocument();
        
        // Expect spin animation injected via the DOM
        expect(container.querySelector('.animate-spin')).toBeInTheDocument();

        // Expect button to be unclickable
        const btn = screen.getByRole('button', { name: /Calculating\.\.\./i });
        expect(btn).toBeDisabled();
    });

    it('triggers calculate safely on valid bounds', async () => {
        render(CalculatorInput);
        
        const btn = screen.getByRole('button', { name: 'Calculate Scores' });
        await fireEvent.click(btn);
        
        expect(mockState.calculate).toHaveBeenCalledOnce();
    });
});
