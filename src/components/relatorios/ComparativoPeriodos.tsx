'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  Calendar,
  TrendingUp, 
  TrendingDown,
  Users,
  BarChart3,
  Activity,
  ArrowUpDown,
  Target,
  Award,
  AlertTriangle
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ComparativoPeriodosProps {
  turmaId?: string;
  tipoComparacao: 'mensal' | 'trimestral' | 'semestral' | 'anual';
}

interface DadoPeriodo {
  periodo: string;
  periodoCompleto: string;
  valenciaMedia: number;
  arousalMedio: number;
  participacaoMedia: number;
  numeroAlunos: number;
  aulasRealizadas: number;
  eventosPositivos: number;
  eventosNegativos: number;
  melhorDia: {
    data: string;
    valencia: number;
  };
  piorDia: {
    data: string;
    valencia: number;
  };
  distribuicaoQuadrantes: {
    q1: number; // Energizado Positivo
    q2: number; // Calmo Positivo  
    q3: number; // Calmo Negativo
    q4: number; // Energizado Negativo
  };
  metricas: {
    consistencia: number;
    volatilidade: number;
    crescimento: number;
    engajamento: number;
  };
}

interface AnaliseComparativa {
  melhorPeriodo: DadoPeriodo;
  piorPeriodo: DadoPeriodo;
  tendenciaGeral: 'crescente' | 'decrescente' | 'estavel';
  variabilidade: 'alta' | 'media' | 'baixa';
  insights: string[];
  recomendacoes: string[];
}

