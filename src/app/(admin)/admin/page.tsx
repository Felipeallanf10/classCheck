import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, BookOpen, TrendingUp, AlertTriangle, School } from 'lucide-react'
import { DatabaseWarmup } from '@/components/DatabaseWarmup'

async function getAdminDashboardData() {
  const [
    totalUsuarios,
    totalAlunos,
    totalProfessores,
    totalTurmas,
    totalAulas,
    totalAvaliacoes,
    usuariosInativos,
    turmasInativas,
  ] = await Promise.all([
    prisma.usuario.count(),
    prisma.usuario.count({ where: { role: 'ALUNO' } }),
    prisma.usuario.count({ where: { role: 'PROFESSOR' } }),
    prisma.turma.count(),
    prisma.aula.count(),
    prisma.avaliacaoSocioemocional.count(),
    prisma.usuario.count({ where: { ativo: false } }),
    prisma.turma.count({ where: { ativa: false } }),
  ])

  // Estatísticas por role
  const usuariosPorRole = await prisma.usuario.groupBy({
    by: ['role'],
    _count: true
  })

  // Últimas atividades
  const ultimasAvaliacoes = await prisma.avaliacaoSocioemocional.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      usuario: { select: { nome: true, role: true } },
      aula: { 
        select: { 
          titulo: true, 
          professor: { select: { nome: true } }
        } 
      }
    }
  })

  return {
    totalUsuarios,
    totalAlunos,
    totalProfessores,
    totalTurmas,
    totalAulas,
    totalAvaliacoes,
    usuariosInativos,
    turmasInativas,
    usuariosPorRole,
    ultimasAvaliacoes
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user.id) {
    return null
  }

  return (
    <Suspense fallback={<DatabaseWarmup />}>
      <AdminDashboardContent />
    </Suspense>
  )
}

async function AdminDashboardContent() {
  const data = await getAdminDashboardData()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Painel Administrativo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visão geral completa do sistema ClassCheck
        </p>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{data.totalUsuarios}</div>
            <p className="text-xs text-gray-600">
              {data.usuariosInativos > 0 && `${data.usuariosInativos} inativos`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alunos
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.totalAlunos}</div>
            <p className="text-xs text-gray-600">
              Estudantes ativos
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Professores
            </CardTitle>
            <School className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.totalProfessores}</div>
            <p className="text-xs text-gray-600">
              Docentes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Turmas
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.totalTurmas}</div>
            <p className="text-xs text-gray-600">
              {data.turmasInativas > 0 && `${data.turmasInativas} inativas`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de atividades */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aulas Cadastradas
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalAulas}</div>
            <p className="text-xs text-muted-foreground">
              Total de aulas no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avaliações Realizadas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalAvaliacoes}</div>
            <p className="text-xs text-muted-foreground">
              Avaliações socioemocionais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Participação
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalAulas > 0 
                ? ((data.totalAvaliacoes / data.totalAulas) * 100).toFixed(0) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Aulas com avaliação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Role */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Distribuição de Usuários</CardTitle>
          <CardDescription>Usuários cadastrados por tipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.usuariosPorRole.map((item) => {
              const porcentagem = (item._count / data.totalUsuarios) * 100
              const cores = {
                ADMIN: 'bg-purple-500',
                PROFESSOR: 'bg-green-500',
                ALUNO: 'bg-blue-500'
              }
              return (
                <div key={item.role}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.role}</span>
                    <span className="text-sm text-gray-600">{item._count} ({porcentagem.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${cores[item.role as keyof typeof cores]}`}
                      style={{ width: `${porcentagem}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Últimas Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas avaliações realizadas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {data.ultimasAvaliacoes.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma avaliação registrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {data.ultimasAvaliacoes.map((avaliacao) => (
                <div
                  key={avaliacao.id}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{avaliacao.usuario.nome}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        avaliacao.usuario.role === 'ALUNO' ? 'bg-blue-100 text-blue-700' :
                        avaliacao.usuario.role === 'PROFESSOR' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {avaliacao.usuario.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Aula: {avaliacao.aula.titulo} • Prof. {avaliacao.aula.professor.nome}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(avaliacao.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
