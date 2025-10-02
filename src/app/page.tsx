// Home Page - Redirects to appropriate page based on auth status
'use client'

import { useAuth } from '@/components/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/auth')
      }
    }
  }, [user, isLoading, router])

  // Show loading screen while checking auth status
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h1 className="text-4xl font-bold text-white mb-2">Knots</h1>
        <p className="text-blue-100">Loading your todo experience...</p>
      </div>
    </div>
  )
}
