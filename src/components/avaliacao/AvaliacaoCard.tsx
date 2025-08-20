'use client'

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RatingStars } from "./RatingStars"
import { HumorSelector } from "./HumorSelector"
import { Edit, Trash2, Calendar, User, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvaliacaoCardProps {
  aulaTitle: string
  professor: string
  disciplina: string
  data: Date
  humor: number
  nota: number
  feedback?: string | null
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export function AvaliacaoCard({
  aulaTitle,
  professor,
  disciplina,
  data,
  humor,
  nota,
  feedback,
  onEdit,
  onDelete,
  className
}: AvaliacaoCardProps) {
  const getBadgeColor = (nota: number) => {
    if (nota >= 5) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    if (nota >= 4) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    if (nota >= 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  }

  const getNotaLabel = (nota: number) => {
    if (nota >= 5) return "Excelente"
    if (nota >= 4) return "Bom"
    if (nota >= 3) return "Regular"
    return "Precisa melhorar"
  }

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-300 h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {aulaTitle}
            </h3>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{professor}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{disciplina}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs">{format(data, "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
            </div>
          </div>
          
          <Badge className={cn("flex-shrink-0 text-xs", getBadgeColor(nota))}>
            {getNotaLabel(nota)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        {/* Rating e Humor */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Nota</span>
            <RatingStars value={nota} readonly size="sm" />
          </div>
          
          <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Humor</span>
            <div className="flex justify-end">
              {/* Mostrar apenas o emoji selecionado */}
              <div className="flex items-center gap-1">
                <span className="text-lg">
                  {humor === 1 && "😢"}
                  {humor === 2 && "😕"}
                  {humor === 3 && "😐"}
                  {humor === 4 && "😊"}
                  {humor === 5 && "😄"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Feedback</span>
            <p className="text-sm bg-muted/50 rounded-lg p-3 leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
              {feedback}
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50 mt-auto">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-muted-foreground hover:text-primary"
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
