'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '../ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Download,
  FileText,
  Image,
  Mail,
  Share2,
  Settings,
  Calendar,
  Users,
  BarChart3,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Lock,
  Globe
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExportadorRelatoriosProps {
  turmaId?: string;
  dadosDisponives: {
    dashboard: boolean;
    relatorioLongitudinal: boolean;
    tendencias: boolean;
    comparativo: boolean;
    mapaCalor: boolean;
    insights: boolean;
  };
}

interface ConfiguracaoExportacao {
  formato: 'pdf' | 'excel' | 'powerpoint' | 'csv' | 'json';
  secoes: {
    resumoExecutivo: boolean;
    graficos: boolean;
    tabelasDados: boolean;
    insights: boolean;
    recomendacoes: boolean;
    metodologia: boolean;
  };
  periodo: {
    inicio: Date;
    fim: Date;
  };
  filtros: {
    alunosEspecificos: string[];
    metricasEspecificas: string[];
    tipoVisualizacao: 'completo' | 'resumido' | 'executivo';
  };
  personalizacao: {
    incluirLogo: boolean;
    titulo: string;
    autor: string;
    observacoes: string;
    confidencialidade: 'publico' | 'interno' | 'confidencial';
  };
}

interface TemplateRelatorio {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'educacional' | 'executivo' | 'tecnico' | 'academico';
  secoes: string[];
  preview: string;
  popular: boolean;
}

interface StatusExportacao {
  id: string;
  status: 'pendente' | 'processando' | 'concluido' | 'erro';
  progresso: number;
  arquivo?: string;
  erro?: string;
  iniciadoEm: Date;
  tempoConclusao?: Date;
}

