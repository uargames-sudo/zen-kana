/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          // Dynamic Light Mode Tokens (Lacquer Red & Warm Rice Paper)
          primary: "var(--zen-primary, #981701)",
          "primary-light": "#e86b54",
          "primary-dark": "#721000",
          secondary: "#864e5a",
          "secondary-light": "#feb6c4",
          "secondary-dark": "#6b3743",
          surface: "var(--zen-surface, #f6f4ee)",
          "surface-dim": "#ded8cb",
          "surface-container": "var(--zen-surface-container, #ebe7dd)",
          "surface-high": "var(--zen-surface-high, #e0dacd)",
          "surface-lowest": "var(--zen-surface-lowest, #ffffff)",
          text: "var(--zen-text, #161d1f)",
          "text-muted": "var(--zen-text-muted, #5c574f)",
          border: "var(--zen-border, #d4cdc0)",
          accent: "#76574e",
          "accent-light": "#e6bdb2",
          error: "#ba1a1a",
          "error-light": "#ffdad6",

          // Dynamic Dark Mode Tokens (Warm Charcoal & Golden Sun Amber)
          "dark-bg": "var(--zen-dark-bg, #141517)",
          "dark-surface": "var(--zen-dark-surface, #1a1b1e)",
          "dark-surface-high": "var(--zen-dark-surface-high, #24252a)",
          "dark-surface-lowest": "var(--zen-dark-surface-lowest, #0d0e10)",
          "dark-text": "var(--zen-dark-text, #f4f3f0)",
          "dark-text-muted": "var(--zen-dark-text-muted, #9a9994)",
          "dark-border": "var(--zen-dark-border, #31333a)",
          "dark-primary": "var(--zen-dark-primary, #f0b000)",
          "dark-primary-hover": "#d99e00",
          "dark-on-primary": "var(--zen-dark-on-primary, #141517)",
          "dark-secondary": "var(--zen-dark-secondary, #fbbf24)"
        }
      },
      fontFamily: {
        kana: ['Literata', 'serif'],
        headline: ['Literata', 'serif'],
        sans: ['Inter', 'sans-serif']
      },
      fontSize: {
        '3xs': ['0.5625rem', { lineHeight: '0.75rem' }], // 9px micro
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],  // 10px tag
        'xs-plus': ['0.6875rem', { lineHeight: '1rem' }], // 11px caption
        'kana-sm': ['2rem', { lineHeight: '1' }],
        'kana-md': ['3rem', { lineHeight: '1' }],
        'kana-lg': ['4.5rem', { lineHeight: '1' }],
        'kana-xl': ['6rem', { lineHeight: '1' }]
      },
      borderRadius: {
        'zen': '1rem'
      },
      boxShadow: {
        'zen-sm': '0px 4px 16px rgba(45, 52, 70, 0.04)',
        'zen-md': '0px 8px 24px rgba(45, 52, 70, 0.06)',
        'zen-lg': '0px 12px 32px rgba(45, 52, 70, 0.1)',
        'zen-dark-sm': '0px 4px 16px rgba(0, 0, 0, 0.4)',
        'zen-dark-lg': '0px 12px 32px rgba(0, 0, 0, 0.7)'
      }
    },
  },
  plugins: [],
}
