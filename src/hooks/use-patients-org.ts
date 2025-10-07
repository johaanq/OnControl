import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import type {
  PatientProfile,
  PatientRegistrationFormData,
  PatientStats,
  PatientFilters
} from '@/types/organization';

export function useOrganizationPatients(filters?: PatientFilters) {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getOrganizationPatients(filters);
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pacientes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [filters]);

  return {
    patients,
    isLoading,
    error,
    refetch: loadPatients
  };
}

export function usePatient(id: number | null) {
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatient = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getPatient(id);
      setPatient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar paciente');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatient();
  }, [id]);

  return {
    patient,
    isLoading,
    error,
    refetch: loadPatient
  };
}

export function usePatientStats(id: number | null) {
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getPatientStats(id);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [id]);

  return {
    stats,
    isLoading,
    error,
    refetch: loadStats
  };
}

export function useDoctorPatients(doctorId: number | null, filters?: PatientFilters) {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDoctorPatients = async () => {
    if (!doctorId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getDoctorPatients(doctorId, filters);
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pacientes del doctor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorPatients();
  }, [doctorId, filters]);

  return {
    patients,
    isLoading,
    error,
    refetch: loadDoctorPatients
  };
}

export function usePatientActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPatient = async (data: PatientRegistrationFormData): Promise<PatientProfile | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiClient.createPatient(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear paciente');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePatient = async (id: number, data: Partial<PatientRegistrationFormData>): Promise<PatientProfile | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiClient.updatePatient(id, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar paciente');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPatient,
    updatePatient,
    isLoading,
    error
  };
}
