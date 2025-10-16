'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  Filter
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Mock data - Em produção, virá da API
const mockData = {
  avaliacoesAulas: [
    {
      id: '1',
      aula: { titulo: 'Geografia – Continentes', materia: 'Geografia', professor: 'Prof. Ana' },
      data: new Date('2025-10-14'),
      socioemocional: { estado: 'Animado', valencia: 0.8, ativacao: 0.6 },
      didatica: { compreensao: 5, ritmo: 3, recursos: 5, engajamento: 4 }
    },
    {
      id: '2',
      aula: { titulo: 'Matemática – Funções', materia: 'Matemática', professor: 'Prof. Carlos' },
      data: new Date('2025-10-13'),
      socioemocional: { estado: 'Concentrado', valencia: 0.4, ativacao: 0.2 },
      didatica: { compreensao: 3, ritmo: 5, recursos: 3, engajamento: 3 }
    },
  ],
  avaliacoesProfessores: [
    {
      id: '1',
      professor: { nome: 'Prof. Ana Costa', materia: 'Geografia', avatar: null },
      data: new Date('2025-10-01'),
      periodo: '2025-10',
      mediaGeral: 4.8
    },
  ],
  checkIns: [
    {
      id: '1',
      data: new Date('2025-10-15'),
      estado: 'Calmo',
      valencia: 0.6,
      ativacao: -0.3
    },
    {
      id: '2',
      data: new Date('2025-10-14'),
      estado: 'Animado',
      valencia: 0.8,
      ativacao: 0.7
    },
  ],
  estatisticas: {
    totalAvaliacoesAulas: 12,
    totalAvaliacoesProfessores: 3,
    totalCheckIns: 45,
    mediaHumor: 4.2,
    sequenciaAtual: 7,
    disciplinaFavorita: 'Geografia'
  }
}

