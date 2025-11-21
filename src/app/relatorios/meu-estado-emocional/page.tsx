'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { RelatorioPageSkeleton } from '@/components/ui/loading-states'
import { 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  AlertCircle,
  Download,
  Brain,
  Heart
} from 'lucide-react'
import GraficoLinhaTemporalEmocional from '@/components/relatorios/GraficoLinhaTemporalEmocional'
import MapaEmocionalCircumplex from '@/components/relatorios/MapaEmocionalCircumplex'
import AnalisePorMateria from '@/components/relatorios/AnalisePorMateria'

interface AvaliacaoSocioemocional {
  id: number
  valencia: number
  ativacao: number
  estadoPrimario: string
  confianca: number
  createdAt: string
  aula: {
    id: number
    titulo: string
    materia: string
    dataHora: string
  }
}

export default function MeuEstadoEmocionalPage() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoSocioemocional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAvaliacoes() {
      try {
        // Buscar avaliações do usuário atual (API detecta automaticamente)
        const response = await fetch('/api/avaliacoes/socioemocionais/minhas')
        
        if (!response.ok) throw new Error('Erro ao carregar avaliações')
        
        const data = await response.json()
        setAvaliacoes(data)
      } catch (err) {
        setError('Não foi possível carregar suas avaliações')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAvaliacoes()
  }, [])

  // Calcular estatísticas
  const calcularEstatisticas = () => {
    if (avaliacoes.length === 0) return null

    const totalAvaliacoes = avaliacoes.length
    const valenciaMedia = avaliacoes.reduce((sum, av) => sum + av.valencia, 0) / totalAvaliacoes
    const ativacaoMedia = avaliacoes.reduce((sum, av) => sum + av.ativacao, 0) / totalAvaliacoes
    
    // Contar estados primários
    const estados = avaliacoes.reduce((acc, av) => {
      acc[av.estadoPrimario] = (acc[av.estadoPrimario] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const estadoMaisFrequente = Object.entries(estados)
      .sort(([,a], [,b]) => b - a)[0]

    // Agrupar por matéria
    const porMateria = avaliacoes.reduce((acc, av) => {
      const materia = av.aula.materia
      if (!acc[materia]) {
        acc[materia] = { total: 0, valenciaSum: 0, ativacaoSum: 0 }
      }
      acc[materia].total++
      acc[materia].valenciaSum += av.valencia
      acc[materia].ativacaoSum += av.ativacao
      return acc
    }, {} as Record<string, { total: number, valenciaSum: number, ativacaoSum: number }>)

    return {
      totalAvaliacoes,
      valenciaMedia,
      ativacaoMedia,
      estadoMaisFrequente,
      porMateria
    }
  }

  const stats = calcularEstatisticas()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Relatórios", href: "/relatorios" },
          { label: "Minha Jornada Emocional"}
        ]} />
        <RelatorioPageSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Relatórios", href: "/relatorios" },
          { label: "Minha Jornada Emocional"}
        ]} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!stats || avaliacoes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Relatórios", href: "/relatorios" },
          { label: "Minha Jornada Emocional"}
        ]} />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6" />
              Minha Jornada Emocional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ainda não há avaliações</h3>
              <p className="text-muted-foreground mb-6">
                Comece a avaliar suas aulas para acompanhar sua jornada emocional!
              </p>
              <Button onClick={() => window.location.href = '/aulas'}>
                <BookOpen className="h-4 w-4 mr-2" />
                Ver Aulas Disponíveis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Relatórios", href: "/relatorios" },
        { label: "Minha Jornada Emocional"}
      ]} />

      {/* Header */}
      <div className="mb-8 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary" />
              Minha Jornada Emocional
            </h1>
            <p className="text-muted-foreground">
              Acompanhe sua evolução socioemocional ao longo das aulas
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAvaliacoes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Calendar className="h-3 w-3 inline mr-1" />
              Aulas avaliadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valência Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.valenciaMedia > 0 ? '+' : ''}
              {stats.valenciaMedia.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.valenciaMedia > 0.3 ? '😊 Positivo' : stats.valenciaMedia < -0.3 ? '😢 Negativo' : '😐 Neutro'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ativação Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.ativacaoMedia > 0 ? '+' : ''}
              {stats.ativacaoMedia.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.ativacaoMedia > 0.3 ? '⚡ Energizado' : stats.ativacaoMedia < -0.3 ? '😴 Calmo' : '🎯 Equilibrado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estado Mais Frequente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.estadoMaisFrequente[0]}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.estadoMaisFrequente[1]} vezes ({Math.round((stats.estadoMaisFrequente[1] / stats.totalAvaliacoes) * 100)}%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com visualizações */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Linha do Tempo
          </TabsTrigger>
          <TabsTrigger value="materias">
            <BookOpen className="h-4 w-4 mr-2" />
            Por Matéria
          </TabsTrigger>
          <TabsTrigger value="circumplex">
            <Brain className="h-4 w-4 mr-2" />
            Mapa Emocional
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <GraficoLinhaTemporalEmocional avaliacoes={avaliacoes} />
        </TabsContent>

        <TabsContent value="materias" className="space-y-4">
          <AnalisePorMateria avaliacoes={avaliacoes} />
        </TabsContent>

        <TabsContent value="circumplex" className="space-y-4">
          <MapaEmocionalCircumplex avaliacoes={avaliacoes} />
        </TabsContent>
      </Tabs>

      {/* Histórico detalhado */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Histórico Detalhado</CardTitle>
          <CardDescription>
            Todas as suas avaliações socioemocionais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {avaliacoes.slice(0, 10).map((av) => (
              <div key={av.id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex-1">
                  <h4 className="font-semibold">{av.aula.titulo}</h4>
                  <p className="text-sm text-muted-foreground">
                    {av.aula.materia} • {new Date(av.aula.dataHora).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{av.estadoPrimario}</Badge>
                  <div className="text-right">
                    <div className="text-sm">
                      <span className="text-muted-foreground">V:</span> {av.valencia.toFixed(2)}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">A:</span> {av.ativacao.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
