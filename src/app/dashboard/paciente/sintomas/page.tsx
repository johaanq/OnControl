"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Activity, Plus, Filter, CalendarIcon, TrendingUp, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

// Mock data
const mockSymptoms = [
  {
    id: 1,
    symptom: "Fatiga",
    severity: "Moderada",
    date: "2025-01-17",
    time: "14:30",
    notes: "Después del tratamiento de quimioterapia",
    duration: "4 horas",
    triggers: ["Tratamiento"],
  },
  {
    id: 2,
    symptom: "Náuseas",
    severity: "Leve",
    date: "2025-01-16",
    time: "08:00",
    notes: "Por la mañana, antes del desayuno",
    duration: "2 horas",
    triggers: ["Ayuno"],
  },
  {
    id: 3,
    symptom: "Dolor de cabeza",
    severity: "Leve",
    date: "2025-01-15",
    time: "16:00",
    notes: "Dolor pulsátil en la sien derecha",
    duration: "3 horas",
    triggers: ["Estrés"],
  },
  {
    id: 4,
    symptom: "Pérdida de apetito",
    severity: "Moderada",
    date: "2025-01-14",
    time: "12:00",
    notes: "No tengo ganas de comer desde ayer",
    duration: "Todo el día",
    triggers: ["Medicamento"],
  },
  {
    id: 5,
    symptom: "Insomnio",
    severity: "Severa",
    date: "2025-01-13",
    time: "23:00",
    notes: "No pude dormir hasta las 3 AM",
    duration: "4 horas",
    triggers: ["Ansiedad"],
  },
]

const mockSymptomStats = {
  totalSymptoms: 15,
  thisWeek: 5,
  mostCommon: "Fatiga",
  averageSeverity: "Moderada",
}

export default function SintomasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date>()

  const filteredSymptoms = mockSymptoms.filter((symptom) => {
    const matchesSearch =
      symptom.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symptom.notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || symptom.severity === severityFilter
    const matchesDate = !dateFilter || symptom.date === format(dateFilter, "yyyy-MM-dd")
    return matchesSearch && matchesSeverity && matchesDate
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Leve":
        return "bg-primary/10 text-primary border-primary/20"
      case "Moderada":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "Severa":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Severa":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <AuthGuard requiredUserType="paciente">
      <DashboardLayout userType="paciente">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Registro de Síntomas</h1>
              <p className="text-muted-foreground">Lleva un seguimiento detallado de tus síntomas</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/paciente/sintomas/nuevo">
                  <Plus className="mr-2 h-4 w-4" />
                  Reportar Síntoma Completo
                </Link>
              </Button>
              <Button className="oncontrol-gradient text-white" asChild>
                <Link href="/dashboard/paciente/sintomas/nuevo">
                  <Plus className="mr-2 h-4 w-4" />
                  Reportar Síntoma
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Symptom Report */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Reporte Rápido de Síntoma
              </CardTitle>
              <CardDescription>Registra un síntoma común de forma rápida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quick-symptom">Síntoma</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un síntoma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fatiga">Fatiga</SelectItem>
                      <SelectItem value="nauseas">Náuseas</SelectItem>
                      <SelectItem value="dolor-cabeza">Dolor de cabeza</SelectItem>
                      <SelectItem value="dolor-muscular">Dolor muscular</SelectItem>
                      <SelectItem value="fiebre">Fiebre</SelectItem>
                      <SelectItem value="perdida-apetito">Pérdida de apetito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quick-severity">Severidad</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Nivel de severidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leve">Leve</SelectItem>
                      <SelectItem value="moderada">Moderada</SelectItem>
                      <SelectItem value="severa">Severa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quick-time">Hora</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button size="sm" className="oncontrol-gradient text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Rápidamente
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{mockSymptomStats.totalSymptoms}</div>
                <p className="text-sm text-muted-foreground">Total registrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-secondary">{mockSymptomStats.thisWeek}</div>
                <p className="text-sm text-muted-foreground">Esta semana</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-lg font-bold text-accent">{mockSymptomStats.mostCommon}</div>
                <p className="text-sm text-muted-foreground">Más frecuente</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-lg font-bold text-destructive">{mockSymptomStats.averageSeverity}</div>
                <p className="text-sm text-muted-foreground">Severidad promedio</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Buscar síntomas o notas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Severidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Leve">Leve</SelectItem>
                      <SelectItem value="Moderada">Moderada</SelectItem>
                      <SelectItem value="Severa">Severa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[150px] justify-start bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFilter ? format(dateFilter, "dd/MM/yyyy") : "Fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} locale={es} initialFocus />
                    </PopoverContent>
                  </Popover>
                  {dateFilter && (
                    <Button variant="outline" onClick={() => setDateFilter(undefined)}>
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Symptoms List */}
          <div className="grid gap-4">
            {filteredSymptoms.map((symptom) => (
              <Card key={symptom.id} className="oncontrol-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        {getSeverityIcon(symptom.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{symptom.symptom}</h3>
                          <Badge className={getSeverityColor(symptom.severity)}>{symptom.severity}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{symptom.notes}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>📅 {new Date(symptom.date).toLocaleDateString("es-PE")}</span>
                          <span>🕐 {symptom.time}</span>
                          <span>⏱️ Duración: {symptom.duration}</span>
                        </div>
                        {symptom.triggers.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-muted-foreground">Posibles causas:</span>
                            {symptom.triggers.map((trigger, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {trigger}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSymptoms.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron síntomas</h3>
                <p className="text-muted-foreground mb-4">
                  No hay síntomas que coincidan con los filtros seleccionados.
                </p>
                <Button asChild>
                  <Link href="/dashboard/paciente/sintomas/nuevo">
                    <Plus className="mr-2 h-4 w-4" />
                    Reportar Primer Síntoma
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Síntomas</CardTitle>
              <CardDescription>Análisis de tus síntomas recientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-1">Tendencia</h4>
                  <p className="text-sm text-muted-foreground">
                    Los síntomas han disminuido un 20% esta semana comparado con la anterior
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="h-8 w-8 text-secondary" />
                  </div>
                  <h4 className="font-semibold mb-1">Patrón</h4>
                  <p className="text-sm text-muted-foreground">
                    La mayoría de síntomas ocurren después de los tratamientos
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="h-8 w-8 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-1">Recomendación</h4>
                  <p className="text-sm text-muted-foreground">
                    Considera hablar con tu doctor sobre el manejo de la fatiga
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
