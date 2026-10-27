/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bitume: {
          DEFAULT: '#0D0E12',
          surface: '#14161D',
          dark: '#08080B',
        },
        asphalte: {
          DEFAULT: '#1C1E24',
          light: '#252830',
        },
        border: {
          bitume: '#2A2D35',
          light: '#3E424E',
        },
        craie: {
          DEFAULT: '#F2F2F0',
          muted: '#9E9EA4',
          dim: '#656770',
        },
        catalan: {
          blau: '#004D98',
          grana: '#A50044',
        },
        chasuble: {
          DEFAULT: '#E2F163',
          glow: '#F0FB80',
          dark: '#B5C438',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        headline: ['"Syne"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'brutal-chasuble': '4px 4px 0px 0px #E2F163',
        'brutal-blau': '4px 4px 0px 0px #004D98',
        'brutal-grana': '4px 4px 0px 0px #A50044',
        'brutal-craie': '4px 4px 0px 0px #F2F2F0',
      },
    },
  },
  plugins: [],
};
