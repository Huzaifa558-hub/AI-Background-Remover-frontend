/**
 * Convenience hook — re-exports everything from AuthContext.
 * Use this in components instead of importing from the context directly.
 *
 *   const { user, login, logout, loading } = useAuth()
 */
export { useAuthContext as useAuth } from '../contexts/AuthContext'
