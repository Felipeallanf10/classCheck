import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, TrendingUp, AlertCircle } from 'lucide-react'

async function getProfessorDashboardData(professorId: string) {
  const [
    turmasProfessor,
    totalAulas,
    totalAvaliacoes,
    alertasAlunos,
  ] = await Promise.all([
    // Turmas do professor
    prisma.turmaProfessor.findMany({
      where: { professorId: parseInt(professorId) },
      include: {
        turma: {
          include: {
            _count: {
              select: { alunos: true }
            }
          }
        }
      }
    }),

    // Total de aulas ministradas
    prisma.aula.count({
      where: { professorId: parseInt(professorId) }
    }),

    // Total de avaliações recebidas
    prisma.avaliacaoDidatica.count({
      where: {
        aula: {
          professorId: parseInt(professorId)
        }
      }
    }),

    // Alunos com valência muito negativa (alerta)
    prisma.avaliacaoSocioemocional.findMany({
      where: {
        aula: {
          professorId: parseInt(professorId)
        },
        valencia: {
          lt: -0.5 // Muito negativo
        },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 dias
        }
      },
      include: {
        usuario: {
          select: { id: true, nome: true }
        },
        aula: {
          select: { titulo: true, materia: true, dataHora: true }
        }
      },
      distinct: ['usuarioId'],
      take: 5
    })
  ])

  // Calcular média de avaliação didática
  const mediaDidatica = await prisma.avaliacaoDidatica.aggregate({
    where: {
      aula: {
        professorId: parseInt(professorId)
      }
    },
    _avg: {
      compreensaoConteudo: true,
      engajamento: true,
      ritmoAula: true,
      recursosDidaticos: true
    }
  })

  const mediaGeral = mediaDidatica._avg.compreensaoConteudo && mediaDidatica._avg.engajamento
    ? (
        (mediaDidatica._avg.compreensaoConteudo +
        mediaDidatica._avg.engajamento +
        mediaDidatica._avg.ritmoAula! +
        mediaDidatica._avg.recursosDidaticos!) / 4
      ).toFixed(1)
    : '0.0'

  return {
    turmasProfessor,
    totalAulas,
    totalAvaliacoes,
    alertasAlunos,
    mediaGeral: parseFloat(mediaGeral),
    totalAlunos: turmasProfessor.reduce((acc, tp) => acc + tp.turma._count.alunos, 0)
  }
}

export default async function ProfessorDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user.id) {
    return null
  }

  const data = await getProfessorDashboardData(session.user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard do Professor
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visão geral das suas turmas e desempenho didático
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Turmas
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.turmasProfessor.length}</div>
            <p className="text-xs text-muted-foreground">
              {data.totalAlunos} alunos no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aulas Ministradas
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalAulas}</div>
            <p className="text-xs text-muted-foreground">
              {data.totalAvaliacoes} avaliações recebidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avaliação Didática
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              data.mediaGeral >= 4 ? 'text-green-600' :
              data.mediaGeral >= 3 ? 'text-yellow-600' : 'text-orange-600'
            }`}>
              {data.mediaGeral}/5.0
            </div>
            <p className="text-xs text-muted-foreground">
              Média geral das avaliações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertas
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              data.alertasAlunos.length > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {data.alertasAlunos.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Alunos precisando atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Alunos */}
      {data.alertasAlunos.length > 0 && (
        <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-100">
              ⚠️ Alunos Precisando de Atenção
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              Estes alunos apresentaram estado emocional muito negativo nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.alertasAlunos.map((alerta) => (
                <div
                  key={alerta.id}
                  className="flex items-start justify-between p-4 bg-white dark:bg-gray-900 border border-red-200 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {alerta.usuario.nome}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Aula: {alerta.aula.titulo} • {alerta.aula.materia}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alerta.aula.dataHora).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                      })}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    {alerta.estadoPrimario}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Minhas Turmas */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Turmas</CardTitle>
          <CardDescription>Turmas em que você leciona</CardDescription>
        </CardHeader>
        <CardContent>
          {data.turmasProfessor.length === 0 ? (
            <p className="text-sm text-gray-500">Você ainda não está vinculado a nenhuma turma.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.turmasProfessor.map((turmaProfessor) => (
                <div
                  key={turmaProfessor.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {turmaProfessor.turma.nome}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {turmaProfessor.materia}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      turmaProfessor.turma.ativa 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {turmaProfessor.turma.ativa ? 'Ativa' : 'Inativa'}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>👥 {turmaProfessor.turma._count.alunos} alunos</span>
                    <span>📅 {turmaProfessor.turma.periodo}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Código: {turmaProfessor.turma.codigo}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
