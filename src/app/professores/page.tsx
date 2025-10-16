'use client'

import { useState, useMemo } from 'react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Users, BookOpen, Search, TrendingUp, Award, ChevronRight, BarChart3 } from "lucide-react"
import Link from 'next/link'
import { ProfessoresListSkeleton } from "@/components/ui/loading-states"
import { NoResultsEmptyState, NoProfessoresEmptyState } from "@/components/ui/empty-states"

interface Professor {
  id: number
  nome: string
  disciplina: string
  departamento: string
  avatarUrl?: string
  mediaAvaliacao?: number
  totalAvaliacoes?: number
  alunosAtivos?: number
  topQualidade?: string
}

// Dados mockados de professores
const professoresMock: Professor[] = [
  {
    id: 1,
    nome: 'Prof. Ana Costa',
    disciplina: 'Matemática',
    departamento: 'Exatas',
    mediaAvaliacao: 4.8,
    totalAvaliacoes: 145,
    alunosAtivos: 78,
    topQualidade: 'Domínio do Conteúdo'
  },
  {
    id: 2,
    nome: 'Prof. Carlos Silva',
    disciplina: 'Física',
    departamento: 'Exatas',
    mediaAvaliacao: 4.6,
    totalAvaliacoes: 132,
    alunosAtivos: 65,
    topQualidade: 'Clareza nas Explicações'
  },
  {
    id: 3,
    nome: 'Prof. Marina Santos',
    disciplina: 'Química',
    departamento: 'Exatas',
    mediaAvaliacao: 4.9,
    totalAvaliacoes: 168,
    alunosAtivos: 92,
    topQualidade: 'Empatia'
  },
  {
    id: 4,
    nome: 'Prof. Roberto Lima',
    disciplina: 'História',
    departamento: 'Humanas',
    mediaAvaliacao: 4.7,
    totalAvaliacoes: 156,
    alunosAtivos: 85,
    topQualidade: 'Organização'
  },
  {
    id: 5,
    nome: 'Prof. Julia Ferreira',
    disciplina: 'Literatura',
    departamento: 'Humanas',
    mediaAvaliacao: 4.5,
    totalAvaliacoes: 123,
    alunosAtivos: 71,
    topQualidade: 'Acessibilidade'
  },
  {
    id: 6,
    nome: 'Prof. Paulo Oliveira',
    disciplina: 'Geografia',
    departamento: 'Humanas',
    mediaAvaliacao: 4.4,
    totalAvaliacoes: 118,
    alunosAtivos: 68,
    topQualidade: 'Pontualidade'
  },
  {
    id: 7,
    nome: 'Prof. Beatriz Souza',
    disciplina: 'Biologia',
    departamento: 'Biológicas',
    mediaAvaliacao: 4.8,
    totalAvaliacoes: 151,
    alunosAtivos: 82,
    topQualidade: 'Clareza nas Explicações'
  },
  {
    id: 8,
    nome: 'Prof. Fernando Alves',
    disciplina: 'Inglês',
    departamento: 'Linguagens',
    mediaAvaliacao: 4.6,
    totalAvaliacoes: 139,
    alunosAtivos: 76,
    topQualidade: 'Domínio do Conteúdo'
  }
]

