"use client"

import { useState, useEffect } from 'react';
import { dashboard, organizations } from '@/lib/api';
import type {
  DoctorProfileResponse,
  OrganizationDashboardResponse,
  CreateDoctorRequest
} from '@/lib/api';

/**
 * Hook para obtener el dashboard de una organización (usa nuevo endpoint de dashboard)
 */
export function useOrganizationDashboard(organizationId: number | null, doctorIdFilter?: number) {
  const [dashboardData, setDashboardData] = useState<OrganizationDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    if (!organizationId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await dashboard.getOrganizationDashboard(organizationId, doctorIdFilter);
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [organizationId, doctorIdFilter]);

  return {
    dashboard: dashboardData,
    isLoading,
    error,
    refetch: loadDashboard
  };
}

/**
 * Hook para obtener los doctores de una organización
 */
export function useOrganizationDoctors(organizationId: number | null) {
  const [doctors, setDoctors] = useState<DoctorProfileResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDoctors = async () => {
    if (!organizationId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await organizations.getDoctors(organizationId);
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar doctores');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [organizationId]);

  return {
    doctors,
    isLoading,
    error,
    refetch: loadDoctors
  };
}

/**
 * Hook para obtener un doctor específico de una organización
 */
export function useOrganizationDoctor(organizationId: number | null, doctorId: number | null) {
  const [doctor, setDoctor] = useState<DoctorProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDoctor = async () => {
    if (!organizationId || !doctorId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await organizations.getDoctor(organizationId, doctorId);
      setDoctor(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar doctor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctor();
  }, [organizationId, doctorId]);

  return {
    doctor,
    isLoading,
    error,
    refetch: loadDoctor
  };
}

/**
 * Hook para acciones de organización (crear doctores, etc)
 */
export function useOrganizationActions(organizationId: number | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDoctor = async (data: CreateDoctorRequest): Promise<DoctorProfileResponse | null> => {
    if (!organizationId) {
      setError('ID de organización no disponible');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await organizations.createDoctor(organizationId, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear doctor');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createDoctor,
    isLoading,
    error
  };
}
