// Crear archivo en: frontend/src/lib/api.ts
interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = new Error(`API Error: ${response.statusText}`);
      error.status = response.status;
      
      try {
        error.data = await response.json();
      } catch {
        // Response might not be JSON
      }
      
      throw error;
    }
    
    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api${endpoint}`);
    return this.handleResponse<T>(response);
  }

  async post<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return this.handleResponse<T>(response);
  }

  async put<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
      method: 'DELETE'
    });
    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient();