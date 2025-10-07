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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, X, Save, CalendarIcon, User, Pill, Activity, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/auth-context"
import { isDoctorUser } from "@/types/organization"
import { treatments, doctors } from "@/lib/api"
import type { CreateTreatmentRequest, PatientProfileResponse, TreatmentType } from "@/lib/api"

const treatmentTypes: Array<{ value: TreatmentType, label: string }> = [
  { value: 'CHEMOTHERAPY', label: 'Quimioterapia' },
  { value: 'RADIOTHERAPY', label: 'Radioterapia' },
  { value: 'IMMUNOTHERAPY', label: 'Inmunoterapia' },
  { value: 'SURGERY', label: 'Cirugía' },
  { value: 'HORMONE_THERAPY', label: 'Terapia Hormonal' },
  { value: 'TARGETED_THERAPY', label: 'Terapia Dirigida' },
  { value: 'STEM_CELL_TRANSPLANT', label: 'Trasplante de Células Madre' }
]

const commonMedications = [
  "Oxaliplatino", "5-Fluorouracilo", "Leucovorina", "Doxorrubicina", "Ciclofosfamida",
  "Paclitaxel", "Carboplatin", "Pembrolizumab", "Nivolumab", "Trastuzumab",
  "Bevacizumab", "Rituximab", "Docetaxel", "Vinblastina", "Dacarbazina",
  "Vincristina", "Prednisona", "Bleomicina", "Cetuximab", "Ipilimumab"
]

const protocolos = {
  CHEMOTHERAPY: [
    "FOLFOX - Oxaliplatino + 5-FU + Leucovorina",
    "AC-T - Doxorrubicina + Ciclofosfamida + Paclitaxel",
    "TCH - Docetaxel + Carboplatin + Trastuzumab",
    "ABVD - Doxorrubicina + Bleomicina + Vinblastina + Dacarbazina",
    "R-CHOP - Rituximab + Ciclofosfamida + Doxorrubicina + Vincristina + Prednisona",
    "FOLFIRINOX - 5-FU + Leucovorina + Irinotecan + Oxaliplatino",
    "CMF - Ciclofosfamida + Metotrexato + 5-FU",
    "Cisplatino + Gemcitabina"
  ],
  RADIOTHERAPY: [
    "IMRT - Radioterapia de Intensidad Modulada",
    "3D-CRT - Radioterapia Conformada 3D",
    "SBRT - Radioterapia Estereotáctica",
    "VMAT - Terapia de Arco Volumétrico Modulado",
    "Braquiterapia",
    "Radioterapia Conformacional"
  ],
  IMMUNOTHERAPY: [
    "Pembrolizumab - Inhibidor PD-1",
    "Nivolumab - Inhibidor PD-1",
    "Atezolizumab - Inhibidor PD-L1",
    "Ipilimumab - Inhibidor CTLA-4",
    "Durvalumab - Inhibidor PD-L1"
  ],
  SURGERY: [
    "Resección Quirúrgica",
    "Cirugía Laparoscópica",
    "Cirugía Robótica",
    "Mastectomía",
    "Lumpectomía",
    "Colectomía",
    "Prostatectomía"
  ],
  HORMONE_THERAPY: [
    "Tamoxifeno",
    "Letrozol",
    "Anastrozol",
    "Exemestano",
    "Fulvestrant",
    "Goserelina"
  ],
  TARGETED_THERAPY: [
    "Trastuzumab - Anti-HER2",
    "Bevacizumab - Anti-VEGF",
    "Rituximab - Anti-CD20",
    "Cetuximab - Anti-EGFR",
    "Imatinib - Inhibidor de Tirosina Quinasa"
  ],
  STEM_CELL_TRANSPLANT: [
    "Trasplante Autólogo",
    "Trasplante Alogénico",
    "Trasplante de Sangre de Cordón"
  ]
}

const locations = [
  "Consultorio 101 - Piso 1",
  "Consultorio 102 - Piso 1",
  "Consultorio 201 - Piso 2",
  "Consultorio 202 - Piso 2",
  "Consultorio 301 - Piso 3",
  "Sala de Infusiones - Piso 2",
  "Sala de Procedimientos - Piso 1",
  "Área de Quimioterapia - Piso 3",
  "Área de Radioterapia - Sótano",
  "Quirófano 1 - Piso 4",
  "Quirófano 2 - Piso 4"
]

