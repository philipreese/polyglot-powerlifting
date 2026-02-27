import { supabase } from '$lib/core/services/supabase';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

class AuthState {
  user = $state<User | null>(null);
  session = $state<Session | null>(null);
  isLoading = $state(true);

  constructor() {
    // Only initialize the session on the client browser
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  async init() {
    if (!supabase) {
      console.warn('Supabase client not initialized. Auth features will be unavailable.');
      this.isLoading = false;
      return;
    }

    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (!error && session) {
      this.session = session;
      this.user = session.user;
    }
    
    this.isLoading = false;

    // Listen to all future auth event changes automatically
    supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      this.session = session;
      this.user = session?.user ?? null;
      this.isLoading = false;
    });
  }

  // Helper method for safely getting access token 
  get token() {
    return this.session?.access_token;
  }
}

// Singleton pattern so the entire app hooks into the exact same Reactive user session
const authState = new AuthState();

export function getAuth() {
  return authState;
}

export function getAuthToken() {
  return authState.token;
}
