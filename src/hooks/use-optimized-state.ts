"use client"

import { useState, useCallback, useMemo, useEffect } from "react"

// Hook para manejar estado de formularios de manera optimizada
export function useOptimizedFormState<T extends Record<string, unknown>>(initialState: T) {
  const [state, setState] = useState<T>(initialState)

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setState(prev => ({ ...prev, [field]: value }))
  }, [])

  const updateFields = useCallback((updates: Partial<T>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const resetForm = useCallback(() => {
    setState(initialState)
  }, [initialState])

  const isValid = useMemo(() => {
    return Object.values(state).every(value => 
      value !== null && value !== undefined && value !== ""
    )
  }, [state])

  return {
    state,
    updateField,
    updateFields,
    resetForm,
    isValid,
    setState
  }
}

// Hook para manejar listas de manera optimizada
export function useOptimizedList<T>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems)

  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item])
  }, [])

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }, [])

  const updateItem = useCallback((index: number, item: T) => {
    setItems(prev => prev.map((existingItem, i) => i === index ? item : existingItem))
  }, [])

  const clearItems = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = useMemo(() => items.length, [items.length])

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    clearItems,
    itemCount,
    setItems
  }
}

// Hook para manejar estado de carga optimizado
export function useOptimizedLoading() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: isLoading }))
  }, [])

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false
  }, [loadingStates])

  const isAnyLoading = useMemo(() => {
    return Object.values(loadingStates).some(Boolean)
  }, [loadingStates])

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    loadingStates
  }
}

// Hook para debounce optimizado
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
