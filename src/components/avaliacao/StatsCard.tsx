'use client'

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, BarChart3, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  totalAvaliacoes: number
  mediaHumor: number
  mediaNota: number
  ultimaAvaliacao?: Date | null
  className?: string
}

export function StatsCard({
  totalAvaliacoes,
  mediaHumor,
  mediaNota,
  ultimaAvaliacao,
  className
}: StatsCardProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const getHumorEmoji = (media: number) => {
    if (media >= 4.5) return "😄"
    if (media >= 3.5) return "😊"
    if (media >= 2.5) return "😐"
    if (media >= 1.5) return "😕"
    return "😢"
  }

  const getNotaColor = (media: number) => {
    if (media >= 4.5) return "text-green-600 dark:text-green-400"
    if (media >= 3.5) return "text-blue-600 dark:text-blue-400"
    if (media >= 2.5) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getFormattedDate = () => {
    if (!isClient || !ultimaAvaliacao) return "—"
    return format(ultimaAvaliacao, "dd/MM", { locale: ptBR })
  }

  const stats = [
    {
      title: "Total de Avaliações",
      value: totalAvaliacoes,
      suffix: "",
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Média de Humor",
      value: mediaHumor.toFixed(1),
      suffix: getHumorEmoji(mediaHumor),
      icon: Heart,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900/30"
    },
    {
      title: "Média de Notas",
      value: mediaNota.toFixed(1),
      suffix: "⭐",
      icon: Star,
      color: getNotaColor(mediaNota),
      bgColor: mediaNota >= 4 ? "bg-green-100 dark:bg-green-900/30" : "bg-yellow-100 dark:bg-yellow-900/30"
    },
    {
      title: "Última Avaliação",
      value: getFormattedDate(),
      suffix: "",
      icon: Calendar,
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-100 dark:bg-violet-900/30"
    }
  ]

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <Card key={stat.title} className="group hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2 rounded-full", stat.bgColor)}>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className={cn("text-2xl font-bold", stat.color)}>
                  {stat.value}
                </div>
                {stat.suffix && (
                  <span className="text-xl">
                    {stat.suffix}
                  </span>
                )}
              </div>
              
              {/* Barra de progresso para algumas métricas */}
              {(stat.title.includes("Média") && typeof stat.value === 'string') && (
                <div className="mt-3">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-500",
                        stat.title.includes("Humor") 
                          ? "bg-pink-500" 
                          : parseFloat(stat.value) >= 4 
                            ? "bg-green-500" 
                            : "bg-yellow-500"
                      )}
                      style={{ 
                        width: `${(parseFloat(stat.value) / 5) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Badge adicional para total de avaliações */}
              {stat.title === "Total de Avaliações" && totalAvaliacoes > 0 && (
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {totalAvaliacoes === 1 ? "1 avaliação" : `${totalAvaliacoes} avaliações`}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
