/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#FBF7E9',
        espresso: '#2B1E16',
        terracotta: '#8B1A1A',
        gold: '#D4AF37',
        polaroid: '#FDFBF7',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        hand: ['var(--font-hand)', 'Caveat', 'cursive'],
      },
      animation: {
        'spin-slow': 'spin 25s linear infinite',
        marquee: 'marquee 56s linear infinite',
      },
      backgroundImage: {
        'paper-jute':
          "radial-gradient(rgba(43,30,22,0.04) 0.7px, transparent 0.7px), radial-gradient(rgba(43,30,22,0.03) 0.7px, transparent 0.7px)",
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
