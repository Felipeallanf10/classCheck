'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  FileText,
  Download,
  Eye,
  Settings,
  Calendar,
  BarChart3,
  Users,
  FileBarChart,
  Image,
  Palette,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface ConfiguracaoPDF {
  template: string
  titulo: string
  subtitulo?: string
  incluirLogo: boolean
  incluirGraficos: boolean
  incluirTabelas: boolean
  incluirResumo: boolean
  formato: 'A4' | 'A3' | 'Carta'
  orientacao: 'portrait' | 'landscape'
  margem: 'pequena' | 'media' | 'grande'
  tema: 'classico' | 'moderno' | 'minimalista' | 'corporativo'
  periodo: {
    inicio: Date
    fim: Date
  }
  filtros: {
    turmas: string[]
    professores: string[]
    disciplinas: string[]
  }
}

interface TemplateInfo {
  id: string
  nome: string
  descricao: string
  icone: React.ReactNode
  previewImage: string
  categoria: 'relatorio' | 'analise' | 'administrativo'
  elementos: string[]
}

interface GeradorPDFProps {
  className?: string
}

export function GeradorPDF({ className }: GeradorPDFProps) {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoPDF>({
    template: 'relatorio-completo',
    titulo: 'Relatório ClassCheck',
    incluirLogo: true,
    incluirGraficos: true,
    incluirTabelas: true,
    incluirResumo: true,
    formato: 'A4',
    orientacao: 'portrait',
    margem: 'media',
    tema: 'moderno',
    periodo: {
      inicio: new Date(),
      fim: new Date()
    },
    filtros: {
      turmas: [],
      professores: [],
      disciplinas: []
    }
  })

  const [estaGerando, setEstaGerando] = useState(false)
  const [progresso, setProgresso] = useState(0)
  const [mostrarPreview, setMostrarPreview] = useState(false)
  const [historico, setHistorico] = useState<Array<{
    id: string
    nome: string
    template: string
    criadoEm: Date
    tamanho: string
    status: 'sucesso' | 'erro' | 'processando'
  }>>([])

  const previewRef = useRef<HTMLDivElement>(null)

  // Templates disponíveis
  const templates: TemplateInfo[] = [
    {
      id: 'relatorio-completo',
      nome: 'Relatório Completo',
      descricao: 'Relatório detalhado com todas as métricas e análises',
      icone: <FileText className="h-5 w-5" />,
      previewImage: '/placeholder-report.jpg',
      categoria: 'relatorio',
      elementos: ['Resumo Executivo', 'Gráficos', 'Tabelas', 'Análises', 'Recomendações']
    },
    {
      id: 'analise-humor',
      nome: 'Análise de Humor',
      descricao: 'Foco na análise socioemocional dos alunos',
      icone: <BarChart3 className="h-5 w-5" />,
      previewImage: '/placeholder-mood.jpg',
      categoria: 'analise',
      elementos: ['Gráficos de Humor', 'Tendências', 'Alertas', 'Distribuição por Turma']
    },
    {
      id: 'relatorio-turma',
      nome: 'Relatório por Turma',
      descricao: 'Análise específica de uma turma',
      icone: <Users className="h-5 w-5" />,
      previewImage: '/placeholder-class.jpg',
      categoria: 'relatorio',
      elementos: ['Dados da Turma', 'Performance', 'Participação', 'Evolução']
    },
    {
      id: 'dashboard-executivo',
      nome: 'Dashboard Executivo',
      descricao: 'Visão geral para gestores',
      icone: <FileBarChart className="h-5 w-5" />,
      previewImage: '/placeholder-executive.jpg',
      categoria: 'administrativo',
      elementos: ['KPIs', 'Comparativos', 'Metas', 'Indicadores']
    }
  ]

  const templateSelecionado = templates.find(t => t.id === configuracao.template)

  // Opções de configuração
  const temasDisponiveis = [
    { value: 'classico', label: 'Clássico', cores: ['#1f2937', '#374151', '#6b7280'] },
    { value: 'moderno', label: 'Moderno', cores: ['#3b82f6', '#1d4ed8', '#2563eb'] },
    { value: 'minimalista', label: 'Minimalista', cores: ['#000000', '#404040', '#808080'] },
    { value: 'corporativo', label: 'Corporativo', cores: ['#059669', '#047857', '#065f46'] }
  ]

  const formatosDisponiveis = [
    { value: 'A4', label: 'A4 (210 x 297mm)' },
    { value: 'A3', label: 'A3 (297 x 420mm)' },
    { value: 'Carta', label: 'Carta (216 x 279mm)' }
  ]

  // Atualizar configuração
  const atualizarConfiguracao = (campo: keyof ConfiguracaoPDF, valor: any) => {
    setConfiguracao(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  // Gerar PDF
  const gerarPDF = async () => {
    setEstaGerando(true)
    setProgresso(0)

    try {
      // Simular progresso da geração
      const intervalos = [
        { tempo: 500, progresso: 20, texto: 'Coletando dados...' },
        { tempo: 1000, progresso: 40, texto: 'Processando gráficos...' },
        { tempo: 800, progresso: 60, texto: 'Gerando tabelas...' },
        { tempo: 600, progresso: 80, texto: 'Formatando documento...' },
        { tempo: 400, progresso: 100, texto: 'Finalizando...' }
      ]

      for (const intervalo of intervalos) {
        await new Promise(resolve => setTimeout(resolve, intervalo.tempo))
        setProgresso(intervalo.progresso)
      }

      // Adicionar ao histórico
      const novoRelatorio = {
        id: Date.now().toString(),
        nome: configuracao.titulo,
        template: templateSelecionado?.nome || 'Template Desconhecido',
        criadoEm: new Date(),
        tamanho: '2.4 MB',
        status: 'sucesso' as const
      }

      setHistorico(prev => [novoRelatorio, ...prev])

      // Simular download
      const link = document.createElement('a')
      link.href = '#'
      link.download = `${configuracao.titulo.replace(/\s+/g, '_')}.pdf`
      link.click()

    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    } finally {
      setEstaGerando(false)
      setProgresso(0)
    }
  }

  // Renderizar preview
  const renderizarPreview = () => {
    const tema = temasDisponiveis.find(t => t.value === configuracao.tema)
    
    return (
      <div 
        ref={previewRef}
        className="bg-white shadow-lg mx-auto"
        style={{
          width: configuracao.formato === 'A4' ? '210mm' : configuracao.formato === 'A3' ? '297mm' : '216mm',
          minHeight: configuracao.formato === 'A4' ? '297mm' : configuracao.formato === 'A3' ? '420mm' : '279mm',
          transform: 'scale(0.5)',
          transformOrigin: 'top center'
        }}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b pb-4" style={{ borderColor: tema?.cores[0] }}>
            {configuracao.incluirLogo && (
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="text-right">
              <h1 className="text-2xl font-bold" style={{ color: tema?.cores[0] }}>
                {configuracao.titulo}
              </h1>
              {configuracao.subtitulo && (
                <p className="text-gray-600">{configuracao.subtitulo}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>

          {/* Resumo */}
          {configuracao.incluirResumo && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4" style={{ color: tema?.cores[1] }}>
                Resumo Executivo
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-2xl font-bold" style={{ color: tema?.cores[0] }}>245</div>
                  <div className="text-sm text-gray-600">Total de Alunos</div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-2xl font-bold" style={{ color: tema?.cores[0] }}>8.7</div>
                  <div className="text-sm text-gray-600">Média de Presença</div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-2xl font-bold" style={{ color: tema?.cores[0] }}>4.2</div>
                  <div className="text-sm text-gray-600">Humor Médio</div>
                </div>
              </div>
            </div>
          )}

          {/* Gráficos */}
          {configuracao.incluirGraficos && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4" style={{ color: tema?.cores[1] }}>
                Análise Gráfica
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-gray-400" />
                </div>
                <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {/* Tabelas */}
          {configuracao.incluirTabelas && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4" style={{ color: tema?.cores[1] }}>
                Dados Detalhados
              </h2>
              <div className="border rounded">
                <table className="w-full">
                  <thead style={{ backgroundColor: tema?.cores[0] + '10' }}>
                    <tr>
                      <th className="p-3 text-left text-sm font-medium">Turma</th>
                      <th className="p-3 text-left text-sm font-medium">Alunos</th>
                      <th className="p-3 text-left text-sm font-medium">Presença</th>
                      <th className="p-3 text-left text-sm font-medium">Humor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['1ª Série A', '1ª Série B', '2ª Série A'].map((turma, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-3 text-sm">{turma}</td>
                        <td className="p-3 text-sm">{32 - i * 2}</td>
                        <td className="p-3 text-sm">{(95 - i * 3).toFixed(1)}%</td>
                        <td className="p-3 text-sm">{(4.5 - i * 0.2).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
            ClassCheck - Sistema de Monitoramento Educacional
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gerador de Relatórios PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seleção de Template */}
          <div>
            <Label className="text-sm font-medium">Escolha um Template</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    configuracao.template === template.id && "ring-2 ring-primary"
                  )}
                  onClick={() => atualizarConfiguracao('template', template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {template.icone}
                      <Badge variant="secondary" className="text-xs">
                        {template.categoria}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{template.nome}</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      {template.descricao}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <strong>Inclui:</strong> {template.elementos.slice(0, 2).join(', ')}
                      {template.elementos.length > 2 && '...'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Configurações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título do Relatório</Label>
                <Input
                  id="titulo"
                  value={configuracao.titulo}
                  onChange={(e) => atualizarConfiguracao('titulo', e.target.value)}
                  placeholder="Digite o título do relatório"
                />
              </div>

              <div>
                <Label htmlFor="subtitulo">Subtítulo (opcional)</Label>
                <Input
                  id="subtitulo"
                  value={configuracao.subtitulo || ''}
                  onChange={(e) => atualizarConfiguracao('subtitulo', e.target.value)}
                  placeholder="Digite o subtítulo"
                />
              </div>

              <div>
                <Label>Formato da Página</Label>
                <Select
                  value={configuracao.formato}
                  onValueChange={(value) => atualizarConfiguracao('formato', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatosDisponiveis.map((formato) => (
                      <SelectItem key={formato.value} value={formato.value}>
                        {formato.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tema</Label>
                <Select
                  value={configuracao.tema}
                  onValueChange={(value) => atualizarConfiguracao('tema', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {temasDisponiveis.map((tema) => (
                      <SelectItem key={tema.value} value={tema.value}>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {tema.cores.map((cor, i) => (
                              <div
                                key={i}
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: cor }}
                              />
                            ))}
                          </div>
                          {tema.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {/* Elementos a incluir */}
              <div className="space-y-3">
                <Label>Elementos a Incluir</Label>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="incluir-logo"
                    checked={configuracao.incluirLogo}
                    onCheckedChange={(checked: boolean) => atualizarConfiguracao('incluirLogo', checked)}
                  />
                  <Label htmlFor="incluir-logo" className="text-sm">Logo da instituição</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="incluir-graficos"
                    checked={configuracao.incluirGraficos}
                    onCheckedChange={(checked: boolean) => atualizarConfiguracao('incluirGraficos', checked)}
                  />
                  <Label htmlFor="incluir-graficos" className="text-sm">Gráficos e charts</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="incluir-tabelas"
                    checked={configuracao.incluirTabelas}
                    onCheckedChange={(checked: boolean) => atualizarConfiguracao('incluirTabelas', checked)}
                  />
                  <Label htmlFor="incluir-tabelas" className="text-sm">Tabelas detalhadas</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="incluir-resumo"
                    checked={configuracao.incluirResumo}
                    onCheckedChange={(checked: boolean) => atualizarConfiguracao('incluirResumo', checked)}
                  />
                  <Label htmlFor="incluir-resumo" className="text-sm">Resumo executivo</Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ações */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dialog open={mostrarPreview} onOpenChange={setMostrarPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Preview do Relatório</DialogTitle>
                    <DialogDescription>
                      Visualização do relatório que será gerado
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh]">
                    {renderizarPreview()}
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configurações Avançadas
              </Button>
            </div>

            <Button 
              onClick={gerarPDF} 
              disabled={estaGerando}
              className="min-w-[140px]"
            >
              {estaGerando ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Gerar PDF
                </>
              )}
            </Button>
          </div>

          {/* Progress */}
          {estaGerando && (
            <div className="space-y-2">
              <Progress value={progresso} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                {progresso < 20 && 'Coletando dados...'}
                {progresso >= 20 && progresso < 40 && 'Processando gráficos...'}
                {progresso >= 40 && progresso < 60 && 'Gerando tabelas...'}
                {progresso >= 60 && progresso < 80 && 'Formatando documento...'}
                {progresso >= 80 && 'Finalizando...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico */}
      {historico.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Relatórios Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historico.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {item.status === 'sucesso' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {item.status === 'erro' && <AlertCircle className="h-4 w-4 text-red-500" />}
                    {item.status === 'processando' && <Clock className="h-4 w-4 text-yellow-500" />}
                    
                    <div>
                      <p className="font-medium text-sm">{item.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.template} • {item.tamanho} • {format(item.criadoEm, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
