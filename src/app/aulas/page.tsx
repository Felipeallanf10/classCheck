'use client'

import { useState } from "react"
import { SidebarCalendario } from "@/components/SidebarCalendario"
import { CardAula } from "@/components/CardAula"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

  const aulasDoDia = todasAulasMock.filter(
    (aula) => format(new Date(aula.data), "yyyy-MM-dd") === format(dataSelecionada, "yyyy-MM-dd")
  )

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-background/95">
      {/* Conteúdo principal */}
      <main className="flex-1 px-6 py-6 space-y-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          Aulas em {format(dataSelecionada, "dd 'de' MMMM", { locale: undefined })}
        </h1>

        {aulasDoDia.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <p className="text-muted-foreground text-lg">Nenhuma aula encontrada para este dia.</p>
            <p className="text-sm text-muted-foreground mt-2">Selecione outra data no calendário</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aulasDoDia.map((aula, index) => (
            <div 
              key={aula.id} 
              className="transform hover:scale-105 transition-all duration-300"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <CardAula aula={aula} />
            </div>
          ))}
        </div>
      </main>

      {/* Sidebar com calendário */}
      <SidebarCalendario
        dataSelecionada={dataSelecionada}
        onDataChange={setDataSelecionada}
        aulas={todasAulasMock}
      />
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
