'use client'

import {
  CalendarDays,
  ChevronDown,
  Check,
  X,
  Star,
} from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface AulaSimples {
  id: string | number;
  data: string | Date;
  titulo: string;
  professor?: string;
  avaliada?: boolean;
  favorita?: boolean;
}

export function SidebarCalendario({
  dataSelecionada,
  onDataChange,
  aulas,
}: {
  dataSelecionada: Date
  onDataChange: (date: Date) => void
  aulas: AulaSimples[]
}) {
  const [expandido, setExpandido] = useState(true)

  const aulasArray = Array.isArray(aulas) ? aulas : []
  
  const aulasDoDia = aulasArray.filter(
    (aula) =>
      format(new Date(aula.data), "yyyy-MM-dd") ===
      format(dataSelecionada, "yyyy-MM-dd")
  )

  return (
    <aside className="hidden lg:flex flex-col w-72 border-r bg-muted px-4 py-6 space-y-6">
      {/* Calendário fixo */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Calendário</h2>
        <Calendar
          mode="single"
          selected={dataSelecionada}
          onSelect={(date) => date && onDataChange(date)}
          className="rounded-md border bg-background"
        />
      </div>

      <Separator />

      {/* Header de hoje com toggle */}
      <div className="space-y-2">
        <button
          onClick={() => setExpandido(!expandido)}
          className="flex items-center justify-between w-full text-left font-medium hover:opacity-80"
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>{format(dataSelecionada, "dd/MM/yyyy")}</span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              expandido ? "rotate-180" : "rotate-0"
            )}
          />
        </button>

        {expandido && (
          <ul className="mt-2 ml-3 border-l pl-3 space-y-2">
            {aulasDoDia.length === 0 && (
              <li className="text-sm text-muted-foreground">Nenhuma aula neste dia</li>
            )}

            {aulasDoDia.map((aula) => (
              <li key={aula.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium leading-snug">{aula.titulo}</span>
                  {aula.favorita && (
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{aula.professor}</span>
                  <Badge variant={"default"}>
                    {aula.avaliada ? (
                        <Check />
                    ): (
                        <X/>
                    )}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
