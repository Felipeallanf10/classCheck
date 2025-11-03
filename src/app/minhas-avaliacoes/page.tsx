'use client''use client'



import { useState } from 'react'import { useState } from 'react'

import { useRouter } from 'next/navigation'import { useRouter } from 'next/navigation'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

import { Button } from '@/components/ui/button'import { Button } from '@/components/ui/button'

import { Badge } from '@/components/ui/badge'import { Badge } from '@/components/ui/badge'

import { Input } from '@/components/ui/input'import { Input } from '@/components/ui/input'

import { Skeleton } from '@/components/ui/skeleton'import { 

import {   BookOpen, 

  BookOpen,   User, 

  User,   Heart, 

  Heart,   BarChart3, 

  BarChart3,   Search, 

  Search,   Calendar,

  Calendar,  Star,

  Star,  TrendingUp,

  TrendingUp,  Award,

  Award,  Activity,

  Activity,  Filter

  AlertCircle} from 'lucide-react'

} from 'lucide-react'import { format } from 'date-fns'

import { format } from 'date-fns'import { ptBR } from 'date-fns/locale'

import { ptBR } from 'date-fns/locale'

import { useMinhasAvaliacoes } from '@/hooks/useMinhasAvaliacoes'// Mock data - Em produção, virá da API

