import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        'vault-muted': '#6D8196',
        'vault-accent': '#ADD8E6',
        'vault-cream': '#FFFAFA',
        'vault-navy': '#000080',
        'vault-ink': '#1C1F2A'
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 18px 40px rgba(13, 26, 64, 0.08)',
        'card': '0 12px 24px rgba(13, 26, 64, 0.12)'
      },
      backgroundImage: {
        'radial-soft': 'radial-gradient(circle at top, rgba(173, 216, 230, 0.6), rgba(255, 250, 250, 0.2) 55%)'
      }
    }
  },
  plugins: [forms, typography]
};
