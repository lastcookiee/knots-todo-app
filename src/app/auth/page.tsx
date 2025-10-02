// Authentication Page - Combines Login and Register
'use client'

import React, { useState } from 'react'
import { LoginForm } from '@/components/LoginForm'
import { RegisterForm } from '@/components/RegisterForm'

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  return (
    <>
      {isLogin ? (
        <LoginForm onToggleMode={toggleMode} />
      ) : (
        <RegisterForm onToggleMode={toggleMode} />
      )}
    </>
  )
}

export default AuthPage