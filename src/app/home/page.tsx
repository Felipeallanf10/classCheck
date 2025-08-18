'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smile, BookOpen, Calendar, Star, TrendingUp, Users } from "lucide-react"
import { GraficoHumor } from "@/components/GraficoHumor"
import { CalendarioEventos } from "@/components/CalendarioEventos"
import { DrawerAvaliacao } from "@/components/DrawerAvaliacao"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { MetricCard, ClassCheckMetrics } from "@/components/ui/metrics-progress"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const { toast } = useToast()
  
  // Mock data - em produção viria de uma API
  const userName = "Ana Carolina"
  const userStats = {
    aulasAvaliadas: 12,
    mediaHumor: 4.2,
    sequenciaAtiva: 7,
    proximasAulas: 3
  }

  return (
    <SidebarInset>
      <main className="min-h-screen bg-background text-foreground">
        <div className="flex-1 p-4 lg:p-8 mx-auto space-y-6 pb-20">
          {/* Header com Toggle de Tema */}
          <SidebarTrigger className="-ml-1" />

          <header className="flex flex-wrap justify-between items-center py-4 px-4 sm:px-4 md:px-8 lg:px-10 xl:px-20">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Olá, {userName}! 👋
              </h1>
              <p className="text-muted-foreground text-lg">
                Como você está se sentindo hoje?
              </p>
            </div>
            <div className="flex gap-2 md:gap-4 lg:gap-6">
              <DrawerAvaliacao/>
            </div>
          </header>

          {/* Estatísticas principais com ClassCheckMetrics */}
          <ClassCheckMetrics 
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
            userType="aluno"
            data={{
              totalAulas: 25,
              aulasCompletadas: userStats.aulasAvaliadas,
              avaliacaoMedia: userStats.mediaHumor,
              totalProfessores: 5
            }}
          />

          {/* Atividade Recente */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 bg-gradient-to-br from-card to-card/80 backdrop-blur border-primary-200/30 hover:border-primary-300/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-primary-700 dark:text-primary-300">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border-l-4 border-success-500">
                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-success-900 dark:text-success-100">Aula avaliada</div>
                      <div className="text-xs text-success-700 dark:text-success-300">História - há 2 horas</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-primary-900 dark:text-primary-100">Humor registrado</div>
                      <div className="text-xs text-primary-700 dark:text-primary-300">😊 Satisfeito - há 3 horas</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20 border-l-4 border-warning-500">
                    <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-warning-900 dark:text-warning-100">Nova conquista</div>
                      <div className="text-xs text-warning-700 dark:text-warning-300">7 dias consecutivos - ontem</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <GraficoHumor />
                </div>
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <CalendarioEventos />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </SidebarInset>
  )
}
