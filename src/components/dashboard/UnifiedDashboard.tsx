'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalStats } from "@/components/dashboard/PersonalStats"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection"
import { CalendarioEventos } from "@/components/dashboard/CalendarioEventos"
import { ConfigurationSection } from "@/components/dashboard/ConfigurationSection"
import { Smile, BarChart3, FileText, Calendar, Settings, Heart, Star, MessageSquare, Users } from "lucide-react"

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
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 sm:justify-start sm:grid sm:grid-cols-4 h-auto sm:h-12 bg-card border p-1 sm:p-0">
            <TabsTrigger 
              value="inicio" 
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200 px-3 py-2 sm:px-4 sm:py-3 min-w-0 flex-1 sm:flex-none"
            >
              <Smile className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline text-sm sm:text-base truncate">Início</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analises" 
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200 px-3 py-2 sm:px-4 sm:py-3 min-w-0 flex-1 sm:flex-none"
            >
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline text-sm sm:text-base truncate">Análises</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calendario" 
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200 px-3 py-2 sm:px-4 sm:py-3 min-w-0 flex-1 sm:flex-none"
            >
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline text-sm sm:text-base truncate">Calendário</span>
            </TabsTrigger>
            <TabsTrigger 
              value="configuracoes" 
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200 px-3 py-2 sm:px-4 sm:py-3 min-w-0 flex-1 sm:flex-none"
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline text-sm sm:text-base truncate">Configurações</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 sm:mt-6">
            <TabsContent value="inicio" className="space-y-6 animate-in fade-in-50 duration-300">
              <PersonalStats userName={userName} userStats={userStats} />
              <ActivityFeed activities={activities} quickActions={quickActions} />
            </TabsContent>

            <TabsContent value="analises" className="animate-in fade-in-50 duration-300">
              <AnalyticsSection />
            </TabsContent>

            <TabsContent value="calendario" className="animate-in fade-in-50 duration-300">
              <CalendarioEventos />
            </TabsContent>

            <TabsContent value="configuracoes" className="animate-in fade-in-50 duration-300">
              <ConfigurationSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}