"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns"
import { es } from "date-fns/locale"

// Mock data
const mockAppointments = [
  {
    id: 1,
    patientName: "María González",
    patientId: 1,
    date: "2025-01-20",
    time: "09:00",
    duration: 60,
    type: "Consulta de seguimiento",
    status: "Confirmada",
    location: "Consultorio 205",
    notes: "Revisión post-quimioterapia",
    avatar: "/mujer-45-a-os-sonriente-paciente-oncolog-a.jpg",
  },
  {
    id: 2,
    patientName: "Carlos Mendoza",
    patientId: 2,
    date: "2025-01-20",
    time: "10:30",
    duration: 45,
    type: "Primera consulta",
    status: "Pendiente",
    location: "Consultorio 205",
    notes: "Evaluación inicial",
    avatar: "/hombre-62-a-os-profesional.jpg",
  },
  {
    id: 3,
    patientName: "Ana Rodríguez",
    patientId: 3,
    date: "2025-01-20",
    time: "14:00",
    duration: 30,
    type: "Revisión de tratamiento",
    status: "Confirmada",
    location: "Consultorio 205",
    notes: "Ajuste de medicación",
    avatar: "/mujer-38-a-os-determinada.jpg",
  },
  {
    id: 4,
    patientName: "Pedro Sánchez",
    patientId: 4,
    date: "2025-01-21",
    time: "11:00",
    duration: 60,
    type: "Consulta de seguimiento",
    status: "Confirmada",
    location: "Consultorio 205",
    notes: "Control mensual",
    avatar: "/hombre-55-a-os-optimista.jpg",
  },
  {
    id: 5,
    patientName: "Laura Torres",
    patientId: 5,
    date: "2025-01-22",
    time: "15:30",
    duration: 45,
    type: "Revisión de exámenes",
    status: "Pendiente",
    location: "Consultorio 205",
    notes: "Resultados de laboratorio",
    avatar: "/mujer-41-a-os-fuerte.jpg",
  },
]

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

export default function CalendarioPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [viewMode, setViewMode] = useState<"week" | "day">("week")
  const [selectedDate, setSelectedDate] = useState(new Date())

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getAppointmentsForDate = (date: Date) => {
    return mockAppointments.filter((apt) => isSameDay(parseISO(apt.date), date))
  }

  const getAppointmentAtTime = (date: Date, time: string) => {
    const appointments = getAppointmentsForDate(date)
    return appointments.find((apt) => apt.time === time)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmada":
        return "bg-primary/10 text-primary border-primary/20"
      case "Pendiente":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "Cancelada":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const previousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const today = new Date()

  return (
    <AuthGuard requiredUserType="medico">
      <DashboardLayout userType="medico">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Calendario de Citas</h1>
              <p className="text-muted-foreground">Gestiona tu agenda médica</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={viewMode} onValueChange={(value: "week" | "day") => setViewMode(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="day">Día</SelectItem>
                </SelectContent>
              </Select>
              <Button className="oncontrol-gradient text-white" asChild>
                <Link href="/dashboard/medico/citas/nueva">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Cita
                </Link>
              </Button>
            </div>
          </div>

          {/* Calendar Navigation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={previousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {format(weekStart, "d 'de' MMMM", { locale: es })} -{" "}
                    {format(addDays(weekStart, 6), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </h2>
                  <Button variant="outline" size="sm" onClick={nextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentWeek(today)}>
                  Hoy
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Week View */}
          {viewMode === "week" && (
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-8 border-b">
                  <div className="p-4 border-r bg-muted/30">
                    <span className="text-sm font-medium">Hora</span>
                  </div>
                  {weekDays.map((day, index) => (
                    <div key={index} className="p-4 border-r text-center">
                      <div className="text-sm font-medium">{format(day, "EEE", { locale: es })}</div>
                      <div className={`text-lg font-bold mt-1 ${isSameDay(day, today) ? "text-primary" : ""}`}>
                        {format(day, "d")}
                      </div>
                      <div className="text-xs text-muted-foreground">{getAppointmentsForDate(day).length} citas</div>
                    </div>
                  ))}
                </div>

                <div className="max-h-[600px] overflow-y-auto">
                  {timeSlots.map((time) => (
                    <div key={time} className="grid grid-cols-8 border-b min-h-[60px]">
                      <div className="p-3 border-r bg-muted/30 flex items-center">
                        <span className="text-sm font-medium">{time}</span>
                      </div>
                      {weekDays.map((day, dayIndex) => {
                        const appointment = getAppointmentAtTime(day, time)
                        return (
                          <div key={dayIndex} className="p-2 border-r relative">
                            {appointment && (
                              <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 text-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium truncate">{appointment.patientName}</span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                      <DropdownMenuItem>Editar cita</DropdownMenuItem>
                                      <DropdownMenuItem>Cancelar cita</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <div className="text-muted-foreground">{appointment.type}</div>
                                <Badge className={`${getStatusColor(appointment.status)} text-xs mt-1`}>
                                  {appointment.status}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Day View */}
          {viewMode === "day" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</CardTitle>
                  <CardDescription>{getAppointmentsForDate(selectedDate).length} citas programadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getAppointmentsForDate(selectedDate).map((appointment) => (
                      <div key={appointment.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex flex-col items-center">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{appointment.time}</span>
                        </div>
                        <Avatar>
                          <AvatarImage src={appointment.avatar || "/mujer-38-a-os-determinada.jpg"} alt={appointment.patientName} />
                          <AvatarFallback>
                            {appointment.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{appointment.patientName}</h3>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{appointment.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{appointment.duration} min</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas del Día</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{getAppointmentsForDate(selectedDate).length}</div>
                    <p className="text-sm text-muted-foreground">Citas totales</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {getAppointmentsForDate(selectedDate).filter((apt) => apt.status === "Confirmada").length}
                    </div>
                    <p className="text-sm text-muted-foreground">Confirmadas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {getAppointmentsForDate(selectedDate).filter((apt) => apt.status === "Pendiente").length}
                    </div>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {mockAppointments.filter((apt) => apt.status === "Confirmada").length}
                </div>
                <p className="text-sm text-muted-foreground">Citas confirmadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-secondary">
                  {mockAppointments.filter((apt) => apt.status === "Pendiente").length}
                </div>
                <p className="text-sm text-muted-foreground">Pendientes de confirmar</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent">
                  {mockAppointments.filter((apt) => isSameDay(parseISO(apt.date), today)).length}
                </div>
                <p className="text-sm text-muted-foreground">Citas hoy</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-destructive">
                  {
                    mockAppointments.filter(
                      (apt) => parseISO(apt.date) > today && parseISO(apt.date) <= addDays(today, 7),
                    ).length
                  }
                </div>
                <p className="text-sm text-muted-foreground">Esta semana</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
