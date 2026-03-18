/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          50: '#f5f7fb',
          100: '#e9eef7',
          200: '#d7e1f0',
          800: '#1f2937',
          900: '#111827',
        },
      },
      boxShadow: {
        panel: '0 16px 40px -20px rgba(15, 23, 42, 0.35)',
      },
      backgroundImage: {
        'board-grid':
          'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.18) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
