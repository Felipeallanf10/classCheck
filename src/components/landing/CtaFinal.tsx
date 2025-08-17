import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CtaFinal() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-300" />
              <span className="text-blue-100 font-medium">Transforme sua educação hoje</span>
              <Sparkles className="h-6 w-6 text-yellow-300" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Pronto para Revolucionar
              <br />
              sua Experiência Educacional?
            </h2>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Junte-se a centenas de educadores e estudantes que já estão transformando 
              a forma como ensinar e aprender acontece. Comece gratuitamente hoje mesmo.
            </p>
          </div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-200">Gratuito para começar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">&lt; 5min</div>
              <div className="text-blue-200">Para configurar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200">Suporte disponível</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/cadastro">
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
            >
              <Link href="/login">
                Fazer Login
              </Link>
            </Button>
          </div>

          {/* Garantias */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 text-blue-200 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Sem compromisso
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Cancele quando quiser
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Suporte dedicado
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
