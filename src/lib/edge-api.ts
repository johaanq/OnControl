// Edge Service API Client
// Handles communication with the local Python/Flask Edge Service (via ngrok)

const EDGE_API_URL = process.env.NEXT_PUBLIC_EDGE_API_URL || 'https://carrie-resorptive-lorelei.ngrok-free.dev';

export interface EdgeHealthRecord {
  id: number;
  device_id: string;
  timestamp: string; // ISO string
  bpm: number;
  spo2: number;
  temperature: number;
  patient_id?: number; // Depending on Edge implementation
  is_critical: boolean;
}

export interface ClaimDeviceRequest {
  device_id: string;
}

export interface ClaimDeviceResponse {
  message: string;
  device_id: string;
  status: string;
  ownership_id?: number;
}

export class EdgeApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'EdgeApiError';
    this.status = status;
  }
}

class EdgeApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Skip ngrok warning page
        // Ensure we send the token for IAM validation on the Edge
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Edge API Error:', { url, status: response.status, errorData });
        // Throw custom error with status
        throw new EdgeApiError(errorData.message || `Edge Service Error: ${response.status}`, response.status);
      }

      return await response.json();
    } catch (error) {
      // Network errors (e.g., ngrok tunnel closed)
      console.error('Edge Network Error:', error);
      throw error;
    }
  }

  // ============================================
  // DEVICE MANAGEMENT
  // ============================================

  /**
   * Links a specific IoT band (device_id) to the currently logged-in patient.
   */
  async claimDevice(deviceId: string): Promise<ClaimDeviceResponse> {
    return this.request<ClaimDeviceResponse>('/devices/claim', {
      method: 'POST',
      body: JSON.stringify({ device_id: deviceId }),
    });
  }

  // ============================================
  // VITALS MONITORING
  // ============================================

  /**
   * Gets the single most recent reading for the current patient.
   * Optimized for Patient Dashboard "Real-time" view.
   */
  async getLatestVitals(): Promise<EdgeHealthRecord> {
    return this.request<EdgeHealthRecord>('/OnControl/parameters/latest');
  }

  /**
   * Gets all records.
   * Note: For Doctors, this returns EVERYTHING. Filtering must happen client-side
   * based on the patient's device_id.
   */
  async getAllRecords(): Promise<EdgeHealthRecord[]> {
    return this.request<EdgeHealthRecord[]>('/OnControl/parameters');
  }
}

export const edgeApi = new EdgeApiClient(EDGE_API_URL);
