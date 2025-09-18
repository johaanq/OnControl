"use client"

import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Calendar, 
  Users, 
  Activity, 
  Heart, 
  Clock, 
  TrendingUp 
} from "lucide-react"

// Mock data
const mockStats = {
  totalPatients: 47,
  activePatients: 32,
  todayAppointments: 8,
  pendingMessages: 5,
  completedTreatments: 28,
  urgentCases: 3,
  monthlyGrowth: 12,
  satisfactionRate: 4.8,
}

const mockRecentPatients = [
  {
    id: 1,
    name: "María González",
    age: 45,
    diagnosis: "Cáncer de mama",
    status: "En tratamiento",
    lastVisit: "2025-01-15",
    nextAppointment: "2025-01-22",
    avatar: "/mujer-45-a-os-sonriente.jpg",
    treatmentWeek: 8,
    adherence: 95,
    riskLevel: "Bajo",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    age: 62,
    diagnosis: "Cáncer de próstata",
    status: "Seguimiento",
    lastVisit: "2025-01-14",
    nextAppointment: "2025-01-25",
    avatar: "/hombre-62-a-os-profesional.jpg",
    treatmentWeek: 16,
    adherence: 88,
    riskLevel: "Medio",
  },
  {
    id: 3,
    name: "Ana Rodríguez",
    age: 38,
    diagnosis: "Cáncer de pulmón",
    status: "En tratamiento",
    lastVisit: "2025-01-13",
    nextAppointment: "2025-01-20",
    avatar: "/mujer-38-a-os-determinada.jpg",
    treatmentWeek: 4,
    adherence: 92,
    riskLevel: "Alto",
  },
  {
    id: 4,
    name: "Roberto Silva",
    age: 55,
    diagnosis: "Cáncer colorrectal",
    status: "En tratamiento",
    lastVisit: "2025-01-12",
    nextAppointment: "2025-01-19",
    avatar: "/hombre-55-a-os-optimista.jpg",
    treatmentWeek: 12,
    adherence: 90,
    riskLevel: "Medio",
  },
  {
    id: 5,
    name: "Patricia Vega",
    age: 41,
    diagnosis: "Cáncer de ovario",
    status: "Seguimiento",
    lastVisit: "2025-01-11",
    nextAppointment: "2025-01-24",
    avatar: "/mujer-41-a-os-fuerte.jpg",
    treatmentWeek: 20,
    adherence: 97,
    riskLevel: "Bajo",
  },
]

const mockTodayAppointments = [
  {
    id: 1,
    patient: "María González",
    time: "09:00",
    type: "Consulta de seguimiento",
    status: "Confirmada",
    duration: "30 min",
    notes: "Revisar efectos secundarios",
  },
  {
    id: 2,
    patient: "Pedro Sánchez",
    time: "10:30",
    type: "Primera consulta",
    status: "Pendiente",
    duration: "45 min",
    notes: "Evaluación inicial",
  },
  {
    id: 3,
    patient: "Laura Torres",
    time: "11:30",
    type: "Revisión de tratamiento",
    status: "Confirmada",
    duration: "30 min",
    notes: "Ajuste de medicación",
  },
  {
    id: 4,
    patient: "Roberto Silva",
    time: "14:00",
    type: "Control post-cirugía",
    status: "Confirmada",
    duration: "30 min",
    notes: "Evaluación de recuperación",
  },
  {
    id: 5,
    patient: "Carmen López",
    time: "15:30",
    type: "Consulta de resultados",
    status: "Confirmada",
    duration: "30 min",
    notes: "Discutir exámenes",
  },
  {
    id: 6,
    patient: "José Martínez",
    time: "16:00",
    type: "Seguimiento",
    status: "Pendiente",
    duration: "30 min",
    notes: "Control mensual",
  },
]



export default function MedicoDashboard() {

  return (
    <AuthGuard requiredUserType="medico">
      <DashboardLayout userType="medico">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard Médico</h1>
              <p className="text-muted-foreground">Bienvenido de vuelta, Dr. Mendoza</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/medico/pacientes/nuevo">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Paciente
                </Link>
              </Button>
              <Button className="oncontrol-gradient text-white" asChild>
                <Link href="/dashboard/medico/citas/nueva">
                  <Calendar className="mr-2 h-4 w-4" />
                  Nueva Cita
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pacientes Totales</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalPatients}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">+{mockStats.monthlyGrowth}</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>

            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
                <Activity className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.activePatients}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((mockStats.activePatients / mockStats.totalPatients) * 100)}% del total
                </p>
              </CardContent>
            </Card>

            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
                <Calendar className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.todayAppointments}</div>
                <p className="text-xs text-muted-foreground">
                  {mockTodayAppointments.filter((a) => a.status === "Confirmada").length} confirmadas,{" "}
                  {mockTodayAppointments.filter((a) => a.status === "Pendiente").length} pendientes
                </p>
              </CardContent>
            </Card>

            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
                <Heart className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.satisfactionRate}/5</div>
                <p className="text-xs text-muted-foreground">Calificación promedio</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Appointments */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Citas de Hoy</CardTitle>
                    <CardDescription>Agenda del {new Date().toLocaleDateString("es-PE")}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/medico/calendario">Ver Calendario</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTodayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{appointment.time}</span>
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patient}</p>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        </div>
                      </div>
                      <Badge
                        variant={appointment.status === "Confirmada" ? "default" : "secondary"}
                        className={
                          appointment.status === "Confirmada" ? "bg-primary/10 text-primary border-primary/20" : ""
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Tareas frecuentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/dashboard/medico/pacientes">
                    <Users className="mr-2 h-4 w-4" />
                    Ver Todos los Pacientes
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/dashboard/medico/tratamientos">
                    <Heart className="mr-2 h-4 w-4" />
                    Gestionar Tratamientos
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/dashboard/medico/reportes">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Ver Reportes
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Patients */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pacientes Recientes</CardTitle>
                    <CardDescription>Últimas actualizaciones</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/medico/pacientes">Ver Todos</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentPatients.slice(0, 4).map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={patient.avatar || "/mujer-45-a-os-sonriente.jpg"} alt={patient.name} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.diagnosis} • {patient.age} años
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={
                                patient.riskLevel === "Alto"
                                  ? "border-destructive/50 text-destructive"
                                  : patient.riskLevel === "Medio"
                                    ? "border-secondary/50 text-secondary"
                                    : "border-primary/50 text-primary"
                              }
                            >
                              {patient.riskLevel}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Semana {patient.treatmentWeek}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={patient.status === "En tratamiento" ? "default" : "secondary"}
                          className={
                            patient.status === "En tratamiento"
                              ? "bg-secondary/10 text-secondary border-secondary/20"
                              : ""
                          }
                        >
                          {patient.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Adherencia: {patient.adherence}%</p>
                        <p className="text-xs text-muted-foreground">
                          Próxima: {new Date(patient.nextAppointment).toLocaleDateString("es-PE")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Treatment Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Tratamientos</CardTitle>
              <CardDescription>Estado general de los tratamientos activos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tratamientos Completados</span>
                    <span className="text-sm text-muted-foreground">12/18</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  <p className="text-xs text-muted-foreground">67% de éxito este mes</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Adherencia Promedio</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground">Muy buena adherencia</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Satisfacción Pacientes</span>
                    <span className="text-sm text-muted-foreground">4.8/5</span>
                  </div>
                  <Progress value={96} className="h-2" />
                  <p className="text-xs text-muted-foreground">Excelente calificación</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
