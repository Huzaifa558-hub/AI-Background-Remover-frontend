import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-bold text-lg text-primary hover:text-magenta transition-colors"
          aria-label="AI Background Remover home"
        >
          {/* Scissors / sparkle icon mark */}
          <span className="w-7 h-7 rounded-md bg-magenta flex items-center justify-center" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-4 h-4">
              <path fillRule="evenodd" d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42a3.5 3.5 0 101.414 1.414l1.42-1.42 1.42 1.42a3.5 3.5 0 101.414-1.414L11.415 10l1.42-1.42A3.5 3.5 0 1011.17 7.003L10 8.172 8.83 7.003A3.5 3.5 0 005.5 2zm0 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm9 9a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5.5 13a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" clipRule="evenodd" />
            </svg>
          </span>
          BG Remover
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-surface-raised text-primary'
                  : 'text-secondary hover:text-primary hover:bg-surface-raised'
              }`
            }
          >
            Upload
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-surface-raised text-primary'
                  : 'text-secondary hover:text-primary hover:bg-surface-raised'
              }`
            }
          >
            History
          </NavLink>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
