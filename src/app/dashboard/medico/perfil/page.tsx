"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loading } from "@/components/loading"
import { useAuthContext } from "@/contexts/auth-context"
import { doctors } from "@/lib/api"
import type { DoctorResponse } from "@/lib/api"
import { isDoctorUser } from "@/types/organization"
import { 
  User, 
  Mail, 
  GraduationCap, 
  Award, 
  Settings,
  Save,
  Edit,
  Shield,
  Briefcase
} from "lucide-react"

export default function MedicoPerfilPage() {
  const { user } = useAuthContext()
  const [doctorData, setDoctorData] = useState<DoctorResponse | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const loadDoctorProfile = async () => {
      if (!user || !isDoctorUser(user)) return

      try {
        setIsLoading(true)
        const profile = await doctors.getProfile(user.profile.id)
        setDoctorData(profile)
      } catch (err) {
        console.error('Error loading doctor profile:', err)
        setError('Error al cargar el perfil')
      } finally {
        setIsLoading(false)
      }
    }

    loadDoctorProfile()
  }, [user])

  const handleSave = async () => {
    if (!doctorData || !user || !isDoctorUser(user)) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const updatedProfile = await doctors.updateProfile(user.profile.id, {
        specialty: doctorData.specialty,
        licenseNumber: doctorData.licenseNumber,
        phone: doctorData.phone,
        bio: doctorData.bio || undefined,
        officeAddress: doctorData.officeAddress || undefined
      })
      
      setDoctorData(updatedProfile)
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
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <Loading message="Cargando perfil..." />
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (!doctorData) {
    return (
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No se pudo cargar el perfil</p>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
              <p className="text-muted-foreground">Gestiona tu información profesional</p>
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
                    {doctorData.firstName.charAt(0)}{doctorData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold">
                    Dr. {doctorData.firstName} {doctorData.lastName}
                  </h2>
                  <p className="text-lg text-muted-foreground">{doctorData.specialty}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ID: {doctorData.profileId}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    {doctorData.organizationName && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        {doctorData.organizationName}
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
                    value={doctorData.firstName}
                    disabled={true}
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={doctorData.lastName}
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
                    value={doctorData.email}
                    disabled={true}
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={doctorData.phone}
                    onChange={(e) => setDoctorData({ ...doctorData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Información Profesional
                </CardTitle>
                <CardDescription>Credenciales y especialización</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidad</Label>
                  <Input
                    id="specialty"
                    value={doctorData.specialty}
                    onChange={(e) => setDoctorData({ ...doctorData, specialty: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">
                    <Award className="w-4 h-4 inline mr-2" />
                    Número de Colegiatura
                  </Label>
                  <Input
                    id="licenseNumber"
                    value={doctorData.licenseNumber}
                    onChange={(e) => setDoctorData({ ...doctorData, licenseNumber: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                {doctorData.organizationName && (
                  <div className="space-y-2">
                    <Label>Organización</Label>
                    <Input
                      value={doctorData.organizationName}
                      disabled={true}
                      className="bg-muted"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Input
                    id="status"
                    value={doctorData.status === 'ACTIVE' ? 'Activo' : doctorData.status}
                    disabled={true}
                    className="bg-muted"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Biography */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Biografía Profesional
              </CardTitle>
              <CardDescription>Información adicional sobre tu práctica médica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={doctorData.bio || ""}
                  onChange={(e) => setDoctorData({ ...doctorData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={6}
                  placeholder="Describe tu experiencia, especialización y enfoque médico..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="officeAddress">Dirección del Consultorio</Label>
                <Textarea
                  id="officeAddress"
                  value={doctorData.officeAddress || ""}
                  onChange={(e) => setDoctorData({ ...doctorData, officeAddress: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Dirección completa de tu consultorio..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Estadísticas
              </CardTitle>
              <CardDescription>Tu actividad en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-primary">{doctorData.activePatients}</p>
                  <p className="text-sm text-muted-foreground">Pacientes Activos</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-primary">{doctorData.totalPatients}</p>
                  <p className="text-sm text-muted-foreground">Total de Pacientes</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-primary">{doctorData.totalTreatments}</p>
                  <p className="text-sm text-muted-foreground">Tratamientos Administrados</p>
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
