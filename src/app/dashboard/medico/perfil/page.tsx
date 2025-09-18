"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  GraduationCap, 
  Award, 
  Settings,
  Save,
  Edit,
  Camera,
  Shield
} from "lucide-react"

// Mock data del médico
const mockMedicoData = {
  id: "MED-2024-0001",
  nombre: "Carlos",
  apellido: "Mendoza",
  email: "carlos.mendoza@oncontrol.pe",
  telefono: "+51 999 123 456",
  especialidad: "Oncología Médica",
  subespecialidad: "Cáncer de Mama",
  colegiatura: "12345",
  universidad: "Universidad Nacional Mayor de San Marcos",
  anioGraduacion: "2010",
  experiencia: 14,
  direccion: "Av. Javier Prado Este 4200, San Isidro",
  ciudad: "Lima",
  codigoPostal: "15036",
  pais: "Perú",
  idiomas: ["Español", "Inglés", "Portugués"],
  certificaciones: [
    "Certificación en Oncología - ASCO",
    "Certificación en Medicina Interna - ACP",
    "Certificación en Investigación Clínica"
  ],
  biografia: "Especialista en oncología médica con más de 14 años de experiencia en el tratamiento de cáncer de mama y otros tumores sólidos. Miembro activo de la Sociedad Americana de Oncología Clínica (ASCO) y participante en múltiples ensayos clínicos internacionales.",
  horarioAtencion: {
    lunes: "08:00 - 17:00",
    martes: "08:00 - 17:00", 
    miercoles: "08:00 - 17:00",
    jueves: "08:00 - 17:00",
    viernes: "08:00 - 15:00",
    sabado: "Cerrado",
    domingo: "Cerrado"
  },
  preferencias: {
    recibirNotificaciones: true,
    recibirRecordatorios: true,
    mostrarTelefono: true,
    mostrarEmail: true,
    permitirCitasOnline: true,
    idiomaInterfaz: "español"
  },
  estadisticas: {
    pacientesAtendidos: 1247,
    citasCompletadas: 3456,
    satisfaccionPromedio: 4.8,
    anosExperiencia: 14
  }
}

