"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Heart, 
  Activity,
  Download,
  Filter,
  FileText,
  PieChart,
  LineChart
} from "lucide-react"

// Mock data para reportes
const mockReportes = {
  pacientes: {
    total: 47,
    activos: 32,
    seguimiento: 12,
    primeraConsulta: 3,
    crecimientoMensual: 12,
    satisfaccionPromedio: 4.8
  },
  tratamientos: {
    activos: 28,
    completados: 15,
    pausados: 4,
    suspendidos: 2,
    efectividadPromedio: 87,
    adherenciaPromedio: 92
  },
  citas: {
    totalMes: 156,
    completadas: 142,
    canceladas: 8,
    reprogramadas: 6,
    promedioDuracion: 35,
    ocupacionPromedio: 78
  },
  ingresos: {
    mesActual: 125000,
    mesAnterior: 118000,
    crecimiento: 5.9,
    promedioPorPaciente: 2659,
    proyeccionAnual: 1500000
  }
}

const mockDatosGraficos = {
  pacientesPorMes: [
    { mes: "Ene", pacientes: 35 },
    { mes: "Feb", pacientes: 42 },
    { mes: "Mar", pacientes: 38 },
    { mes: "Abr", pacientes: 45 },
    { mes: "May", pacientes: 47 },
    { mes: "Jun", pacientes: 52 }
  ],
  tratamientosPorTipo: [
    { tipo: "Quimioterapia", cantidad: 18, porcentaje: 45 },
    { tipo: "Radioterapia", cantidad: 12, porcentaje: 30 },
    { tipo: "Inmunoterapia", cantidad: 6, porcentaje: 15 },
    { tipo: "Cirugía", cantidad: 4, porcentaje: 10 }
  ],
  citasPorDia: [
    { dia: "Lun", citas: 8 },
    { dia: "Mar", citas: 12 },
    { dia: "Mié", citas: 10 },
    { dia: "Jue", citas: 15 },
    { dia: "Vie", citas: 11 },
    { dia: "Sáb", citas: 6 },
    { dia: "Dom", citas: 2 }
  ]
}

export default function ReportesPage() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mes")
  const [tipoReporte, setTipoReporte] = useState("general")

  const generarReporte = () => {
    // TODO: Implementar lógica de generación de reportes
    console.log("Generando reporte:", { periodoSeleccionado, tipoReporte })
  }

  const exportarReporte = () => {
    // TODO: Implementar lógica de exportación
    console.log("Exportando reporte")
  }

  return (
    <AuthGuard requiredUserType="medico">
      <DashboardLayout userType="medico">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reportes y Análisis</h1>
              <p className="text-muted-foreground">Análisis detallado del rendimiento y métricas</p>
            </div>
            <div className="flex gap-3">
              <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                <SelectTrigger className="w-[150px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mes</SelectItem>
                  <SelectItem value="trimestre">Este trimestre</SelectItem>
                  <SelectItem value="año">Este año</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={generarReporte}>
                <Filter className="mr-2 h-4 w-4" />
                Generar Reporte
              </Button>
              <Button className="oncontrol-gradient text-white" onClick={exportarReporte}>
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pacientes Totales</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockReportes.pacientes.total}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">+{mockReportes.pacientes.crecimientoMensual}</span> este mes
                </p>
              </CardContent>
            </Card>

            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tratamientos Activos</CardTitle>
                <Activity className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockReportes.tratamientos.activos}</div>
                <p className="text-xs text-muted-foreground">
                  {mockReportes.tratamientos.efectividadPromedio}% efectividad
                </p>
              </CardContent>
            </Card>

            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Citas Este Mes</CardTitle>
                <Calendar className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockReportes.citas.totalMes}</div>
                <p className="text-xs text-muted-foreground">
                  {mockReportes.citas.ocupacionPromedio}% ocupación promedio
                </p>
              </CardContent>
            </Card>

            <Card className="oncontrol-hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
                <Heart className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockReportes.pacientes.satisfaccionPromedio}/5</div>
                <p className="text-xs text-muted-foreground">Promedio de pacientes</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de pacientes por mes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Crecimiento de Pacientes
                </CardTitle>
                <CardDescription>Evolución mensual de pacientes registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDatosGraficos.pacientesPorMes.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.mes}</span>
                        <span className="text-sm text-muted-foreground">{item.pacientes} pacientes</span>
                      </div>
                      <Progress 
                        value={(item.pacientes / 60) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Distribución de tratamientos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribución de Tratamientos
                </CardTitle>
                <CardDescription>Tipos de tratamiento más utilizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDatosGraficos.tratamientosPorTipo.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.tipo}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{item.cantidad}</span>
                          <Badge variant="outline">{item.porcentaje}%</Badge>
                        </div>
                      </div>
                      <Progress 
                        value={item.porcentaje} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análisis detallado */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rendimiento de citas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Rendimiento de Citas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completadas</span>
                    <span className="text-sm text-green-600">{mockReportes.citas.completadas}</span>
                  </div>
                  <Progress value={(mockReportes.citas.completadas / mockReportes.citas.totalMes) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Canceladas</span>
                    <span className="text-sm text-red-600">{mockReportes.citas.canceladas}</span>
                  </div>
                  <Progress value={(mockReportes.citas.canceladas / mockReportes.citas.totalMes) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reprogramadas</span>
                    <span className="text-sm text-yellow-600">{mockReportes.citas.reprogramadas}</span>
                  </div>
                  <Progress value={(mockReportes.citas.reprogramadas / mockReportes.citas.totalMes) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Adherencia al tratamiento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Adherencia al Tratamiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{mockReportes.tratamientos.adherenciaPromedio}%</div>
                  <p className="text-sm text-muted-foreground">Adherencia promedio</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Excelente (90-100%)</span>
                    <span className="text-sm text-green-600">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Buena (70-89%)</span>
                    <span className="text-sm text-blue-600">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Regular (50-69%)</span>
                    <span className="text-sm text-yellow-600">8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Baja (&lt;50%)</span>
                    <span className="text-sm text-red-600">2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumen financiero */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resumen Financiero
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Ingresos este mes</span>
                    <span className="text-sm font-bold">${mockReportes.ingresos.mesActual.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mes anterior</span>
                    <span className="text-sm text-muted-foreground">${mockReportes.ingresos.mesAnterior.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Crecimiento</span>
                    <span className="text-sm text-green-600">+{mockReportes.ingresos.crecimiento}%</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">${mockReportes.ingresos.promedioPorPaciente.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Promedio por paciente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Citas por día de la semana */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Distribución Semanal de Citas
              </CardTitle>
              <CardDescription>Patrón de citas por día de la semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {mockDatosGraficos.citasPorDia.map((item, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="text-sm font-medium">{item.dia}</div>
                    <div className="text-2xl font-bold text-primary">{item.citas}</div>
                    <Progress 
                      value={(item.citas / 15) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
