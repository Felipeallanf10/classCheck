'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  Search,
  Bell,
  Filter,
  RefreshCw,
  Calendar,
  Users,
  BookOpen,
  TrendingUp,
  Activity,
  AlertCircle
} from 'lucide-react'

import { CardsEstatisticas } from './CardsEstatisticas'
import { FiltrosAvancados } from './FiltrosAvancados'
import DashboardProfessor from './DashboardProfessor'
import { CalendarioEventos } from './CalendarioEventos'
import { GeradorPDF } from './GeradorPDF'
import { SistemaExportacao } from './SistemaExportacao'
import { WidgetManager } from './WidgetManager'
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

export function DashboardUnificado() {
  const [activeTab, setActiveTab] = useState('visao-geral')
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
        // Simular chamada API
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
    <div className="flex h-screen bg-background">
      {/* Sidebar de Filtros */}
      <div
        className={cn(
          "bg-card border-r transition-all duration-300 ease-in-out",
          filtrosAbertos ? "w-80" : "w-0 overflow-hidden"
        )}
      >
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Filtros Avançados</h3>
        </div>
        <div className="p-4">
          <FiltrosAvancados 
            filtros={filtros}
            onFiltrosChange={aplicarFiltros}
            loading={loading}
          />
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Dashboard ClassCheck</h1>
              <Badge variant="outline" className="text-xs">
                Atualizado em {stats.ultimaAtualizacao}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Busca Global */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar... (Ctrl+K)"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Botões de Ação */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltrosAbertos(!filtrosAbertos)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={atualizarDados}
                disabled={loading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                Atualizar
              </Button>

              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alertas
                {stats.alertasAtivos > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {stats.alertasAtivos}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="bg-card border-b px-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="visao-geral" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="analises" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Análises
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="calendario" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendário
              </TabsTrigger>
              <TabsTrigger value="widgets" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Widgets
              </TabsTrigger>
              <TabsTrigger value="configuracoes" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Conteúdo das Tabs */}
          <div className="flex-1 overflow-auto">
            {/* Visão Geral */}
            <TabsContent value="visao-geral" className="p-6 space-y-6">
              <CardsEstatisticas 
                stats={stats}
                filtros={filtros}
                loading={loading}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Resumo Rápido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total de Alunos</span>
                        <span className="font-semibold">{stats.totalAlunos}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Aulas Realizadas</span>
                        <span className="font-semibold">{stats.totalAulas}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Média de Humor</span>
                        <span className="font-semibold text-green-600">{stats.mediaHumor}/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Presença Média</span>
                        <span className="font-semibold">{stats.presencaMedia}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Alertas & Ações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.alertasAtivos > 0 ? (
                        <>
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-medium">Avaliações Pendentes</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {stats.avaliacoesPendentes} avaliações aguardando análise
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Nenhum alerta no momento 🎉
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Análises */}
            <TabsContent value="analises" className="p-6">
              <Suspense fallback={<div>Carregando análises...</div>}>
                <DashboardProfessor />
              </Suspense>
            </TabsContent>

            {/* Relatórios */}
            <TabsContent value="relatorios" className="p-6">
              <div className="grid gap-6">
                <GeradorPDF />
                <SistemaExportacao />
              </div>
            </TabsContent>

            {/* Calendário */}
            <TabsContent value="calendario" className="p-6">
              <CalendarioEventos />
            </TabsContent>

            {/* Widgets */}
            <TabsContent value="widgets" className="p-6">
              <WidgetManager />
            </TabsContent>

            {/* Configurações */}
            <TabsContent value="configuracoes" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configurações avançadas em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