export default function ProfessoresPage() {
  const [busca, setBusca] = useState('')
  const [departamentoFiltro, setDepartamentoFiltro] = useState<string>('todos')
  const [isLoading, setIsLoading] = useState(false) // Simular loading

  // Mock do papel do usuário - em produção viria da sessão/contexto de autenticação
  // Para testar: altere entre 'aluno', 'professor' ou 'coordenacao'
  const [userRole] = useState<'aluno' | 'professor' | 'coordenacao'>('aluno')

  // Filtrar professores
  const professoresFiltrados = useMemo(() => {
    return professoresMock.filter(prof => {
      const matchBusca = prof.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        prof.disciplina.toLowerCase().includes(busca.toLowerCase())
      const matchDepartamento = departamentoFiltro === 'todos' || prof.departamento === departamentoFiltro
      return matchBusca && matchDepartamento
    })
  }, [busca, departamentoFiltro])

  // Departamentos únicos
  const departamentos = useMemo(() => {
    const deps = Array.from(new Set(professoresMock.map(p => p.departamento)))
    return ['todos', ...deps]
  }, [])

  // Estatísticas gerais
  const stats = useMemo(() => {
    return {
      total: professoresMock.length,
      mediaGeral: (professoresMock.reduce((acc, p) => acc + (p.mediaAvaliacao || 0), 0) / professoresMock.length).toFixed(1),
      totalAvaliacoes: professoresMock.reduce((acc, p) => acc + (p.totalAvaliacoes || 0), 0),
      alunosAtivos: professoresMock.reduce((acc, p) => acc + (p.alunosAtivos || 0), 0)
    }
  }, [])

  const getInitials = (nome: string) => {
    const parts = nome.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return nome.substring(0, 2).toUpperCase()
  }

  const getAvaliacaoColor = (media?: number) => {
    if (!media) return 'text-gray-400'
    if (media >= 4.5) return 'text-green-600 dark:text-green-400'
    if (media >= 4.0) return 'text-blue-600 dark:text-blue-400'
    if (media >= 3.5) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getAvaliacaoEmoji = (media?: number) => {
    if (!media) return '😐'
    if (media >= 4.7) return '🌟'
    if (media >= 4.5) return '😄'
    if (media >= 4.0) return '😊'
    if (media >= 3.5) return '🙂'
    return '😐'
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="min-h-screen bg-background">
          {/* Breadcrumbs */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <Breadcrumbs items={[
                { label: 'Professores', icon: <Users className="h-4 w-4" /> }
              ]} />
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="mr-2" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                    <Users className="w-7 h-7 text-primary" />
                    Professores
                  </h1>
                </div>
            {userRole === 'coordenacao' && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/relatorios">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Relatórios
                </Link>
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">
            {userRole === 'aluno' && 'Avalie seus professores de forma anônima e construtiva'}
            {userRole === 'professor' && 'Visualize informações sobre seus colegas'}
            {userRole === 'coordenacao' && 'Acompanhe o desempenho e avaliações dos professores'}
          </p>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Total de Professores</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="w-3 h-3 mr-1" />
                Cadastrados
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Média Geral</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2">
                {stats.mediaGeral}
                <span className="text-xl">{getAvaliacaoEmoji(Number(stats.mediaGeral))}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                de 5.0
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Avaliações</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">{stats.totalAvaliacoes}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 mr-1" />
                Total recebidas
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Alunos Ativos</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">{stats.alunosAtivos}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <BookOpen className="w-3 h-3 mr-1" />
                Engajados
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou disciplina..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {departamentos.map(dep => (
                  <Button
                    key={dep}
                    variant={departamentoFiltro === dep ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDepartamentoFiltro(dep)}
                    className="capitalize"
                  >
                    {dep}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && <ProfessoresListSkeleton />}

        {/* Lista de Professores */}
        {!isLoading && professoresFiltrados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {professoresFiltrados.map(professor => (
            <Card key={professor.id} className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="w-12 h-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {getInitials(professor.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base mb-1 truncate">{professor.nome}</CardTitle>
                      <CardDescription className="text-xs">{professor.disciplina}</CardDescription>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {professor.departamento}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Estatísticas do Professor */}
                <div className="grid grid-cols-3 gap-2 py-2 border-t">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getAvaliacaoColor(professor.mediaAvaliacao)} flex items-center justify-center gap-1`}>
                      {professor.mediaAvaliacao}
                      <span className="text-sm">{getAvaliacaoEmoji(professor.mediaAvaliacao)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Média</div>
                  </div>
                  <div className="text-center border-x">
                    <div className="text-lg font-bold text-foreground">{professor.totalAvaliacoes}</div>
                    <div className="text-xs text-muted-foreground">Aval.</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{professor.alunosAtivos}</div>
                    <div className="text-xs text-muted-foreground">Alunos</div>
                  </div>
                </div>

                {/* Qualidade Destaque */}
                {professor.topQualidade && (
                  <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-md border border-primary/10">
                    <Award className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground">Destaque</div>
                      <div className="text-xs text-muted-foreground truncate">{professor.topQualidade}</div>
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-2 pt-2">
                  {userRole === 'aluno' && (
                    <Button 
                      className="flex-1 group-hover:shadow-md transition-all" 
                      size="sm"
                      asChild
                    >
                      <Link href={`/professores/${professor.id}/avaliar`}>
                        <Star className="w-4 h-4 mr-2" />
                        Avaliar
                      </Link>
                    </Button>
                  )}
                  
                  {userRole === 'coordenacao' && (
                    <>
                      <Button 
                        variant="outline" 
                        className="flex-1 group-hover:shadow-md transition-all" 
                        size="sm"
                        asChild
                      >
                        <Link href={`/relatorios/professor/${professor.id}`}>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Relatório
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="px-2"
                        asChild
                      >
                        <Link href={`/professores/${professor.id}`}>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </>
                  )}

                  {userRole === 'professor' && (
                    <Button 
                      variant="outline" 
                      className="flex-1 group-hover:shadow-md transition-all" 
                      size="sm"
                      asChild
                    >
                      <Link href={`/professores/${professor.id}`}>
                        Ver Perfil
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Mensagem quando não há resultados */}
        {!isLoading && professoresFiltrados.length === 0 && (
          <NoResultsEmptyState 
            onClear={() => {
              setBusca('')
              setDepartamentoFiltro('todos')
            }}
          />
        )}

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
