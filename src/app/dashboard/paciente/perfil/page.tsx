"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loading } from "@/components/loading"
import { useAuthContext } from "@/contexts/auth-context"
import { doctors } from "@/lib/api"
import type { PatientProfileResponse } from "@/lib/api"
import { isPatientUser } from "@/types/organization"
import { 
  User, 
  Mail, 
  Heart, 
  Shield, 
  Settings,
  Save,
  Edit,
  Activity
} from "lucide-react"

export default function PacientePerfilPage() {
  const { user } = useAuthContext()
  const [patientData, setPatientData] = useState<PatientProfileResponse | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const loadPatientProfile = async () => {
      if (!user || !isPatientUser(user)) return

      try {
        setIsLoading(true)
        // Use the patient profile from auth context
        setPatientData(user.profile as PatientProfileResponse)
      } catch (err) {
        console.error('Error loading patient profile:', err)
        setError('Error al cargar el perfil')
      } finally {
        setIsLoading(false)
      }
    }

    loadPatientProfile()
  }, [user])

  const handleSave = async () => {
    if (!patientData || !user || !isPatientUser(user)) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      // API call to update patient profile would go here
      // For now, we'll just show success message
      setSuccess("Perfil actualizado correctamente")
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError("Error al actualizar el perfil")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRole="PATIENT">
        <DashboardLayout>
          <Loading message="Cargando perfil..." />
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (!patientData) {
    return (
      <AuthGuard requiredRole="PATIENT">
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No se pudo cargar el perfil</p>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <AuthGuard requiredRole="PATIENT">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
              <p className="text-muted-foreground">Gestiona tu información personal</p>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => {
                if (isEditing) {
                  setSuccess("")
                  setError("")
                }
                setIsEditing(!isEditing)
              }}
            >
              {isEditing ? (
                <>Cancelar</>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </>
              )}
            </Button>
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-primary bg-primary/10">
              <AlertDescription className="text-primary">{success}</AlertDescription>
            </Alert>
          )}

          {/* Profile Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {patientData.firstName.charAt(0)}{patientData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold">
                    {patientData.firstName} {patientData.lastName}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {patientData.birthDate ? calculateAge(patientData.birthDate) : 'N/A'} años
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ID: {patientData.profileId}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    <Badge variant="outline">{patientData.isActive ? 'Activo' : 'Inactivo'}</Badge>
                    {patientData.doctorName && (
                      <span className="text-sm text-muted-foreground">
                        Médico tratante: {patientData.doctorName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>Información básica de identificación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={patientData.firstName}
                    disabled={true}
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={patientData.lastName}
                    disabled={true}
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={patientData.email}
                    disabled={true}
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={patientData.phone}
                    onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={patientData.birthDate || ''}
                    disabled={true}
                    className="bg-muted"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Información Médica
                </CardTitle>
                <CardDescription>Detalles de tu condición y tratamiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientData.cancerType && (
                  <div className="space-y-2">
                    <Label>Tipo de Cáncer</Label>
                    <Input
                      value={patientData.cancerType}
                      disabled={true}
                      className="bg-muted"
                    />
                  </div>
                )}

                {patientData.cancerStage && (
                  <div className="space-y-2">
                    <Label>Estadio</Label>
                    <Input
                      value={patientData.cancerStage}
                      disabled={true}
                      className="bg-muted"
                    />
                  </div>
                )}

                {patientData.diagnosisDate && (
                  <div className="space-y-2">
                    <Label>Fecha de Diagnóstico</Label>
                    <Input
                      type="date"
                      value={patientData.diagnosisDate}
                      disabled={true}
                      className="bg-muted"
                    />
                  </div>
                )}

                {patientData.doctorName && (
                  <div className="space-y-2">
                    <Label>Médico Tratante</Label>
                    <Input
                      value={patientData.doctorName}
                      disabled={true}
                      className="bg-muted"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input
                    value={patientData.isActive ? 'Activo' : 'Inactivo'}
                    disabled={true}
                    className="bg-muted"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Address */}
          {patientData.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Dirección
                </CardTitle>
                <CardDescription>Tu dirección de residencia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección Completa</Label>
                  <Input
                    id="address"
                    value={patientData.address}
                    onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Estadísticas
              </CardTitle>
              <CardDescription>Tu actividad en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-primary">{patientData.activeTreatments}</p>
                  <p className="text-sm text-muted-foreground">Tratamientos Activos</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-primary">{patientData.upcomingAppointments}</p>
                  <p className="text-sm text-muted-foreground">Citas Próximas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setError("")
                  setSuccess("")
                }}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
