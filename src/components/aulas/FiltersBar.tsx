'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Filter, BookOpen, User, X } from "lucide-react"
import { ToggleFilter } from "./ToggleFilter"

export interface AulasFilters {
  showOnlyFavorites: boolean
  status?: 'avaliadas' | 'pendentes'
  disciplinas: string[]
  professores: string[]
}

interface FiltersBarProps {
  filters: AulasFilters
  onFiltersChange: (filters: AulasFilters) => void
  availableDisciplinas: string[]
  availableProfessores: string[]
  totalFavoritas: number
  resultsCount: number
}

export function FiltersBar({
  filters,
  onFiltersChange,
  availableDisciplinas,
  availableProfessores,
  totalFavoritas,
  resultsCount
}: FiltersBarProps) {
  const hasActiveFilters = 
    filters.showOnlyFavorites || 
    filters.status || 
    filters.disciplinas.length > 0 || 
    filters.professores.length > 0

  const clearAllFilters = () => {
    onFiltersChange({
      showOnlyFavorites: false,
      status: undefined,
      disciplinas: [],
      professores: []
    })
  }

  return (
    <div className="flex flex-wrap gap-2 items-center p-3 bg-muted/30 dark:bg-muted/20 rounded-lg border border-border/50">
      {/* Filtro de Favoritas */}
      <ToggleFilter
        active={filters.showOnlyFavorites}
        count={totalFavoritas}
        onChange={(active) => onFiltersChange({ ...filters, showOnlyFavorites: active })}
      />

      <Separator orientation="vertical" className="h-6 hidden sm:block" />

      {/* Filtro por Status */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            <Filter className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-sm">Status</span>
            <span className="sm:hidden text-sm">📊</span>
            {filters.status && (
              <Badge variant="secondary" className="ml-0.5 px-1.5 py-0 h-4 text-xs">
                1
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filters.status === 'avaliadas'}
            onCheckedChange={(checked) => 
              onFiltersChange({ ...filters, status: checked ? 'avaliadas' : undefined })
            }
          >
            ✅ Avaliadas
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.status === 'pendentes'}
            onCheckedChange={(checked) => 
              onFiltersChange({ ...filters, status: checked ? 'pendentes' : undefined })
            }
          >
            ⏳ Pendentes
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filtro por Disciplina */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-sm">Disciplina</span>
            <span className="sm:hidden text-sm">📚</span>
            {filters.disciplinas.length > 0 && (
              <Badge variant="secondary" className="ml-0.5 px-1.5 py-0 h-4 text-xs">
                {filters.disciplinas.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
          <DropdownMenuLabel>Selecione disciplinas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableDisciplinas.map((disciplina) => (
            <DropdownMenuCheckboxItem
              key={disciplina}
              checked={filters.disciplinas.includes(disciplina)}
              onCheckedChange={(checked) => {
                const newDisciplinas = checked
                  ? [...filters.disciplinas, disciplina]
                  : filters.disciplinas.filter(d => d !== disciplina)
                onFiltersChange({ ...filters, disciplinas: newDisciplinas })
              }}
            >
              {disciplina}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filtro por Professor */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            <User className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-sm">Professor</span>
            <span className="sm:hidden text-sm">👤</span>
            {filters.professores.length > 0 && (
              <Badge variant="secondary" className="ml-0.5 px-1.5 py-0 h-4 text-xs">
                {filters.professores.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
          <DropdownMenuLabel>Selecione professores</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableProfessores.map((professor) => (
            <DropdownMenuCheckboxItem
              key={professor}
              checked={filters.professores.includes(professor)}
              onCheckedChange={(checked) => {
                const newProfessores = checked
                  ? [...filters.professores, professor]
                  : filters.professores.filter(p => p !== professor)
                onFiltersChange({ ...filters, professores: newProfessores })
              }}
            >
              {professor}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Botão de Limpar Filtros */}
      {hasActiveFilters && (
        <>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="gap-1.5 h-9 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-sm">Limpar</span>
          </Button>
        </>
      )}

      {/* Contador de resultados */}
      <div className="ml-auto text-sm text-muted-foreground font-medium whitespace-nowrap">
        {resultsCount} {resultsCount === 1 ? 'aula' : 'aulas'}
      </div>
    </div>
  )
}
