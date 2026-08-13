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
          // Light Mode Stitch Tokens
          primary: "#38656f",
          "primary-light": "#a0ced9",
          "primary-dark": "#1d4d56",
          secondary: "#864e5a",
          "secondary-light": "#feb6c4",
          "secondary-dark": "#6b3743",
          surface: "#f4fafd",
          "surface-dim": "#d4dbdd",
          "surface-container": "#e8eff1",
          "surface-high": "#e2e9ec",
          "surface-lowest": "#ffffff",
          text: "#161d1f",
          "text-muted": "#40484a",
          border: "#c0c8ca",
          accent: "#76574e",
          "accent-light": "#e6bdb2",
          error: "#ba1a1a",
          "error-light": "#ffdad6",

          // Stitch Precise Dark Mode Palette (Midnight Navy & Mint Teal)
          "dark-bg": "#0b0f19",
          "dark-surface": "#121827",
          "dark-surface-high": "#1c253b",
          "dark-surface-lowest": "#080c14",
          "dark-text": "#f8fafc",
          "dark-text-muted": "#94a3b8",
          "dark-border": "#222d46",
          "dark-primary": "#36d399",
          "dark-primary-hover": "#2bba84",
          "dark-on-primary": "#06261c",
          "dark-secondary": "#38bdf8"
        }
      },
      fontFamily: {
        kana: ['Literata', 'serif'],
        headline: ['Literata', 'serif'],
        sans: ['Inter', 'sans-serif']
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
