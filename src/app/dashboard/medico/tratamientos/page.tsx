"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, User, Pill, Activity, Plus, Search, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useAuthContext } from "@/contexts/auth-context"
import { treatments } from "@/lib/api"
import type { TreatmentResponse } from "@/lib/api"
import { isDoctorUser } from "@/types/organization"
import { Loading } from "@/components/loading"

const estadoColors = {
  ACTIVE: "bg-primary/20 text-primary-foreground",
  PAUSED: "bg-primary/10 text-primary-foreground",
  COMPLETED: "bg-muted text-muted-foreground",
  SUSPENDED: "bg-muted/50 text-muted-foreground",
}

const tipoNames: Record<string, string> = {
  CHEMOTHERAPY: "Quimioterapia",
  RADIOTHERAPY: "Radioterapia",
  IMMUNOTHERAPY: "Inmunoterapia",
  SURGERY: "Cirugía",
  HORMONE_THERAPY: "Terapia Hormonal",
  TARGETED_THERAPY: "Terapia Dirigida"
}

const estadoNames: Record<string, string> = {
  ACTIVE: "Activo",
  PAUSED: "Pausado",
  COMPLETED: "Completado",
  SUSPENDED: "Suspendido"
}

export default function TratamientosPage() {
  const { user } = useAuthContext()
  const [doctorProfileId, setDoctorProfileId] = useState<number | null>(null)
  const [tratamientosList, setTratamientosList] = useState<TreatmentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [filtroTipo, setFiltroTipo] = useState("todos")

  useEffect(() => {
    if (user && isDoctorUser(user)) {
      setDoctorProfileId(user.profile.id)
    }
  }, [user])

  useEffect(() => {
    const loadTreatments = async () => {
      if (!doctorProfileId) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await treatments.getDoctorTreatments(doctorProfileId)
        setTratamientosList(data)
      } catch (err) {
        console.error('Error loading treatments:', err)
        setError('Error al cargar los tratamientos')
      } finally {
        setIsLoading(false)
      }
    }

    loadTreatments()
  }, [doctorProfileId])

  const tratamientosFiltrados = tratamientosList.filter((tratamiento) => {
    const matchesSearch =
      tratamiento.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tipoNames[tratamiento.type]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tratamiento.protocol.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filtroEstado === "todos" || tratamiento.status === filtroEstado
    const matchesTipo = filtroTipo === "todos" || tratamiento.type === filtroTipo

    return matchesSearch && matchesEstado && matchesTipo
  })

  // Calculate stats
  const stats = {
    total: tratamientosList.length,
    activos: tratamientosList.filter(t => t.status === 'ACTIVE').length,
    pausados: tratamientosList.filter(t => t.status === 'PAUSED').length,
    completados: tratamientosList.filter(t => t.status === 'COMPLETED').length,
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <Loading message="Cargando tratamientos..." />
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Tratamientos</h1>
          <p className="text-gray-600 mt-1">Administra los protocolos de tratamiento de tus pacientes</p>
        </div>
        <Button className="oncontrol-gradient text-white" asChild>
          <Link href="/dashboard/medico/tratamientos/nuevo">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Tratamiento
          </Link>
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tratamientos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Activity className="w-8 h-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-primary">{stats.activos}</p>
            </div>
            <Pill className="w-8 h-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Pausados</p>
              <p className="text-2xl font-bold text-primary">{stats.pausados}</p>
            </div>
            <Clock className="w-8 h-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-muted-foreground">{stats.completados}</p>
            </div>
            <User className="w-8 h-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por paciente, tipo o protocolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="ACTIVE">Activos</SelectItem>
                <SelectItem value="PAUSED">Pausados</SelectItem>
                <SelectItem value="COMPLETED">Completados</SelectItem>
                <SelectItem value="SUSPENDED">Suspendidos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="CHEMOTHERAPY">Quimioterapia</SelectItem>
                <SelectItem value="RADIOTHERAPY">Radioterapia</SelectItem>
                <SelectItem value="IMMUNOTHERAPY">Inmunoterapia</SelectItem>
                <SelectItem value="SURGERY">Cirugía</SelectItem>
                <SelectItem value="HORMONE_THERAPY">Terapia Hormonal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tratamientos */}
      <div className="grid grid-cols-1 gap-4">
        {tratamientosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">
                {searchTerm || filtroEstado !== "todos" || filtroTipo !== "todos"
                  ? "No se encontraron tratamientos con los filtros aplicados"
                  : "No hay tratamientos registrados"}
              </p>
              {!searchTerm && filtroEstado === "todos" && filtroTipo === "todos" && (
                <Button className="oncontrol-gradient text-white" asChild>
                  <Link href="/dashboard/medico/tratamientos/nuevo">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Tratamiento
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          tratamientosFiltrados.map((tratamiento) => (
            <Card key={tratamiento.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{tratamiento.patientName}</h3>
                      <Badge className={estadoColors[tratamiento.status as keyof typeof estadoColors]}>
                        {estadoNames[tratamiento.status] || tratamiento.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Pill className="w-4 h-4" />
                        {tipoNames[tratamiento.type] || tratamiento.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        Protocolo: {tratamiento.protocol}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Ciclo {tratamiento.currentCycle}/{tratamiento.totalCycles}
                      </span>
                    </div>

                    {tratamiento.nextSession && (
                      <p className="text-sm text-gray-500">
                        Próxima sesión: {new Date(tratamiento.nextSession).toLocaleDateString('es-ES')}
                      </p>
                    )}

                    {tratamiento.notes && (
                      <p className="text-sm text-gray-600">{tratamiento.notes}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/medico/tratamientos/${tratamiento.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/medico/tratamientos/${tratamiento.id}/editar`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso del tratamiento</span>
                    <span>{tratamiento.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${tratamiento.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
