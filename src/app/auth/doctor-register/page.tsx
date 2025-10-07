'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DoctorRegistrationForm } from '@/components/forms/DoctorRegistrationForm';
import { useDoctorActions } from '@/hooks/use-doctors';
import { useAuthContext } from '@/contexts/auth-context';
import type { DoctorRegistrationFormData } from '@/types/organization';

export default function DoctorRegisterPage() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [success, setSuccess] = useState(false);
  const [createdDoctor, setCreatedDoctor] = useState<DoctorRegistrationFormData | null>(null);
  
  const { registerDoctor, isLoading, error } = useDoctorActions();

  const handleSubmit = async (data: DoctorRegistrationFormData) => {
    const result = await registerDoctor(data);
    if (result) {
      setCreatedDoctor(data);
      setSuccess(true);
      
      // Auto-login después del registro exitoso
      try {
        await login({
          email: data.email,
          password: data.password
        });
        router.push('/dashboard/medico');
      } catch (loginError) {
        console.error('Error en auto-login:', loginError);
        // El usuario puede hacer login manualmente
      }
    }
  };

  if (success && createdDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-green-900 mt-4">
              ¡Registro Exitoso!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600">
                Bienvenido, <strong>Dr. {createdDoctor.firstName} {createdDoctor.lastName}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Tu cuenta ha sido creada exitosamente. Ya puedes acceder al sistema.
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => router.push('/dashboard/medico')}
                className="w-full"
              >
                Ir al Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth/login')}
                className="w-full"
              >
                Iniciar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Registro de Doctor</h1>
          <p className="mt-2 text-gray-600">
            Completa el formulario para crear tu cuenta profesional
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Información Profesional</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DoctorRegistrationForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              submitText="Crear Cuenta de Doctor"
            />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/auth/login')}>
                  Inicia sesión aquí
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
