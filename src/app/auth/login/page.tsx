"use client"

import type React from "react"

import { useState } from "react"
import { OnControlLogo } from "@/components/oncontrol-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<"medico" | "paciente" | "">("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email || !password || !userType) {
      setError("Por favor completa todos los campos")
      setIsLoading(false)
      return
    }

    // Simulate authentication
    setTimeout(() => {
      // Save authentication data to localStorage
      localStorage.setItem("oncontrol-auth", "true")
      localStorage.setItem("oncontrol-user-type", userType)
      localStorage.setItem("oncontrol-user-email", email)

      // Set user name based on type for demo
      const userName = userType === "medico" ? "Dr. Carlos Mendoza" : "María González"
      localStorage.setItem("oncontrol-user-name", userName)

      // Redirect based on user type
      if (userType === "medico") {
        router.push("/dashboard/medico")
      } else {
        router.push("/dashboard/paciente")
      }

      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
          <OnControlLogo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Iniciar Sesión</h1>
          <p className="text-muted-foreground">Accede a tu cuenta de OnControl</p>
        </div>

        <Card className="oncontrol-shadow">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Bienvenido de vuelta</CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de usuario</Label>
                <Select value={userType} onValueChange={(value: "medico" | "paciente") => setUserType(value)}>
                  <SelectTrigger>
                    <User className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Selecciona tu tipo de usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medico">Médico Oncólogo</SelectItem>
                    <SelectItem value="paciente">Paciente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Recordarme
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="w-full oncontrol-gradient text-white" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link href="/auth/register" className="text-primary hover:underline font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Al iniciar sesión, aceptas nuestros</p>
          <div className="space-x-2">
            <Link href="#" className="hover:underline">
              Términos de Servicio
            </Link>
            <span>y</span>
            <Link href="#" className="hover:underline">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
