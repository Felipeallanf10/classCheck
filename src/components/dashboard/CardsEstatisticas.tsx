'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Heart,
  CheckCircle,
  AlertTriangle,
  Activity,
  Calendar,
  Target,
  Zap,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCard {
  id: string
  title: string
  value: string | number
  previousValue?: number
  change?: number
  changeLabel?: string
  description: string
  icon: React.ElementType
  color: string
  progress?: number
  target?: number
  status: 'up' | 'down' | 'stable' | 'warning' | 'critical'
}

interface CardsEstatisticasProps {
  stats: {
    totalAlunos: number
    totalAulas: number
    mediaHumor: number
    avaliacoesPendentes: number
    tendenciaHumor: number
    presencaMedia: number
    alertasAtivos: number
    ultimaAtualizacao: string
  }
  filtros: {
    periodo: string
    turma: string
    professor: string
    humor: string
    status: string
  }
  loading: boolean
}

export function CardsEstatisticas({ stats, filtros, loading }: CardsEstatisticasProps) {
  // Gerar dados dos cards baseado nas estatísticas
  const cardsData: StatCard[] = [
    {
      id: 'humor-medio',
      title: 'Humor Médio',
      value: stats.mediaHumor.toFixed(1),
      previousValue: 3.8,
      change: ((stats.mediaHumor - 3.8) / 3.8) * 100,
      changeLabel: 'vs mês anterior',
      description: 'Média geral do bem-estar dos alunos',
      icon: Heart,
      color: 'text-pink-600',
      progress: (stats.mediaHumor / 5) * 100,
      target: 4.5,
      status: stats.mediaHumor >= 4 ? 'up' : stats.mediaHumor >= 3.5 ? 'stable' : 'warning'
    },
    {
      id: 'presenca',
      title: 'Taxa de Presença',
      value: `${stats.presencaMedia}%`,
      previousValue: 82.1,
      change: stats.presencaMedia - 82.1,
      changeLabel: 'vs período anterior',
      description: 'Percentual médio de presença nas aulas',
      icon: Users,
      color: 'text-blue-600',
      progress: stats.presencaMedia,
      target: 90,
      status: stats.presencaMedia >= 85 ? 'up' : stats.presencaMedia >= 75 ? 'stable' : 'warning'
    },
    {
      id: 'avaliacoes',
      title: 'Avaliações Realizadas',
      value: stats.totalAulas - stats.avaliacoesPendentes,
      previousValue: 120,
      change: ((stats.totalAulas - stats.avaliacoesPendentes - 120) / 120) * 100,
      changeLabel: 'vs período anterior',
      description: 'Total de aulas já avaliadas pelos alunos',
      icon: CheckCircle,
      color: 'text-green-600',
      progress: ((stats.totalAulas - stats.avaliacoesPendentes) / stats.totalAulas) * 100,
      target: 95,
      status: stats.avaliacoesPendentes <= 5 ? 'up' : stats.avaliacoesPendentes <= 15 ? 'stable' : 'warning'
    },
    {
      id: 'tendencia',
      title: 'Tendência de Humor',
      value: `+${stats.tendenciaHumor.toFixed(1)}%`,
      previousValue: 8.2,
      change: stats.tendenciaHumor - 8.2,
      changeLabel: 'variação semanal',
      description: 'Evolução do humor nas últimas semanas',
      icon: TrendingUp,
      color: 'text-emerald-600',
      progress: Math.min(stats.tendenciaHumor * 5, 100),
      status: stats.tendenciaHumor > 10 ? 'up' : stats.tendenciaHumor > 0 ? 'stable' : 'down'
    },
    {
      id: 'alertas',
      title: 'Alertas Ativos',
      value: stats.alertasAtivos,
      previousValue: 5,
      change: stats.alertasAtivos - 5,
      changeLabel: 'vs semana anterior',
      description: 'Situações que requerem atenção',
      icon: AlertTriangle,
      color: 'text-orange-600',
      status: stats.alertasAtivos === 0 ? 'up' : stats.alertasAtivos <= 3 ? 'stable' : 'critical'
    },
    {
      id: 'performance',
      title: 'Performance Geral',
      value: '8.4',
      previousValue: 7.9,
      change: ((8.4 - 7.9) / 7.9) * 100,
      changeLabel: 'índice composto',
      description: 'Score geral baseado em múltiplas métricas',
      icon: Award,
      color: 'text-purple-600',
      progress: 84,
      target: 90,
      status: 'up'
    }
  ]

  const getStatusColor = (status: StatCard['status']) => {
    switch (status) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      case 'stable': return 'text-blue-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-700'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: StatCard['status']) => {
    switch (status) {
      case 'up': return <TrendingUp className="h-4 w-4" />
      case 'down': return <TrendingDown className="h-4 w-4" />
      case 'stable': return <Activity className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const formatChange = (change: number | undefined) => {
    if (!change) return null
    const sign = change > 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardsData.map((card) => {
        const Icon = card.icon
        const statusColor = getStatusColor(card.status)
        const StatusIcon = getStatusIcon(card.status)

        return (
          <Card
            key={card.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
              card.status === 'critical' && "border-red-200 bg-red-50/50"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={cn("h-5 w-5", card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Valor Principal */}
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{card.value}</span>
                  {card.change !== undefined && (
                    <div className={cn("flex items-center gap-1", statusColor)}>
                      {StatusIcon}
                      <span className="text-xs font-medium">
                        {formatChange(card.change)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Descrição */}
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>

                {/* Barra de Progresso */}
                {card.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progresso</span>
                      {card.target && (
                        <span className="text-muted-foreground">
                          Meta: {card.target}
                        </span>
                      )}
                    </div>
                    <Progress 
                      value={card.progress} 
                      className="h-2"
                    />
                  </div>
                )}

                {/* Badge de Status */}
                {card.changeLabel && (
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", statusColor)}
                  >
                    {card.changeLabel}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