export default function MedicoPerfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(mockMedicoData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess("Perfil actualizado exitosamente")
      setIsEditing(false)
    } catch {
      setError("Error al actualizar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(mockMedicoData)
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  return (
    <AuthGuard requiredUserType="medico">
      <DashboardLayout userType="medico">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
              <p className="text-muted-foreground">Gestiona tu información profesional y personal</p>
            </div>
            <div className="flex gap-3">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading} className="oncontrol-gradient text-white">
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Principal */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/hombre-62-a-os-profesional.jpg" alt={formData.nombre} />
                    <AvatarFallback className="text-2xl">
                      {formData.nombre[0]}{formData.apellido[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="mb-2">
                      <Camera className="mr-2 h-4 w-4" />
                      Cambiar Foto
                    </Button>
                  )}
                  <h2 className="text-xl font-bold">{formData.nombre} {formData.apellido}</h2>
                  <p className="text-muted-foreground">{formData.especialidad}</p>
                  <p className="text-sm text-muted-foreground">ID: {formData.id}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="especialidad">Especialidad</Label>
                    {isEditing ? (
                      <Input
                        id="especialidad"
                        value={formData.especialidad}
                        onChange={(e) => handleInputChange("especialidad", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm">{formData.especialidad}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subespecialidad">Subespecialidad</Label>
                    {isEditing ? (
                      <Input
                        id="subespecialidad"
                        value={formData.subespecialidad}
                        onChange={(e) => handleInputChange("subespecialidad", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm">{formData.subespecialidad}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colegiatura">Colegiatura</Label>
                    {isEditing ? (
                      <Input
                        id="colegiatura"
                        value={formData.colegiatura}
                        onChange={(e) => handleInputChange("colegiatura", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm">{formData.colegiatura}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experiencia">Años de Experiencia</Label>
                    {isEditing ? (
                      <Input
                        id="experiencia"
                        type="number"
                        value={formData.experiencia}
                        onChange={(e) => handleInputChange("experiencia", parseInt(e.target.value))}
                      />
                    ) : (
                      <p className="text-sm">{formData.experiencia} años</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información Detallada */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información de Contacto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{formData.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      {isEditing ? (
                        <Input
                          id="telefono"
                          value={formData.telefono}
                          onChange={(e) => handleInputChange("telefono", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{formData.telefono}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    {isEditing ? (
                      <Input
                        id="direccion"
                        value={formData.direccion}
                        onChange={(e) => handleInputChange("direccion", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm">{formData.direccion}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad</Label>
                      {isEditing ? (
                        <Input
                          id="ciudad"
                          value={formData.ciudad}
                          onChange={(e) => handleInputChange("ciudad", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{formData.ciudad}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codigoPostal">Código Postal</Label>
                      {isEditing ? (
                        <Input
                          id="codigoPostal"
                          value={formData.codigoPostal}
                          onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{formData.codigoPostal}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pais">País</Label>
                      {isEditing ? (
                        <Input
                          id="pais"
                          value={formData.pais}
                          onChange={(e) => handleInputChange("pais", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{formData.pais}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formación Académica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Formación Académica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="universidad">Universidad</Label>
                    {isEditing ? (
                      <Input
                        id="universidad"
                        value={formData.universidad}
                        onChange={(e) => handleInputChange("universidad", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm">{formData.universidad}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="anioGraduacion">Año de Graduación</Label>
                    {isEditing ? (
                      <Input
                        id="anioGraduacion"
                        type="number"
                        value={formData.anioGraduacion}
                        onChange={(e) => handleInputChange("anioGraduacion", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm">{formData.anioGraduacion}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Certificaciones</Label>
                    {isEditing ? (
                      <Textarea
                        value={formData.certificaciones.join("\n")}
                        onChange={(e) => handleInputChange("certificaciones", e.target.value.split("\n"))}
                        rows={3}
                        placeholder="Una certificación por línea"
                      />
                    ) : (
                      <div className="space-y-1">
                        {formData.certificaciones.map((cert, index) => (
                          <p key={index} className="text-sm">• {cert}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Idiomas</Label>
                    {isEditing ? (
                      <Input
                        value={formData.idiomas.join(", ")}
                        onChange={(e) => handleInputChange("idiomas", e.target.value.split(", "))}
                        placeholder="Español, Inglés, Portugués"
                      />
                    ) : (
                      <p className="text-sm">{formData.idiomas.join(", ")}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Biografía */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Biografía Profesional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="biografia">Biografía</Label>
                    {isEditing ? (
                      <Textarea
                        id="biografia"
                        value={formData.biografia}
                        onChange={(e) => handleInputChange("biografia", e.target.value)}
                        rows={4}
                        placeholder="Describe tu experiencia profesional..."
                      />
                    ) : (
                      <p className="text-sm">{formData.biografia}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Preferencias */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferencias
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="recibirNotificaciones">Recibir Notificaciones</Label>
                        <p className="text-sm text-muted-foreground">Notificaciones sobre citas y pacientes</p>
                      </div>
                      <Switch
                        id="recibirNotificaciones"
                        checked={formData.preferencias.recibirNotificaciones}
                        onCheckedChange={(checked) => handleNestedInputChange("preferencias", "recibirNotificaciones", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="recibirRecordatorios">Recibir Recordatorios</Label>
                        <p className="text-sm text-muted-foreground">Recordatorios de citas por email/SMS</p>
                      </div>
                      <Switch
                        id="recibirRecordatorios"
                        checked={formData.preferencias.recibirRecordatorios}
                        onCheckedChange={(checked) => handleNestedInputChange("preferencias", "recibirRecordatorios", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="mostrarTelefono">Mostrar Teléfono</Label>
                        <p className="text-sm text-muted-foreground">Permitir que los pacientes vean tu teléfono</p>
                      </div>
                      <Switch
                        id="mostrarTelefono"
                        checked={formData.preferencias.mostrarTelefono}
                        onCheckedChange={(checked) => handleNestedInputChange("preferencias", "mostrarTelefono", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="permitirCitasOnline">Permitir Citas Online</Label>
                        <p className="text-sm text-muted-foreground">Permitir que los pacientes agenden citas online</p>
                      </div>
                      <Switch
                        id="permitirCitasOnline"
                        checked={formData.preferencias.permitirCitasOnline}
                        onCheckedChange={(checked) => handleNestedInputChange("preferencias", "permitirCitasOnline", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Estadísticas Profesionales
              </CardTitle>
              <CardDescription>Tu rendimiento y experiencia en números</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{formData.estadisticas.pacientesAtendidos.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Pacientes Atendidos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">{formData.estadisticas.citasCompletadas.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Citas Completadas</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{formData.estadisticas.satisfaccionPromedio}/5</div>
                  <p className="text-sm text-muted-foreground">Satisfacción Promedio</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-destructive">{formData.estadisticas.anosExperiencia}</div>
                  <p className="text-sm text-muted-foreground">Años de Experiencia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
