'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OrganizationSelector } from './OrganizationSelector';
import type { DoctorRegistrationFormData } from '@/types/organization';

interface DoctorRegistrationFormProps {
  onSubmit: (data: DoctorRegistrationFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
}

const SPECIALIZATIONS = [
  'Oncología Médica',
  'Oncología Quirúrgica',
  'Radioterapia Oncológica',
  'Hematología Oncológica',
  'Cirugía Oncológica',
  'Medicina Interna',
  'Ginecología Oncológica',
  'Urología Oncológica',
  'Neurocirugía Oncológica',
  'Otra'
];

export function DoctorRegistrationForm({
  onSubmit,
  isLoading = false,
  submitText = 'Registrar Doctor'
}: DoctorRegistrationFormProps) {
  const [formData, setFormData] = useState<DoctorRegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: undefined,
    organizationId: 0,
    consultationFee: undefined,
    bio: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación básica
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!formData.specialization || !formData.licenseNumber || !formData.organizationId) {
      setError('Por favor completa la información profesional');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    // Validación de contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el formulario');
    }
  };

  const handleInputChange = (field: keyof DoctorRegistrationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registro de Doctor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Ej: Carlos"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Ej: García"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Ej: carlos.garcia@hospital.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Ej: +57 1 234 5678"
                />
              </div>
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
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Button>
              </div>
            </div>
          </div>

          {/* Información Profesional */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Profesional</h3>

            <div className="space-y-2">
              <OrganizationSelector
                value={formData.organizationId || null}
                onValueChange={(id) => handleInputChange('organizationId', id || 0)}
                label="Organización *"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Especialización *</Label>
                <select
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Selecciona una especialización</option>
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Número de Licencia *</Label>
                <Input
                  id="licenseNumber"
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  placeholder="Ej: MED-12345"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Años de Experiencia</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsOfExperience || ''}
                  onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                  placeholder="Ej: 10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultationFee">Tarifa de Consulta (COP)</Label>
                <Input
                  id="consultationFee"
                  type="number"
                  min="0"
                  value={formData.consultationFee || ''}
                  onChange={(e) => handleInputChange('consultationFee', parseInt(e.target.value) || 0)}
                  placeholder="Ej: 150000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografía Profesional</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Describe tu experiencia profesional, formación académica, etc..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Registrando...' : submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
