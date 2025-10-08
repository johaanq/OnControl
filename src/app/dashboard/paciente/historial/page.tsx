"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loading } from "@/components/loading"
import { useAuthContext } from "@/contexts/auth-context"
import { medicalHistory } from "@/lib/api"
import type { HistoryEntryResponse, AllergyResponse } from "@/lib/api"
import { isPatientUser } from "@/types/organization"
import { 
  FileText, 
  Heart, 
  Activity, 
  Stethoscope,
  AlertTriangle,
  Calendar
} from "lucide-react"

const typeNames: Record<string, string> = {
  CONSULTATION: "Consulta",
  PROCEDURE: "Procedimiento",
  SURGERY: "Cirugía",
  EMERGENCY: "Emergencia",
  LAB_RESULT: "Resultados de Laboratorio",
  IMAGING: "Imagenología",
  OTHER: "Otro"
}

const severityNames: Record<string, string> = {
  MILD: "Leve",
  MODERATE: "Moderado",
  SEVERE: "Severo",
  LIFE_THREATENING: "Riesgo de vida"
}

export default function HistorialPage() {
  const { user } = useAuthContext()
  const [patientProfileId, setPatientProfileId] = useState<number | null>(null)
  const [historyEntries, setHistoryEntries] = useState<HistoryEntryResponse[]>([])
  const [allergies, setAllergies] = useState<AllergyResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("historial")
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")

  useEffect(() => {
    if (user && isPatientUser(user)) {
      setPatientProfileId(user.profile.id)
    }
  }, [user])

  useEffect(() => {
    const loadHistory = async () => {
      if (!patientProfileId) return

      try {
        setIsLoading(true)
        setError(null)

        const [history, allergyData] = await Promise.all([
          medicalHistory.getHistory(patientProfileId),
          medicalHistory.getAllergies(patientProfileId)
        ])

        setHistoryEntries(history)
        setAllergies(allergyData)
      } catch (err) {
        console.error('Error loading medical history:', err)
        setError('Error al cargar el historial médico')
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [patientProfileId])

  if (isLoading) {
    return (
      <AuthGuard requiredRole="PATIENT">
        <DashboardLayout>
          <Loading message="Cargando historial médico..." />
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

  const filteredHistory = filtroTipo === "todos" 
    ? historyEntries 
    : historyEntries.filter((entry) => entry.type === filtroTipo)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "CONSULTATION":
        return <Stethoscope className="w-5 h-5 text-blue-600" />
      case "PROCEDURE":
        return <Activity className="w-5 h-5 text-purple-600" />
      case "SURGERY":
        return <Heart className="w-5 h-5 text-red-600" />
      case "LAB_RESULT":
        return <FileText className="w-5 h-5 text-green-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "CONSULTATION":
        return "bg-blue-100 text-blue-700"
      case "PROCEDURE":
        return "bg-purple-100 text-purple-700"
      case "SURGERY":
        return "bg-red-100 text-red-700"
      case "LAB_RESULT":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <AuthGuard requiredRole="PATIENT">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Historial Médico</h1>
            <p className="text-muted-foreground">Registro completo de tu atención médica</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="historial">Historial</TabsTrigger>
              <TabsTrigger value="alergias">
                Alergias ({allergies.length})
              </TabsTrigger>
            </TabsList>

            {/* Medical History Tab */}
            <TabsContent value="historial" className="space-y-4">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filtroTipo === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroTipo("todos")}
                >
                  Todos ({historyEntries.length})
                </Button>
                <Button
                  variant={filtroTipo === "CONSULTATION" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroTipo("CONSULTATION")}
                >
                  Consultas ({historyEntries.filter(e => e.entryType === "CONSULTATION").length})
                </Button>
                <Button
                  variant={filtroTipo === "PROCEDURE" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroTipo("PROCEDURE")}
                >
                  Procedimientos ({historyEntries.filter(e => e.entryType === "PROCEDURE").length})
                </Button>
                <Button
                  variant={filtroTipo === "SURGERY" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroTipo("SURGERY")}
                >
                  Cirugías ({historyEntries.filter(e => e.entryType === "SURGERY").length})
                </Button>
                <Button
                  variant={filtroTipo === "LAB_RESULT" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroTipo("LAB_RESULT")}
                >
                  Laboratorio ({historyEntries.filter(e => e.entryType === "LAB_RESULT").length})
                </Button>
              </div>

              {/* History Entries */}
              {filteredHistory.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay entradas en tu historial médico</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredHistory.map((entry) => (
                    <Card key={entry.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(entry.entryType)}
                            <div>
                              <CardTitle className="text-lg">{entry.title}</CardTitle>
                              <CardDescription>
                                {entry.doctorName}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getTypeColor(entry.entryType)}>
                              {typeNames[entry.entryType] || entry.entryType}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(entry.entryDate).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Description */}
                        {entry.description && (
                          <div>
                            <p className="text-sm font-medium mb-1">Descripción:</p>
                            <p className="text-sm text-muted-foreground">{entry.description}</p>
                          </div>
                        )}

                        {/* Diagnosis */}
                        {entry.diagnosis && (
                          <div>
                            <p className="text-sm font-medium mb-1">Diagnóstico:</p>
                            <p className="text-sm text-muted-foreground">{entry.diagnosis}</p>
                          </div>
                        )}

                        {/* Treatment */}
                        {entry.treatment && (
                          <div>
                            <p className="text-sm font-medium mb-1">Tratamiento:</p>
                            <p className="text-sm text-muted-foreground">{entry.treatment}</p>
                          </div>
                        )}

                        {/* Notes */}
                        {entry.notes && (
                          <Alert>
                            <FileText className="h-4 w-4" />
                            <AlertDescription>{entry.notes}</AlertDescription>
                          </Alert>
                        )}

                        {/* Documents */}
                        {entry.documents.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Documentos adjuntos:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.documents.map((doc, index) => (
                                <Badge key={index} variant="outline">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Allergies Tab */}
            <TabsContent value="alergias" className="space-y-4">
              {allergies.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No tienes alergias registradas</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allergies.map((allergy) => (
                    <Card key={allergy.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-secondary" />
                            {allergy.allergen}
                          </CardTitle>
                          <Badge 
                            variant={allergy.severity === 'SEVERE' || allergy.severity === 'LIFE_THREATENING' ? 'destructive' : 'secondary'}
                          >
                            {severityNames[allergy.severity] || allergy.severity}
                          </Badge>
                        </div>
                        <CardDescription>{allergy.allergyType}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {allergy.reaction && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-1">Reacción:</p>
                            <p className="text-sm text-muted-foreground">{allergy.reaction}</p>
                          </div>
                        )}
                        {allergy.notes && (
                          <div>
                            <p className="text-sm font-medium mb-1">Notas:</p>
                            <p className="text-sm text-muted-foreground">{allergy.notes}</p>
                          </div>
                        )}
                        {allergy.diagnosedDate && (
                          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Diagnosticada: {new Date(allergy.diagnosedDate).toLocaleDateString('es-ES')}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
