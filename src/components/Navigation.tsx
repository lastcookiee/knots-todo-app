// Navigation Component
'use client'

import React from 'react'
import { useAuth } from './AuthContext'

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Knots</h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Hello, {user?.name && user.name.trim() ? user.name : user?.email?.split('@')[0] || 'User'}!
            </span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}