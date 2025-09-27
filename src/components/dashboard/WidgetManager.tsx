'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  GripVertical,
  Plus,
  Settings,
  Eye,
  EyeOff,
  Trash2,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle,
  Star,
  Heart,
  Zap,
  Save,
  RotateCcw,
  Grid3X3,
  Layout
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Widget {
  id: string
  tipo: string
  titulo: string
  configuracao: Record<string, any>
  posicao: {
    x: number
    y: number
    width: number
    height: number
  }
  visivel: boolean
  criadoEm: Date
  atualizadoEm: Date
}

interface TipoWidget {
  id: string
  nome: string
  descricao: string
  icone: React.ReactNode
  categoria: 'metricas' | 'graficos' | 'listas' | 'informacoes'
  tamanhos: Array<{
    nome: string
    width: number
    height: number
  }>
  configuracoes: Array<{
    chave: string
    nome: string
    tipo: 'text' | 'select' | 'number' | 'boolean'
    opcoes?: Array<{ value: string; label: string }>
    padrao: any
  }>
}

interface LayoutSalvo {
  id: string
  nome: string
  widgets: Widget[]
  criadoEm: Date
  isFavorito: boolean
}

interface WidgetManagerProps {
  className?: string
}

export function WidgetManager({ className }: WidgetManagerProps) {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [layoutsSalvos, setLayoutsSalvos] = useState<LayoutSalvo[]>([])
  const [widgetSelecionado, setWidgetSelecionado] = useState<Widget | null>(null)
  const [mostrarGaleria, setMostrarGaleria] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(true)
  const [widgetArrastando, setWidgetArrastando] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Tipos de widgets disponíveis
  const tiposWidgets: TipoWidget[] = [
    {
      id: 'card-metrica',
      nome: 'Card de Métrica',
      descricao: 'Exibe uma métrica principal com trend',
      icone: <Target className="h-5 w-5" />,
      categoria: 'metricas',
      tamanhos: [
        { nome: 'Pequeno', width: 200, height: 120 },
        { nome: 'Médio', width: 300, height: 150 },
        { nome: 'Grande', width: 400, height: 180 }
      ],
      configuracoes: [
        { chave: 'titulo', nome: 'Título', tipo: 'text', padrao: 'Métrica' },
        { chave: 'valor', nome: 'Valor', tipo: 'number', padrao: 100 },
        { chave: 'unidade', nome: 'Unidade', tipo: 'text', padrao: '' },
        { 
          chave: 'cor', 
          nome: 'Cor', 
          tipo: 'select', 
          opcoes: [
            { value: 'blue', label: 'Azul' },
            { value: 'green', label: 'Verde' },
            { value: 'red', label: 'Vermelho' },
            { value: 'yellow', label: 'Amarelo' }
          ],
          padrao: 'blue' 
        }
      ]
    },
    {
      id: 'grafico-barras',
      nome: 'Gráfico de Barras',
      descricao: 'Gráfico de barras interativo',
      icone: <BarChart3 className="h-5 w-5" />,
      categoria: 'graficos',
      tamanhos: [
        { nome: 'Médio', width: 400, height: 250 },
        { nome: 'Grande', width: 500, height: 300 },
        { nome: 'Extra Grande', width: 600, height: 400 }
      ],
      configuracoes: [
        { chave: 'titulo', nome: 'Título', tipo: 'text', padrao: 'Gráfico' },
        { 
          chave: 'periodo', 
          nome: 'Período', 
          tipo: 'select',
          opcoes: [
            { value: '7d', label: 'Últimos 7 dias' },
            { value: '30d', label: 'Últimos 30 dias' },
            { value: '90d', label: 'Últimos 90 dias' }
          ],
          padrao: '30d' 
        }
      ]
    },
    {
      id: 'grafico-pizza',
      nome: 'Gráfico de Pizza',
      descricao: 'Gráfico circular para distribuição',
      icone: <PieChart className="h-5 w-5" />,
      categoria: 'graficos',
      tamanhos: [
        { nome: 'Médio', width: 300, height: 300 },
        { nome: 'Grande', width: 400, height: 400 }
      ],
      configuracoes: [
        { chave: 'titulo', nome: 'Título', tipo: 'text', padrao: 'Distribuição' },
        { chave: 'mostrarLegenda', nome: 'Mostrar Legenda', tipo: 'boolean', padrao: true }
      ]
    },
    {
      id: 'lista-alunos',
      nome: 'Lista de Alunos',
      descricao: 'Lista dos alunos com status',
      icone: <Users className="h-5 w-5" />,
      categoria: 'listas',
      tamanhos: [
        { nome: 'Médio', width: 350, height: 250 },
        { nome: 'Grande', width: 450, height: 350 },
        { nome: 'Extra Grande', width: 550, height: 450 }
      ],
      configuracoes: [
        { chave: 'titulo', nome: 'Título', tipo: 'text', padrao: 'Alunos' },
        { chave: 'limite', nome: 'Limite de itens', tipo: 'number', padrao: 10 },
        {
          chave: 'turma',
          nome: 'Turma',
          tipo: 'select',
          opcoes: [
            { value: 'todas', label: 'Todas as turmas' },
            { value: '1a', label: '1ª Série' },
            { value: '2a', label: '2ª Série' },
            { value: '3a', label: '3ª Série' }
          ],
          padrao: 'todas'
        }
      ]
    },
    {
      id: 'calendario-mini',
      nome: 'Mini Calendário',
      descricao: 'Calendário compacto com eventos',
      icone: <Calendar className="h-5 w-5" />,
      categoria: 'informacoes',
      tamanhos: [
        { nome: 'Pequeno', width: 280, height: 300 },
        { nome: 'Médio', width: 350, height: 400 }
      ],
      configuracoes: [
        { chave: 'titulo', nome: 'Título', tipo: 'text', padrao: 'Calendário' },
        { chave: 'mostrarEventos', nome: 'Mostrar Eventos', tipo: 'boolean', padrao: true }
      ]
    },
    {
      id: 'alertas',
      nome: 'Central de Alertas',
      descricao: 'Lista de alertas importantes',
      icone: <AlertTriangle className="h-5 w-5" />,
      categoria: 'informacoes',
      tamanhos: [
        { nome: 'Médio', width: 350, height: 200 },
        { nome: 'Grande', width: 450, height: 300 }
      ],
      configuracoes: [
        { chave: 'titulo', nome: 'Título', tipo: 'text', padrao: 'Alertas' },
        { 
          chave: 'prioridade', 
          nome: 'Prioridade Mínima', 
          tipo: 'select',
          opcoes: [
            { value: 'baixa', label: 'Baixa' },
            { value: 'media', label: 'Média' },
            { value: 'alta', label: 'Alta' }
          ],
          padrao: 'media' 
        }
      ]
    }
  ]

  // Criar novo widget
  const criarWidget = (tipo: TipoWidget, tamanho: { width: number; height: number }) => {
    const novoWidget: Widget = {
      id: Date.now().toString(),
      tipo: tipo.id,
      titulo: tipo.nome,
      configuracao: tipo.configuracoes.reduce((config, conf) => {
        config[conf.chave] = conf.padrao
        return config
      }, {} as Record<string, any>),
      posicao: {
        x: Math.floor(Math.random() * 200),
        y: Math.floor(Math.random() * 100),
        width: tamanho.width,
        height: tamanho.height
      },
      visivel: true,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    }

    setWidgets(prev => [...prev, novoWidget])
    setMostrarGaleria(false)
  }

  // Atualizar widget
  const atualizarWidget = (id: string, updates: Partial<Widget>) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id 
        ? { ...widget, ...updates, atualizadoEm: new Date() }
        : widget
    ))
  }

  // Remover widget
  const removerWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id))
    setWidgetSelecionado(null)
  }

  // Toggle visibilidade
  const toggleVisibilidade = (id: string) => {
    atualizarWidget(id, { 
      visivel: !widgets.find(w => w.id === id)?.visivel 
    })
  }

  // Salvar layout
  const salvarLayout = (nome: string) => {
    const novoLayout: LayoutSalvo = {
      id: Date.now().toString(),
      nome,
      widgets: [...widgets],
      criadoEm: new Date(),
      isFavorito: false
    }

    setLayoutsSalvos(prev => [...prev, novoLayout])
    
    // Salvar no localStorage
    const layoutsLS = JSON.parse(localStorage.getItem('classcheck-layouts') || '[]')
    layoutsLS.push(novoLayout)
    localStorage.setItem('classcheck-layouts', JSON.stringify(layoutsLS))
  }

  // Carregar layout
  const carregarLayout = (layout: LayoutSalvo) => {
    setWidgets([...layout.widgets])
  }

  // Limpar todos os widgets
  const limparWidgets = () => {
    setWidgets([])
    setWidgetSelecionado(null)
  }

  // Handles do drag and drop
  const handleDragStart = (e: React.DragEvent, widget: Widget) => {
    setWidgetArrastando(widget.id)
    e.dataTransfer.setData('text/plain', widget.id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    
    if (!containerRef.current || !widgetArrastando) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    atualizarWidget(widgetArrastando, {
      posicao: {
        ...widgets.find(w => w.id === widgetArrastando)?.posicao!,
        x: Math.max(0, x - 100), // Offset para centralizar
        y: Math.max(0, y - 50)
      }
    })
    
    setWidgetArrastando(null)
  }

  // Renderizar widget
  const renderizarWidget = (widget: Widget) => {
    const tipoWidget = tiposWidgets.find(t => t.id === widget.tipo)
    
    if (!tipoWidget) return null

    const estilo: React.CSSProperties = {
      position: 'absolute',
      left: widget.posicao.x,
      top: widget.posicao.y,
      width: widget.posicao.width,
      height: widget.posicao.height,
      zIndex: widgetSelecionado?.id === widget.id ? 10 : 1
    }

    return (
      <div
        key={widget.id}
        style={estilo}
        className={cn(
          "transition-all",
          !widget.visivel && "opacity-50",
          widgetSelecionado?.id === widget.id && "ring-2 ring-primary"
        )}
      >
        <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
          {modoEdicao && (
            <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => toggleVisibilidade(widget.id)}
              >
                {widget.visivel ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setWidgetSelecionado(widget)}
              >
                <Settings className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => removerWidget(widget.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <div
            className="h-full cursor-move"
            draggable={modoEdicao}
            onDragStart={(e) => handleDragStart(e, widget)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {modoEdicao && <GripVertical className="h-4 w-4 text-muted-foreground" />}
                {tipoWidget.icone}
                <CardTitle className="text-sm">
                  {widget.configuracao.titulo || widget.titulo}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {renderizarConteudoWidget(widget, tipoWidget)}
            </CardContent>
          </div>
        </Card>
      </div>
    )
  }

  // Renderizar conteúdo específico do widget
  const renderizarConteudoWidget = (widget: Widget, tipo: TipoWidget) => {
    switch (tipo.id) {
      case 'card-metrica':
        return (
          <div className="text-center">
            <div className={cn(
              "text-2xl font-bold",
              widget.configuracao.cor === 'blue' && "text-blue-600",
              widget.configuracao.cor === 'green' && "text-green-600",
              widget.configuracao.cor === 'red' && "text-red-600",
              widget.configuracao.cor === 'yellow' && "text-yellow-600"
            )}>
              {widget.configuracao.valor}
              {widget.configuracao.unidade && (
                <span className="text-sm ml-1">{widget.configuracao.unidade}</span>
              )}
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-muted-foreground">+12% vs mês anterior</span>
            </div>
          </div>
        )

      case 'grafico-barras':
        return (
          <div className="h-full flex items-center justify-center bg-muted/50 rounded">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                Gráfico de barras - {widget.configuracao.periodo}
              </p>
            </div>
          </div>
        )

      case 'grafico-pizza':
        return (
          <div className="h-full flex items-center justify-center bg-muted/50 rounded">
            <div className="text-center">
              <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">Gráfico de pizza</p>
            </div>
          </div>
        )

      case 'lista-alunos':
        return (
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].slice(0, widget.configuracao.limite).map((i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 bg-muted rounded-full" />
                  <span>Aluno {i}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Ativo
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        )

      case 'calendario-mini':
        return (
          <div className="h-full flex items-center justify-center bg-muted/50 rounded">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                {format(new Date(), "MMMM yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        )

      case 'alertas':
        return (
          <div className="space-y-2">
            {[
              { tipo: 'warning', texto: 'Baixa participação - Turma A' },
              { tipo: 'error', texto: 'Aluno ausente por 3 dias' },
              { tipo: 'info', texto: 'Nova avaliação agendada' }
            ].map((alerta, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {alerta.tipo === 'warning' && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
                {alerta.tipo === 'error' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                {alerta.tipo === 'info' && <CheckCircle className="h-3 w-3 text-blue-500" />}
                <span>{alerta.texto}</span>
              </div>
            ))}
          </div>
        )

      default:
        return <div className="text-center text-muted-foreground">Widget não implementado</div>
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="modo-edicao"
                  checked={modoEdicao}
                  onCheckedChange={setModoEdicao}
                />
                <Label htmlFor="modo-edicao" className="text-sm">
                  Modo Edição
                </Label>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMostrarGaleria(true)}
                disabled={!modoEdicao}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Widget
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => salvarLayout(`Layout_${format(new Date(), 'dd-MM_HH-mm')}`)}
                disabled={widgets.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Layout
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {widgets.filter(w => w.visivel).length} widgets ativos
              </Badge>
              
              {modoEdicao && widgets.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limparWidgets}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas dos Widgets */}
      <Card className="min-h-[600px]">
        <CardContent className="p-0">
          <div
            ref={containerRef}
            className="relative w-full h-[600px] bg-muted/20"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {widgets.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Layout className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    Nenhum widget adicionado
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Adicione widgets para criar seu dashboard personalizado
                  </p>
                  <Button onClick={() => setMostrarGaleria(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Widget
                  </Button>
                </div>
              </div>
            ) : (
              widgets.map(renderizarWidget)
            )}
          </div>
        </CardContent>
      </Card>

      {/* Galeria de Widgets */}
      <Dialog open={mostrarGaleria} onOpenChange={setMostrarGaleria}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Galeria de Widgets</DialogTitle>
            <DialogDescription>
              Escolha um widget para adicionar ao seu dashboard
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6">
              {['metricas', 'graficos', 'listas', 'informacoes'].map(categoria => (
                <div key={categoria}>
                  <h3 className="text-sm font-medium mb-3 capitalize">{categoria}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tiposWidgets
                      .filter(tipo => tipo.categoria === categoria)
                      .map(tipo => (
                        <Card key={tipo.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              {tipo.icone}
                              <div>
                                <h4 className="font-medium text-sm">{tipo.nome}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {tipo.descricao}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-xs">Tamanho:</Label>
                              <div className="flex gap-2">
                                {tipo.tamanhos.map(tamanho => (
                                  <Button
                                    key={tamanho.nome}
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => criarWidget(tipo, tamanho)}
                                  >
                                    {tamanho.nome}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Configuração do Widget */}
      <Dialog 
        open={!!widgetSelecionado} 
        onOpenChange={() => setWidgetSelecionado(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Widget</DialogTitle>
            <DialogDescription>
              Personalize as configurações do widget
            </DialogDescription>
          </DialogHeader>
          
          {widgetSelecionado && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="widget-titulo">Título</Label>
                <Input
                  id="widget-titulo"
                  value={widgetSelecionado.titulo}
                  onChange={(e) => 
                    atualizarWidget(widgetSelecionado.id, { titulo: e.target.value })
                  }
                />
              </div>

              {tiposWidgets
                .find(t => t.id === widgetSelecionado.tipo)
                ?.configuracoes.map(config => (
                  <div key={config.chave}>
                    <Label>{config.nome}</Label>
                    
                    {config.tipo === 'text' && (
                      <Input
                        value={widgetSelecionado.configuracao[config.chave] || ''}
                        onChange={(e) =>
                          atualizarWidget(widgetSelecionado.id, {
                            configuracao: {
                              ...widgetSelecionado.configuracao,
                              [config.chave]: e.target.value
                            }
                          })
                        }
                      />
                    )}
                    
                    {config.tipo === 'number' && (
                      <Input
                        type="number"
                        value={widgetSelecionado.configuracao[config.chave] || 0}
                        onChange={(e) =>
                          atualizarWidget(widgetSelecionado.id, {
                            configuracao: {
                              ...widgetSelecionado.configuracao,
                              [config.chave]: Number(e.target.value)
                            }
                          })
                        }
                      />
                    )}
                    
                    {config.tipo === 'select' && config.opcoes && (
                      <Select
                        value={widgetSelecionado.configuracao[config.chave]}
                        onValueChange={(value) =>
                          atualizarWidget(widgetSelecionado.id, {
                            configuracao: {
                              ...widgetSelecionado.configuracao,
                              [config.chave]: value
                            }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {config.opcoes.map(opcao => (
                            <SelectItem key={opcao.value} value={opcao.value}>
                              {opcao.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {config.tipo === 'boolean' && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={widgetSelecionado.configuracao[config.chave]}
                          onCheckedChange={(checked) =>
                            atualizarWidget(widgetSelecionado.id, {
                              configuracao: {
                                ...widgetSelecionado.configuracao,
                                [config.chave]: checked
                              }
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
