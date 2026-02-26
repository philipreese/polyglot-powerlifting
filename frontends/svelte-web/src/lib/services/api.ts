import type { LiftRequest, LiftResponse } from '$lib/schemas';
import { getAuthToken } from '$lib/state/auth.svelte';

// The ApiService acts as the HTTP network boundary for our application, 
// strictly utilizing backend domain models to communicate with FastAPI.
export class ApiService {
  private static getBaseUrl(): string {
    return import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  private static getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (includeAuth) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  /**
   * Submits lift data to the FastAPI backend and calculates scores.
   * Includes a timeout to aggressively fail if the backend is not running.
   */
  static async calculateScores(data: LiftRequest, timeoutMs = 3000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${this.getBaseUrl()}/lifts`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: controller.signal
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Connection timed out. Is the local FastAPI server running?');
      }
      throw new Error(`API Error: ${err.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  static async getHistory(): Promise<LiftResponse[]> {
    const token = getAuthToken();
    if (!token) return [];

    const res = await fetch(`${this.getBaseUrl()}/lifts`, {
      headers: this.getHeaders()
    });
    
    if (!res.ok) throw new Error(`Failed to fetch history: ${res.status}`);
    return await res.json();
  }

  static async deleteHistoryRecord(id: string): Promise<boolean> {
    const token = getAuthToken();
    if (!token) return false;

    const res = await fetch(`${this.getBaseUrl()}/lifts/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    
    return res.ok;
  }

  static async clearHistory(): Promise<boolean> {
    const token = getAuthToken();
    if (!token) return false;

    const res = await fetch(`${this.getBaseUrl()}/lifts`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    
    return res.ok;
  }

  static async syncLocalLifts(lifts: LiftResponse[]): Promise<LiftResponse[]> {
    const token = getAuthToken();
    if (!token || lifts.length === 0) return [];

    const res = await fetch(`${this.getBaseUrl()}/lifts/sync`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lifts)
    });
    
    if (!res.ok) throw new Error(`Failed to sync history: ${res.status}`);
    return await res.json();
  }
}
