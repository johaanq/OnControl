"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loading } from "@/components/loading"
import { useAuthContext } from "@/contexts/auth-context"
import { appointments } from "@/lib/api"
import type { AppointmentResponse } from "@/lib/api"
import { isDoctorUser } from "@/types/organization"
import { Search, Plus, Filter, MoreHorizontal, Eye, Calendar, Clock, MapPin, Check, CheckCircle, X } from "lucide-react"

export default function AppointmentsPage() {
  const { user } = useAuthContext()
  const [doctorProfileId, setDoctorProfileId] = useState<number | null>(null)
  const [appointmentsList, setAppointmentsList] = useState<AppointmentResponse[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    if (user && isDoctorUser(user)) {
      setDoctorProfileId(user.profile.id)
    }
  }, [user])

  useEffect(() => {
    const loadAppointments = async () => {
      if (!doctorProfileId) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await appointments.getDoctorAppointments(doctorProfileId)
        setAppointmentsList(data)
        setFilteredAppointments(data)
      } catch (err) {
        console.error('Error loading appointments:', err)
        setError('Error al cargar las citas')
      } finally {
        setIsLoading(false)
      }
    }

    loadAppointments()
  }, [doctorProfileId])

  useEffect(() => {
    let filtered = appointmentsList

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(appointment => appointment.status === statusFilter)
    }

    // Filter by date
    if (dateFilter !== "all") {
      const today = new Date()
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate)
        switch (dateFilter) {
          case "today":
            return appointmentDate.toDateString() === today.toDateString()
          case "tomorrow":
            const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
            return appointmentDate.toDateString() === tomorrow.toDateString()
          case "thisWeek":
            const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
            return appointmentDate >= today && appointmentDate <= weekEnd
          default:
            return true
        }
      })
    }

    // Sort by appointment date
    filtered.sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())

    setFilteredAppointments(filtered)
  }, [appointmentsList, searchTerm, statusFilter, dateFilter])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmada':
        return 'bg-primary/20 text-primary-foreground border-primary/30'
      case 'programada':
        return 'bg-primary/10 text-primary-foreground border-primary/20'
      case 'completada':
        return 'bg-muted text-muted-foreground border-muted'
      case 'cancelada':
        return 'bg-muted text-muted-foreground border-border'
      default:
        return 'bg-muted text-muted-foreground border-muted'
    }
  }

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmada':
        return 'Confirmada'
      case 'programada':
        return 'Programada'
      case 'completada':
        return 'Completada'
      case 'cancelada':
        return 'Cancelada'
      default:
        return status || 'N/A'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <Loading message="Cargando citas..." />
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestión de Citas</h1>
              <p className="text-muted-foreground">
                Administra tus citas médicas ({filteredAppointments.length} citas)
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/dashboard/medico/citas/nueva">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Cita
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/medico/calendario">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Calendario
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Citas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appointmentsList.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appointmentsList.filter(apt => {
                    const aptDate = new Date(apt.appointmentDate)
                    const today = new Date()
                    return aptDate.toDateString() === today.toDateString()
                  }).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appointmentsList.filter(apt => apt.status === 'Confirmada').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appointmentsList.filter(apt => apt.status === 'Programada').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por paciente, tipo o notas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Programada">Programadas</SelectItem>
                    <SelectItem value="Confirmada">Confirmadas</SelectItem>
                    <SelectItem value="Completada">Completadas</SelectItem>
                    <SelectItem value="Cancelada">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por fecha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las fechas</SelectItem>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="tomorrow">Mañana</SelectItem>
                    <SelectItem value="thisWeek">Esta semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
          </Card>

          {/* Appointments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Citas</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                      ? "No se encontraron citas con los filtros aplicados" 
                      : "No hay citas programadas"}
                  </p>
                  {!searchTerm && statusFilter === "all" && dateFilter === "all" && (
                    <Button asChild>
                      <Link href="/dashboard/medico/citas/nueva">
                        <Plus className="mr-2 h-4 w-4" />
                        Programar Primera Cita
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Fecha y Hora</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{appointment.patientName}</p>
                            {appointment.notes && (
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {appointment.notes}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatDate(appointment.appointmentDate)}</p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(appointment.appointmentDate)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{appointment.type}</Badge>
                        </TableCell>
                        <TableCell>{appointment.durationMinutes} min</TableCell>
                        <TableCell>
                          {appointment.location ? (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[150px]">{appointment.location}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No especificada</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/medico/citas/${appointment.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Detalles
                                </Link>
                              </DropdownMenuItem>
                              {appointment.status === 'Programada' && (
                                <DropdownMenuItem>
                                  <Check className="mr-2 h-4 w-4" />
                                  Confirmar Cita
                                </DropdownMenuItem>
                              )}
                              {appointment.status === 'Confirmada' && (
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Marcar como Completada
                                </DropdownMenuItem>
                              )}
                              {(appointment.status === 'Programada' || appointment.status === 'Confirmada') && (
                                <DropdownMenuItem className="text-muted-foreground hover:text-foreground">
                                  <X className="mr-2 h-4 w-4" />
                                  Cancelar Cita
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
