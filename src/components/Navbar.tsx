import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border glass bg-surface/90">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none"
          aria-label="AI Background Remover home"
        >
          {/* Icon mark */}
          <span className="relative w-8 h-8 rounded-lg bg-magenta flex items-center justify-center shadow-glow-sm shrink-0 transition-transform group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42a3.5 3.5 0 101.414 1.414l1.42-1.42 1.42 1.42a3.5 3.5 0 101.414-1.414L11.415 10l1.42-1.42A3.5 3.5 0 0011.17 7.003L10 8.172 8.83 7.003A3.5 3.5 0 005.5 2zm0 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm9 9a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5.5 13a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" clipRule="evenodd" />
            </svg>
          </span>

          {/* Wordmark */}
          <span className="font-display font-bold text-lg leading-none text-primary group-hover:text-magenta transition-colors">
            BG<span className="text-magenta">.</span>Remover
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:shadow-focus ${
                isActive
                  ? 'text-primary bg-surface-raised'
                  : 'text-secondary hover:text-primary hover:bg-surface-raised'
              }`
            }
          >
            {({ isActive }) => (
              <>
                Upload
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-magenta" aria-hidden="true" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:shadow-focus ${
                isActive
                  ? 'text-primary bg-surface-raised'
                  : 'text-secondary hover:text-primary hover:bg-surface-raised'
              }`
            }
          >
            {({ isActive }) => (
              <>
                History
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-magenta" aria-hidden="true" />
                )}
              </>
            )}
          </NavLink>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
