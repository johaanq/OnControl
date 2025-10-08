"use client"

import type React from "react"

import { useState, memo, useMemo, useCallback, useEffect } from "react"
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
  Menu,
  X,
  Home,
  Stethoscope,
  Activity,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/auth-context"
import { Loading } from "./loading"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = memo(function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isLoading, isAuthenticated } = useAuthContext()

  // Determine user type based on the new architecture
  const userType = user?.type === 'ORGANIZATION' ? 'organizacion' : 
                   user?.type === 'DOCTOR' ? 'medico' : 'paciente'

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  const organizacionNavItems = useMemo(() => [
    { href: "/dashboard/organizacion", icon: Home, label: "Dashboard", badge: null },
    { href: "/dashboard/organizacion/doctores", icon: Stethoscope, label: "Doctores", badge: null },
  ], [])

  const medicoNavItems = useMemo(() => [
    { href: "/dashboard/medico", icon: Home, label: "Dashboard", badge: null },
    { href: "/dashboard/medico/pacientes", icon: Users, label: "Pacientes", badge: null },
    { href: "/dashboard/medico/citas", icon: Calendar, label: "Citas", badge: null },
    { href: "/dashboard/medico/calendario", icon: Calendar, label: "Calendario", badge: null },
    { href: "/dashboard/medico/tratamientos", icon: Heart, label: "Tratamientos", badge: null },
    { href: "/dashboard/medico/reportes", icon: BarChart3, label: "Reportes", badge: null },
  ], [])

  const pacienteNavItems = useMemo(() => [
    { href: "/dashboard/paciente", icon: Home, label: "Dashboard", badge: null },
    { href: "/dashboard/paciente/tratamiento", icon: Heart, label: "Mi Tratamiento", badge: null },
    { href: "/dashboard/paciente/citas", icon: Calendar, label: "Mis Citas", badge: null },
    { href: "/dashboard/paciente/sintomas", icon: Activity, label: "Síntomas", badge: null },
    { href: "/dashboard/paciente/medicamentos", icon: Stethoscope, label: "Medicamentos", badge: null },
    { href: "/dashboard/paciente/historial", icon: FileText, label: "Historial", badge: null },
  ], [])

  const navItems = useMemo(() => {
    if (userType === "organizacion") return organizacionNavItems
    if (userType === "medico") return medicoNavItems
    return pacienteNavItems
  }, [userType, organizacionNavItems, medicoNavItems, pacienteNavItems])

  // Redirect to login if not authenticated (after all hooks)
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, user, router])

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading message="Verificando autenticación..." />
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null
  }

  const NavItem = memo(function NavItem({ href, icon: Icon, label, badge, collapsed }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; badge: string | null; collapsed?: boolean }) {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
        } ${collapsed ? 'justify-center' : ''}`}
        onClick={() => setSidebarOpen(false)}
        title={collapsed ? label : undefined}
      >
        <Icon className="h-5 w-5" />
        {!collapsed && (
          <>
            <span className="font-medium">{label}</span>
            {badge && (
              <Badge variant="secondary" className="ml-auto">
                {badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    )
  })

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
      <div className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:bg-card lg:border-r transition-all duration-300 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          {!sidebarCollapsed && <OnControlLogo size="md" />}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={sidebarCollapsed ? 'mx-auto' : ''}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} collapsed={sidebarCollapsed} />
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden lg:block">
                <h2 className="text-lg font-semibold">
                  {userType === "organizacion" ? "Panel de Organización" : 
                   userType === "medico" ? "Panel Médico" : "Panel Paciente"}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/hombre-62-a-os-profesional.jpg" alt="Usuario" />
                          <AvatarFallback>
                            {user?.type === 'ORGANIZATION' && 'organizationName' in user
                              ? user.organizationName?.[0] || 'O'
                              : user?.type === 'DOCTOR' && 'profile' in user
                              ? `${user.profile.firstName?.[0] || ''}${user.profile.lastName?.[0] || ''}`
                              : user?.type === 'PATIENT' && 'profile' in user
                              ? `${user.profile.firstName?.[0] || ''}${user.profile.lastName?.[0] || ''}`
                              : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.type === 'ORGANIZATION' && 'organizationName' in user
                              ? user.organizationName
                              : user?.type === 'DOCTOR' && 'profile' in user
                              ? `Dr. ${user.profile.firstName} ${user.profile.lastName}`
                              : user?.type === 'PATIENT' && 'profile' in user
                              ? `${user.profile.firstName} ${user.profile.lastName}`
                              : 'Usuario'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.type === 'ORGANIZATION' && 'email' in user
                              ? user.email
                              : user?.type === 'DOCTOR' && 'profile' in user
                              ? user.profile.email
                              : user?.type === 'PATIENT' && 'profile' in user
                              ? user.profile.email
                              : ''}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {userType !== 'organizacion' && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/${userType}/perfil`}>
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Configuración</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
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
})
