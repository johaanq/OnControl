"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePatientVitals } from '@/hooks/use-edge-service';
import { ClaimDeviceForm } from '@/components/forms/ClaimDeviceForm';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react'; 
import { cn } from '@/lib/utils';

interface VitalsCardProps {
  // Optional: If we want to show a claim button which opens a modal or navigates
  onClaimDeviceClick?: () => void;
}

export function VitalsCard({ onClaimDeviceClick }: VitalsCardProps) {
  const { data: vitals, isLoading, error, refresh } = usePatientVitals();

  // Initial loading state (no data yet)
  if (isLoading && !vitals && !error) {
    return (
      <Card className="w-[350px] h-[200px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Cargando signos vitales...</p>
      </Card>
    );
  }

  // Handle specific error states as requested
  if (error) {
    if (error.status === 403) {
      // Not authorized, likely device not claimed or invalid token
      return (
        <Card className="w-[350px] h-auto min-h-[200px] flex flex-col items-center justify-center p-4 text-center">
          <CardTitle className="text-xl text-red-500">Dispositivo No Vinculado</CardTitle>
          <CardDescription className="mt-2">
            Necesitas vincular tu banda para empezar a recibir datos.
          </CardDescription>
          <Button onClick={onClaimDeviceClick} className="mt-4">
            Vincular tu banda para empezar
          </Button>
          {/* Optionally show the ClaimDeviceForm directly here if onClaimDeviceClick is not provided */}
          {!onClaimDeviceClick && (
            <div className="mt-4 w-full">
              <ClaimDeviceForm onClaimSuccess={refresh} />
            </div>
          )}
        </Card>
      );
    } else if (error.status === 404) {
      // No recent data found for the claimed device
      return (
        <Card className="w-[350px] h-[200px] flex flex-col items-center justify-center p-4 text-center relative">
             <div className="absolute top-2 right-2">
                <Button variant="ghost" size="icon" onClick={() => refresh()} disabled={isLoading}>
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
            </div>
          <CardTitle className="text-xl text-yellow-600">Sin Mediciones Recientes</CardTitle>
          <CardDescription className="mt-2">
            No hay mediciones recientes. Realiza una medición con tu banda y presiona actualizar.
          </CardDescription>
          <Button variant="outline" size="sm" onClick={() => refresh()} className="mt-4" disabled={isLoading}>
            {isLoading ? 'Buscando...' : 'Actualizar ahora'}
          </Button>
        </Card>
      );
    } else {
      // Generic error
      return (
        <Card className="w-[350px] h-[200px] flex flex-col items-center justify-center p-4 text-center">
          <CardTitle className="text-xl text-red-500">Error</CardTitle>
          <CardDescription className="mt-2">
            Ocurrió un error al cargar los signos vitales: {error.message}
          </CardDescription>
          <Button variant="outline" size="sm" onClick={() => refresh()} className="mt-4">
            Reintentar
          </Button>
        </Card>
      );
    }
  }

  if (!vitals) {
     // Fallback if no error but no data (should be covered by 404 usually)
    return (
        <Card className="w-[350px] h-[200px] flex flex-col items-center justify-center p-4 text-center">
            <CardTitle className="text-xl text-gray-500">Esperando Datos</CardTitle>
            <CardDescription className="mt-2">
                Aún no hay datos de signos vitales disponibles.
            </CardDescription>
             <Button variant="outline" size="sm" onClick={() => refresh()} className="mt-4" disabled={isLoading}>
                <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
                Actualizar
            </Button>
        </Card>
    );
  }

  const latestReadingTime = new Date(vitals.timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <Card className="w-[350px]">
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
        <div className="space-y-1">
            <CardTitle>Signos Vitales Recientes</CardTitle>
            <CardDescription>Última actualización: {latestReadingTime}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => refresh()} disabled={isLoading} className="-mt-1">
            <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
            <span className="sr-only">Actualizar</span>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <span>BPM (Latidos por minuto)</span>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {vitals.bpm}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Temperatura (°C)</span>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {vitals.temperature}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>SpO2 (%)</span>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {vitals.spo2}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
            Dispositivo ID: {vitals.device_id}
        </div>
      </CardContent>
    </Card>
  );
}
