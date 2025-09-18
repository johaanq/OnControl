"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, User, Pill, Activity, Plus, Search, Eye, Edit, Trash2 } from "lucide-react"

// Mock data para tratamientos
const mockTratamientos = [
  {
    id: 1,
    paciente: "María González",
    tipo: "Quimioterapia",
    protocolo: "FOLFOX",
    ciclo: "3/6",
    fechaInicio: "2024-01-15",
    proximaSesion: "2024-02-15",
    estado: "activo",
    medicamentos: ["Oxaliplatino", "5-Fluorouracilo", "Leucovorina"],
    efectosSecundarios: ["Nauseas leves", "Fatiga"],
    notas: "Paciente tolera bien el tratamiento",
  },
  {
    id: 2,
    paciente: "Carlos Mendoza",
    tipo: "Radioterapia",
    protocolo: "IMRT",
    ciclo: "15/25",
    fechaInicio: "2024-01-08",
    proximaSesion: "2024-02-12",
    estado: "activo",
    medicamentos: [],
    efectosSecundarios: ["Irritación cutánea"],
    notas: "Progreso satisfactorio",
  },
  {
    id: 3,
    paciente: "Ana Ruiz",
    tipo: "Inmunoterapia",
    protocolo: "Pembrolizumab",
    ciclo: "2/4",
    fechaInicio: "2024-01-20",
    proximaSesion: "2024-02-20",
    estado: "pausado",
    medicamentos: ["Pembrolizumab"],
    efectosSecundarios: ["Reacción cutánea"],
    notas: "Tratamiento pausado por efectos adversos",
  },
]

const estadoColors = {
  activo: "bg-green-100 text-green-800",
  pausado: "bg-yellow-100 text-yellow-800",
  completado: "bg-blue-100 text-blue-800",
  suspendido: "bg-red-100 text-red-800",
}

export default function TratamientosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [filtroTipo, setFiltroTipo] = useState("todos")

  const tratamientosFiltrados = mockTratamientos.filter((tratamiento) => {
    const matchesSearch =
      tratamiento.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tratamiento.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tratamiento.protocolo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filtroEstado === "todos" || tratamiento.estado === filtroEstado
    const matchesTipo = filtroTipo === "todos" || tratamiento.tipo === filtroTipo

    return matchesSearch && matchesEstado && matchesTipo
  })

  return (
    <AuthGuard requiredUserType="medico">
      <DashboardLayout userType="medico">
        <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Tratamientos</h1>
          <p className="text-gray-600 mt-1">Administra los protocolos de tratamiento de tus pacientes</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Tratamiento
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-teal-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tratamientos Activos</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sesiones Hoy</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Pill className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Protocolos Activos</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-pink-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pacientes en Tratamiento</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por paciente, tipo o protocolo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="suspendido">Suspendido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="Quimioterapia">Quimioterapia</SelectItem>
                <SelectItem value="Radioterapia">Radioterapia</SelectItem>
                <SelectItem value="Inmunoterapia">Inmunoterapia</SelectItem>
                <SelectItem value="Cirugía">Cirugía</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tratamientos */}
      <div className="space-y-4">
        {tratamientosFiltrados.map((tratamiento) => (
          <Card key={tratamiento.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{tratamiento.paciente}</h3>
                    <Badge className={estadoColors[tratamiento.estado as keyof typeof estadoColors]}>
                      {tratamiento.estado}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium">Tipo de Tratamiento</p>
                      <p>{tratamiento.tipo}</p>
                    </div>
                    <div>
                      <p className="font-medium">Protocolo</p>
                      <p>{tratamiento.protocolo}</p>
                    </div>
                    <div>
                      <p className="font-medium">Ciclo</p>
                      <p>{tratamiento.ciclo}</p>
                    </div>
                    <div>
                      <p className="font-medium">Próxima Sesión</p>
                      <p>{new Date(tratamiento.proximaSesion).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {tratamiento.medicamentos.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Medicamentos:</p>
                      <div className="flex flex-wrap gap-1">
                        {tratamiento.medicamentos.map((med, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {tratamiento.efectosSecundarios.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Efectos Secundarios:</p>
                      <div className="flex flex-wrap gap-1">
                        {tratamiento.efectosSecundarios.map((efecto, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700">
                            {efecto}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tratamientosFiltrados.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron tratamientos</h3>
            <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
          </CardContent>
        </Card>
      )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
