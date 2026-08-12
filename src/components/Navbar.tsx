import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../hooks/useAuth'

// ── Reusable nav link ──────────────────────────────────────────────────────
function AppNavLink({ to, label, end }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
         focus:outline-none focus:shadow-focus ${
           isActive
             ? 'text-primary bg-surface-raised'
             : 'text-secondary hover:text-primary hover:bg-surface-raised'
         }`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <span
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-magenta"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </NavLink>
  )
}

// ── User menu ──────────────────────────────────────────────────────────────
function UserMenu() {
  const { user, logout }         = useAuth()
  const navigate                 = useNavigate()
  const [open, setOpen]          = useState(false)
  const menuRef                  = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  const initial  = user.name.charAt(0).toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg
          hover:bg-surface-raised transition-colors focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User menu"
      >
        {/* Avatar */}
        <span className="w-7 h-7 rounded-full bg-magenta text-white text-xs font-bold
          flex items-center justify-center shrink-0 select-none">
          {initial}
        </span>
        {/* Chevron */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
          className={`w-3 h-3 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true">
          <path fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"
            clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border
            bg-surface shadow-lg z-50 overflow-hidden animate-fade-up"
          role="menu"
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-primary truncate">{user.name}</p>
            <p className="text-xs text-muted truncate mt-0.5">{user.email}</p>
          </div>

          {/* Actions */}
          <div className="p-1" role="none">
            <button
              onClick={() => { setOpen(false); logout().then(() => navigate('/login')) }}
              role="menuitem"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                text-secondary hover:text-danger hover:bg-danger/5 transition-colors text-left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                className="w-4 h-4 shrink-0" aria-hidden="true">
                <path fillRule="evenodd"
                  d="M2 4.75A2.75 2.75 0 014.75 2h3a2.75 2.75 0 012.75 2.75v.5a.75.75 0 01-1.5 0v-.5c0-.69-.56-1.25-1.25-1.25h-3c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h3c.69 0 1.25-.56 1.25-1.25v-.5a.75.75 0 011.5 0v.5A2.75 2.75 0 017.75 14h-3A2.75 2.75 0 012 11.25v-6.5zm9.47.47a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 11-1.06-1.06l.97-.97H5.25a.75.75 0 010-1.5h7.19l-.97-.97a.75.75 0 010-1.06z"
                  clipRule="evenodd" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Navbar ────────────────────────────────────────────────────────────
export default function Navbar() {
  const { user, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border glass bg-surface/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none shrink-0"
          aria-label="AI Background Remover home"
        >
          <span className="relative w-8 h-8 rounded-lg bg-magenta flex items-center justify-center
            shadow-glow-sm shrink-0 transition-transform group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"
              className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42a3.5 3.5 0 101.414 1.414l1.42-1.42 1.42 1.42a3.5 3.5 0 101.414-1.414L11.415 10l1.42-1.42A3.5 3.5 0 0011.17 7.003L10 8.172 8.83 7.003A3.5 3.5 0 005.5 2zm0 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm9 9a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5.5 13a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="font-display font-bold text-lg leading-none text-primary
            group-hover:text-magenta transition-colors">
            BG<span className="text-magenta">.</span>Remover
          </span>
        </Link>

        {/* Feature nav — only when logged in */}
        {user && (
          <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none flex-1 justify-center"
            aria-label="Main navigation">
            <AppNavLink to="/"           label="Upload"     end />
            <AppNavLink to="/enhance"    label="Enhance"        />
            <AppNavLink to="/replace-bg" label="Replace BG"     />
            <AppNavLink to="/smart-crop" label="Smart Crop"     />
            <AppNavLink to="/batch"      label="Batch"          />
            <AppNavLink to="/history"    label="History"        />
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />

          {!loading && (
            user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-secondary
                    hover:text-primary hover:bg-surface-raised transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold
                    bg-magenta hover:bg-magenta-hover text-white transition-colors shadow-sm"
                >
                  Get started
                </Link>
              </div>
            )
          )}
        </div>

      </div>
    </header>
  )
}
