"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loading } from "@/components/loading"
import { useAuthContext } from "@/contexts/auth-context"
import { doctors, appointments as appointmentsApi, treatments, medicalHistory } from "@/lib/api"
import type { PatientProfileResponse, AppointmentResponse, TreatmentResponse, HistoryEntryResponse, AllergyResponse } from "@/lib/api"
import { isDoctorUser } from "@/types/organization"
import { 
  ArrowLeft,
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Activity, 
  Heart,
  FileText,
  Clock,
  AlertTriangle,
  Pill,
  Shield,
  Edit,
  Stethoscope
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function PatientDetailsPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string
  
  const [doctorProfileId, setDoctorProfileId] = useState<number | null>(null)
  const [patient, setPatient] = useState<PatientProfileResponse | null>(null)
  const [appointmentsData, setAppointmentsData] = useState<AppointmentResponse[]>([])
  const [treatmentsData, setTreatmentsData] = useState<TreatmentResponse[]>([])
  const [medicalHistoryEntries, setMedicalHistoryEntries] = useState<HistoryEntryResponse[]>([])
  const [allergies, setAllergies] = useState<AllergyResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user && isDoctorUser(user)) {
      setDoctorProfileId(user.profile.id)
    }
  }, [user])

  useEffect(() => {
    const loadPatientData = async () => {
      if (!doctorProfileId) return
      
      setIsLoading(true)
      setError("")
      
      try {
        // Get patient by ID from doctor's patients
        const allPatients = await doctors.getPatients(doctorProfileId)
        const patientData = allPatients.find(p => p.id.toString() === patientId)
        
        if (!patientData) {
          setError("Paciente no encontrado")
          setIsLoading(false)
          return
        }
        
        setPatient(patientData)
        
        // Load related data
        const patientProfileId = patientData.id
        
        const [appointmentsResult, treatmentsResult, historyData, allergiesData] = await Promise.all([
          appointmentsApi.getDoctorAppointments(doctorProfileId)
            .then(data => data.filter(apt => (apt.patientId || apt.patientProfileId) === patientProfileId))
            .catch(() => []),
          treatments.getDoctorTreatments(doctorProfileId)
            .then(data => data.filter(t => Number(t.patientProfileId) === patientProfileId))
            .catch(() => []),
          medicalHistory.getHistory(patientProfileId)
            .catch(() => []),
          medicalHistory.getAllergies(patientProfileId)
            .catch(() => [])
        ])
        
        setAppointmentsData(appointmentsResult)
        setTreatmentsData(treatmentsResult)
        setMedicalHistoryEntries(historyData)
        setAllergies(allergiesData)
        
      } catch (err) {
        console.error("Error loading patient data:", err)
        setError("Error al cargar los datos del paciente")
      } finally {
        setIsLoading(false)
      }
    }

    loadPatientData()
  }, [doctorProfileId, patientId])

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return "N/A"
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificado"
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: es })
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
      default:
        return "outline"
    }
  }

  const getAppointmentStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "SCHEDULED":
      case "PROGRAMADA":
        return "bg-blue-500/10 text-blue-500"
      case "CONFIRMED":
      case "CONFIRMADA":
        return "bg-green-500/10 text-green-500"
      case "COMPLETED":
      case "COMPLETADA":
        return "bg-gray-500/10 text-gray-500"
      case "CANCELLED":
      case "CANCELADA":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <Loading />
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (error || !patient) {
    return (
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <div className="max-w-7xl mx-auto space-y-6">
            <Link href="/dashboard/medico/pacientes">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a pacientes
              </Button>
            </Link>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error || "Paciente no encontrado"}
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
            <Link href="/dashboard/medico/pacientes">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a pacientes
              </Button>
            </Link>
            
            {/* Patient Header Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-xl">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <CardTitle className="text-2xl">
                        {patient.firstName} {patient.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {patient.profileId}
                        </code>
                        <Badge variant={patient.isActive ? "default" : "secondary"}>
                          {patient.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                  <Link href={`/dashboard/medico/pacientes/${patient.id}/editar`}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{patient.email}</span>
                  </div>
                  {patient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{patient.phone}</span>
                    </div>
                  )}
                  {patient.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{patient.city}</span>
                    </div>
                  )}
                  {patient.birthDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{calculateAge(patient.birthDate)} años</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tratamientos Activos</p>
                    <p className="text-2xl font-bold">{patient.activeTreatments}</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Citas Próximas</p>
                    <p className="text-2xl font-bold">{patient.upcomingAppointments}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Alergias Registradas</p>
                    <p className="text-2xl font-bold">{allergies.length}</p>
                  </div>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="medical" className="space-y-4">
            <TabsList>
              <TabsTrigger value="medical">Información Médica</TabsTrigger>
              <TabsTrigger value="appointments">Citas</TabsTrigger>
              <TabsTrigger value="treatments">Tratamientos</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
            </TabsList>

            {/* Medical Information Tab */}
            <TabsContent value="medical" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Cancer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      Información Oncológica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Cáncer</p>
                      <p className="font-medium">{patient.cancerType || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Etapa</p>
                      <p className="font-medium">{patient.cancerStage || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Diagnóstico</p>
                      <p className="font-medium">{formatDate(patient.diagnosisDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estado de Tratamiento</p>
                      <Badge variant="outline">{patient.treatmentStatus || "No especificado"}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Último Tratamiento</p>
                      <p className="font-medium">{formatDate(patient.lastTreatmentDate)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Información Médica General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Sangre</p>
                      <p className="font-medium">{patient.bloodType || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Historial Médico</p>
                      <p className="text-sm">{patient.medicalHistory || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Medicamentos Actuales</p>
                      <p className="text-sm">{patient.currentMedications || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Alergias</p>
                      <p className="text-sm">{patient.allergies || "No especificado"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Insurance */}
                {(patient.insuranceProvider || patient.insuranceNumber) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Seguro Médico
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Proveedor</p>
                        <p className="font-medium">{patient.insuranceProvider || "No especificado"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Número de Póliza</p>
                        <p className="font-medium">{patient.insuranceNumber || "No especificado"}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Emergency Contact */}
                {patient.emergencyContactName && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Contacto de Emergencia
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Nombre</p>
                        <p className="font-medium">{patient.emergencyContactName}</p>
                      </div>
                      {patient.emergencyContactPhone && (
                        <div>
                          <p className="text-sm text-muted-foreground">Teléfono</p>
                          <p className="font-medium">{patient.emergencyContactPhone}</p>
                        </div>
                      )}
                      {patient.emergencyContactRelationship && (
                        <div>
                          <p className="text-sm text-muted-foreground">Relación</p>
                          <p className="font-medium">{patient.emergencyContactRelationship}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Allergies */}
              {allergies.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Alergias Detalladas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {allergies.map((allergy) => (
                        <div key={allergy.id} className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-destructive">{allergy.allergen}</p>
                            {allergy.reaction && (
                              <p className="text-sm text-muted-foreground">Reacción: {allergy.reaction}</p>
                            )}
                            <Badge variant="outline" className="mt-1">
                              Severidad: {allergy.severity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Citas del Paciente</h3>
                <Link href={`/dashboard/medico/citas/nueva?patientId=${patient.id}`}>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Nueva Cita
                  </Button>
                </Link>
              </div>
              
              {appointmentsData.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No hay citas registradas para este paciente
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {appointmentsData.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge className={getAppointmentStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                              <Badge variant="outline">{appointment.type}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{formatDate(appointment.appointmentDate)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.durationMinutes} min</span>
                              </div>
                              {appointment.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{appointment.location}</span>
                                </div>
                              )}
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Treatments Tab */}
            <TabsContent value="treatments" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Tratamientos del Paciente</h3>
                <Link href={`/dashboard/medico/tratamientos/nuevo?patientId=${patient.id}`}>
                  <Button>
                    <Activity className="mr-2 h-4 w-4" />
                    Nuevo Tratamiento
                  </Button>
                </Link>
              </div>
              
              {treatmentsData.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No hay tratamientos registrados para este paciente
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {treatmentsData.map((treatment) => (
                    <Card key={treatment.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{treatment.type}</h4>
                              <p className="text-sm text-muted-foreground">{treatment.protocol}</p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(treatment.status)}>
                              {treatment.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Inicio</p>
                              <p className="font-medium">{formatDate(treatment.startDate)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Ciclos</p>
                              <p className="font-medium">
                                {treatment.currentCycle} / {treatment.totalCycles}
                              </p>
                            </div>
                            {treatment.location && (
                              <div>
                                <p className="text-muted-foreground">Ubicación</p>
                                <p className="font-medium">{treatment.location}</p>
                              </div>
                            )}
                            {treatment.sessionDurationMinutes && (
                              <div>
                                <p className="text-muted-foreground">Duración</p>
                                <p className="font-medium">{treatment.sessionDurationMinutes} min</p>
                              </div>
                            )}
                          </div>
                          {treatment.notes && (
                            <p className="text-sm text-muted-foreground">{treatment.notes}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <h3 className="text-lg font-semibold">Historial Médico</h3>
              
              {medicalHistoryEntries.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No hay entradas en el historial médico
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {medicalHistoryEntries.map((entry) => (
                    <Card key={entry.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{entry.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(entry.date)}
                              </p>
                            </div>
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <p className="text-sm">{entry.description}</p>
                          {entry.doctorName && (
                            <p className="text-xs text-muted-foreground">
                              Doctor: {entry.doctorName} {entry.specialty && `- ${entry.specialty}`}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}

