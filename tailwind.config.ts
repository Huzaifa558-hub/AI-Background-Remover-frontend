import type { Config } from 'tailwindcss';

/**
 * AI Background Remover — Tailwind theme config
 *
 * Maps CSS custom properties from src/theme/tokens.css into Tailwind
 * utilities so components can use classes like:
 *   bg-page, bg-surface, bg-surface-raised
 *   text-primary, text-secondary, text-muted
 *   border-border, border-border-strong
 *   bg-magenta, bg-magenta-hover, text-magenta
 *   bg-teal, bg-teal-hover, text-teal
 *   font-display, font-body, font-mono
 *   rounded-sm, rounded-md, rounded-lg
 *   shadow-focus
 *
 * Dark mode is driven by the data-theme="dark" attribute on <html>
 * (see tokens.css), NOT Tailwind's default `media` strategy.
 * This lets the app control light/dark independently of OS settings.
 */
const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],

  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        /* Surfaces */
        page:            'var(--bg-page)',
        surface:         'var(--bg-surface)',
        'surface-raised':'var(--bg-surface-raised)',

        /* Text */
        primary:   'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted:     'var(--text-muted)',

        /* Borders */
        border:         'var(--border)',
        'border-strong':'var(--border-strong)',

        /* Brand accents */
        magenta: {
          DEFAULT: 'var(--accent-magenta)',
          hover:   'var(--accent-magenta-hover)',
        },
        teal: {
          DEFAULT: 'var(--accent-teal)',
          hover:   'var(--accent-teal-hover)',
        },

        /* Semantic */
        danger:  'var(--color-danger)',
        warning: 'var(--color-warning)',
        success: 'var(--color-success)',

        /* Checkerboard tiles (rarely used directly — prefer .bg-checker) */
        'checker-1': 'var(--checker-tile-1)',
        'checker-2': 'var(--checker-tile-2)',
      },

      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
        mono:    ['var(--font-mono)'],
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },

      boxShadow: {
        focus: 'var(--shadow-focus)',
      },
    },
  },

  plugins: [],
};

export default config;
