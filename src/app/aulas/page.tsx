'use client'

import { useState } from "react"
import { SidebarCalendario } from "@/components/SidebarCalendario"
import { CardAula } from "@/components/CardAula"
import { format } from "date-fns"

const todasAulasMock = [
  {
    id: "1",
    titulo: "Geografia – Continentes",
    data: "2025-07-29",
    professor: "Prof. Ana",
    disciplina: "Geografia",
    avaliada: true,
    favorita: true,
    humor: 4,
  },
  {
    id: "2",
    titulo: "História – Revolução Francesa",
    data: "2025-07-29",
    professor: "Prof. Lucas",
    disciplina: "História",
    avaliada: false,
    favorita: false,
    humor: null,
  },
  {
    id: "3",
    titulo: "Matemática – Porcentagem",
    data: "2025-07-30",
    professor: "Prof. Carla",
    disciplina: "Matemática",
    avaliada: true,
    favorita: false,
    humor: 5,
  },
]

export default function AulasPage() {
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date())

  const aulasDoDia = todasAulasMock.filter(
    (aula) => format(new Date(aula.data), "yyyy-MM-dd") === format(dataSelecionada, "yyyy-MM-dd")
  )

  return (
    <div className="flex min-h-screen">
      {/* Conteúdo principal */}
      <main className="flex-1 px-6 py-6 space-y-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">
          Aulas em {format(dataSelecionada, "dd 'de' MMMM", { locale: undefined })}
        </h1>

        {aulasDoDia.length === 0 && (
          <p className="text-muted-foreground">Nenhuma aula encontrada para este dia.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aulasDoDia.map((aula) => (
            <CardAula key={aula.id} aula={aula} />
          ))}
        </div>
      </main>

      {/* Sidebar com calendário */}
      <SidebarCalendario
        dataSelecionada={dataSelecionada}
        onDataChange={setDataSelecionada}
        aulas={todasAulasMock}
      />
    </div>
  )
}
