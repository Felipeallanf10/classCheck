'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, TrendingUp, Flame, Trophy, ArrowRight, BookOpen } from 'lucide-react'

export default function AvaliacaoSucessoPage() {
  const params = useParams()
  const router = useRouter()
  const aulaId = params.id as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Ícone de Sucesso */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Avaliação Enviada!</h1>
          <p className="text-muted-foreground text-lg">
            Obrigado por compartilhar seu feedback 🎉
          </p>
        </div>

        {/* Card de Gamificação */}
        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader className="text-center pb-3">
            <h2 className="text-xl font-semibold">Seu Impacto</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {/* XP Ganho */}
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">+10 XP</p>
                <p className="text-xs text-muted-foreground">Pontos ganhos</p>
              </div>

              {/* Sequência */}
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">3 dias</p>
                <p className="text-xs text-muted-foreground">Sequência ativa</p>
              </div>

              {/* Progresso */}
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12/50</p>
                <p className="text-xs text-muted-foreground">Avaliações</p>
              </div>
            </div>

            {/* Barra de Progresso para Próximo Badge */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Próxima conquista:</p>
                <p className="text-sm text-muted-foreground">38 avaliações restantes</p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-700"
                  style={{ width: '24%' }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                🏆 <strong>Avaliador Dedicado</strong> - Avaliar 50 aulas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mensagem Motivacional */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              💡 <strong>Você sabia?</strong> Seu feedback ajuda professores a melhorar 
              as aulas e outros alunos a ter experiências melhores!
            </p>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push(`/minhas-avaliacoes`)}
            className="w-full"
            size="lg"
          >
            Ver Minhas Avaliações
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          
          <Button
            onClick={() => router.push('/aulas')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Voltar para Aulas
          </Button>

          <Button
            onClick={() => router.push('/relatorios/meu-estado-emocional')}
            variant="ghost"
            className="w-full"
          >
            📈 Ver Minha Jornada Emocional
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Continue avaliando aulas para desbloquear mais conquistas!
        </p>
      </div>
    </div>
  )
}
