import { createApiClient } from '$lib/core/schemas/openapi';
import type { LiftRequest, LiftResponse } from '$lib/core/schemas';
import { getAuthToken } from '$lib/features/auth/auth.svelte';

// Initialize the Zodios network client perfectly typed to FastAPI!
const getBaseUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8000';
const apiClient = createApiClient(getBaseUrl());

function getAuthConfig() {
  const token = getAuthToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

// The ApiService acts as the HTTP network boundary for our application.
// We've shifted from manually parsing `fetch` to leveraging Zodios End-to-End type safety!
export class ApiService {
  /**
   * Submits lift data to the FastAPI backend and calculates scores.
   * If the data returned by the backend violates the `LiftResponse` shape, 
   * Zodios will inherently throw an error, protecting our Svelte UI.
   */
  static async calculateScores(data: LiftRequest) {
    const config = getAuthConfig();
    if (import.meta.env.PROD) {
      console.log("[ApiService] AUTH_CHECK:", config.headers ? "PRESENT" : "MISSING");
    }
    try {
      // The typescript compiler knows this takes `LiftRequest` and returns `LiftResponse`!
      const res = await apiClient.post('/lifts/', data, {
        ...getAuthConfig(),
        timeout: 3000 // Zodios supports built in timeout natively
      });
      return res;
    } catch (err: any) {
       // Zodios cleanly parses validation and network errors
      if (err.message.includes('timeout')) {
        throw new Error('Connection timed out. Is the local FastAPI server running?');
      }
      throw new Error(`API Error: ${err.message}`);
    }
  }

  static async getHistory(): Promise<LiftResponse[]> {
    const config = getAuthConfig();
    if (!config.headers) return [];

    try {
      const res = await apiClient.get('/lifts/', config);
      return res;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  static async deleteHistoryRecord(id: string): Promise<boolean> {
    const config = getAuthConfig();
    if (!config.headers) return false;

    try {
      await apiClient.delete('/lifts/:lift_id', undefined, {
        params: { lift_id: id },
        ...config
      });
      return true;
    } catch {
      return false;
    }
  }

  static async clearHistory(): Promise<boolean> {
    const config = getAuthConfig();
    if (!config.headers) return false;

    try {
      await apiClient.delete('/lifts/', undefined, config);
      return true;
    } catch {
      return false;
    }
  }

  static async syncLocalLifts(lifts: LiftResponse[]): Promise<LiftResponse[]> {
    const config = getAuthConfig();
    if (!config.headers || lifts.length === 0) return [];

    try {
      const res = await apiClient.post('/lifts/sync', lifts, config);
      return res;
    } catch (err) {
      throw new Error("Failed to selectively merge history");
    }
  }
}
