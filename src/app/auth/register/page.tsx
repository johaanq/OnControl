"use client"

import type React from "react"

import { useState } from "react"
import { OnControlLogo } from "@/components/oncontrol-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Building2, Globe, MapPin } from "lucide-react"
import Link from "next/link"
import { useAuthContext } from "@/contexts/auth-context"

// Lista de países comunes en Latinoamérica y España
const COUNTRIES = [
  { value: "México", label: "México" },
  { value: "España", label: "España" },
  { value: "Colombia", label: "Colombia" },
  { value: "Argentina", label: "Argentina" },
  { value: "Chile", label: "Chile" },
  { value: "Perú", label: "Perú" },
  { value: "Venezuela", label: "Venezuela" },
  { value: "Ecuador", label: "Ecuador" },
  { value: "Guatemala", label: "Guatemala" },
  { value: "Cuba", label: "Cuba" },
  { value: "Bolivia", label: "Bolivia" },
  { value: "República Dominicana", label: "República Dominicana" },
  { value: "Honduras", label: "Honduras" },
  { value: "Paraguay", label: "Paraguay" },
  { value: "El Salvador", label: "El Salvador" },
  { value: "Nicaragua", label: "Nicaragua" },
  { value: "Costa Rica", label: "Costa Rica" },
  { value: "Puerto Rico", label: "Puerto Rico" },
  { value: "Panamá", label: "Panamá" },
  { value: "Uruguay", label: "Uruguay" },
]

// Ciudades por país
const CITIES_BY_COUNTRY: Record<string, string[]> = {
  "México": [
    "Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana",
    "León", "Juárez", "Zapopan", "Mérida", "Querétaro"
  ],
  "España": [
    "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza",
    "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao"
  ],
  "Colombia": [
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena",
    "Cúcuta", "Bucaramanga", "Pereira", "Santa Marta", "Ibagué"
  ],
  "Argentina": [
    "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata",
    "San Miguel de Tucumán", "Mar del Plata", "Salta", "Santa Fe", "San Juan"
  ],
  "Chile": [
    "Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta",
    "Temuco", "Rancagua", "Talca", "Arica", "Chillán"
  ],
  "Perú": [
    "Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura",
    "Cusco", "Iquitos", "Huancayo", "Tacna", "Juliaca"
  ],
  "Venezuela": [
    "Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay",
    "Ciudad Guayana", "Barcelona", "Maturín", "Puerto La Cruz", "Petare"
  ],
  "Ecuador": [
    "Quito", "Guayaquil", "Cuenca", "Santo Domingo", "Machala",
    "Durán", "Manta", "Portoviejo", "Loja", "Ambato"
  ],
  "Guatemala": [
    "Ciudad de Guatemala", "Mixco", "Villa Nueva", "Quetzaltenango", "Escuintla"
  ],
  "Cuba": [
    "La Habana", "Santiago de Cuba", "Camagüey", "Holguín", "Santa Clara"
  ],
  "Bolivia": [
    "La Paz", "Santa Cruz de la Sierra", "Cochabamba", "Sucre", "Oruro"
  ],
  "República Dominicana": [
    "Santo Domingo", "Santiago", "La Romana", "San Pedro de Macorís", "San Cristóbal"
  ],
  "Honduras": [
    "Tegucigalpa", "San Pedro Sula", "Choloma", "La Ceiba", "El Progreso"
  ],
  "Paraguay": [
    "Asunción", "Ciudad del Este", "San Lorenzo", "Luque", "Capiatá"
  ],
  "El Salvador": [
    "San Salvador", "Soyapango", "Santa Ana", "San Miguel", "Mejicanos"
  ],
  "Nicaragua": [
    "Managua", "León", "Masaya", "Matagalpa", "Chinandega"
  ],
  "Costa Rica": [
    "San José", "Limón", "San Francisco", "Alajuela", "Liberia"
  ],
  "Puerto Rico": [
    "San Juan", "Bayamón", "Carolina", "Ponce", "Caguas"
  ],
  "Panamá": [
    "Ciudad de Panamá", "San Miguelito", "Tocumen", "David", "Arraiján"
  ],
  "Uruguay": [
    "Montevideo", "Salto", "Ciudad de la Costa", "Paysandú", "Las Piedras"
  ],
}

export default function RegisterOrganizationPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [availableCities, setAvailableCities] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    country: "",
    city: "",
    acceptTerms: false,
  })
  
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { registerOrganization } = useAuthContext()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    setFormData((prev) => ({ ...prev, country, city: "" }))
    setAvailableCities(CITIES_BY_COUNTRY[country] || [])
    setError("")
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsSubmitting(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsSubmitting(false)
      return
    }

    if (!formData.acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      setIsSubmitting(false)
      return
    }

    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        organizationName: formData.organizationName,
        country: formData.country,
        city: formData.city,
      }

      await registerOrganization(registerData)
      // The hook will redirect automatically to /dashboard/organizacion
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al registrar la organización. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
          <OnControlLogo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Registrar Organización</h1>
          <p className="text-muted-foreground">Crea una cuenta para tu hospital, clínica o centro médico</p>
        </div>

        <Card className="oncontrol-shadow">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Información de la Organización</CardTitle>
            <CardDescription>Completa los datos requeridos para comenzar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Información de la Organización */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Nombre de la Organización *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="organizationName"
                      placeholder="Hospital Central, Clínica San Juan..."
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange("organizationName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País *</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                    <Select value={formData.country} onValueChange={handleCountryChange} required>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Selecciona un país" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                    <Select 
                      value={formData.city} 
                      onValueChange={(value) => handleInputChange("city", value)}
                      disabled={!selectedCountry}
                      required
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder={
                          selectedCountry 
                            ? "Selecciona una ciudad" 
                            : "Primero selecciona un país"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {!selectedCountry && (
                    <p className="text-xs text-muted-foreground">
                      Selecciona un país primero para ver las ciudades disponibles
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@hospital.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Seguridad */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirma tu contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="acceptTerms" className="text-sm font-normal leading-relaxed">
                  Acepto los{" "}
                  <Link href="#" className="text-primary hover:underline">
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="#" className="text-primary hover:underline">
                    política de privacidad
                  </Link>.
                  Entiendo que OnControl es una plataforma para gestión de pacientes oncológicos.
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full oncontrol-gradient text-white" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registrando organización..." : "Registrar Organización"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Después del registro:</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Podrás crear cuentas de doctores para tu organización</li>
            <li>• Los doctores podrán crear y gestionar sus pacientes</li>
            <li>• Tendrás acceso a dashboards y reportes completos</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
