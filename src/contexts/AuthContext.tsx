'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Session } from '@/types'
import {
  getSession,
  setSession,
  clearSession,
  getUserByEmail,
  saveUser,
  hashPassword,
  seedIfNeeded,
} from '@/lib/store-engine'
import { generateId } from '@/lib/utils'

interface AuthContextValue {
  session: Session | null
  isLoading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ error?: string }>
  logout: () => void
  refreshSession: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = useCallback(() => {
    const s = getSession()
    setSessionState(s)
  }, [])

  useEffect(() => {
    seedIfNeeded().then(() => {
      refreshSession()
      setIsLoading(false)
    })
  }, [refreshSession])

  const login = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    const user = getUserByEmail(email)
    if (!user) return { error: 'No account found with that email.' }

    const hash = await hashPassword(password)
    if (hash !== user.password_hash) return { error: 'Incorrect password.' }

    const newSession: Session = {
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    }
    setSession(newSession)
    setSessionState(newSession)
    return {}
  }, [])

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    phone?: string,
  ): Promise<{ error?: string }> => {
    const existing = getUserByEmail(email)
    if (existing) return { error: 'An account with that email already exists.' }

    const hash = await hashPassword(password)
    const newUser = {
      id: 'user-' + generateId(),
      name,
      email,
      password_hash: hash,
      role: 'customer' as const,
      phone,
      created_at: new Date().toISOString(),
    }
    saveUser(newUser)

    const newSession: Session = {
      userId: newUser.id,
      role: newUser.role,
      name: newUser.name,
      email: newUser.email,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    }
    setSession(newSession)
    setSessionState(newSession)
    return {}
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSessionState(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isAdmin: session?.role === 'admin',
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
