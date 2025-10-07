"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loading } from "@/components/loading"
import { useAuthContext } from "@/contexts/auth-context"
import { treatments } from "@/lib/api"
import type { TreatmentResponse, TreatmentSessionResponse } from "@/lib/api"
import { isPatientUser } from "@/types/organization"
import { Calendar, Clock, Pill, Activity, AlertCircle, CheckCircle, Heart } from "lucide-react"

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

export default function TratamientoPacientePage() {
  const { user } = useAuthContext()
  const [patientProfileId, setPatientProfileId] = useState<number | null>(null)
  const [treatment, setTreatment] = useState<TreatmentResponse | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<TreatmentSessionResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("resumen")

  useEffect(() => {
    if (user && isPatientUser(user)) {
      setPatientProfileId(user.profile.id)
    }
  }, [user])

  useEffect(() => {
    const loadTreatment = async () => {
      if (!patientProfileId) return

      try {
        setIsLoading(true)
        setError(null)

        const currentTreatment = await treatments.getPatientCurrent(patientProfileId)
        
        // Si no hay tratamiento, es un caso válido (no un error)
        if (!currentTreatment) {
          setTreatment(null)
          setUpcomingSessions([])
          setIsLoading(false)
          return
        }

        const sessions = await treatments.getUpcomingSessions(patientProfileId).catch(() => [])
        
        setTreatment(currentTreatment)
        setUpcomingSessions(sessions)
      } catch (err) {
        console.error('Error loading treatment:', err)
        // Solo mostramos error si fue un problema real del servidor
        setError('Ocurrió un error al cargar el tratamiento')
        setTreatment(null)
        setUpcomingSessions([])
      } finally {
        setIsLoading(false)
      }
    }

    loadTreatment()
  }, [patientProfileId])

  if (isLoading) {
    return (
      <AuthGuard requiredRole="PATIENT">
        <DashboardLayout>
          <Loading message="Cargando tratamiento..." />
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (error || !treatment) {
    return (
      <AuthGuard requiredRole="PATIENT">
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {error || "No tienes un tratamiento activo en este momento"}
              </p>
              {error && (
                <Button onClick={() => window.location.reload()}>
                  Reintentar
                </Button>
              )}
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="PATIENT">
      <DashboardLayout>
        <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Tratamiento</h1>
        <p className="text-gray-600 mt-1">Información detallada sobre tu protocolo de tratamiento actual</p>
      </div>

      {/* Resumen del tratamiento */}
      <Card className="border-teal-200 bg-teal-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-teal-900">{treatment.protocol}</h2>
              <p className="text-teal-700">{tipoNames[treatment.type] || treatment.type}</p>
            </div>
            <Badge className="bg-teal-600 text-white">
              {estadoNames[treatment.status] || treatment.status}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-teal-700">Progreso del Tratamiento</p>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-teal-600 mb-1">
                  <span>
                    Ciclo {treatment.currentCycle} de {treatment.totalCycles}
                  </span>
                  <span>{treatment.progressPercentage}%</span>
                </div>
                <Progress value={treatment.progressPercentage} className="h-2" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-teal-700">Fecha de Inicio</p>
              <p className="text-teal-900 font-semibold">
                {new Date(treatment.startDate).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-teal-700">Próxima Sesión</p>
              <p className="text-teal-900 font-semibold">
                {treatment.nextSession 
                  ? new Date(treatment.nextSession).toLocaleDateString('es-ES')
                  : 'Por programar'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
          <TabsTrigger value="efectos">Efectos</TabsTrigger>
          <TabsTrigger value="sesiones">Sesiones</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" />
                  Estado Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ciclo Actual:</span>
                    <span className="font-semibold">
                      {treatment.currentCycle}/{treatment.totalCycles}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progreso:</span>
                    <span className="font-semibold">{treatment.progressPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado:</span>
                    <Badge className="bg-primary/20 text-primary-foreground">
                      {estadoNames[treatment.status] || treatment.status}
                    </Badge>
                  </div>
                  {treatment.effectiveness && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Efectividad:</span>
                      <span className="font-semibold">{treatment.effectiveness.toFixed(1)}%</span>
                    </div>
                  )}
                  {treatment.adherence && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adherencia:</span>
                      <span className="font-semibold">{treatment.adherence.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  Información Adicional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {treatment.location && (
                    <div>
                      <p className="text-sm text-gray-600">Ubicación:</p>
                      <p className="font-semibold">{treatment.location}</p>
                    </div>
                  )}
                  {treatment.sessionDurationMinutes && (
                    <div>
                      <p className="text-sm text-gray-600">Duración de sesión:</p>
                      <p className="font-semibold">{treatment.sessionDurationMinutes} minutos</p>
                    </div>
                  )}
                  {treatment.doctorName && (
                    <div>
                      <p className="text-sm text-gray-600">Tu médico:</p>
                      <p className="font-semibold">{treatment.doctorName}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {treatment.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Notas del Médico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{treatment.notes}</p>
              </CardContent>
            </Card>
          )}

          {treatment.preparationInstructions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-secondary" />
                  Instrucciones de Preparación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{treatment.preparationInstructions}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="medicamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                Medicamentos del Protocolo
              </CardTitle>
              <CardDescription>Medicamentos que forman parte de tu tratamiento actual</CardDescription>
            </CardHeader>
            <CardContent>
              {treatment.medications.length > 0 ? (
                <div className="space-y-4">
                  {treatment.medications.map((medicamento, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{medicamento}</h3>
                        <Badge variant="outline">Activo</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No hay medicamentos registrados para este tratamiento
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efectos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-secondary" />
                Efectos Secundarios Registrados
              </CardTitle>
              <CardDescription>Efectos secundarios que has experimentado durante el tratamiento</CardDescription>
            </CardHeader>
            <CardContent>
              {treatment.sideEffects.length > 0 ? (
                <div className="space-y-4">
                  {treatment.sideEffects.map((efecto, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900">{efecto}</h3>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No hay efectos secundarios registrados
                </p>
              )}
              <Button variant="secondary" className="mt-4" asChild>
                <a href="/dashboard/paciente/sintomas/nuevo">Reportar Nuevo Síntoma</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sesiones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Próximas Sesiones
              </CardTitle>
              <CardDescription>Sesiones programadas de tu tratamiento</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Sesión #{session.sessionNumber} - Ciclo {session.cycleNumber}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(session.sessionDate).toLocaleDateString('es-ES')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(session.sessionDate).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {session.location && (
                            <p className="text-sm text-gray-600 mt-1">{session.location}</p>
                          )}
                        </div>
                        <Badge variant="outline">{session.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No hay sesiones próximas programadas
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
