import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '../api/auth'
import { ApiError, setAccessToken } from '../lib/api'
import type { UserPublic } from '../lib/types'

type AuthState = {
  user: UserPublic | null
  loading: boolean
  login: (email: string, password: string) => Promise<UserPublic>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  isStudent: boolean
  isTeacher: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const me = await authApi.fetchMe()
      setUser(me)
    } catch (err) {
      setUser(null)
      setAccessToken(null)
      if (!(err instanceof ApiError && (err.status === 401 || err.status === 0))) {
        // Session absente ou réseau : rester déconnecté au boot.
      }
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      await refresh()
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    await authApi.login(email, password)
    const me = await authApi.fetchMe()
    setUser(me)
    return me
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      login,
      logout,
      refresh,
      isStudent: Boolean(user?.roles.includes('student')),
      isTeacher: Boolean(user?.roles.includes('teacher')),
      isAdmin: Boolean(user?.roles.includes('admin')),
    }),
    [user, loading, login, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth hors AuthProvider')
  return ctx
}
