"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pill, Clock, CheckCircle, Info, Bell, Calendar } from "lucide-react"

// Mock data
const mockMedications = [
  {
    id: 1,
    name: "Tamoxifeno",
    dosage: "20mg",
    frequency: "1 vez al día",
    nextDose: "20:00",
    adherence: 95,
    totalDoses: 30,
    takenDoses: 28,
    sideEffects: ["Sofocos", "Fatiga leve"],
    instructions: "Tomar con alimentos. Evitar pomelo.",
    startDate: "2024-10-15",
    endDate: "2025-04-15",
    active: true,
    reminders: true,
  },
  {
    id: 2,
    name: "Ácido Fólico",
    dosage: "5mg",
    frequency: "1 vez al día",
    nextDose: "08:00",
    adherence: 88,
    totalDoses: 30,
    takenDoses: 26,
    sideEffects: [],
    instructions: "Tomar en ayunas, 30 minutos antes del desayuno.",
    startDate: "2024-11-01",
    endDate: "2025-05-01",
    active: true,
    reminders: true,
  },
  {
    id: 3,
    name: "Omeprazol",
    dosage: "20mg",
    frequency: "1 vez al día",
    nextDose: "08:00",
    adherence: 100,
    totalDoses: 30,
    takenDoses: 30,
    sideEffects: [],
    instructions: "Tomar 30 minutos antes del desayuno.",
    startDate: "2024-10-20",
    endDate: "2025-01-20",
    active: true,
    reminders: false,
  },
  {
    id: 4,
    name: "Paracetamol",
    dosage: "500mg",
    frequency: "Según necesidad",
    nextDose: "Según necesidad",
    adherence: 0,
    totalDoses: 0,
    takenDoses: 0,
    sideEffects: [],
    instructions: "Para dolor o fiebre. Máximo 4 gramos al día.",
    startDate: "2024-10-15",
    endDate: "2025-04-15",
    active: false,
    reminders: false,
  },
]

const mockUpcomingDoses = [
  {
    id: 1,
    medication: "Ácido Fólico",
    time: "08:00",
    dosage: "5mg",
    taken: false,
  },
  {
    id: 2,
    medication: "Omeprazol",
    time: "08:00",
    dosage: "20mg",
    taken: false,
  },
  {
    id: 3,
    medication: "Tamoxifeno",
    time: "20:00",
    dosage: "20mg",
    taken: false,
  },
]

export default function MedicamentosPage() {
  const [medications, setMedications] = useState(mockMedications)
  const [upcomingDoses, setUpcomingDoses] = useState(mockUpcomingDoses)

  const toggleReminder = (medicationId: number) => {
    setMedications(medications.map((med) => (med.id === medicationId ? { ...med, reminders: !med.reminders } : med)))
  }

  const markDoseTaken = (doseId: number) => {
    setUpcomingDoses(upcomingDoses.map((dose) => (dose.id === doseId ? { ...dose, taken: true } : dose)))
  }

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return "text-primary"
    if (adherence >= 70) return "text-secondary"
    return "text-destructive"
  }

  const getAdherenceLevel = (adherence: number) => {
    if (adherence >= 90) return "Excelente"
    if (adherence >= 70) return "Buena"
    return "Necesita mejorar"
  }

  return (
    <AuthGuard requiredUserType="paciente">
      <DashboardLayout userType="paciente">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mis Medicamentos</h1>
              <p className="text-muted-foreground">Gestiona tu medicación y recordatorios</p>
            </div>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Ver Calendario
            </Button>
          </div>

          {/* Today's Doses */}
          <Card>
            <CardHeader>
              <CardTitle>Dosis de Hoy</CardTitle>
              <CardDescription>Medicamentos programados para hoy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {upcomingDoses.map((dose) => (
                  <div
                    key={dose.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      dose.taken ? "bg-primary/5 border-primary/20" : "bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          dose.taken ? "bg-primary/10" : "bg-secondary/10"
                        }`}
                      >
                        {dose.taken ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <Pill className="h-5 w-5 text-secondary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{dose.medication}</p>
                        <p className="text-sm text-muted-foreground">
                          {dose.dosage} • {dose.time}
                        </p>
                      </div>
                    </div>
                    {!dose.taken && (
                      <Button
                        size="sm"
                        onClick={() => markDoseTaken(dose.id)}
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        Marcar como tomado
                      </Button>
                    )}
                    {dose.taken && <Badge className="bg-primary/10 text-primary border-primary/20">Tomado</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medications List */}
          <div className="grid gap-6">
            {medications.map((medication) => (
              <Card key={medication.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        {medication.name}
                        {medication.active ? (
                          <Badge className="bg-primary/10 text-primary border-primary/20">Activo</Badge>
                        ) : (
                          <Badge variant="outline">Según necesidad</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {medication.dosage} • {medication.frequency}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Switch checked={medication.reminders} onCheckedChange={() => toggleReminder(medication.id)} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Adherence */}
                  {medication.active && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Adherencia</span>
                        <span className={`text-sm font-medium ${getAdherenceColor(medication.adherence)}`}>
                          {medication.adherence}% • {getAdherenceLevel(medication.adherence)}
                        </span>
                      </div>
                      <Progress value={medication.adherence} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {medication.takenDoses} de {medication.totalDoses} dosis tomadas
                      </p>
                    </div>
                  )}

                  {/* Instructions */}
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>{medication.instructions}</AlertDescription>
                  </Alert>

                  {/* Side Effects */}
                  {medication.sideEffects.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Efectos secundarios reportados:</h4>
                      <div className="flex gap-2">
                        {medication.sideEffects.map((effect, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Treatment Period */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Inicio: {new Date(medication.startDate).toLocaleDateString("es-PE")}</span>
                    <span>Fin: {new Date(medication.endDate).toLocaleDateString("es-PE")}</span>
                  </div>

                  {/* Next Dose */}
                  {medication.active && medication.nextDose !== "Según necesidad" && (
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        Próxima dosis: <strong>{medication.nextDose}</strong>
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Medication Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Adherencia</CardTitle>
              <CardDescription>Tu progreso con la medicación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">92%</div>
                  <p className="text-sm text-muted-foreground">Adherencia promedio</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">3</div>
                  <p className="text-sm text-muted-foreground">Medicamentos activos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">2</div>
                  <p className="text-sm text-muted-foreground">Dosis pendientes hoy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
