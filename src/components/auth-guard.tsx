"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { OnControlLogo } from "./oncontrol-logo"

interface AuthGuardProps {
  children: React.ReactNode
  requiredUserType?: "medico" | "paciente"
}

export function AuthGuard({ children, requiredUserType }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = () => {
      // In a real app, this would check tokens, session, etc.
      const mockAuth = localStorage.getItem("oncontrol-auth")
      const mockUserType = localStorage.getItem("oncontrol-user-type") as "medico" | "paciente" | null

      if (mockAuth === "true" && mockUserType) {
        setIsAuthenticated(true)

        // Check if user type matches required type
        if (requiredUserType && mockUserType !== requiredUserType) {
          router.push(`/dashboard/${mockUserType}`)
          return
        }
      } else {
        router.push("/auth/login")
        return
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, requiredUserType])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <OnControlLogo size="lg" className="justify-center" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
