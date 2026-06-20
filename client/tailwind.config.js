/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'lesson': '1.125rem', // 18px 课件正文
        'lesson-lg': '1.25rem', // 20px
        'lesson-xl': '1.5rem', // 24px
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        accent: {
          gold: '#ffd700',
          red: '#ff4757',
          blue: '#3742fa',
          cyan: '#00d9ff',
          purple: '#a855f7',
          green: '#2ed573',
          orange: '#ffa502',
          pink: '#ff6b9d',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.35)',
        'glow-blue': '0 0 20px rgba(55, 66, 250, 0.35)',
        'glow-green': '0 0 20px rgba(46, 213, 115, 0.35)',
        'card-hover': '0 20px 40px -8px rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
