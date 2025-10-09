'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Download,
  FileSpreadsheet,
  Database,
  Mail,
  Cloud,
  Settings,
  Calendar,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  FileText,
  Image,
  BarChart3,
  Users,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface ConfiguracaoExportacao {
  formato: 'xlsx' | 'csv' | 'json' | 'pdf' | 'xml'
  dados: string[]
  periodo: {
    inicio: Date
    fim: Date
  }
  filtros: {
    turmas: string[]
    professores: string[]
    status: string[]
  }
  configuracoes: {
    incluirCabecalho: boolean
    incluirTotalizadores: boolean
    incluirGraficos: boolean
    separarPorPlanilha: boolean
    compactar: boolean
  }
  destino: 'download' | 'email' | 'nuvem' | 'ftp'
  agendamento?: {
    ativo: boolean
    frequencia: 'diario' | 'semanal' | 'mensal'
    dia?: number
    hora: string
    email?: string
  }
}

interface TarefaExportacao {
  id: string
  nome: string
  formato: string
  status: 'aguardando' | 'processando' | 'concluida' | 'erro'
  progresso: number
  criadaEm: Date
  concluidaEm?: Date
  tamanho?: string
  erro?: string
  configuracao: ConfiguracaoExportacao
}

interface SistemaExportacaoProps {
  className?: string
}

