"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Heart, Activity, Pill, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data
const mockPatientData = {
  name: "María González",
  age: 45,
  diagnosis: "Cáncer de mama",
  stage: "Estadio II",
  doctor: "Dr. Carlos Mendoza",
  treatmentStartDate: "2024-10-15",
  nextAppointment: "2025-01-22",
  treatmentProgress: 65,
  patientId: "PAC-2024-0847",
  bloodType: "O+",
  allergies: ["Penicilina", "Mariscos"],
  emergencyContact: {
    name: "Juan González",
    relationship: "Esposo",
    phone: "+51 987 654 321",
  },
}

const mockStats = {
  totalAppointments: 18,
  completedTreatments: 12,
  medicationAdherence: 92,
  symptomsReported: 23,
  upcomingAppointments: 3,
  daysInTreatment: 95,
  treatmentSessions: 16,
}

const mockUpcomingAppointments = [
  {
    id: 1,
    date: "2025-01-22",
    time: "10:00",
    type: "Consulta de seguimiento",
    doctor: "Dr. Carlos Mendoza",
    location: "Consultorio 205 - Oncología",
    status: "Confirmada",
    preparation: "Ayuno de 8 horas",
    estimatedDuration: "45 min",
  },
  {
    id: 2,
    date: "2025-01-25",
    time: "14:30",
    type: "Exámenes de laboratorio",
    doctor: "Laboratorio Central",
    location: "Piso 1 - Lab. Clínico",
    status: "Pendiente",
    preparation: "Ayuno de 12 horas",
    estimatedDuration: "30 min",
  },
  {
    id: 3,
    date: "2025-01-28",
    time: "09:00",
    type: "Sesión de quimioterapia",
    doctor: "Enfermera Ana Pérez",
    location: "Sala de Infusiones",
    status: "Programada",
    preparation: "Desayuno ligero",
    estimatedDuration: "3 horas",
  },
]

const mockCurrentMedications = [
  {
    id: 1,
    name: "Tamoxifeno",
    dosage: "20mg",
    frequency: "1 vez al día",
    nextDose: "20:00",
    adherence: 95,
    sideEffects: ["Sofocos leves", "Fatiga ocasional"],
    instructions: "Tomar con alimentos",
    prescribedBy: "Dr. Carlos Mendoza",
    startDate: "2024-10-15",
  },
  {
    id: 2,
    name: "Ácido Fólico",
    dosage: "5mg",
    frequency: "1 vez al día",
    nextDose: "08:00",
    adherence: 88,
    sideEffects: [],
    instructions: "Tomar en ayunas",
    prescribedBy: "Dr. Carlos Mendoza",
    startDate: "2024-10-20",
  },
  {
    id: 3,
    name: "Omeprazol",
    dosage: "20mg",
    frequency: "1 vez al día",
    nextDose: "08:00",
    adherence: 100,
    sideEffects: [],
    instructions: "30 min antes del desayuno",
    prescribedBy: "Dr. Carlos Mendoza",
    startDate: "2024-10-15",
  },
  {
    id: 4,
    name: "Ondansetrón",
    dosage: "8mg",
    frequency: "Según necesidad",
    nextDose: "PRN",
    adherence: 85,
    sideEffects: ["Estreñimiento leve"],
    instructions: "Para náuseas",
    prescribedBy: "Dr. Carlos Mendoza",
    startDate: "2024-11-01",
  },
]

const mockRecentSymptoms = [
  {
    id: 1,
    symptom: "Fatiga leve",
    severity: "Leve",
    date: "2025-01-17",
    time: "14:30",
    notes: "Después del tratamiento, duró 3 horas",
    triggers: ["Sesión de quimio"],
    managementActions: ["Descanso", "Hidratación"],
  },
  {
    id: 2,
    symptom: "Náuseas",
    severity: "Moderada",
    date: "2025-01-16",
    time: "08:00",
    notes: "Por la mañana, mejoró con medicación",
    triggers: ["Ayuno prolongado"],
    managementActions: ["Ondansetrón", "Comida ligera"],
  },
  {
    id: 3,
    symptom: "Dolor de cabeza",
    severity: "Leve",
    date: "2025-01-15",
    time: "16:00",
    notes: "Duró 2 horas, relacionado con estrés",
    triggers: ["Estrés", "Falta de sueño"],
    managementActions: ["Paracetamol", "Relajación"],
  },
  {
    id: 4,
    symptom: "Sofocos",
    severity: "Moderada",
    date: "2025-01-14",
    time: "22:00",
    notes: "Episodios nocturnos, 3 veces",
    triggers: ["Tamoxifeno"],
    managementActions: ["Ventilador", "Ropa ligera"],
  },
  {
    id: 5,
    symptom: "Pérdida de apetito",
    severity: "Leve",
    date: "2025-01-13",
    time: "12:00",
    notes: "Durante el almuerzo",
    triggers: ["Medicación"],
    managementActions: ["Comidas pequeñas", "Suplementos"],
  },
]


const mockTreatmentProgress = {
  totalSessions: 20,
  completedSessions: 13,
  nextSession: "2025-01-28",
  treatmentType: "Quimioterapia + Terapia hormonal",
  responseRate: "Buena respuesta",
  sideEffectsLevel: "Leves a moderados",
  qualityOfLife: 7.5, // sobre 10
}


