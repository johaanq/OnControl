"use client"

import { useState, memo, useMemo, useCallback } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, Plus, X, Save, CalendarIcon, User, Pill, Activity } from "lucide-react"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

// Mock data para pacientes y protocolos
const mockPacientes = [
  { 
    id: 1, 
    nombre: "María González", 
    edad: 45, 
    diagnostico: "Cáncer de mama", 
    estadio: "Estadio II",
    pacienteId: "PAC-2024-0847",
    avatar: "/mujer-45-a-os-sonriente-paciente-oncolog-a.jpg"
  },
  { 
    id: 2, 
    nombre: "Carlos Mendoza", 
    edad: 62, 
    diagnostico: "Cáncer de próstata",
    estadio: "Estadio III",
    pacienteId: "PAC-2024-0848",
    avatar: "/hombre-62-a-os-profesional.jpg"
  },
  { 
    id: 3, 
    nombre: "Ana Ruiz", 
    edad: 38, 
    diagnostico: "Linfoma",
    estadio: "Estadio I",
    pacienteId: "PAC-2024-0849",
    avatar: "/mujer-38-a-os-determinada.jpg"
  },
  { 
    id: 4, 
    nombre: "Luis Rodríguez", 
    edad: 55, 
    diagnostico: "Cáncer de colon",
    estadio: "Estadio II",
    pacienteId: "PAC-2024-0850",
    avatar: "/hombre-55-a-os-optimista.jpg"
  },
]

const protocolos = {
  Quimioterapia: [
    { name: "FOLFOX", description: "Oxaliplatino + 5-FU + Leucovorina", duration: "2 semanas", cycles: "12 ciclos" },
    { name: "AC-T", description: "Doxorrubicina + Ciclofosfamida seguido de Paclitaxel", duration: "3 semanas", cycles: "8 ciclos" },
    { name: "TCH", description: "Docetaxel + Carboplatin + Trastuzumab", duration: "3 semanas", cycles: "6 ciclos" },
    { name: "ABVD", description: "Doxorrubicina + Bleomicina + Vinblastina + Dacarbazina", duration: "2 semanas", cycles: "6 ciclos" },
    { name: "R-CHOP", description: "Rituximab + Ciclofosfamida + Doxorrubicina + Vincristina + Prednisona", duration: "3 semanas", cycles: "6 ciclos" }
  ],
  Radioterapia: [
    { name: "IMRT", description: "Radioterapia de intensidad modulada", duration: "5-7 semanas", cycles: "25-35 sesiones" },
    { name: "3D-CRT", description: "Radioterapia conformada 3D", duration: "6-8 semanas", cycles: "30-40 sesiones" },
    { name: "SBRT", description: "Radioterapia estereotáctica corporal", duration: "1-2 semanas", cycles: "3-5 sesiones" },
    { name: "VMAT", description: "Terapia de arco volumétrico modulado", duration: "5-7 semanas", cycles: "25-35 sesiones" }
  ],
  Inmunoterapia: [
    { name: "Pembrolizumab", description: "Inhibidor de PD-1", duration: "3 semanas", cycles: "Hasta progresión" },
    { name: "Nivolumab", description: "Inhibidor de PD-1", duration: "2 semanas", cycles: "Hasta progresión" },
    { name: "Atezolizumab", description: "Inhibidor de PD-L1", duration: "3 semanas", cycles: "Hasta progresión" },
    { name: "Ipilimumab", description: "Inhibidor de CTLA-4", duration: "3 semanas", cycles: "4 ciclos" }
  ],
  "Terapia dirigida": [
    { name: "Trastuzumab", description: "Anticuerpo anti-HER2", duration: "3 semanas", cycles: "12-18 ciclos" },
    { name: "Bevacizumab", description: "Inhibidor de VEGF", duration: "2 semanas", cycles: "Hasta progresión" },
    { name: "Rituximab", description: "Anticuerpo anti-CD20", duration: "1 semana", cycles: "6-8 ciclos" },
    { name: "Cetuximab", description: "Anticuerpo anti-EGFR", duration: "1 semana", cycles: "Hasta progresión" }
  ],
  Cirugía: [
    { name: "Cirugía Oncológica", description: "Resección quirúrgica del tumor", duration: "1 día", cycles: "1 procedimiento" },
    { name: "Cirugía Laparoscópica", description: "Cirugía mínimamente invasiva", duration: "1 día", cycles: "1 procedimiento" },
    { name: "Cirugía Robótica", description: "Cirugía asistida por robot", duration: "1 día", cycles: "1 procedimiento" }
  ]
}

