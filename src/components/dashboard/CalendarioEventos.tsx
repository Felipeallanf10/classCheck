'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  BookOpen,
  AlertCircle,
  Plus,
  Filter,
  Grid3X3,
  List,
  Smile,
  Meh,
  Frown
} from 'lucide-react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  getDay,
  startOfWeek,
  endOfWeek,
  isToday,
  parseISO,
  addDays
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Evento {
  id: string
  titulo: string
  descricao?: string
  data: Date
  horaInicio: string
  horaFim: string
  tipo: 'aula' | 'avaliacao' | 'evento' | 'reuniao' | 'feriado'
  status: 'agendado' | 'realizado' | 'cancelado' | 'remarcado'
  turma?: string
  professor?: string
  disciplina?: string
  local?: string
  cor: string
  participantes?: number
  humorMedio?: number
  observacoes?: string
}

interface CalendarioEventosProps {
  className?: string
}

export function CalendarioEventos({ className }: CalendarioEventosProps) {
  const [dataAtual, setDataAtual] = useState(new Date())
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null)
  const [modoVisualizacao, setModoVisualizacao] = useState<'mes' | 'semana' | 'agenda'>('agenda')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)

  // Detectar tamanho da tela para modo padrão
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setModoVisualizacao('agenda')
      } else {
        setModoVisualizacao('mes')
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Dados mockados para demonstração
  const eventosMock: Evento[] = [
    {
      id: '1',
      titulo: 'Matemática - Álgebra Linear',
      descricao: 'Aula sobre sistemas de equações lineares',
      data: new Date(),
      horaInicio: '08:00',
      horaFim: '09:30',
      tipo: 'aula',
      status: 'agendado',
      turma: '1ª Série A',
      professor: 'Prof. Silva',
      disciplina: 'Matemática',
      local: 'Sala 201',
      cor: '#3B82F6',
      participantes: 32,
      humorMedio: 4.2
    },
    {
      id: '2',
      titulo: 'Avaliação de Português',
      descricao: 'Prova bimestral - Literatura Brasileira',
      data: addDays(new Date(), 2),
      horaInicio: '10:00',
      horaFim: '11:30',
      tipo: 'avaliacao',
      status: 'agendado',
      turma: '2ª Série B',
      professor: 'Prof. Santos',
      disciplina: 'Português',
      local: 'Sala 105',
      cor: '#EF4444',
      participantes: 28
    },
    {
      id: '3',
      titulo: 'Feira de Ciências',
      descricao: 'Apresentação dos projetos científicos',
      data: addDays(new Date(), 5),
      horaInicio: '14:00',
      horaFim: '17:00',
      tipo: 'evento',
      status: 'agendado',
      local: 'Pátio Central',
      cor: '#10B981',
      participantes: 150
    },
    {
      id: '4',
      titulo: 'Reunião Pedagógica',
      descricao: 'Planejamento do próximo bimestre',
      data: addDays(new Date(), -1),
      horaInicio: '18:00',
      horaFim: '20:00',
      tipo: 'reuniao',
      status: 'realizado',
      local: 'Sala dos Professores',
      cor: '#F59E0B',
      participantes: 15
    },
    {
      id: '5',
      titulo: 'História - Segunda Guerra',
      descricao: 'Causas e consequências da Segunda Guerra Mundial',
      data: addDays(new Date(), -2),
      horaInicio: '13:30',
      horaFim: '15:00',
      tipo: 'aula',
      status: 'realizado',
      turma: '3ª Série A',
      professor: 'Prof. Oliveira',
      disciplina: 'História',
      local: 'Sala 301',
      cor: '#3B82F6',
      participantes: 30,
      humorMedio: 3.8,
      observacoes: 'Boa participação dos alunos'
    }
  ]

  // Carregar eventos
  useEffect(() => {
    setLoading(true)
    // Simulação de carregamento
    setTimeout(() => {
      setEventos(eventosMock)
      setLoading(false)
    }, 1000)
  }, [])

  // Filtrar eventos
  const eventosFiltrados = eventos.filter(evento => {
    if (filtroTipo !== 'todos' && evento.tipo !== filtroTipo) return false
    if (filtroStatus !== 'todos' && evento.status !== filtroStatus) return false
    return true
  })

  // Eventos do mês atual
  const eventosDoMes = eventosFiltrados.filter(evento => 
    isSameMonth(evento.data, dataAtual)
  )

  // Navegar pelos meses
  const navegarMes = (direcao: 'anterior' | 'proximo') => {
    if (direcao === 'anterior') {
      setDataAtual(subMonths(dataAtual, 1))
    } else {
      setDataAtual(addMonths(dataAtual, 1))
    }
  }

  const voltarParaHoje = () => {
    setDataAtual(new Date())
  }

  // Obter eventos de um dia
  const obterEventosDoDia = (data: Date) => {
    return eventosFiltrados.filter(evento => isSameDay(evento.data, data))
  }

  // Cores por tipo de evento
  const coresPorTipo = {
    aula: '#3B82F6',
    avaliacao: '#EF4444', 
    evento: '#10B981',
    reuniao: '#F59E0B',
    feriado: '#8B5CF6'
  }

  // Ícones por status
  const iconesPorStatus = {
    agendado: Clock,
    realizado: BookOpen,
    cancelado: AlertCircle,
    remarcado: Clock
  }

  // Renderizar humor médio
  const renderizarHumor = (humor?: number) => {
    if (!humor) return null
    
    if (humor >= 4) return <Smile className="h-4 w-4 text-green-500" />
    if (humor >= 3) return <Meh className="h-4 w-4 text-yellow-500" />
    return <Frown className="h-4 w-4 text-red-500" />
  }

  // Renderizar calendário do mês
  const renderizarCalendarioMes = () => {
    const inicioMes = startOfMonth(dataAtual)
    const fimMes = endOfMonth(dataAtual)
    const inicioCalendario = startOfWeek(inicioMes, { locale: ptBR })
    const fimCalendario = endOfWeek(fimMes, { locale: ptBR })
    
    const dias = eachDayOfInterval({ start: inicioCalendario, end: fimCalendario })
    
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    
    return (
      <div className="space-y-4">
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-2">
          {diasSemana.map(dia => (
            <div key={dia} className="text-center text-sm font-medium text-muted-foreground p-2">
              {dia}
            </div>
          ))}
        </div>
        
        {/* Grade do calendário */}
        <div className="grid grid-cols-7 gap-2">
          {dias.map(dia => {
            const eventosDoDia = obterEventosDoDia(dia)
            const isHoje = isToday(dia)
            const isMesAtual = isSameMonth(dia, dataAtual)
            
            return (
              <div
                key={dia.toISOString()}
                className={cn(
                  "min-h-[120px] p-2 border rounded-lg transition-colors cursor-pointer",
                  isMesAtual ? "bg-background hover:bg-muted/50" : "bg-muted/20 text-muted-foreground",
                  isHoje && "ring-2 ring-primary"
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-1",
                  isHoje && "text-primary"
                )}>
                  {format(dia, 'd')}
                </div>
                
                <div className="space-y-1">
                  {eventosDoDia.slice(0, 3).map(evento => (
                    <Button
                      key={evento.id}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full h-auto p-1 justify-start text-left",
                        "hover:bg-background/80"
                      )}
                      style={{ 
                        backgroundColor: evento.cor + '20',
                        borderLeft: `3px solid ${evento.cor}`
                      }}
                      onClick={() => setEventoSelecionado(evento)}
                    >
                      <div className="truncate text-xs">
                        {evento.titulo}
                      </div>
                    </Button>
                  ))}
                  
                  {eventosDoDia.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{eventosDoDia.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Renderizar agenda
  const renderizarAgenda = () => {
    const eventosOrdenados = eventosFiltrados
      .sort((a, b) => a.data.getTime() - b.data.getTime())
    
    return (
      <ScrollArea className="h-[400px] sm:h-[500px]">
        <div className="space-y-2 sm:space-y-3">
          {eventosOrdenados.map(evento => {
            const IconeStatus = iconesPorStatus[evento.status]
            
            return (
              <Card
                key={evento.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  evento.status === 'cancelado' && "opacity-60"
                )}
                style={{ borderLeft: `3px solid ${evento.cor}` }}
                onClick={() => setEventoSelecionado(evento)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h4 className="font-medium text-sm sm:text-base truncate">{evento.titulo}</h4>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {evento.tipo}
                          </Badge>
                          <Badge 
                            variant={evento.status === 'realizado' ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            <IconeStatus className="h-2.5 w-2.5 mr-1" />
                            {evento.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                        {format(evento.data, "EEE, dd/MM", { locale: ptBR })}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{evento.horaInicio} - {evento.horaFim}</span>
                        </div>
                        
                        {evento.local && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{evento.local}</span>
                          </div>
                        )}
                        
                        {evento.participantes && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 flex-shrink-0" />
                            {evento.participantes}
                          </div>
                        )}
                        
                        {renderizarHumor(evento.humorMedio)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">Calendário de Eventos</span>
          </CardTitle>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Filtros */}
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full sm:w-32 h-8 sm:h-10 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos tipos</SelectItem>
                <SelectItem value="aula">Aulas</SelectItem>
                <SelectItem value="avaliacao">Avaliações</SelectItem>
                <SelectItem value="evento">Eventos</SelectItem>
                <SelectItem value="reuniao">Reuniões</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Modo de visualização */}
            <div className="flex border rounded-md">
              <Button
                variant={modoVisualizacao === 'mes' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setModoVisualizacao('mes')}
                className="px-2 sm:px-3 h-8 sm:h-10 hidden lg:flex"
              >
                <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="ml-1 sm:ml-2 hidden xl:inline text-xs sm:text-sm">Mês</span>
              </Button>
              <Button
                variant={modoVisualizacao === 'agenda' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setModoVisualizacao('agenda')}
                className="px-2 sm:px-3 h-8 sm:h-10"
              >
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="ml-1 sm:ml-2 hidden sm:inline text-xs sm:text-sm">Lista</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Navegação do mês */}
        {modoVisualizacao === 'mes' && (
          <div className="flex items-center justify-between gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navegarMes('anterior')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Mês anterior</span>
            </Button>
            
            <h3 className="text-sm sm:text-base font-semibold text-center flex-1">
              {format(dataAtual, "MMMM 'de' yyyy", { locale: ptBR })}
            </h3>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navegarMes('proximo')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próximo mês</span>
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-3 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[200px] sm:h-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-xs sm:text-sm">Carregando eventos...</p>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            {modoVisualizacao === 'mes' && (
              <div className="overflow-x-auto">
                <div className="min-w-[600px] sm:min-w-0">
                  {renderizarCalendarioMes()}
                </div>
              </div>
            )}
            {modoVisualizacao === 'agenda' && (
              <div className="w-full">
                {renderizarAgenda()}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Dialog de detalhes do evento */}
      <Dialog open={!!eventoSelecionado} onOpenChange={() => setEventoSelecionado(null)}>
        <DialogContent className="max-w-md">
          {eventoSelecionado && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: eventoSelecionado.cor }}
                  />
                  {eventoSelecionado.titulo}
                </DialogTitle>
                <DialogDescription>
                  {eventoSelecionado.descricao}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Data</Label>
                    <p className="text-sm">
                      {format(eventoSelecionado.data, "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Horário</Label>
                    <p className="text-sm">
                      {eventoSelecionado.horaInicio} - {eventoSelecionado.horaFim}
                    </p>
                  </div>
                </div>
                
                {eventoSelecionado.turma && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Turma</Label>
                    <p className="text-sm">{eventoSelecionado.turma}</p>
                  </div>
                )}
                
                {eventoSelecionado.professor && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Professor</Label>
                    <p className="text-sm">{eventoSelecionado.professor}</p>
                  </div>
                )}
                
                {eventoSelecionado.local && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Local</Label>
                    <p className="text-sm">{eventoSelecionado.local}</p>
                  </div>
                )}
                
                {eventoSelecionado.participantes && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Participantes</Label>
                    <p className="text-sm">{eventoSelecionado.participantes} pessoas</p>
                  </div>
                )}
                
                {eventoSelecionado.humorMedio && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Humor Médio</Label>
                    <div className="flex items-center gap-2">
                      {renderizarHumor(eventoSelecionado.humorMedio)}
                      <span className="text-sm">{eventoSelecionado.humorMedio.toFixed(1)}/5</span>
                    </div>
                  </div>
                )}
                
                {eventoSelecionado.observacoes && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Observações</Label>
                    <p className="text-sm">{eventoSelecionado.observacoes}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

const Label = ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
  <label className={cn("text-xs font-medium text-muted-foreground", className)} {...props}>
    {children}
  </label>
)
