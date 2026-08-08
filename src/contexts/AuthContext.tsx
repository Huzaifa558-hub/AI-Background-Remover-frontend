import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  type ReactNode,
} from 'react'
import axios from 'axios'

// ── Types ──────────────────────────────────────────────────────────────────

export interface AuthUser {
  user_id:     string
  name:        string
  email:       string
  created_at:  string
}

export interface AuthContextValue {
  user:     AuthUser | null
  token:    string | null
  loading:  boolean          // true while validating stored token on mount
  login:    (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout:   () => void
  refreshUser: () => Promise<void>
}

// ── Storage key ────────────────────────────────────────────────────────────

const TOKEN_KEY = 'bgr_token'

// ── Context ────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null)

// ── Helper: set / clear axios default Authorization header ─────────────────

function setAxiosToken(token: string | null) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

// ── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null)
  const [token,   setToken]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // ── On mount: restore token from localStorage and validate it ────────────
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (!stored) {
      setLoading(false)
      return
    }
    setAxiosToken(stored)
    axios
      .get<AuthUser>('/api/auth/me')
      .then(res => {
        setToken(stored)
        setUser(res.data)
      })
      .catch(() => {
        // Token expired or invalid — clear it silently
        localStorage.removeItem(TOKEN_KEY)
        setAxiosToken(null)
      })
      .finally(() => setLoading(false))
  }, [])

  // ── Persist token ─────────────────────────────────────────────────────────
  const _storeToken = useCallback((t: string) => {
    localStorage.setItem(TOKEN_KEY, t)
    setAxiosToken(t)
    setToken(t)
  }, [])

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const res = await axios.post<{ access_token: string; user: AuthUser }>(
      '/api/auth/login',
      { email, password },
    )
    _storeToken(res.data.access_token)
    setUser(res.data.user)
  }, [_storeToken])

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await axios.post<{ access_token: string; user: AuthUser }>(
        '/api/auth/register',
        { name, email, password },
      )
      _storeToken(res.data.access_token)
      setUser(res.data.user)
    },
    [_storeToken],
  )

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setAxiosToken(null)
    setToken(null)
    setUser(null)
  }, [])

  // ── Refresh user (e.g. after quota change) ────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const res = await axios.get<AuthUser>('/api/auth/me')
      setUser(res.data)
    } catch {
      logout()
    }
  }, [logout])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── useAuthContext (raw, internal use) ─────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>')
  return ctx
}
