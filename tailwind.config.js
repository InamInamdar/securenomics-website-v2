/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1e40af',
          'blue-light': '#3b82f6',
          'blue-dark': '#1e3a8a',
          navy: '#0f172a',
        },
        cyber: {
          dark: '#020617',
          gray: '#1e293b',
        }
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      }
    }
  },
  plugins: []
};
