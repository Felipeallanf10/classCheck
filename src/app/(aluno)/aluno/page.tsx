import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, TrendingUp, Calendar, Award } from 'lucide-react'

async function getDashboardData(usuarioId: string) {
  const [
    totalAvaliacoes,
    ultimasAvaliacoes,
    turmasAluno,
    mediaValencia,
  ] = await Promise.all([
    // Total de avaliações feitas
    prisma.avaliacaoSocioemocional.count({
      where: { usuarioId: parseInt(usuarioId) }
    }),
    
    // Últimas 5 avaliações
    prisma.avaliacaoSocioemocional.findMany({
      where: { usuarioId: parseInt(usuarioId) },
      include: {
        aula: {
          include: {
            professor: {
              select: { nome: true, materia: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),

    // Turmas do aluno
    prisma.turmaAluno.findMany({
      where: { alunoId: parseInt(usuarioId) },
      include: {
        turma: true
      }
    }),

    // Média de valência (bem-estar emocional)
    prisma.avaliacaoSocioemocional.aggregate({
      where: { usuarioId: parseInt(usuarioId) },
      _avg: { valencia: true }
    })
  ])

  return {
    totalAvaliacoes,
    ultimasAvaliacoes,
    turmasAluno,
    mediaValencia: mediaValencia._avg.valencia || 0
  }
}

export default async function AlunoDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user.id) {
    return null
  }

  const data = await getDashboardData(session.user.id)

  // Interpretar média de valência
  const getEstadoEmocional = (valencia: number) => {
    if (valencia >= 0.5) return { texto: 'Muito Positivo', cor: 'text-green-600', bg: 'bg-green-100' }
    if (valencia >= 0.2) return { texto: 'Positivo', cor: 'text-green-500', bg: 'bg-green-50' }
    if (valencia >= -0.2) return { texto: 'Neutro', cor: 'text-yellow-600', bg: 'bg-yellow-50' }
    if (valencia >= -0.5) return { texto: 'Negativo', cor: 'text-orange-500', bg: 'bg-orange-50' }
    return { texto: 'Muito Negativo', cor: 'text-red-600', bg: 'bg-red-100' }
  }

  const estadoEmocional = getEstadoEmocional(data.mediaValencia)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Meu Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Acompanhe seu progresso e bem-estar emocional
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Avaliações
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalAvaliacoes}</div>
            <p className="text-xs text-muted-foreground">
              Avaliações realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bem-estar Emocional
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${estadoEmocional.cor}`}>
              {estadoEmocional.texto}
            </div>
            <p className="text-xs text-muted-foreground">
              Média das suas avaliações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Minhas Turmas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.turmasAluno.length}</div>
            <p className="text-xs text-muted-foreground">
              Turmas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conquistas
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalAvaliacoes >= 10 ? '🏆' : '🎯'}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.totalAvaliacoes >= 10 ? 'Avaliador Experiente' : 'Continue avaliando!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Minhas Turmas */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Minhas Turmas</CardTitle>
          <CardDescription>Turmas em que você está matriculado</CardDescription>
        </CardHeader>
        <CardContent>
          {data.turmasAluno.length === 0 ? (
            <p className="text-sm text-gray-500">Você ainda não está matriculado em nenhuma turma.</p>
          ) : (
            <div className="space-y-3">
              {data.turmasAluno.map((turmaAluno) => (
                <div
                  key={turmaAluno.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {turmaAluno.turma.nome}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Código: {turmaAluno.turma.codigo} • {turmaAluno.turma.periodo}
                      {turmaAluno.matricula && ` • Matrícula: ${turmaAluno.matricula}`}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    turmaAluno.turma.ativa 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {turmaAluno.turma.ativa ? 'Ativa' : 'Inativa'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Últimas Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Avaliações</CardTitle>
          <CardDescription>Suas 5 avaliações mais recentes</CardDescription>
        </CardHeader>
        <CardContent>
          {data.ultimasAvaliacoes.length === 0 ? (
            <p className="text-sm text-gray-500">Você ainda não fez nenhuma avaliação.</p>
          ) : (
            <div className="space-y-4">
              {data.ultimasAvaliacoes.map((avaliacao) => {
                const estado = getEstadoEmocional(avaliacao.valencia)
                return (
                  <div
                    key={avaliacao.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {avaliacao.aula.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {avaliacao.aula.professor.nome} • {avaliacao.aula.materia}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(avaliacao.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${estado.bg} ${estado.cor}`}>
                      {avaliacao.estadoPrimario}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
