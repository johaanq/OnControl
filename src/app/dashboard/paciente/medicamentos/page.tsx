"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loading } from "@/components/loading"
import { useAuthContext } from "@/contexts/auth-context"
import { medications } from "@/lib/api"
import type { MedicationResponse, UpcomingDoseResponse } from "@/lib/api"
import { isPatientUser } from "@/types/organization"
import { Pill, Clock, CheckCircle, Info, Calendar } from "lucide-react"

const routeNames: Record<string, string> = {
  ORAL: "Oral",
  INTRAVENOUS: "Intravenosa",
  INTRAMUSCULAR: "Intramuscular",
  SUBCUTANEOUS: "Subcutánea",
  TOPICAL: "Tópica"
}

export default function MedicamentosPage() {
  const { user } = useAuthContext()
  const [patientProfileId, setPatientProfileId] = useState<number | null>(null)
  const [medicationsList, setMedicationsList] = useState<MedicationResponse[]>([])
  const [upcomingDoses, setUpcomingDoses] = useState<UpcomingDoseResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && isPatientUser(user)) {
      setPatientProfileId(user.profile.id)
    }
  }, [user])

  useEffect(() => {
    const loadMedications = async () => {
      if (!patientProfileId) return

      try {
        setIsLoading(true)
        setError(null)

        const [activeMeds, doses] = await Promise.all([
          medications.getPatientActive(patientProfileId),
          medications.getUpcomingDoses(patientProfileId, 1) // Next 24 hours
        ])

        setMedicationsList(activeMeds)
        setUpcomingDoses(doses)
      } catch (err) {
        console.error('Error loading medications:', err)
        setError('Error al cargar los medicamentos')
      } finally {
        setIsLoading(false)
      }
    }

    loadMedications()
  }, [patientProfileId])

  const handleMarkDoseTaken = async (medicationId: number) => {
    if (!patientProfileId) return

    try {
      await medications.markDoseTaken(medicationId, {
        takenAt: new Date().toISOString(),
        notes: 'Dosis tomada'
      })

      // Reload doses
      const doses = await medications.getUpcomingDoses(patientProfileId, 1)
      setUpcomingDoses(doses)
    } catch (err) {
      console.error('Error marking dose as taken:', err)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRole="PATIENT">
        <DashboardLayout>
          <Loading message="Cargando medicamentos..." />
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
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Medicamentos</h1>
            <p className="text-muted-foreground">Gestiona tus medicamentos y recordatorios</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Medicamentos Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{medicationsList.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Dosis Próximas (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingDoses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Dosis Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {upcomingDoses.filter(d => !d.taken).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Doses */}
          {upcomingDoses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Próximas Dosis
                </CardTitle>
                <CardDescription>Medicamentos que debes tomar en las próximas 24 horas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDoses.map((dose) => (
                    <div
                      key={`${dose.medicationId}-${dose.scheduledTime}`}
                      className={`flex items-center justify-between p-4 border rounded-lg ${
                        dose.taken ? 'bg-muted' : 'bg-card'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${dose.taken ? 'bg-primary/20' : 'bg-secondary/20'}`}>
                          {dose.taken ? (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          ) : (
                            <Clock className="w-5 h-5 text-secondary" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{dose.medicationName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{dose.dosage}</span>
                            <span>•</span>
                            <span>{new Date(dose.scheduledTime).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                      </div>
                      {!dose.taken && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkDoseTaken(dose.medicationId)}
                        >
                          Marcar como Tomada
                        </Button>
                      )}
                      {dose.taken && (
                        <Badge variant="outline" className="bg-primary/10">
                          Tomada
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Medications */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Medicamentos Activos</h2>

            {medicationsList.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tienes medicamentos activos registrados</p>
                </CardContent>
              </Card>
            ) : (
              medicationsList.map((medication) => (
                <Card key={medication.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Pill className="w-5 h-5 text-primary" />
                          {medication.name}
                        </CardTitle>
                        <CardDescription>
                          Prescrito por {medication.doctorName}
                        </CardDescription>
                      </div>
                      <Badge variant={medication.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {medication.status === 'ACTIVE' ? 'Activo' : medication.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Dosage Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Dosis</p>
                        <p className="text-lg font-semibold">{medication.dosage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Frecuencia</p>
                        <p className="text-lg font-semibold">{medication.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Vía</p>
                        <p className="text-lg font-semibold">
                          {routeNames[medication.route] || medication.route}
                        </p>
                      </div>
                    </div>

                    {/* Date Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Inicio:</span>
                        <span className="font-medium">
                          {new Date(medication.startDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      {medication.endDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Fin:</span>
                          <span className="font-medium">
                            {new Date(medication.endDate).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Instructions */}
                    {medication.instructions && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          <span className="font-medium">Instrucciones: </span>
                          {medication.instructions}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Side Effects */}
                    {medication.sideEffects && medication.sideEffects.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Posibles efectos secundarios:</p>
                        <div className="flex flex-wrap gap-2">
                          {medication.sideEffects.map((effect, index) => (
                            <Badge key={index} variant="outline" className="bg-secondary/10">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next Refill */}
                    {medication.nextRefillDate && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Próximo resurtido:{' '}
                          <span className="font-medium text-foreground">
                            {new Date(medication.nextRefillDate).toLocaleDateString('es-ES')}
                          </span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
