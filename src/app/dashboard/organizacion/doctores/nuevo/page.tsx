"use client"

import { useEffect, useState } from 'react'
import { useAuthContext } from '@/contexts/auth-context'
import { useOrganizationActions } from '@/hooks/use-organizations'
import { isOrganizationUser } from '@/types/organization'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BackButton } from '@/components/ui/back-button'
import { UserPlus, Eye, EyeOff, Activity } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import type { CreateDoctorRequest } from '@/lib/api'

export default function NewDoctorPage() {
  const { user, isLoading: authLoading } = useAuthContext()
  const router = useRouter()
  const [organizationId, setOrganizationId] = useState<number | null>(null)
  const { createDoctor, isLoading, error: actionError } = useOrganizationActions(organizationId)
  
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<CreateDoctorRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    city: '',
    address: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: undefined,
    hospitalAffiliation: '',
    consultationFee: '',
    bio: '',
    isAvailable: true,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      if (isOrganizationUser(user)) {
        setOrganizationId(user.id)
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, authLoading, router])

  const handleInputChange = (field: keyof CreateDoctorRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validaciones
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (!formData.specialization) {
      setError('La especialización es requerida')
      return
    }

    if (!formData.licenseNumber) {
      setError('El número de licencia es requerido')
      return
    }

    try {
      const result = await createDoctor(formData)
      
      if (result) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard/organizacion/doctores')
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el doctor')
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <BackButton 
            fallbackUrl="/dashboard/organizacion/doctores"
            label="Volver a doctores"
            className="mb-4"
          />
          <h1 className="text-3xl font-bold">Agregar Nuevo Doctor</h1>
          <p className="text-muted-foreground">Registra un médico en tu organización</p>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Doctor</CardTitle>
          <CardDescription>Completa todos los campos requeridos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {actionError && (
              <Alert variant="destructive">
                <AlertDescription>{actionError}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-primary/10 border-primary/30">
                <AlertDescription className="text-primary-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Doctor creado exitosamente. Redirigiendo...
                </AlertDescription>
              </Alert>
            )}

            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Personal</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Información Profesional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Profesional</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Especialización *</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    placeholder="Ej: Oncología Médica"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Número de Licencia *</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    placeholder="Ej: MED-12345"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Años de Experiencia</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    value={formData.yearsOfExperience || ''}
                    onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultationFee">Tarifa de Consulta ($)</Label>
                  <Input
                    id="consultationFee"
                    type="text"
                    value={formData.consultationFee || ''}
                    onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                    placeholder="Ej: 1500.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalAffiliation">Afiliación Hospitalaria</Label>
                <Input
                  id="hospitalAffiliation"
                  value={formData.hospitalAffiliation}
                  onChange={(e) => handleInputChange('hospitalAffiliation', e.target.value)}
                  placeholder="Hospital o institución afiliada"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Breve descripción profesional..."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onCheckedChange={(checked) => handleInputChange('isAvailable', checked as boolean)}
                />
                <Label htmlFor="isAvailable" className="font-normal">
                  Marcar como disponible
                </Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="oncontrol-gradient text-white hover:opacity-90 transition-opacity cursor-pointer"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <>
                    <Activity className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Crear Doctor
                  </>
                )}
              </Button>
              <Link href="/dashboard/organizacion/doctores">
                <Button 
                  type="button" 
                  variant="outline"
                  className="hover:bg-accent transition-colors cursor-pointer"
                >
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  )
}

