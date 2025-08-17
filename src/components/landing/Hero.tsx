import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 py-20 lg:py-32">
      {/* Formas decorativas */}
      <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-blue-300 dark:bg-blue-600 opacity-20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-blue-400 dark:bg-blue-500 opacity-15 blur-2xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900 dark:text-white">Avalie e</span>
                <br />
                <span className="text-blue-600 dark:text-blue-400">Transforme</span>
                <br />
                <span className="text-gray-900 dark:text-white">sua Educação</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                O ClassCheck é a plataforma que conecta estudantes e professores através de 
                avaliações socioemocionais inteligentes, criando um ambiente educacional mais 
                humano e eficaz.
              </p>
            </div>

            {/* Benefícios rápidos */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Feedback em tempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Análise socioemocional</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Relatórios detalhados</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8 py-4">
                <Link href="/cadastro">
                  Criar Conta Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
                <Link href="/login">
                  Já tenho conta
                </Link>
              </Button>
            </div>
          </div>

          {/* Ilustração/Imagem */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl p-8 lg:p-12">
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
