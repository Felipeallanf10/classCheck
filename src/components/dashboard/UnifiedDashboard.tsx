'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalStats } from "@/components/dashboard/PersonalStats"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection"
import { CalendarioEventos } from "@/components/dashboard/CalendarioEventos"
import { ConfigurationSection } from "@/components/dashboard/ConfigurationSection"
import { Smile, BarChart3, FileText, Calendar, Settings, Heart, Star, MessageSquare, Users } from "lucide-react"
import { Role } from '@prisma/client'

interface UnifiedDashboardProps {
  userName?: string
  userRole?: Role
}

export function UnifiedDashboard({ userName = "Usuário", userRole = 'ALUNO' }: UnifiedDashboardProps) {
  const [activeTab, setActiveTab] = useState("inicio")

  // Configuração de tabs por role
  const tabsConfig = {
    ALUNO: [
      { value: "inicio", label: "Início", icon: Smile },
      { value: "atividades", label: "Minhas Atividades", icon: Heart },
      { value: "calendario", label: "Calendário", icon: Calendar },
    ],
    PROFESSOR: [
      { value: "inicio", label: "Início", icon: Smile },
      { value: "analytics", label: "Analytics", icon: BarChart3 },
      { value: "turmas", label: "Turmas", icon: Users },
      { value: "calendario", label: "Calendário", icon: Calendar },
    ],
    ADMIN: [
      { value: "inicio", label: "Início", icon: Smile },
      { value: "analytics", label: "Analytics", icon: BarChart3 },
      { value: "usuarios", label: "Usuários", icon: Users },
      { value: "configuracoes", label: "Configurações", icon: Settings },
    ],
  }

  const tabs = tabsConfig[userRole] || tabsConfig.ALUNO

  // Dados simulados - em produção viriam da API
  const userStats = {
    aulasAvaliadas: 28,
    mediaHumor: 4.2,
    sequenciaAtiva: 7,
    proximasAulas: 3
  }

  const activities = [
    {
      id: "1",
      type: "avaliacao" as const,
      title: "Avaliação de Matemática finalizada",
      subtitle: "Você avaliou a aula de Álgebra Linear",
      time: "há 2 horas",
      status: "completo" as const,
      metadata: {
        professor: "Prof. Silva",
        materia: "Matemática",
        sala: "A-201",
        rating: 5
      }
    },
    {
      id: "2",
      type: "humor" as const,
      title: "Check-in de humor realizado",
      subtitle: "Você registrou estar se sentindo motivado",
      time: "há 4 horas",
      status: "completo" as const
    },
    {
      id: "3",
      type: "aula" as const,
      title: "Nova aula disponível",
      subtitle: "Física Quântica - Prof. Santos",
      time: "há 6 horas",
      status: "pendente" as const,
      metadata: {
        professor: "Prof. Santos",
        materia: "Física",
        sala: "B-105"
      }
    },
    {
      id: "4",
      type: "comentario" as const,
      title: "Feedback recebido",
      subtitle: "Prof. Silva respondeu ao seu comentário",
      time: "ontem",
      status: "completo" as const,
      metadata: {
        professor: "Prof. Silva",
        materia: "Matemática"
      }
    },
    {
      id: "5",
      type: "avaliacao" as const,
      title: "Avaliação pendente",
      subtitle: "História do Brasil - Prof. Costa",
      time: "ontem",
      status: "pendente" as const,
      metadata: {
        professor: "Prof. Costa",
        materia: "História",
        sala: "C-302"
      }
    }
  ]

  // Ações rápidas por role
  const quickActionsConfig = {
    ALUNO: [
      {
        id: "1",
        title: "Avaliar Aula",
        description: "Avalie sua última aula",
        icon: <Star className="w-5 h-5" />,
        href: "/avaliacoes",
        color: "hover:border-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-950"
      },
      {
        id: "2",
        title: "Avaliar Professor",
        description: "Avalie seus professores",
        icon: <Users className="w-5 h-5" />,
        href: "/professores",
        color: "hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950"
      },
      {
        id: "3",
        title: "Registrar Humor",
        description: "Como você está se sentindo?",
        icon: <Heart className="w-5 h-5" />,
        href: "/avaliacao-socioemocional",
        color: "hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950"
      },
      {
        id: "4",
        title: "Ver Próximas Aulas",
        description: "Confira sua agenda",
        icon: <Calendar className="w-5 h-5" />,
        href: "/aulas",
        color: "hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
      }
    ],
    PROFESSOR: [
      {
        id: "1",
        title: "Minhas Turmas",
        description: "Gerencie suas turmas",
        icon: <Users className="w-5 h-5" />,
        href: "/professor/turmas",
        color: "hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
      },
      {
        id: "2",
        title: "Analytics",
        description: "Veja relatórios das turmas",
        icon: <BarChart3 className="w-5 h-5" />,
        href: "/analytics",
        color: "hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950"
      },
      {
        id: "3",
        title: "Criar Aula",
        description: "Agende uma nova aula",
        icon: <Calendar className="w-5 h-5" />,
        href: "/aulas",
        color: "hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950"
      },
      {
        id: "4",
        title: "Relatórios",
        description: "Relatórios da turma",
        icon: <FileText className="w-5 h-5" />,
        href: "/relatorios",
        color: "hover:border-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-950"
      }
    ],
    ADMIN: [
      {
        id: "1",
        title: "Gerenciar Usuários",
        description: "CRUD de usuários",
        icon: <Users className="w-5 h-5" />,
        href: "/admin/usuarios",
        color: "hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
      },
      {
        id: "2",
        title: "Gerenciar Turmas",
        description: "CRUD de turmas",
        icon: <Users className="w-5 h-5" />,
        href: "/admin/turmas",
        color: "hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950"
      },
      {
        id: "3",
        title: "Analytics do Sistema",
        description: "Visão geral do sistema",
        icon: <BarChart3 className="w-5 h-5" />,
        href: "/analytics",
        color: "hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950"
      },
      {
        id: "4",
        title: "Configurações",
        description: "Configurar o sistema",
        icon: <Settings className="w-5 h-5" />,
        href: "/configuracoes",
        color: "hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950"
      }
    ]
  }

  const quickActions = quickActionsConfig[userRole] || quickActionsConfig.ALUNO

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 sm:justify-start sm:grid h-auto sm:h-12 bg-card border p-1 sm:p-0" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200 px-3 py-2 sm:px-4 sm:py-3 min-w-0 flex-1 sm:flex-none"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden xs:inline text-sm sm:text-base truncate">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <div className="mt-4 sm:mt-6">
            <TabsContent value="inicio" className="space-y-6 animate-in fade-in-50 duration-300">
              <PersonalStats userName={userName} userStats={userStats} />
              <ActivityFeed activities={activities} quickActions={quickActions} />
            </TabsContent>

            {/* Tab Analytics - PROFESSOR e ADMIN */}
            {(userRole === 'PROFESSOR' || userRole === 'ADMIN') && (
              <TabsContent value="analytics" className="animate-in fade-in-50 duration-300">
                <AnalyticsSection />
              </TabsContent>
            )}

            {/* Tab Turmas - PROFESSOR */}
            {userRole === 'PROFESSOR' && (
              <TabsContent value="turmas" className="animate-in fade-in-50 duration-300">
                <div className="bg-card p-6 rounded-lg border">
                  <h2 className="text-2xl font-bold mb-4">Minhas Turmas</h2>
                  <p className="text-muted-foreground">
                    Conteúdo das turmas em desenvolvimento. 
                    <a href="/professor/turmas" className="text-primary hover:underline ml-1">Ver lista completa</a>
                  </p>
                </div>
              </TabsContent>
            )}

            {/* Tab Atividades - ALUNO */}
            {userRole === 'ALUNO' && (
              <TabsContent value="atividades" className="animate-in fade-in-50 duration-300">
                <ActivityFeed activities={activities} quickActions={quickActions} />
              </TabsContent>
            )}

            {/* Tab Calendário - ALUNO e PROFESSOR */}
            {(userRole === 'ALUNO' || userRole === 'PROFESSOR') && (
              <TabsContent value="calendario" className="animate-in fade-in-50 duration-300">
                <CalendarioEventos />
              </TabsContent>
            )}

            {/* Tab Usuários - ADMIN */}
            {userRole === 'ADMIN' && (
              <TabsContent value="usuarios" className="animate-in fade-in-50 duration-300">
                <div className="bg-card p-6 rounded-lg border">
                  <h2 className="text-2xl font-bold mb-4">Gerenciar Usuários</h2>
                  <p className="text-muted-foreground">
                    CRUD de usuários em desenvolvimento.
                    <a href="/admin/usuarios" className="text-primary hover:underline ml-1">Ver lista completa</a>
                  </p>
                </div>
              </TabsContent>
            )}

            {/* Tab Configurações - ADMIN */}
            {userRole === 'ADMIN' && (
              <TabsContent value="configuracoes" className="animate-in fade-in-50 duration-300">
                <ConfigurationSection />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  )
}