'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalStats } from "@/components/dashboard/PersonalStats"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { DashboardUnificado } from "@/components/dashboard/DashboardUnificado"
import { Smile, BookOpen, BarChart3, Calendar, Cog, Heart, Star, MessageSquare, Users } from "lucide-react"

interface UnifiedDashboardProps {
  userName?: string
}

export function UnifiedDashboard({ userName = "Professor" }: UnifiedDashboardProps) {
  const [activeTab, setActiveTab] = useState("inicio")

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

  const quickActions = [
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
      title: "Registrar Humor",
      description: "Como você está se sentindo?",
      icon: <Heart className="w-5 h-5" />,
      href: "/avaliacao-socioemocional",
      color: "hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950"
    },
    {
      id: "3",
      title: "Ver Próximas Aulas",
      description: "Confira sua agenda",
      icon: <Calendar className="w-5 h-5" />,
      href: "/aulas",
      color: "hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
    },
    {
      id: "4",
      title: "Enviar Feedback",
      description: "Compartilhe suas ideias",
      icon: <MessageSquare className="w-5 h-5" />,
      href: "/contato",
      color: "hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950"
    }
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="inicio" className="flex items-center gap-2">
            <Smile className="w-4 h-4" />
            Início
          </TabsTrigger>
          <TabsTrigger value="analises" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Análises
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="calendario" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendário
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2">
            <Cog className="w-4 h-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inicio" className="space-y-6">
          <PersonalStats userName={userName} userStats={userStats} />
          <ActivityFeed activities={activities} quickActions={quickActions} />
        </TabsContent>

        <TabsContent value="analises">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Análises Detalhadas</h2>
            <DashboardUnificado />
          </div>
        </TabsContent>

        <TabsContent value="relatorios">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Relatórios e Exportação</h2>
            <p className="text-muted-foreground">
              Esta seção será integrada com a funcionalidade de exportação em breve.
            </p>
            {/* Aqui será integrado o conteúdo de /relatorios e /exportacao */}
          </div>
        </TabsContent>

        <TabsContent value="calendario">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Calendário de Aulas</h2>
            <p className="text-muted-foreground">
              Visualize e gerencie suas aulas e avaliações.
            </p>
            {/* Aqui será colocado o calendário */}
          </div>
        </TabsContent>

        <TabsContent value="configuracoes">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Configurações</h2>
            <p className="text-muted-foreground">
              Personalize suas preferências e configurações do sistema.
            </p>
            {/* Aqui serão as configurações */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}