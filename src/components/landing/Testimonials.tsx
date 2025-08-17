import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      name: "Ana Carolina Silva",
      role: "Professora de Matemática",
      school: "Escola Municipal São Paulo",
      avatar: "/perfil.jpg",
      rating: 5,
      content: "O ClassCheck revolucionou a forma como me conecto com meus alunos. Agora consigo identificar quando eles estão tendo dificuldades emocionais e ajudá-los de forma mais efetiva."
    },
    {
      name: "Pedro Santos",
      role: "Estudante - 9º Ano",
      school: "Colégio Estadual da Inovação",
      avatar: "/perfil.jpg",
      rating: 5,
      content: "Finalmente posso expressar como me sinto nas aulas sem constrangimento. O feedback que recebo me ajuda a melhorar e me sentir mais confiante nos estudos."
    },
    {
      name: "Maria Fernanda",
      role: "Coordenadora Pedagógica",
      school: "Instituto Educacional Futuro",
      avatar: "/perfil.jpg",
      rating: 5,
      content: "Os relatórios do ClassCheck nos permitiram implementar mudanças significativas no nosso método de ensino. O impacto no bem-estar dos estudantes foi notável."
    }
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            O que Nossa Comunidade Diz
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubra como o ClassCheck está transformando a vida de educadores e estudantes 
            em todo o país através de depoimentos reais.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-blue-500 opacity-50" />
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {testimonial.school}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Faça Parte Desta Transformação
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Junte-se a centenas de educadores e estudantes que já estão colhendo os benefícios do ClassCheck.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Gratuito para começar
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Suporte dedicado
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Resultados comprovados
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
