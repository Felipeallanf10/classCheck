'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  X,
  Calendar as CalendarIcon,
  Save,
  RotateCcw,
  Star,
  Filter,
  Search,
  Users,
  BookOpen,
  Activity,
  Clock
} from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface FiltrosSalvos {
  id: string
  nome: string
  filtros: FilterState
  isFavorito: boolean
  criadoEm: Date
}

interface FilterState {
  periodo: string
  turma: string
  professor: string
  humor: string
  status: string
  dataInicio?: Date
  dataFim?: Date
  busca?: string
}

interface FiltrosAvancadosProps {
  filtros: FilterState
  onFiltrosChange: (filtros: Partial<FilterState>) => void
  loading?: boolean
}

export function FiltrosAvancados({ filtros, onFiltrosChange, loading }: FiltrosAvancadosProps) {
  const [filtrosSalvos, setFiltrosSalvos] = useState<FiltrosSalvos[]>([])
  const [nomeNovoFiltro, setNomeNovoFiltro] = useState('')
  const [mostrarSalvarFiltro, setMostrarSalvarFiltro] = useState(false)
  const [filtrosAtivos, setFiltrosAtivos] = useState(0)

  // Opções dos filtros
  const opcoesperiodo = [
    { value: 'hoje', label: 'Hoje' },
    { value: 'ontem', label: 'Ontem' },
    { value: 'ultimos-7-dias', label: 'Últimos 7 dias' },
    { value: 'ultimos-30-dias', label: 'Últimos 30 dias' },
    { value: 'mes-atual', label: 'Mês atual' },
    { value: 'mes-anterior', label: 'Mês anterior' },
    { value: 'trimestre-atual', label: 'Trimestre atual' },
    { value: 'ano-atual', label: 'Ano atual' },
    { value: 'personalizado', label: 'Período personalizado' }
  ]

  const opcoesTurma = [
    { value: 'todas', label: 'Todas as turmas' },
    { value: '1a-serie', label: '1ª Série' },
    { value: '2a-serie', label: '2ª Série' },
    { value: '3a-serie', label: '3ª Série' },
    { value: 'turma-a', label: 'Turma A' },
    { value: 'turma-b', label: 'Turma B' },
    { value: 'turma-c', label: 'Turma C' }
  ]

  const opcoesProfessor = [
    { value: 'todos', label: 'Todos os professores' },
    { value: 'prof-silva', label: 'Prof. Silva' },
    { value: 'prof-santos', label: 'Prof. Santos' },
    { value: 'prof-oliveira', label: 'Prof. Oliveira' },
    { value: 'prof-costa', label: 'Prof. Costa' }
  ]

  const opcoesHumor = [
    { value: 'todos', label: 'Todos os humores' },
    { value: 'muito-feliz', label: '😄 Muito Feliz' },
    { value: 'feliz', label: '😊 Feliz' },
    { value: 'neutro', label: '😐 Neutro' },
    { value: 'triste', label: '😢 Triste' },
    { value: 'muito-triste', label: '😭 Muito Triste' }
  ]

  const opcoesStatus = [
    { value: 'todos', label: 'Todos os status' },
    { value: 'realizada', label: 'Aula Realizada' },
    { value: 'cancelada', label: 'Aula Cancelada' },
    { value: 'remarcada', label: 'Aula Remarcada' },
    { value: 'pendente', label: 'Pendente' }
  ]

  // Carregar filtros salvos do localStorage
  useEffect(() => {
    const filtrosSalvosLS = localStorage.getItem('classcheck-filtros-salvos')
    if (filtrosSalvosLS) {
      try {
        const filtros = JSON.parse(filtrosSalvosLS)
        setFiltrosSalvos(filtros.map((f: any) => ({
          ...f,
          criadoEm: new Date(f.criadoEm)
        })))
      } catch (error) {
        console.error('Erro ao carregar filtros salvos:', error)
      }
    }
  }, [])

  // Contar filtros ativos
  useEffect(() => {
    let count = 0
    if (filtros.periodo !== 'ultimos-30-dias') count++
    if (filtros.turma !== 'todas') count++
    if (filtros.professor !== 'todos') count++
    if (filtros.humor !== 'todos') count++
    if (filtros.status !== 'todos') count++
    if (filtros.busca && filtros.busca.length > 0) count++
    if (filtros.dataInicio || filtros.dataFim) count++
    
    setFiltrosAtivos(count)
  }, [filtros])

  const aplicarFiltro = (campo: keyof FilterState, valor: string | Date | undefined) => {
    onFiltrosChange({ [campo]: valor })
  }

  const limparFiltros = () => {
    onFiltrosChange({
      periodo: 'ultimos-30-dias',
      turma: 'todas',
      professor: 'todos',
      humor: 'todos',
      status: 'todos',
      dataInicio: undefined,
      dataFim: undefined,
      busca: ''
    })
  }

  const salvarFiltro = () => {
    if (!nomeNovoFiltro.trim()) return

    const novoFiltro: FiltrosSalvos = {
      id: Date.now().toString(),
      nome: nomeNovoFiltro,
      filtros: { ...filtros },
      isFavorito: false,
      criadoEm: new Date()
    }

    const novosFiltros = [...filtrosSalvos, novoFiltro]
    setFiltrosSalvos(novosFiltros)
    localStorage.setItem('classcheck-filtros-salvos', JSON.stringify(novosFiltros))
    
    setNomeNovoFiltro('')
    setMostrarSalvarFiltro(false)
  }

  const aplicarFiltroSalvo = (filtroSalvo: FiltrosSalvos) => {
    onFiltrosChange(filtroSalvo.filtros)
  }

  const removerFiltroSalvo = (id: string) => {
    const novosFiltros = filtrosSalvos.filter(f => f.id !== id)
    setFiltrosSalvos(novosFiltros)
    localStorage.setItem('classcheck-filtros-salvos', JSON.stringify(novosFiltros))
  }

  const toggleFavoritoFiltro = (id: string) => {
    const novosFiltros = filtrosSalvos.map(f => 
      f.id === id ? { ...f, isFavorito: !f.isFavorito } : f
    )
    setFiltrosSalvos(novosFiltros)
    localStorage.setItem('classcheck-filtros-salvos', JSON.stringify(novosFiltros))
  }

  return (
    <div className="space-y-4">
      {/* Header com contador */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filtros</span>
          {filtrosAtivos > 0 && (
            <Badge variant="secondary" className="text-xs">
              {filtrosAtivos} ativo{filtrosAtivos !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={limparFiltros}
          disabled={filtrosAtivos === 0}
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>

      {/* Busca */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, turma, professor..."
            value={filtros.busca || ''}
            onChange={(e) => aplicarFiltro('busca', e.target.value)}
            className="pl-7 text-xs"
          />
        </div>
      </div>

      <Separator />

      {/* Período */}
      <div className="space-y-2">
        <Label className="text-xs font-medium flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Período
        </Label>
        <Select
          value={filtros.periodo}
          onValueChange={(value) => aplicarFiltro('periodo', value)}
        >
          <SelectTrigger className="text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {opcoesperiodo.map((opcao) => (
              <SelectItem key={opcao.value} value={opcao.value} className="text-xs">
                {opcao.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Período Personalizado */}
      {filtros.periodo === 'personalizado' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Data Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-xs",
                    !filtros.dataInicio && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {filtros.dataInicio ? (
                    format(filtros.dataInicio, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    "Selecionar"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filtros.dataInicio}
                  onSelect={(date) => aplicarFiltro('dataInicio', date)}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs">Data Fim</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-xs",
                    !filtros.dataFim && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {filtros.dataFim ? (
                    format(filtros.dataFim, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    "Selecionar"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filtros.dataFim}
                  onSelect={(date) => aplicarFiltro('dataFim', date)}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      <Separator />

      {/* Turma */}
      <div className="space-y-2">
        <Label className="text-xs font-medium flex items-center gap-2">
          <Users className="h-3 w-3" />
          Turma
        </Label>
        <Select
          value={filtros.turma}
          onValueChange={(value) => aplicarFiltro('turma', value)}
        >
          <SelectTrigger className="text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {opcoesTurma.map((opcao) => (
              <SelectItem key={opcao.value} value={opcao.value} className="text-xs">
                {opcao.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Professor */}
      <div className="space-y-2">
        <Label className="text-xs font-medium flex items-center gap-2">
          <BookOpen className="h-3 w-3" />
          Professor
        </Label>
        <Select
          value={filtros.professor}
          onValueChange={(value) => aplicarFiltro('professor', value)}
        >
          <SelectTrigger className="text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {opcoesProfessor.map((opcao) => (
              <SelectItem key={opcao.value} value={opcao.value} className="text-xs">
                {opcao.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Humor */}
      <div className="space-y-2">
        <Label className="text-xs font-medium flex items-center gap-2">
          <Activity className="h-3 w-3" />
          Humor
        </Label>
        <Select
          value={filtros.humor}
          onValueChange={(value) => aplicarFiltro('humor', value)}
        >
          <SelectTrigger className="text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {opcoesHumor.map((opcao) => (
              <SelectItem key={opcao.value} value={opcao.value} className="text-xs">
                {opcao.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Status da Aula</Label>
        <Select
          value={filtros.status}
          onValueChange={(value) => aplicarFiltro('status', value)}
        >
          <SelectTrigger className="text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {opcoesStatus.map((opcao) => (
              <SelectItem key={opcao.value} value={opcao.value} className="text-xs">
                {opcao.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Salvar Filtro */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Filtros Salvos</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarSalvarFiltro(!mostrarSalvarFiltro)}
          >
            <Save className="h-3 w-3" />
          </Button>
        </div>

        {mostrarSalvarFiltro && (
          <div className="flex gap-2">
            <Input
              placeholder="Nome do filtro..."
              value={nomeNovoFiltro}
              onChange={(e) => setNomeNovoFiltro(e.target.value)}
              className="text-xs"
            />
            <Button
              size="sm"
              onClick={salvarFiltro}
              disabled={!nomeNovoFiltro.trim()}
            >
              <Save className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Lista de Filtros Salvos */}
      {filtrosSalvos.length > 0 && (
        <div className="space-y-2">
          {filtrosSalvos
            .sort((a, b) => (b.isFavorito ? 1 : 0) - (a.isFavorito ? 1 : 0))
            .map((filtroSalvo) => (
              <div
                key={filtroSalvo.id}
                className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavoritoFiltro(filtroSalvo.id)}
                    className="p-0 h-auto"
                  >
                    <Star className={cn(
                      "h-3 w-3",
                      filtroSalvo.isFavorito ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    )} />
                  </Button>
                  <button
                    onClick={() => aplicarFiltroSalvo(filtroSalvo)}
                    className="text-left flex-1 min-w-0"
                  >
                    <div className="text-xs font-medium truncate">
                      {filtroSalvo.nome}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(filtroSalvo.criadoEm, "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  </button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removerFiltroSalvo(filtroSalvo.id)}
                  className="p-0 h-auto text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
