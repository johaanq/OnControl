"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  auth, 
  apiClient,
  type LoginRequest, 
  type LoginResponse,
  type RegisterRequest,
  type OrganizationLoginResponse,
  type ProfileLoginResponse
} from '@/lib/api'
import type { User, OrganizationUser, DoctorUser, PatientUser } from '@/types/organization'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true, // Start with true to check authentication on mount
    isAuthenticated: false,
  })
  
  const router = useRouter()

  // Helper to transform LoginResponse to User
  const transformLoginResponseToUser = (response: LoginResponse): User | null => {
    // Check if it's an organization response (has 'type' and 'organizationName')
    if ('type' in response && response.type === 'ORGANIZATION' && 'organizationName' in response) {
      const orgResponse = response as OrganizationLoginResponse
      return {
        type: 'ORGANIZATION',
        id: orgResponse.id,
        email: orgResponse.email,
        organizationName: orgResponse.organizationName,
        country: orgResponse.country,
        city: orgResponse.city,
        role: 'ORGANIZATION',
        isActive: true,
        isEmailVerified: false,
        maxDoctors: 10,
        maxPatients: 100,
        token: orgResponse.token
      } as OrganizationUser
    }
    
    // Check if it's a profile response (doctor/patient - has 'profile' field)
    if ('profile' in response) {
      const profileResponse = response as ProfileLoginResponse
      const profile = profileResponse.profile
      
      // Check if profile has doctor-specific fields
      if ('specialization' in profile && 'licenseNumber' in profile) {
        return {
          type: 'DOCTOR',
          profile: profile as any,
          token: profileResponse.token
        } as DoctorUser
      }
      
      // Otherwise it's a patient
      if ('doctorProfileId' in profile) {
        return {
          type: 'PATIENT',
          profile: profile as any,
          token: profileResponse.token
        } as PatientUser
      }
    }
    
    return null
  }

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      if (typeof window === 'undefined') return
      
      try {
        const token = localStorage.getItem('auth_token')
        const userType = localStorage.getItem('userType') as 'ORGANIZATION' | 'DOCTOR' | 'PATIENT' | null
        const userDataStr = localStorage.getItem('userData')
        
        if (token && userType && userDataStr) {
          const userData = JSON.parse(userDataStr)
          
          setAuthState({
            user: userData as User,
            isLoading: false,
            isAuthenticated: true,
          })
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    loadUser()
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await auth.login(credentials)
      const user = transformLoginResponseToUser(response)
      
      if (!user) {
        throw new Error('Invalid login response')
      }
      
      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        const token = 'token' in user ? user.token : '';
        if (token) {
          localStorage.setItem('auth_token', token)
        }
        localStorage.setItem('userType', user.type)
        localStorage.setItem('userData', JSON.stringify(user))
        if (user.type === 'ORGANIZATION') {
          localStorage.setItem('organizationId', user.id.toString())
        } else if (user.type === 'DOCTOR') {
          localStorage.setItem('doctorProfileId', user.profile.id.toString())
          localStorage.setItem('organizationId', user.profile.organizationId.toString())
        } else if (user.type === 'PATIENT') {
          localStorage.setItem('patientProfileId', user.profile.id.toString())
          localStorage.setItem('doctorProfileId', user.profile.doctorProfileId.toString())
        }
      }
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })

      // Redirect based on user type
      if (user.type === 'ORGANIZATION') {
        router.push('/dashboard/organizacion')
      } else if (user.type === 'DOCTOR') {
        router.push('/dashboard/medico')
      } else if (user.type === 'PATIENT') {
        router.push('/dashboard/paciente')
      }

      return response
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      throw error
    }
  }, [router])

  const registerOrganization = useCallback(async (data: RegisterRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await auth.registerOrganization(data)
      const user = transformLoginResponseToUser(response)
      
      if (!user) {
        throw new Error('Invalid registration response')
      }
      
      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        const token = 'token' in user ? user.token : '';
        if (token) {
          localStorage.setItem('auth_token', token)
        }
        localStorage.setItem('userType', user.type)
        localStorage.setItem('userData', JSON.stringify(user))
        if (user.type === 'ORGANIZATION') {
          localStorage.setItem('organizationId', user.id.toString())
        }
      }
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })

      // Redirect to organization dashboard
      router.push('/dashboard/organizacion')

      return response
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [router])

  const logout = useCallback(async () => {
    try {
      await auth.logout()
      
      // Clear all localStorage items
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('userType')
        localStorage.removeItem('userData')
        localStorage.removeItem('organizationId')
        localStorage.removeItem('doctorProfileId')
        localStorage.removeItem('patientProfileId')
      }
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [router])

  const refreshUser = useCallback(async () => {
    try {
      if (auth.isAuthenticated() && authState.user) {
        // Refresh user data based on type
        if (authState.user.type === 'ORGANIZATION') {
          // Refresh organization data if needed
          // For now, just keep the current data
        } else if (authState.user.type === 'DOCTOR') {
          // Refresh doctor dashboard to get updated data
          const dashboard = await apiClient.getDoctorDashboard(authState.user.profile.id)
          // Note: DoctorDashboardResponse doesn't have nested doctor object
          // We keep the existing profile data as the dashboard is for statistics
          // The profile data should be fetched separately if needed
          
          // For now, just keep existing profile data (dashboard is read-only stats)
          // TODO: Add separate endpoint to get DoctorProfile if full refresh is needed
        } else if (authState.user.type === 'PATIENT') {
          // Refresh patient dashboard to get updated data
          const dashboard = await apiClient.getPatientDashboard(authState.user.profile.id)
          // Note: PatientDashboardResponse doesn't have nested patient object
          // We keep the existing profile data as the dashboard is for statistics
          
          // For now, just keep existing profile data (dashboard is read-only stats)
          // TODO: Add separate endpoint to get PatientProfile if full refresh is needed
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }, [authState.user])

  return {
    ...authState,
    login,
    registerOrganization,
    logout,
    refreshUser,
  }
}
