/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CalculatorResults from './CalculatorResults.svelte';

// Mutable mock state for rendering dynamic graphs
let mockState: any;

vi.mock('$lib/state/calculator.svelte', () => ({
    getCalculatorState: () => mockState
}));

describe('CalculatorResults Component', () => {
    beforeEach(() => {
        // Reset base state to empty initialization
        mockState = {
            preferredMetric: 'dots',
            wilks: null,
            dots: null,
            ipf_gl: null,
            reshel: null
        };
    });

    it('renders Empty Awaiting State placeholder initially', () => {
        render(CalculatorResults);
        expect(screen.getByText('Awaiting Data')).toBeInTheDocument();
        expect(screen.getByText(/Enter your lifts and hit Calculate/)).toBeInTheDocument();
    });

    it('renders beautiful metric grids when scores successfully populate', () => {
        // Stage metrics
        mockState = {
            preferredMetric: 'dots',
            wilks: 400.0,
            dots: 410.5,
            ipf_gl: 90.1,
            reshel: 110.5
        };
        
        render(CalculatorResults);
        
        // Validate DOTS is listed as the dominant "Score" primary label
        expect(screen.getByText('DOTS Score')).toBeInTheDocument();
        expect(screen.getByText('410.50')).toBeInTheDocument(); // Format assumes 2 decimals

        // Validate the secondary coefficients are present in the grid
        expect(screen.getByText('Wilks')).toBeInTheDocument();
        expect(screen.getByText('400.00')).toBeInTheDocument();

        expect(screen.getByText('IPF GL')).toBeInTheDocument();
        expect(screen.getByText('90.10')).toBeInTheDocument();

        // Empty state is banished
        expect(screen.queryByText('Awaiting Data')).not.toBeInTheDocument();
    });

    it('reactively dynamically swaps the Primary Highlighted Metric Header', () => {
        mockState = {
            preferredMetric: 'ipf_gl',
            wilks: 400.0,
            dots: 410.5,
            ipf_gl: 90.1,
            reshel: 110.5
        };
        
        render(CalculatorResults);
        
        // If preferred is IPF GL, it gets the " Score" suffix and main real estate
        expect(screen.getByText('IPF GL Score')).toBeInTheDocument();
        expect(screen.getByText('90.10')).toBeInTheDocument();
    });
});
