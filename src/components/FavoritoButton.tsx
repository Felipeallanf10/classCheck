'use client'

import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useConfirm } from "@/hooks/use-confirm"

export function FavoritoButton({ favorito }: { favorito: boolean }) {
  const [ativo, setAtivo] = useState(favorito)
  const { toast } = useToast()
  const { confirm } = useConfirm()

  const handleToggle = async () => {
    if (ativo) {
      // Pedir confirmação ao remover
      const confirmed = await confirm({
        title: 'Remover dos favoritos?',
        description: 'Tem certeza que deseja remover esta aula dos seus favoritos?',
        confirmText: 'Sim, remover',
        cancelText: 'Cancelar',
        variant: 'destructive'
      })
      
      if (!confirmed) return
    }
    
    const novoEstado = !ativo
    setAtivo(novoEstado)
    
    if (novoEstado) {
      toast.success({
        title: "Adicionado aos favoritos! ⭐",
        description: "Esta aula foi marcada como favorita"
      })
    } else {
      toast.info({
        title: "Removido dos favoritos",
        description: "Esta aula foi desmarcada como favorita"
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="transition-all duration-300 hover:scale-110"
    >
      <Star
        className={`transition-all duration-300 ${
          ativo 
            ? "fill-warning-400 stroke-warning-400 scale-110" 
            : "text-muted-foreground hover:text-warning-400"
        }`}
      />
    </Button>
  )
}
