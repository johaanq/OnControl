"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Shield, 
  Settings,
  Save,
  Edit,
  Camera,
  Bell,
  Users,
  FileText,
  AlertTriangle
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

// Mock data del paciente
const mockPacienteData = {
  id: "PAC-2024-0847",
  nombre: "María",
  apellido: "González",
  email: "maria.gonzalez@email.com",
  telefono: "+51 999 123 456",
  fechaNacimiento: "1979-03-15",
  edad: 45,
  genero: "Femenino",
  tipoSangre: "O+",
  estadoCivil: "Casada",
  ocupacion: "Profesora",
  direccion: "Av. Arequipa 1234, Miraflores",
  ciudad: "Lima",
  codigoPostal: "15074",
  pais: "Perú",
  contactoEmergencia: {
    nombre: "Juan González",
    relacion: "Esposo",
    telefono: "+51 987 654 321",
    email: "juan.gonzalez@email.com"
  },
  informacionMedica: {
    tipoCancer: "Cáncer de mama",
    estadioCancer: "Estadio II",
    fechaDiagnostico: "2024-10-15",
    medicoTratante: "Dr. Carlos Mendoza",
    hospital: "Clínica OncoControl",
    medicamentosActuales: [
      "Tamoxifeno 20mg",
      "Ácido Fólico 5mg", 
      "Omeprazol 20mg",
      "Ondansetrón 8mg"
    ],
    alergias: ["Penicilina", "Mariscos"],
    condicionesMedicas: ["Hipertensión leve"],
    cirugiasPrevias: ["Mastectomía parcial - 2024-10-20"],
    tratamientosPrevios: ["Quimioterapia - 6 ciclos completados"]
  },
  preferencias: {
    recibirNotificaciones: true,
    recibirRecordatorios: true,
    recibirInformacionMedica: true,
    mostrarInformacionCompleta: false,
    idiomaInterfaz: "español",
    metodoContactoPreferido: "email"
  },
  estadisticas: {
    diasEnTratamiento: 95,
    citasCompletadas: 18,
    medicamentosActivos: 4,
    sintomasReportados: 23,
    adherenciaPromedio: 92,
    calidadDeVida: 7.5
  }
}

