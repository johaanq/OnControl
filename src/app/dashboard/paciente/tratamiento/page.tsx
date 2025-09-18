"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Pill, Activity, AlertCircle, CheckCircle, Heart } from "lucide-react"

// Mock data para el tratamiento del paciente
const mockTratamiento = {
  id: 1,
  tipo: "Quimioterapia",
  protocolo: "FOLFOX",
  cicloActual: 3,
  ciclosTotal: 6,
  fechaInicio: "2024-01-15",
  proximaSesion: "2024-02-15",
  estado: "activo",
  progreso: 50,
  medicamentos: [
    { nombre: "Oxaliplatino", dosis: "85 mg/m²", frecuencia: "Cada 2 semanas" },
    { nombre: "5-Fluorouracilo", dosis: "400 mg/m²", frecuencia: "Cada 2 semanas" },
    { nombre: "Leucovorina", dosis: "200 mg/m²", frecuencia: "Cada 2 semanas" },
  ],
  efectosSecundarios: [
    { nombre: "Nauseas", severidad: "leve", fecha: "2024-02-10" },
    { nombre: "Fatiga", severidad: "moderada", fecha: "2024-02-08" },
  ],
  proximasCitas: [
    { fecha: "2024-02-15", tipo: "Quimioterapia", hora: "09:00" },
    { fecha: "2024-02-20", tipo: "Control", hora: "14:30" },
    { fecha: "2024-03-01", tipo: "Quimioterapia", hora: "09:00" },
  ],
}

const severidadColors = {
  leve: "bg-green-100 text-green-800",
  moderada: "bg-yellow-100 text-yellow-800",
  severa: "bg-red-100 text-red-800",
}

export default function TratamientoPacientePage() {
  const [activeTab, setActiveTab] = useState("resumen")

  return (
    <AuthGuard requiredUserType="paciente">
      <DashboardLayout userType="paciente">
        <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Tratamiento</h1>
        <p className="text-gray-600 mt-1">Información detallada sobre tu protocolo de tratamiento actual</p>
      </div>

      {/* Resumen del tratamiento */}
      <Card className="border-teal-200 bg-teal-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-teal-900">{mockTratamiento.protocolo}</h2>
              <p className="text-teal-700">{mockTratamiento.tipo}</p>
            </div>
            <Badge className="bg-teal-600 text-white">{mockTratamiento.estado}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-teal-700">Progreso del Tratamiento</p>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-teal-600 mb-1">
                  <span>
                    Ciclo {mockTratamiento.cicloActual} de {mockTratamiento.ciclosTotal}
                  </span>
                  <span>{mockTratamiento.progreso}%</span>
                </div>
                <Progress value={mockTratamiento.progreso} className="h-2" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-teal-700">Fecha de Inicio</p>
              <p className="text-teal-900 font-semibold">
                {new Date(mockTratamiento.fechaInicio).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-teal-700">Próxima Sesión</p>
              <p className="text-teal-900 font-semibold">
                {new Date(mockTratamiento.proximaSesion).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
          <TabsTrigger value="efectos">Efectos</TabsTrigger>
          <TabsTrigger value="citas">Próximas Citas</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" />
                  Estado Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ciclo Actual:</span>
                    <span className="font-semibold">
                      {mockTratamiento.cicloActual}/{mockTratamiento.ciclosTotal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progreso:</span>
                    <span className="font-semibold">{mockTratamiento.progreso}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  Próxima Cita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(mockTratamiento.proximaSesion).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">Quimioterapia - 09:00 AM</p>
                  <Button size="sm" className="mt-2 bg-orange-600 hover:bg-orange-700">
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Hidratación</p>
                    <p className="text-sm text-blue-700">Bebe al menos 2 litros de agua al día</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Descanso</p>
                    <p className="text-sm text-green-700">Mantén un horario regular de sueño de 7-8 horas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">Alimentación</p>
                    <p className="text-sm text-orange-700">Evita alimentos crudos y mantén una dieta balanceada</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                Medicamentos del Protocolo
              </CardTitle>
              <CardDescription>Medicamentos que forman parte de tu tratamiento actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTratamiento.medicamentos.map((medicamento, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{medicamento.nombre}</h3>
                      <Badge variant="outline">Activo</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Dosis:</p>
                        <p>{medicamento.dosis}</p>
                      </div>
                      <div>
                        <p className="font-medium">Frecuencia:</p>
                        <p>{medicamento.frecuencia}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efectos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Efectos Secundarios Registrados
              </CardTitle>
              <CardDescription>Efectos secundarios que has experimentado durante el tratamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTratamiento.efectosSecundarios.map((efecto, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-900">{efecto.nombre}</h3>
                      <Badge className={severidadColors[efecto.severidad as keyof typeof severidadColors]}>
                        {efecto.severidad}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Registrado el {new Date(efecto.fecha).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
              <Button className="mt-4 bg-orange-600 hover:bg-orange-700">Reportar Nuevo Efecto</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="citas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Próximas Citas del Tratamiento
              </CardTitle>
              <CardDescription>Citas programadas relacionadas con tu tratamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTratamiento.proximasCitas.map((cita, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{cita.tipo}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(cita.fecha).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {cita.hora}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
