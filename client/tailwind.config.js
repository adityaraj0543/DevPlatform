/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',900:'#1e3a8a' },
      },
      fontFamily: { sans: ['Inter','ui-sans-serif','system-ui'] },
      boxShadow: { glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
