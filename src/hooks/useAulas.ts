'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export interface Aula {
  id: string
  titulo: string
  data: string
  professor: string
  disciplina: string
  avaliada: boolean
  favorita: boolean
  humor: number | null
  descricao?: string
  horario?: string
  avaliacoes?: {
    participacao: number
  }
}

interface UseAulasResult {
  aulas: Aula[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useAulas(date: Date): UseAulasResult {
  const [aulas, setAulas] = useState<Aula[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAulas = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const dateStr = format(date, 'yyyy-MM-dd')
      const response = await fetch(`/api/aulas?date=${dateStr}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar aulas')
      }
      
      const data = await response.json()
      
      // A API retorna { aulas: [], pagination: {} }
      // Precisamos extrair apenas o array de aulas
      const aulasArray = Array.isArray(data) ? data : (data.aulas || [])
      
      // Mapear para o formato esperado pelo frontend
      const aulasMapeadas: Aula[] = aulasArray.map((aula: any) => ({
        id: String(aula.id),
        titulo: aula.titulo,
        data: format(new Date(aula.dataHora), 'yyyy-MM-dd'),
        professor: aula.professor?.nome || 'Professor não informado',
        disciplina: aula.materia,
        avaliada: aula._count?.avaliacoes > 0,
        favorita: aula._count?.aulasFavoritas > 0,
        humor: null, // TODO: buscar da avaliação se existir
        descricao: aula.descricao || undefined,
        horario: format(new Date(aula.dataHora), 'HH:mm'),
        avaliacoes: aula._count?.avaliacoes > 0 ? {
          participacao: Math.min(100, (aula._count.avaliacoes / 30) * 100) // Assumindo turma de 30 alunos
        } : undefined
      }))
      
      setAulas(aulasMapeadas)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('Erro ao buscar aulas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAulas()
  }, [date])

  return { 
    aulas, 
    loading, 
    error,
    refetch: fetchAulas 
  }
}