export default function MinhasAvaliacoesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('aulas')

  const getEstadoEmoji = (estado: string) => {
    const emojis: Record<string, string> = {
      'Animado': '😄', 'Empolgado': '🤩', 'Calmo': '😌', 
      'Relaxado': '😊', 'Entediado': '😐', 'Cansado': '😴',
      'Ansioso': '😰', 'Estressado': '😫', 'Concentrado': '🤔',
      'Neutro': '😐'
    }
    return emojis[estado] || '🙂'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Minhas Avaliações</h1>
          <p className="text-muted-foreground">
            Acompanhe seu histórico completo de avaliações e check-ins
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="aulas" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Aulas</span>
              <Badge variant="secondary" className="ml-1">
                {mockData.avaliacoesAulas.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="professores" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Professores</span>
              <Badge variant="secondary" className="ml-1">
                {mockData.avaliacoesProfessores.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="checkins" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Check-ins</span>
              <Badge variant="secondary" className="ml-1">
                {mockData.checkIns.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Estatísticas</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Aulas */}
          <TabsContent value="aulas" className="space-y-4">
            {/* Busca e Filtros */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por aula, professor ou disciplina..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Lista de Avaliações de Aulas */}
            <div className="grid gap-4 md:grid-cols-2">
              {mockData.avaliacoesAulas.map((avaliacao) => (
                <Card key={avaliacao.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {avaliacao.aula.titulo}
                        </CardTitle>
                        <CardDescription>
                          {avaliacao.aula.professor} • {avaliacao.aula.materia}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {format(avaliacao.data, "dd 'de' MMM", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Estado Emocional */}
                    <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <span className="text-2xl">{getEstadoEmoji(avaliacao.socioemocional.estado)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{avaliacao.socioemocional.estado}</p>
                        <p className="text-xs text-muted-foreground">
                          V: {avaliacao.socioemocional.valencia.toFixed(1)} • 
                          A: {avaliacao.socioemocional.ativacao.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    {/* Avaliação Didática */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Compreensão</p>
                        <div className="flex gap-0.5">
                          {[...Array(avaliacao.didatica.compreensao)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-500" fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Engajamento</p>
                        <div className="flex gap-0.5">
                          {[...Array(avaliacao.didatica.engajamento)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-500" fill="currentColor" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {mockData.avaliacoesAulas.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Nenhuma avaliação ainda</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comece avaliando suas aulas para ver seu histórico aqui
                  </p>
                  <Button onClick={() => router.push('/aulas')}>
                    Ver Aulas Disponíveis
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Professores */}
          <TabsContent value="professores" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {mockData.avaliacoesProfessores.map((avaliacao) => (
                <Card key={avaliacao.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {avaliacao.professor.nome}
                        </CardTitle>
                        <CardDescription>
                          {avaliacao.professor.materia}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {avaliacao.mediaGeral.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">Média</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Período: {avaliacao.periodo}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(avaliacao.data, "dd/MM/yyyy")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {mockData.avaliacoesProfessores.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Nenhuma avaliação de professor</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Avalie seus professores para ajudá-los a melhorar
                  </p>
                  <Button onClick={() => router.push('/professores')}>
                    Ver Professores
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Check-ins */}
          <TabsContent value="checkins" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {mockData.checkIns.map((checkIn) => (
                <Card key={checkIn.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <div className="text-4xl">{getEstadoEmoji(checkIn.estado)}</div>
                      <div>
                        <p className="font-semibold text-lg">{checkIn.estado}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(checkIn.data, "dd 'de' MMMM", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex justify-center gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">V:</span>{' '}
                          <span className="font-medium">{checkIn.valencia.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">A:</span>{' '}
                          <span className="font-medium">{checkIn.ativacao.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {mockData.checkIns.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Nenhum check-in registrado</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Faça check-ins diários para acompanhar seu bem-estar
                  </p>
                  <Button onClick={() => router.push('/check-in')}>
                    Fazer Check-in Agora
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center">
              <Button 
                variant="outline"
                onClick={() => router.push('/relatorios/meu-estado-emocional')}
              >
                <Activity className="h-4 w-4 mr-2" />
                Ver Jornada Emocional Completa
              </Button>
            </div>
          </TabsContent>

          {/* Tab: Estatísticas */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Total de Avaliações */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Avaliações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold">{mockData.estatisticas.totalAvaliacoesAulas}</p>
                    <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Aulas avaliadas</p>
                </CardContent>
              </Card>

              {/* Sequência Ativa */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Sequência Ativa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold">{mockData.estatisticas.sequenciaAtual}</p>
                    <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Dias consecutivos</p>
                </CardContent>
              </Card>

              {/* Média de Humor */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Média de Humor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold">{mockData.estatisticas.mediaHumor.toFixed(1)}</p>
                    <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(Math.round(mockData.estatisticas.mediaHumor))].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500" fill="currentColor" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conquistas */}
            <Card>
              <CardHeader>
                <CardTitle>Suas Conquistas</CardTitle>
                <CardDescription>Badges desbloqueados por engajamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-semibold text-sm">Primeira Avaliação</p>
                      <p className="text-xs text-muted-foreground">Desbloqueado em 01/10</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <Award className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    <div>
                      <p className="font-semibold text-sm">Sequência de 7 Dias</p>
                      <p className="text-xs text-muted-foreground">Desbloqueado hoje</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg opacity-50">
                    <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-semibold text-sm">Avaliador Dedicado</p>
                      <p className="text-xs text-muted-foreground">38 avaliações restantes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disciplina Favorita */}
            <Card>
              <CardHeader>
                <CardTitle>Sua Disciplina Favorita</CardTitle>
                <CardDescription>Baseado em suas avaliações positivas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                  <div>
                    <p className="text-2xl font-bold">{mockData.estatisticas.disciplinaFavorita}</p>
                    <p className="text-sm text-muted-foreground">Maior engajamento e compreensão</p>
                  </div>
                  <div className="text-4xl">📚</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