const medicamentosComunes = [
  "Oxaliplatino", "5-Fluorouracilo", "Leucovorina", "Doxorrubicina", "Ciclofosfamida",
  "Paclitaxel", "Carboplatin", "Pembrolizumab", "Nivolumab", "Trastuzumab",
  "Bevacizumab", "Rituximab", "Docetaxel", "Vinblastina", "Dacarbazina",
  "Vincristina", "Prednisona", "Bleomicina", "Cetuximab", "Ipilimumab"
]

const efectosSecundariosComunes = [
  "Náuseas", "Vómitos", "Fatiga", "Pérdida de apetito", "Diarrea", "Estreñimiento",
  "Alopecia", "Neuropatía periférica", "Mucositis", "Anemia", "Neutropenia",
  "Trombocitopenia", "Rash cutáneo", "Hepatotoxicidad", "Cardiotoxicidad", "Nefrotoxicidad"
]

// Memoized components for better performance
const PacienteCard = memo(function PacienteCard({ paciente }: { paciente: typeof mockPacientes[0] }) {
  return (
    <div className="p-4 bg-accent/10 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
          <User className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h4 className="font-medium">{paciente.nombre}</h4>
          <p className="text-sm text-muted-foreground">
            {paciente.edad} años • {paciente.diagnostico}
          </p>
          <p className="text-xs text-muted-foreground">
            {paciente.estadio} • ID: {paciente.pacienteId}
          </p>
        </div>
      </div>
    </div>
  )
})

const ProtocoloInfo = memo(function ProtocoloInfo({ protocolo }: { protocolo: { name: string; description: string; duration: string; cycles: string } | undefined }) {
  if (!protocolo) return null
  
  return (
    <div className="p-3 bg-secondary/10 rounded-lg">
      <p className="text-sm text-muted-foreground">{protocolo.description}</p>
      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
        <span>⏱️ Duración: {protocolo.duration}</span>
        <span>🔄 Ciclos: {protocolo.cycles}</span>
      </div>
    </div>
  )
})

