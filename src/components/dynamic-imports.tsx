"use client"

import { lazy, Suspense } from "react"
import { Loading } from "./loading"

// Lazy load heavy pages
export const LazyMedicoTratamientosNuevo = lazy(() => 
  import("@/app/dashboard/medico/tratamientos/nuevo/page")
)

export const LazyPacienteSintomasNuevo = lazy(() => 
  import("@/app/dashboard/paciente/sintomas/nuevo/page")
)

export const LazyPacienteCitasNueva = lazy(() => 
  import("@/app/dashboard/paciente/citas/nueva/page")
)

export const LazyMedicoReportes = lazy(() => 
  import("@/app/dashboard/medico/reportes/page")
)

// Wrapper components with Suspense
export function MedicoTratamientosNuevoWithSuspense() {
  return (
    <Suspense fallback={<Loading message="Cargando formulario de tratamiento..." />}>
      <LazyMedicoTratamientosNuevo />
    </Suspense>
  )
}

export function PacienteSintomasNuevoWithSuspense() {
  return (
    <Suspense fallback={<Loading message="Cargando formulario de síntomas..." />}>
      <LazyPacienteSintomasNuevo />
    </Suspense>
  )
}

export function PacienteCitasNuevaWithSuspense() {
  return (
    <Suspense fallback={<Loading message="Cargando formulario de citas..." />}>
      <LazyPacienteCitasNueva />
    </Suspense>
  )
}

export function MedicoReportesWithSuspense() {
  return (
    <Suspense fallback={<Loading message="Cargando reportes..." />}>
      <LazyMedicoReportes />
    </Suspense>
  )
}
