"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loading } from "@/components/loading"
import { useAuthContext } from "@/contexts/auth-context"
import { useDoctorDashboard } from "@/hooks/use-doctors"
import { isDoctorUser } from "@/types/organization"
import { 
  Plus, 
  Calendar, 
  Users, 
  Activity, 
  Heart, 
  Clock
} from "lucide-react"

export default function MedicoDashboard() {
  const { user, isAuthenticated } = useAuthContext()
  const [doctorProfileId, setDoctorProfileId] = useState<number | null>(null)

  useEffect(() => {
    if (user && isDoctorUser(user)) {
      setDoctorProfileId(user.profile.id)
    }
  }, [user])

  const { dashboard, isLoading, error, refetch } = useDoctorDashboard(doctorProfileId)

  if (isLoading) {
    return (
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <Loading message="Cargando dashboard..." />
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard requiredRole="DOCTOR">
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

  return (
    <AuthGuard requiredRole="DOCTOR">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard Médico</h1>
              <p className="text-muted-foreground">
                Bienvenido, Dr. {dashboard.doctorName}
              </p>
              <p className="text-sm text-muted-foreground">
                {dashboard.specialization} • {dashboard.organizationName}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild className="oncontrol-gradient text-white hover:opacity-90 transition-opacity cursor-pointer">
                <Link href="/dashboard/medico/pacientes/nuevo">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Paciente
                </Link>
              </Button>
              <Button asChild variant="outline" className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <Link href="/dashboard/medico/citas/nueva">
                  <Calendar className="mr-2 h-4 w-4" />
                  Nueva Cita
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard.totalPatients}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboard.activePatients} activos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Citas Totales</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard.totalAppointments}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboard.completedAppointments} completadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard.upcomingAppointments}
                </div>
                <p className="text-xs text-muted-foreground">
                  Por confirmar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Síntomas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard.totalSymptomsReported}
                </div>
                <p className="text-xs text-secondary font-semibold">
                  {dashboard.criticalSymptoms} críticos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Organización</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold truncate">
                  {dashboard.organizationName || 'Sin organización'}
                </div>
                <p className="text-xs text-muted-foreground">
                  ID: {dashboard.organizationId}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Próximas Citas
                </CardTitle>
                <CardDescription>
                  {dashboard.upcomingAppointmentsList.length} citas próximas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.upcomingAppointmentsList.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No hay citas próximas
                    </p>
                  ) : (
                    dashboard.upcomingAppointmentsList.slice(0, 5).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium">{appointment.patientName}</p>
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
                {dashboard.upcomingAppointmentsList.length > 0 && (
                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                      <Link href="/dashboard/medico/citas">
                        Ver Todas las Citas
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Patients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Mis Pacientes
                </CardTitle>
                <CardDescription>
                  {dashboard.patients.length} pacientes registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.patients.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">
                        No hay pacientes registrados
                      </p>
                      <Button asChild size="sm" className="oncontrol-gradient text-white hover:opacity-90 transition-opacity cursor-pointer">
                        <Link href="/dashboard/medico/pacientes/nuevo">
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar Primer Paciente
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    dashboard.patients.slice(0, 5).map((patient) => (
                      <div
                        key={patient.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {patient.firstName[0]}{patient.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {patient.cancerType || 'Sin diagnóstico'}
                          </p>
                        </div>
                        <Badge variant={patient.isActive ? 'default' : 'secondary'}>
                          {patient.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
                {dashboard.patients.length > 0 && (
                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                      <Link href="/dashboard/medico/pacientes">
                        Ver Todos los Pacientes ({dashboard.patients.length})
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
                  <Link href="/dashboard/medico/pacientes">
                    <Users className="h-6 w-6 mb-2" />
                    Gestionar Pacientes
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Link href="/dashboard/medico/citas">
                    <Calendar className="h-6 w-6 mb-2" />
                    Ver Citas
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Link href="/dashboard/medico/calendario">
                    <Calendar className="h-6 w-6 mb-2" />
                    Calendario
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Link href="/dashboard/medico/reportes">
                    <Activity className="h-6 w-6 mb-2" />
                    Reportes
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Info */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle>Tu Perfil Profesional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Especialización</p>
                  <p className="font-medium">{dashboard.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Licencia</p>
                  <p className="font-medium">{dashboard.organizationName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Experiencia</p>
                  <p className="font-medium">
                    {dashboard.totalPatients || 0} años
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Calificación</p>
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-secondary" />
                    <p className="font-medium">
                      {dashboard.doctorId?.toFixed(1) || 'N/A'} ({dashboard.activePatients || 0} reseñas)
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button asChild variant="outline" size="sm" className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Link href="/dashboard/medico/perfil">
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
