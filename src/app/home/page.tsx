'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smile, BookOpen, Calendar, Star, TrendingUp, Users } from "lucide-react"
import { GraficoHumor } from "@/components/GraficoHumor"
import { CalendarioEventos } from "@/components/CalendarioEventos"
import { DrawerAvaliacao } from "@/components/DrawerAvaliacao"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function HomePage() {
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
              <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
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

          {/* Estatísticas principais */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                  <Smile className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Humor Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{userStats.mediaHumor}/5</div>
                  <p className="text-muted-foreground">Você se sente: 😊 Satisfeito</p>
                  <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +0.3 esta semana
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-700 dark:text-pink-400">
                  <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Aulas Avaliadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{userStats.aulasAvaliadas}</div>
                  <p className="text-muted-foreground">Este mês</p>
                  <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    5 professores diferentes
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Próximas Aulas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{userStats.proximasAulas}</div>
                  <p className="text-muted-foreground">Hoje</p>
                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    Próxima às 14:00 - Matemática
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                  <Star className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Sequência Ativa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{userStats.sequenciaAtiva}</div>
                  <p className="text-muted-foreground">Dias consecutivos</p>
                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    Continue assim! 🔥
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Atividade Recente */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Aula avaliada</div>
                      <div className="text-xs text-muted-foreground">História - há 2 horas</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Humor registrado</div>
                      <div className="text-xs text-muted-foreground">😊 Satisfeito - há 3 horas</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Nova conquista</div>
                      <div className="text-xs text-muted-foreground">7 dias consecutivos - ontem</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <CalendarioEventos />
            </div>
              <div className="lg:col-span-3 space-y-6">
                <GraficoHumor />
              </div>
          </section>
        </div>
      </main>
    </SidebarInset>
  )
}


