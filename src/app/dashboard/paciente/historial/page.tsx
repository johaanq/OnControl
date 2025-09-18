"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  Heart, 
  Activity, 
  Stethoscope,
  Download,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

// Mock data para historial médico
const mockMedicalHistory = [
  {
    id: 1,
    date: "2025-01-15",
    type: "consulta",
    title: "Consulta de seguimiento",
    doctor: "Dr. Carlos Mendoza",
    specialty: "Oncología",
    summary: "Revisión de tratamiento. Paciente reporta mejoría en síntomas generales.",
    diagnosis: "Cáncer de mama - En tratamiento",
    treatment: "Continuar con Tamoxifeno 20mg diario",
    notes: "Paciente tolera bien el tratamiento. Próxima cita en 3 meses.",
    vitalSigns: {
      bloodPressure: "120/80",
      heartRate: "72",
      temperature: "36.5°C",
      weight: "65kg"
    },
    labResults: [
      { test: "Hemoglobina", value: "12.5 g/dL", normal: true, range: "12.0-15.5" },
      { test: "Leucocitos", value: "7.2 x10³/μL", normal: true, range: "4.5-11.0" },
      { test: "Creatinina", value: "0.9 mg/dL", normal: true, range: "0.6-1.2" }
    ]
  },
  {
    id: 2,
    date: "2024-12-20",
    type: "procedimiento",
    title: "Quimioterapia - Ciclo 6",
    doctor: "Dr. Carlos Mendoza",
    specialty: "Oncología",
    summary: "Administración del sexto ciclo de quimioterapia. Paciente tolera bien el tratamiento.",
    diagnosis: "Cáncer de mama - En tratamiento",
    treatment: "AC-T (Adriamicina + Ciclofosfamida + Taxol)",
    notes: "Sin efectos adversos significativos. Continuar con medicación de apoyo.",
    vitalSigns: {
      bloodPressure: "118/78",
      heartRate: "75",
      temperature: "36.8°C",
      weight: "64kg"
    },
    labResults: [
      { test: "Hemoglobina", value: "11.8 g/dL", normal: true, range: "12.0-15.5" },
      { test: "Leucocitos", value: "6.8 x10³/μL", normal: true, range: "4.5-11.0" },
      { test: "Plaquetas", value: "280 x10³/μL", normal: true, range: "150-450" }
    ]
  },
  {
    id: 3,
    date: "2024-11-15",
    type: "consulta",
    title: "Evaluación pre-quimioterapia",
    doctor: "Dr. Carlos Mendoza",
    specialty: "Oncología",
    summary: "Evaluación antes del quinto ciclo. Paciente en buen estado general.",
    diagnosis: "Cáncer de mama - En tratamiento",
    treatment: "Continuar protocolo AC-T",
    notes: "Paciente mantiene buen estado nutricional. Ajustar dosis según tolerancia.",
    vitalSigns: {
      bloodPressure: "125/82",
      heartRate: "70",
      temperature: "36.6°C",
      weight: "65kg"
    },
    labResults: [
      { test: "Hemoglobina", value: "12.1 g/dL", normal: true, range: "12.0-15.5" },
      { test: "Leucocitos", value: "7.5 x10³/μL", normal: true, range: "4.5-11.0" },
      { test: "Creatinina", value: "0.8 mg/dL", normal: true, range: "0.6-1.2" }
    ]
  },
  {
    id: 4,
    date: "2024-10-10",
    type: "cirugia",
    title: "Mastectomía parcial",
    doctor: "Dr. Ana Rodríguez",
    specialty: "Cirugía Oncológica",
    summary: "Cirugía de conservación de mama. Tumor extirpado completamente.",
    diagnosis: "Cáncer de mama - Post cirugía",
    treatment: "Cuidados post-operatorios",
    notes: "Cirugía exitosa. Margen quirúrgico libre. Iniciar quimioterapia adyuvante.",
    vitalSigns: {
      bloodPressure: "130/85",
      heartRate: "85",
      temperature: "37.2°C",
      weight: "66kg"
    },
    labResults: [
      { test: "Hemoglobina", value: "10.5 g/dL", normal: false, range: "12.0-15.5" },
      { test: "Leucocitos", value: "8.2 x10³/μL", normal: true, range: "4.5-11.0" },
      { test: "Plaquetas", value: "320 x10³/μL", normal: true, range: "150-450" }
    ]
  }
]

