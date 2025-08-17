'use client'

import { Badge } from "@/components/ui/badge"

export function BadgeStatus({ avaliada }: { avaliada: boolean }) {
  return (
    <Badge variant={avaliada ? "default" : "destructive"}>
      {avaliada ? "Avaliada" : "Pendente"}
    </Badge>
  )
}
