'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, Building2, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useOrganizations, useOrganizationActions } from '@/hooks/use-organizations';
import { OrganizationForm } from '@/components/forms/OrganizationForm';
import { useAuthContext } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import type { OrganizationFormData } from '@/types/organization';

export default function OrganizationsPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { organizations, isLoading, error, refetch } = useOrganizations({
    search: searchTerm || undefined
  });
  
  const { createOrganization, isLoading: isCreating } = useOrganizationActions();

  // Verificar que el usuario sea admin
  if (user?.role !== 'ADMIN') {
    router.push('/dashboard');
    return null;
  }

  const handleCreateOrganization = async (data: OrganizationFormData) => {
    const result = await createOrganization(data);
    if (result) {
      setShowCreateForm(false);
      refetch();
    }
  };

  if (showCreateForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Crear Nueva Organización</h1>
            <p className="text-muted-foreground">Registra una nueva organización en el sistema</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(false)}
          >
            Cancelar
          </Button>
        </div>
        
        <OrganizationForm
          onSubmit={handleCreateOrganization}
          isLoading={isCreating}
          submitText="Crear Organización"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Organizaciones</h1>
          <p className="text-muted-foreground">Administra las organizaciones del sistema</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Organización
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar organizaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : organizations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay organizaciones</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm 
                ? 'No se encontraron organizaciones que coincidan con tu búsqueda.'
                : 'Comienza creando la primera organización del sistema.'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Organización
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((organization) => (
            <Card key={organization.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{organization.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {organization.address}
                    </p>
                  </div>
                  <Badge variant={organization.isActive ? 'default' : 'secondary'}>
                    {organization.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-2" />
                    {organization.phone}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {organization.totalDoctors || 0} doctores
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Creada el {new Date(organization.createdAt).toLocaleDateString()}
                  </div>

                  <div className="pt-2 flex space-x-2">
                    <Link href={`/admin/organizations/${organization.id}/edit`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        Editar
                      </Button>
                    </Link>
                    <Link href={`/admin/organizations/${organization.id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
