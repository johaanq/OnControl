"use client"

import { lazy, Suspense } from "react"
import { Loading } from "./loading"

// Lazy load heavy components
export const LazyCalendar = lazy(() => import("@/components/ui/calendar").then(module => ({ default: module.Calendar })))
export const LazyChart = lazy(() => import("lucide-react").then(module => ({ default: module.BarChart3 })))

// Wrapper components with Suspense
export function CalendarWithSuspense(props: React.ComponentProps<typeof LazyCalendar>) {
  return (
    <Suspense fallback={<Loading message="Cargando calendario..." size="sm" />}>
      <LazyCalendar {...props} />
    </Suspense>
  )
}

export function ChartWithSuspense(props: React.ComponentProps<typeof LazyChart>) {
  return (
    <Suspense fallback={<Loading message="Cargando gráfico..." size="sm" />}>
      <LazyChart {...props} />
    </Suspense>
  )
}
