"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loading } from "@/components/loading"
import { useAuthContext } from "@/contexts/auth-context"
import { symptoms } from "@/lib/api"
import type { SymptomResponse } from "@/lib/api"
import { isPatientUser } from "@/types/organization"
import { Search, Plus, Filter, Activity, AlertTriangle, Clock, Calendar } from "lucide-react"

export default function SymptomsPage() {
  const { user } = useAuthContext()
  const [patientProfileId, setPatientProfileId] = useState<number | null>(null)
  const [symptomsList, setSymptomsList] = useState<SymptomResponse[]>([])
  const [filteredSymptoms, setFilteredSymptoms] = useState<SymptomResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    if (user && isPatientUser(user)) {
      setPatientProfileId(user.profile.id)
    }
  }, [user])

  useEffect(() => {
    const loadSymptoms = async () => {
      if (!patientProfileId) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await symptoms.getAll(patientProfileId)
        
        // Sort by occurrence date (most recent first)
        data.sort((a, b) => new Date(b.occurrenceDate).getTime() - new Date(a.occurrenceDate).getTime())
        
        setSymptomsList(data)
        setFilteredSymptoms(data)
      } catch (err) {
        console.error('Error loading symptoms:', err)
        setError('Error al cargar los síntomas')
      } finally {
        setIsLoading(false)
      }
    }

    loadSymptoms()
  }, [patientProfileId])

  useEffect(() => {
    let filtered = symptomsList

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(symptom =>
        symptom.symptomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symptom.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symptom.triggers?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by severity
    if (severityFilter !== "all") {
      filtered = filtered.filter(symptom => symptom.severity === severityFilter)
    }

    // Filter by date
    if (dateFilter !== "all") {
      const today = new Date()
      filtered = filtered.filter(symptom => {
        const symptomDate = new Date(symptom.occurrenceDate)
        switch (dateFilter) {
          case "today":
            return symptomDate.toDateString() === today.toDateString()
          case "yesterday":
            const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
            return symptomDate.toDateString() === yesterday.toDateString()
          case "thisWeek":
            const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
            return symptomDate >= weekStart && symptomDate <= today
          case "thisMonth":
            const monthStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
            return symptomDate >= monthStart && symptomDate <= today
          default:
            return true
        }
      })
    }

    setFilteredSymptoms(filtered)
  }, [symptomsList, searchTerm, severityFilter, dateFilter])

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'crítico':
        return 'bg-secondary/20 text-secondary-foreground border-secondary/30'
      case 'severo':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20'
      case 'moderado':
        return 'bg-primary/20 text-primary-foreground border-primary/30'
      case 'leve':
        return 'bg-primary/10 text-primary-foreground border-primary/20'
      default:
        return 'bg-muted text-muted-foreground border-muted'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'crítico':
        return 'Crítico'
      case 'severo':
        return 'Severo'
      case 'moderado':
        return 'Moderado'
      case 'leve':
        return 'Leve'
      default:
        return severity || 'N/A'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`)
    return time.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const criticalSymptoms = filteredSymptoms.filter(s => s.requiresMedicalAttention)
  const reportedToDoctor = filteredSymptoms.filter(s => s.reportedToDoctor)

  if (isLoading) {
    return (
      <AuthGuard requiredRole="PATIENT">
        <DashboardLayout>
          <Loading message="Cargando síntomas..." />
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard requiredRole="PATIENT">
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="PATIENT">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mis Síntomas</h1>
              <p className="text-muted-foreground">
                Registro y seguimiento de síntomas ({filteredSymptoms.length} síntomas)
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/paciente/sintomas/nuevo">
                <Plus className="mr-2 h-4 w-4" />
                Reportar Síntoma
              </Link>
            </Button>
          </div>

          {/* Critical Alerts */}
          {criticalSymptoms.length > 0 && (
            <Card className="border-secondary/30 bg-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-secondary-foreground">
                  <AlertTriangle className="h-5 w-5" />
                  Atención Médica Requerida
                </CardTitle>
                <CardDescription className="text-secondary font-semibold">
                  Tienes {criticalSymptoms.length} síntoma(s) que requieren atención médica inmediata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {criticalSymptoms.slice(0, 3).map((symptom) => (
                    <div key={symptom.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div>
                        <p className="font-medium">{symptom.symptomName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(symptom.occurrenceDate)} a las {formatTime(symptom.occurrenceTime)}
                        </p>
                      </div>
                      <Badge className={getSeverityColor(symptom.severity)}>
                        {getSeverityText(symptom.severity)}
                      </Badge>
                    </div>
                  ))}
                </div>
                {criticalSymptoms.length > 3 && (
                  <p className="text-sm text-secondary font-semibold mt-2">
                    Y {criticalSymptoms.length - 3} más...
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Síntomas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{symptomsList.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Críticos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{criticalSymptoms.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Reportados al Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportedToDoctor.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {symptomsList.filter(s => {
                    const symptomDate = new Date(s.occurrenceDate)
                    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    return symptomDate >= weekStart
                  }).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, notas o desencadenantes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por severidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Leve">Leve</SelectItem>
                    <SelectItem value="Moderado">Moderado</SelectItem>
                    <SelectItem value="Severo">Severo</SelectItem>
                    <SelectItem value="Crítico">Crítico</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por fecha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las fechas</SelectItem>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="yesterday">Ayer</SelectItem>
                    <SelectItem value="thisWeek">Esta semana</SelectItem>
                    <SelectItem value="thisMonth">Este mes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
          </Card>

          {/* Symptoms Table */}
          <Card>
            <CardHeader>
              <CardTitle>Registro de Síntomas</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSymptoms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || severityFilter !== "all" || dateFilter !== "all"
                      ? "No se encontraron síntomas con los filtros aplicados" 
                      : "No has reportado síntomas aún"}
                  </p>
                  {!searchTerm && severityFilter === "all" && dateFilter === "all" && (
                    <Button asChild>
                      <Link href="/dashboard/paciente/sintomas/nuevo">
                        <Plus className="mr-2 h-4 w-4" />
                        Reportar Primer Síntoma
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Síntoma</TableHead>
                      <TableHead>Severidad</TableHead>
                      <TableHead>Fecha y Hora</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Requiere Atención</TableHead>
                      <TableHead>Reportado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSymptoms.map((symptom) => (
                      <TableRow key={symptom.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{symptom.symptomName}</p>
                            {symptom.notes && (
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {symptom.notes}
                              </p>
                            )}
                            {symptom.triggers && (
                              <p className="text-xs text-muted-foreground">
                                Desencadenantes: {symptom.triggers}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(symptom.severity)}>
                            {getSeverityText(symptom.severity)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatDate(symptom.occurrenceDate)}</p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(symptom.occurrenceTime)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {symptom.durationHours ? `${symptom.durationHours}h` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {symptom.requiresMedicalAttention ? (
                              <>
                                <AlertTriangle className="h-4 w-4 text-secondary mr-1" />
                                <span className="text-secondary font-medium">Sí</span>
                              </>
                            ) : (
                              <span className="text-primary">No</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={symptom.reportedToDoctor ? "default" : "secondary"}>
                            {symptom.reportedToDoctor ? "Sí" : "No"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}