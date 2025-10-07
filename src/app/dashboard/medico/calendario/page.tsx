"use client"

import { useState, useEffect } from "react"
import { useAuthContext, getUserId } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loading } from "@/components/loading"
import { appointments } from "@/lib/api"
import type { AppointmentResponse } from "@/lib/api"
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export default function CalendarPage() {
  const { user } = useAuthContext()
  const [appointmentsList, setAppointmentsList] = useState<AppointmentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'week' | 'month'>('week')

  useEffect(() => {
    const loadAppointments = async () => {
      if (!user) return
      
      try {
        setIsLoading(true)
        setError(null)

        const data = await appointments.getDoctorAppointments(getUserId(user))
        setAppointmentsList(data)

      } catch (err) {
        console.error('Error loading appointments:', err)
        setError('Error al cargar las citas')
      } finally {
        setIsLoading(false)
      }
    }

    loadAppointments()
  }, [user])

  const goToPrevious = () => {
    if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }
  }

  const goToNext = () => {
    if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointmentsList.filter(appointment => 
      isSameDay(parseISO(appointment.appointmentDate), date)
    )
  }

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

  const renderWeekView = () => {
    const startWeek = startOfWeek(currentDate)
    const days = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i))

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        <div className="p-2 text-center text-sm font-medium text-muted-foreground">
          Lun
        </div>
        <div className="p-2 text-center text-sm font-medium text-muted-foreground">
          Mar
        </div>
        <div className="p-2 text-center text-sm font-medium text-muted-foreground">
          Mié
        </div>
        <div className="p-2 text-center text-sm font-medium text-muted-foreground">
          Jue
        </div>
        <div className="p-2 text-center text-sm font-medium text-muted-foreground">
          Vie
        </div>
        <div className="p-2 text-center text-sm font-medium text-muted-foreground">
          Sáb
        </div>
        <div className="p-2 text-center text-sm font-medium text-muted-foreground">
          Dom
        </div>

        {/* Day cells */}
        {days.map((day) => {
          const dayAppointments = getAppointmentsForDate(day)
          const isToday = isSameDay(day, new Date())
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] p-2 border rounded-lg ${
                isToday ? 'bg-primary/10 border-primary/30' : 'bg-background'
              } ${!isCurrentMonth ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  isToday ? 'text-primary' : 'text-foreground'
                }`}>
                  {format(day, 'd')}
                </span>
                {dayAppointments.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {dayAppointments.length}
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-2 bg-white border rounded text-xs cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-1 mb-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">
                        {format(parseISO(appointment.appointmentDate), 'HH:mm')}
                      </span>
                    </div>
                    <p className="font-medium truncate">{appointment.patientName}</p>
                    <p className="text-muted-foreground truncate">{appointment.type}</p>
                    <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{dayAppointments.length - 3} más
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderMonthView = () => {
    const startMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startWeek = startOfWeek(startMonth)
    const endWeek = startOfWeek(addDays(endMonth, 7))
    
    const weeks = []
    let currentWeek = startWeek
    
    while (currentWeek <= endWeek) {
      const week = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))
      weeks.push(week)
      currentWeek = addWeeks(currentWeek, 1)
    }

    return (
      <div className="space-y-1">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day) => {
              const dayAppointments = getAppointmentsForDate(day)
              const isToday = isSameDay(day, new Date())
              const isCurrentMonth = day.getMonth() === currentDate.getMonth()

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[100px] p-1 border rounded ${
                    isToday ? 'bg-primary/10 border-primary/30' : 'bg-background'
                  } ${!isCurrentMonth ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${
                      isToday ? 'text-primary' : 'text-foreground'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {dayAppointments.length > 0 && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        {dayAppointments.length}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-1 bg-white border rounded text-xs cursor-pointer hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-1 mb-1">
                          <Clock className="h-2 w-2 text-muted-foreground" />
                          <span className="font-medium">
                            {format(parseISO(appointment.appointmentDate), 'HH:mm')}
                          </span>
                        </div>
                        <p className="font-medium truncate">{appointment.patientName}</p>
                        <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{dayAppointments.length - 2}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <Loading message="Cargando calendario..." />
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
              <h1 className="text-3xl font-bold text-foreground">Calendario</h1>
              <p className="text-muted-foreground">
                {format(currentDate, 'MMMM yyyy', { locale: es })} • {appointmentsList.length} citas
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/dashboard/medico/citas/nueva">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Cita
                </Link>
              </Button>
            </div>
          </div>

          {/* Calendar Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToPrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      Hoy
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                  <h2 className="text-xl font-semibold">
                    {view === 'week' 
                      ? `${format(startOfWeek(currentDate), 'd MMM', { locale: es })} - ${format(addDays(startOfWeek(currentDate), 6), 'd MMM yyyy', { locale: es })}`
                      : format(currentDate, 'MMMM yyyy', { locale: es })
                    }
                  </h2>
                </div>
                <Select value={view} onValueChange={(value: 'week' | 'month') => setView(value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Semana</SelectItem>
                    <SelectItem value="month">Mes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {view === 'week' ? renderWeekView() : renderMonthView()}
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          {getAppointmentsForDate(new Date()).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Citas de Hoy</CardTitle>
                <CardDescription>
                  {getAppointmentsForDate(new Date()).length} citas programadas para hoy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getAppointmentsForDate(new Date()).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {appointment.patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.type} • {appointment.durationMinutes} min
                          </p>
                          {appointment.location && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {appointment.location}
                  </div>
                          )}
                      </div>
                    </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {format(parseISO(appointment.appointmentDate), 'HH:mm')}
                        </p>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 ml-2">
                              <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/medico/citas/${appointment.id}`}>
                                Ver detalles
                              </Link>
                            </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
