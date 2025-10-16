'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, TrendingUp, Calendar, Trophy, Star, Zap, Target } from 'lucide-react'

export default function AvaliacaoConcluidaPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const aulaId = params.aulaId as string
  
  const didaticaPulada = searchParams.get('didatica') === 'pulada'
  
  // Estado para animação de contadores
  const [showStats, setShowStats] = useState(false)
  const [avaliacoesCount, setAvaliacoesCount] = useState(0)
  
  // Mock data (em produção viria de API)
  const estatisticas = useMemo(() => {
    // Buscar do localStorage como simulação
    const hoje = new Date()
    const mesAtual = hoje.getMonth()
    const avaliacoesMes = 12 // Mock - seria API
    const avaliacoesTotal = 47 // Mock - seria API
    const sequenciaAtual = 3 // Dias consecutivos avaliando
    
    // Calcular progresso até próximo badge
    const proximoBadgeEm = 50
    const progressoParaBadge = (avaliacoesTotal / proximoBadgeEm) * 100
    
    return {
      avaliacoesMes,
      avaliacoesTotal,
      sequenciaAtual,
      progressoParaBadge,
      proximoBadgeEm
    }
  }, [])
  
  // Mensagens motivacionais baseadas em estatísticas
  const mensagemMotivacional = useMemo(() => {
    if (estatisticas.sequenciaAtual >= 5) {
      return {
        texto: "Sequência incrível! Continue assim!",
        emoji: "🔥",
        cor: "text-orange-600 dark:text-orange-400"
      }
    }
    if (estatisticas.avaliacoesMes >= 10) {
      return {
        texto: "Você está muito engajado este mês!",
        emoji: "⭐",
        cor: "text-yellow-600 dark:text-yellow-400"
      }
    }
    return {
      texto: "Toda avaliação ajuda você a crescer!",
      emoji: "💪",
      cor: "text-blue-600 dark:text-blue-400"
    }
  }, [estatisticas])
  
  // Animar contadores ao montar
  useEffect(() => {
    setShowStats(true)
    
    // Animação do contador
    let currentCount = 0
    const targetCount = estatisticas.avaliacoesMes
    const duration = 1000 // 1 segundo
    const steps = 30
    const increment = targetCount / steps
    const stepDuration = duration / steps
    
    const timer = setInterval(() => {
      currentCount += increment
      if (currentCount >= targetCount) {
        setAvaliacoesCount(targetCount)
        clearInterval(timer)
      } else {
        setAvaliacoesCount(Math.floor(currentCount))
      }
    }, stepDuration)
    
    return () => clearInterval(timer)
  }, [estatisticas.avaliacoesMes])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          {/* Ícone de Sucesso Animado */}
          <div className="flex justify-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full animate-bounce-once">
              <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Título */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Avaliação Concluída!</h1>
            <p className="text-muted-foreground">
              {didaticaPulada 
                ? 'Obrigado por avaliar o aspecto socioemocional da aula.'
                : 'Obrigado por avaliar a aula de forma completa!'
              }
            </p>
            {!didaticaPulada && (
              <Badge variant="secondary" className="mt-2">
                <Star className="h-3 w-3 mr-1" />
                Avaliação Completa
              </Badge>
            )}
          </div>

          {/* Cards de Impacto */}
          <div className="grid md:grid-cols-3 gap-4 pt-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg hover:scale-105 transition-transform">
              <div className="text-blue-600 dark:text-blue-400 mb-2 text-2xl">👨‍🏫</div>
              <p className="text-sm font-medium">Ajuda o Professor</p>
              <p className="text-xs text-muted-foreground">A melhorar suas aulas</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg hover:scale-105 transition-transform">
              <div className="text-purple-600 dark:text-purple-400 mb-2 text-2xl">📊</div>
              <p className="text-sm font-medium">Acompanhe Sua Jornada</p>
              <p className="text-xs text-muted-foreground">Evolução emocional</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg hover:scale-105 transition-transform">
              <div className="text-green-600 dark:text-green-400 mb-2 text-2xl">🏫</div>
              <p className="text-sm font-medium">Melhora a Escola</p>
              <p className="text-xs text-muted-foreground">Ambientes melhores</p>
            </div>
          </div>

          {/* Estatísticas e Gamificação */}
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            {/* Contador Principal */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Avaliações este mês</p>
              <p className={`text-5xl font-bold text-primary transition-all duration-1000 ${showStats ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                {avaliacoesCount}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {estatisticas.avaliacoesTotal} no total
              </p>
            </div>

            {/* Sequência */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <p className="text-sm font-medium text-orange-900 dark:text-orange-300">Sequência Atual</p>
              </div>
              <p className="text-5xl font-bold text-orange-600 dark:text-orange-400">
                {estatisticas.sequenciaAtual}
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-400 mt-2">
                dias consecutivos 🔥
              </p>
            </div>
          </div>

          {/* Progresso para próximo Badge */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <p className="text-sm font-medium">Próximo Badge</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {estatisticas.avaliacoesTotal}/{estatisticas.proximoBadgeEm}
              </Badge>
            </div>
            <Progress value={estatisticas.progressoParaBadge} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              Faltam apenas {estatisticas.proximoBadgeEm - estatisticas.avaliacoesTotal} avaliações para o badge <strong>"Avaliador Experiente"</strong> 🏆
            </p>
          </div>

          {/* Mensagem Motivacional Dinâmica */}
          <div className={`${mensagemMotivacional.cor} bg-opacity-10 dark:bg-opacity-20 p-4 rounded-lg border border-current`}>
            <p className="font-medium flex items-center justify-center gap-2">
              <span className="text-2xl">{mensagemMotivacional.emoji}</span>
              <span>{mensagemMotivacional.texto}</span>
            </p>
          </div>

          {/* Botões de Ação Principais */}
          <div className="grid sm:grid-cols-2 gap-3 pt-4">
            <Button
              onClick={() => router.push('/relatorios/meu-estado-emocional')}
              variant="default"
              size="lg"
              className="gap-2 hover:scale-105 transition-transform group"
            >
              <TrendingUp className="h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
              Ver Minha Evolução
            </Button>
            
            <Button
              onClick={() => router.push('/aulas')}
              variant="outline"
              size="lg"
              className="gap-2 hover:scale-105 transition-transform group"
            >
              <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Voltar para Aulas
            </Button>
          </div>

          {/* Ações Secundárias */}
          <div className="grid sm:grid-cols-3 gap-2 pt-2">
            <Button
              onClick={() => router.push('/gamificacao')}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Ver Badges</span>
              <span className="sm:hidden">Badges</span>
            </Button>
            
            <Button
              onClick={() => router.push('/professores')}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Avaliar Professor</span>
              <span className="sm:hidden">Professor</span>
            </Button>
            
            <Button
              onClick={() => router.push('/dashboard')}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Ir ao Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Button>
          </div>

          {/* Dica */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Target className="h-4 w-4" />
              <span>
                <strong>Dica:</strong> Avalie suas aulas regularmente para ter insights mais precisos sobre sua jornada de aprendizado!
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
