'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { RelatorioPageSkeleton } from '@/components/ui/loading-states'
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  MessageSquare,
  BarChart3,
  Award,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from 'recharts'

interface Professor {
  id: number
  nome: string
  disciplina: string
  departamento: string
  avatar?: string
}

interface AvaliacaoProfessor {
  periodo: string
  totalAvaliacoes: number
  mediaGeral: number
  criterios: {
    dominioConteudo: number
    clarezaExplicacao: number
    pontualidade: number
    organizacao: number
    acessibilidade: number
    empatia: number
  }
  comentarios: Array<{
    texto: string
    sentimento: 'positivo' | 'neutro' | 'negativo'
  }>
}

interface DadosRelatorio {
  professor: Professor
  avaliacaoAtual: AvaliacaoProfessor
  historico: Array<{
    periodo: string
    mediaGeral: number
  }>
  comparacao: {
    mediaDepartamento: number
    mediaEscola: number
  }
  estatisticas: {
    totalAvaliacoesAno: number
    sentimentoGeral: {
      positivo: number
      neutro: number
      negativo: number
    }
    tendencia: 'subindo' | 'estavel' | 'descendo'
    variacaoUltimoMes: number
  }
}

export default function RelatorioProfessorPage() {
  const params = useParams()
  const router = useRouter()
  const professorId = params.id as string

  const [dados, setDados] = useState<DadosRelatorio | null>(null)
  const [loading, setLoading] = useState(true)
  const [periodoSelecionado, setPeriodoSelecionado] = useState('atual')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        const mockData: DadosRelatorio = {
          professor: {
            id: Number(professorId),
            nome: 'Prof. Ana Costa',
            disciplina: 'Geografia',
            departamento: 'Ciências Humanas',
            avatar: undefined
          },
          avaliacaoAtual: {
            periodo: '2025-10',
            totalAvaliacoes: 28,
            mediaGeral: 4.7,
            criterios: {
              dominioConteudo: 4.8,
              clarezaExplicacao: 4.6,
              pontualidade: 4.9,
              organizacao: 4.7,
              acessibilidade: 4.4,
              empatia: 4.8
            },
            comentarios: [
              { texto: 'Melhor professora! Explica com exemplos reais', sentimento: 'positivo' },
              { texto: 'Super organizada, sempre pontual', sentimento: 'positivo' },
              { texto: 'Usa recursos visuais que facilitam o aprendizado', sentimento: 'positivo' },
              { texto: 'Poderia dar mais tempo para perguntas', sentimento: 'neutro' },
              { texto: 'Às vezes vai rápido demais nos conceitos difíceis', sentimento: 'negativo' },
              { texto: 'Muito atenciosa com dúvidas', sentimento: 'positivo' },
              { texto: 'As aulas são dinâmicas e interessantes', sentimento: 'positivo' }
            ]
          },
          historico: [
            { periodo: 'Ago', mediaGeral: 4.2 },
            { periodo: 'Set', mediaGeral: 4.4 },
            { periodo: 'Out', mediaGeral: 4.7 }
          ],
          comparacao: {
            mediaDepartamento: 4.3,
            mediaEscola: 4.1
          },
          estatisticas: {
            totalAvaliacoesAno: 245,
            sentimentoGeral: {
              positivo: 89,
              neutro: 8,
              negativo: 3
            },
            tendencia: 'subindo',
            variacaoUltimoMes: 0.3
          }
        }
        
        setDados(mockData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [professorId])

  // Preparar dados para gráficos
  const dadosRadar = useMemo(() => {
    if (!dados) return []
    const crit = dados.avaliacaoAtual.criterios
    return [
      { criterio: 'Domínio', valor: crit.dominioConteudo, fullMark: 5 },
      { criterio: 'Clareza', valor: crit.clarezaExplicacao, fullMark: 5 },
      { criterio: 'Pontualidade', valor: crit.pontualidade, fullMark: 5 },
      { criterio: 'Organização', valor: crit.organizacao, fullMark: 5 },
      { criterio: 'Acessibilidade', valor: crit.acessibilidade, fullMark: 5 },
      { criterio: 'Empatia', valor: crit.empatia, fullMark: 5 }
    ]
  }, [dados])

  const dadosComparacao = useMemo(() => {
    if (!dados) return []
    return [
      { nome: dados.professor.nome, valor: dados.avaliacaoAtual.mediaGeral },
      { nome: 'Média Dept.', valor: dados.comparacao.mediaDepartamento },
      { nome: 'Média Escola', valor: dados.comparacao.mediaEscola }
    ]
  }, [dados])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Breadcrumbs items={[
          { label: "Relatórios", href: "/relatorios" },
          { label: "Professores", href: "/professores"},
          { label: "Avaliação do Professor"}
        ]} />
        <RelatorioPageSkeleton />
      </div>
    )
  }

  if (!dados) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Breadcrumbs items={[
          { label: "Relatórios", href: "/relatorios" },
          { label: "Professores", href: "/professores"},
          { label: "Avaliação do Professor"}
        ]} />
        <Alert variant="destructive" className="max-w-md mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Erro ao carregar relatório. Tente novamente.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const TendenciaIcon = 
    dados.estatisticas.tendencia === 'subindo' ? TrendingUp :
    dados.estatisticas.tendencia === 'descendo' ? TrendingDown : Minus

  const tendenciaColor = 
    dados.estatisticas.tendencia === 'subindo' ? 'text-green-600' :
    dados.estatisticas.tendencia === 'descendo' ? 'text-red-600' : 'text-gray-600'

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Relatórios", href: "/relatorios" },
        { label: "Professores", href: "/professores"},
        { label: dados.professor.nome}
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
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold">Avaliação do Professor</h1>
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {dados.avaliacaoAtual.totalAvaliacoes} avaliações
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{dados.professor.nome}</span>
              <span>•</span>
              <span>{dados.professor.disciplina}</span>
              <span>•</span>
              <span>{dados.professor.departamento}</span>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm">
          📥 Exportar PDF
        </Button>
      </div>

      {/* Card de Nota Geral */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Nota Principal */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Nota Geral</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-primary">
                  {dados.avaliacaoAtual.mediaGeral.toFixed(1)}
                </span>
                <span className="text-2xl text-muted-foreground">/5.0</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= Math.round(dados.avaliacaoAtual.mediaGeral)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Outubro 2025</p>
            </div>

            {/* Tendência */}
            <div className="text-center border-l border-r px-6">
              <p className="text-sm text-muted-foreground mb-2">Tendência</p>
              <div className={`flex items-center justify-center gap-2 mb-2 ${tendenciaColor}`}>
                <TendenciaIcon className="h-8 w-8" />
                <span className="text-3xl font-bold">
                  {dados.estatisticas.variacaoUltimoMes > 0 ? '+' : ''}
                  {dados.estatisticas.variacaoUltimoMes.toFixed(1)}
                </span>
              </div>
              <p className="text-sm font-medium">
                {dados.estatisticas.tendencia === 'subindo' ? 'Em alta!' :
                 dados.estatisticas.tendencia === 'descendo' ? 'Em queda' : 'Estável'}
              </p>
              <p className="text-xs text-muted-foreground">vs. mês anterior</p>
            </div>

            {/* Ranking */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Ranking</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-8 w-8 text-yellow-600" />
                <span className="text-3xl font-bold">Top 15%</span>
              </div>
              <p className="text-sm font-medium">Acima da média</p>
              <p className="text-xs text-muted-foreground">
                Dept: {dados.comparacao.mediaDepartamento} | Escola: {dados.comparacao.mediaEscola}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="criterios" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="criterios">Critérios</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="comparacao">Comparação</TabsTrigger>
        </TabsList>

        {/* Tab: Critérios */}
        <TabsContent value="criterios" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gráfico Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Critério</CardTitle>
                <CardDescription>
                  Performance em cada aspecto avaliado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={dadosRadar}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis 
                      dataKey="criterio" 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} />
                    <Radar
                      name={dados.professor.nome}
                      dataKey="valor"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detalhamento dos Critérios */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhamento dos Critérios</CardTitle>
                <CardDescription>
                  Notas individuais por aspecto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(dados.avaliacaoAtual.criterios).map(([key, valor]) => {
                  const nomes: Record<string, string> = {
                    dominioConteudo: 'Domínio do Conteúdo',
                    clarezaExplicacao: 'Clareza nas Explicações',
                    pontualidade: 'Pontualidade',
                    organizacao: 'Organização',
                    acessibilidade: 'Acessibilidade',
                    empatia: 'Empatia e Respeito'
                  }
                  
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{nomes[key]}</span>
                        <span className="text-sm font-bold text-primary">
                          {valor.toFixed(1)}/5.0
                        </span>
                      </div>
                      <Progress value={(valor / 5) * 100} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Insight */}
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 dark:text-blue-300">
              <strong>Destaque:</strong> Pontualidade e Domínio do Conteúdo são os pontos mais fortes. 
              Acessibilidade tem margem para melhoria (+0.3 pontos possíveis).
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Tab: Evolução */}
        <TabsContent value="evolucao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolução Temporal</CardTitle>
              <CardDescription>
                Progresso da média geral ao longo dos últimos 3 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dados.historico}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="periodo" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: any) => [`${value.toFixed(2)}/5.0`, 'Nota']}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mediaGeral" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">+7%</p>
                  <p className="text-xs text-muted-foreground">Crescimento</p>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">3</p>
                  <p className="text-xs text-muted-foreground">Meses avaliados</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{dados.estatisticas.totalAvaliacoesAno}</p>
                  <p className="text-xs text-muted-foreground">Total no ano</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Feedback */}
        <TabsContent value="feedback" className="space-y-6">
          {/* Análise de Sentimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Análise de Sentimento
              </CardTitle>
              <CardDescription>
                Distribuição dos comentários por sentimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Positivo</span>
                      <span className="text-sm font-bold text-green-600">
                        {dados.estatisticas.sentimentoGeral.positivo}%
                      </span>
                    </div>
                    <Progress value={dados.estatisticas.sentimentoGeral.positivo} className="h-2" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Minus className="h-5 w-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Neutro</span>
                      <span className="text-sm font-bold text-gray-600">
                        {dados.estatisticas.sentimentoGeral.neutro}%
                      </span>
                    </div>
                    <Progress value={dados.estatisticas.sentimentoGeral.neutro} className="h-2" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ThumbsDown className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Negativo</span>
                      <span className="text-sm font-bold text-red-600">
                        {dados.estatisticas.sentimentoGeral.negativo}%
                      </span>
                    </div>
                    <Progress value={dados.estatisticas.sentimentoGeral.negativo} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comentários */}
          <Card>
            <CardHeader>
              <CardTitle>Comentários dos Alunos</CardTitle>
              <CardDescription>
                Feedback textual anônimo ({dados.avaliacaoAtual.comentarios.length} comentários)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
              {dados.avaliacaoAtual.comentarios.map((comentario, index) => {
                const bgColor = 
                  comentario.sentimento === 'positivo' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                  comentario.sentimento === 'negativo' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                  'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                
                const Icon = 
                  comentario.sentimento === 'positivo' ? ThumbsUp :
                  comentario.sentimento === 'negativo' ? ThumbsDown : Minus
                
                const iconColor =
                  comentario.sentimento === 'positivo' ? 'text-green-600' :
                  comentario.sentimento === 'negativo' ? 'text-red-600' :
                  'text-gray-600'

                return (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${bgColor}`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={`h-4 w-4 ${iconColor} shrink-0 mt-0.5`} />
                      <p className="text-sm flex-1">{comentario.texto}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Comparação */}
        <TabsContent value="comparacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparação com Médias</CardTitle>
              <CardDescription>
                Performance relativa ao departamento e à escola
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosComparacao}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: any) => [`${value.toFixed(2)}/5.0`, 'Nota']}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#10b981" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{dados.professor.nome}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {dados.avaliacaoAtual.mediaGeral.toFixed(1)}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Média Departamento</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {dados.comparacao.mediaDepartamento.toFixed(1)}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Média Escola</p>
                  <p className="text-2xl font-bold text-green-600">
                    {dados.comparacao.mediaEscola.toFixed(1)}
                  </p>
                </div>
              </div>

              <Alert className="mt-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <Award className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900 dark:text-green-300">
                  <strong>Excelente!</strong> A avaliação está {((dados.avaliacaoAtual.mediaGeral / dados.comparacao.mediaDepartamento - 1) * 100).toFixed(0)}% acima da média do departamento e {((dados.avaliacaoAtual.mediaGeral / dados.comparacao.mediaEscola - 1) * 100).toFixed(0)}% acima da média da escola.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
