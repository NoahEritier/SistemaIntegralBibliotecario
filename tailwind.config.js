/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Modern Intellectual
        background: {
          primary: '#F9F7F2',    // Crema pálido/Papel antiguo limpio
          secondary: '#FFFFFF',   // Blanco puro
        },
        text: {
          primary: '#1A1A1A',     // Casi negro
          secondary: '#5C4B45',   // Marrón tierra desaturado
        },
        accent: {
          DEFAULT: '#8C7B75',     // Taupe/Marrón grisáceo
          active: '#2C1E1A',       // Marrón café muy oscuro
        },
        error: '#943E3E',          // Rojo óxido apagado
        success: '#4A5D44',       // Verde bosque desaturado
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],  // Títulos
        body: ['Inter', 'Lato', 'sans-serif'],   // Cuerpo/Datos
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '4px',
        md: '6px',
      },
      borderWidth: {
        DEFAULT: '1px',
      },
      boxShadow: {
        // Sombras extremadamente sutiles y duras
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}






