"use client"

import { useEffect, useState } from 'react'
import { useAuthContext } from '@/contexts/auth-context'
import { useOrganizationDoctors } from '@/hooks/use-organizations'
import { isOrganizationUser } from '@/types/organization'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Loading } from '@/components/loading'
import { BackButton } from '@/components/ui/back-button'
import { Stethoscope, Search, UserPlus, Mail, Phone, Award, Activity } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DoctorsListPage() {
  const { user, isLoading: authLoading } = useAuthContext()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  
  // Get organization ID directly from user
  const organizationId = user && isOrganizationUser(user) ? user.id : null

  useEffect(() => {
    if (!authLoading && user && !isOrganizationUser(user)) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const { doctors, isLoading, error, refetch } = useOrganizationDoctors(organizationId)

  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      doctor.firstName.toLowerCase().includes(searchLower) ||
      doctor.lastName.toLowerCase().includes(searchLower) ||
      doctor.email.toLowerCase().includes(searchLower) ||
      doctor.specialization.toLowerCase().includes(searchLower)
    )
  })

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <Loading message="Cargando doctores..." />
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
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
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <BackButton fallbackUrl="/dashboard/organizacion" label="Volver al dashboard" />
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Doctores</h1>
            <p className="text-muted-foreground">Gestiona los médicos de tu organización</p>
          </div>
        <Button asChild className="oncontrol-gradient text-white hover:opacity-90 transition-opacity cursor-pointer">
          <Link href="/dashboard/organizacion/doctores/nuevo">
            <UserPlus className="mr-2 h-4 w-4" />
            Agregar Doctor
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o especialización..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 && searchTerm && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda
            </p>
          </CardContent>
        </Card>
      )}

      {filteredDoctors.length === 0 && !searchTerm && (
        <Card>
          <CardContent className="py-12 text-center">
            <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No hay doctores registrados</h3>
            <p className="text-muted-foreground mb-4">
              Comienza agregando doctores a tu organización
            </p>
            <Button asChild className="oncontrol-gradient text-white hover:opacity-90 transition-opacity cursor-pointer">
              <Link href="/dashboard/organizacion/doctores/nuevo">
                <UserPlus className="mr-2 h-4 w-4" />
                Agregar Primer Doctor
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {filteredDoctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </CardTitle>
                    <CardDescription>{doctor.specialization}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{doctor.email}</span>
                </div>
                
                {doctor.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{doctor.phone}</span>
                  </div>
                )}

                {doctor.licenseNumber && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{doctor.licenseNumber}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-1.5">
                    {doctor.isAvailable ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm font-medium text-primary">Disponible</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">No disponible</span>
                      </>
                    )}
                  </div>
                  {doctor.rating && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      <span>{doctor.rating.toFixed(1)} ({doctor.totalReviews || 0})</span>
                    </div>
                  )}
                </div>

                <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Link href={`/dashboard/organizacion/doctores/${doctor.id}`}>
                    Ver Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {doctors.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                Mostrando {filteredDoctors.length} de {doctors.length} doctores
              </span>
              <span>
                {doctors.filter(d => d.isAvailable).length} disponibles
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </DashboardLayout>
  )
}

