"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  X,
  AlertTriangle,
  Filter,
} from "lucide-react"
import { format, parseISO, isFuture, isPast } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

// Mock data
const mockAppointments = [
  {
    id: 1,
    doctorName: "Dr. Carlos Mendoza",
    doctorSpecialty: "Oncología Médica",
    date: "2025-01-22",
    time: "10:00",
    duration: 60,
    type: "Consulta de seguimiento",
    status: "Confirmada",
    location: "Consultorio 205",
    notes: "Revisión post-quimioterapia",
    canCancel: true,
    canReschedule: true,
    doctorAvatar: "/hombre-62-a-os-profesional.jpg",
  },
  {
    id: 2,
    doctorName: "Dr. Carlos Mendoza",
    doctorSpecialty: "Oncología Médica",
    date: "2025-01-25",
    time: "14:30",
    duration: 45,
    type: "Revisión de exámenes",
    status: "Pendiente",
    location: "Consultorio 205",
    notes: "Resultados de laboratorio",
    canCancel: true,
    canReschedule: true,
    doctorAvatar: "/hombre-62-a-os-profesional.jpg",
  },
  {
    id: 3,
    doctorName: "Dr. Ana Martínez",
    doctorSpecialty: "Radiología",
    date: "2025-01-28",
    time: "09:00",
    duration: 30,
    type: "Tomografía",
    status: "Confirmada",
    location: "Radiología - Piso 2",
    notes: "Tomografía de control",
    canCancel: false,
    canReschedule: false,
    doctorAvatar: "/hombre-62-a-os-profesional.jpg",
  },
  {
    id: 4,
    doctorName: "Dr. Carlos Mendoza",
    doctorSpecialty: "Oncología Médica",
    date: "2025-01-15",
    time: "11:00",
    duration: 60,
    type: "Consulta de seguimiento",
    status: "Completada",
    location: "Consultorio 205",
    notes: "Evaluación mensual",
    canCancel: false,
    canReschedule: false,
    doctorAvatar: "/hombre-62-a-os-profesional.jpg",
  },
  {
    id: 5,
    doctorName: "Dr. Carlos Mendoza",
    doctorSpecialty: "Oncología Médica",
    date: "2025-01-10",
    time: "15:30",
    duration: 45,
    type: "Primera consulta",
    status: "Cancelada",
    location: "Consultorio 205",
    notes: "Cancelada por el paciente",
    canCancel: false,
    canReschedule: false,
    doctorAvatar: "/hombre-62-a-os-profesional.jpg",
  },
]

export default function CitasPacientePage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [appointments, setAppointments] = useState(mockAppointments)

  const filteredAppointments = appointments.filter((appointment) => {
    if (statusFilter === "all") return true
    if (statusFilter === "upcoming") {
      return (
        isFuture(parseISO(`${appointment.date}T${appointment.time}`)) &&
        (appointment.status === "Confirmada" || appointment.status === "Pendiente")
      )
    }
    if (statusFilter === "past") {
      return (
        isPast(parseISO(`${appointment.date}T${appointment.time}`)) ||
        appointment.status === "Completada" ||
        appointment.status === "Cancelada"
      )
    }
    return appointment.status === statusFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmada":
        return "bg-primary/10 text-primary border-primary/20"
      case "Pendiente":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "Completada":
        return "bg-accent/10 text-accent border-accent/20"
      case "Cancelada":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmada":
        return <CheckCircle className="h-4 w-4" />
      case "Pendiente":
        return <Clock className="h-4 w-4" />
      case "Completada":
        return <CheckCircle className="h-4 w-4" />
      case "Cancelada":
        return <X className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const handleCancelAppointment = (appointmentId: number) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "Cancelada", canCancel: false, canReschedule: false } : apt,
      ),
    )
  }

  const upcomingAppointments = appointments.filter(
    (apt) =>
      isFuture(parseISO(`${apt.date}T${apt.time}`)) && (apt.status === "Confirmada" || apt.status === "Pendiente"),
  )

  const completedAppointments = appointments.filter((apt) => apt.status === "Completada")

  return (
    <AuthGuard requiredUserType="paciente">
      <DashboardLayout userType="paciente">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mis Citas</h1>
              <p className="text-muted-foreground">Gestiona tus citas médicas</p>
            </div>
            <Button className="oncontrol-gradient text-white" asChild>
              <Link href="/dashboard/paciente/citas/nueva">
                <Calendar className="mr-2 h-4 w-4" />
                Solicitar Nueva Cita
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{upcomingAppointments.length}</div>
                <p className="text-sm text-muted-foreground">Próximas citas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-secondary">
                  {appointments.filter((apt) => apt.status === "Pendiente").length}
                </div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent">{completedAppointments.length}</div>
                <p className="text-sm text-muted-foreground">Completadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-destructive">
                  {appointments.filter((apt) => apt.status === "Cancelada").length}
                </div>
                <p className="text-sm text-muted-foreground">Canceladas</p>
              </CardContent>
            </Card>
          </div>

          {/* Next Appointment Alert */}
          {upcomingAppointments.length > 0 && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                Tu próxima cita es el{" "}
                <strong>{format(parseISO(upcomingAppointments[0].date), "EEEE, d 'de' MMMM", { locale: es })}</strong> a
                las <strong>{upcomingAppointments[0].time}</strong> con{" "}
                <strong>{upcomingAppointments[0].doctorName}</strong>
              </AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las citas</SelectItem>
                    <SelectItem value="upcoming">Próximas</SelectItem>
                    <SelectItem value="past">Pasadas</SelectItem>
                    <SelectItem value="Confirmada">Confirmadas</SelectItem>
                    <SelectItem value="Pendiente">Pendientes</SelectItem>
                    <SelectItem value="Completada">Completadas</SelectItem>
                    <SelectItem value="Cancelada">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
          </Card>

          {/* Appointments List */}
          <div className="grid gap-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="oncontrol-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={appointment.doctorAvatar || "/hombre-62-a-os-profesional.jpg"}
                          alt={appointment.doctorName}
                        />
                        <AvatarFallback>
                          {appointment.doctorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{appointment.type}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{appointment.status}</span>
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>
                              {appointment.doctorName} • {appointment.doctorSpecialty}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(parseISO(appointment.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {appointment.time} • {appointment.duration} minutos
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{appointment.location}</span>
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground mt-3 p-3 bg-muted/50 rounded-lg">
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {appointment.canReschedule && (
                        <Button variant="outline" size="sm">
                          Reprogramar
                        </Button>
                      )}
                      {appointment.canCancel && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Cancelar
                        </Button>
                      )}
                      {appointment.status === "Completada" && (
                        <Button variant="outline" size="sm">
                          Ver Resumen
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay citas</h3>
                <p className="text-muted-foreground mb-4">
                  No tienes citas que coincidan con los filtros seleccionados.
                </p>
                <Button className="oncontrol-gradient text-white" asChild>
                  <Link href="/dashboard/paciente/citas/nueva">
                    <Calendar className="mr-2 h-4 w-4" />
                    Solicitar Nueva Cita
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Gestiona tus citas médicas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" asChild>
                  <Link href="/dashboard/paciente/citas/nueva">
                    <Calendar className="h-6 w-6" />
                    <span>Solicitar Nueva Cita</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                  <Phone className="h-6 w-6" />
                  <span>Contactar Clínica</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                  <Calendar className="h-6 w-6" />
                  <span>Ver Calendario</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
