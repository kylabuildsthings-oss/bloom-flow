import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Game-inspired palette (Animal Crossing style)
        // Primary: Soft natural greens
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#bce5cc',
          300: '#8fd1a8',
          400: '#5bb57d',
          500: '#3a9b5f',
          600: '#2a7d4c',
          700: '#23643e',
          800: '#1f5034',
          900: '#1a422c',
        },
        // Secondary: Soft natural blues
        secondary: {
          50: '#f0f7fa',
          100: '#d9ecf3',
          200: '#b8dae7',
          300: '#8bc0d5',
          400: '#5ba0be',
          500: '#4085a5',
          600: '#336a8a',
          700: '#2d5771',
          800: '#29495e',
          900: '#263e50',
        },
        // Accent: Warm yellows and peaches
        accent: {
          50: '#fffbf0',
          100: '#fff5d9',
          200: '#ffe8b3',
          300: '#ffd680',
          400: '#ffc04d',
          500: '#ffa726',
          600: '#ff8c00',
          700: '#e67300',
          800: '#cc5f00',
          900: '#b34d00',
        },
        // Peach accent for highlights
        peach: {
          50: '#fff5f0',
          100: '#ffe5d9',
          200: '#ffccb3',
          300: '#ffaa80',
          400: '#ff804d',
          500: '#ff6b3d',
          600: '#ff5126',
          700: '#e63d1f',
          800: '#cc3319',
          900: '#b32d14',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Terracotta for active tab indicator
        terracotta: {
          DEFAULT: '#CD853F',
          50: '#faf7f2',
          100: '#f5ede0',
          200: '#ead9c1',
          300: '#dcc09a',
          400: '#CD853F',
          500: '#b87333',
          600: '#9d5f28',
          700: '#7d4a20',
          800: '#653c1a',
          900: '#523115',
        },
      },
      borderRadius: {
        DEFAULT: '0.5rem', // rounded-lg as default
      },
      boxShadow: {
        // Softer, more diffuse shadows for game UI panels
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 1px 4px 0 rgba(0, 0, 0, 0.04)',
        'soft-md': '0 4px 16px 0 rgba(0, 0, 0, 0.1), 0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.12), 0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'soft-xl': '0 12px 32px 0 rgba(0, 0, 0, 0.14), 0 6px 16px 0 rgba(0, 0, 0, 0.1)',
        // Default shadow becomes soft
        DEFAULT: '0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 1px 4px 0 rgba(0, 0, 0, 0.04)',
        'sm': '0 1px 4px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'md': '0 4px 16px 0 rgba(0, 0, 0, 0.1), 0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'lg': '0 8px 24px 0 rgba(0, 0, 0, 0.12), 0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'xl': '0 12px 32px 0 rgba(0, 0, 0, 0.14), 0 6px 16px 0 rgba(0, 0, 0, 0.1)',
        '2xl': '0 16px 48px 0 rgba(0, 0, 0, 0.16), 0 8px 24px 0 rgba(0, 0, 0, 0.12)',
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
