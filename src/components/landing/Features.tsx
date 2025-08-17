import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, BarChart3, MessageSquare, TrendingUp } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: Heart,
      title: "Avaliação Socioemocional",
      description: "Registre e acompanhe o estado emocional dos estudantes em tempo real, criando um ambiente mais empático.",
      color: "text-red-500"
    },
    {
      icon: MessageSquare,
      title: "Feedback Inteligente",
      description: "Sistema de feedback bidirecional entre alunos e professores, promovendo comunicação efetiva.",
      color: "text-blue-500"
    },
    {
      icon: BarChart3,
      title: "Relatórios Detalhados",
      description: "Análises profundas sobre engajamento, satisfação e desempenho socioemocional das turmas.",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      title: "Melhoria Contínua",
      description: "Identificação de tendências e padrões para otimização constante do processo educacional.",
      color: "text-purple-500"
    }
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Funcionalidades que Fazem a Diferença
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubra como o ClassCheck está revolucionando a forma como estudantes e professores 
            se conectam, promovendo um ambiente educacional mais humano e eficaz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
