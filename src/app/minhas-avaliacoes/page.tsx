'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  BookOpen, 
  User, 
  Heart, 
  BarChart3, 
  Search, 
  Calendar,
  Star,
  TrendingUp,
  Award,
  Activity,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useMinhasAvaliacoes } from '@/hooks/useMinhasAvaliacoes'
import { useSession } from '@/hooks/useSession'

export default function MinhasAvaliacoesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [tabAtiva, setTabAtiva] = useState('aulas')
  const { data: session } = useSession()

  const usuarioId = session?.user?.id ? parseInt(session.user.id) : 0
  const { data, isLoading, error } = useMinhasAvaliacoes(usuarioId);

  // Filtrar avaliações por busca
  const avaliacoesAulasFiltradas = data?.avaliacoesAulas.filter((av) =>
    av.aulaTitulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    av.aulaMateria.toLowerCase().includes(searchQuery.toLowerCase()) ||
    av.professor.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const avaliacoesProfessoresFiltradas = data?.avaliacoesProfessores.filter((av) =>
    av.professor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    av.materia.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Função para mapear valencia/ativacao em emoji e cor
  const getEstadoEmocional = (estadoPrimario: string) => {
    const estados: Record<string, { emoji: string; cor: string }> = {
      'Animado': { emoji: '😄', cor: 'text-green-600' },
      'Feliz': { emoji: '🙂', cor: 'text-green-500' },
      'Calmo': { emoji: '😌', cor: 'text-blue-500' },
      'Relaxado': { emoji: '😊', cor: 'text-blue-400' },
      'Entediado': { emoji: '😐', cor: 'text-gray-500' },
      'Triste': { emoji: '😔', cor: 'text-yellow-600' },
      'Ansioso': { emoji: '😰', cor: 'text-orange-600' },
      'Estressado': { emoji: '😫', cor: 'text-red-600' },
    };
    return estados[estadoPrimario] || { emoji: '😐', cor: 'text-gray-500' };
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-16">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Avaliações</h2>
                <p className="text-muted-foreground">
                  {error.message || 'Não foi possível carregar suas avaliações.'}
                </p>
              </div>
              <Button onClick={() => window.location.reload()}>
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { avaliacoesAulas, avaliacoesProfessores, checkIns, estatisticas } = data!;

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Avaliações</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe seu histórico de avaliações e estatísticas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar avaliações..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Resumo Estatístico */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aulas Avaliadas
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estatisticas.totalAvaliacoesAulas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de avaliações completas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Check-ins
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estatisticas.totalCheckIns}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registros de bem-estar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sequência Atual
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{estatisticas.sequenciaAtual}</div>
              <span className="text-sm text-muted-foreground">dias</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Continue avaliando diariamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Humor Médio
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold">{estatisticas.mediaHumor.toFixed(1)}</div>
              <div className="flex gap-0.5">
                {[...Array(Math.round(estatisticas.mediaHumor / 2))].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado em {estatisticas.totalAvaliacoesAulas} avaliações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Avaliações */}
      <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="aulas" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Aulas ({avaliacoesAulas.length})
          </TabsTrigger>
          <TabsTrigger value="professores" className="gap-2">
            <User className="h-4 w-4" />
            Professores ({avaliacoesProfessores.length})
          </TabsTrigger>
          <TabsTrigger value="checkins" className="gap-2">
            <Heart className="h-4 w-4" />
            Check-ins ({checkIns.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab: Avaliações de Aulas */}
        <TabsContent value="aulas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações de Aulas</CardTitle>
              <CardDescription>
                Histórico completo de avaliações socioemocionais e didáticas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {avaliacoesAulasFiltradas.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Nenhuma avaliação encontrada</p>
                  <p className="text-sm mt-2">
                    {searchQuery
                      ? 'Tente ajustar os filtros de busca'
                      : 'Complete avaliações de aulas para vê-las aqui'}
                  </p>
                </div>
              )}

              {avaliacoesAulasFiltradas.map((avaliacao) => {
                const estado = avaliacao.socioemocional
                  ? getEstadoEmocional(avaliacao.socioemocional.estadoPrimario)
                  : null;

                return (
                  <Card key={avaliacao.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{avaliacao.aulaTitulo}</h3>
                            <Badge variant="outline">{avaliacao.aulaMateria}</Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {avaliacao.professor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(avaliacao.data, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Socioemocional */}
                            {avaliacao.socioemocional && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                  <Heart className="h-4 w-4" />
                                  Socioemocional
                                </h4>
                                <div className="flex items-center gap-2">
                                  {estado && (
                                    <>
                                      <span className="text-2xl">{estado.emoji}</span>
                                      <span className={`font-medium ${estado.cor}`}>
                                        {avaliacao.socioemocional.estadoPrimario}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Confiança: {(avaliacao.socioemocional.confianca * 100).toFixed(0)}% •{' '}
                                  {avaliacao.socioemocional.totalPerguntas} perguntas
                                </div>
                              </div>
                            )}

                            {/* Didática */}
                            {avaliacao.didatica && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                  <BarChart3 className="h-4 w-4" />
                                  Didática
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Compreensão:</span>
                                    <span className="ml-2 font-medium">
                                      {avaliacao.didatica.compreensaoConteudo}/5
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Engajamento:</span>
                                    <span className="ml-2 font-medium">
                                      {avaliacao.didatica.engajamento}/10
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Ritmo:</span>
                                    <span className="ml-2 font-medium">
                                      {avaliacao.didatica.ritmoAula}/5
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Recursos:</span>
                                    <span className="ml-2 font-medium">
                                      {avaliacao.didatica.recursosDidaticos}/5
                                    </span>
                                  </div>
                                </div>
                                {avaliacao.didatica.pontoPositivo && (
                                  <div className="text-xs italic text-muted-foreground mt-2">
                                    "{avaliacao.didatica.pontoPositivo}"
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/avaliacoes/detalhes/${avaliacao.aulaId}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Avaliações de Professores */}
        <TabsContent value="professores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações de Professores</CardTitle>
              <CardDescription>
                Avaliações mensais de desempenho dos professores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {avaliacoesProfessoresFiltradas.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Nenhuma avaliação de professor</p>
                  <p className="text-sm mt-2">
                    Avalie seus professores mensalmente
                  </p>
                </div>
              )}

              {avaliacoesProfessoresFiltradas.map((avaliacao) => {
                const mediaGeral = (
                  avaliacao.dominioConteudo +
                  avaliacao.clarezaExplicacao +
                  avaliacao.pontualidade +
                  avaliacao.organizacao +
                  avaliacao.acessibilidade +
                  avaliacao.empatia
                ) / 6;

                return (
                  <Card key={avaliacao.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{avaliacao.professor}</h3>
                            <Badge variant="outline">{avaliacao.materia}</Badge>
                            <Badge variant="secondary">
                              {avaliacao.periodo}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex gap-0.5">
                              {[...Array(Math.round(mediaGeral))].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm font-medium">
                              {mediaGeral.toFixed(1)}/5
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Domínio:</span>
                              <span className="ml-2 font-medium">{avaliacao.dominioConteudo}/5</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Clareza:</span>
                              <span className="ml-2 font-medium">{avaliacao.clarezaExplicacao}/5</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Pontualidade:</span>
                              <span className="ml-2 font-medium">{avaliacao.pontualidade}/5</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Organização:</span>
                              <span className="ml-2 font-medium">{avaliacao.organizacao}/5</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Acessibilidade:</span>
                              <span className="ml-2 font-medium">{avaliacao.acessibilidade}/5</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Empatia:</span>
                              <span className="ml-2 font-medium">{avaliacao.empatia}/5</span>
                            </div>
                          </div>

                          {avaliacao.comentario && (
                            <div className="mt-3 text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3">
                              "{avaliacao.comentario}"
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Check-ins */}
        <TabsContent value="checkins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Check-ins Diários</CardTitle>
              <CardDescription>
                Registro diário de bem-estar e estado emocional
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {checkIns.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Nenhum check-in registrado</p>
                  <p className="text-sm mt-2">
                    Faça check-ins diários para acompanhar seu bem-estar
                  </p>
                </div>
              )}

              {checkIns.map((checkIn) => (
                <Card key={checkIn.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {format(checkIn.data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {Object.entries(checkIn.scores).slice(0, 3).map(([categoria, score]) => (
                          <Badge key={categoria} variant="secondary" className="text-xs">
                            {categoria}: {score.toFixed(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Estatísticas Adicionais */}
      {estatisticas.disciplinaFavorita && estatisticas.disciplinaFavorita !== 'Nenhuma' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Disciplina Favorita
                </h4>
                <p className="text-2xl font-bold">{estatisticas.disciplinaFavorita}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Baseado no número de avaliações
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