export default function PacientePerfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(mockPacienteData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
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
    } catch (err) {
      setError("Error al actualizar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(mockPacienteData)
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  return (
    <AuthGuard requiredUserType="paciente">
      <DashboardLayout userType="paciente">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
              <p className="text-muted-foreground">Gestiona tu información personal y médica</p>
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
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/mujer-45-a-os-sonriente-paciente-oncolog-a.jpg" alt={formData.nombre} />
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
                  <p className="text-muted-foreground">{formData.edad} años</p>
                  <p className="text-sm text-muted-foreground">ID: {formData.id}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-accent/10 text-accent border-accent/20">
                      {formData.informacionMedica.tipoCancer}
                    </Badge>
                    <Badge variant="outline">
                      {formData.informacionMedica.estadioCancer}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ocupacion">Ocupación</Label>
                    {isEditing ? (
                      <Input
                        id="ocupacion"
                        value={formData.ocupacion}
                        onChange={(e) => handleInputChange("ocupacion", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm">{formData.ocupacion}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estadoCivil">Estado Civil</Label>
                    {isEditing ? (
                      <Select value={formData.estadoCivil} onValueChange={(value) => handleInputChange("estadoCivil", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Soltero">Soltero(a)</SelectItem>
                          <SelectItem value="Casado">Casado(a)</SelectItem>
                          <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                          <SelectItem value="Viudo">Viudo(a)</SelectItem>
                          <SelectItem value="Union Libre">Unión Libre</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm">{formData.estadoCivil}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoSangre">Tipo de Sangre</Label>
                    {isEditing ? (
                      <Select value={formData.tipoSangre} onValueChange={(value) => handleInputChange("tipoSangre", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm">{formData.tipoSangre}</p>
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

              {/* Información Médica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Información Médica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoCancer">Tipo de Cáncer</Label>
                      {isEditing ? (
                        <Input
                          id="tipoCancer"
                          value={formData.informacionMedica.tipoCancer}
                          onChange={(e) => handleNestedInputChange("informacionMedica", "tipoCancer", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{formData.informacionMedica.tipoCancer}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estadioCancer">Estadio</Label>
                      {isEditing ? (
                        <Input
                          id="estadioCancer"
                          value={formData.informacionMedica.estadioCancer}
                          onChange={(e) => handleNestedInputChange("informacionMedica", "estadioCancer", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{formData.informacionMedica.estadioCancer}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicoTratante">Médico Tratante</Label>
                    {isEditing ? (
                      <Input
                        id="medicoTratante"
                        value={formData.informacionMedica.medicoTratante}
                        onChange={(e) => handleNestedInputChange("informacionMedica", "medicoTratante", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm">{formData.informacionMedica.medicoTratante}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital/Clínica</Label>
                    {isEditing ? (
                      <Input
                        id="hospital"
                        value={formData.informacionMedica.hospital}
                        onChange={(e) => handleNestedInputChange("informacionMedica", "hospital", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm">{formData.informacionMedica.hospital}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Medicamentos Actuales</Label>
                    {isEditing ? (
                      <Textarea
                        value={formData.informacionMedica.medicamentosActuales.join("\n")}
                        onChange={(e) => handleNestedInputChange("informacionMedica", "medicamentosActuales", e.target.value.split("\n"))}
                        rows={3}
                        placeholder="Un medicamento por línea"
                      />
                    ) : (
                      <div className="space-y-1">
                        {formData.informacionMedica.medicamentosActuales.map((med, index) => (
                          <p key={index} className="text-sm">• {med}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Alergias</Label>
                      {isEditing ? (
                        <Input
                          value={formData.informacionMedica.alergias.join(", ")}
                          onChange={(e) => handleNestedInputChange("informacionMedica", "alergias", e.target.value.split(", "))}
                          placeholder="Penicilina, Mariscos"
                        />
                      ) : (
                        <p className="text-sm">{formData.informacionMedica.alergias.join(", ")}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Condiciones Médicas</Label>
                      {isEditing ? (
                        <Input
                          value={formData.informacionMedica.condicionesMedicas.join(", ")}
                          onChange={(e) => handleNestedInputChange("informacionMedica", "condicionesMedicas", e.target.value.split(", "))}
                          placeholder="Hipertensión, Diabetes"
                        />
                      ) : (
                        <p className="text-sm">{formData.informacionMedica.condicionesMedicas.join(", ")}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contacto de Emergencia */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Contacto de Emergencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactoNombre">Nombre</Label>
                      {isEditing ? (
                        <Input
                          id="contactoNombre"
                          value={formData.contactoEmergencia.nombre}
                          onChange={(e) => handleNestedInputChange("contactoEmergencia", "nombre", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{formData.contactoEmergencia.nombre}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactoRelacion">Relación</Label>
                      {isEditing ? (
                        <Select value={formData.contactoEmergencia.relacion} onValueChange={(value) => handleNestedInputChange("contactoEmergencia", "relacion", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Esposo">Esposo</SelectItem>
                            <SelectItem value="Esposa">Esposa</SelectItem>
                            <SelectItem value="Hijo">Hijo</SelectItem>
                            <SelectItem value="Hija">Hija</SelectItem>
                            <SelectItem value="Padre">Padre</SelectItem>
                            <SelectItem value="Madre">Madre</SelectItem>
                            <SelectItem value="Hermano">Hermano</SelectItem>
                            <SelectItem value="Hermana">Hermana</SelectItem>
                            <SelectItem value="Amigo">Amigo</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm">{formData.contactoEmergencia.relacion}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactoTelefono">Teléfono</Label>
                      {isEditing ? (
                        <Input
                          id="contactoTelefono"
                          value={formData.contactoEmergencia.telefono}
                          onChange={(e) => handleNestedInputChange("contactoEmergencia", "telefono", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{formData.contactoEmergencia.telefono}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactoEmail">Email</Label>
                      {isEditing ? (
                        <Input
                          id="contactoEmail"
                          type="email"
                          value={formData.contactoEmergencia.email}
                          onChange={(e) => handleNestedInputChange("contactoEmergencia", "email", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{formData.contactoEmergencia.email}</p>
                      )}
                    </div>
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
                        <p className="text-sm text-muted-foreground">Notificaciones sobre citas y tratamientos</p>
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
                        <Label htmlFor="recibirInformacionMedica">Recibir Información Médica</Label>
                        <p className="text-sm text-muted-foreground">Información sobre tratamientos y cuidados</p>
                      </div>
                      <Switch
                        id="recibirInformacionMedica"
                        checked={formData.preferencias.recibirInformacionMedica}
                        onCheckedChange={(checked) => handleNestedInputChange("preferencias", "recibirInformacionMedica", checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="mostrarInformacionCompleta">Mostrar Información Completa</Label>
                        <p className="text-sm text-muted-foreground">Permitir que el equipo médico vea toda tu información</p>
                      </div>
                      <Switch
                        id="mostrarInformacionCompleta"
                        checked={formData.preferencias.mostrarInformacionCompleta}
                        onCheckedChange={(checked) => handleNestedInputChange("preferencias", "mostrarInformacionCompleta", checked)}
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
                Mi Progreso
              </CardTitle>
              <CardDescription>Tu progreso en el tratamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{formData.estadisticas.diasEnTratamiento}</div>
                  <p className="text-sm text-muted-foreground">Días en Tratamiento</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">{formData.estadisticas.citasCompletadas}</div>
                  <p className="text-sm text-muted-foreground">Citas Completadas</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{formData.estadisticas.medicamentosActivos}</div>
                  <p className="text-sm text-muted-foreground">Medicamentos Activos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-destructive">{formData.estadisticas.sintomasReportados}</div>
                  <p className="text-sm text-muted-foreground">Síntomas Reportados</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{formData.estadisticas.adherenciaPromedio}%</div>
                  <p className="text-sm text-muted-foreground">Adherencia Promedio</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{formData.estadisticas.calidadDeVida}/10</div>
                  <p className="text-sm text-muted-foreground">Calidad de Vida</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
