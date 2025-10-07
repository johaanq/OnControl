"use client"

import { useState, useCallback } from 'react'
import { appointments, type AppointmentRequest, type AppointmentResponse } from '@/lib/api'

export function useAppointments() {
  const [appointmentsList, setAppointmentsList] = useState<AppointmentResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAppointments = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await appointments.getDoctorAppointments(startDate, endDate)
      setAppointmentsList(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar las citas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadPatientAppointments = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await appointments.getPatientAppointments(startDate, endDate)
      setAppointmentsList(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar las citas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createAppointment = useCallback(async (appointmentData: AppointmentRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const newAppointment = await appointments.create(appointmentData)
      setAppointmentsList(prev => [...prev, newAppointment])
      return newAppointment
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear la cita')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateAppointmentStatus = useCallback(async (id: number, status: string, reason?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const updatedAppointment = await appointments.updateStatus(id, status, reason)
      setAppointmentsList(prev => 
        prev.map(appointment => 
          appointment.id === id ? updatedAppointment : appointment
        )
      )
      return updatedAppointment
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la cita')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getAppointmentById = useCallback(async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const appointment = await appointments.getById(id)
      return appointment
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al obtener la cita')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getAppointmentTypes = useCallback(async () => {
    try {
      return await appointments.getTypes()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los tipos de cita')
      throw err
    }
  }, [])

  return {
    appointmentsList,
    isLoading,
    error,
    loadAppointments,
    loadPatientAppointments,
    createAppointment,
    updateAppointmentStatus,
    getAppointmentById,
    getAppointmentTypes,
  }
}
