'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { RelatorioPageSkeleton } from '@/components/ui/loading-states'
import { 
  Users, 
  TrendingUp, 
  AlertCircle,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Brain,
  Download
} from 'lucide-react'
import MapaCircumplexTurma from '@/components/relatorios/MapaCircumplexTurma'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AvaliacaoAluno {
  usuarioId: number
  usuarioNome: string
  usuarioAvatar: string | null
  valencia: number
  ativacao: number
  estadoPrimario: string
  confianca: number
  createdAt: string
}

interface AlunoAtencao {
  usuarioId: number
  nome: string
  valencia: number
  ativacao: number
  estadoPrimario: string
  motivo: string
}

interface Estatisticas {
  valenciaMedia: number
  ativacaoMedia: number
  confiancaMedia: number
  estadoMaisFrequente: {
    estado: string
    quantidade: number
    percentual: number
  } | null
  distribuicaoQuadrantes: {
    altoPositivo: { count: number; percentual: number }
    baixoPositivo: { count: number; percentual: number }
    altoNegativo: { count: number; percentual: number }
    baixoNegativo: { count: number; percentual: number }
  }
  estadosCount: Record<string, number>
}

interface DadosRelatorio {
  aula: {
    id: number
    titulo: string
    materia: string
    dataHora: string
    duracao: number
    sala: string
    status: string
    professor: string
  }
  totalAvaliacoes: number
  estatisticas: Estatisticas | null
  alunosAtencao: AlunoAtencao[]
  avaliacoes: AvaliacaoAluno[]
}

export default function RelatorioTurmaPage() {
  const params = useParams()
  const aulaId = params.aulaId as string
  
  const [dados, setDados] = useState<DadosRelatorio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDados() {
      try {
        const response = await fetch(`/api/relatorios/turma/aula/${aulaId}`)
        
        if (!response.ok) throw new Error('Erro ao carregar relatório')
        
        const data = await response.json()
        setDados(data)
      } catch (err) {
        setError('Não foi possível carregar o relatório da turma')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (aulaId) {
      fetchDados()
    }
  }, [aulaId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Relatórios", href: "/relatorios" },
          { label: "Turma", icon: <Users className="h-4 w-4" /> }
        ]} />
        <RelatorioPageSkeleton />
      </div>
    )
  }

  if (error || !dados) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Relatórios", href: "/relatorios" },
          { label: "Turma", icon: <Users className="h-4 w-4" /> }
        ]} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Erro ao carregar dados'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (dados.totalAvaliacoes === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Relatório da Turma
            </CardTitle>
            <CardDescription>
              {dados.aula.titulo} • {dados.aula.materia}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ainda não há avaliações</h3>
              <p className="text-muted-foreground mb-6">
                Nenhum aluno avaliou esta aula ainda. As avaliações aparecerão aqui assim que forem realizadas.
              </p>
              <Button onClick={() => window.history.back()} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = dados.estatisticas!

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Relatórios", href: "/relatorios" },
        { label: "Turma", icon: <Users className="h-4 w-4" /> },
        { label: dados.aula.titulo }
      ]} />

      {/* Header */}
      <div className="mb-8 mt-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => window.history.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Relatório da Turma
            </h1>
            <div className="text-muted-foreground space-y-1">
              <p className="text-lg font-semibold">{dados.aula.titulo}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span>📚 {dados.aula.materia}</span>
                <span>👨‍🏫 {dados.aula.professor}</span>
                <span>📅 {new Date(dados.aula.dataHora).toLocaleString('pt-BR')}</span>
                <span>🏫 {dados.aula.sala}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.location.href = `/relatorios/turma/aula/${aulaId}/didatica`}
            >
              📊 Ver Relatório Didático
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dados.totalAvaliacoes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Users className="h-3 w-3 inline mr-1" />
              Alunos responderam
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
              {stats.valenciaMedia > 0.3 ? '😊 Clima positivo' : stats.valenciaMedia < -0.3 ? '😢 Clima negativo' : '😐 Clima neutro'}
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
              {stats.ativacaoMedia > 0.3 ? '⚡ Alta energia' : stats.ativacaoMedia < -0.3 ? '😴 Baixa energia' : '🎯 Equilibrado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estado Predominante
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.estadoMaisFrequente && (
              <>
                <div className="text-2xl font-bold">{stats.estadoMaisFrequente.estado}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.estadoMaisFrequente.percentual}% da turma ({stats.estadoMaisFrequente.quantidade} alunos)
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alunos que Precisam de Atenção */}
      {dados.alunosAtencao.length > 0 && (
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <div>
            <h3 className="font-semibold mb-2">
              {dados.alunosAtencao.length} {dados.alunosAtencao.length === 1 ? 'Aluno precisa' : 'Alunos precisam'} de atenção
            </h3>
            <div className="space-y-2">
              {dados.alunosAtencao.map((aluno) => (
                <div key={aluno.usuarioId} className="flex items-center gap-3 p-2 bg-white dark:bg-gray-950 rounded border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{aluno.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {aluno.motivo} • Estado: {aluno.estadoPrimario} (V: {aluno.valencia.toFixed(2)}, A: {aluno.ativacao.toFixed(2)})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Alert>
      )}

      {/* Distribuição por Quadrante */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Distribuição por Quadrante</CardTitle>
          <CardDescription>
            Como a turma se distribuiu no modelo circumplex
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {stats.distribuicaoQuadrantes.altoPositivo.percentual}%
              </div>
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-100 mt-1">
                Alto Positivo
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                {stats.distribuicaoQuadrantes.altoPositivo.count} {stats.distribuicaoQuadrantes.altoPositivo.count === 1 ? 'aluno' : 'alunos'}
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {stats.distribuicaoQuadrantes.baixoPositivo.percentual}%
              </div>
              <p className="text-sm font-semibold text-green-900 dark:text-green-100 mt-1">
                Baixo Positivo
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                {stats.distribuicaoQuadrantes.baixoPositivo.count} {stats.distribuicaoQuadrantes.baixoPositivo.count === 1 ? 'aluno' : 'alunos'}
              </p>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {stats.distribuicaoQuadrantes.altoNegativo.percentual}%
              </div>
              <p className="text-sm font-semibold text-red-900 dark:text-red-100 mt-1">
                Alto Negativo
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                {stats.distribuicaoQuadrantes.altoNegativo.count} {stats.distribuicaoQuadrantes.altoNegativo.count === 1 ? 'aluno' : 'alunos'}
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {stats.distribuicaoQuadrantes.baixoNegativo.percentual}%
              </div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mt-1">
                Baixo Negativo
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {stats.distribuicaoQuadrantes.baixoNegativo.count} {stats.distribuicaoQuadrantes.baixoNegativo.count === 1 ? 'aluno' : 'alunos'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapa Circumplex da Turma */}
      <MapaCircumplexTurma 
        avaliacoes={dados.avaliacoes}
        aulaInfo={{
          titulo: dados.aula.titulo,
          materia: dados.aula.materia,
          dataHora: dados.aula.dataHora
        }}
      />
    </div>
  )
}
