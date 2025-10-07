'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useOrganizations } from '@/hooks/use-organizations';
import type { Organization } from '@/types/organization';

interface OrganizationSelectorProps {
  value?: number | null;
  onValueChange: (organizationId: number | null) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  showActiveOnly?: boolean;
}

export function OrganizationSelector({
  value,
  onValueChange,
  placeholder = 'Selecciona una organización',
  label = 'Organización',
  required = false,
  disabled = false,
  showActiveOnly = true
}: OrganizationSelectorProps) {
  const { organizations, isLoading, error } = useOrganizations(
    showActiveOnly ? { isActive: true } : undefined
  );

  const handleValueChange = (organizationId: string) => {
    const id = organizationId === 'none' ? null : parseInt(organizationId);
    onValueChange(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {label && <Label>{label} {required && '*'}</Label>}
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Cargando organizaciones...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        {label && <Label>{label} {required && '*'}</Label>}
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label} {required && '*'}</Label>}
      <Select
        value={value?.toString() || 'none'}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {organizations.length === 0 ? (
            <SelectItem value="none" disabled>
              No hay organizaciones disponibles
            </SelectItem>
          ) : (
            <>
              {!required && (
                <SelectItem value="none">
                  Sin organización
                </SelectItem>
              )}
              {organizations.map((organization) => (
                <SelectItem key={organization.id} value={organization.id.toString()}>
                  <div className="flex flex-col">
                    <span className="font-medium">{organization.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {organization.address}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

// Componente simplificado para mostrar solo la organización seleccionada
interface OrganizationDisplayProps {
  organizationId: number | null;
  fallback?: string;
}

export function OrganizationDisplay({ 
  organizationId, 
  fallback = 'Sin organización' 
}: OrganizationDisplayProps) {
  const { organizations, isLoading } = useOrganizations({});
  
  // Buscar la organización específica por ID
  const selectedOrganization = organizationId 
    ? organizations.find(org => org.id === organizationId)
    : null;

  if (isLoading) {
    return <span className="text-sm text-muted-foreground">Cargando...</span>;
  }

  if (!selectedOrganization) {
    return <span className="text-sm text-muted-foreground">{fallback}</span>;
  }

  return (
    <div className="flex flex-col">
      <span className="font-medium">{selectedOrganization.name}</span>
      <span className="text-xs text-muted-foreground">{selectedOrganization.address}</span>
    </div>
  );
}
