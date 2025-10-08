"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loading } from "@/components/loading"
import { useAuthContext } from "@/contexts/auth-context"
import { usePatientDashboard } from "@/hooks/use-patients"
import { isPatientUser } from "@/types/organization"
import { 
  Plus, 
  Calendar, 
  Activity, 
  Heart, 
  Clock,
  AlertTriangle,
  Stethoscope
} from "lucide-react"

export default function PacienteDashboard() {
  const { user } = useAuthContext()
  const [patientProfileId, setPatientProfileId] = useState<number | null>(null)

  useEffect(() => {
    if (user && isPatientUser(user)) {
      setPatientProfileId(user.profile.id)
    }
  }, [user])

  const { dashboard, isLoading, error, refetch } = usePatientDashboard(patientProfileId)

  if (isLoading) {
    return (
      <AuthGuard requiredRole="PATIENT">
        <DashboardLayout>
          <Loading message="Cargando dashboard..." />
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard requiredRole="PATIENT">
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (!dashboard) {
    return null
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-secondary/20 text-secondary-foreground border-secondary/30'
      case 'SEVERE':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20'
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'MILD':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'Crítico'
      case 'SEVERE':
        return 'Severo'
      case 'MODERATE':
        return 'Moderado'
      case 'MILD':
        return 'Leve'
      default:
        return severity || 'N/A'
    }
  }

  const criticalSymptoms = dashboard.recentSymptoms.filter(s => s.requiresMedicalAttention)

  return (
    <AuthGuard requiredRole="PATIENT">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi Dashboard</h1>
              <p className="text-muted-foreground">
                Bienvenido, {dashboard.patientName}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild className="oncontrol-gradient text-white hover:opacity-90 transition-opacity cursor-pointer">
                <Link href="/dashboard/paciente/sintomas/nuevo">
                  <Plus className="mr-2 h-4 w-4" />
                  Reportar Síntoma
                </Link>
              </Button>
              <Button asChild variant="outline" className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <Link href="/dashboard/paciente/citas/nueva">
                  <Calendar className="mr-2 h-4 w-4" />
                  Solicitar Cita
                </Link>
              </Button>
            </div>
          </div>

          {/* Critical Symptoms Alert */}
          {criticalSymptoms.length > 0 && (
            <Card className="border-secondary/30 bg-secondary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-secondary-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Atención: Síntomas que requieren atención médica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {criticalSymptoms.map((symptom) => (
                    <div key={symptom.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium">{symptom.symptomName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(symptom.occurrenceDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <Badge className={getSeverityColor(symptom.severity)}>
                        {getSeverityText(symptom.severity)}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button asChild className="w-full mt-4 hover:opacity-90 transition-opacity cursor-pointer" variant="secondary">
                  <Link href="/dashboard/paciente/citas/nueva">
                    Solicitar Cita de Emergencia
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard.upcomingAppointments}
                </div>
                <p className="text-xs text-muted-foreground">
                  Citas programadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Síntomas Recientes</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard.recentSymptoms.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Últimos 7 días
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Síntomas Severos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">
                  {dashboard.criticalSymptoms}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requieren atención
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Próximas Citas
                </CardTitle>
                <CardDescription>
                  {dashboard.upcomingAppointmentsList.length} citas programadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.upcomingAppointmentsList.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">
                        No tienes citas programadas
                      </p>
                      <Button asChild size="sm" variant="outline" className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                        <Link href="/dashboard/paciente/citas/nueva">
                          Solicitar Cita
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    dashboard.upcomingAppointmentsList.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{appointment.doctorName}</p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.type} • {appointment.durationMinutes} min
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(appointment.appointmentDate).toLocaleDateString('es-ES', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(appointment.appointmentDate).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {dashboard.upcomingAppointmentsList && dashboard.upcomingAppointmentsList.length > 0 && (
                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                      <Link href="/dashboard/paciente/citas">
                        Ver Todas las Citas
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Síntomas Recientes
                </CardTitle>
                <CardDescription>
                  Últimos {dashboard.recentSymptoms.length} síntomas reportados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.recentSymptoms.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">
                        No has reportado síntomas recientemente
                      </p>
                      <Button asChild size="sm" className="oncontrol-gradient text-white hover:opacity-90 transition-opacity cursor-pointer">
                        <Link href="/dashboard/paciente/sintomas/nuevo">
                          Reportar Síntoma
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    dashboard.recentSymptoms.slice(0, 5).map((symptom) => (
                      <div
                        key={symptom.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{symptom.symptomName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(symptom.occurrenceDate).toLocaleDateString('es-ES')} •{' '}
                            {symptom.occurrenceTime}
                          </p>
                        </div>
                        <Badge className={getSeverityColor(symptom.severity)}>
                          {getSeverityText(symptom.severity)}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
                {dashboard.recentSymptoms.length > 0 && (
                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                      <Link href="/dashboard/paciente/sintomas">
                        Ver Todos los Síntomas
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Accesos directos a las funciones más utilizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button asChild variant="outline" className="h-20 flex-col hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Link href="/dashboard/paciente/citas">
                    <Calendar className="h-6 w-6 mb-2" />
                    Mis Citas
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Link href="/dashboard/paciente/sintomas">
                    <Activity className="h-6 w-6 mb-2" />
                    Mis Síntomas
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Link href="/dashboard/paciente/historial">
                    <Heart className="h-6 w-6 mb-2" />
                    Mi Historial
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Link href="/dashboard/paciente/perfil">
                    <Stethoscope className="h-6 w-6 mb-2" />
                    Mi Perfil
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Patient Info */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle>Tu Información Médica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Doctor Asignado</p>
                  <p className="font-medium">{dashboard.doctorName || 'No asignado'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Sangre</p>
                  <p className="font-medium">{dashboard.bloodType || 'No especificado'}</p>
                </div>
                {dashboard.cancerType && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Diagnóstico</p>
                      <p className="font-medium">{dashboard.cancerType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Etapa</p>
                      <p className="font-medium">{dashboard.cancerStage || 'No especificada'}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="pt-4 border-t">
                <Button asChild variant="outline" size="sm" className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Link href="/dashboard/paciente/perfil">
                    Ver Perfil Completo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
