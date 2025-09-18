"use client"

import { useState } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Filter, MoreHorizontal, Eye, Calendar } from "lucide-react"

// Mock data
const mockPatients = [
  {
    id: 1,
    name: "María González",
    age: 45,
    diagnosis: "Cáncer de mama",
    status: "En tratamiento",
    lastVisit: "2025-01-15",
    nextAppointment: "2025-01-22",
    phone: "+51 999 123 456",
    email: "maria.gonzalez@email.com",
    avatar: "/mujer-45-a-os-sonriente.jpg",
    treatmentProgress: 65,
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    age: 62,
    diagnosis: "Cáncer de próstata",
    status: "Seguimiento",
    lastVisit: "2025-01-14",
    nextAppointment: "2025-01-25",
    phone: "+51 999 234 567",
    email: "carlos.mendoza@email.com",
    avatar: "/hombre-62-a-os-profesional.jpg",
    treatmentProgress: 90,
  },
  {
    id: 3,
    name: "Ana Rodríguez",
    age: 38,
    diagnosis: "Cáncer de pulmón",
    status: "En tratamiento",
    lastVisit: "2025-01-13",
    nextAppointment: "2025-01-20",
    phone: "+51 999 345 678",
    email: "ana.rodriguez@email.com",
    avatar: "/mujer-38-a-os-determinada.jpg",
    treatmentProgress: 40,
  },
  {
    id: 4,
    name: "Pedro Sánchez",
    age: 55,
    diagnosis: "Cáncer colorrectal",
    status: "Primera consulta",
    lastVisit: "2025-01-12",
    nextAppointment: "2025-01-19",
    phone: "+51 999 456 789",
    email: "pedro.sanchez@email.com",
    avatar: "/hombre-55-a-os-optimista.jpg",
    treatmentProgress: 0,
  },
  {
    id: 5,
    name: "Laura Torres",
    age: 41,
    diagnosis: "Cáncer de ovario",
    status: "En tratamiento",
    lastVisit: "2025-01-11",
    nextAppointment: "2025-01-18",
    phone: "+51 999 567 890",
    email: "laura.torres@email.com",
    avatar: "/mujer-41-a-os-fuerte.jpg",
    treatmentProgress: 75,
  },
]

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En tratamiento":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "Seguimiento":
        return "bg-primary/10 text-primary border-primary/20"
      case "Primera consulta":
        return "bg-accent/10 text-accent border-accent/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <AuthGuard requiredUserType="medico">
      <DashboardLayout userType="medico">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestión de Pacientes</h1>
              <p className="text-muted-foreground">Administra y da seguimiento a tus pacientes</p>
            </div>
            <Button className="oncontrol-gradient text-white" asChild>
              <Link href="/dashboard/medico/pacientes/nuevo">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Paciente
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">24</div>
                <p className="text-sm text-muted-foreground">Total Pacientes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-secondary">18</div>
                <p className="text-sm text-muted-foreground">En Tratamiento</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent">4</div>
                <p className="text-sm text-muted-foreground">Seguimiento</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-destructive">2</div>
                <p className="text-sm text-muted-foreground">Primera Consulta</p>
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
                    placeholder="Buscar pacientes por nombre o diagnóstico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="En tratamiento">En tratamiento</SelectItem>
                      <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                      <SelectItem value="Primera consulta">Primera consulta</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nombre</SelectItem>
                      <SelectItem value="lastVisit">Última visita</SelectItem>
                      <SelectItem value="nextAppointment">Próxima cita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Última Visita</TableHead>
                    <TableHead>Próxima Cita</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                            <AvatarFallback>
                              {patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.age} años</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.diagnosis}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(patient.lastVisit).toLocaleDateString("es-PE")}</TableCell>
                      <TableCell>{new Date(patient.nextAppointment).toLocaleDateString("es-PE")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${patient.treatmentProgress}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{patient.treatmentProgress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/medico/pacientes/${patient.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/medico/citas/nueva?patient=${patient.id}`}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Agendar Cita
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