const mockMedications = [
  {
    id: 1,
    name: "Tamoxifeno",
    startDate: "2024-10-15",
    endDate: "2025-04-15",
    dosage: "20mg",
    frequency: "1 vez al día",
    status: "activo",
    reason: "Tratamiento hormonal adyuvante"
  },
  {
    id: 2,
    name: "Ácido Fólico",
    startDate: "2024-11-01",
    endDate: "2025-05-01",
    dosage: "5mg",
    frequency: "1 vez al día",
    status: "activo",
    reason: "Suplemento nutricional"
  },
  {
    id: 3,
    name: "Omeprazol",
    startDate: "2024-10-20",
    endDate: "2025-01-20",
    dosage: "20mg",
    frequency: "1 vez al día",
    status: "activo",
    reason: "Protección gástrica"
  },
  {
    id: 4,
    name: "AC-T Protocol",
    startDate: "2024-10-25",
    endDate: "2024-12-25",
    dosage: "Variable",
    frequency: "Cada 21 días",
    status: "completado",
    reason: "Quimioterapia adyuvante"
  }
]

const mockAllergies = [
  { id: 1, allergen: "Penicilina", reaction: "Erupción cutánea", severity: "Moderada" },
  { id: 2, allergen: "Mariscos", reaction: "Náuseas y vómitos", severity: "Leve" }
]

const mockFamilyHistory = [
  { id: 1, condition: "Cáncer de mama", relation: "Madre", age: "45 años", notes: "Diagnosticada a los 45 años" },
  { id: 2, condition: "Diabetes tipo 2", relation: "Padre", age: "60 años", notes: "Diagnosticada a los 60 años" },
  { id: 3, condition: "Hipertensión", relation: "Abuela materna", age: "70 años", notes: "Diagnosticada a los 70 años" }
]

