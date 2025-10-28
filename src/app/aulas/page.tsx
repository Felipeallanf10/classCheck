'use client'

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarCalendario } from "@/components/SidebarCalendario"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { NoAulasEmptyState, NoResultsEmptyState } from "@/components/ui/empty-states"
import { CardAulaEnhanced } from "@/components/aulas/CardAulaEnhanced"
import { QuickActionsBar } from "@/components/aulas/QuickActionsBar"
import { MobileDatePicker } from "@/components/aulas/MobileDatePicker"
import { FiltersBar, type AulasFilters } from "@/components/aulas/FiltersBar"
import { AvaliacaoModal } from "@/components/avaliacao"
import { AulasSkeletonGrid } from "@/components/aulas/AulaSkeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, AlertCircle, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { useAulas } from "@/hooks/useAulas"

function AulasPageContent() {
  const searchParams = useSearchParams()
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date())
  const [isAvaliacaoModalOpen, setIsAvaliacaoModalOpen] = useState(false)
  const [aulaParaAvaliar, setAulaParaAvaliar] = useState<any>(null)
  const { toast } = useToast()

  // Usar hook useAulas para buscar dados reais
  const { aulas: todasAulas, loading, error, refetch } = useAulas(dataSelecionada)

  // Estado de filtros avançados
  const [filters, setFilters] = useState<AulasFilters>(() => {
    const queryFiltro = searchParams.get('filtro');
    return {
      showOnlyFavorites: queryFiltro === 'favoritas',
      status: undefined,
      disciplinas: [],
      professores: []
    }
  })

  // Salvar preferência de favoritas no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aulas-filtro-favoritas', String(filters.showOnlyFavorites));
    }
  }, [filters.showOnlyFavorites])

  // Extrair listas únicas de disciplinas e professores
  const availableDisciplinas = useMemo(() => {
    if (!Array.isArray(todasAulas)) return []
    return Array.from(new Set(todasAulas.map(a => a.disciplina)))
  }, [todasAulas])

  const availableProfessores = useMemo(() => {
    if (!Array.isArray(todasAulas)) return []
    return Array.from(new Set(todasAulas.map(a => a.professor)))
  }, [todasAulas])

  // Filtrar aulas com todos os filtros
  const aulasFiltradas = useMemo(() => {
    if (!Array.isArray(todasAulas)) return []
    
    let resultado = todasAulas

    // Filtro de favoritas
    if (filters.showOnlyFavorites) {
      resultado = resultado.filter(aula => aula.favorita)
    }

    // Filtro de status
    if (filters.status === 'avaliadas') {
      resultado = resultado.filter(aula => aula.avaliada)
    } else if (filters.status === 'pendentes') {
      resultado = resultado.filter(aula => !aula.avaliada)
    }

    // Filtro de disciplinas
    if (filters.disciplinas.length > 0) {
      resultado = resultado.filter(aula => 
        filters.disciplinas.includes(aula.disciplina)
      )
    }

    // Filtro de professores
    if (filters.professores.length > 0) {
      resultado = resultado.filter(aula => 
        filters.professores.includes(aula.professor)
      )
    }

    return resultado
  }, [todasAulas, filters])

  // Contador total de favoritas
  const totalFavoritas = useMemo(() => {
    if (!Array.isArray(todasAulas)) return 0
    return todasAulas.filter(aula => aula.favorita).length
  }, [todasAulas])

  const handleSubmitAvaliacao = (data: any) => {
    console.log("Avaliação submetida:", data)
    
    toast.success(
      `Obrigado por avaliar a aula "${aulaParaAvaliar?.titulo}".`
    )
    
    setIsAvaliacaoModalOpen(false)
    setAulaParaAvaliar(null)
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex min-h-screen bg-gradient-to-br from-background to-background/95">
          {/* Conteúdo principal - usando w-full para ocupar todo espaço */}
          <main className="w-full px-4 sm:px-6 py-6 space-y-4">
            {/* Breadcrumbs */}
            <Breadcrumbs items={[
              { label: "Aulas", icon: <Calendar className="h-4 w-4" /> }
            ]} />

            {/* Mobile Date Picker */}
            <MobileDatePicker 
              date={dataSelecionada} 
              onChange={setDataSelecionada} 
            />

            {/* Header */}
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Aulas em {format(dataSelecionada, "dd 'de' MMMM", { locale: ptBR })}
              </h1>
              
              {/* Barra de Filtros Avançados */}
              <FiltersBar
                filters={filters}
                onFiltersChange={setFilters}
                availableDisciplinas={availableDisciplinas}
                availableProfessores={availableProfessores}
                totalFavoritas={totalFavoritas}
                resultsCount={aulasFiltradas.length}
              />
            </div>

            {/* Alerta de erro */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}. <button onClick={refetch} className="underline font-medium">Tentar novamente</button>
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading && <AulasSkeletonGrid />}

            {/* Empty State */}
            {!loading && aulasFiltradas.length === 0 && !error && (
              <>
                {filters.showOnlyFavorites || filters.status || filters.disciplinas.length > 0 || filters.professores.length > 0 ? (
                  <NoResultsEmptyState 
                    onClear={() => setFilters({
                      showOnlyFavorites: false,
                      status: undefined,
                      disciplinas: [],
                      professores: []
                    })}
                  />
                ) : (
                  <NoAulasEmptyState />
                )}
              </>
            )}

            {/* Grid de Aulas - Grid responsivo otimizado */}
            {!loading && aulasFiltradas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {aulasFiltradas.map((aula, index) => (
                  <div 
                    key={aula.id} 
                    className="transition-all duration-200"
                    style={{ 
                      animationDelay: index < 12 ? `${index * 50}ms` : '0ms',
                      animation: index < 12 ? 'fadeInUp 0.4s ease-out forwards' : 'none'
                    }}
                  >
                    <CardAulaEnhanced aula={aula} />
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* Quick Actions Bar para avaliação rápida */}
          {!loading && (
            <QuickActionsBar 
              aulas={aulasFiltradas}
              onAvaliar={(aula) => {
                setAulaParaAvaliar(aula)
                setIsAvaliacaoModalOpen(true)
              }}
            />
          )}
          {/* Sidebar com calendário */}
          <SidebarCalendario
            dataSelecionada={dataSelecionada}
            onDataChange={setDataSelecionada}
            aulas={todasAulas}
          />

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function AulasPage() {
  return (
    <Suspense fallback={<AulasSkeletonGrid />}>
      <AulasPageContent />
    </Suspense>
  )
}
