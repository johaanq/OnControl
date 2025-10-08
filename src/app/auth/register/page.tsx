'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OnControlLogo } from '@/components/oncontrol-logo';
import { Building2, User } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <OnControlLogo size="lg" className="justify-center mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Registro</h1>
          <p className="text-muted-foreground">Selecciona el tipo de cuenta que deseas crear</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organizaciones - Deshabilitado por ahora */}
          <Card className="opacity-50">
            <CardHeader className="text-center pb-3">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Organización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Registro de organizaciones médicas y hospitales
              </p>
              <Button 
                className="w-full" 
                disabled
              >
                Próximamente
              </Button>
            </CardContent>
          </Card>

          {/* Pacientes */}
          <Card className="border-primary">
            <CardHeader className="text-center pb-3">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Crea tu cuenta como paciente y comienza a gestionar tu tratamiento
              </p>
              <PatientRegistrationForm />
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Patient Registration Form Component
function PatientRegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Implement patient registration
      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Nombre"
          className="px-3 py-2 border rounded-md text-sm"
          value={formData.firstName}
          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Apellido"
          className="px-3 py-2 border rounded-md text-sm"
          value={formData.lastName}
          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
          required
        />
      </div>
      
      <input
        type="email"
        placeholder="Correo electrónico"
        className="w-full px-3 py-2 border rounded-md text-sm"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        required
      />
      
      <input
        type="password"
        placeholder="Contraseña"
        className="w-full px-3 py-2 border rounded-md text-sm"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        required
      />
      
      <input
        type="password"
        placeholder="Confirmar contraseña"
        className="w-full px-3 py-2 border rounded-md text-sm"
        value={formData.confirmPassword}
        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
        required
      />
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
      </Button>
    </form>
  );
}

// Add useState import
import { useState } from 'react';
