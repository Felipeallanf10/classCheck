'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { RelatorioPageSkeleton } from '@/components/ui/loading-states'
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Lightbulb, 
  TrendingUp,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Users,
  Target,
  Sparkles
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'

interface AvaliacaoDidatica {
  id: number
  usuarioId: number
  usuario: {
    nome: string
    avatar?: string
  }
  compreensaoConteudo: number
  ritmoAula: number
  recursosDidaticos: number
  engajamento: number
  pontoPositivo?: string
  pontoMelhoria?: string
  sugestao?: string
  createdAt: string
}

interface DadosRelatorio {
  aula: {
    titulo: string
    disciplina: string
    professor: string
    dataHora: string
    sala: string
  }
  totalAvaliacoes: number
  estatisticas: {
    compreensaoMedia: number
    ritmoMedia: number
    recursosMedia: number
    engajamentoMedia: number
    mediaGeral: number
    distribuicaoRitmo: {
      muitoLento: number
      lento: number
      adequado: number
      rapido: number
      muitoRapido: number
    }
    pontosFortesFrequentes: Array<{ texto: string; count: number }>
    sugestoesFrequentes: Array<{ texto: string; count: number }>
  }
  avaliacoes: AvaliacaoDidatica[]
}

export default function RelatorioDidaticoTurmaPage() {
  const params = useParams()
  const router = useRouter()
  const aulaId = params.aulaId as string

  const [loading, setLoading] = useState(true)
  const [dados, setDados] = useState<DadosRelatorio | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Mock data (em produção viria de API)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        const mockData: DadosRelatorio = {
          aula: {
            titulo: 'Geografia - Continentes e Oceanos',
            disciplina: 'Geografia',
            professor: 'Prof. Ana Costa',
            dataHora: '2025-10-13T14:30:00',
            sala: 'Sala 201'
          },
          totalAvaliacoes: 28,
          estatisticas: {
            compreensaoMedia: 4.3,
            ritmoMedia: 4.1,
            recursosMedia: 4.5,
            engajamentoMedia: 4.2,
            mediaGeral: 4.28,
            distribuicaoRitmo: {
              muitoLento: 1,
              lento: 3,
              adequado: 22,
              rapido: 2,
              muitoRapido: 0
            },
            pontosFortesFrequentes: [
              { texto: 'Mapas e recursos visuais muito úteis', count: 12 },
              { texto: 'Explicação clara e objetiva', count: 8 },
              { texto: 'Exemplos práticos ajudaram muito', count: 6 },
              { texto: 'Aula dinâmica e interessante', count: 5 }
            ],
            sugestoesFrequentes: [
              { texto: 'Mais tempo para perguntas', count: 5 },
              { texto: 'Mais exercícios práticos', count: 4 },
              { texto: 'Poderia usar mais vídeos', count: 3 }
            ]
          },
          avaliacoes: Array.from({ length: 28 }, (_, i) => ({
            id: i + 1,
            usuarioId: i + 1,
            usuario: {
              nome: `Aluno ${i + 1}`,
              avatar: undefined
            },
            compreensaoConteudo: Math.floor(Math.random() * 2) + 4, // 4-5
            ritmoAula: Math.floor(Math.random() * 2) + 4,
            recursosDidaticos: Math.floor(Math.random() * 2) + 4,
            engajamento: Math.floor(Math.random() * 2) + 3,
            pontoPositivo: i % 3 === 0 ? 'Aula muito boa!' : undefined,
            pontoMelhoria: i % 5 === 0 ? 'Poderia ter mais tempo para perguntas' : undefined,
            sugestao: i % 4 === 0 ? 'Usar mais recursos visuais' : undefined,
            createdAt: new Date().toISOString()
          }))
        }
        
        setDados(mockData)
      } catch (err) {
        setError('Erro ao carregar dados. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [aulaId])

  // Preparar dados para gráficos
  const dadosGraficoBarras = useMemo(() => {
    if (!dados) return []
    return [
      { nome: 'Compreensão', valor: dados.estatisticas.compreensaoMedia, cor: '#3b82f6' },
      { nome: 'Ritmo', valor: dados.estatisticas.ritmoMedia, cor: '#8b5cf6' },
      { nome: 'Recursos', valor: dados.estatisticas.recursosMedia, cor: '#10b981' },
      { nome: 'Engajamento', valor: dados.estatisticas.engajamentoMedia, cor: '#f59e0b' }
    ]
  }, [dados])

  const dadosGraficoPizza = useMemo(() => {
    if (!dados) return []
    const dist = dados.estatisticas.distribuicaoRitmo
    return [
      { nome: 'Muito Lento', valor: dist.muitoLento, cor: '#dc2626' },
      { nome: 'Lento', valor: dist.lento, cor: '#f59e0b' },
      { nome: 'Adequado', valor: dist.adequado, cor: '#10b981' },
      { nome: 'Rápido', valor: dist.rapido, cor: '#f59e0b' },
      { nome: 'Muito Rápido', valor: dist.muitoRapido, cor: '#dc2626' }
    ].filter(item => item.valor > 0)
  }, [dados])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Breadcrumbs items={[
          { label: "Relatórios", href: "/relatorios" },
          { label: "Turma", href: `/relatorios/turma/aula/${aulaId}`},
          { label: "Avaliação Didática"}
        ]} />
        <RelatorioPageSkeleton />
      </div>
    )
  }

  if (error || !dados) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Breadcrumbs items={[
          { label: "Relatórios", href: "/relatorios" },
          { label: "Turma", href: `/relatorios/turma/aula/${aulaId}`},
          { label: "Avaliação Didática"}
        ]} />
        <Alert variant="destructive" className="max-w-md mt-4">
          <AlertDescription>{error || 'Erro desconhecido'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Interpretar nota média
  const interpretarNota = (nota: number) => {
    if (nota >= 4.5) return { texto: 'Excelente', cor: 'text-green-600', emoji: '🌟' }
    if (nota >= 4.0) return { texto: 'Muito Bom', cor: 'text-blue-600', emoji: '👍' }
    if (nota >= 3.5) return { texto: 'Bom', cor: 'text-yellow-600', emoji: '👌' }
    if (nota >= 3.0) return { texto: 'Regular', cor: 'text-orange-600', emoji: '⚠️' }
    return { texto: 'Precisa Melhorar', cor: 'text-red-600', emoji: '⚠️' }
  }

  const avaliacaoGeral = interpretarNota(dados.estatisticas.mediaGeral)

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Relatórios", href: "/relatorios" },
        { label: "Turma", href: `/relatorios/turma/aula/${aulaId}`},
        { label: "Avaliação Didática"}
      ]} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold">{dados.aula.titulo}</h1>
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {dados.totalAvaliacoes} avaliações
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {dados.aula.disciplina}
              </span>
              <span>•</span>
              <span>{dados.aula.professor}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(dados.aula.dataHora).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm">
          📥 Exportar PDF
        </Button>
      </div>

      {/* Card de Avaliação Geral */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl">{avaliacaoGeral.emoji}</span>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Avaliação Geral</p>
                <p className={`text-3xl font-bold ${avaliacaoGeral.cor}`}>
                  {dados.estatisticas.mediaGeral.toFixed(2)}
                </p>
                <p className="text-sm font-medium">{avaliacaoGeral.texto}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-1 pt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= Math.round(dados.estatisticas.mediaGeral)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="metricas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metricas">
            <Target className="h-4 w-4 mr-2" />
            Métricas
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageSquare className="h-4 w-4 mr-2" />
            Feedback
          </TabsTrigger>
          <TabsTrigger value="detalhes">
            <Users className="h-4 w-4 mr-2" />
            Detalhes
          </TabsTrigger>
        </TabsList>

        {/* Tab: Métricas */}
        <TabsContent value="metricas" className="space-y-6">
          {/* Cards de Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dadosGraficoBarras.map((item) => (
              <Card key={item.nome}>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">{item.nome}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold" style={{ color: item.cor }}>
                      {item.valor.toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">/5.0</p>
                  </div>
                  <Progress 
                    value={(item.valor / 5) * 100} 
                    className="h-2 mt-2"
                    style={{ 
                      // @ts-ignore
                      '--progress-background': item.cor 
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico de Barras */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Comparação de Critérios
              </CardTitle>
              <CardDescription>
                Média de avaliação por critério didático
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGraficoBarras}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="nome" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    formatter={(value: any) => [`${value.toFixed(2)}/5.0`, 'Nota']}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                    {dadosGraficoBarras.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição do Ritmo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Percepção do Ritmo da Aula
              </CardTitle>
              <CardDescription>
                Como os alunos avaliaram a velocidade da aula
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={dadosGraficoPizza}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.nome}: ${entry.valor}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {dadosGraficoPizza.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  <h4 className="font-semibold mb-3">Distribuição</h4>
                  {dadosGraficoPizza.map((item) => (
                    <div key={item.nome} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.cor }}
                        />
                        <span className="text-sm">{item.nome}</span>
                      </div>
                      <Badge variant="secondary">
                        {item.valor} ({((item.valor / dados.totalAvaliacoes) * 100).toFixed(0)}%)
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interpretação */}
              <Alert className="mt-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <Sparkles className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-300">
                  <strong>Análise:</strong> {
                    ((dados.estatisticas.distribuicaoRitmo.adequado / dados.totalAvaliacoes) * 100).toFixed(0)
                  }% dos alunos consideraram o ritmo adequado. Excelente equilíbrio! Continue mantendo essa velocidade.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Feedback */}
        <TabsContent value="feedback" className="space-y-6">
          {/* Pontos Fortes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <ThumbsUp className="h-5 w-5" />
                Pontos Fortes Destacados
              </CardTitle>
              <CardDescription>
                O que os alunos mais gostaram na aula
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dados.estatisticas.pontosFortesFrequentes.map((ponto, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                >
                  <Badge variant="secondary" className="shrink-0">
                    {ponto.count}x
                  </Badge>
                  <p className="text-sm flex-1">{ponto.texto}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sugestões de Melhoria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Lightbulb className="h-5 w-5" />
                Sugestões de Melhoria
              </CardTitle>
              <CardDescription>
                Oportunidades de aprimoramento identificadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dados.estatisticas.sugestoesFrequentes.map((sugestao, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                >
                  <Badge variant="outline" className="shrink-0">
                    {sugestao.count}x
                  </Badge>
                  <p className="text-sm flex-1">{sugestao.texto}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Detalhes */}
        <TabsContent value="detalhes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações Individuais</CardTitle>
              <CardDescription>
                Detalhamento de todas as {dados.totalAvaliacoes} avaliações recebidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {dados.avaliacoes.map((av, index) => (
                <div 
                  key={av.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm">{av.usuario.nome}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {((av.compreensaoConteudo + av.ritmoAula + av.recursosDidaticos + av.engajamento) / 4).toFixed(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Compreensão:</span>
                      <span className="ml-1 font-medium">{av.compreensaoConteudo}/5</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ritmo:</span>
                      <span className="ml-1 font-medium">{av.ritmoAula}/5</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recursos:</span>
                      <span className="ml-1 font-medium">{av.recursosDidaticos}/5</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Engajamento:</span>
                      <span className="ml-1 font-medium">{av.engajamento}/5</span>
                    </div>
                  </div>

                  {(av.pontoPositivo || av.pontoMelhoria || av.sugestao) && (
                    <div className="mt-3 pt-3 border-t space-y-2 text-xs">
                      {av.pontoPositivo && (
                        <div className="flex gap-2">
                          <ThumbsUp className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
                          <p className="text-muted-foreground">{av.pontoPositivo}</p>
                        </div>
                      )}
                      {av.pontoMelhoria && (
                        <div className="flex gap-2">
                          <ThumbsDown className="h-3 w-3 text-orange-600 shrink-0 mt-0.5" />
                          <p className="text-muted-foreground">{av.pontoMelhoria}</p>
                        </div>
                      )}
                      {av.sugestao && (
                        <div className="flex gap-2">
                          <Lightbulb className="h-3 w-3 text-blue-600 shrink-0 mt-0.5" />
                          <p className="text-muted-foreground">{av.sugestao}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
