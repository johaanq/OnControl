"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Bell, 
  Calendar, 
  Heart, 
  CheckCircle, 
  Clock, 
  User, 
  Pill,
  Filter,
  CheckCheck,
  Trash2,
  Settings,
  Activity,
  FileText
} from "lucide-react"
import Link from "next/link"

// Mock data para notificaciones del paciente
const mockNotifications = [
  {
    id: 1,
    type: "appointment",
    title: "Recordatorio de cita",
    message: "Tu cita con el Dr. Carlos Mendoza está programada para mañana a las 10:00 AM",
    timestamp: "2025-01-17T14:30:00",
    isRead: false,
    priority: "high",
    appointmentId: 123,
    doctorName: "Dr. Carlos Mendoza",
    icon: Calendar,
    color: "text-blue-600"
  },
  {
    id: 2,
    type: "medication",
    title: "Hora de tomar medicamento",
    message: "Es hora de tomar tu dosis de Tamoxifeno (20mg)",
    timestamp: "2025-01-17T20:00:00",
    isRead: false,
    priority: "high",
    medicationId: 456,
    medicationName: "Tamoxifeno",
    icon: Pill,
    color: "text-green-600"
  },
  {
    id: 3,
    type: "treatment",
    title: "Progreso del tratamiento",
    message: "Has completado el 50% de tu tratamiento. ¡Sigue así!",
    timestamp: "2025-01-17T12:15:00",
    isRead: true,
    priority: "medium",
    treatmentId: 789,
    icon: Heart,
    color: "text-green-600"
  },
  {
    id: 4,
    type: "symptom",
    title: "Síntoma registrado",
    message: "Tu registro de fatiga leve ha sido recibido por tu equipo médico",
    timestamp: "2025-01-16T16:20:00",
    isRead: true,
    priority: "low",
    symptomId: 101,
    icon: Activity,
    color: "text-orange-600"
  },
  {
    id: 5,
    type: "lab",
    title: "Resultados de laboratorio",
    message: "Los resultados de tus análisis de sangre están disponibles",
    timestamp: "2025-01-16T10:00:00",
    isRead: true,
    priority: "medium",
    labId: 202,
    icon: FileText,
    color: "text-purple-600"
  },
  {
    id: 6,
    type: "appointment",
    title: "Cita reprogramada",
    message: "Tu cita del 20 de enero ha sido reprogramada para el 22 de enero a las 2:00 PM",
    timestamp: "2025-01-15T18:30:00",
    isRead: true,
    priority: "medium",
    appointmentId: 124,
    doctorName: "Dr. Carlos Mendoza",
    icon: Calendar,
    color: "text-orange-600"
  },
  {
    id: 7,
    type: "medication",
    title: "Nuevo medicamento",
    message: "Se ha agregado Ondansetrón a tu lista de medicamentos para las náuseas",
    timestamp: "2025-01-15T14:00:00",
    isRead: true,
    priority: "medium",
    medicationId: 303,
    medicationName: "Ondansetrón",
    icon: Pill,
    color: "text-blue-600"
  },
  {
    id: 8,
    type: "system",
    title: "Mantenimiento del sistema",
    message: "El sistema estará en mantenimiento el domingo 19 de enero de 2:00 AM a 4:00 AM",
    timestamp: "2025-01-14T10:00:00",
    isRead: true,
    priority: "low",
    icon: Settings,
    color: "text-gray-600"
  }
]

const notificationTypes = [
  { value: "all", label: "Todas las notificaciones" },
  { value: "appointment", label: "Citas" },
  { value: "medication", label: "Medicamentos" },
  { value: "treatment", label: "Tratamientos" },
  { value: "symptom", label: "Síntomas" },
  { value: "lab", label: "Laboratorio" },
  { value: "system", label: "Sistema" }
]

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200"
}

export default function NotificacionesPacientePage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filterType, setFilterType] = useState("all")
  const [filterRead, setFilterRead] = useState("all")

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === "all" || notification.type === filterType
    const matchesRead = filterRead === "all" || 
      (filterRead === "read" && notification.isRead) ||
      (filterRead === "unread" && !notification.isRead)
    return matchesType && matchesRead
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Hace un momento"
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`
  }

  const getNotificationAction = (notification: { type: string; appointmentId?: number; medicationId?: number; treatmentId?: number; symptomId?: number; labId?: number }) => {
    switch (notification.type) {
      case "appointment":
        return (
          <Button size="sm" variant="outline" asChild>
            <Link href={`/dashboard/paciente/citas?appointment=${notification.appointmentId}`}>
              Ver Cita
            </Link>
          </Button>
        )
      case "medication":
        return (
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/paciente/medicamentos">
              Ver Medicamentos
            </Link>
          </Button>
        )
      case "treatment":
        return (
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/paciente/tratamiento">
              Ver Tratamiento
            </Link>
          </Button>
        )
      case "symptom":
        return (
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/paciente/sintomas">
              Ver Síntomas
            </Link>
          </Button>
        )
      case "lab":
        return (
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/paciente/historial">
              Ver Resultados
            </Link>
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <AuthGuard requiredUserType="paciente">
      <DashboardLayout userType="paciente">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mis Notificaciones</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : "Todas las notificaciones leídas"}
              </p>
            </div>
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={markAllAsRead}>
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Marcar Todas como Leídas
                </Button>
              )}
            </div>
          </div>

          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de notificación</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select value={filterRead} onValueChange={setFilterRead}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="unread">Sin leer</SelectItem>
                      <SelectItem value="read">Leídas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de notificaciones */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay notificaciones</h3>
                  <p className="text-muted-foreground">
                    {filterType === "all" ? "No tienes notificaciones" : "No hay notificaciones de este tipo"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => {
                const IconComponent = notification.icon
                return (
                  <Card 
                    key={notification.id} 
                    className={`transition-all hover:shadow-md ${
                      !notification.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full bg-muted ${notification.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{notification.title}</h3>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                )}
                                <Badge className={priorityColors[notification.priority as keyof typeof priorityColors]}>
                                  {notification.priority === "high" ? "Alta" : 
                                   notification.priority === "medium" ? "Media" : "Baja"}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground text-sm mb-2">{notification.message}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {getTimeAgo(notification.timestamp)}
                                </span>
                                {notification.doctorName && (
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {notification.doctorName}
                                  </span>
                                )}
                                {notification.medicationName && (
                                  <span className="flex items-center gap-1">
                                    <Pill className="h-3 w-3" />
                                    {notification.medicationName}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              {getNotificationAction(notification)}
                              {!notification.isRead && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Notificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{notifications.length}</div>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
                  <p className="text-sm text-muted-foreground">Sin leer</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {notifications.filter(n => n.type === "appointment").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Citas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {notifications.filter(n => n.type === "medication").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Medicamentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
