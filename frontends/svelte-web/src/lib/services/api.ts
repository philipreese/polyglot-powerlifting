import type { LiftRequest } from '$lib/schemas';

// The ApiService acts as the HTTP network boundary for our application, 
// strictly utilizing backend domain models to communicate with FastAPI.
export class ApiService {
  /**
   * Submits lift data to the FastAPI backend and calculates scores.
   * Includes a timeout to aggressively fail if the backend is not running.
   */
  static async calculateScores(data: LiftRequest, timeoutMs = 3000) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    // Create an abort controller so the UI doesn't hang forever if the backend is off
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${apiUrl}/lifts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
}
