'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { OrganizationFormData } from '@/types/organization';

interface OrganizationFormProps {
  initialData?: Partial<OrganizationFormData>;
  onSubmit: (data: OrganizationFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
}

export function OrganizationForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitText = 'Crear Organización'
}: OrganizationFormProps) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: initialData?.name || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    description: initialData?.description || '',
    website: initialData?.website || ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación básica
    if (!formData.name || !formData.address || !formData.phone || !formData.email) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el formulario');
    }
  };

  const handleInputChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Información de la Organización</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Organización *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Hospital San Juan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Ej: +57 1 234 5678"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Ej: Calle 123 #45-67, Bogotá"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Ej: contacto@hospital.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Sitio Web</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="Ej: https://www.hospital.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe brevemente la organización..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Procesando...' : submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
