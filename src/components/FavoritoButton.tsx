'use client'

import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function FavoritoButton({ favorito }: { favorito: boolean }) {
  const [ativo, setAtivo] = useState(favorito)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setAtivo(!ativo)}
    >
      <Star
        className={ativo ? "fill-yellow-400 stroke-yellow-400" : "text-muted-foreground"}
      />
    </Button>
  )
}
