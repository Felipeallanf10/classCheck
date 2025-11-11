'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  Clock,
  CheckCircle2,
  UserCheck,
  BarChart3
} from 'lucide-react'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Turma {
  id: number
  nome: string
  codigo: string
  ano: string
  periodo: string
  ativa: boolean
  materia: string
  estatisticas: {
    totalAlunos: number
    totalAulas: number
    totalAvaliacoes: number
    aulasRecentes: number
  }
  alunos: Array<{
    id: number
    nome: string
    avatar: string | null
  }>
  aulasRecentes: Array<{
    id: number
    titulo: string
    dataHora: Date
    status: string
  }>
}

export default function ProfessorTurmasPage() {
  const { data: session } = useSession()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTurmas() {
      try {
        setLoading(true)
        const response = await fetch('/api/professor/turmas')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar turmas')
        }

        const data = await response.json()
        setTurmas(data.turmas || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar turmas')
      } finally {
        setLoading(false)
      }
    }

    fetchTurmas()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Breadcrumbs items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Minhas Turmas" }
        ]} />
        
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const turmasAtivas = turmas.filter(t => t.ativa)
  const totalAlunos = turmas.reduce((acc, t) => acc + t.estatisticas.totalAlunos, 0)
  const totalAulas = turmas.reduce((acc, t) => acc + t.estatisticas.totalAulas, 0)
  const totalAvaliacoes = turmas.reduce((acc, t) => acc + t.estatisticas.totalAvaliacoes, 0)

  return (
    <div className="space-y-6 p-4">
      <Breadcrumbs items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Minhas Turmas" }
      ]} />

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Turmas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas turmas e acompanhe o progresso dos alunos
          </p>
        </div>

        {/* Cards de Estatísticas Gerais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{turmasAtivas.length}</div>
              <p className="text-xs text-muted-foreground">
                {turmas.length - turmasAtivas.length} inativas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAlunos}</div>
              <p className="text-xs text-muted-foreground">
                Média de {Math.round(totalAlunos / turmasAtivas.length || 0)} por turma
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aulas Criadas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAulas}</div>
              <p className="text-xs text-muted-foreground">
                Todas as turmas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAvaliacoes}</div>
              <p className="text-xs text-muted-foreground">
                Feedback recebido
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Turmas */}
        {turmasAtivas.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma turma encontrada</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Você ainda não está vinculado a nenhuma turma. Entre em contato com o administrador.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {turmasAtivas.map((turma) => (
              <Card key={turma.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{turma.nome}</CardTitle>
                      <CardDescription>
                        {turma.codigo} • {turma.periodo} • {turma.ano}
                      </CardDescription>
                      <div className="text-sm text-muted-foreground mt-1">
                        {turma.materia}
                      </div>
                    </div>
                    <Badge variant={turma.ativa ? "default" : "secondary"}>
                      {turma.ativa ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Estatísticas da Turma */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{turma.estatisticas.totalAlunos}</span>
                      <span className="text-muted-foreground">alunos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{turma.estatisticas.totalAulas}</span>
                      <span className="text-muted-foreground">aulas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{turma.estatisticas.totalAvaliacoes}</span>
                      <span className="text-muted-foreground">avaliações</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{turma.estatisticas.aulasRecentes}</span>
                      <span className="text-muted-foreground">recentes</span>
                    </div>
                  </div>

                  {/* Últimas Aulas */}
                  {turma.aulasRecentes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Últimas aulas
                      </h4>
                      <div className="space-y-1">
                        {turma.aulasRecentes.slice(0, 2).map((aula) => (
                          <div key={aula.id} className="flex items-center justify-between text-xs border-l-2 border-primary/20 pl-2 py-1">
                            <span className="truncate flex-1">{aula.titulo}</span>
                            <span className="text-muted-foreground ml-2">
                              {format(new Date(aula.dataHora), 'dd/MM', { locale: ptBR })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botões de Ação */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" size="sm" asChild>
                      <Link href={`/aulas?turma=${turma.id}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Ver Aulas
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/analytics?turma=${turma.id}`}>
                        <BarChart3 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Turmas Inativas (se houver) */}
        {turmas.length > turmasAtivas.length && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Turmas Inativas</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {turmas.filter(t => !t.ativa).map((turma) => (
                <Card key={turma.id} className="opacity-60">
                  <CardHeader>
                    <CardTitle className="text-lg">{turma.nome}</CardTitle>
                    <CardDescription>{turma.codigo} • {turma.ano}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">Inativa</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
  )
}
