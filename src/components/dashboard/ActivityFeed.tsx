'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, User, BookOpen, Star, MessageCircle, ChevronRight } from "lucide-react"

interface ActivityItem {
  id: string
  type: 'avaliacao' | 'humor' | 'aula' | 'comentario'
  title: string
  subtitle: string
  time: string
  status?: 'pendente' | 'completo' | 'em-andamento'
  metadata?: {
    professor?: string
    materia?: string
    sala?: string
    rating?: number
  }
}

interface QuickActionItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  quickActions: QuickActionItem[]
}

export function ActivityFeed({ activities, quickActions }: ActivityFeedProps) {
  const [showAllActivities, setShowAllActivities] = useState(false)
  
  const displayedActivities = showAllActivities ? activities : activities.slice(0, 5)

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'avaliacao':
        return <Star className="w-4 h-4 text-yellow-500" />
      case 'humor':
        return <span className="text-sm">😊</span>
      case 'aula':
        return <BookOpen className="w-4 h-4 text-blue-500" />
      case 'comentario':
        return <MessageCircle className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'completo':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'em-andamento':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Feed de Atividades - Prioridade em mobile */}
      <Card className="order-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
            <span className="text-lg">📈</span>
            <span className="hidden sm:inline">Atividade Recente</span>
            <span className="sm:hidden">Atividades</span>
          </CardTitle>
          {activities.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllActivities(!showAllActivities)}
              className="hover:bg-muted text-xs sm:text-sm"
            >
              {showAllActivities ? 'Menos' : `Ver ${activities.length}`}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {displayedActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-start gap-2 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-border"
              >
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors text-xs sm:text-sm leading-tight line-clamp-2">
                      {activity.title}
                    </h4>
                    {activity.status && (
                      <Badge variant="secondary" className={`${getStatusColor(activity.status)} transition-colors text-xs flex-shrink-0`}>
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">{activity.subtitle}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs">{activity.time}</span>
                    </div>
                    {activity.metadata && (
                      <div className="flex items-center gap-1 overflow-hidden">
                        {activity.metadata.professor && (
                          <span className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-xs whitespace-nowrap">
                            <User className="w-2.5 h-2.5 flex-shrink-0" />
                            <span className="truncate max-w-[60px]">{activity.metadata.professor.split(' ')[0]}</span>
                          </span>
                        )}
                        {activity.metadata.rating && (
                          <span className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-xs whitespace-nowrap">
                            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                            <span>{activity.metadata.rating}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {activities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="font-medium mb-2 text-sm">Nenhuma atividade recente</h3>
              <p className="text-xs">Suas atividades aparecerão aqui conforme você usar o ClassCheck.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações Rápidas - Segunda prioridade */}
      <Card className="order-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
            <span className="text-lg">⚡</span>
            <span className="hidden sm:inline">Ações Rápidas</span>
            <span className="sm:hidden">Ações</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-2 sm:p-3 hover:shadow-md transition-all duration-200 group hover:border-primary/50 flex flex-col items-center text-center min-h-[80px] sm:min-h-[90px]"
                asChild
              >
                <a href={action.href}>
                  <div className="group-hover:scale-110 transition-transform duration-200 p-1.5 sm:p-2 rounded-md bg-muted/50 flex-shrink-0 mb-1 sm:mb-2">
                    {action.icon}
                  </div>
                  <div className="space-y-0.5 w-full">
                    <div className="font-medium text-foreground text-xs leading-tight line-clamp-2 min-h-[24px] flex items-center justify-center">
                      {action.title}
                    </div>
                    <div className="text-xs text-muted-foreground leading-tight hidden sm:block line-clamp-2">
                      {action.description}
                    </div>
                  </div>
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}