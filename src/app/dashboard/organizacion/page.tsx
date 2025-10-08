"use client"

import { useEffect, useState } from 'react'
import { useAuthContext } from '@/contexts/auth-context'
import { useOrganizationDashboard } from '@/hooks/use-organizations'
import { isOrganizationUser } from '@/types/organization'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Loading } from '@/components/loading'
import { Users, Stethoscope, Activity, Plus, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function OrganizationDashboardPage() {
  const { user, isLoading: authLoading } = useAuthContext()
  const router = useRouter()
  
  // Get organization ID directly from user
  const organizationId = user && isOrganizationUser(user) ? user.id : null
  
  const { dashboard, isLoading, error, refetch } = useOrganizationDashboard(organizationId)

  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login if no user
      router.push('/auth/login')
    } else if (!authLoading && user && !isOrganizationUser(user)) {
      // Redirect if not an organization
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  // Early return after all hooks are called
  if (authLoading) {
    return <Loading message="Verificando autenticación..." />
  }

  if (!user) {
    return null
  }

  if (!isOrganizationUser(user)) {
    return null
  }

  return (
    <DashboardLayout>
      {(authLoading || isLoading) && <Loading message="Cargando dashboard..." />}
      
      {error && !authLoading && !isLoading && (
        <div className="flex items-center justify-center h-64">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => refetch()}>Intentar de nuevo</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {!authLoading && !isLoading && !error && dashboard && (
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Organización</h1>
          <p className="text-muted-foreground">{dashboard.organizationName}</p>
          <p className="text-sm text-muted-foreground">{dashboard.city}, {dashboard.country}</p>
        </div>
        <Button asChild className="oncontrol-gradient text-white hover:opacity-90 transition-opacity cursor-pointer">
          <Link href="/dashboard/organizacion/doctores/nuevo">
            <UserPlus className="mr-2 h-4 w-4" />
            Agregar Doctor
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Doctores</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totalDoctors}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboard.activeDoctors} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totalPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboard.activePatients} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Citas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totalAppointments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboard.upcomingAppointments} próximas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Pacientes/Doctor</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard.totalDoctors > 0 
                ? Math.round(dashboard.totalPatients / dashboard.totalDoctors) 
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Distribución
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Doctors List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Doctores</CardTitle>
              <CardDescription>Lista de médicos en tu organización</CardDescription>
            </div>
            <Button asChild variant="outline" className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <Link href="/dashboard/organizacion/doctores">Ver todos</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dashboard.doctors.length === 0 ? (
            <div className="text-center py-12">
              <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay doctores registrados</h3>
              <p className="text-muted-foreground mb-4">
                Comienza agregando doctores a tu organización
              </p>
              <Button asChild className="oncontrol-gradient text-white hover:opacity-90 transition-opacity cursor-pointer">
                <Link href="/dashboard/organizacion/doctores/nuevo">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Primer Doctor
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboard.doctors.slice(0, 5).map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex items-center justify-between p-4 border rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{doctor.email}</p>
                      <div className="flex items-center justify-end gap-1 text-xs mt-1">
                        {doctor.isAvailable ? (
                          <>
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-primary font-medium">Disponible</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                            <span className="text-muted-foreground">No disponible</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm" className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                      <Link href={`/dashboard/organizacion/doctores/${doctor.id}`}>Ver detalles</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
      )}
    </DashboardLayout>
  )
}

