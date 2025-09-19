"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ArrowLeft, 
  Save, 
  Info
} from "lucide-react"
import { format, addDays, isBefore, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

// Appointment types and doctors
const appointmentTypes = [
  { value: "consulta-seguimiento", label: "Consulta de Seguimiento", description: "Revisión médica de rutina", duration: 30 },
  { value: "consulta-urgencia", label: "Consulta de Urgencia", description: "Atención médica urgente", duration: 45 },
  { value: "revision-examenes", label: "Revisión de Exámenes", description: "Revisión de resultados de laboratorio", duration: 20 },
  { value: "consulta-nutricion", label: "Consulta Nutricional", description: "Asesoramiento nutricional", duration: 30 },
  { value: "consulta-psicologica", label: "Consulta Psicológica", description: "Apoyo psicológico", duration: 60 },
  { value: "consulta-dolor", label: "Consulta de Manejo del Dolor", description: "Evaluación y manejo del dolor", duration: 45 },
  { value: "consulta-general", label: "Consulta General", description: "Consulta médica general", duration: 30 },
  { value: "otro", label: "Otro", description: "Otro tipo de consulta", duration: 30 }
]

const availableDoctors = [
  {
    id: 1,
    name: "Dr. Carlos Mendoza",
    specialty: "Oncología Médica",
    avatar: "/hombre-62-a-os-profesional.jpg",
    availableDays: ["lunes", "martes", "miércoles", "jueves", "viernes"],
    availableHours: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]
  },
  {
    id: 2,
    name: "Dr. Ana Martínez",
    specialty: "Radiología",
    avatar: "/hombre-62-a-os-profesional.jpg",
    availableDays: ["lunes", "miércoles", "viernes"],
    availableHours: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"]
  },
  {
    id: 3,
    name: "Dr. Luis Rodríguez",
    specialty: "Nutrición Clínica",
    avatar: "/hombre-62-a-os-profesional.jpg",
    availableDays: ["martes", "jueves"],
    availableHours: ["09:00", "10:00", "11:00", "15:00", "16:00"]
  },
  {
    id: 4,
    name: "Dra. María González",
    specialty: "Psicología Oncológica",
    avatar: "/mujer-45-a-os-sonriente-paciente-oncolog-a.jpg",
    availableDays: ["lunes", "miércoles", "viernes"],
    availableHours: ["10:00", "11:00", "14:00", "15:00", "16:00"]
  }
]

const locations = [
  "Consultorio 205 - Oncología",
  "Consultorio 210 - Radiología", 
  "Consultorio 215 - Nutrición",
  "Consultorio 220 - Psicología",
  "Sala de Infusiones",
  "Laboratorio Clínico",
  "Otro"
]

