/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'c:/Users/kaven/OneDrive/Documentos/Desktop/campushustle/src/**/*.{js,ts,jsx,tsx,mdx}',
    'c:/Users/kaven/OneDrive/Documentos/Desktop/campushustle/src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    'c:/Users/kaven/OneDrive/Documentos/Desktop/campushustle/src/components/**/*.{js,ts,jsx,tsx,mdx}',
    'c:/Users/kaven/OneDrive/Documentos/Desktop/campushustle/src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        safari: {
          50: '#ecfdf3',
          100: '#d1fae1',
          400: '#34d374',
          500: '#10b952',
          600: '#00b050',
          700: '#047835',
          800: '#065f2c',
          900: '#064e26',
        },
        daraja: {
          cyan: '#00d2ff',
          neon: '#39ff14',
          gold: '#ffb703',
        },
        dark: {
          950: '#090d16',
          900: '#0f172a',
          850: '#131d35',
          800: '#1e293b',
          700: '#334155',
        }
      },
    },
  },
  plugins: [],
};
