import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Wraps a route element and redirects to /login if the user is not
 * authenticated. Preserves the intended destination in location state
 * so LoginPage can redirect back after a successful login.
 *
 * Shows a spinner while the initial token validation is in progress
 * (avoids a flash-redirect on page reload when the token is valid).
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location          = useLocation()

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[40vh]" role="status">
        <div className="relative w-12 h-12">
          <svg
            className="absolute inset-0 w-12 h-12 animate-spin text-magenta"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <circle className="opacity-15" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-80" fill="currentColor" d="M44 24a20 20 0 00-20-20v4a16 16 0 0116 16h4z" />
          </svg>
        </div>
        <span className="sr-only">Checking authentication…</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
