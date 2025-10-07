"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  UserPlus,
  Eye,
  EyeOff,
  Activity,
  Plus,
  X
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/auth-context"
import { useDoctorActions } from "@/hooks/use-doctors"
import { isDoctorUser } from "@/types/organization"
import type { CreatePatientRequest } from "@/lib/api"

const tiposSangre = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const tiposCancer = [
  "Cáncer de mama",
  "Cáncer de próstata",
  "Cáncer de pulmón",
  "Cáncer colorrectal",
  "Cáncer de piel (melanoma)",
  "Cáncer de tiroides",
  "Cáncer de riñón",
  "Cáncer de páncreas",
  "Cáncer de hígado",
  "Cáncer de estómago",
  "Cáncer de vejiga",
  "Cáncer de ovario",
  "Cáncer de útero",
  "Cáncer de esófago",
  "Leucemia",
  "Linfoma Hodgkin",
  "Linfoma no Hodgkin",
  "Mieloma múltiple",
  "Sarcoma",
  "Cáncer de cerebro",
  "Otro"
]

const etapasCancer = [
  "Estadio 0 (in situ)",
  "Estadio I",
  "Estadio II",
  "Estadio III",
  "Estadio IV",
  "Desconocido"
]

const estadosTratamiento = [
  "Recién diagnosticado",
  "En tratamiento activo",
  "En seguimiento",
  "En remisión",
  "Tratamiento completado",
  "Cuidados paliativos",
  "Desconocido"
]

const alergiasComunes = [
  "Penicilina",
  "Amoxicilina",
  "Cefalosporinas",
  "Sulfonamidas",
  "Aspirina",
  "Ibuprofeno",
  "Paracetamol",
  "Contraste yodado",
  "Látex",
  "Mariscos",
  "Nueces",
  "Huevo",
  "Soja",
  "Polen",
  "Ácaros del polvo"
]

const medicamentosComunes = [
  "Paracetamol",
  "Ibuprofeno",
  "Omeprazol",
  "Metformina",
  "Losartán",
  "Atorvastatina",
  "Enalapril",
  "Levotiroxina",
  "Amoxicilina",
  "Aspirina",
  "Diclofenaco",
  "Ranitidina",
  "Metronidazol",
  "Prednisona",
  "Tramadol"
]

