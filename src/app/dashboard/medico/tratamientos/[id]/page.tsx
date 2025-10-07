"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loading } from "@/components/loading"
import { useAuthContext } from "@/contexts/auth-context"
import { treatments, doctors } from "@/lib/api"
import type { TreatmentResponse, TreatmentSessionResponse, PatientProfileResponse } from "@/lib/api"
import { isDoctorUser } from "@/types/organization"
import { 
  ArrowLeft,
  Activity, 
  Calendar, 
  Clock,
  Heart,
  Pill,
  FileText,
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
  Edit,
  PlayCircle,
  PauseCircle
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function TreatmentDetailsPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const params = useParams()
  const treatmentId = params.id as string
  
  const [doctorProfileId, setDoctorProfileId] = useState<number | null>(null)
  const [treatment, setTreatment] = useState<TreatmentResponse | null>(null)
  const [sessions, setSessions] = useState<TreatmentSessionResponse[]>([])
  const [patient, setPatient] = useState<PatientProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user && isDoctorUser(user)) {
      setDoctorProfileId(user.profile.id)
    }
  }, [user])

  useEffect(() => {
    const loadTreatmentData = async () => {
      if (!doctorProfileId) return
      
      setIsLoading(true)
      setError("")
      
      try {
        // Get treatment by ID from doctor's treatments
        const allTreatments = await treatments.getDoctorTreatments(doctorProfileId)
        const treatmentData = allTreatments.find(t => t.id.toString() === treatmentId)
        
        if (!treatmentData) {
          setError("Tratamiento no encontrado")
          setIsLoading(false)
          return
        }
        
        setTreatment(treatmentData)
        
        // Load related data
        const [sessionsData, allPatients] = await Promise.all([
          treatments.getSessions(treatmentData.id).catch(() => []),
          doctors.getPatients(doctorProfileId).catch(() => [])
        ])
        
        setSessions(sessionsData)
        
        // Find patient
        const patientData = allPatients.find(p => p.id === Number(treatmentData.patientProfileId))
        if (patientData) {
          setPatient(patientData)
        }
        
      } catch (err) {
        console.error("Error loading treatment data:", err)
        setError("Error al cargar los datos del tratamiento")
      } finally {
        setIsLoading(false)
      }
    }

    loadTreatmentData()
  }, [doctorProfileId, treatmentId])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificado"
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: es })
    } catch {
      return "Fecha inválida"
    }
  }

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "No especificado"
    try {
      return format(new Date(dateString), "dd MMM yyyy HH:mm", { locale: es })
    } catch {
      return "Fecha inválida"
    }
  }

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
      case "ACTIVO":
        return "default"
      case "COMPLETED":
      case "COMPLETADO":
        return "secondary"
      case "CANCELLED":
      case "CANCELADO":
        return "destructive"
      case "PAUSED":
      case "PAUSADO":
        return "outline"
      default:
        return "outline"
    }
  }

  const getSessionStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "SCHEDULED":
      case "PROGRAMADA":
        return "bg-blue-500/10 text-blue-500"
      case "COMPLETED":
      case "COMPLETADA":
        return "bg-green-500/10 text-green-500"
      case "CANCELLED":
      case "CANCELADA":
        return "bg-red-500/10 text-red-500"
      case "IN_PROGRESS":
      case "EN_PROGRESO":
        return "bg-yellow-500/10 text-yellow-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const completionPercentage = treatment 
    ? treatment.progressPercentage
    : 0

  if (isLoading) {
    return (
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <Loading />
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (error || !treatment) {
    return (
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <div className="max-w-7xl mx-auto space-y-6">
            <Link href="/dashboard/medico/tratamientos">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a tratamientos
              </Button>
            </Link>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error || "Tratamiento no encontrado"}
              </AlertDescription>
            </Alert>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="DOCTOR">
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <Link href="/dashboard/medico/tratamientos">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a tratamientos
              </Button>
            </Link>
            
            {/* Treatment Header Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Activity className="h-6 w-6" />
                      {treatment.type}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(treatment.status)}>
                        {treatment.status}
                      </Badge>
                      <span className="text-sm">Protocolo: {treatment.protocol}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/medico/tratamientos/${treatment.id}/editar`}>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {patient && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Link 
                        href={`/dashboard/medico/pacientes/${patient.id}`}
                        className="text-sm hover:underline"
                      >
                        {patient.firstName} {patient.lastName}
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Inicio: {formatDate(treatment.startDate)}</span>
                  </div>
                  {treatment.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Fin: {formatDate(treatment.endDate)}</span>
                    </div>
                  )}
                  {treatment.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{treatment.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Progreso del Tratamiento</p>
                    <p className="text-2xl font-bold">{completionPercentage}%</p>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {treatment.currentCycle} de {treatment.totalCycles} ciclos completados
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sesiones Programadas</p>
                    <p className="text-2xl font-bold">
                      {sessions.filter(s => s.status === 'SCHEDULED' || s.status === 'PROGRAMADA').length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sesiones Completadas</p>
                    <p className="text-2xl font-bold">
                      {sessions.filter(s => s.status === 'COMPLETED' || s.status === 'COMPLETADA').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="sessions">Sesiones ({sessions.length})</TabsTrigger>
              <TabsTrigger value="medications">Medicamentos</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Treatment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Información del Tratamiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Tratamiento</p>
                      <p className="font-medium">{treatment.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Protocolo</p>
                      <p className="font-medium">{treatment.protocol}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estado</p>
                      <Badge variant={getStatusBadgeVariant(treatment.status)}>
                        {treatment.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ciclos</p>
                      <p className="font-medium">
                        {treatment.currentCycle} / {treatment.totalCycles}
                      </p>
                    </div>
                    {treatment.sessionDurationMinutes && (
                      <div>
                        <p className="text-sm text-muted-foreground">Duración por Sesión</p>
                        <p className="font-medium">{treatment.sessionDurationMinutes} minutos</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Dates and Location */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Fechas y Ubicación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
                      <p className="font-medium">{formatDate(treatment.startDate)}</p>
                    </div>
                    {treatment.endDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha de Finalización</p>
                        <p className="font-medium">{formatDate(treatment.endDate)}</p>
                      </div>
                    )}
                    {treatment.nextSession && (
                      <div>
                        <p className="text-sm text-muted-foreground">Próxima Sesión</p>
                        <p className="font-medium">{formatDate(treatment.nextSession)}</p>
                      </div>
                    )}
                    {treatment.location && (
                      <div>
                        <p className="text-sm text-muted-foreground">Ubicación</p>
                        <p className="font-medium">{treatment.location}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Notes */}
                {treatment.notes && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Notas del Tratamiento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{treatment.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Preparation Instructions */}
                {treatment.preparationInstructions && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Instrucciones de Preparación
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{treatment.preparationInstructions}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Patient Information */}
                {patient && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Información del Paciente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Nombre</p>
                          <Link 
                            href={`/dashboard/medico/pacientes/${patient.id}`}
                            className="font-medium hover:underline"
                          >
                            {patient.firstName} {patient.lastName}
                          </Link>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">ID</p>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {patient.profileId}
                          </code>
                        </div>
                        {patient.cancerType && (
                          <div>
                            <p className="text-sm text-muted-foreground">Tipo de Cáncer</p>
                            <p className="font-medium">{patient.cancerType}</p>
                          </div>
                        )}
                        {patient.cancerStage && (
                          <div>
                            <p className="text-sm text-muted-foreground">Etapa</p>
                            <p className="font-medium">{patient.cancerStage}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sesiones del Tratamiento</h3>
              </div>
              
              {sessions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No hay sesiones registradas para este tratamiento
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {sessions
                    .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
                    .map((session) => (
                      <Card key={session.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Badge className={getSessionStatusColor(session.status)}>
                                    {session.status}
                                  </Badge>
                                  <span className="text-sm font-medium">
                                    Sesión #{session.sessionNumber}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDateTime(session.sessionDate)}</span>
                                  </div>
                                  {session.durationMinutes && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{session.durationMinutes} min</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {session.status === 'COMPLETED' || session.status === 'COMPLETADA' ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : session.status === 'IN_PROGRESS' || session.status === 'EN_PROGRESO' ? (
                                <PlayCircle className="h-5 w-5 text-yellow-500" />
                              ) : session.status === 'CANCELLED' || session.status === 'CANCELADA' ? (
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                              ) : (
                                <PauseCircle className="h-5 w-5 text-blue-500" />
                              )}
                            </div>
                            
                            {session.notes && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Notas:</p>
                                <p className="text-sm">{session.notes}</p>
                              </div>
                            )}
                            
                            {session.sideEffects && session.sideEffects.length > 0 && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Efectos Secundarios:</p>
                                <p className="text-sm text-destructive">{session.sideEffects.join(', ')}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>

            {/* Medications Tab */}
            <TabsContent value="medications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Medicamentos del Tratamiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {treatment.medications && treatment.medications.length > 0 ? (
                    <div className="space-y-2">
                      {treatment.medications.map((medication, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                        >
                          <Pill className="h-4 w-4 text-primary" />
                          <span className="font-medium">{medication}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay medicamentos especificados para este tratamiento
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