export default function HistorialPage() {
  const [selectedEntry, setSelectedEntry] = useState(mockMedicalHistory[0])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "consulta": return <Stethoscope className="h-4 w-4" />
      case "procedimiento": return <Activity className="h-4 w-4" />
      case "cirugia": return <Heart className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "consulta": return "bg-blue-100 text-blue-800"
      case "procedimiento": return "bg-green-100 text-green-800"
      case "cirugia": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (normal: boolean) => {
    if (normal) return <CheckCircle className="h-4 w-4 text-green-600" />
    return <AlertTriangle className="h-4 w-4 text-red-600" />
  }


  return (
    <AuthGuard requiredUserType="paciente">
      <DashboardLayout userType="paciente">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi Historial Médico</h1>
              <p className="text-muted-foreground">Registro completo de tu atención médica</p>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </div>

          <Tabs defaultValue="historial" className="space-y-6">
            <TabsList>
              <TabsTrigger value="historial">Historial Clínico</TabsTrigger>
              <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
              <TabsTrigger value="alergias">Alergias</TabsTrigger>
              <TabsTrigger value="familia">Historial Familiar</TabsTrigger>
            </TabsList>

            {/* Historial Clínico */}
            <TabsContent value="historial" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de entradas */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Entradas del Historial</CardTitle>
                      <CardDescription>Selecciona una entrada para ver detalles</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockMedicalHistory.map((entry) => (
                          <div
                            key={entry.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedEntry.id === entry.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:bg-muted/50"
                            }`}
                            onClick={() => setSelectedEntry(entry)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full bg-muted ${getTypeColor(entry.type)}`}>
                                {getTypeIcon(entry.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm">{entry.title}</h4>
                                <p className="text-xs text-muted-foreground">{entry.date}</p>
                                <p className="text-xs text-muted-foreground">{entry.doctor}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detalles de la entrada seleccionada */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {getTypeIcon(selectedEntry.type)}
                            {selectedEntry.title}
                          </CardTitle>
                          <CardDescription>
                            {selectedEntry.date} • {selectedEntry.doctor} • {selectedEntry.specialty}
                          </CardDescription>
                        </div>
                        <Badge className={getTypeColor(selectedEntry.type)}>
                          {selectedEntry.type.charAt(0).toUpperCase() + selectedEntry.type.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Resumen */}
                      <div>
                        <h4 className="font-medium mb-2">Resumen</h4>
                        <p className="text-sm text-muted-foreground">{selectedEntry.summary}</p>
                      </div>

                      {/* Diagnóstico */}
                      <div>
                        <h4 className="font-medium mb-2">Diagnóstico</h4>
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{selectedEntry.diagnosis}</AlertDescription>
                        </Alert>
                      </div>

                      {/* Tratamiento */}
                      <div>
                        <h4 className="font-medium mb-2">Tratamiento</h4>
                        <p className="text-sm text-muted-foreground">{selectedEntry.treatment}</p>
                      </div>

                      {/* Notas */}
                      <div>
                        <h4 className="font-medium mb-2">Notas Médicas</h4>
                        <p className="text-sm text-muted-foreground">{selectedEntry.notes}</p>
                      </div>

                      {/* Signos Vitales */}
                      <div>
                        <h4 className="font-medium mb-3">Signos Vitales</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-semibold">{selectedEntry.vitalSigns.bloodPressure}</div>
                            <div className="text-xs text-muted-foreground">Presión Arterial</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-semibold">{selectedEntry.vitalSigns.heartRate}</div>
                            <div className="text-xs text-muted-foreground">Frecuencia Cardíaca</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-semibold">{selectedEntry.vitalSigns.temperature}</div>
                            <div className="text-xs text-muted-foreground">Temperatura</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-semibold">{selectedEntry.vitalSigns.weight}</div>
                            <div className="text-xs text-muted-foreground">Peso</div>
                          </div>
                        </div>
                      </div>

                      {/* Resultados de Laboratorio */}
                      <div>
                        <h4 className="font-medium mb-3">Resultados de Laboratorio</h4>
                        <div className="space-y-3">
                          {selectedEntry.labResults.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(result.normal)}
                                <div>
                                  <div className="font-medium">{result.test}</div>
                                  <div className="text-sm text-muted-foreground">Rango normal: {result.range}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-semibold ${result.normal ? "text-green-600" : "text-red-600"}`}>
                                  {result.value}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {result.normal ? "Normal" : "Fuera de rango"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Medicamentos */}
            <TabsContent value="medicamentos">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Medicamentos</CardTitle>
                  <CardDescription>Medicamentos prescritos a lo largo del tiempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockMedications.map((medication) => (
                      <div key={medication.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{medication.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {medication.dosage} • {medication.frequency}
                            </p>
                          </div>
                          <Badge className={
                            medication.status === "activo" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }>
                            {medication.status === "activo" ? "Activo" : "Completado"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Período:</span>
                            <p className="text-muted-foreground">
                              {new Date(medication.startDate).toLocaleDateString("es-PE")} - {new Date(medication.endDate).toLocaleDateString("es-PE")}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Duración:</span>
                            <p className="text-muted-foreground">
                              {Math.ceil((new Date(medication.endDate).getTime() - new Date(medication.startDate).getTime()) / (1000 * 60 * 60 * 24))} días
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Indicación:</span>
                            <p className="text-muted-foreground">{medication.reason}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alergias */}
            <TabsContent value="alergias">
              <Card>
                <CardHeader>
                  <CardTitle>Alergias Conocidas</CardTitle>
                  <CardDescription>Registro de alergias y reacciones adversas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAllergies.map((allergy) => (
                      <div key={allergy.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{allergy.allergen}</h4>
                            <p className="text-sm text-muted-foreground">{allergy.reaction}</p>
                          </div>
                          <Badge className={
                            allergy.severity === "Moderada" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-green-100 text-green-800"
                          }>
                            {allergy.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Historial Familiar */}
            <TabsContent value="familia">
              <Card>
                <CardHeader>
                  <CardTitle>Historial Familiar</CardTitle>
                  <CardDescription>Condiciones médicas en la familia</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockFamilyHistory.map((condition) => (
                      <div key={condition.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{condition.condition}</h4>
                            <p className="text-sm text-muted-foreground">
                              {condition.relation} • {condition.age}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{condition.notes}</p>
                          </div>
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
