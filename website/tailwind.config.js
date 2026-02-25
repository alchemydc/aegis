/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        navy: '#0F2B59',
        cyan: '#00D9FF',
        coral: '#FF6B4A',
        emerald: '#10B981',
        charcoal: '#0D1117',
        'off-white': '#FAFBFC',
        slate: '#1E293B',
        'gray-muted': '#64748B',
        'border-light': '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
