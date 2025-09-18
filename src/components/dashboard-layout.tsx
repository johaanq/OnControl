"use client"

import type React from "react"

import { useState } from "react"
import { OnControlLogo } from "./oncontrol-logo"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Badge } from "./ui/badge"
import {
  Users,
  Calendar,
  Heart,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Home,
  Stethoscope,
  Activity,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "medico" | "paciente"
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("oncontrol-auth")
    localStorage.removeItem("oncontrol-user-type")
    router.push("/auth/login")
  }

  const medicoNavItems = [
    { href: "/dashboard/medico", icon: Home, label: "Dashboard", badge: null },
    { href: "/dashboard/medico/pacientes", icon: Users, label: "Pacientes", badge: "24" },
    { href: "/dashboard/medico/calendario", icon: Calendar, label: "Calendario", badge: "6" },
    { href: "/dashboard/medico/tratamientos", icon: Heart, label: "Tratamientos", badge: null },
    { href: "/dashboard/medico/notificaciones", icon: Bell, label: "Notificaciones", badge: "3" },
    { href: "/dashboard/medico/reportes", icon: BarChart3, label: "Reportes", badge: null },
  ]

  const pacienteNavItems = [
    { href: "/dashboard/paciente", icon: Home, label: "Dashboard", badge: null },
    { href: "/dashboard/paciente/tratamiento", icon: Heart, label: "Mi Tratamiento", badge: null },
    { href: "/dashboard/paciente/citas", icon: Calendar, label: "Mis Citas", badge: "2" },
    { href: "/dashboard/paciente/sintomas", icon: Activity, label: "Síntomas", badge: null },
    { href: "/dashboard/paciente/medicamentos", icon: Stethoscope, label: "Medicamentos", badge: null },
    { href: "/dashboard/paciente/notificaciones", icon: Bell, label: "Notificaciones", badge: "2" },
    { href: "/dashboard/paciente/historial", icon: FileText, label: "Historial", badge: null },
  ]

  const navItems = userType === "medico" ? medicoNavItems : pacienteNavItems

  const NavItem = ({ href, icon: Icon, label, badge }: any) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
        {badge && (
          <Badge variant="secondary" className="ml-auto">
            {badge}
          </Badge>
        )}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-card border-r">
            <div className="flex items-center justify-between p-4 border-b">
              <OnControlLogo size="md" />
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-card lg:border-r">
        <div className="flex items-center p-4 border-b">
          <OnControlLogo size="md" />
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden lg:block">
                <h2 className="text-lg font-semibold">{userType === "medico" ? "Panel Médico" : "Panel Paciente"}</h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative" asChild>
                <Link href={`/dashboard/${userType}/notificaciones`}>
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">3</Badge>
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/hombre-62-a-os-profesional.jpg" alt="Usuario" />
                      <AvatarFallback>{userType === "medico" ? "DM" : "P"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userType === "medico" ? "Dr. Carlos Mendoza" : "María González"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userType === "medico" ? "carlos.mendoza@oncontrol.pe" : "maria.gonzalez@email.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/${userType}/perfil`}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
