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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { 
  User, 
  CalendarIcon, 
  FileText, 
  ArrowLeft, 
  CheckCircle,
  Stethoscope,
  AlertTriangle
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock data para opciones
const tiposCancer = [
  "Cáncer de mama",
  "Cáncer de próstata", 
  "Cáncer de pulmón",
  "Cáncer colorrectal",
  "Cáncer de ovario",
  "Cáncer de estómago",
  "Cáncer de hígado",
  "Cáncer de páncreas",
  "Cáncer de vejiga",
  "Cáncer de riñón",
  "Leucemia",
  "Linfoma",
  "Otro"
]

const estadiosCancer = [
  "Estadio 0 (Carcinoma in situ)",
  "Estadio I",
  "Estadio II", 
  "Estadio III",
  "Estadio IV",
  "No determinado"
]

const tiposSangre = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
]

export default function NuevoPacientePage() {
  const [formData, setFormData] = useState({
    // Información personal
    nombre: "",
    apellido: "",
    fechaNacimiento: undefined as Date | undefined,
    genero: "",
    tipoSangre: "",
    telefono: "",
    email: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    
    // Información médica
    tipoCancer: "",
    estadioCancer: "",
    fechaDiagnostico: undefined as Date | undefined,
    medicamentosActuales: "",
    alergias: "",
    condicionesMedicas: "",
    
    // Información de contacto de emergencia
    contactoEmergenciaNombre: "",
    contactoEmergenciaTelefono: "",
    contactoEmergenciaRelacion: "",
    
    // Preferencias
    recibirNotificaciones: true,
    recibirRecordatorios: true,
    notas: ""
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string | Date | null | undefined | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validación básica
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.telefono) {
      setError("Por favor completa los campos obligatorios: Nombre, Apellido, Email y Teléfono")
      setIsLoading(false)
      return
    }

    // Simular llamada a API
    setTimeout(() => {
      setSuccess(true)
      setIsLoading(false)

      // Redirigir después del éxito
      setTimeout(() => {
        router.push("/dashboard/medico/pacientes")
      }, 2000)
    }, 1000)
  }

  if (success) {
    return (
      <AuthGuard requiredUserType="medico">
        <DashboardLayout userType="medico">
          <div className="max-w-2xl mx-auto py-12">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">¡Paciente registrado exitosamente!</h2>
                <p className="text-muted-foreground mb-6">
                  El paciente ha sido agregado al sistema y ya puede recibir citas y tratamientos.
                </p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/medico/pacientes">Ver Pacientes</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/dashboard/medico/pacientes/nuevo">Registrar Otro Paciente</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredUserType="medico">
      <DashboardLayout userType="medico">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/medico/pacientes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Pacientes
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Nuevo Paciente</h1>
              <p className="text-muted-foreground">Registra un nuevo paciente en el sistema</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>Datos básicos del paciente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                      placeholder="Nombre del paciente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      value={formData.apellido}
                      onChange={(e) => handleInputChange("apellido", e.target.value)}
                      placeholder="Apellido del paciente"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha de Nacimiento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.fechaNacimiento ? format(formData.fechaNacimiento, "PPP") : "Selecciona fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.fechaNacimiento}
                          onSelect={(date) => handleInputChange("fechaNacimiento", date)}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genero">Género</Label>
                    <Select value={formData.genero} onValueChange={(value) => handleInputChange("genero", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoSangre">Tipo de Sangre</Label>
                    <Select value={formData.tipoSangre} onValueChange={(value) => handleInputChange("tipoSangre", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposSangre.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange("telefono", e.target.value)}
                      placeholder="+51 999 123 456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="paciente@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange("direccion", e.target.value)}
                    placeholder="Calle, número, distrito"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      id="ciudad"
                      value={formData.ciudad}
                      onChange={(e) => handleInputChange("ciudad", e.target.value)}
                      placeholder="Lima"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigoPostal">Código Postal</Label>
                    <Input
                      id="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                      placeholder="15001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información Médica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Información Médica
                </CardTitle>
                <CardDescription>Diagnóstico y condiciones médicas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoCancer">Tipo de Cáncer</Label>
                    <Select value={formData.tipoCancer} onValueChange={(value) => handleInputChange("tipoCancer", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de cáncer" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposCancer.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estadioCancer">Estadio del Cáncer</Label>
                    <Select value={formData.estadioCancer} onValueChange={(value) => handleInputChange("estadioCancer", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona estadio" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadiosCancer.map((estadio) => (
                          <SelectItem key={estadio} value={estadio}>
                            {estadio}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fecha de Diagnóstico</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.fechaDiagnostico ? format(formData.fechaDiagnostico, "PPP") : "Selecciona fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.fechaDiagnostico}
                        onSelect={(date) => handleInputChange("fechaDiagnostico", date)}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicamentosActuales">Medicamentos Actuales</Label>
                  <Textarea
                    id="medicamentosActuales"
                    value={formData.medicamentosActuales}
                    onChange={(e) => handleInputChange("medicamentosActuales", e.target.value)}
                    placeholder="Lista de medicamentos que toma actualmente..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alergias">Alergias</Label>
                    <Textarea
                      id="alergias"
                      value={formData.alergias}
                      onChange={(e) => handleInputChange("alergias", e.target.value)}
                      placeholder="Alergias conocidas..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condicionesMedicas">Condiciones Médicas</Label>
                    <Textarea
                      id="condicionesMedicas"
                      value={formData.condicionesMedicas}
                      onChange={(e) => handleInputChange("condicionesMedicas", e.target.value)}
                      placeholder="Otras condiciones médicas..."
                      rows={2}
                    />
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
                <CardDescription>Persona de contacto en caso de emergencia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactoEmergenciaNombre">Nombre del Contacto</Label>
                    <Input
                      id="contactoEmergenciaNombre"
                      value={formData.contactoEmergenciaNombre}
                      onChange={(e) => handleInputChange("contactoEmergenciaNombre", e.target.value)}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactoEmergenciaTelefono">Teléfono</Label>
                    <Input
                      id="contactoEmergenciaTelefono"
                      value={formData.contactoEmergenciaTelefono}
                      onChange={(e) => handleInputChange("contactoEmergenciaTelefono", e.target.value)}
                      placeholder="+51 999 123 456"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactoEmergenciaRelacion">Relación</Label>
                  <Select value={formData.contactoEmergenciaRelacion} onValueChange={(value) => handleInputChange("contactoEmergenciaRelacion", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona relación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conyuge">Cónyuge</SelectItem>
                      <SelectItem value="hijo">Hijo(a)</SelectItem>
                      <SelectItem value="padre">Padre</SelectItem>
                      <SelectItem value="madre">Madre</SelectItem>
                      <SelectItem value="hermano">Hermano(a)</SelectItem>
                      <SelectItem value="amigo">Amigo(a)</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Preferencias y Notas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Preferencias y Notas
                </CardTitle>
                <CardDescription>Configuración de notificaciones y notas adicionales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="recibirNotificaciones">Recibir Notificaciones</Label>
                      <p className="text-sm text-muted-foreground">Recibir notificaciones sobre citas y tratamientos</p>
                    </div>
                    <Switch
                      id="recibirNotificaciones"
                      checked={formData.recibirNotificaciones}
                      onCheckedChange={(checked) => handleInputChange("recibirNotificaciones", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="recibirRecordatorios">Recibir Recordatorios</Label>
                      <p className="text-sm text-muted-foreground">Recibir recordatorios de citas por SMS/Email</p>
                    </div>
                    <Switch
                      id="recibirRecordatorios"
                      checked={formData.recibirRecordatorios}
                      onCheckedChange={(checked) => handleInputChange("recibirRecordatorios", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notas">Notas Adicionales</Label>
                  <Textarea
                    id="notas"
                    value={formData.notas}
                    onChange={(e) => handleInputChange("notas", e.target.value)}
                    placeholder="Información adicional sobre el paciente..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/medico/pacientes">Cancelar</Link>
              </Button>
              <Button type="submit" className="oncontrol-gradient text-white" disabled={isLoading}>
                {isLoading ? "Registrando paciente..." : "Registrar Paciente"}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
