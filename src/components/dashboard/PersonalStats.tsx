'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smile, BookOpen, Calendar, Star, TrendingUp, Users } from "lucide-react"

interface PersonalStatsProps {
  userName: string
  userStats: {
    aulasAvaliadas: number
    mediaHumor: number
    sequenciaAtiva: number
    proximasAulas: number
  }
}

export function PersonalStats({ userName, userStats }: PersonalStatsProps) {
  return (
    <div className="space-y-6">
      {/* Header Pessoal */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Olá, {userName}! 👋
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Como você está se sentindo hoje?
        </p>
      </div>

      {/* Estatísticas Pessoais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-blue-700 dark:text-blue-400">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 group-hover:scale-110 transition-transform">
                <Smile className="w-5 h-5" />
              </div>
              Humor Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-foreground">{userStats.mediaHumor}/5</div>
              <p className="text-muted-foreground">Você se sente: 😊 Satisfeito</p>
              <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 bg-green-50 dark:bg-green-950/50 px-2 py-1 rounded-md w-fit">
                <TrendingUp className="w-3 h-3" />
                +0.3 esta semana
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-400">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              Aulas Avaliadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-foreground">{userStats.aulasAvaliadas}</div>
              <p className="text-muted-foreground">Este mês</p>
              <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 px-2 py-1 rounded-md w-fit">
                <Users className="w-3 h-3" />
                5 professores diferentes
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              Próximas Aulas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-foreground">{userStats.proximasAulas}</div>
              <p className="text-muted-foreground">Hoje</p>
              <div className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-2 py-1 rounded-md w-fit">
                Próxima às 14:00 - Matemática
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 group-hover:scale-110 transition-transform">
                <Star className="w-5 h-5" />
              </div>
              Sequência Ativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-foreground">{userStats.sequenciaAtiva}</div>
              <p className="text-muted-foreground">Dias consecutivos</p>
              <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-1 rounded-md w-fit">
                Continue assim! 🔥
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}