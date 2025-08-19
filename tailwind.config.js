/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        main: '#39B54A',
        secondary: '#7ED957',
        dashboard: '#F4F4F4',
        select: 'rgba(183, 234, 181, 0.7)',
        danger: '#B53939',
        pending: '#CFCFCF',
        progress: '#F3FF09',
        done: '#36FF09',
        main_text: '#585656',
        secondary_text: '#FFFFFF',
      }
    },
  },
  plugins: [],
}

