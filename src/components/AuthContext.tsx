// Authentication Context for managing user state across the app
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (userData: User, authToken: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('knots_token')
    const savedUser = localStorage.getItem('knots_user')

    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('knots_token')
        localStorage.removeItem('knots_user')
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('knots_token', authToken)
    localStorage.setItem('knots_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('knots_token')
    localStorage.removeItem('knots_user')
    // Redirect to auth page after logout
    window.location.href = '/auth'
  }

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}