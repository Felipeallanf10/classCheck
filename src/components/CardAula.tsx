'use client'

import { BadgeStatus } from "@/components/BadgeStatus"
import { FavoritoButton } from "@/components/FavoritoButton"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Tipo para Aula exibida no card
interface AulaCard {
  id: string | number;
  titulo: string;
  professor: string;
  data: string;
  favorita?: boolean;
  avaliada?: boolean;
  humor?: string;
}

export function CardAula({ aula }: { aula: AulaCard }) {
  const router = useRouter()
  return (
    <div className="bg-white dark:bg-muted border rounded-lg p-4 shadow space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{aula.titulo}</h3>
          <p className="text-sm text-muted-foreground">{aula.professor}</p>
          <p className="text-sm text-muted-foreground">{aula.data}</p>
        </div>
        <FavoritoButton favorito={aula.favorita ?? false} />
      </div>

      <div className="flex items-center justify-between">
        <BadgeStatus avaliada={aula.avaliada ?? false} />
        {aula.humor && (
          <Image
            src={`/emotions/face-${aula.humor}.svg`}
            alt={`Humor ${aula.humor}`}
            width={40}
            height={40}
          />
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => {
            if (aula.avaliada) {
              router.push('/avaliacoes')
            } else {
              router.push(`/aulas/${aula.id}/avaliar`)
            }
          }}
        >
          {aula.avaliada ? "Ver Avaliação" : "Avaliar"}
        </Button>
      </div>
    </div>
  )
}
