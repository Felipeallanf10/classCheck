'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export function FilterBar({ filtros, setFiltros }: any) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder="Buscar por título ou professor..."
        value={filtros.busca}
        onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
      />

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
        </SelectContent>
      </Select>
    </div>
  )
}