export default function NuevoTratamientoPage() {
  const [formData, setFormData] = useState({
    pacienteId: "",
    tipoTratamiento: "",
    protocolo: "",
    ciclosTotal: "",
    fechaInicio: addDays(new Date(), 1),
    frecuencia: "",
    notas: "",
    medicamentos: [] as string[],
    efectosSecundarios: [] as string[],
    objetivos: "",
    contraindicaciones: "",
    prioridad: "normal",
    estado: "planificado",
    medicoResponsable: "Dr. Carlos Mendoza",
    ubicacion: "Sala de Infusiones",
    duracionEstimada: "",
    costoEstimado: "",
    seguimiento: "",
    customMedicamento: "",
    customEfecto: ""
  })

  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState("")
  const [efectoSeleccionado, setEfectoSeleccionado] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPaciente, setSelectedPaciente] = useState<typeof mockPacientes[0] | null>(null)

  const handleInputChange = useCallback((field: string, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handlePacienteChange = useCallback((pacienteId: string) => {
    const paciente = mockPacientes.find(p => p.id.toString() === pacienteId)
    setSelectedPaciente(paciente || null)
    setFormData((prev) => ({ ...prev, pacienteId }))
  }, [])

  const agregarMedicamento = useCallback(() => {
    if (medicamentoSeleccionado && !formData.medicamentos.includes(medicamentoSeleccionado)) {
      setFormData((prev) => ({
        ...prev,
        medicamentos: [...prev.medicamentos, medicamentoSeleccionado],
      }))
      setMedicamentoSeleccionado("")
    }
  }, [medicamentoSeleccionado, formData.medicamentos])

  const agregarEfectoSecundario = useCallback(() => {
    if (efectoSeleccionado && !formData.efectosSecundarios.includes(efectoSeleccionado)) {
      setFormData((prev) => ({
        ...prev,
        efectosSecundarios: [...prev.efectosSecundarios, efectoSeleccionado],
      }))
      setEfectoSeleccionado("")
    }
  }, [efectoSeleccionado, formData.efectosSecundarios])

  const removerMedicamento = useCallback((medicamento: string) => {
    setFormData((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.filter((m) => m !== medicamento),
    }))
  }, [])

  const removerEfectoSecundario = useCallback((efecto: string) => {
    setFormData((prev) => ({
      ...prev,
      efectosSecundarios: prev.efectosSecundarios.filter((e) => e !== efecto),
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Here you would typically send the data to your backend
    console.log("Treatment data:", {
      ...formData,
      paciente: selectedPaciente,
      protocoloDetalle: protocolosDisponibles.find(p => p.name === formData.protocolo)
    })
    
    setIsSubmitting(false)
    
    // Redirect to treatments page after successful submission
    window.location.href = "/dashboard/medico/tratamientos"
  }

  const protocolosDisponibles = useMemo(() => 
    formData.tipoTratamiento
      ? protocolos[formData.tipoTratamiento as keyof typeof protocolos] || []
      : [],
    [formData.tipoTratamiento]
  )

  const protocoloSeleccionado = useMemo(() => 
    protocolosDisponibles.find(p => p.name === formData.protocolo),
    [protocolosDisponibles, formData.protocolo]
  )

  const isFormValid = useMemo(() => 
    formData.pacienteId && formData.tipoTratamiento && formData.protocolo && formData.ciclosTotal && formData.fechaInicio,
    [formData.pacienteId, formData.tipoTratamiento, formData.protocolo, formData.ciclosTotal, formData.fechaInicio]
  )

  return (
    <AuthGuard requiredUserType="medico">
      <DashboardLayout userType="medico">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/medico/tratamientos">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Nuevo Tratamiento</h1>
              <p className="text-muted-foreground mt-1">Crear un nuevo protocolo de tratamiento para un paciente</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Información del Paciente
                  </CardTitle>
                  <CardDescription>Selecciona el paciente y tipo de tratamiento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paciente">Paciente *</Label>
                    <Select value={formData.pacienteId} onValueChange={handlePacienteChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPacientes.map((paciente) => (
                          <SelectItem key={paciente.id} value={paciente.id.toString()}>
                            <div>
                              <div className="font-medium">{paciente.nombre}</div>
                              <div className="text-xs text-muted-foreground">
                                {paciente.diagnostico} • {paciente.estadio} • ID: {paciente.pacienteId}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                   {selectedPaciente && <PacienteCard paciente={selectedPaciente} />}

                  <div className="space-y-2">
                    <Label htmlFor="tipoTratamiento">Tipo de Tratamiento *</Label>
                    <Select
                      value={formData.tipoTratamiento}
                      onValueChange={(value) => handleInputChange("tipoTratamiento", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Quimioterapia">Quimioterapia</SelectItem>
                        <SelectItem value="Radioterapia">Radioterapia</SelectItem>
                        <SelectItem value="Inmunoterapia">Inmunoterapia</SelectItem>
                        <SelectItem value="Terapia dirigida">Terapia dirigida</SelectItem>
                        <SelectItem value="Cirugía">Cirugía</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Protocolo y Programación */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-secondary" />
                    Protocolo y Programación
                  </CardTitle>
                  <CardDescription>Configuración del protocolo de tratamiento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="protocolo">Protocolo *</Label>
                    <Select
                      value={formData.protocolo}
                      onValueChange={(value) => handleInputChange("protocolo", value)}
                      disabled={!formData.tipoTratamiento}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar protocolo" />
                      </SelectTrigger>
                      <SelectContent>
                        {protocolosDisponibles.map((protocolo) => (
                          <SelectItem key={protocolo.name} value={protocolo.name}>
                            <div>
                              <div className="font-medium">{protocolo.name}</div>
                              <div className="text-xs text-muted-foreground">{protocolo.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                     {protocoloSeleccionado && <ProtocoloInfo protocolo={protocoloSeleccionado} />}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ciclosTotal">Ciclos Totales *</Label>
                      <Input
                        id="ciclosTotal"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.ciclosTotal}
                        onChange={(e) => handleInputChange("ciclosTotal", e.target.value)}
                        placeholder="Ej: 6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frecuencia">Frecuencia</Label>
                      <Select value={formData.frecuencia} onValueChange={(value) => handleInputChange("frecuencia", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="semanal">Semanal</SelectItem>
                          <SelectItem value="cada-2-semanas">Cada 2 semanas</SelectItem>
                          <SelectItem value="cada-3-semanas">Cada 3 semanas</SelectItem>
                          <SelectItem value="mensual">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.fechaInicio, "dd/MM/yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                          mode="single" 
                          selected={formData.fechaInicio} 
                          onSelect={(date) => date && handleInputChange("fechaInicio", date)} 
                          locale={es} 
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Medicamentos y Efectos Secundarios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-accent" />
                    Medicamentos
                  </CardTitle>
                  <CardDescription>Medicamentos del protocolo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={medicamentoSeleccionado} onValueChange={setMedicamentoSeleccionado}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Seleccionar medicamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicamentosComunes.map((medicamento) => (
                          <SelectItem key={medicamento} value={medicamento}>
                            {medicamento}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={agregarMedicamento} disabled={!medicamentoSeleccionado}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {formData.medicamentos.length > 0 && (
                    <div className="space-y-2">
                      <Label>Medicamentos seleccionados:</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.medicamentos.map((medicamento) => (
                          <Badge key={medicamento} variant="secondary" className="flex items-center gap-1">
                            {medicamento}
                            <button
                              type="button"
                              onClick={() => removerMedicamento(medicamento)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-destructive" />
                    Efectos Secundarios Esperados
                  </CardTitle>
                  <CardDescription>Efectos adversos potenciales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={efectoSeleccionado} onValueChange={setEfectoSeleccionado}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Seleccionar efecto secundario" />
                      </SelectTrigger>
                      <SelectContent>
                        {efectosSecundariosComunes.map((efecto) => (
                          <SelectItem key={efecto} value={efecto}>
                            {efecto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={agregarEfectoSecundario} disabled={!efectoSeleccionado}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {formData.efectosSecundarios.length > 0 && (
                    <div className="space-y-2">
                      <Label>Efectos secundarios esperados:</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.efectosSecundarios.map((efecto) => (
                          <Badge key={efecto} variant="outline" className="flex items-center gap-1 bg-orange-50 text-orange-700">
                            {efecto}
                            <button
                              type="button"
                              onClick={() => removerEfectoSecundario(efecto)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <Card>
              <CardHeader>
                <CardTitle>Información Adicional</CardTitle>
                <CardDescription>Objetivos, notas y consideraciones especiales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prioridad">Prioridad del Tratamiento</Label>
                    <Select value={formData.prioridad} onValueChange={(value) => handleInputChange("prioridad", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación del Tratamiento</Label>
                    <Select value={formData.ubicacion} onValueChange={(value) => handleInputChange("ubicacion", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sala de Infusiones">Sala de Infusiones</SelectItem>
                        <SelectItem value="Consultorio">Consultorio</SelectItem>
                        <SelectItem value="Quirófano">Quirófano</SelectItem>
                        <SelectItem value="Sala de Radioterapia">Sala de Radioterapia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objetivos">Objetivos del Tratamiento</Label>
                  <Textarea
                    id="objetivos"
                    value={formData.objetivos}
                    onChange={(e) => handleInputChange("objetivos", e.target.value)}
                    placeholder="Describe los objetivos principales del tratamiento..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contraindicaciones">Contraindicaciones y Precauciones</Label>
                  <Textarea
                    id="contraindicaciones"
                    value={formData.contraindicaciones}
                    onChange={(e) => handleInputChange("contraindicaciones", e.target.value)}
                    placeholder="Menciona cualquier contraindicación o precaución especial..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seguimiento">Plan de Seguimiento</Label>
                  <Textarea
                    id="seguimiento"
                    value={formData.seguimiento}
                    onChange={(e) => handleInputChange("seguimiento", e.target.value)}
                    placeholder="Describe el plan de seguimiento y monitoreo..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notas">Notas Adicionales</Label>
                  <Textarea
                    id="notas"
                    value={formData.notas}
                    onChange={(e) => handleInputChange("notas", e.target.value)}
                    placeholder="Cualquier información adicional relevante..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resumen del Tratamiento */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Tratamiento</CardTitle>
                <CardDescription>Revisa la información antes de crear el tratamiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Paciente:</span>
                    <p className="font-medium">{selectedPaciente?.nombre || "No seleccionado"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Tipo:</span>
                    <p className="font-medium">{formData.tipoTratamiento || "No especificado"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Protocolo:</span>
                    <p className="font-medium">{formData.protocolo || "No especificado"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Ciclos:</span>
                    <p className="font-medium">{formData.ciclosTotal || "No especificado"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Fecha de Inicio:</span>
                    <p className="font-medium">{format(formData.fechaInicio, "dd/MM/yyyy")}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Prioridad:</span>
                    <p className="font-medium">{formData.prioridad || "Normal"}</p>
                  </div>
                </div>
                {formData.medicamentos.length > 0 && (
                  <div className="mt-4">
                    <span className="font-medium text-muted-foreground">Medicamentos:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.medicamentos.map((medicamento, index) => (
                        <span key={index} className="px-2 py-1 bg-secondary/10 text-secondary rounded-md text-xs">
                          {medicamento}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/medico/tratamientos">Cancelar</Link>
              </Button>
              <Button 
                type="submit" 
                className="oncontrol-gradient text-white"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Crear Tratamiento
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