const ExportadorRelatorios: React.FC<ExportadorRelatoriosProps> = ({
  turmaId = 'turma-001',
  dadosDisponives
}) => {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoExportacao>({
    formato: 'pdf',
    secoes: {
      resumoExecutivo: true,
      graficos: true,
      tabelasDados: false,
      insights: true,
      recomendacoes: true,
      metodologia: false
    },
    periodo: {
      inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      fim: new Date()
    },
    filtros: {
      alunosEspecificos: [],
      metricasEspecificas: ['valencia', 'arousal', 'participacao'],
      tipoVisualizacao: 'completo'
    },
    personalizacao: {
      incluirLogo: true,
      titulo: 'Relatório de Bem-estar Emocional - Turma 8A',
      autor: 'Prof. Maria Silva',
      observacoes: '',
      confidencialidade: 'interno'
    }
  });

  const [templateSelecionado, setTemplateSelecionado] = useState<string>('completo');
  const [exportacoes, setExportacoes] = useState<StatusExportacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Templates disponíveis
  const templates: TemplateRelatorio[] = [
    {
      id: 'completo',
      nome: 'Relatório Completo',
      descricao: 'Análise detalhada com todas as seções e visualizações',
      categoria: 'educacional',
      secoes: ['Resumo Executivo', 'Análises Temporais', 'Insights', 'Recomendações', 'Metodologia'],
      preview: '/templates/completo-preview.png',
      popular: true
    },
    {
      id: 'executivo',
      nome: 'Resumo Executivo',
      descricao: 'Versão condensada focada em insights e ações',
      categoria: 'executivo',
      secoes: ['Resumo', 'Principais Insights', 'Ações Prioritárias'],
      preview: '/templates/executivo-preview.png',
      popular: true
    },
    {
      id: 'academico',
      nome: 'Análise Acadêmica',
      descricao: 'Relatório científico com metodologia e dados detalhados',
      categoria: 'academico',
      secoes: ['Metodologia', 'Análise Estatística', 'Resultados', 'Discussão', 'Conclusões'],
      preview: '/templates/academico-preview.png',
      popular: false
    },
    {
      id: 'pais',
      nome: 'Comunicação para Pais',
      descricao: 'Relatório simplificado para famílias',
      categoria: 'educacional',
      secoes: ['Progresso do Aluno', 'Pontos Positivos', 'Áreas de Atenção', 'Sugestões'],
      preview: '/templates/pais-preview.png',
      popular: true
    }
  ];

  // Iniciar exportação
  const iniciarExportacao = async () => {
    const novaExportacao: StatusExportacao = {
      id: `export_${Date.now()}`,
      status: 'pendente',
      progresso: 0,
      iniciadoEm: new Date()
    };

    setExportacoes(prev => [novaExportacao, ...prev]);
    setLoading(true);

    // Simular processo de exportação
    const intervalos = [
      { tempo: 500, progresso: 15, status: 'processando' as const, mensagem: 'Coletando dados...' },
      { tempo: 1000, progresso: 35, status: 'processando' as const, mensagem: 'Gerando gráficos...' },
      { tempo: 1500, progresso: 55, status: 'processando' as const, mensagem: 'Processando insights...' },
      { tempo: 2000, progresso: 75, status: 'processando' as const, mensagem: 'Formatando documento...' },
      { tempo: 2500, progresso: 90, status: 'processando' as const, mensagem: 'Finalizando...' },
      { tempo: 3000, progresso: 100, status: 'concluido' as const, mensagem: 'Exportação concluída!' }
    ];

    for (const { tempo, progresso, status, mensagem } of intervalos) {
      await new Promise(resolve => setTimeout(resolve, tempo));
      
      setExportacoes(prev => prev.map(exp => 
        exp.id === novaExportacao.id 
          ? { 
              ...exp, 
              progresso, 
              status,
              arquivo: status === 'concluido' ? 
                `relatorio_turma_8a_${format(new Date(), 'ddMMyyyy')}.${configuracao.formato}` : 
                undefined,
              tempoConclusao: status === 'concluido' ? new Date() : undefined
            }
          : exp
      ));
    }

    setLoading(false);
  };

  // Atualizar configuração de seções baseada no template
  useEffect(() => {
    const template = templates.find(t => t.id === templateSelecionado);
    if (template) {
      setConfiguracao(prev => ({
        ...prev,
        secoes: {
          resumoExecutivo: template.secoes.includes('Resumo Executivo') || template.secoes.includes('Resumo'),
          graficos: template.categoria !== 'executivo',
          tabelasDados: template.categoria === 'academico' || template.categoria === 'tecnico',
          insights: template.secoes.includes('Insights') || template.secoes.includes('Principais Insights'),
          recomendacoes: template.secoes.includes('Recomendações') || template.secoes.includes('Ações Prioritárias'),
          metodologia: template.categoria === 'academico'
        }
      }));
    }
  }, [templateSelecionado]);

  const calcularTamanhoEstimado = () => {
    let tamanho = 2; // Base em MB
    
    if (configuracao.secoes.graficos) tamanho += 5;
    if (configuracao.secoes.tabelasDados) tamanho += 3;
    if (configuracao.formato === 'powerpoint') tamanho *= 1.5;
    if (configuracao.formato === 'excel') tamanho *= 0.7;
    
    return tamanho.toFixed(1);
  };

  const getIconeFormato = (formato: string) => {
    switch (formato) {
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'excel': return <BarChart3 className="h-4 w-4" />;
      case 'powerpoint': return <Image className="h-4 w-4" />;
      default: return <Download className="h-4 w-4" />;
    }
  };

  const getCorConfidencialidade = (nivel: string) => {
    switch (nivel) {
      case 'publico': return 'text-green-600';
      case 'interno': return 'text-yellow-600';
      case 'confidencial': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getIconeConfidencialidade = (nivel: string) => {
    switch (nivel) {
      case 'publico': return <Globe className="h-4 w-4" />;
      case 'interno': return <Users className="h-4 w-4" />;
      case 'confidencial': return <Lock className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Exportador de Relatórios
          </h2>
          <p className="text-gray-600">
            Configure e gere relatórios personalizados - Turma 8A
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Editar' : 'Preview'}
          </Button>
          
          <Button 
            size="sm" 
            onClick={iniciarExportacao}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Status de Exportações Recentes */}
      {exportacoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Exportações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportacoes.slice(0, 3).map((exportacao) => (
                <div key={exportacao.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      exportacao.status === 'concluido' ? 'bg-green-100' :
                      exportacao.status === 'erro' ? 'bg-red-100' :
                      exportacao.status === 'processando' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {exportacao.status === 'concluido' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : exportacao.status === 'erro' ? (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : exportacao.status === 'processando' ? (
                        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium">
                        {exportacao.arquivo || `Exportação ${exportacao.id.slice(-4)}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(exportacao.iniciadoEm, 'dd/MM/yy HH:mm', { locale: ptBR })}
                        {exportacao.tempoConclusao && (
                          <span className="ml-2">
                            • {Math.round((exportacao.tempoConclusao.getTime() - exportacao.iniciadoEm.getTime()) / 1000)}s
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {exportacao.status === 'processando' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${exportacao.progresso}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{exportacao.progresso}%</span>
                      </div>
                    )}
                    
                    {exportacao.status === 'concluido' && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuração de Exportação */}
      <Tabs defaultValue="template" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="formato">Formato</TabsTrigger>
          <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
          <TabsTrigger value="filtros">Filtros</TabsTrigger>
          <TabsTrigger value="personalizar">Personalizar</TabsTrigger>
        </TabsList>

        <TabsContent value="template" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Selecionar Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all ${
                      templateSelecionado === template.id 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setTemplateSelecionado(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold flex items-center">
                            {template.nome}
                            {template.popular && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Popular
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">{template.descricao}</p>
                        </div>
                        <Badge variant="outline">{template.categoria}</Badge>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Seções incluídas:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.secoes.map((secao, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {secao}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Preview mockado */}
                      <div className="bg-gray-100 rounded p-2 text-center">
                        <Image className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="text-xs text-gray-500 mt-1">Preview disponível</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formato" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Formato de Exportação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { id: 'pdf', nome: 'PDF', descricao: 'Documento portátil', icon: <FileText className="h-6 w-6" /> },
                  { id: 'excel', nome: 'Excel', descricao: 'Planilha com dados', icon: <BarChart3 className="h-6 w-6" /> },
                  { id: 'powerpoint', nome: 'PowerPoint', descricao: 'Apresentação', icon: <Image className="h-6 w-6" /> },
                  { id: 'csv', nome: 'CSV', descricao: 'Dados tabulares', icon: <FileText className="h-6 w-6" /> },
                  { id: 'json', nome: 'JSON', descricao: 'Dados estruturados', icon: <FileText className="h-6 w-6" /> }
                ].map((formato) => (
                  <Card 
                    key={formato.id}
                    className={`cursor-pointer transition-all ${
                      configuracao.formato === formato.id 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setConfiguracao(prev => ({ ...prev, formato: formato.id as any }))}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-blue-600 mb-2">{formato.icon}</div>
                      <h3 className="font-semibold">{formato.nome}</h3>
                      <p className="text-xs text-gray-600">{formato.descricao}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span>Tamanho estimado:</span>
                  <span className="font-medium">{calcularTamanhoEstimado()} MB</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span>Tempo estimado:</span>
                  <span className="font-medium">2-5 segundos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conteudo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seções do Relatório</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'resumoExecutivo', label: 'Resumo Executivo', desc: 'Visão geral e principais métricas' },
                  { key: 'graficos', label: 'Gráficos e Visualizações', desc: 'Charts interativos e análises visuais' },
                  { key: 'tabelasDados', label: 'Tabelas de Dados', desc: 'Dados brutos e estatísticas detalhadas' },
                  { key: 'insights', label: 'Insights e Padrões', desc: 'Descobertas automáticas e análises preditivas' },
                  { key: 'recomendacoes', label: 'Recomendações', desc: 'Sugestões de ações e intervenções' },
                  { key: 'metodologia', label: 'Metodologia', desc: 'Explicação técnica e fontes de dados' }
                ].map((secao) => (
                  <div key={secao.key} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox 
                      checked={configuracao.secoes[secao.key as keyof typeof configuracao.secoes]}
                      onCheckedChange={(checked: boolean) => 
                        setConfiguracao(prev => ({
                          ...prev,
                          secoes: {
                            ...prev.secoes,
                            [secao.key]: checked
                          }
                        }))
                      }
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{secao.label}</h4>
                      <p className="text-sm text-gray-600">{secao.desc}</p>
                    </div>
                    <Badge variant={
                      dadosDisponives[secao.key as keyof typeof dadosDisponives] 
                        ? 'default' 
                        : 'secondary'
                    }>
                      {dadosDisponives[secao.key as keyof typeof dadosDisponives] 
                        ? 'Disponível' 
                        : 'Indisponível'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filtros" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Período de Análise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Data Início</label>
                  <Input 
                    type="date"
                    value={format(configuracao.periodo.inicio, 'yyyy-MM-dd')}
                    onChange={(e) => setConfiguracao(prev => ({
                      ...prev,
                      periodo: { ...prev.periodo, inicio: new Date(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Data Fim</label>
                  <Input 
                    type="date"
                    value={format(configuracao.periodo.fim, 'yyyy-MM-dd')}
                    onChange={(e) => setConfiguracao(prev => ({
                      ...prev,
                      periodo: { ...prev.periodo, fim: new Date(e.target.value) }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas e Visualização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Visualização</label>
                  <Select 
                    value={configuracao.filtros.tipoVisualizacao}
                    onValueChange={(value) => setConfiguracao(prev => ({
                      ...prev,
                      filtros: { ...prev.filtros, tipoVisualizacao: value as 'completo' | 'resumido' | 'executivo' }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completo">Completo</SelectItem>
                      <SelectItem value="resumido">Resumido</SelectItem>
                      <SelectItem value="executivo">Executivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Métricas Incluídas</label>
                  <div className="space-y-2">
                    {[
                      { id: 'valencia', label: 'Bem-estar (Valência)' },
                      { id: 'arousal', label: 'Energia (Ativação)' },
                      { id: 'participacao', label: 'Participação' },
                      { id: 'engajamento', label: 'Engajamento' }
                    ].map((metrica) => (
                      <div key={metrica.id} className="flex items-center space-x-2">
                        <Checkbox 
                          checked={configuracao.filtros.metricasEspecificas.includes(metrica.id)}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              setConfiguracao(prev => ({
                                ...prev,
                                filtros: {
                                  ...prev.filtros,
                                  metricasEspecificas: [...prev.filtros.metricasEspecificas, metrica.id]
                                }
                              }));
                            } else {
                              setConfiguracao(prev => ({
                                ...prev,
                                filtros: {
                                  ...prev.filtros,
                                  metricasEspecificas: prev.filtros.metricasEspecificas.filter(m => m !== metrica.id)
                                }
                              }));
                            }
                          }}
                        />
                        <label className="text-sm">{metrica.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personalizar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Relatório</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título do Relatório</label>
                  <Input 
                    value={configuracao.personalizacao.titulo}
                    onChange={(e) => setConfiguracao(prev => ({
                      ...prev,
                      personalizacao: { ...prev.personalizacao, titulo: e.target.value }
                    }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Autor</label>
                  <Input 
                    value={configuracao.personalizacao.autor}
                    onChange={(e) => setConfiguracao(prev => ({
                      ...prev,
                      personalizacao: { ...prev.personalizacao, autor: e.target.value }
                    }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Observações</label>
                  <Textarea 
                    value={configuracao.personalizacao.observacoes}
                    onChange={(e) => setConfiguracao(prev => ({
                      ...prev,
                      personalizacao: { ...prev.personalizacao, observacoes: e.target.value }
                    }))}
                    placeholder="Comentários adicionais, contexto, etc..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={configuracao.personalizacao.incluirLogo}
                    onCheckedChange={(checked: boolean) => setConfiguracao(prev => ({
                      ...prev,
                      personalizacao: { ...prev.personalizacao, incluirLogo: !!checked }
                    }))}
                  />
                  <label className="text-sm">Incluir logo da instituição</label>
                </div>

                <div>
                  <label className="text-sm font-medium">Nível de Confidencialidade</label>
                  <Select 
                    value={configuracao.personalizacao.confidencialidade}
                    onValueChange={(value) => setConfiguracao(prev => ({
                      ...prev,
                      personalizacao: { ...prev.personalizacao, confidencialidade: value as 'publico' | 'interno' | 'confidencial' }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="publico">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>Público</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="interno">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>Uso Interno</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="confidencial">
                        <div className="flex items-center space-x-2">
                          <Lock className="h-4 w-4" />
                          <span>Confidencial</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Resumo da Configuração</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>• Formato: {configuracao.formato.toUpperCase()}</p>
                    <p>• Seções: {Object.values(configuracao.secoes).filter(Boolean).length} de 6</p>
                    <p>• Período: {Math.ceil((configuracao.periodo.fim.getTime() - configuracao.periodo.inicio.getTime()) / (1000 * 60 * 60 * 24))} dias</p>
                    <p className={`flex items-center ${getCorConfidencialidade(configuracao.personalizacao.confidencialidade)}`}>
                      {getIconeConfidencialidade(configuracao.personalizacao.confidencialidade)}
                      <span className="ml-1 capitalize">{configuracao.personalizacao.confidencialidade}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Mail className="h-6 w-6 mx-auto mb-2" />
                <div>
                  <p className="font-medium">Enviar por Email</p>
                  <p className="text-xs text-gray-600">Compartilhar diretamente</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Share2 className="h-6 w-6 mx-auto mb-2" />
                <div>
                  <p className="font-medium">Gerar Link</p>
                  <p className="text-xs text-gray-600">Acesso temporário</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2" />
                <div>
                  <p className="font-medium">Agendar Envio</p>
                  <p className="text-xs text-gray-600">Relatório automático</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Settings className="h-6 w-6 mx-auto mb-2" />
                <div>
                  <p className="font-medium">Salvar Template</p>
                  <p className="text-xs text-gray-600">Reutilizar configuração</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportadorRelatorios;
