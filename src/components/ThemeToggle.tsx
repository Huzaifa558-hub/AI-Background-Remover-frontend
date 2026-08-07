import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`
        relative w-14 h-7 rounded-full border transition-all duration-300 focus:outline-none focus:shadow-focus
        ${isDark
          ? 'bg-gold/20 border-gold/40 hover:border-gold/70'
          : 'bg-surface-raised border-border hover:border-border-strong'
        }
      `}
    >
      {/* Track icons */}
      <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none" aria-hidden="true">
        {/* Sun — left side */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
          className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-0' : 'opacity-60 text-warning'}`}>
          <path d="M8 1a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1A.75.75 0 018 1zm0 10.5a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1A.75.75 0 018 11.5zm4.95-8.364a.75.75 0 010 1.061l-.707.707a.75.75 0 11-1.06-1.06l.706-.708a.75.75 0 011.06 0zm-8.486 9.9a.75.75 0 010 1.06l-.707.707a.75.75 0 01-1.06-1.06l.707-.707a.75.75 0 011.06 0zM15 8a.75.75 0 01-.75.75h-1a.75.75 0 010-1.5h1A.75.75 0 0115 8zm-11.5 0a.75.75 0 01-.75.75h-1a.75.75 0 010-1.5h1A.75.75 0 013.5 8zm9.864-4.95a.75.75 0 010 1.06l-.707.707a.75.75 0 01-1.06-1.06l.707-.707a.75.75 0 011.06 0zM4.136 12.136a.75.75 0 010 1.06l-.707.707a.75.75 0 01-1.06-1.06l.707-.707a.75.75 0 011.06 0zM8 5a3 3 0 100 6A3 3 0 008 5z"/>
        </svg>
        {/* Moon — right side */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
          className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-80 text-gold' : 'opacity-0'}`}>
          <path d="M7.5 1.5a.75.75 0 00-.75.75 5.25 5.25 0 005.25 5.25.75.75 0 000-1.5A3.75 3.75 0 017.5 2.25a.75.75 0 000-1.5z"/>
          <path fillRule="evenodd" d="M7 8A6 6 0 1014 2.17 7 7 0 017 8z" clipRule="evenodd"/>
        </svg>
      </span>

      {/* Thumb */}
      <span
        aria-hidden="true"
        className={`
          absolute top-0.5 w-6 h-6 rounded-full shadow-sm
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          ${isDark
            ? 'left-[calc(100%-1.625rem)] bg-gold shadow-glow-sm'
            : 'left-0.5 bg-white border border-border'
          }
        `}
      >
        {/* Inner icon on thumb */}
        {isDark ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="#080808" className="w-3 h-3" aria-hidden="true">
            <path d="M5.5 1a.5.5 0 01.5.5 3.5 3.5 0 003.5 3.5.5.5 0 010 1A4.5 4.5 0 015 1.5a.5.5 0 01.5-.5z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="#EF9F27" className="w-3 h-3" aria-hidden="true">
            <circle cx="6" cy="6" r="2.5"/>
          </svg>
        )}
      </span>
    </button>
  )
}
