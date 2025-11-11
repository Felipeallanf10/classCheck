'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap } from "lucide-react"
import type { Aula } from "@/hooks/useAulas"

interface QuickActionsBarProps {
  aulas: Aula[]
  onAvaliar: (aula: Aula) => void
  onVerTodas?: () => void
}

export function QuickActionsBar({ aulas, onAvaliar, onVerTodas }: QuickActionsBarProps) {
  const pendentes = aulas.filter(a => !a.avaliada)

  if (pendentes.length === 0) return null

  const proximaAula = pendentes[0]

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
      <Card className="shadow-2xl border-primary/20 backdrop-blur-sm bg-background/95">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {pendentes.length} {pendentes.length === 1 ? 'aula pendente' : 'aulas pendentes'}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {proximaAula.titulo}
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => onAvaliar(proximaAula)}
              className="gap-2 shrink-0"
            >
              <Zap className="h-4 w-4" />
              Avaliar agora
            </Button>
          </div>

          {pendentes.length > 1 && onVerTodas && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs"
              onClick={onVerTodas}
            >
              Ver todas ({pendentes.length})
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
