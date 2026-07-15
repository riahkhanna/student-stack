/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#080912', 900: '#0d0f1e', 800: '#12152a', 700: '#1a1d35',
          600: '#252840', 500: '#363a5a', 400: '#555878', 300: '#8b8fa8',
          200: '#b8bbd0', 100: '#e4e5ef', 50: '#f4f4f9',
        },
        volt: {
          600: '#4a5bef', 500: '#5b6df5', 400: '#7b8bff',
          300: '#a3adff', 200: '#ccd1ff', 100: '#eef0ff',
        },
      },
      boxShadow: {
        glass: '0 4px 32px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.05)',
        volt: '0 0 40px rgba(91,109,245,0.25)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(91,109,245,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(91,109,245,0.05) 1px,transparent 1px)',
        'radial-glow': 'radial-gradient(ellipse at center,rgba(91,109,245,0.13) 0%,transparent 70%)',
      },
      backgroundSize: { grid: '40px 40px' },
      animation: { float: 'float 6s ease-in-out infinite' },
      keyframes: { float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } } },
    },
  },
  plugins: [],
}