export default function NuevaCitaPage() {
  const [formData, setFormData] = useState({
    appointmentType: "",
    doctor: "",
    date: addDays(new Date(), 1), // Tomorrow by default
    time: "",
    location: "",
    reason: "",
    symptoms: "",
    urgency: "normal",
    preferredContact: "telefono",
    notes: "",
    customType: "",
    customLocation: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCustomType, setShowCustomType] = useState(false)
  const [showCustomLocation, setShowCustomLocation] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<typeof availableDoctors[0] | null>(null)

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Update doctor when appointment type changes
    if (field === "appointmentType") {
      const doctor = availableDoctors.find(d => 
        d.specialty.toLowerCase().includes(value.toString().toLowerCase()) ||
        value.toString().includes(d.specialty.toLowerCase())
      )
      if (doctor) {
        setSelectedDoctor(doctor)
        setFormData(prev => ({ ...prev, doctor: doctor.id.toString() }))
      }
    }
  }

  const handleDoctorChange = (doctorId: string) => {
    const doctor = availableDoctors.find(d => d.id.toString() === doctorId)
    setSelectedDoctor(doctor || null)
    setFormData(prev => ({ ...prev, doctor: doctorId }))
  }

  const getAvailableTimes = () => {
    if (!selectedDoctor || !formData.date) return []
    
    const dayName = format(formData.date, "EEEE", { locale: es }).toLowerCase()
    const isAvailableDay = selectedDoctor.availableDays.includes(dayName)
    
    if (!isAvailableDay) return []
    
    return selectedDoctor.availableHours
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Here you would typically send the data to your backend
    console.log("Appointment request:", {
      ...formData,
      doctor: selectedDoctor,
      status: "Pendiente" // New appointments start as pending
    })
    
    setIsSubmitting(false)
    
    // Redirect to appointments page after successful submission
    window.location.href = "/dashboard/paciente/citas"
  }

  const isFormValid = formData.appointmentType && formData.doctor && formData.date && formData.time && formData.reason

  const urgencyLevels = [
    { value: "normal", label: "Normal", description: "Cita de rutina", color: "text-primary" },
    { value: "urgente", label: "Urgente", description: "Requiere atención en 24-48 horas", color: "text-secondary" },
    { value: "muy-urgente", label: "Muy Urgente", description: "Requiere atención inmediata", color: "text-destructive" }
  ]

  return (
    <AuthGuard requiredUserType="paciente">
      <DashboardLayout userType="paciente">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/paciente/citas">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Solicitar Nueva Cita</h1>
              <p className="text-muted-foreground">Agenda una cita médica con tu doctor</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Appointment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Detalles de la Cita
                  </CardTitle>
                  <CardDescription>Información básica de tu consulta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentType">Tipo de Consulta *</Label>
                    <Select value={formData.appointmentType} onValueChange={(value) => {
                      if (value === "otro") {
                        setShowCustomType(true)
                        handleInputChange("appointmentType", "")
                      } else {
                        setShowCustomType(false)
                        handleInputChange("appointmentType", value)
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de consulta" />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {showCustomType && (
                      <Input
                        placeholder="Describe el tipo de consulta"
                        value={formData.customType}
                        onChange={(e) => handleInputChange("customType", e.target.value)}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor *</Label>
                    <Select value={formData.doctor} onValueChange={handleDoctorChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDoctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-medium">{doctor.name}</div>
                                <div className="text-xs text-muted-foreground">{doctor.specialty}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Nivel de Urgencia</Label>
                    <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la urgencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div>
                              <div className="font-medium">{level.label}</div>
                              <div className="text-xs text-muted-foreground">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Motivo de la Consulta *</Label>
                    <Textarea
                      placeholder="Describe brevemente el motivo de tu consulta..."
                      value={formData.reason}
                      onChange={(e) => handleInputChange("reason", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Síntomas Actuales</Label>
                    <Textarea
                      placeholder="Describe los síntomas que estás experimentando..."
                      value={formData.symptoms}
                      onChange={(e) => handleInputChange("symptoms", e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-secondary" />
                    Programación
                  </CardTitle>
                  <CardDescription>Fecha, hora y ubicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha Preferida *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.date, "dd/MM/yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                          mode="single" 
                          selected={formData.date} 
                          onSelect={(date) => date && handleInputChange("date", date)} 
                          locale={es} 
                          initialFocus
                          disabled={(date) => {
                            const dayName = format(date, "EEEE", { locale: es }).toLowerCase()
                            return isBefore(date, startOfDay(addDays(new Date(), 1))) ||
                                   (selectedDoctor ? !selectedDoctor.availableDays.includes(dayName) : false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {selectedDoctor && (
                      <p className="text-xs text-muted-foreground">
                        Disponible: {selectedDoctor.availableDays.join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Hora Preferida *</Label>
                    <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableTimes().map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getAvailableTimes().length === 0 && selectedDoctor && (
                      <p className="text-xs text-destructive">
                        No hay horarios disponibles para este doctor en la fecha seleccionada
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Select value={formData.location} onValueChange={(value) => {
                      if (value === "Otro") {
                        setShowCustomLocation(true)
                        handleInputChange("location", "")
                      } else {
                        setShowCustomLocation(false)
                        handleInputChange("location", value)
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {showCustomLocation && (
                      <Input
                        placeholder="Especifica la ubicación"
                        value={formData.customLocation}
                        onChange={(e) => handleInputChange("customLocation", e.target.value)}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredContact">Método de Contacto Preferido</Label>
                    <Select value={formData.preferredContact} onValueChange={(value) => handleInputChange("preferredContact", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Cómo prefieres que te contactemos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telefono">Teléfono</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="app">Aplicación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      placeholder="Cualquier información adicional que consideres importante..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Doctor Information */}
            {selectedDoctor && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    Información del Doctor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center">
                      <User className="h-8 w-8 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{selectedDoctor.name}</h3>
                      <p className="text-muted-foreground">{selectedDoctor.specialty}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>📅 Disponible: {selectedDoctor.availableDays.join(", ")}</span>
                        <span>🕐 Horarios: {selectedDoctor.availableHours.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Important Information */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Tu solicitud de cita será enviada al doctor para su aprobación. 
                Recibirás una notificación una vez que el doctor confirme o sugiera una fecha alternativa.
              </AlertDescription>
            </Alert>

            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de la Solicitud</CardTitle>
                <CardDescription>Revisa la información antes de enviar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Tipo de Consulta:</span>
                    <p className="font-medium">
                      {formData.appointmentType === "otro" ? formData.customType : 
                       appointmentTypes.find(t => t.value === formData.appointmentType)?.label || "No especificado"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Doctor:</span>
                    <p className="font-medium">
                      {selectedDoctor ? selectedDoctor.name : "No seleccionado"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Fecha y Hora:</span>
                    <p className="font-medium">
                      {format(formData.date, "dd/MM/yyyy")} {formData.time || "No especificada"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Ubicación:</span>
                    <p className="font-medium">
                      {formData.location === "Otro" ? formData.customLocation : formData.location || "No especificada"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Urgencia:</span>
                    <p className="font-medium">
                      {urgencyLevels.find(u => u.value === formData.urgency)?.label || "Normal"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Contacto:</span>
                    <p className="font-medium">
                      {formData.preferredContact === "telefono" ? "Teléfono" :
                       formData.preferredContact === "email" ? "Email" :
                       formData.preferredContact === "sms" ? "SMS" : "Aplicación"}
                    </p>
                  </div>
                </div>
                {formData.reason && (
                  <div className="mt-4">
                    <span className="font-medium text-muted-foreground">Motivo:</span>
                    <p className="text-sm mt-1">{formData.reason}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/paciente/citas">Cancelar</Link>
              </Button>
              <Button 
                type="submit" 
                className="oncontrol-gradient text-white"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando Solicitud...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Solicitar Cita
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
