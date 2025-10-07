"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loading } from "@/components/loading"
import { useAuthContext } from "@/contexts/auth-context"
import { reports } from "@/lib/api"
import type { 
  DoctorReportsResponse, 
  PatientsByMonthResponse, 
  TreatmentsByTypeResponse,
  AppointmentsByDayResponse 
} from "@/lib/api"
import { isDoctorUser } from "@/types/organization"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Heart, 
  Activity,
  Download,
  Filter,
  PieChart,
  LineChart
} from "lucide-react"

const tipoNames: Record<string, string> = {
  CHEMOTHERAPY: "Quimioterapia",
  RADIOTHERAPY: "Radioterapia",
  IMMUNOTHERAPY: "Inmunoterapia",
  SURGERY: "Cirugía",
  HORMONE_THERAPY: "Terapia Hormonal",
  TARGETED_THERAPY: "Terapia Dirigida"
}

const dayNames: Record<string, string> = {
  MONDAY: "Lun",
  TUESDAY: "Mar",
  WEDNESDAY: "Mié",
  THURSDAY: "Jue",
  FRIDAY: "Vie",
  SATURDAY: "Sáb",
  SUNDAY: "Dom"
}

export default function ReportesPage() {
  const { user } = useAuthContext()
  const [doctorProfileId, setDoctorProfileId] = useState<number | null>(null)
  const [overview, setOverview] = useState<DoctorReportsResponse | null>(null)
  const [patientsByMonth, setPatientsByMonth] = useState<PatientsByMonthResponse | null>(null)
  const [treatmentsByType, setTreatmentsByType] = useState<TreatmentsByTypeResponse | null>(null)
  const [appointmentsByDay, setAppointmentsByDay] = useState<AppointmentsByDayResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mes")

  useEffect(() => {
    if (user && isDoctorUser(user)) {
      setDoctorProfileId(user.profile.id)
    }
  }, [user])

  useEffect(() => {
    const loadReports = async () => {
      if (!doctorProfileId) return

      try {
        setIsLoading(true)
        setError(null)

        // Load all report data in parallel
        const [overviewData, monthData, typeData, dayData] = await Promise.all([
          reports.getDoctorOverview(doctorProfileId).catch(() => null),
          reports.getPatientsByMonth(doctorProfileId, 6).catch(() => ({ data: [] })),
          reports.getTreatmentsByType(doctorProfileId).catch(() => ({ data: [] })),
          reports.getAppointmentsByDay(doctorProfileId).catch(() => ({ data: [] }))
        ])

        setOverview(overviewData)
        setPatientsByMonth(monthData)
        setTreatmentsByType(typeData)
        setAppointmentsByDay(dayData)
      } catch (err) {
        console.error('Error loading reports:', err)
        setError('Error al cargar los reportes')
      } finally {
        setIsLoading(false)
      }
    }

    loadReports()
  }, [doctorProfileId])

  const generarReporte = () => {
    console.log("Generando reporte:", { periodoSeleccionado })
    // TODO: Implementar generación de reportes personalizados
  }

  const exportarReporte = () => {
    console.log("Exportando reporte")
    // TODO: Implementar exportación a PDF
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <Loading message="Cargando reportes..." />
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (error || !overview) {
    return (
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || 'Error al cargar los datos'}</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
      <AuthGuard requiredRole="DOCTOR">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reportes y Análisis</h1>
              <p className="text-muted-foreground">Análisis detallado del rendimiento y métricas</p>
            </div>
            <div className="flex gap-3">
              <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                <SelectTrigger className="w-[150px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mes</SelectItem>
                  <SelectItem value="trimestre">Este trimestre</SelectItem>
                  <SelectItem value="año">Este año</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={generarReporte}>
                <Filter className="mr-2 h-4 w-4" />
                Generar Reporte
              </Button>
              <Button className="oncontrol-gradient text-white" onClick={exportarReporte}>
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pacientes Totales</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.patients.total}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">+{overview.patients.monthlyGrowth}</span> este mes
                </p>
              </CardContent>
            </Card>

            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tratamientos Activos</CardTitle>
                <Activity className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.treatments.active}</div>
                <p className="text-xs text-muted-foreground">
                  {overview.treatments.averageEffectiveness.toFixed(0)}% efectividad
                </p>
              </CardContent>
            </Card>

            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Citas Este Mes</CardTitle>
                <Calendar className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.appointments.totalMonth}</div>
                <p className="text-xs text-muted-foreground">
                  {overview.appointments.averageOccupancy.toFixed(0)}% ocupación promedio
                </p>
              </CardContent>
            </Card>

            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
                <Heart className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.patients.averageSatisfaction.toFixed(1)}/5</div>
                <p className="text-xs text-muted-foreground">Promedio de pacientes</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de pacientes por mes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Crecimiento de Pacientes
                </CardTitle>
                <CardDescription>Evolución mensual de pacientes registrados</CardDescription>
              </CardHeader>
              <CardContent>
                {patientsByMonth?.data && patientsByMonth.data.length > 0 ? (
                  <div className="space-y-4">
                    {patientsByMonth.data.map((item, index) => {
                      const maxCount = Math.max(...patientsByMonth.data.map(d => d.count))
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.monthName}</span>
                            <span className="text-sm text-muted-foreground">{item.count} pacientes</span>
                          </div>
                          <Progress 
                            value={(item.count / (maxCount || 1)) * 100} 
                            className="h-2" 
                          />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay datos de pacientes disponibles
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Distribución de tratamientos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribución de Tratamientos
                </CardTitle>
                <CardDescription>Tipos de tratamiento más utilizados</CardDescription>
              </CardHeader>
              <CardContent>
                {treatmentsByType?.data && treatmentsByType.data.length > 0 ? (
                  <div className="space-y-4">
                    {treatmentsByType.data.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {tipoNames[item.type] || item.type}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{item.count}</span>
                            <Badge variant="outline">{item.percentage.toFixed(0)}%</Badge>
                          </div>
                        </div>
                        <Progress 
                          value={item.percentage} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay tratamientos registrados
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Análisis detallado */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rendimiento de citas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Rendimiento de Citas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completadas</span>
                    <span className="text-sm text-primary font-semibold">{overview.appointments.completed}</span>
                  </div>
                  <Progress 
                    value={overview.appointments.totalMonth > 0 
                      ? (overview.appointments.completed / overview.appointments.totalMonth) * 100 
                      : 0
                    } 
                    className="h-2" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Canceladas</span>
                    <span className="text-sm text-muted-foreground">{overview.appointments.cancelled}</span>
                  </div>
                  <Progress 
                    value={overview.appointments.totalMonth > 0 
                      ? (overview.appointments.cancelled / overview.appointments.totalMonth) * 100 
                      : 0
                    } 
                    className="h-2" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reprogramadas</span>
                    <span className="text-sm text-foreground">{overview.appointments.rescheduled}</span>
                  </div>
                  <Progress 
                    value={overview.appointments.totalMonth > 0 
                      ? (overview.appointments.rescheduled / overview.appointments.totalMonth) * 100 
                      : 0
                    } 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Adherencia al tratamiento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Adherencia al Tratamiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {overview.treatments.averageAdherence.toFixed(0)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Adherencia promedio</p>
                </div>
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Activos:</span>
                    <span className="font-semibold">{overview.treatments.active}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completados:</span>
                    <span className="font-semibold">{overview.treatments.completed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pausados:</span>
                    <span className="font-semibold">{overview.treatments.paused}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Suspendidos:</span>
                    <span className="font-semibold">{overview.treatments.suspended}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumen de pacientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estado de Pacientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-sm font-bold">{overview.patients.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Activos</span>
                    <span className="text-sm text-primary font-semibold">{overview.patients.active}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">En seguimiento</span>
                    <span className="text-sm text-muted-foreground">{overview.patients.followUp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Nuevos</span>
                    <span className="text-sm text-primary">{overview.patients.newConsultations}</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {overview.patients.averageSatisfaction.toFixed(1)}/5.0
                    </div>
                    <p className="text-xs text-muted-foreground">Satisfacción promedio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Citas por día de la semana */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Distribución Semanal de Citas
              </CardTitle>
              <CardDescription>Patrón de citas por día de la semana</CardDescription>
            </CardHeader>
            <CardContent>
              {appointmentsByDay?.data && appointmentsByDay.data.length > 0 ? (
                <div className="grid grid-cols-7 gap-4">
                  {appointmentsByDay.data.map((item, index) => {
                    const maxCount = Math.max(...appointmentsByDay.data.map(d => d.count))
                    return (
                      <div key={index} className="text-center space-y-2">
                        <div className="text-sm font-medium">{dayNames[item.day] || item.dayName}</div>
                        <div className="text-2xl font-bold text-primary">{item.count}</div>
                        <Progress 
                          value={(item.count / (maxCount || 1)) * 100} 
                          className="h-2" 
                        />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay datos de citas disponibles
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
