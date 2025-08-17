

module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}", // App Router
      "./pages/**/*.{js,ts,jsx,tsx}", // Pages Router (opcional)
      "./components/**/*.{js,ts,jsx,tsx}", // Componentes reutilizáveis
    ],
    theme: {
      extend: {
        // Exemplo: fontes, cores, etc.
      },
    },
    darkMode: 'class', // ou 'media' se quiser automático
    plugins: [],
  }
  