export default function PacienteDashboard() {

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Leve":
        return "bg-primary/10 text-primary border-primary/20"
      case "Moderada":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "Severa":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <AuthGuard requiredUserType="paciente">
      <DashboardLayout userType="paciente">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi Dashboard</h1>
              <p className="text-muted-foreground">Bienvenida de vuelta, {mockPatientData.name}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/paciente/sintomas/nuevo">
                  <Plus className="mr-2 h-4 w-4" />
                  Reportar Síntoma
                </Link>
              </Button>
            </div>
          </div>

          {/* Patient Info Card */}
          <Card className="oncontrol-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/mujer-45-a-os-sonriente-paciente-oncolog-a.jpg" alt={mockPatientData.name} />
                  <AvatarFallback className="text-lg">MG</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{mockPatientData.name}</h2>
                  <p className="text-muted-foreground">
                    {mockPatientData.age} años • ID: {mockPatientData.patientId}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className="bg-accent/10 text-accent border-accent/20">{mockPatientData.diagnosis}</Badge>
                    <Badge variant="outline">{mockPatientData.stage}</Badge>
                    <Badge variant="outline">Tipo {mockPatientData.bloodType}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    En tratamiento desde {new Date(mockPatientData.treatmentStartDate).toLocaleDateString("es-PE")}(
                    {mockStats.daysInTreatment} días)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Doctor tratante</p>
                  <p className="font-medium">{mockPatientData.doctor}</p>
                  <p className="text-sm text-muted-foreground mt-2">Progreso del tratamiento</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={mockPatientData.treatmentProgress} className="w-24" />
                    <span className="text-sm font-medium">{mockPatientData.treatmentProgress}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mockTreatmentProgress.completedSessions}/{mockTreatmentProgress.totalSessions} sesiones
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.upcomingAppointments}</div>
                <p className="text-xs text-muted-foreground">{mockStats.totalAppointments} citas totales</p>
              </CardContent>
            </Card>

            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Adherencia</CardTitle>
                <Pill className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.medicationAdherence}%</div>
                <p className="text-xs text-muted-foreground">{mockCurrentMedications.length} medicamentos activos</p>
              </CardContent>
            </Card>

            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Síntomas</CardTitle>
                <Activity className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.symptomsReported}</div>
                <p className="text-xs text-muted-foreground">
                  {mockRecentSymptoms.filter((s) => s.severity !== "Leve").length} requieren atención
                </p>
              </CardContent>
            </Card>

            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calidad de Vida</CardTitle>
                <Heart className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTreatmentProgress.qualityOfLife}/10</div>
                <p className="text-xs text-muted-foreground">Calificación promedio</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Appointments */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Próximas Citas</CardTitle>
                    <CardDescription>Tus citas médicas programadas</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/paciente/citas">Ver Todas</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUpcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span className="text-xs font-medium">
                            {new Date(appointment.date).toLocaleDateString("es-PE", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{appointment.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.doctor} • {appointment.time}
                          </p>
                          <p className="text-xs text-muted-foreground">{appointment.location}</p>
                          <p className="text-xs text-muted-foreground">Preparación: {appointment.preparation}</p>
                          <p className="text-xs text-muted-foreground">Duración: {appointment.estimatedDuration}</p>
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
                  <Link href="/dashboard/paciente/tratamiento">
                    <Heart className="mr-2 h-4 w-4" />
                    Ver Mi Tratamiento
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/dashboard/paciente/medicamentos">
                    <Pill className="mr-2 h-4 w-4" />
                    Mis Medicamentos
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/dashboard/paciente/sintomas">
                    <Activity className="mr-2 h-4 w-4" />
                    Registro de Síntomas
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/dashboard/paciente/historial">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Mi Historial
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Medications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Medicamentos Actuales</CardTitle>
                    <CardDescription>Tu medicación diaria</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/paciente/medicamentos">Ver Todos</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCurrentMedications.map((medication) => (
                    <div key={medication.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <Pill className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">{medication.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {medication.dosage} • {medication.frequency}
                          </p>
                          <p className="text-xs text-muted-foreground">{medication.instructions}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {medication.nextDose === "PRN" ? "Según necesidad" : `Próxima: ${medication.nextDose}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-12 bg-muted rounded-full h-1">
                            <div
                              className="bg-secondary h-1 rounded-full"
                              style={{ width: `${medication.adherence}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{medication.adherence}%</span>
                        </div>
                        {medication.sideEffects.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Efectos: {medication.sideEffects.slice(0, 1).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Symptoms */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Síntomas Recientes</CardTitle>
                    <CardDescription>Últimos registros</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/paciente/sintomas">Ver Historial</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentSymptoms.slice(0, 4).map((symptom) => (
                    <div key={symptom.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-accent" />
                        <div>
                          <p className="font-medium">{symptom.symptom}</p>
                          <p className="text-sm text-muted-foreground">{symptom.notes}</p>
                          {symptom.managementActions.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Manejo: {symptom.managementActions.slice(0, 2).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getSeverityColor(symptom.severity)}>{symptom.severity}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(symptom.date).toLocaleDateString("es-PE")}
                        </p>
                        <p className="text-xs text-muted-foreground">{symptom.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