export function SistemaExportacao({ className }: SistemaExportacaoProps) {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoExportacao>({
    formato: 'xlsx',
    dados: ['registros-humor', 'dados-presenca'],
    periodo: {
      inicio: subDays(new Date(), 30),
      fim: new Date()
    },
    filtros: {
      turmas: [],
      professores: [],
      status: []
    },
    configuracoes: {
      incluirCabecalho: true,
      incluirTotalizadores: true,
      incluirGraficos: false,
      separarPorPlanilha: true,
      compactar: false
    },
    destino: 'download'
  })

  const [tarefas, setTarefas] = useState<TarefaExportacao[]>([])
  const [mostrarConfiguracoes, setMostrarConfiguracoes] = useState(false)
  const [tarefaAtiva, setTarefaAtiva] = useState<string | null>(null)

  // Opções disponíveis
  const formatosDisponiveis = [
    { 
      value: 'xlsx', 
      label: 'Excel (.xlsx)', 
      icone: <FileSpreadsheet className="h-4 w-4" />,
      descricao: 'Planilha Excel com múltiplas abas',
      tamanhoMedio: '2-5 MB'
    },
    { 
      value: 'csv', 
      label: 'CSV (.csv)', 
      icone: <FileText className="h-4 w-4" />,
      descricao: 'Arquivo de texto separado por vírgulas',
      tamanhoMedio: '500 KB - 2 MB'
    },
    { 
      value: 'json', 
      label: 'JSON (.json)', 
      icone: <Database className="h-4 w-4" />,
      descricao: 'Formato estruturado para integração',
      tamanhoMedio: '1-3 MB'
    },
    { 
      value: 'pdf', 
      label: 'PDF (.pdf)', 
      icone: <FileText className="h-4 w-4" />,
      descricao: 'Relatório formatado para impressão',
      tamanhoMedio: '1-4 MB'
    },
    { 
      value: 'xml', 
      label: 'XML (.xml)', 
      icone: <Database className="h-4 w-4" />,
      descricao: 'Formato estruturado padrão',
      tamanhoMedio: '2-6 MB'
    }
  ]

  const tiposDados = [
    {
      id: 'registros-humor',
      nome: 'Registros de Humor',
      descricao: 'Dados de humor socioemocional dos alunos',
      icone: <BarChart3 className="h-4 w-4" />,
      campos: ['Data', 'Aluno', 'Turma', 'Humor', 'Observações'],
      estimativaRegistros: 1250
    },
    {
      id: 'dados-presenca',
      nome: 'Dados de Presença',
      descricao: 'Registros de presença por aula',
      icone: <Users className="h-4 w-4" />,
      campos: ['Data', 'Aula', 'Aluno', 'Status', 'Professor'],
      estimativaRegistros: 3200
    },
    {
      id: 'avaliacoes',
      nome: 'Avaliações',
      descricao: 'Resultados das avaliações realizadas',
      icone: <FileText className="h-4 w-4" />,
      campos: ['Data', 'Avaliação', 'Aluno', 'Nota', 'Disciplina'],
      estimativaRegistros: 890
    },
    {
      id: 'dados-professor',
      nome: 'Dados do Professor',
      descricao: 'Informações e métricas dos professores',
      icone: <Users className="h-4 w-4" />,
      campos: ['Nome', 'Disciplina', 'Turmas', 'Carga Horária'],
      estimativaRegistros: 25
    },
    {
      id: 'eventos',
      nome: 'Eventos e Atividades',
      descricao: 'Calendário de eventos escolares',
      icone: <Calendar className="h-4 w-4" />,
      campos: ['Data', 'Evento', 'Tipo', 'Participantes', 'Local'],
      estimativaRegistros: 156
    }
  ]

  const destinosDisponiveis = [
    {
      value: 'download',
      label: 'Download Direto',
      icone: <Download className="h-4 w-4" />,
      descricao: 'Baixar arquivo imediatamente'
    },
    {
      value: 'email',
      label: 'Enviar por Email',
      icone: <Mail className="h-4 w-4" />,
      descricao: 'Enviar arquivo por email'
    },
    {
      value: 'nuvem',
      label: 'Salvar na Nuvem',
      icone: <Cloud className="h-4 w-4" />,
      descricao: 'Salvar no Google Drive/OneDrive'
    }
  ]

  // Atualizar configuração
  const atualizarConfiguracao = (campo: keyof ConfiguracaoExportacao, valor: any) => {
    setConfiguracao(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const atualizarConfiguracoes = (campo: string, valor: boolean) => {
    setConfiguracao(prev => ({
      ...prev,
      configuracoes: {
        ...prev.configuracoes,
        [campo]: valor
      }
    }))
  }

  // Iniciar exportação
  const iniciarExportacao = async () => {
    const novaTarefa: TarefaExportacao = {
      id: Date.now().toString(),
      nome: `Exportação_${format(new Date(), 'dd-MM-yyyy_HH-mm')}`,
      formato: configuracao.formato.toUpperCase(),
      status: 'processando',
      progresso: 0,
      criadaEm: new Date(),
      configuracao: { ...configuracao }
    }

    setTarefas(prev => [novaTarefa, ...prev])
    setTarefaAtiva(novaTarefa.id)

    try {
      // Simular processo de exportação
      const etapas = [
        { progresso: 10, tempo: 800, texto: 'Iniciando exportação...' },
        { progresso: 25, tempo: 1200, texto: 'Coletando dados...' },
        { progresso: 50, tempo: 1500, texto: 'Processando registros...' },
        { progresso: 75, tempo: 1000, texto: 'Formatando arquivo...' },
        { progresso: 90, tempo: 600, texto: 'Finalizando...' },
        { progresso: 100, tempo: 400, texto: 'Concluído!' }
      ]

      for (const etapa of etapas) {
        await new Promise(resolve => setTimeout(resolve, etapa.tempo))
        
        setTarefas(prev => prev.map(t => 
          t.id === novaTarefa.id 
            ? { ...t, progresso: etapa.progresso }
            : t
        ))
      }

      // Finalizar tarefa
      setTarefas(prev => prev.map(t => 
        t.id === novaTarefa.id 
          ? { 
              ...t, 
              status: 'concluida',
              concluidaEm: new Date(),
              tamanho: '2.4 MB'
            }
          : t
      ))

      // Simular download se for o destino escolhido
      if (configuracao.destino === 'download') {
        const link = document.createElement('a')
        link.href = '#'
        link.download = `${novaTarefa.nome}.${configuracao.formato}`
        link.click()
      }

    } catch (error) {
      setTarefas(prev => prev.map(t => 
        t.id === novaTarefa.id 
          ? { 
              ...t, 
              status: 'erro',
              erro: 'Erro durante a exportação'
            }
          : t
      ))
    } finally {
      setTarefaAtiva(null)
    }
  }

  // Remover tarefa
  const removerTarefa = (id: string) => {
    setTarefas(prev => prev.filter(t => t.id !== id))
  }

  // Reexecutar tarefa
  const reexecutarTarefa = async (tarefa: TarefaExportacao) => {
    setConfiguracao(tarefa.configuracao)
    await iniciarExportacao()
  }

  // Calcular estimativa de registros
  const calcularEstimativaRegistros = () => {
    return configuracao.dados.reduce((total, tipo) => {
      const tipoDado = tiposDados.find(t => t.id === tipo)
      return total + (tipoDado?.estimativaRegistros || 0)
    }, 0)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Configuração da Exportação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Sistema de Exportação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basico" className="space-y-4">
            <TabsList>
              <TabsTrigger value="basico">Configuração Básica</TabsTrigger>
              <TabsTrigger value="avancado">Configurações Avançadas</TabsTrigger>
              <TabsTrigger value="agendamento">Agendamento</TabsTrigger>
            </TabsList>

            <TabsContent value="basico" className="space-y-4">
              {/* Formato */}
              <div>
                <Label className="text-sm font-medium">Formato de Exportação</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                  {formatosDisponiveis.map((formato) => (
                    <Card
                      key={formato.value}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        configuracao.formato === formato.value && "ring-2 ring-primary"
                      )}
                      onClick={() => atualizarConfiguracao('formato', formato.value)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          {formato.icone}
                          <span className="font-medium text-sm">{formato.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {formato.descricao}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {formato.tamanhoMedio}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Tipos de Dados */}
              <div>
                <Label className="text-sm font-medium">Dados a Exportar</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {tiposDados.map((tipo) => (
                    <div
                      key={tipo.id}
                      className="flex items-start space-x-2 p-3 border rounded-lg"
                    >
                      <Checkbox
                        checked={configuracao.dados.includes(tipo.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            atualizarConfiguracao('dados', [...configuracao.dados, tipo.id])
                          } else {
                            atualizarConfiguracao('dados', configuracao.dados.filter(d => d !== tipo.id))
                          }
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {tipo.icone}
                          <Label htmlFor={tipo.id} className="text-sm font-medium cursor-pointer">
                            {tipo.nome}
                          </Label>
                          <Badge variant="outline" className="text-xs">
                            {tipo.estimativaRegistros.toLocaleString()} registros
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {tipo.descricao}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <strong>Campos:</strong> {tipo.campos.slice(0, 3).join(', ')}
                          {tipo.campos.length > 3 && '...'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Destino */}
              <div>
                <Label className="text-sm font-medium">Destino da Exportação</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  {destinosDisponiveis.map((destino) => (
                    <Card
                      key={destino.value}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        configuracao.destino === destino.value && "ring-2 ring-primary"
                      )}
                      onClick={() => atualizarConfiguracao('destino', destino.value)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          {destino.icone}
                          <span className="font-medium text-sm">{destino.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {destino.descricao}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="avancado" className="space-y-4">
              {/* Configurações do Arquivo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Configurações do Arquivo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={configuracao.configuracoes.incluirCabecalho}
                      onCheckedChange={(checked) => atualizarConfiguracoes('incluirCabecalho', checked as boolean)}
                    />
                    <Label className="text-sm">
                      Incluir cabeçalho com nomes das colunas
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={configuracao.configuracoes.incluirTotalizadores}
                      onCheckedChange={(checked) => atualizarConfiguracoes('incluirTotalizadores', checked as boolean)}
                    />
                    <Label className="text-sm">
                      Incluir linhas de totalizadores e resumos
                    </Label>
                  </div>

                  {configuracao.formato === 'xlsx' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={configuracao.configuracoes.incluirGraficos}
                          onCheckedChange={(checked) => atualizarConfiguracoes('incluirGraficos', checked as boolean)}
                        />
                        <Label className="text-sm">
                          Incluir gráficos automáticos (Excel)
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={configuracao.configuracoes.separarPorPlanilha}
                          onCheckedChange={(checked) => atualizarConfiguracoes('separarPorPlanilha', checked as boolean)}
                        />
                        <Label className="text-sm">
                          Separar dados em múltiplas planilhas
                        </Label>
                      </div>
                    </>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={configuracao.configuracoes.compactar}
                      onCheckedChange={(checked) => atualizarConfiguracoes('compactar', checked as boolean)}
                    />
                    <Label className="text-sm">
                      Compactar arquivo (.zip)
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Filtros */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros de Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Turmas</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar turmas..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas as turmas</SelectItem>
                          <SelectItem value="1a-serie">1ª Série</SelectItem>
                          <SelectItem value="2a-serie">2ª Série</SelectItem>
                          <SelectItem value="3a-serie">3ª Série</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os status</SelectItem>
                          <SelectItem value="ativo">Apenas ativos</SelectItem>
                          <SelectItem value="inativo">Apenas inativos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agendamento" className="space-y-4">
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  Configure exportações automáticas que serão executadas periodicamente.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Agendamento Automático</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={configuracao.agendamento?.ativo || false}
                      onCheckedChange={(checked) => 
                        atualizarConfiguracao('agendamento', {
                          ...configuracao.agendamento,
                          ativo: checked
                        })
                      }
                    />
                    <Label className="text-sm">
                      Ativar exportação automática
                    </Label>
                  </div>

                  {configuracao.agendamento?.ativo && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Frequência</Label>
                        <Select
                          value={configuracao.agendamento?.frequencia}
                          onValueChange={(value) => 
                            atualizarConfiguracao('agendamento', {
                              ...configuracao.agendamento,
                              frequencia: value
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diario">Diário</SelectItem>
                            <SelectItem value="semanal">Semanal</SelectItem>
                            <SelectItem value="mensal">Mensal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm">Horário</Label>
                        <Input
                          type="time"
                          value={configuracao.agendamento?.hora || '08:00'}
                          onChange={(e) =>
                            atualizarConfiguracao('agendamento', {
                              ...configuracao.agendamento,
                              hora: e.target.value
                            })
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label className="text-sm">Email para envio</Label>
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          value={configuracao.agendamento?.email || ''}
                          onChange={(e) =>
                            atualizarConfiguracao('agendamento', {
                              ...configuracao.agendamento,
                              email: e.target.value
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Resumo e Ação */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <div>
                <strong>Estimativa:</strong> {calcularEstimativaRegistros().toLocaleString()} registros
              </div>
              <div>
                <strong>Formato:</strong> {formatosDisponiveis.find(f => f.value === configuracao.formato)?.label}
              </div>
            </div>

            <Button
              onClick={iniciarExportacao}
              disabled={configuracao.dados.length === 0 || !!tarefaAtiva}
              className="min-w-[140px]"
            >
              {tarefaAtiva ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Iniciar Exportação
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tarefas de Exportação */}
      {tarefas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Tarefas de Exportação</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTarefas([])}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {tarefas.map((tarefa) => (
                  <div
                    key={tarefa.id}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {tarefa.status === 'processando' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                        {tarefa.status === 'concluida' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {tarefa.status === 'erro' && <AlertCircle className="h-4 w-4 text-red-500" />}
                        {tarefa.status === 'aguardando' && <Clock className="h-4 w-4 text-yellow-500" />}
                        
                        <div>
                          <p className="font-medium text-sm">{tarefa.nome}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{tarefa.formato}</span>
                            <span>•</span>
                            <span>{format(tarefa.criadaEm, "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                            {tarefa.tamanho && (
                              <>
                                <span>•</span>
                                <span>{tarefa.tamanho}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {tarefa.status === 'concluida' && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {tarefa.status === 'erro' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => reexecutarTarefa(tarefa)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}

                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removerTarefa(tarefa.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {tarefa.status === 'processando' && (
                      <div className="space-y-2">
                        <Progress value={tarefa.progresso} className="w-full" />
                        <p className="text-xs text-center text-muted-foreground">
                          {tarefa.progresso}% concluído
                        </p>
                      </div>
                    )}

                    {tarefa.status === 'erro' && tarefa.erro && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {tarefa.erro}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
