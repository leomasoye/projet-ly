/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        barca: {
          blau: '#004D98',
          'blau-dark': '#00366b',
          'blau-light': '#edf4fb',
          grana: '#A50044',
          'grana-dark': '#800034',
          'grana-light': '#fdf2f5',
          gold: '#EDBB00',
          'gold-accent': '#D4AF37',
          'gold-light': '#fef9e6',
        },
        surface: {
          page: '#F8FAFC',
          card: '#FFFFFF',
          alt: '#F1F5F9',
        },
        border: {
          subtle: '#E2E8F0',
          medium: '#CBD5E1',
          focus: '#004D98',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#64748B',
          light: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 4px 12px 0 rgba(0, 77, 152, 0.08), 0 2px 4px -2px rgba(0, 77, 152, 0.04)',
        'gold': '0 4px 14px 0 rgba(237, 187, 0, 0.18)',
        'blau': '0 4px 14px 0 rgba(0, 77, 152, 0.20)',
        'grana': '0 4px 14px 0 rgba(165, 0, 68, 0.20)',
      },
    },
  },
  plugins: [],
};
