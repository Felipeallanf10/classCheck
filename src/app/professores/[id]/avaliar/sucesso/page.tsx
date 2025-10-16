'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Shield, Heart, ArrowRight, User } from 'lucide-react'

export default function AvaliacaoProfessorSucessoPage() {
  const params = useParams()
  const router = useRouter()
  const professorId = params.id as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Ícone de Sucesso */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Avaliação Enviada!</h1>
          <p className="text-muted-foreground text-lg">
            Obrigado por avaliar este professor 🙏
          </p>
        </div>

        {/* Card de Anonimato */}
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="text-center pb-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold">Sua Privacidade é Garantida</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium mb-1">100% Anônimo</h3>
                <p className="text-sm text-muted-foreground">
                  Seu nome nunca é revelado ao professor. Todas as avaliações são agregadas e apresentadas de forma anônima.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Feedback Construtivo</h3>
                <p className="text-sm text-muted-foreground">
                  Seu feedback honesto ajuda o professor a melhorar e proporciona experiências melhores para todos os alunos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impacto */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">+5 XP</p>
              <p className="text-sm text-muted-foreground">
                Por contribuir com feedback valioso para a comunidade
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mensagem Motivacional */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              💡 <strong>Saiba mais:</strong> As avaliações de professores são revisadas periodicamente 
              pela coordenação para identificar pontos de melhoria e reconhecer excelência.
            </p>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push('/minhas-avaliacoes')}
            className="w-full"
            size="lg"
          >
            Ver Minhas Avaliações
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          
          <Button
            onClick={() => router.push('/professores')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <User className="h-4 w-4 mr-2" />
            Voltar para Professores
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Você pode avaliar cada professor uma vez por mês
        </p>
      </div>
    </div>
  )
}
