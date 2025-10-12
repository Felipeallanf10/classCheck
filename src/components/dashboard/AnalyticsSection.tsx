'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Bell,
  Filter,
  RefreshCw,
  TrendingUp,
  Activity,
  AlertCircle,
  BarChart3,
  Users,
  BookOpen
} from 'lucide-react'

import { CardsEstatisticas } from './CardsEstatisticas'
import { FiltrosAvancados } from './FiltrosAvancados'
import DashboardProfessor from './DashboardProfessor'
import { cn } from '@/lib/utils'

interface DashboardStats {
  totalAlunos: number
  totalAulas: number
  mediaHumor: number
  avaliacoesPendentes: number
  tendenciaHumor: number
  presencaMedia: number
  alertasAtivos: number
  ultimaAtualizacao: string
}

interface FilterState {
  periodo: string
  turma: string
  professor: string
  humor: string
  status: string
}

export function AnalyticsSection() {
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalAlunos: 0,
    totalAulas: 0,
    mediaHumor: 0,
    avaliacoesPendentes: 0,
    tendenciaHumor: 0,
    presencaMedia: 0,
    alertasAtivos: 0,
    ultimaAtualizacao: ''
  })
  const [filtros, setFiltros] = useState<FilterState>({
    periodo: 'ultimos-30-dias',
    turma: 'todas',
    professor: 'todos',
    humor: 'todos',
    status: 'todos'
  })

  // Simular carregamento de dados
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalAlunos: 342,
          totalAulas: 156,
          mediaHumor: 4.2,
          avaliacoesPendentes: 23,
          tendenciaHumor: 12.5,
          presencaMedia: 87.3,
          alertasAtivos: 3,
          ultimaAtualizacao: new Date().toLocaleString('pt-BR')
        })
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [filtros])

  const atualizarDados = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setStats(prev => ({
      ...prev,
      ultimaAtualizacao: new Date().toLocaleString('pt-BR')
    }))
    setLoading(false)
  }

  const aplicarFiltros = (novosFiltros: Partial<FilterState>) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }))
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Sidebar de Filtros - Mobile: Colapsável, Desktop: Lateral */}
      <div
        className={cn(
          "bg-card border-b lg:border-r lg:border-b-0 transition-all duration-300 ease-in-out",
          "lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto",
          filtrosAbertos ? "max-h-96 lg:max-h-none lg:w-80" : "max-h-0 lg:max-h-none lg:w-0 overflow-hidden"
        )}
      >
        <div className="p-4 border-b hidden lg:block">
          <h3 className="font-semibold text-lg">Filtros Avançados</h3>
        </div>
        <div className="p-4">
          <details className="block lg:hidden mb-4">
            <summary className="cursor-pointer text-sm font-medium mb-3">Filtros Avançados</summary>
            <FiltrosAvancados 
              filtros={filtros}
              onFiltrosChange={aplicarFiltros}
              loading={loading}
            />
          </details>
          <div className="hidden lg:block">
            <FiltrosAvancados 
              filtros={filtros}
              onFiltrosChange={aplicarFiltros}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltrosAbertos(!filtrosAbertos)}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ml-2 hidden sm:inline">Notificações</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={atualizarDados}
                disabled={loading}
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                <span className="sr-only sm:not-sr-only sm:ml-2 hidden sm:inline">Atualizar</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Conteúdo Scrollável */}
        <div className="flex-1 overflow-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          <CardsEstatisticas 
            stats={stats}
            filtros={filtros}
            loading={loading}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate text-xs sm:text-sm">Tendências de Humor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Esta semana</span>
                    <span className="text-lg sm:text-xl font-bold text-green-600">+{stats.tendenciaHumor}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Melhoria no humor geral
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate text-xs sm:text-sm">Alertas Ativos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Requer atenção</span>
                    <span className="text-lg sm:text-xl font-bold text-orange-600">{stats.alertasAtivos}</span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Alunos com humor baixo
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px] lg:min-w-0">
              <DashboardProfessor />
            </div>
          </div>

          {/* Aviso para mobile sobre dashboard da turma */}
          <Card className="sm:hidden">
            <CardContent className="p-4 text-center">
              <div className="space-y-3">
                <div className="bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Users className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="font-medium text-sm">Dashboard da Turma</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  O dashboard detalhado da turma está disponível em telas maiores para melhor visualização dos dados.
                </p>
                <Button variant="outline" size="sm" className="text-xs">
                  Ver em Desktop
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}