import { CheckCircle, Users, Clock, Target, Lightbulb, Shield } from 'lucide-react'

export function Benefits() {
  const benefits = [
    {
      icon: Users,
      title: "Melhoria da Experiência Educacional",
      description: "Crie um ambiente mais colaborativo e empático entre alunos e professores"
    },
    {
      icon: Target,
      title: "Análise Detalhada e Precisa",
      description: "Obtenha insights profundos sobre o desempenho e bem-estar dos estudantes"
    },
    {
      icon: Clock,
      title: "Feedback em Tempo Real",
      description: "Receba e forneça feedback instantâneo para melhorias imediatas"
    },
    {
      icon: Lightbulb,
      title: "Identificação de Padrões",
      description: "Descubra tendências e oportunidades de melhoria no processo educativo"
    },
    {
      icon: Shield,
      title: "Ambiente Seguro e Confidencial",
      description: "Todos os dados são protegidos com os mais altos padrões de segurança"
    },
    {
      icon: CheckCircle,
      title: "Facilidade de Uso",
      description: "Interface intuitiva que pode ser usada por qualquer pessoa, sem complicações"
    }
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Por que Escolher o ClassCheck?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Nossa plataforma foi desenvolvida pensando nas necessidades reais de educadores 
                e estudantes, oferecendo ferramentas que realmente fazem a diferença no dia a dia.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                      <benefit.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Imagem/Ilustração */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">95%</div>
                  <div className="text-blue-100">dos usuários recomendam</div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">1000+</div>
                    <div className="text-blue-100 text-sm">Estudantes ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-blue-100 text-sm">Professores cadastrados</div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-white rounded-full border-2 border-blue-500"></div>
                      <div className="w-8 h-8 bg-blue-200 rounded-full border-2 border-blue-500"></div>
                      <div className="w-8 h-8 bg-blue-300 rounded-full border-2 border-blue-500"></div>
                    </div>
                    <span className="text-sm font-medium">Comunidade Ativa</span>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Faça parte de uma comunidade que valoriza o bem-estar educacional
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
