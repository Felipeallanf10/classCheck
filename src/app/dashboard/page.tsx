'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DashboardProfessor } from '@/components/dashboard'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Calendar, 
  Users, 
  BarChart3,
  CheckCircle,
  Star,
  Trophy,
  Heart,
  AlertCircle,
  Activity
} from 'lucide-react'

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'tradicional' | 'integrado'>('integrado')

  const getButtonVariant = (targetMode: 'tradicional' | 'integrado') => {
    return viewMode === targetMode ? 'default' : 'outline'
  }

  if (viewMode === 'tradicional') {
    return <DashboardProfessor />
  }

  const dadosDashboard = {
    usuario: {
      nome: 'Professor Silva',
      turma: '8º Ano B', 
      totalAlunos: 32
    },
    resumoEmocional: {
      estadoDominante: 'Focado',
      tendencia: 'Estável',
      participacao: 87,
      alertas: 2
    },
    gamificacao: {
      pontos: 1250,
      nivel: 15,
      conquistasRecentes: ['Mentor Dedicado', 'Analista Expert'],
      proximaMeta: 'Mestre da Empatia'
    }
  }

  const atividades = [
    {
      id: 1,
      tipo: 'avaliacao',
      titulo: 'Avaliação Socioemocional - Maria Silva',
      subtitulo: 'Estado: Ansioso | Confiança: 85%',
      tempo: 'há 5 min',
      prioridade: 'alta',
      icon: Brain
    },
    {
      id: 2,
      tipo: 'conquista',
      titulo: 'Nova Conquista Desbloqueada!',
      subtitulo: 'Badge: Observador Atento',
      tempo: 'há 12 min',
      prioridade: 'media',
      icon: Trophy
    }
  ]

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'border-l-red-500 bg-red-50'
      case 'media': return 'border-l-yellow-500 bg-yellow-50'
      case 'baixa': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* Toggle de Visualização */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard ClassCheck</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {dadosDashboard.usuario.nome} | {dadosDashboard.usuario.turma}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={getButtonVariant('integrado') as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined}
            onClick={() => setViewMode('integrado')}
          >
            Integrado
          </Button>
          <Button 
            variant={getButtonVariant('tradicional') as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined}
            onClick={() => setViewMode('tradicional')}
          >
            Tradicional
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado Emocional</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dadosDashboard.resumoEmocional.estadoDominante}</div>
            <p className="text-xs text-muted-foreground">
              Tendência: {dadosDashboard.resumoEmocional.tendencia}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participação</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dadosDashboard.resumoEmocional.participacao}%</div>
            <Progress value={dadosDashboard.resumoEmocional.participacao} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gamificação</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Nível {dadosDashboard.gamificacao.nivel}</div>
            <p className="text-xs text-muted-foreground">
              {dadosDashboard.gamificacao.pontos} pontos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dadosDashboard.resumoEmocional.alertas}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas atualizações do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {atividades.map((atividade) => {
              const IconComponent = atividade.icon
              return (
                <div 
                  key={atividade.id} 
                  className={`p-4 border-l-4 rounded-lg ${getPrioridadeColor(atividade.prioridade)}`}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">{atividade.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{atividade.subtitulo}</p>
                      <p className="text-xs text-muted-foreground mt-1">{atividade.tempo}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Brain className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2">Novo Questionário</h3>
              <p className="text-sm text-muted-foreground">Iniciar avaliação socioemocional</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-2">Gerar Relatório</h3>
              <p className="text-sm text-muted-foreground">Criar relatório personalizado</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
              <h3 className="font-semibold mb-2">Gamificação</h3>
              <p className="text-sm text-muted-foreground">Ver conquistas e missões</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
