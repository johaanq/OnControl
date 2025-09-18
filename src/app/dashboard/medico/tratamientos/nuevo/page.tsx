"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Save } from "lucide-react"
import Link from "next/link"

// Mock data para pacientes y protocolos
const mockPacientes = [
  { id: 1, nombre: "María González", edad: 45, diagnostico: "Cáncer de mama" },
  { id: 2, nombre: "Carlos Mendoza", edad: 62, diagnostico: "Cáncer de próstata" },
  { id: 3, nombre: "Ana Ruiz", edad: 38, diagnostico: "Linfoma" },
]

const protocolos = {
  Quimioterapia: ["FOLFOX", "AC-T", "TCH", "ABVD", "R-CHOP"],
  Radioterapia: ["IMRT", "3D-CRT", "SBRT", "VMAT"],
  Inmunoterapia: ["Pembrolizumab", "Nivolumab", "Atezolizumab"],
  "Terapia dirigida": ["Trastuzumab", "Bevacizumab", "Rituximab"],
}

const medicamentosComunes = [
  "Oxaliplatino",
  "5-Fluorouracilo",
  "Leucovorina",
  "Doxorrubicina",
  "Ciclofosfamida",
  "Paclitaxel",
  "Carboplatin",
  "Pembrolizumab",
]

export default function NuevoTratamientoPage() {
  const [formData, setFormData] = useState({
    pacienteId: "",
    tipoTratamiento: "",
    protocolo: "",
    ciclosTotal: "",
    fechaInicio: "",
    frecuencia: "",
    notas: "",
    medicamentos: [] as string[],
    objetivos: "",
    contraindicaciones: "",
  })

  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const agregarMedicamento = () => {
    if (medicamentoSeleccionado && !formData.medicamentos.includes(medicamentoSeleccionado)) {
      setFormData((prev) => ({
        ...prev,
        medicamentos: [...prev.medicamentos, medicamentoSeleccionado],
      }))
      setMedicamentoSeleccionado("")
    }
  }

  const removerMedicamento = (medicamento: string) => {
    setFormData((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.filter((m) => m !== medicamento),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar lógica de guardado
    console.log("Datos del tratamiento:", formData)
  }

  const protocolosDisponibles = formData.tipoTratamiento
    ? protocolos[formData.tipoTratamiento as keyof typeof protocolos] || []
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/medico/tratamientos">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Tratamiento</h1>
          <p className="text-gray-600 mt-1">Crear un nuevo protocolo de tratamiento para un paciente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>Datos fundamentales del tratamiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paciente">Paciente *</Label>
                <Select value={formData.pacienteId} onValueChange={(value) => handleInputChange("pacienteId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPacientes.map((paciente) => (
                      <SelectItem key={paciente.id} value={paciente.id.toString()}>
                        {paciente.nombre} - {paciente.diagnostico}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <SelectItem key={protocolo} value={protocolo}>
                        {protocolo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <Input
                id="fechaInicio"
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => handleInputChange("fechaInicio", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Medicamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Medicamentos</CardTitle>
            <CardDescription>Medicamentos que formarán parte del protocolo</CardDescription>
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

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
            <CardDescription>Objetivos, notas y consideraciones especiales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/medico/tratamientos">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
            <Save className="w-4 h-4 mr-2" />
            Crear Tratamiento
          </Button>
        </div>
      </form>
    </div>
  )
}