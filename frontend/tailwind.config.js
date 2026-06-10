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
        /* Romantic palette – all existing vault-* tokens kept, values updated */
        'vault-muted':    '#A78BCA', // muted purple-mauve  (was #6D8196)
        'vault-accent':   '#F9A8D4', // soft pink            (was #ADD8E6)
        'vault-cream':    '#FFF5F9', // pink-tinted cream    (was #FFFAFA)
        'vault-navy':     '#9333EA', // romantic deep purple (was #000080)
        'vault-ink':      '#2D1B36', // deep romantic dark   (was #1C1F2A)
        /* New tokens */
        'vault-pink':     '#F472B6',
        'vault-lavender': '#C4B5FD',
        'vault-rose':     '#FDA4AF',
        'vault-plum':     '#6B21A8',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 18px 40px rgba(147, 51, 234, 0.07)',
        'card': '0 8px 24px rgba(147, 51, 234, 0.08), 0 2px 8px rgba(244, 114, 182, 0.09)'
      },
      backgroundImage: {
        'radial-soft': 'radial-gradient(circle at top, rgba(244,114,182,0.22), rgba(255,245,249,0.05) 55%)'
      }
    }
  },
  plugins: [forms, typography]
};
