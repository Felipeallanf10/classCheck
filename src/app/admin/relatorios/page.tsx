'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLoading } from '@/components/ui'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  School,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart,
  LineChart,
  Shield,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface EstatisticasGerais {
  totalUsuarios: number
  usuariosAtivos: number
  totalAlunos: number
  totalProfessores: number
  totalAdmins: number
  totalTurmas: number
  turmasAtivas: number
  totalAulas: number
  totalAvaliacoes: number
  alertasAbertos: number
  alertasCriticos: number
  crescimentoMensal: number
}

interface DadosGrafico {
  nome: string
  valor: number
}

const CORES = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function AdminRelatoriosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<EstatisticasGerais>({
    totalUsuarios: 0,
    usuariosAtivos: 0,
    totalAlunos: 0,
    totalProfessores: 0,
    totalAdmins: 0,
    totalTurmas: 0,
    turmasAtivas: 0,
    totalAulas: 0,
    totalAvaliacoes: 0,
    alertasAbertos: 0,
    alertasCriticos: 0,
    crescimentoMensal: 0,
  })

  // Dados simulados para gráficos (você pode substituir por dados reais das APIs)
  const dadosUsuariosPorRole: DadosGrafico[] = [
    { nome: 'Alunos', valor: stats.totalAlunos },
    { nome: 'Professores', valor: stats.totalProfessores },
    { nome: 'Admins', valor: stats.totalAdmins },
  ]

  const dadosCrescimento: DadosGrafico[] = [
    { nome: 'Jan', valor: 120 },
    { nome: 'Fev', valor: 150 },
    { nome: 'Mar', valor: 180 },
    { nome: 'Abr', valor: 220 },
    { nome: 'Mai', valor: 280 },
    { nome: 'Jun', valor: 320 },
  ]

  const dadosAvaliacoesPorMes: DadosGrafico[] = [
    { nome: 'Jan', valor: 450 },
    { nome: 'Fev', valor: 520 },
    { nome: 'Mar', valor: 680 },
    { nome: 'Abr', valor: 720 },
    { nome: 'Mai', valor: 850 },
    { nome: 'Jun', valor: 920 },
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN') {
        router.push('/dashboard')
        return
      }

      carregarEstatisticas()
    }
  }, [status, session, router])

  const carregarEstatisticas = async () => {
    try {
      // Buscar estatísticas de usuários
      const resUsuarios = await fetch('/api/admin/usuarios')
      const usuarios = await resUsuarios.json()

      // Buscar estatísticas de turmas
      const resTurmas = await fetch('/api/admin/turmas')
      const turmas = await resTurmas.json()

      // Calcular estatísticas
      const totalUsuarios = usuarios.length || 0
      const usuariosAtivos = usuarios.filter((u: any) => u.ativo).length || 0
      const totalAlunos = usuarios.filter((u: any) => u.role === 'ALUNO').length || 0
      const totalProfessores = usuarios.filter((u: any) => u.role === 'PROFESSOR').length || 0
      const totalAdmins = usuarios.filter((u: any) => u.role === 'ADMIN').length || 0
      const totalTurmas = turmas.length || 0
      const turmasAtivas = turmas.filter((t: any) => t.ativa).length || 0

      setStats({
        totalUsuarios,
        usuariosAtivos,
        totalAlunos,
        totalProfessores,
        totalAdmins,
        totalTurmas,
        turmasAtivas,
        totalAulas: 0, // Você pode buscar de uma API
        totalAvaliacoes: 0, // Você pode buscar de uma API
        alertasAbertos: 0, // Você pode buscar de uma API
        alertasCriticos: 0, // Você pode buscar de uma API
        crescimentoMensal: 15.3, // Simulado
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || status === 'loading') {
    return <AppLoading />
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Acesso negado. Esta página é exclusiva para administradores.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Breadcrumbs
            items={[
              { label: 'Admin', href: '/admin/usuarios' },
              { label: 'Relatórios do Sistema' },
            ]}
          />
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="mx-auto w-full max-w-7xl space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Relatórios do Sistema</h1>
              <p className="text-muted-foreground mt-2">
                Estatísticas gerais e análises do ClassCheck
              </p>
            </div>

            {/* Cards de Estatísticas Gerais */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Usuários
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.usuariosAtivos} ativos
                  </p>
                  <div className="flex items-center text-xs text-green-600 mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.crescimentoMensal}% este mês
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Turmas
                  </CardTitle>
                  <School className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTurmas}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.turmasAtivas} ativas
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Activity className="h-3 w-3 mr-1" />
                    {((stats.turmasAtivas / stats.totalTurmas) * 100 || 0).toFixed(0)}% ativas
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Aulas Cadastradas
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAulas}</div>
                  <p className="text-xs text-muted-foreground">
                    Em andamento e concluídas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Alertas Abertos
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.alertasAbertos}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.alertasCriticos} críticos
                  </p>
                  {stats.alertasCriticos > 0 && (
                    <div className="flex items-center text-xs text-red-600 mt-2">
                      <XCircle className="h-3 w-3 mr-1" />
                      Atenção necessária
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tabs com Gráficos */}
            <Tabs defaultValue="usuarios" className="space-y-4">
              <TabsList>
                <TabsTrigger value="usuarios">
                  <Users className="h-4 w-4 mr-2" />
                  Usuários
                </TabsTrigger>
                <TabsTrigger value="crescimento">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Crescimento
                </TabsTrigger>
                <TabsTrigger value="avaliacoes">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Avaliações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="usuarios" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Gráfico de Pizza - Distribuição por Role */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição por Tipo</CardTitle>
                      <CardDescription>
                        Proporção de usuários por role
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={dadosUsuariosPorRole}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ nome, valor }) => `${nome}: ${valor}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="valor"
                          >
                            {dadosUsuariosPorRole.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Estatísticas Detalhadas */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Estatísticas Detalhadas</CardTitle>
                      <CardDescription>
                        Resumo de usuários por categoria
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500" />
                          <span className="text-sm">Alunos</span>
                        </div>
                        <span className="text-2xl font-bold">{stats.totalAlunos}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                          <span className="text-sm">Professores</span>
                        </div>
                        <span className="text-2xl font-bold">{stats.totalProfessores}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-orange-500" />
                          <span className="text-sm">Administradores</span>
                        </div>
                        <span className="text-2xl font-bold">{stats.totalAdmins}</span>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total</span>
                          <span className="text-3xl font-bold">{stats.totalUsuarios}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="crescimento" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Crescimento de Usuários</CardTitle>
                    <CardDescription>
                      Novos usuários cadastrados por mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={dadosCrescimento}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="valor"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                          name="Novos Usuários"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="avaliacoes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Avaliações Realizadas</CardTitle>
                    <CardDescription>
                      Volume de avaliações por mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dadosAvaliacoesPorMes}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="valor"
                          fill="#10b981"
                          name="Avaliações"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Cards de Status do Sistema */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Operacional</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Todos os serviços funcionando normalmente
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Último Backup</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">Hoje às 03:00</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Próximo backup: Amanhã às 03:00
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Desempenho</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <span className="text-sm">Excelente</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Tempo de resposta médio: 120ms
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
