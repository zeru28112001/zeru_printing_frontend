import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f5',
          100: '#fbe8eb',
          200: '#f7d5d9',
          300: '#efb4bc',
          400: '#e38896',
          500: '#d15d71',
          600: '#ba3f56',
          700: '#9b3044',
          800: '#822b3c',
          900: '#6f2837',
          950: '#3e111a',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
