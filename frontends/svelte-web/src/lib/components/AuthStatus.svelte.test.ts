/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthStatus from './AuthStatus.svelte';
import { supabase } from '$lib/services/supabase';

vi.mock('$lib/services/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn()
    }
  }
}));

// Mutable reactive flags to simulate Svelte 5 state across test environments
let mockUser: any = null;
let mockLoading = false;

vi.mock('$lib/state/auth.svelte', () => ({
  getAuth: () => ({
    get user() { return mockUser; },
    get isLoading() { return mockLoading; }
  })
}));

describe('AuthStatus Component', () => {
    beforeEach(() => {
        mockUser = null;
        mockLoading = false;
        vi.clearAllMocks();
    });

    it('shows pulse animation skeleton while loading auth from Supabase', () => {
        mockLoading = true;
        const { container } = render(AuthStatus);
        
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
        expect(screen.queryByText('Log In')).not.toBeInTheDocument();
    });

    it('shows Log In CTA when explicitly logged out', () => {
        mockLoading = false;
        mockUser = null;
        render(AuthStatus);
        
        const link = screen.getByText('Log In');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/login');
    });

    it('renders user email and hooks logout securely when signed in', async () => {
        mockLoading = false;
        mockUser = { email: 'test@polyglot.com' };
        
        render(AuthStatus);
        
        // Verifies identifier prints out securely
        expect(screen.getByText('test@polyglot.com')).toBeInTheDocument();
        
        // Verifies the network outbound click
        const logoutBtn = screen.getByLabelText('Log out');
        await fireEvent.click(logoutBtn);
        
        expect(supabase.auth.signOut).toHaveBeenCalledOnce();
    });
});