export default function NuevoPacientePage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [doctorProfileId, setDoctorProfileId] = useState<number | null>(null)
  const { createPatient, isLoading, error: actionError } = useDoctorActions(doctorProfileId)

  const [showPassword, setShowPassword] = useState(false)
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [selectedMedications, setSelectedMedications] = useState<string[]>([])
  const [customAllergy, setCustomAllergy] = useState("")
  const [customMedication, setCustomMedication] = useState("")
  
  const [formData, setFormData] = useState<CreatePatientRequest>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
    city: "",
    address: "",
    bloodType: "",
    allergies: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    medicalHistory: "",
    currentMedications: "",
    insuranceProvider: "",
    insuranceNumber: "",
    cancerType: "",
    cancerStage: "",
    diagnosisDate: "",
    treatmentStatus: "",
    lastTreatmentDate: "",
  })
  
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user && isDoctorUser(user)) {
      setDoctorProfileId(user.profile.id)
    }
  }, [user])

  const handleInputChange = (field: keyof CreatePatientRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validaciones básicas
    if (!formData.firstName || !formData.lastName) {
      setError("Nombre y apellido son requeridos")
      return
    }

    if (!formData.email) {
      setError("El email es requerido")
      return
    }

    if (!formData.password || formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    // Preparar datos con alergias y medicamentos concatenados
    const patientData = {
      ...formData,
      allergies: selectedAllergies.length > 0 ? selectedAllergies.join(", ") : formData.allergies,
      currentMedications: selectedMedications.length > 0 ? selectedMedications.join(", ") : formData.currentMedications,
    }

    try {
      const result = await createPatient(patientData)
      
      if (result) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/dashboard/medico/pacientes")
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el paciente")
    }
  }

  return (
    <AuthGuard requiredRole="DOCTOR">
      <DashboardLayout>
        <div className="container mx-auto p-6 max-w-5xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/dashboard/medico/pacientes">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a pacientes
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Registrar Nuevo Paciente</h1>
            <p className="text-muted-foreground">Complete la información del paciente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {actionError && (
              <Alert variant="destructive">
                <AlertDescription>{actionError}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-primary/10 border-primary/30">
                <AlertDescription className="text-primary-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Paciente creado exitosamente. Redirigiendo...
                </AlertDescription>
              </Alert>
            )}

            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Datos básicos del paciente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="paciente@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña Inicial *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    El paciente podrá cambiar esta contraseña después
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Tipo de Sangre</Label>
                    <Select 
                      value={formData.bloodType} 
                      onValueChange={(value) => handleInputChange("bloodType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposSangre.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Información Médica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Médica</CardTitle>
                <CardDescription>Diagnóstico y tratamiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cancerType">Tipo de Cáncer</Label>
                    <Select
                      value={formData.cancerType}
                      onValueChange={(value) => handleInputChange("cancerType", value)}
                    >
                      <SelectTrigger id="cancerType">
                        <SelectValue placeholder="Selecciona el tipo de cáncer" />
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
                    <Label htmlFor="cancerStage">Etapa</Label>
                    <Select
                      value={formData.cancerStage}
                      onValueChange={(value) => handleInputChange("cancerStage", value)}
                    >
                      <SelectTrigger id="cancerStage">
                        <SelectValue placeholder="Selecciona la etapa" />
                      </SelectTrigger>
                      <SelectContent>
                        {etapasCancer.map((etapa) => (
                          <SelectItem key={etapa} value={etapa}>
                            {etapa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosisDate">Fecha de Diagnóstico</Label>
                    <Input
                      id="diagnosisDate"
                      type="date"
                      value={formData.diagnosisDate}
                      onChange={(e) => handleInputChange("diagnosisDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="treatmentStatus">Estado del Tratamiento</Label>
                    <Select
                      value={formData.treatmentStatus}
                      onValueChange={(value) => handleInputChange("treatmentStatus", value)}
                    >
                      <SelectTrigger id="treatmentStatus">
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadosTratamiento.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Alergias</Label>
                  <div className="flex gap-2 mb-2">
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (!selectedAllergies.includes(value)) {
                          setSelectedAllergies([...selectedAllergies, value])
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona alergia" />
                      </SelectTrigger>
                      <SelectContent>
                        {alergiasComunes.map((alergia) => (
                          <SelectItem key={alergia} value={alergia}>
                            {alergia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="O escribe una alergia personalizada"
                      value={customAllergy}
                      onChange={(e) => setCustomAllergy(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (customAllergy && !selectedAllergies.includes(customAllergy)) {
                            setSelectedAllergies([...selectedAllergies, customAllergy])
                            setCustomAllergy("")
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (customAllergy && !selectedAllergies.includes(customAllergy)) {
                          setSelectedAllergies([...selectedAllergies, customAllergy])
                          setCustomAllergy("")
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedAllergies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedAllergies.map((allergy, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm"
                        >
                          <span>{allergy}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedAllergies(selectedAllergies.filter((_, i) => i !== index))}
                            className="hover:text-destructive-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Medicamentos Actuales</Label>
                  <div className="flex gap-2 mb-2">
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (!selectedMedications.includes(value)) {
                          setSelectedMedications([...selectedMedications, value])
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona medicamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicamentosComunes.map((medicamento) => (
                          <SelectItem key={medicamento} value={medicamento}>
                            {medicamento}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="O escribe un medicamento personalizado"
                      value={customMedication}
                      onChange={(e) => setCustomMedication(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (customMedication && !selectedMedications.includes(customMedication)) {
                            setSelectedMedications([...selectedMedications, customMedication])
                            setCustomMedication("")
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (customMedication && !selectedMedications.includes(customMedication)) {
                          setSelectedMedications([...selectedMedications, customMedication])
                          setCustomMedication("")
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedMedications.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedMedications.map((medication, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          <span>{medication}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedMedications(selectedMedications.filter((_, i) => i !== index))}
                            className="hover:text-primary-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Historial Médico</Label>
                  <Textarea
                    id="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                    placeholder="Describa el historial médico relevante..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contacto de Emergencia */}
            <Card>
              <CardHeader>
                <CardTitle>Contacto de Emergencia</CardTitle>
                <CardDescription>Persona a contactar en caso de emergencia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Nombre Completo</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Teléfono</Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelationship">Relación</Label>
                    <Input
                      id="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship}
                      onChange={(e) => handleInputChange("emergencyContactRelationship", e.target.value)}
                      placeholder="Ej: Esposo/a, Hijo/a, Hermano/a"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Seguro */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Seguro (Opcional)</CardTitle>
                <CardDescription>Datos del seguro médico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider">Proveedor de Seguro</Label>
                    <Input
                      id="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuranceNumber">Número de Póliza</Label>
                    <Input
                      id="insuranceNumber"
                      value={formData.insuranceNumber}
                      onChange={(e) => handleInputChange("insuranceNumber", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="oncontrol-gradient text-white"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  "Registrando..."
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Registrar Paciente
                  </>
                )}
              </Button>
              <Link href="/dashboard/medico/pacientes">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
