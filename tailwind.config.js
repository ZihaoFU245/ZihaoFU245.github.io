/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./*.md",
    "./_includes/**/*.html",
    "./_layouts/**/*.html",
    "./_data/**/*.yml"
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#0F172A',      // slate-900
        'panel': '#1F2937',   // slate-800  
        'accent': '#1E3A8A',  // blue-800
        'accent-light': '#60A5FA', // blue-400
        'text': '#E5E7EB'     // slate-200
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['Fira Sans', 'monospace']
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
