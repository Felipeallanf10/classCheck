interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Formas geométricas decorativas */}
      <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-blue-300 dark:bg-gray-700 opacity-20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-blue-400 dark:bg-gray-600 opacity-20 blur-2xl" />
      <div className="absolute top-1/4 right-1/4 h-32 w-32 rounded-full bg-blue-200 dark:bg-gray-800 opacity-15 blur-xl" />
      <div className="absolute bottom-1/3 left-1/3 h-24 w-24 rounded-full bg-blue-300 dark:bg-gray-700 opacity-10 blur-lg" />
      
      {/* Padrões geométricas adicionais */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 h-2 w-20 bg-blue-200 dark:bg-gray-700 opacity-30 rotate-45 blur-sm" />
        <div className="absolute bottom-32 left-16 h-2 w-16 bg-blue-300 dark:bg-gray-600 opacity-25 -rotate-12 blur-sm" />
        <div className="absolute top-1/2 left-10 h-1 w-12 bg-blue-200 dark:bg-gray-700 opacity-20 rotate-12 blur-sm" />
      </div>
      
      {/* Conteúdo centralizado - responsivo */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        {children}
        <div className="text-muted-foreground text-center text-xs text-balance mt-4 px-2">
          Ao continuar, você concorda com nossos{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Política de Privacidade
          </a>
          .
        </div>
      </div>
    </div>
  )
}
