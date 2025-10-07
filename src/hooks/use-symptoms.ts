"use client"

import { useState, useCallback } from 'react'
import { symptoms, type SymptomRequest, type SymptomResponse } from '@/lib/api'

export function useSymptoms() {
  const [symptomsList, setSymptomsList] = useState<SymptomResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSymptoms = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await symptoms.getAll(startDate, endDate)
      setSymptomsList(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los síntomas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadRecentSymptoms = useCallback(async (days?: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await symptoms.getRecent(days)
      setSymptomsList(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los síntomas recientes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createSymptom = useCallback(async (symptomData: SymptomRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const newSymptom = await symptoms.create(symptomData)
      setSymptomsList(prev => [...prev, newSymptom])
      return newSymptom
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar el síntoma')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getSymptomSeverities = useCallback(async () => {
    try {
      return await symptoms.getSeverities()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar severidades de síntomas')
      throw err
    }
  }, [])

  const getSymptomStats = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const stats = await symptoms.getStats()
      return stats
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar las estadísticas')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    symptomsList,
    isLoading,
    error,
    loadSymptoms,
    loadRecentSymptoms,
    createSymptom,
    getSymptomSeverities,
    getSymptomStats,
  }
}
