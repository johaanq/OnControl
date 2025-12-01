"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEdgeDevice } from '@/hooks/use-edge-service';
import { useRouter } from 'next/navigation';

interface ClaimDeviceFormProps {
  onClaimSuccess?: () => void;
}

export function ClaimDeviceForm({ onClaimSuccess }: ClaimDeviceFormProps) {
  const [deviceId, setDeviceId] = useState('');
  const { claimDevice, isLoading, error } = useEdgeDevice();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceId) return;

    try {
      await claimDevice(deviceId);
      alert('Dispositivo vinculado con éxito!'); // Simple alert for now
      setDeviceId('');
      if (onClaimSuccess) {
        onClaimSuccess();
      }
      // Optionally refresh the page or redirect after successful claim
      router.refresh(); 
    } catch (err) {
      console.error('Error claiming device:', err);
      // Error message is handled by the hook
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Vincular Banda Inteligente</CardTitle>
        <CardDescription>Ingresa el ID de tu dispositivo para vincularlo a tu perfil.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="deviceId">ID del Dispositivo</Label>
              <Input
                id="deviceId"
                placeholder="Ej. SB-001-XYZ"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">
                Error al vincular: {error.message}
                {error.status === 403 && ". Asegúrate de que el dispositivo esté libre y el token sea válido."}
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Vinculando...' : 'Vincular Dispositivo'}
        </Button>
      </CardFooter>
    </Card>
  );
}
