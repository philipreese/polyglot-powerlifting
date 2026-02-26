/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Input from './Input.svelte';

describe('Input Component', () => {
    it('renders text inputs properly', () => {
        render(Input, { id: 'test-text', label: 'First Name', value: 'John', type: 'text' });
        
        // Assert label exists
        expect(screen.getByText('First Name')).toBeInTheDocument();
        
        // Assert input exists and has value
        const input = screen.getByDisplayValue('John');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'text');
    });

    it('renders number inputs and supports increment/decrement buttons', async () => {
        // Render a number input starting at 0 with step 5
        render(Input, { id: 'test-num', label: 'Weight', value: 0, type: 'number', step: '5' });
        
        const decBtn = screen.getByLabelText('Decrease');
        const incBtn = screen.getByLabelText('Increase');

        // Since testing library fires clicks on components that natively handle reactive binds,
        // we can observe the visual DOM changes
        await fireEvent.click(incBtn);
        expect(screen.getByDisplayValue('5')).toBeInTheDocument();

        // Clicking decrease
        await fireEvent.click(decBtn);
        expect(screen.getByDisplayValue('0')).toBeInTheDocument();

        // Validating minimum zero bound in handleDecrement
        await fireEvent.click(decBtn);
        expect(screen.getByDisplayValue('0')).toBeInTheDocument(); // Doesn't go negative
    });
});