export default function NuevoTratamientoPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [doctorProfileId, setDoctorProfileId] = useState<number | null>(null)
  const [patients, setPatients] = useState<PatientProfileResponse[]>([])
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)
  
  const [formData, setFormData] = useState({
    patientProfileId: "" as string | number,
    type: "" as TreatmentType | "",
    protocol: "",
    totalCycles: "",
    startDate: undefined as Date | undefined,
    sessionDurationMinutes: "",
    location: "",
    medications: [] as string[],
    notes: "",
    preparationInstructions: ""
  })
  
  const [customMedication, setCustomMedication] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user && isDoctorUser(user)) {
      setDoctorProfileId(user.profile.id)
    }
  }, [user])

  useEffect(() => {
    const loadPatients = async () => {
      if (!doctorProfileId) return

      try {
        setIsLoadingPatients(true)
        const patientsList = await doctors.getPatients(doctorProfileId)
        setPatients(patientsList)
      } catch (err) {
        console.error('Error loading patients:', err)
        setError('Error al cargar la lista de pacientes')
      } finally {
        setIsLoadingPatients(false)
      }
    }

    loadPatients()
  }, [doctorProfileId])

  const handleInputChange = (field: string, value: string | Date | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const addMedication = (medication: string) => {
    if (medication && !formData.medications.includes(medication)) {
      setFormData((prev) => ({
        ...prev,
        medications: [...prev.medications, medication]
      }))
    }
  }

  const removeMedication = (medication: string) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m !== medication)
    }))
  }

  const handleAddCustomMedication = () => {
    if (customMedication.trim()) {
      addMedication(customMedication.trim())
      setCustomMedication("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!doctorProfileId) {
      setError("Error: No se pudo identificar el médico")
      setIsLoading(false)
      return
    }

    // Validaciones
    if (!formData.patientProfileId || formData.patientProfileId === "" || !formData.type || !formData.protocol || !formData.totalCycles || !formData.startDate) {
      setError("Por favor completa todos los campos obligatorios")
      setIsLoading(false)
      return
    }

    try {
      const treatmentData: CreateTreatmentRequest = {
        type: formData.type as TreatmentType,
        protocol: formData.protocol,
        totalCycles: parseInt(formData.totalCycles),
        startDate: format(formData.startDate, 'yyyy-MM-dd'),
        sessionDurationMinutes: formData.sessionDurationMinutes ? parseInt(formData.sessionDurationMinutes) : undefined,
        location: formData.location || undefined,
        medications: formData.medications.length > 0 ? formData.medications : undefined,
        notes: formData.notes || undefined,
        preparationInstructions: formData.preparationInstructions || undefined
      }

      const patientId = typeof formData.patientProfileId === 'string' 
        ? parseInt(formData.patientProfileId) 
        : formData.patientProfileId;
      
      await treatments.create(doctorProfileId, patientId, treatmentData)
      setSuccess(true)

      setTimeout(() => {
        router.push("/dashboard/medico/tratamientos")
      }, 2000)
    } catch (err) {
      console.error('Error creating treatment:', err)
      setError(err instanceof Error ? err.message : "Error al crear el tratamiento")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <AuthGuard requiredRole="DOCTOR">
        <DashboardLayout>
          <div className="max-w-2xl mx-auto py-12">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">¡Tratamiento creado exitosamente!</h2>
                <p className="text-muted-foreground mb-6">
                  El tratamiento ha sido registrado y está disponible para el paciente.
                </p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/medico/tratamientos">Ver Tratamientos</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/dashboard/medico/tratamientos/nuevo">Crear Otro Tratamiento</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  const selectedPatient: PatientProfileResponse | undefined = patients.find(p => 
    p.id === (typeof formData.patientProfileId === 'string' ? parseInt(formData.patientProfileId) : formData.patientProfileId)
  )

  return (
    <AuthGuard requiredRole="DOCTOR">
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div>
              <Link href="/dashboard/medico/tratamientos">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a tratamientos
              </Button>
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Nuevo Tratamiento</h1>
            <p className="text-muted-foreground">Registra un nuevo tratamiento oncológico para un paciente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Patient Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Selección de Paciente
                  </CardTitle>
                <CardDescription>Elige el paciente que recibirá el tratamiento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                  <Label htmlFor="patient">
                    Paciente <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.patientProfileId ? formData.patientProfileId.toString() : ""}
                    onValueChange={(value) => handleInputChange("patientProfileId", parseInt(value))}
                    disabled={isLoadingPatients}
                  >
                    <SelectTrigger id="patient">
                      <SelectValue placeholder={isLoadingPatients ? "Cargando pacientes..." : "Selecciona un paciente"} />
                      </SelectTrigger>
                      <SelectContent>
                      {patients.length === 0 && !isLoadingPatients ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No hay pacientes registrados
                              </div>
                      ) : (
                        patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id.toString()}>
                            {patient.firstName} {patient.lastName} - {patient.cancerType || "Sin diagnóstico"}
                          </SelectItem>
                        ))
                      )}
                      </SelectContent>
                    </Select>
                  </div>

                {selectedPatient && (
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <h4 className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedPatient.cancerType} {selectedPatient.cancerStage && `- ${selectedPatient.cancerStage}`}
                    </p>
                    <p className="text-xs text-muted-foreground">ID: {selectedPatient.profileId}</p>
                  </div>
                )}
                </CardContent>
              </Card>

            {/* Treatment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Detalles del Tratamiento
                  </CardTitle>
                <CardDescription>Información básica del protocolo de tratamiento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">
                      Tipo de Tratamiento <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value as TreatmentType)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {treatmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="protocol">
                      Protocolo <span className="text-destructive">*</span>
                    </Label>
                    {formData.type && protocolos[formData.type as TreatmentType] ? (
                      <Select
                        value={formData.protocol}
                        onValueChange={(value) => handleInputChange("protocol", value)}
                      >
                        <SelectTrigger id="protocol">
                          <SelectValue placeholder="Selecciona un protocolo" />
                        </SelectTrigger>
                        <SelectContent>
                          {protocolos[formData.type as TreatmentType].map((protocolo) => (
                            <SelectItem key={protocolo} value={protocolo}>
                              {protocolo}
                            </SelectItem>
                          ))}
                          <SelectItem value="otro">Otro (personalizado)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="protocol"
                        placeholder="Primero selecciona un tipo de tratamiento"
                        value={formData.protocol}
                        onChange={(e) => handleInputChange("protocol", e.target.value)}
                        disabled={!formData.type}
                      />
                    )}
                    {formData.protocol === "otro" && (
                      <Input
                        placeholder="Especifica el protocolo personalizado"
                        value={formData.protocol === "otro" ? "" : formData.protocol}
                        onChange={(e) => handleInputChange("protocol", e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="totalCycles">
                      Ciclos Totales <span className="text-destructive">*</span>
                    </Label>
                      <Input
                      id="totalCycles"
                        type="number"
                        min="1"
                        placeholder="Ej: 6"
                      value={formData.totalCycles}
                      onChange={(e) => handleInputChange("totalCycles", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Fecha de Inicio <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                          mode="single" 
                          selected={formData.startDate}
                          onSelect={(date) => handleInputChange("startDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
            </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionDuration">Duración de Sesión (minutos)</Label>
                    <Input
                      id="sessionDuration"
                      type="number"
                      min="15"
                      placeholder="Ej: 120"
                      value={formData.sessionDurationMinutes}
                      onChange={(e) => handleInputChange("sessionDurationMinutes", e.target.value)}
                    />
                  </div>

                    <div className="space-y-2">
                    <Label htmlFor="location">Ubicación / Consultorio</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => handleInputChange("location", value)}
                    >
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Selecciona una ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                      </div>
                    </div>
                </CardContent>
              </Card>

            {/* Medications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Medicamentos
                  </CardTitle>
                <CardDescription>Medicamentos incluidos en el protocolo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                  <Select
                    value=""
                    onValueChange={(value) => addMedication(value)}
                  >
                      <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecciona un medicamento" />
                      </SelectTrigger>
                      <SelectContent>
                      {commonMedications.map((med) => (
                        <SelectItem key={med} value={med}>
                          {med}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="O escribe un medicamento personalizado"
                    value={customMedication}
                    onChange={(e) => setCustomMedication(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddCustomMedication()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomMedication}
                  >
                    <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                {formData.medications.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                    {formData.medications.map((med, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        <span>{med}</span>
                            <button
                              type="button"
                          onClick={() => removeMedication(med)}
                          className="hover:text-destructive"
                            >
                          <X className="h-3 w-3" />
                            </button>
                      </div>
                    ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información Adicional</CardTitle>
                <CardDescription>Notas e instrucciones para el tratamiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    placeholder="Observaciones generales sobre el tratamiento..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preparation">Instrucciones de Preparación</Label>
                  <Textarea
                    id="preparation"
                    placeholder="Indicaciones para el paciente antes de cada sesión..."
                    value={formData.preparationInstructions}
                    onChange={(e) => handleInputChange("preparationInstructions", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/medico/tratamientos">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Creando..." : "Crear Tratamiento"}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
