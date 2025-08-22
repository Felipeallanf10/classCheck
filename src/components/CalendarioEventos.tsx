"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Star, BookOpen, Users } from "lucide-react"
import clsx from "clsx"

type TipoEvento = keyof typeof tiposEvento;

const eventos: { data: string; titulo: string; tipo: TipoEvento }[] = [
  { data: "2025-07-05", titulo: "Prova de Matemática", tipo: "prova" },
  { data: "2025-07-10", titulo: "Reunião de Pais", tipo: "reuniao" },
  { data: "2025-07-12", titulo: "Feriado Nacional", tipo: "feriado" },
  { data: "2025-07-20", titulo: "Entrega de Trabalhos", tipo: "entrega" },
  { data: "2025-07-25", titulo: "Apresentação de Ciências", tipo: "apresentacao" },
]

const tiposEvento = {
  prova: { cor: "bg-sky-500 text-white", icone: <Star className="w-4 h-4" /> },
  reuniao: { cor: "bg-amber-500 text-white", icone: <Users className="w-4 h-4" /> },
  feriado: { cor: "bg-emerald-500 text-white", icone: <CalendarIcon className="w-4 h-4" /> },
  entrega: { cor: "bg-pink-500 text-white", icone: <BookOpen className="w-4 h-4" /> },
  apresentacao: { cor: "bg-violet-500 text-white", icone: <Star className="w-4 h-4" /> },
}

function getDiasDoMes(ano: number, mes: number) {
  const dias = []
  const primeiroDia = new Date(ano, mes, 1)
  const ultimoDia = new Date(ano, mes + 1, 0)
  for (let d = 1; d <= ultimoDia.getDate(); d++) {
    dias.push(new Date(ano, mes, d))
  }
  return dias
}

function formatarData(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function CalendarioEventos() {
  const [isClient, setIsClient] = useState(false)
  const hoje = new Date()
  const [ano, setAno] = React.useState(hoje.getFullYear())
  const [mes, setMes] = React.useState(hoje.getMonth()) // 0 = janeiro

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Card className="w-full mx-auto shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b bg-background/80">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="w-5 h-5 text-sky-700 dark:text-sky-400" />
            Calendário Escolar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="min-h-[320px] flex items-center justify-center">
            <span className="text-muted-foreground">Carregando calendário...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const dias = getDiasDoMes(ano, mes)
  const primeiroDiaSemana = dias[0].getDay() // 0 = domingo

  // Eventos do mês
  const eventosDoMes = eventos.filter(e => {
    const [y, m] = e.data.split("-")
    return parseInt(y) === ano && parseInt(m) === mes + 1
  })

  // Mapeia eventos por dia
  const eventosPorDia: Record<string, typeof eventos> = {}
  eventosDoMes.forEach(e => {
    if (!eventosPorDia[e.data]) eventosPorDia[e.data] = []
    eventosPorDia[e.data].push(e)
  })

  // Nomes dos meses
  const mesesPt = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ]

  return (
    <Card className="w-full mx-auto shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b bg-background/80">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarIcon className="w-5 h-5 text-sky-700 dark:text-sky-400" />
          Calendário Escolar
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setMes(m => m === 0 ? 11 : m - 1)} aria-label="Mês anterior">
            <ChevronLeft />
          </Button>
          <span className="font-medium capitalize">
            {mesesPt[mes]} de {ano}
          </span>
          <Button variant="ghost" size="icon" onClick={() => setMes(m => m === 11 ? 0 : m + 1)} aria-label="Próximo mês">
            <ChevronRight />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1 text-xs text-center font-medium text-muted-foreground mb-2">
          <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
        </div>
        <div className="grid grid-cols-7 gap-1 min-h-[320px]">
          {/* Espaço para o primeiro dia da semana */}
          {Array.from({ length: primeiroDiaSemana }).map((_, i) => (
            <div key={i} />
          ))}
          {/* Dias do mês */}
          {dias.map((dia, idx) => {
            const dataStr = formatarData(dia)
            const isHoje = formatarData(hoje) === dataStr && hoje.getMonth() === mes && hoje.getFullYear() === ano
            const eventosDia = eventosPorDia[dataStr] || []
            return (
              <div
                key={dataStr}
                className={clsx(
                  "rounded-lg p-1 flex flex-col items-center justify-start min-h-[48px] border border-transparent transition-all",
                  isHoje && "border-sky-500 bg-sky-100 dark:bg-sky-900/40",
                  eventosDia.length > 0 && "ring-2 ring-pink-400/30"
                )}
              >
                <span className={clsx("font-semibold", isHoje ? "text-sky-700 dark:text-sky-300" : "")}>{dia.getDate()}</span>
                {/* Eventos do dia */}
                <div className="flex flex-col gap-0.5 w-full mt-0.5">
                  {eventosDia.map((ev, i) => (
                    <span
                      key={i}
                      className={clsx(
                        "flex items-center gap-1 px-1 py-0.5 rounded text-xs truncate mt-0.5",
                        tiposEvento[ev.tipo]?.cor || "bg-gray-300 text-gray-800"
                      )}
                      title={ev.titulo}
                    >
                      {tiposEvento[ev.tipo]?.icone}
                      {ev.titulo}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        {/* Legenda */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {Object.entries(tiposEvento).map(([tipo, { cor, icone }]) => (
            <span key={tipo} className={clsx("flex items-center gap-1 px-2 py-1 rounded text-xs", cor)}>
              {icone}
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 