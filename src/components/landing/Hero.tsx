import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 py-20 lg:py-32">
      {/* Formas decorativas */}
      <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-blue-200/30 dark:bg-blue-600/30 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-indigo-300/25 dark:bg-indigo-500/25 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/3 h-24 w-24 rounded-full bg-purple-100/20 dark:bg-purple-700/20 blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                <span className="text-gray-900 dark:text-white">Avalie e</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Transforme
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">sua Educação</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                O ClassCheck é a plataforma que conecta estudantes e professores através de 
                avaliações socioemocionais inteligentes, criando um ambiente educacional mais 
                humano e eficaz.
              </p>
            </div>

            {/* Benefícios rápidos */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Feedback em tempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Análise socioemocional</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Relatórios detalhados</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cadastro">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  Criar Conta Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 w-full sm:w-auto border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-950"
                >
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>

          {/* Ilustração/Imagem */}
          <div className="relative">
            <div className="bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/30 rounded-2xl p-8 lg:p-12 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30">
              <div className="grid grid-cols-2 gap-4">
                {/* Mock de interface */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">😊</span>
                    </div>
                    <div className="text-sm font-medium">Humor do Dia</div>
                  </div>
                  <div className="text-xs text-gray-500">Muito satisfeito</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">⭐</span>
                    </div>
                    <div className="text-sm font-medium">Avaliação</div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    ))}
                  </div>
                </div>
                
                <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="text-sm font-medium mb-2">Feedback Recente</div>
                  <div className="text-xs text-gray-500">
                    "A aula de matemática foi muito clara e dinâmica!"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
