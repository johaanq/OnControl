import { useState, useEffect, useCallback } from 'react';
import { edgeApi, type EdgeHealthRecord, type ClaimDeviceResponse, EdgeApiError } from '@/lib/edge-api';

interface UseEdgeDeviceReturn {
  claimDevice: (deviceId: string) => Promise<ClaimDeviceResponse>;
  isLoading: boolean;
  error: { message: string; status?: number } | null;
}

/**
 * Hook for managing device ownership (Claiming)
 */
export function useEdgeDevice(): UseEdgeDeviceReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);

  const claimDevice = async (deviceId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await edgeApi.claimDevice(deviceId);
      return response;
    } catch (err) {
      if (err instanceof EdgeApiError) {
        setError({ message: err.message, status: err.status });
      } else {
        setError({ message: err instanceof Error ? err.message : 'Failed to claim device' });
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { claimDevice, isLoading, error };
}

interface UsePatientVitalsReturn {
  data: EdgeHealthRecord | null;
  isLoading: boolean;
  error: { message: string; status?: number } | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for Real-time Vitals (Patient View)
 * Fetches /latest endpoint on mount and allows manual refresh.
 * Optimized for "One-Shot" device interactions.
 */
export function usePatientVitals(): UsePatientVitalsReturn {
  const [data, setData] = useState<EdgeHealthRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);

  const fetchVitals = useCallback(async () => {
    setIsLoading(true); // Set loading true on manual refresh
    try {
      const record = await edgeApi.getLatestVitals();
      setData(record);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setData(null);
      if (err instanceof EdgeApiError) {
        setError({ message: err.message, status: err.status });
      } else {
        setError({ message: err instanceof Error ? err.message : 'Failed to fetch vitals' });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVitals();
    // No polling interval
  }, [fetchVitals]);

  return { data, isLoading, error, refresh: fetchVitals };
}

interface UsePatientHistoryReturn {
  history: EdgeHealthRecord[];
  isLoading: boolean;
  error: { message: string; status?: number } | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for Doctor View - Historical Data
 * Fetches all records and filters by device_id client-side.
 */
export function usePatientHistory(patientDeviceId?: string): UsePatientHistoryReturn {
  const [history, setHistory] = useState<EdgeHealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!patientDeviceId) {
      setHistory([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const allRecords = await edgeApi.getAllRecords();
      
      const patientRecords = allRecords.filter(
        record => record.device_id === patientDeviceId
      );

      patientRecords.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setHistory(patientRecords);
    } catch (err) {
      console.error("History fetch error:", err);
      if (err instanceof EdgeApiError) {
        setError({ message: err.message, status: err.status });
      } else {
        setError({ message: err instanceof Error ? err.message : 'Failed to fetch history' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [patientDeviceId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, isLoading, error, refresh: fetchHistory };
}
