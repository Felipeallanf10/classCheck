interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Formas geométricas decorativas usando design tokens */}
      <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-primary-200/30 dark:bg-gray-700/30 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-primary-300/40 dark:bg-gray-600/30 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/4 right-1/4 h-32 w-32 rounded-full bg-primary-100/25 dark:bg-gray-800/25 blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 left-1/3 h-24 w-24 rounded-full bg-primary-200/20 dark:bg-gray-700/20 blur-lg animate-pulse" style={{ animationDelay: '3s' }} />
      
      {/* Padrões geométricas adicionais */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 h-2 w-20 bg-primary-200/40 dark:bg-gray-700/40 rotate-45 blur-sm" />
        <div className="absolute bottom-32 left-16 h-2 w-16 bg-primary-300/35 dark:bg-gray-600/35 -rotate-12 blur-sm" />
        <div className="absolute top-1/2 left-10 h-1 w-12 bg-primary-200/30 dark:bg-gray-700/30 rotate-12 blur-sm" />
      </div>
      
      {/* Logo/Branding */}
      <div className="absolute top-8 left-8 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            ClassCheck
          </span>
        </div>
      </div>
      
      {/* Conteúdo centralizado - responsivo */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        {children}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6 px-2 space-y-2">
          <p>
            Ao continuar, você concorda com nossos{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary-600 transition-colors">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary-600 transition-colors">
              Política de Privacidade
            </a>
            .
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © 2025 ClassCheck. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
