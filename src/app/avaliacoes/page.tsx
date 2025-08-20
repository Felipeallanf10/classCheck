'use client'

import { useState } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AvaliacaoCard, StatsCard } from "@/components/avaliacao"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Mock data para demonstração
const mockAvaliacoes = [
  {
    id: "1",
    aulaId: "1",
    aulaTitle: "Geografia – Continentes",
    professor: "Prof. Ana",
    disciplina: "Geografia",
    data: new Date("2025-08-15"),
    humor: 4,
    nota: 5,
    feedback: "Aula muito interessante! A professora explicou muito bem sobre os continentes e suas características."
  },
  {
    id: "2",
    aulaId: "2",
    aulaTitle: "História – Revolução Francesa",
    professor: "Prof. Lucas",
    disciplina: "História",
    data: new Date("2025-08-14"),
    humor: 5,
    nota: 4,
    feedback: "Adorei conhecer mais sobre esse período histórico importante."
  },
  {
    id: "3",
    aulaId: "3",
    aulaTitle: "Matemática – Porcentagem",
    professor: "Prof. Carla",
    disciplina: "Matemática",
    data: new Date("2025-08-13"),
    humor: 3,
    nota: 3,
    feedback: "Conceito um pouco difícil, mas consegui entender com os exemplos."
  },
  {
    id: "4",
    aulaId: "4",
    aulaTitle: "Português – Literatura Brasileira",
    professor: "Prof. Marina",
    disciplina: "Português",
    data: new Date("2025-08-12"),
    humor: 5,
    nota: 5,
    feedback: "Aula incrível sobre Machado de Assis! A professora trouxe textos muito interessantes."
  },
  {
    id: "5",
    aulaId: "5",
    aulaTitle: "Ciências – Sistema Solar",
    professor: "Prof. Roberto",
    disciplina: "Ciências",
    data: new Date("2025-08-11"),
    humor: 4,
    nota: 4,
    feedback: null
  }
]

const mockStats = {
  totalAvaliacoes: mockAvaliacoes.length,
  mediaHumor: 4.2,
  mediaNota: 4.2,
  ultimaAvaliacao: mockAvaliacoes[0]?.data
}

type FilterType = "all" | "excelente" | "bom" | "regular" | "ruim"

export default function AvaliacoesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")

  // Filtrar avaliações
  const avaliacoesFiltradas = mockAvaliacoes.filter((avaliacao) => {
    const matchesSearch = 
      avaliacao.aulaTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avaliacao.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avaliacao.disciplina.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = (() => {
      switch (filter) {
        case "excelente":
          return avaliacao.nota >= 5
        case "bom":
          return avaliacao.nota >= 4 && avaliacao.nota < 5
        case "regular":
          return avaliacao.nota >= 3 && avaliacao.nota < 4
        case "ruim":
          return avaliacao.nota < 3
        default:
          return true
      }
    })()

    return matchesSearch && matchesFilter
  })

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-background to-background/95 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Minhas Avaliações
              </h1>
              <p className="text-muted-foreground">
                Acompanhe seu histórico de avaliações e feedbacks
              </p>
            </div>

            {/* Stats Cards */}
            <StatsCard 
              totalAvaliacoes={mockStats.totalAvaliacoes}
              mediaHumor={mockStats.mediaHumor}
              mediaNota={mockStats.mediaNota}
              ultimaAvaliacao={mockStats.ultimaAvaliacao}
            />

            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Busca */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por aula, professor ou disciplina..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtros */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex gap-2">
                  {[
                    { key: "all", label: "Todas" },
                    { key: "excelente", label: "Excelente (5⭐)" },
                    { key: "bom", label: "Bom (4⭐)" },
                    { key: "regular", label: "Regular (3⭐)" },
                    { key: "ruim", label: "Ruim (1-2⭐)" }
                  ].map((filterOption) => (
                    <Badge
                      key={filterOption.key}
                      variant={filter === filterOption.key ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => setFilter(filterOption.key as FilterType)}
                    >
                      {filterOption.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Lista de Avaliações */}
            {avaliacoesFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-12 w-12 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm || filter !== "all" 
                    ? "Nenhuma avaliação encontrada" 
                    : "Você ainda não fez nenhuma avaliação"
                  }
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || filter !== "all"
                    ? "Tente ajustar seus filtros de busca"
                    : "Que tal avaliar algumas aulas que você já assistiu?"
                  }
                </p>
                {searchTerm || filter !== "all" ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("")
                      setFilter("all")
                    }}
                  >
                    Limpar Filtros
                  </Button>
                ) : (
                  <Button onClick={() => window.history.back()}>
                    Voltar para Aulas
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {avaliacoesFiltradas.map((avaliacao, index) => (
                  <div
                    key={avaliacao.id}
                    className="transform hover:scale-105 transition-all duration-300"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <AvaliacaoCard
                      aulaTitle={avaliacao.aulaTitle}
                      professor={avaliacao.professor}
                      disciplina={avaliacao.disciplina}
                      data={avaliacao.data}
                      humor={avaliacao.humor}
                      nota={avaliacao.nota}
                      feedback={avaliacao.feedback}
                      onEdit={() => console.log("Editar avaliação", avaliacao.id)}
                      onDelete={() => console.log("Excluir avaliação", avaliacao.id)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Informações adicionais */}
            {avaliacoesFiltradas.length > 0 && (
              <div className="text-center text-sm text-muted-foreground mt-8">
                Mostrando {avaliacoesFiltradas.length} de {mockAvaliacoes.length} avaliações
              </div>
            )}
          </div>
        </div>

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
      </SidebarInset>
    </SidebarProvider>
  )
}
