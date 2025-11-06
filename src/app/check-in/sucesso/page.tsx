'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, TrendingUp, Heart, ArrowRight, Activity } from 'lucide-react'

function CheckInSucessoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Obter dados do estado emocional da URL (em app real, viria do servidor)
  const estadoPrimario = searchParams.get('estado') || 'Calmo'
  const valencia = parseFloat(searchParams.get('valencia') || '0.6')
  const ativacao = parseFloat(searchParams.get('ativacao') || '-0.3')

  const getEstadoEmoji = (estado: string) => {
    const emojis: Record<string, string> = {
      'Animado': '😄',
      'Empolgado': '🤩',
      'Calmo': '😌',
      'Relaxado': '😊',
      'Entediado': '😐',
      'Cansado': '😴',
      'Ansioso': '😰',
      'Estressado': '😫',
      'Neutro': '😐'
    }
    return emojis[estado] || '🙂'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Ícone de Sucesso */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Check-in Registrado!</h1>
          <p className="text-muted-foreground text-lg">
            Seu estado emocional foi registrado com sucesso 🧘
          </p>
        </div>

        {/* Card de Estado Emocional */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center pb-3">
            <h2 className="text-xl font-semibold">Seu Estado Atual</h2>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              {/* Estado Primário */}
              <div>
                <div className="text-6xl mb-2">{getEstadoEmoji(estadoPrimario)}</div>
                <p className="text-2xl font-bold">{estadoPrimario}</p>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Valência</p>
                  <p className="text-xl font-semibold">{valencia > 0 ? '+' : ''}{valencia.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {valencia > 0 ? 'Positivo' : valencia < 0 ? 'Negativo' : 'Neutro'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ativação</p>
                  <p className="text-xl font-semibold">{ativacao > 0 ? '+' : ''}{ativacao.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {ativacao > 0 ? 'Alta Energia' : ativacao < 0 ? 'Baixa Energia' : 'Neutro'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insight */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-0">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium mb-1">💡 Insight</h3>
                <p className="text-sm text-muted-foreground">
                  {valencia > 0 && ativacao < 0 && 'Você está em um estado de calma e serenidade. Ótimo momento para atividades que exigem concentração.'}
                  {valencia > 0 && ativacao > 0 && 'Você está animado e energizado! Aproveite esse momento para atividades sociais e criativas.'}
                  {valencia < 0 && ativacao < 0 && 'Você pode estar se sentindo desanimado. Que tal fazer uma pausa ou conversar com alguém?'}
                  {valencia < 0 && ativacao > 0 && 'Você parece tenso ou ansioso. Considere técnicas de respiração ou uma caminhada.'}
                  {Math.abs(valencia) < 0.3 && Math.abs(ativacao) < 0.3 && 'Você está em um estado neutro. Como você gostaria de se sentir?'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gamificação */}
        <Card className="border-2 border-cyan-200 dark:border-cyan-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/20 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium">Check-in Diário</p>
                  <p className="text-sm text-muted-foreground">Continue registrando seus sentimentos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">+3 XP</p>
                <p className="text-xs text-muted-foreground">Autocuidado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push('/relatorios/meu-estado-emocional')}
            className="w-full"
            size="lg"
          >
            <Activity className="h-4 w-4 mr-2" />
            Ver Minha Jornada Emocional
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          
          <Button
            onClick={() => router.push('/minhas-avaliacoes')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Ver Todos os Check-ins
          </Button>

          <Button
            onClick={() => router.push('/dashboard')}
            variant="ghost"
            className="w-full"
          >
            Voltar ao Início
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Faça check-ins diários para acompanhar sua evolução emocional
        </p>
      </div>
    </div>
  )
}

export default function CheckInSucessoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <CheckInSucessoContent />
    </Suspense>
  )
}