const ComparativoPeriodos: React.FC<ComparativoPeriodosProps> = ({
  turmaId = 'turma-001',
  tipoComparacao = 'mensal'
}) => {
  const [dadosPeriodos, setDadosPeriodos] = useState<DadoPeriodo[]>([]);
  const [analiseComparativa, setAnaliseComparativa] = useState<AnaliseComparativa | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodoSelecionado, setPeriodoSelecionado] = useState<string>('todos');
  const [metricaFoco, setMetricaFoco] = useState<'valencia' | 'arousal' | 'participacao'>('valencia');

  // Gerar dados realistas para comparação
  useEffect(() => {
    const gerarDadosPeriodos = () => {
      const dados: DadoPeriodo[] = [];
      const hoje = new Date();
      const numeroPeriodos = tipoComparacao === 'mensal' ? 6 : 
                           tipoComparacao === 'trimestral' ? 4 : 
                           tipoComparacao === 'semestral' ? 2 : 1;

      for (let i = numeroPeriodos - 1; i >= 0; i--) {
        let inicioData: Date, fimData: Date, nomePeriodo: string;
        
        if (tipoComparacao === 'mensal') {
          inicioData = startOfMonth(subDays(hoje, i * 30));
          fimData = endOfMonth(inicioData);
          nomePeriodo = format(inicioData, 'MMM/yy', { locale: ptBR });
        } else if (tipoComparacao === 'trimestral') {
          inicioData = new Date(hoje.getFullYear(), hoje.getMonth() - (i * 3), 1);
          fimData = new Date(inicioData.getFullYear(), inicioData.getMonth() + 3, 0);
          nomePeriodo = `Q${Math.floor(inicioData.getMonth() / 3) + 1}/${inicioData.getFullYear()}`;
        } else {
          inicioData = new Date(hoje.getFullYear() - i, 0, 1);
          fimData = new Date(inicioData.getFullYear(), 11, 31);
          nomePeriodo = inicioData.getFullYear().toString();
        }

        // Simular tendência de melhoria geral com variações
        const tendenciaBase = i * 0.05; // Melhoria ao longo do tempo
        const variacao = (Math.random() - 0.5) * 0.4;
        
        const valenciaMedia = Math.max(-0.8, Math.min(0.8, tendenciaBase + variacao));
        const arousalMedio = Math.max(-0.6, Math.min(0.6, (Math.random() - 0.5) * 0.8));
        
        // Distribuição dos quadrantes baseada na valência e arousal
        const totalRegistros = 100;
        const q1 = Math.max(0, Math.min(40, 25 + valenciaMedia * 15 + arousalMedio * 10 + Math.random() * 10));
        const q2 = Math.max(0, Math.min(40, 25 + valenciaMedia * 15 - arousalMedio * 5 + Math.random() * 10));
        const q3 = Math.max(0, Math.min(40, 25 - valenciaMedia * 15 - arousalMedio * 5 + Math.random() * 10));
        const q4 = Math.max(0, totalRegistros - q1 - q2 - q3);

        dados.push({
          periodo: nomePeriodo,
          periodoCompleto: `${format(inicioData, 'dd/MM/yy')} - ${format(fimData, 'dd/MM/yy')}`,
          valenciaMedia,
          arousalMedio,
          participacaoMedia: 75 + Math.random() * 20 + tendenciaBase * 10,
          numeroAlunos: 25 + Math.floor(Math.random() * 5),
          aulasRealizadas: 20 + Math.floor(Math.random() * 10),
          eventosPositivos: Math.floor(Math.random() * 5) + 2,
          eventosNegativos: Math.floor(Math.random() * 3) + 1,
          melhorDia: {
            data: format(new Date(inicioData.getTime() + Math.random() * (fimData.getTime() - inicioData.getTime())), 'dd/MM'),
            valencia: valenciaMedia + 0.3 + Math.random() * 0.2
          },
          piorDia: {
            data: format(new Date(inicioData.getTime() + Math.random() * (fimData.getTime() - inicioData.getTime())), 'dd/MM'),
            valencia: valenciaMedia - 0.3 - Math.random() * 0.2
          },
          distribuicaoQuadrantes: { q1, q2, q3, q4 },
          metricas: {
            consistencia: Math.max(0.3, 0.8 - Math.abs(variacao)),
            volatilidade: Math.abs(variacao) + Math.random() * 0.2,
            crescimento: tendenciaBase + (Math.random() - 0.5) * 0.1,
            engajamento: (75 + tendenciaBase * 10 + Math.random() * 15) / 100
          }
        });
      }
      
      return dados.reverse(); // Mais recente primeiro
    };

    const gerarAnaliseComparativa = (dados: DadoPeriodo[]): AnaliseComparativa => {
      if (dados.length < 2) {
        return {
          melhorPeriodo: dados[0],
          piorPeriodo: dados[0],
          tendenciaGeral: 'estavel',
          variabilidade: 'baixa',
          insights: [],
          recomendacoes: []
        };
      }

      const melhorPeriodo = dados.reduce((prev, current) => 
        current.valenciaMedia > prev.valenciaMedia ? current : prev
      );
      
      const piorPeriodo = dados.reduce((prev, current) => 
        current.valenciaMedia < prev.valenciaMedia ? current : prev
      );

      // Calcular tendência
      const primeiroTerco = dados.slice(0, Math.floor(dados.length / 3));
      const ultimoTerco = dados.slice(-Math.floor(dados.length / 3));
      
      const mediaPrimeiro = primeiroTerco.reduce((acc, d) => acc + d.valenciaMedia, 0) / primeiroTerco.length;
      const mediaUltimo = ultimoTerco.reduce((acc, d) => acc + d.valenciaMedia, 0) / ultimoTerco.length;
      
      const tendenciaGeral = mediaUltimo > mediaPrimeiro + 0.1 ? 'crescente' :
                           mediaUltimo < mediaPrimeiro - 0.1 ? 'decrescente' : 'estavel';

      // Calcular variabilidade
      const mediaGeral = dados.reduce((acc, d) => acc + d.valenciaMedia, 0) / dados.length;
      const variancia = dados.reduce((acc, d) => acc + Math.pow(d.valenciaMedia - mediaGeral, 2), 0) / dados.length;
      const variabilidade = variancia > 0.15 ? 'alta' : variancia > 0.05 ? 'media' : 'baixa';

      // Gerar insights
      const insights = [];
      if (tendenciaGeral === 'crescente') {
        insights.push('Tendência positiva consistente ao longo dos períodos analisados');
      } else if (tendenciaGeral === 'decrescente') {
        insights.push('Declínio no bem-estar detectado - requer atenção imediata');
      }

      if (variabilidade === 'alta') {
        insights.push('Alta variabilidade entre períodos sugere instabilidade emocional');
      }

      const melhoriaParticipacao = dados[dados.length - 1].participacaoMedia > dados[0].participacaoMedia;
      if (melhoriaParticipacao) {
        insights.push('Aumento na participação dos alunos observado');
      }

      // Gerar recomendações
      const recomendacoes = [];
      if (tendenciaGeral === 'decrescente') {
        recomendacoes.push('Implementar estratégias de engajamento mais efetivas');
        recomendacoes.push('Revisar metodologia de ensino aplicada');
      }

      if (variabilidade === 'alta') {
        recomendacoes.push('Criar protocolos de estabilização emocional');
        recomendacoes.push('Monitorar eventos externos que impactam a turma');
      }

      if (piorPeriodo.eventosNegativos > melhorPeriodo.eventosNegativos * 2) {
        recomendacoes.push('Desenvolver estratégias preventivas para eventos estressantes');
      }

      return {
        melhorPeriodo,
        piorPeriodo,
        tendenciaGeral,
        variabilidade,
        insights,
        recomendacoes
      };
    };

    setLoading(true);
    setTimeout(() => {
      const dados = gerarDadosPeriodos();
      setDadosPeriodos(dados);
      setAnaliseComparativa(gerarAnaliseComparativa(dados));
      setLoading(false);
    }, 1000);
  }, [tipoComparacao]);

  const formatarPorcentagem = (valor: number) => {
    return `${((valor + 1) * 50).toFixed(0)}%`;
  };

  const getCorTendencia = (tendencia: string) => {
    switch (tendencia) {
      case 'crescente': return 'text-green-600';
      case 'decrescente': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCorVariabilidade = (variabilidade: string) => {
    switch (variabilidade) {
      case 'baixa': return 'text-green-600';
      case 'media': return 'text-yellow-600';
      case 'alta': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Dados para gráfico de radar comparativo
  const dadosRadar = analiseComparativa ? [
    {
      metrica: 'Bem-estar',
      melhor: ((analiseComparativa.melhorPeriodo.valenciaMedia + 1) * 50),
      pior: ((analiseComparativa.piorPeriodo.valenciaMedia + 1) * 50)
    },
    {
      metrica: 'Energia',
      melhor: ((analiseComparativa.melhorPeriodo.arousalMedio + 1) * 50),
      pior: ((analiseComparativa.piorPeriodo.arousalMedio + 1) * 50)
    },
    {
      metrica: 'Participação',
      melhor: analiseComparativa.melhorPeriodo.participacaoMedia,
      pior: analiseComparativa.piorPeriodo.participacaoMedia
    },
    {
      metrica: 'Consistência',
      melhor: analiseComparativa.melhorPeriodo.metricas.consistencia * 100,
      pior: analiseComparativa.piorPeriodo.metricas.consistencia * 100
    },
    {
      metrica: 'Engajamento',
      melhor: analiseComparativa.melhorPeriodo.metricas.engajamento * 100,
      pior: analiseComparativa.piorPeriodo.metricas.engajamento * 100
    }
  ] : [];

  // Cores para os quadrantes
  const coresQuadrantes = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Comparativo entre Períodos
          </h2>
          <p className="text-gray-600">
            Análise {tipoComparacao} - Turma 8A ({dadosPeriodos.length} períodos comparados)
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={metricaFoco} onValueChange={(value: any) => setMetricaFoco(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Métrica Principal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="valencia">Bem-estar</SelectItem>
              <SelectItem value="arousal">Energia</SelectItem>
              <SelectItem value="participacao">Participação</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            {tipoComparacao}
          </Button>
        </div>
      </div>

      {/* Resumo Executivo */}
      {analiseComparativa && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tendência Geral</p>
                  <div className={`flex items-center ${getCorTendencia(analiseComparativa.tendenciaGeral)}`}>
                    {analiseComparativa.tendenciaGeral === 'crescente' ? <TrendingUp className="h-4 w-4 mr-1" /> :
                     analiseComparativa.tendenciaGeral === 'decrescente' ? <TrendingDown className="h-4 w-4 mr-1" /> :
                     <ArrowUpDown className="h-4 w-4 mr-1" />}
                    <span className="font-bold capitalize">
                      {analiseComparativa.tendenciaGeral}
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Melhor Período</p>
                  <p className="text-lg font-bold">{analiseComparativa.melhorPeriodo.periodo}</p>
                  <p className="text-xs text-gray-500">
                    {formatarPorcentagem(analiseComparativa.melhorPeriodo.valenciaMedia)} bem-estar
                  </p>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Variabilidade</p>
                  <div className={`flex items-center ${getCorVariabilidade(analiseComparativa.variabilidade)}`}>
                    <Badge variant={
                      analiseComparativa.variabilidade === 'baixa' ? 'default' :
                      analiseComparativa.variabilidade === 'media' ? 'secondary' : 'destructive'
                    }>
                      {analiseComparativa.variabilidade}
                    </Badge>
                  </div>
                </div>
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Análises Comparativas */}
      <Tabs defaultValue="evolucao" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
          <TabsTrigger value="distribuicao">Distribuição</TabsTrigger>
          <TabsTrigger value="radar">Comparativo</TabsTrigger>
          <TabsTrigger value="metricas">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="evolucao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Evolução da {metricaFoco === 'valencia' ? 'Bem-estar' : 
                            metricaFoco === 'arousal' ? 'Energia' : 'Participação'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dadosPeriodos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        metricaFoco === 'participacao' ? `${value}%` : formatarPorcentagem(value as number),
                        metricaFoco === 'valencia' ? 'Bem-estar' :
                        metricaFoco === 'arousal' ? 'Energia' : 'Participação'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={metricaFoco === 'valencia' ? 'valenciaMedia' : 
                               metricaFoco === 'arousal' ? 'arousalMedio' : 'participacaoMedia'} 
                      fill="#3B82F6" 
                      fillOpacity={0.3}
                      stroke="#3B82F6"
                      strokeWidth={3}
                    />
                    <Bar 
                      dataKey="aulasRealizadas" 
                      fill="#10B981" 
                      fillOpacity={0.6}
                      yAxisId="right"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribuicao" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dadosPeriodos.map((periodo, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{periodo.periodo}</CardTitle>
                  <p className="text-sm text-gray-600">{periodo.periodoCompleto}</p>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Energizado+', value: periodo.distribuicaoQuadrantes.q1 },
                            { name: 'Calmo+', value: periodo.distribuicaoQuadrantes.q2 },
                            { name: 'Calmo-', value: periodo.distribuicaoQuadrantes.q3 },
                            { name: 'Energizado-', value: periodo.distribuicaoQuadrantes.q4 }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {coresQuadrantes.map((cor, i) => (
                            <Cell key={i} fill={cor} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="radar" className="space-y-4">
          {analiseComparativa && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Comparativo: {analiseComparativa.melhorPeriodo.periodo} vs {analiseComparativa.piorPeriodo.periodo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={dadosRadar}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metrica" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar 
                        name="Melhor Período" 
                        dataKey="melhor" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar 
                        name="Pior Período" 
                        dataKey="pior" 
                        stroke="#EF4444" 
                        fill="#EF4444" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metricas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Consistência por Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosPeriodos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="periodo" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip formatter={(value) => [`${(value as number * 100).toFixed(1)}%`, 'Consistência']} />
                      <Bar dataKey="metricas.consistencia" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volatilidade por Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dadosPeriodos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="periodo" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${(value as number * 100).toFixed(1)}%`, 'Volatilidade']} />
                      <Line 
                        type="monotone" 
                        dataKey="metricas.volatilidade" 
                        stroke="#EF4444" 
                        strokeWidth={3}
                        dot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Insights e Recomendações */}
      {analiseComparativa && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Insights Identificados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analiseComparativa.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analiseComparativa.recomendacoes.map((recomendacao, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-orange-800">{recomendacao}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Período</th>
                  <th className="text-center p-2">Bem-estar</th>
                  <th className="text-center p-2">Energia</th>
                  <th className="text-center p-2">Participação</th>
                  <th className="text-center p-2">Aulas</th>
                  <th className="text-center p-2">Eventos +/-</th>
                  <th className="text-center p-2">Consistência</th>
                </tr>
              </thead>
              <tbody>
                {dadosPeriodos.map((periodo, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{periodo.periodo}</p>
                        <p className="text-xs text-gray-500">{periodo.numeroAlunos} alunos</p>
                      </div>
                    </td>
                    <td className="text-center p-2">
                      <span className={`font-medium ${
                        periodo.valenciaMedia > 0.2 ? 'text-green-600' :
                        periodo.valenciaMedia < -0.2 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {formatarPorcentagem(periodo.valenciaMedia)}
                      </span>
                    </td>
                    <td className="text-center p-2">
                      {formatarPorcentagem(periodo.arousalMedio)}
                    </td>
                    <td className="text-center p-2">
                      {periodo.participacaoMedia.toFixed(0)}%
                    </td>
                    <td className="text-center p-2">
                      {periodo.aulasRealizadas}
                    </td>
                    <td className="text-center p-2">
                      <span className="text-green-600">{periodo.eventosPositivos}</span> / 
                      <span className="text-red-600 ml-1">{periodo.eventosNegativos}</span>
                    </td>
                    <td className="text-center p-2">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${periodo.metricas.consistencia * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs">
                          {(periodo.metricas.consistencia * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparativoPeriodos;
