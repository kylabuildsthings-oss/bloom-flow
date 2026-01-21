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
        // Femtech-focused soft professional palette
        primary: {
          50: '#fef2f8',
          100: '#fde6f1',
          200: '#fccce3',
          300: '#faa5cd',
          400: '#f670b0',
          500: '#ee4694',
          600: '#dc2777',
          700: '#be1a5f',
          800: '#9d1a4e',
          900: '#821a43',
        },
        secondary: {
          50: '#f8f4ff',
          100: '#f0e8ff',
          200: '#e4d5ff',
          300: '#d0b5ff',
          400: '#b588ff',
          500: '#9a5aff',
          600: '#8333ff',
          700: '#6e1aff',
          800: '#5c0ae6',
          900: '#4d0bb8',
        },
        accent: {
          50: '#fff1f2',
          100: '#ffe1e3',
          200: '#ffc7cc',
          300: '#ffa0a8',
          400: '#ff6b7a',
          500: '#ff3d52',
          600: '#ed1c35',
          700: '#c7142a',
          800: '#a51526',
          900: '#881928',
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
      },
    },
  },
  plugins: [],
};
export default config;
