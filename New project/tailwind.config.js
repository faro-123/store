/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        material: '0 24px 70px rgba(18, 24, 38, 0.14)',
        lift: '0 28px 80px rgba(15, 23, 42, 0.18)'
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at 18% 20%, rgba(244, 114, 182, .20), transparent 30%), radial-gradient(circle at 78% 10%, rgba(20, 184, 166, .20), transparent 26%), radial-gradient(circle at 55% 82%, rgba(251, 191, 36, .16), transparent 32%)'
      }
    }
  },
  plugins: []
};
