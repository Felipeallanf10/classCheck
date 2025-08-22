'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterBarProps {
  filtros: {
    busca: string
    disciplina: string
    professor?: string
    periodo?: string
  }
  setFiltros: (filtros: any) => void
  onClear?: () => void
}

export function FilterBar({ filtros, setFiltros, onClear }: FilterBarProps) {
  const hasActiveFilters = filtros.busca !== "" || filtros.disciplina !== " " || 
    (filtros.professor && filtros.professor !== " ") || 
    (filtros.periodo && filtros.periodo !== " ")

  const clearFilters = () => {
    setFiltros({ busca: "", disciplina: " ", professor: " ", periodo: " " })
    onClear?.()
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Busca principal */}
      <div className="flex-1">
        <Input
          placeholder="Buscar por título, professor ou disciplina..."
          value={filtros.busca}
          onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
        />
      </div>

      {/* Filtro por disciplina */}
      <Select
        onValueChange={(value) => setFiltros({ ...filtros, disciplina: value })}
        value={filtros.disciplina}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Disciplina" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">Todas</SelectItem>
          <SelectItem value="Geografia">Geografia</SelectItem>
          <SelectItem value="História">História</SelectItem>
          <SelectItem value="Matemática">Matemática</SelectItem>
          <SelectItem value="Português">Português</SelectItem>
          <SelectItem value="Ciências">Ciências</SelectItem>
          <SelectItem value="Inglês">Inglês</SelectItem>
          <SelectItem value="Educação Física">Educação Física</SelectItem>
        </SelectContent>
      </Select>

      {/* Filtro por professor */}
      <Select
        onValueChange={(value) => setFiltros({ ...filtros, professor: value })}
        value={filtros.professor || " "}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Professor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">Todos</SelectItem>
          <SelectItem value="Prof. Ana">Prof. Ana</SelectItem>
          <SelectItem value="Prof. Lucas">Prof. Lucas</SelectItem>
          <SelectItem value="Prof. Carla">Prof. Carla</SelectItem>
          <SelectItem value="Prof. Marina">Prof. Marina</SelectItem>
          <SelectItem value="Prof. Roberto">Prof. Roberto</SelectItem>
        </SelectContent>
      </Select>

      {/* Filtro por período */}
      <Select
        onValueChange={(value) => setFiltros({ ...filtros, periodo: value })}
        value={filtros.periodo || " "}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">Todos</SelectItem>
          <SelectItem value="hoje">Hoje</SelectItem>
          <SelectItem value="semana">Esta semana</SelectItem>
          <SelectItem value="mes">Este mês</SelectItem>
          <SelectItem value="trimestre">Últimos 3 meses</SelectItem>
        </SelectContent>
      </Select>

      {/* Botão para limpar filtros */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="icon"
          onClick={clearFilters}
          className="flex-shrink-0"
          title="Limpar filtros"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
