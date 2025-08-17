'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "O que é o ClassCheck e como funciona?",
      answer: "O ClassCheck é uma plataforma de avaliação socioemocional que permite aos estudantes avaliar suas aulas e estado emocional, enquanto professores recebem feedback valioso para melhorar sua metodologia de ensino. Funciona através de formulários simples e intuitivos que geram relatórios detalhados."
    },
    {
      question: "A plataforma é gratuita?",
      answer: "Sim! O ClassCheck oferece um plano gratuito robusto que inclui avaliações básicas, relatórios simples e suporte por email. Também oferecemos planos premium com funcionalidades avançadas como análises detalhadas e integração com outros sistemas educacionais."
    },
    {
      question: "Como a privacidade dos dados é garantida?",
      answer: "Levamos a privacidade muito a sério. Todos os dados são criptografados, armazenados em servidores seguros e seguimos rigorosamente a LGPD. As avaliações podem ser anônimas e apenas administradores autorizados têm acesso aos relatórios consolidados."
    },
    {
      question: "Professores podem ver avaliações individuais dos alunos?",
      answer: "Por padrão, professores visualizam apenas dados consolidados e anônimos para preservar a privacidade dos estudantes. Avaliações individuais só são visíveis quando o próprio aluno autoriza ou em casos específicos definidos pela coordenação pedagógica."
    },
    {
      question: "Como começar a usar o ClassCheck na minha escola?",
      answer: "É muito simples! Basta criar uma conta, cadastrar sua turma e convidar os alunos. Oferecemos tutoriais completos, suporte durante a implementação e treinamento para toda a equipe pedagógica. O processo leva menos de 30 minutos."
    },
    {
      question: "Que tipos de relatórios são gerados?",
      answer: "Geramos relatórios sobre engajamento da turma, tendências emocionais, satisfação com as aulas, feedback qualitativo dos estudantes e sugestões de melhoria. Tudo apresentado de forma visual e fácil de entender, com gráficos e métricas acionáveis."
    }
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Encontre respostas para as dúvidas mais comuns sobre o ClassCheck
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <button
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </h3>
                      {openIndex === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA adicional */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Não encontrou sua resposta?
            </p>
            <a 
              href="mailto:suporte@classcheck.com" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Entre em contato conosco →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