const mockData = {

// TODO: Pegar ID do usuário da sessão  avaliacoesAulas: [

const USUARIO_ID = 52;    {

      id: '1',

export default function MinhasAvaliacoesPage() {      aula: { titulo: 'Geografia – Continentes', materia: 'Geografia', professor: 'Prof. Ana' },

  const router = useRouter()      data: new Date('2025-10-14'),

  const [searchQuery, setSearchQuery] = useState('')      socioemocional: { estado: 'Animado', valencia: 0.8, ativacao: 0.6 },

  const [tabAtiva, setTabAtiva] = useState('aulas')      didatica: { compreensao: 5, ritmo: 3, recursos: 5, engajamento: 4 }

    },

  const { data, isLoading, error } = useMinhasAvaliacoes(USUARIO_ID);    {

      id: '2',

  // Filtrar avaliações por busca      aula: { titulo: 'Matemática – Funções', materia: 'Matemática', professor: 'Prof. Carlos' },

  const avaliacoesAulasFiltradas = data?.avaliacoesAulas.filter((av) =>      data: new Date('2025-10-13'),

    av.aulaTitulo.toLowerCase().includes(searchQuery.toLowerCase()) ||      socioemocional: { estado: 'Concentrado', valencia: 0.4, ativacao: 0.2 },

    av.aulaMateria.toLowerCase().includes(searchQuery.toLowerCase()) ||      didatica: { compreensao: 3, ritmo: 5, recursos: 3, engajamento: 3 }

    av.professor.toLowerCase().includes(searchQuery.toLowerCase())    },

  ) || [];  ],

  avaliacoesProfessores: [

  const avaliacoesProfessoresFiltradas = data?.avaliacoesProfessores.filter((av) =>    {

    av.professor.toLowerCase().includes(searchQuery.toLowerCase()) ||      id: '1',

    av.materia.toLowerCase().includes(searchQuery.toLowerCase())      professor: { nome: 'Prof. Ana Costa', materia: 'Geografia', avatar: null },

  ) || [];      data: new Date('2025-10-01'),

      periodo: '2025-10',

  // Função para mapear valencia/ativacao em emoji e cor      mediaGeral: 4.8

  const getEstadoEmocional = (estadoPrimario: string) => {    },

    const estados: Record<string, { emoji: string; cor: string }> = {  ],

      'Animado': { emoji: '😄', cor: 'text-green-600' },  checkIns: [

      'Feliz': { emoji: '🙂', cor: 'text-green-500' },    {

      'Calmo': { emoji: '😌', cor: 'text-blue-500' },      id: '1',

      'Relaxado': { emoji: '😊', cor: 'text-blue-400' },      data: new Date('2025-10-15'),

      'Entediado': { emoji: '😐', cor: 'text-gray-500' },      estado: 'Calmo',

      'Triste': { emoji: '😔', cor: 'text-yellow-600' },      valencia: 0.6,

      'Ansioso': { emoji: '😰', cor: 'text-orange-600' },      ativacao: -0.3

      'Estressado': { emoji: '😫', cor: 'text-red-600' },    },

    };    {

    return estados[estadoPrimario] || { emoji: '😐', cor: 'text-gray-500' };      id: '2',

  };      data: new Date('2025-10-14'),

      estado: 'Animado',

  if (isLoading) {      valencia: 0.8,

    return (      ativacao: 0.7

      <div className="container max-w-7xl py-8 space-y-6">    },

        <Skeleton className="h-12 w-64" />  ],

        <Skeleton className="h-96 w-full" />  estatisticas: {

      </div>    totalAvaliacoesAulas: 12,

    );    totalAvaliacoesProfessores: 3,

  }    totalCheckIns: 45,

    mediaHumor: 4.2,

  if (error) {    sequenciaAtual: 7,

    return (    disciplinaFavorita: 'Geografia'

      <div className="container max-w-4xl py-16">  }

        <Card className="border-destructive">}

          <CardContent className="pt-6">

            <div className="flex flex-col items-center text-center space-y-4">export default function MinhasAvaliacoesPage() {

              <AlertCircle className="h-12 w-12 text-destructive" />  const router = useRouter()

              <div>  const [searchTerm, setSearchTerm] = useState('')

                <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Avaliações</h2>  const [selectedTab, setSelectedTab] = useState('aulas')

                <p className="text-muted-foreground">

                  {error.message || 'Não foi possível carregar suas avaliações.'}  const getEstadoEmoji = (estado: string) => {

                </p>    const emojis: Record<string, string> = {

              </div>      'Animado': '😄', 'Empolgado': '🤩', 'Calmo': '😌', 

              <Button onClick={() => window.location.reload()}>      'Relaxado': '😊', 'Entediado': '😐', 'Cansado': '😴',

                Tentar Novamente      'Ansioso': '😰', 'Estressado': '😫', 'Concentrado': '🤔',

              </Button>      'Neutro': '😐'

            </div>    }

          </CardContent>    return emojis[estado] || '🙂'

        </Card>  }

      </div>

    );  return (

  }    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      <div className="container mx-auto px-4 py-8 max-w-7xl">

  const { avaliacoesAulas, avaliacoesProfessores, checkIns, estatisticas } = data!;        {/* Header */}

        <div className="mb-8">

  return (          <h1 className="text-3xl font-bold mb-2">Minhas Avaliações</h1>

    <div className="container max-w-7xl py-8 space-y-8">          <p className="text-muted-foreground">

      {/* Header */}            Acompanhe seu histórico completo de avaliações e check-ins

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">          </p>

        <div>        </div>

          <h1 className="text-3xl font-bold tracking-tight">Minhas Avaliações</h1>

          <p className="text-muted-foreground mt-2">        {/* Tabs */}

            Acompanhe seu histórico de avaliações e estatísticas        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">

          </p>          <TabsList className="grid w-full grid-cols-4 mb-6">

        </div>            <TabsTrigger value="aulas" className="flex items-center gap-2">

        <div className="flex items-center gap-2">              <BookOpen className="h-4 w-4" />

          <div className="relative w-full md:w-80">              <span>Aulas</span>

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />              <Badge variant="secondary" className="ml-1">

            <Input                {mockData.avaliacoesAulas.length}

              placeholder="Buscar avaliações..."              </Badge>

              className="pl-9"            </TabsTrigger>

              value={searchQuery}            <TabsTrigger value="professores" className="flex items-center gap-2">

              onChange={(e) => setSearchQuery(e.target.value)}              <User className="h-4 w-4" />

            />              <span>Professores</span>

          </div>              <Badge variant="secondary" className="ml-1">

        </div>                {mockData.avaliacoesProfessores.length}

      </div>              </Badge>

            </TabsTrigger>

      {/* Resumo Estatístico */}            <TabsTrigger value="checkins" className="flex items-center gap-2">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">              <Heart className="h-4 w-4" />

        <Card>              <span>Check-ins</span>

          <CardHeader className="flex flex-row items-center justify-between pb-2">              <Badge variant="secondary" className="ml-1">

            <CardTitle className="text-sm font-medium text-muted-foreground">                {mockData.checkIns.length}

              Aulas Avaliadas              </Badge>

            </CardTitle>            </TabsTrigger>

            <BookOpen className="h-4 w-4 text-muted-foreground" />            <TabsTrigger value="stats" className="flex items-center gap-2">

          </CardHeader>              <BarChart3 className="h-4 w-4" />

          <CardContent>              <span>Estatísticas</span>

            <div className="text-3xl font-bold">{estatisticas.totalAvaliacoesAulas}</div>            </TabsTrigger>

            <p className="text-xs text-muted-foreground mt-1">          </TabsList>

              Total de avaliações completas

            </p>          {/* Tab: Aulas */}

          </CardContent>          <TabsContent value="aulas" className="space-y-4">

        </Card>            {/* Busca e Filtros */}

            <div className="flex items-center gap-3">

        <Card>              <div className="relative flex-1 max-w-md">

          <CardHeader className="flex flex-row items-center justify-between pb-2">                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />

            <CardTitle className="text-sm font-medium text-muted-foreground">                <Input

              Check-ins                  placeholder="Buscar por aula, professor ou disciplina..."

            </CardTitle>                  value={searchTerm}

            <Heart className="h-4 w-4 text-muted-foreground" />                  onChange={(e) => setSearchTerm(e.target.value)}

          </CardHeader>                  className="pl-10"

          <CardContent>                />

            <div className="text-3xl font-bold">{estatisticas.totalCheckIns}</div>              </div>

            <p className="text-xs text-muted-foreground mt-1">              <Button variant="outline" size="icon">

              Registros de bem-estar                <Filter className="h-4 w-4" />

            </p>              </Button>

          </CardContent>            </div>

        </Card>

            {/* Lista de Avaliações de Aulas */}

        <Card>            <div className="grid gap-4 md:grid-cols-2">

          <CardHeader className="flex flex-row items-center justify-between pb-2">              {mockData.avaliacoesAulas.map((avaliacao) => (

            <CardTitle className="text-sm font-medium text-muted-foreground">                <Card key={avaliacao.id} className="hover:shadow-lg transition-shadow cursor-pointer">

              Sequência Atual                  <CardHeader>

            </CardTitle>                    <div className="flex items-start justify-between">

            <Award className="h-4 w-4 text-muted-foreground" />                      <div className="flex-1">

          </CardHeader>                        <CardTitle className="text-lg mb-1">

          <CardContent>                          {avaliacao.aula.titulo}

            <div className="flex items-baseline gap-2">                        </CardTitle>

              <div className="text-3xl font-bold">{estatisticas.sequenciaAtual}</div>                        <CardDescription>

              <span className="text-sm text-muted-foreground">dias</span>                          {avaliacao.aula.professor} • {avaliacao.aula.materia}

            </div>                        </CardDescription>

            <p className="text-xs text-muted-foreground mt-1">                      </div>

              Continue avaliando diariamente                      <div className="text-right">

            </p>                        <p className="text-sm text-muted-foreground">

          </CardContent>                          {format(avaliacao.data, "dd 'de' MMM", { locale: ptBR })}

        </Card>                        </p>

                      </div>

        <Card>                    </div>

          <CardHeader className="flex flex-row items-center justify-between pb-2">                  </CardHeader>

            <CardTitle className="text-sm font-medium text-muted-foreground">                  <CardContent className="space-y-3">

              Humor Médio                    {/* Estado Emocional */}

            </CardTitle>                    <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">

            <Activity className="h-4 w-4 text-muted-foreground" />                      <span className="text-2xl">{getEstadoEmoji(avaliacao.socioemocional.estado)}</span>

          </CardHeader>                      <div className="flex-1">

          <CardContent>                        <p className="text-sm font-medium">{avaliacao.socioemocional.estado}</p>

            <div className="flex items-center gap-3">                        <p className="text-xs text-muted-foreground">

              <div className="text-3xl font-bold">{estatisticas.mediaHumor.toFixed(1)}</div>                          V: {avaliacao.socioemocional.valencia.toFixed(1)} • 

              <div className="flex gap-0.5">                          A: {avaliacao.socioemocional.ativacao.toFixed(1)}

                {[...Array(Math.round(estatisticas.mediaHumor / 2))].map((_, i) => (                        </p>

                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />                      </div>

                ))}                    </div>

              </div>

            </div>                    {/* Avaliação Didática */}

            <p className="text-xs text-muted-foreground mt-1">                    <div className="grid grid-cols-2 gap-2 text-sm">

              Baseado em {estatisticas.totalAvaliacoesAulas} avaliações                      <div>

            </p>                        <p className="text-muted-foreground text-xs">Compreensão</p>

          </CardContent>                        <div className="flex gap-0.5">

        </Card>                          {[...Array(avaliacao.didatica.compreensao)].map((_, i) => (

      </div>                            <Star key={i} className="h-3 w-3 text-yellow-500" fill="currentColor" />

                          ))}

      {/* Tabs de Avaliações */}                        </div>

      <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="space-y-6">                      </div>

        <TabsList className="grid w-full max-w-md grid-cols-3">                      <div>

          <TabsTrigger value="aulas" className="gap-2">                        <p className="text-muted-foreground text-xs">Engajamento</p>

            <BookOpen className="h-4 w-4" />                        <div className="flex gap-0.5">

            Aulas ({avaliacoesAulas.length})                          {[...Array(avaliacao.didatica.engajamento)].map((_, i) => (

          </TabsTrigger>                            <Star key={i} className="h-3 w-3 text-yellow-500" fill="currentColor" />

          <TabsTrigger value="professores" className="gap-2">                          ))}

            <User className="h-4 w-4" />                        </div>

            Professores ({avaliacoesProfessores.length})                      </div>

          </TabsTrigger>                    </div>

          <TabsTrigger value="checkins" className="gap-2">                  </CardContent>

            <Heart className="h-4 w-4" />                </Card>

            Check-ins ({checkIns.length})              ))}

          </TabsTrigger>            </div>

        </TabsList>

            {mockData.avaliacoesAulas.length === 0 && (

        {/* Tab: Avaliações de Aulas */}              <Card>

        <TabsContent value="aulas" className="space-y-4">                <CardContent className="py-12 text-center">

          <Card>                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />

            <CardHeader>                  <h3 className="font-semibold mb-2">Nenhuma avaliação ainda</h3>

              <CardTitle>Avaliações de Aulas</CardTitle>                  <p className="text-sm text-muted-foreground mb-4">

              <CardDescription>                    Comece avaliando suas aulas para ver seu histórico aqui

                Histórico completo de avaliações socioemocionais e didáticas                  </p>

              </CardDescription>                  <Button onClick={() => router.push('/aulas')}>

            </CardHeader>                    Ver Aulas Disponíveis

            <CardContent className="space-y-4">                  </Button>

              {avaliacoesAulasFiltradas.length === 0 && (                </CardContent>

                <div className="text-center py-12 text-muted-foreground">              </Card>

                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />            )}

                  <p className="text-lg font-medium">Nenhuma avaliação encontrada</p>          </TabsContent>

                  <p className="text-sm mt-2">

                    {searchQuery          {/* Tab: Professores */}

                      ? 'Tente ajustar os filtros de busca'          <TabsContent value="professores" className="space-y-4">

                      : 'Complete avaliações de aulas para vê-las aqui'}            <div className="grid gap-4 md:grid-cols-2">

                  </p>              {mockData.avaliacoesProfessores.map((avaliacao) => (

                </div>                <Card key={avaliacao.id} className="hover:shadow-lg transition-shadow cursor-pointer">

              )}                  <CardHeader>

                    <div className="flex items-start justify-between">

              {avaliacoesAulasFiltradas.map((avaliacao) => {                      <div className="flex-1">

                const estado = avaliacao.socioemocional                        <CardTitle className="text-lg mb-1">

                  ? getEstadoEmocional(avaliacao.socioemocional.estadoPrimario)                          {avaliacao.professor.nome}

                  : null;                        </CardTitle>

                        <CardDescription>

                return (                          {avaliacao.professor.materia}

                  <Card key={avaliacao.id} className="hover:shadow-md transition-shadow">                        </CardDescription>

                    <CardContent className="pt-6">                      </div>

                      <div className="flex items-start justify-between">                      <div className="text-right">

                        <div className="flex-1">                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">

                          <div className="flex items-center gap-3 mb-2">                          {avaliacao.mediaGeral.toFixed(1)}

                            <h3 className="font-semibold text-lg">{avaliacao.aulaTitulo}</h3>                        </p>

                            <Badge variant="outline">{avaliacao.aulaMateria}</Badge>                        <p className="text-xs text-muted-foreground">Média</p>

                          </div>                      </div>

                                              </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">                  </CardHeader>

                            <span className="flex items-center gap-1">                  <CardContent>

                              <User className="h-3 w-3" />                    <div className="flex items-center justify-between text-sm">

                              {avaliacao.professor}                      <span className="text-muted-foreground">

                            </span>                        Período: {avaliacao.periodo}

                            <span className="flex items-center gap-1">                      </span>

                              <Calendar className="h-3 w-3" />                      <span className="text-xs text-muted-foreground">

                              {format(avaliacao.data, "dd 'de' MMMM, yyyy", { locale: ptBR })}                        {format(avaliacao.data, "dd/MM/yyyy")}

                            </span>                      </span>

                          </div>                    </div>

                  </CardContent>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                </Card>

                            {/* Socioemocional */}              ))}

                            {avaliacao.socioemocional && (            </div>

                              <div className="space-y-2">

                                <h4 className="text-sm font-medium flex items-center gap-2">            {mockData.avaliacoesProfessores.length === 0 && (

                                  <Heart className="h-4 w-4" />              <Card>

                                  Socioemocional                <CardContent className="py-12 text-center">

                                </h4>                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />

                                <div className="flex items-center gap-2">                  <h3 className="font-semibold mb-2">Nenhuma avaliação de professor</h3>

                                  {estado && (                  <p className="text-sm text-muted-foreground mb-4">

                                    <>                    Avalie seus professores para ajudá-los a melhorar

                                      <span className="text-2xl">{estado.emoji}</span>                  </p>

                                      <span className={`font-medium ${estado.cor}`}>                  <Button onClick={() => router.push('/professores')}>

                                        {avaliacao.socioemocional.estadoPrimario}                    Ver Professores

                                      </span>                  </Button>

                                    </>                </CardContent>

                                  )}              </Card>

                                </div>            )}

                                <div className="text-xs text-muted-foreground">          </TabsContent>

                                  Confiança: {(avaliacao.socioemocional.confianca * 100).toFixed(0)}% •{' '}

                                  {avaliacao.socioemocional.totalPerguntas} perguntas          {/* Tab: Check-ins */}

                                </div>          <TabsContent value="checkins" className="space-y-4">

                              </div>            <div className="grid gap-4 md:grid-cols-3">

                            )}              {mockData.checkIns.map((checkIn) => (

                <Card key={checkIn.id} className="hover:shadow-lg transition-shadow">

                            {/* Didática */}                  <CardContent className="pt-6">

                            {avaliacao.didatica && (                    <div className="text-center space-y-3">

                              <div className="space-y-2">                      <div className="text-4xl">{getEstadoEmoji(checkIn.estado)}</div>

                                <h4 className="text-sm font-medium flex items-center gap-2">                      <div>

                                  <BarChart3 className="h-4 w-4" />                        <p className="font-semibold text-lg">{checkIn.estado}</p>

                                  Didática                        <p className="text-xs text-muted-foreground">

                                </h4>                          {format(checkIn.data, "dd 'de' MMMM", { locale: ptBR })}

                                <div className="grid grid-cols-2 gap-2 text-sm">                        </p>

                                  <div>                      </div>

                                    <span className="text-muted-foreground">Compreensão:</span>                      <div className="flex justify-center gap-4 text-xs">

                                    <span className="ml-2 font-medium">                        <div>

                                      {avaliacao.didatica.compreensaoConteudo}/5                          <span className="text-muted-foreground">V:</span>{' '}

                                    </span>                          <span className="font-medium">{checkIn.valencia.toFixed(1)}</span>

                                  </div>                        </div>

                                  <div>                        <div>

                                    <span className="text-muted-foreground">Engajamento:</span>                          <span className="text-muted-foreground">A:</span>{' '}

                                    <span className="ml-2 font-medium">                          <span className="font-medium">{checkIn.ativacao.toFixed(1)}</span>

                                      {avaliacao.didatica.engajamento}/10                        </div>

                                    </span>                      </div>

                                  </div>                    </div>

                                  <div>                  </CardContent>

                                    <span className="text-muted-foreground">Ritmo:</span>                </Card>

                                    <span className="ml-2 font-medium">              ))}

                                      {avaliacao.didatica.ritmoAula}/5            </div>

                                    </span>

                                  </div>            {mockData.checkIns.length === 0 && (

                                  <div>              <Card>

                                    <span className="text-muted-foreground">Recursos:</span>                <CardContent className="py-12 text-center">

                                    <span className="ml-2 font-medium">                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />

                                      {avaliacao.didatica.recursosDidaticos}/5                  <h3 className="font-semibold mb-2">Nenhum check-in registrado</h3>

                                    </span>                  <p className="text-sm text-muted-foreground mb-4">

                                  </div>                    Faça check-ins diários para acompanhar seu bem-estar

                                </div>                  </p>

                                {avaliacao.didatica.pontoPositivo && (                  <Button onClick={() => router.push('/check-in')}>

                                  <div className="text-xs italic text-muted-foreground mt-2">                    Fazer Check-in Agora

                                    "{avaliacao.didatica.pontoPositivo}"                  </Button>

                                  </div>                </CardContent>

                                )}              </Card>

                              </div>            )}

                            )}

                          </div>            <div className="flex justify-center">

                        </div>              <Button 

                variant="outline"

                        <Button                onClick={() => router.push('/relatorios/meu-estado-emocional')}

                          variant="ghost"              >

                          size="sm"                <Activity className="h-4 w-4 mr-2" />

                          onClick={() => router.push(`/avaliacoes/detalhes/${avaliacao.aulaId}`)}                Ver Jornada Emocional Completa

                        >              </Button>

                          Ver Detalhes            </div>

                        </Button>          </TabsContent>

                      </div>

                    </CardContent>          {/* Tab: Estatísticas */}

                  </Card>          <TabsContent value="stats" className="space-y-6">

                );            <div className="grid gap-4 md:grid-cols-3">

              })}              {/* Total de Avaliações */}

            </CardContent>              <Card>

          </Card>                <CardHeader>

        </TabsContent>                  <CardTitle className="text-sm font-medium text-muted-foreground">

                    Total de Avaliações

        {/* Tab: Avaliações de Professores */}                  </CardTitle>

        <TabsContent value="professores" className="space-y-4">                </CardHeader>

          <Card>                <CardContent>

            <CardHeader>                  <div className="flex items-center justify-between">

              <CardTitle>Avaliações de Professores</CardTitle>                    <p className="text-3xl font-bold">{mockData.estatisticas.totalAvaliacoesAulas}</p>

              <CardDescription>                    <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />

                Avaliações mensais de desempenho dos professores                  </div>

              </CardDescription>                  <p className="text-xs text-muted-foreground mt-2">Aulas avaliadas</p>

            </CardHeader>                </CardContent>

            <CardContent className="space-y-4">              </Card>

              {avaliacoesProfessoresFiltradas.length === 0 && (

                <div className="text-center py-12 text-muted-foreground">              {/* Sequência Ativa */}

                  <User className="h-12 w-12 mx-auto mb-4 opacity-20" />              <Card>

                  <p className="text-lg font-medium">Nenhuma avaliação de professor</p>                <CardHeader>

                  <p className="text-sm mt-2">                  <CardTitle className="text-sm font-medium text-muted-foreground">

                    Avalie seus professores mensalmente                    Sequência Ativa

                  </p>                  </CardTitle>

                </div>                </CardHeader>

              )}                <CardContent>

                  <div className="flex items-center justify-between">

              {avaliacoesProfessoresFiltradas.map((avaliacao) => {                    <p className="text-3xl font-bold">{mockData.estatisticas.sequenciaAtual}</p>

                const mediaGeral = (                    <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />

                  avaliacao.dominioConteudo +                  </div>

                  avaliacao.clarezaExplicacao +                  <p className="text-xs text-muted-foreground mt-2">Dias consecutivos</p>

                  avaliacao.pontualidade +                </CardContent>

                  avaliacao.organizacao +              </Card>

                  avaliacao.acessibilidade +

                  avaliacao.empatia              {/* Média de Humor */}

                ) / 6;              <Card>

                <CardHeader>

                return (                  <CardTitle className="text-sm font-medium text-muted-foreground">

                  <Card key={avaliacao.id} className="hover:shadow-md transition-shadow">                    Média de Humor

                    <CardContent className="pt-6">                  </CardTitle>

                      <div className="flex items-start justify-between">                </CardHeader>

                        <div className="flex-1">                <CardContent>

                          <div className="flex items-center gap-3 mb-2">                  <div className="flex items-center justify-between">

                            <h3 className="font-semibold text-lg">{avaliacao.professor}</h3>                    <p className="text-3xl font-bold">{mockData.estatisticas.mediaHumor.toFixed(1)}</p>

                            <Badge variant="outline">{avaliacao.materia}</Badge>                    <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400" />

                            <Badge variant="secondary">                  </div>

                              {avaliacao.periodo}                  <div className="flex gap-0.5 mt-2">

                            </Badge>                    {[...Array(Math.round(mockData.estatisticas.mediaHumor))].map((_, i) => (

                          </div>                      <Star key={i} className="h-4 w-4 text-yellow-500" fill="currentColor" />

                    ))}

                          <div className="flex items-center gap-2 mb-4">                  </div>

                            <div className="flex gap-0.5">                </CardContent>

                              {[...Array(Math.round(mediaGeral))].map((_, i) => (              </Card>

                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />            </div>

                              ))}

                            </div>            {/* Conquistas */}

                            <span className="text-sm font-medium">            <Card>

                              {mediaGeral.toFixed(1)}/5              <CardHeader>

                            </span>                <CardTitle>Suas Conquistas</CardTitle>

                          </div>                <CardDescription>Badges desbloqueados por engajamento</CardDescription>

              </CardHeader>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">              <CardContent>

                            <div>                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                              <span className="text-muted-foreground">Domínio:</span>                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">

                              <span className="ml-2 font-medium">{avaliacao.dominioConteudo}/5</span>                    <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />

                            </div>                    <div>

                            <div>                      <p className="font-semibold text-sm">Primeira Avaliação</p>

                              <span className="text-muted-foreground">Clareza:</span>                      <p className="text-xs text-muted-foreground">Desbloqueado em 01/10</p>

                              <span className="ml-2 font-medium">{avaliacao.clarezaExplicacao}/5</span>                    </div>

                            </div>                  </div>

                            <div>                  <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">

                              <span className="text-muted-foreground">Pontualidade:</span>                    <Award className="h-8 w-8 text-orange-600 dark:text-orange-400" />

                              <span className="ml-2 font-medium">{avaliacao.pontualidade}/5</span>                    <div>

                            </div>                      <p className="font-semibold text-sm">Sequência de 7 Dias</p>

                            <div>                      <p className="text-xs text-muted-foreground">Desbloqueado hoje</p>

                              <span className="text-muted-foreground">Organização:</span>                    </div>

                              <span className="ml-2 font-medium">{avaliacao.organizacao}/5</span>                  </div>

                            </div>                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg opacity-50">

                            <div>                    <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />

                              <span className="text-muted-foreground">Acessibilidade:</span>                    <div>

                              <span className="ml-2 font-medium">{avaliacao.acessibilidade}/5</span>                      <p className="font-semibold text-sm">Avaliador Dedicado</p>

                            </div>                      <p className="text-xs text-muted-foreground">38 avaliações restantes</p>

                            <div>                    </div>

                              <span className="text-muted-foreground">Empatia:</span>                  </div>

                              <span className="ml-2 font-medium">{avaliacao.empatia}/5</span>                </div>

                            </div>              </CardContent>

                          </div>            </Card>



                          {avaliacao.comentario && (            {/* Disciplina Favorita */}

                            <div className="mt-3 text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3">            <Card>

                              "{avaliacao.comentario}"              <CardHeader>

                            </div>                <CardTitle>Sua Disciplina Favorita</CardTitle>

                          )}                <CardDescription>Baseado em suas avaliações positivas</CardDescription>

                        </div>              </CardHeader>

                      </div>              <CardContent>

                    </CardContent>                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">

                  </Card>                  <div>

                );                    <p className="text-2xl font-bold">{mockData.estatisticas.disciplinaFavorita}</p>

              })}                    <p className="text-sm text-muted-foreground">Maior engajamento e compreensão</p>

            </CardContent>                  </div>

          </Card>                  <div className="text-4xl">📚</div>

        </TabsContent>                </div>

              </CardContent>

        {/* Tab: Check-ins */}            </Card>

        <TabsContent value="checkins" className="space-y-4">          </TabsContent>

          <Card>        </Tabs>

            <CardHeader>      </div>

              <CardTitle>Check-ins Diários</CardTitle>    </div>

              <CardDescription>  )

                Registro diário de bem-estar e estado emocional}

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
