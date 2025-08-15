// app/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smile, BookOpen, Calendar, Star } from "lucide-react"
import { GraficoHumor } from "@/components/GraficoHumor"
import { CalendarioEventos } from "@/components/CalendarioEventos"
import { DrawerAvaliacao } from "@/components/DrawerAvaliacao"
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  return (
      <SidebarInset>
        <main className="min-h-screen bg-background text-foreground">
          {/* Conteúdo principal */}
          <div className="flex-1 p-4 lg:p-8 mx-auto space-y-6 pb-20">
            {/* Header com Toggle de Tema */}
            <SidebarTrigger className="-ml-1" />

            <header className="flex flex-wrap justify-between items-center py-4 px-4 sm:px-4 md:px-8 lg:px-10 xl:px-20">
              <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Dashboard do Aluno</h1>
              <div className="flex gap-2 md:gap-4 lg:gap-6">
                <DrawerAvaliacao/>
              </div>
            </header>

            {/* Grid de Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                    <Smile className="w-5 h-5" />
                    Humor do Dia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Você se sente hoje: 😊</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-pink-700 dark:text-pink-400">
                    <BookOpen className="w-5 h-5" />
                    Aulas Avaliadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">3 aulas avaliadas esta semana</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <Calendar className="w-5 h-5" />
                    Próximos Eventos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Nenhum evento nos próximos dias</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                    <Star className="w-5 h-5" />
                    Aulas Favoritas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">2 aulas salvas para revisar depois</p>
                </CardContent>
              </Card>
            </section>

            <section className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-4">
              <GraficoHumor />
              <CalendarioEventos />
            </section>
          </div>
        </main>
      </SidebarInset>

  )
}
