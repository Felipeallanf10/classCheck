'use client'

import { BadgeStatus } from "@/components/BadgeStatus"
import { FavoritoButton } from "@/components/FavoritoButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Clock, Eye, Star } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Aula } from "@/hooks/useAulas"

const DISCIPLINA_COLORS: Record<string, string> = {
  "Geografia": "bg-emerald-500",
  "História": "bg-amber-500",
  "Matemática": "bg-blue-500",
  "Português": "bg-purple-500",
  "Ciências": "bg-green-500",
  "Educação Física": "bg-red-500",
  "Inglês": "bg-indigo-500",
  "Arte": "bg-pink-500",
  "default": "bg-gray-500"
}

function getDisciplinaColor(disciplina: string): string {
  return DISCIPLINA_COLORS[disciplina] || DISCIPLINA_COLORS.default
}

interface CardAulaEnhancedProps {
  aula: Aula
}

export function CardAulaEnhanced({ aula }: CardAulaEnhancedProps) {
  const router = useRouter()

  const handleAvaliar = () => {
    if (aula.avaliada) {
      router.push('/minhas-avaliacoes')
    } else {
      // Nova rota unificada de avaliação
      router.push(`/aulas/${aula.id}/avaliar`)
    }
  }

  return (
    <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Barra colorida por disciplina */}
      <div className={cn("h-1.5 w-full", getDisciplinaColor(aula.disciplina))} />

      <CardContent className="p-4 space-y-2.5 flex-1 flex flex-col">
        {/* Header com título e favorito */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {aula.titulo}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{aula.professor}</span>
            </p>
          </div>
          <FavoritoButton favorito={aula.favorita} />
        </div>

        {/* Disciplina e horário */}
        <div className="flex items-center justify-between text-xs gap-2">
          <Badge variant="secondary" className="font-medium text-xs px-2 py-0.5">
            {aula.disciplina}
          </Badge>
          {aula.horario && (
            <span className="text-muted-foreground flex items-center gap-1 flex-shrink-0">
              <Clock className="h-3 w-3" />
              <span className="font-mono">{aula.horario}</span>
            </span>
          )}
        </div>

        {/* Preview de conteúdo (se disponível) */}
        {aula.descricao && (
          <p className="text-xs text-muted-foreground line-clamp-2 border-l-2 border-primary/30 pl-2 leading-relaxed">
            {aula.descricao}
          </p>
        )}

        {/* Progresso de avaliação (se aplicável) */}
        {aula.avaliacoes && (
          <div className="space-y-1 mt-auto pt-2">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Participação da turma</span>
              <span className="font-semibold">{Math.round(aula.avaliacoes.participacao)}%</span>
            </div>
            <Progress value={aula.avaliacoes.participacao} className="h-1" />
          </div>
        )}

        {/* Footer com status e ação */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t mt-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <BadgeStatus avaliada={aula.avaliada} />
            {aula.humor && (
              <Image
                src={`/emotions/face-${aula.humor}.svg`}
                alt={`Humor ${aula.humor}`}
                width={24}
                height={24}
                className="opacity-80 flex-shrink-0"
              />
            )}
          </div>

          <Button
            variant={aula.avaliada ? "outline" : "default"}
            size="sm"
            onClick={handleAvaliar}
            className="gap-1.5 h-8 px-3 flex-shrink-0"
          >
            {aula.avaliada ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span className="text-xs">Ver</span>
              </>
            ) : (
              <>
                <Star className="h-3.5 w-3.5" />
                <span className="text-xs">Avaliar</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
