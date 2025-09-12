'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts';
import { 
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Lightbulb,
  Activity,
  Users,
  Calendar,
  Zap,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { format, addDays, addWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InsightsPreditivosProps {
  turmaId?: string;
  tipoAnalise: 'individual' | 'turma' | 'comparativo';
  horizonteTemporal: '1_semana' | '2_semanas' | '1_mes' | '3_meses';
}

interface PrevisaoEmocional {
  data: string;
  dataCompleta: Date;
  valenciaPrevisao: number;
  arousalPrevisao: number;
  confianca: number;
  cenarioOtimista: number;
  cenarioPessimista: number;
  fatoresInfluencia: string[];
  probabilidadeRisco: number;
}

interface InsightPreditivo {
  id: string;
  tipo: 'tendencia' | 'alerta' | 'oportunidade' | 'recomendacao';
  prioridade: 'alta' | 'media' | 'baixa';
  confianca: number;
  titulo: string;
  descricao: string;
  impactoEstimado: number;
  dataRelevante?: Date;
  acaoSugerida: string;
  metricas: {
    precisao: number;
    recall: number;
    f1Score: number;
  };
}

interface ModeloPreditivo {
  nome: string;
  versao: string;
  ultimoTreinamento: Date;
  acuracia: number;
  parametros: {
    janelaTemporal: number;
    variaveisEntrada: string[];
    algoritmo: string;
  };
  metricas: {
    mae: number; // Mean Absolute Error
    rmse: number; // Root Mean Square Error
    mape: number; // Mean Absolute Percentage Error
  };
}

const InsightsPreditivos: React.FC<InsightsPreditivosProps> = ({
  turmaId = 'turma-001',
  tipoAnalise = 'turma',
  horizonteTemporal = '2_semanas'
}) => {
  const [previsoes, setPrevisoes] = useState<PrevisaoEmocional[]>([]);
  const [insights, setInsights] = useState<InsightPreditivo[]>([]);
  const [modelo, setModelo] = useState<ModeloPreditivo | null>(null);
  const [loading, setLoading] = useState(true);
  const [modoAvancado, setModoAvancado] = useState(false);

  // Gerar previsões e insights usando IA simulada
  useEffect(() => {
    const gerarPrevisoes = (): PrevisaoEmocional[] => {
      const previsoes: PrevisaoEmocional[] = [];
      const hoje = new Date();
      const diasPrevisao = horizonteTemporal === '1_semana' ? 7 : 
                          horizonteTemporal === '2_semanas' ? 14 :
                          horizonteTemporal === '1_mes' ? 30 : 90;

      // Simular tendência baseada em dados históricos
      let tendenciaBase = 0.1; // Ligeiramente otimista
      let sazonalidade = 0;
      let volatilidade = 0.15;

      for (let i = 1; i <= diasPrevisao; i++) {
        const data = addDays(hoje, i);
        
        // Simular padrões sazonais (final de semana, feriados, etc.)
        const diaSemana = data.getDay();
        sazonalidade = diaSemana === 0 || diaSemana === 6 ? -0.1 : 
                      diaSemana === 1 ? -0.05 : // Segunda-feira
                      diaSemana === 5 ? 0.05 : 0; // Sexta-feira

        // Degradação da confiança ao longo do tempo
        const confianca = Math.max(0.3, 0.95 - (i * 0.02));
        
        // Ruído aleatório crescente
        const ruido = (Math.random() - 0.5) * volatilidade * Math.sqrt(i / 7);
        
        // Previsão principal
        const valenciaPrevisao = Math.max(-1, Math.min(1, 
          tendenciaBase + sazonalidade + ruido
        ));
        
        const arousalPrevisao = Math.max(-1, Math.min(1,
          0.2 + sazonalidade * 0.5 + (Math.random() - 0.5) * 0.4
        ));

        // Cenários alternativos
        const incerteza = (1 - confianca) * 0.5;
        const cenarioOtimista = Math.min(1, valenciaPrevisao + incerteza);
        const cenarioPessimista = Math.max(-1, valenciaPrevisao - incerteza);

        // Fatores de influência
        const fatoresInfluencia = [];
        if (diaSemana === 1) fatoresInfluencia.push('Efeito segunda-feira');
        if (diaSemana === 5) fatoresInfluencia.push('Expectativa fim de semana');
        if (i <= 7) fatoresInfluencia.push('Dados históricos recentes');
        if (i > 14) fatoresInfluencia.push('Projeção de longo prazo');
        if (Math.abs(ruido) > 0.1) fatoresInfluencia.push('Volatilidade prevista');

        // Probabilidade de risco (bem-estar baixo)
        const probabilidadeRisco = valenciaPrevisao < -0.2 ? 
          Math.min(0.9, (Math.abs(valenciaPrevisao) + 0.2) * 0.8) : 
          Math.max(0.05, Math.abs(valenciaPrevisao - 0.3) * 0.3);

        previsoes.push({
          data: format(data, 'dd/MM'),
          dataCompleta: data,
          valenciaPrevisao,
          arousalPrevisao,
          confianca,
          cenarioOtimista,
          cenarioPessimista,
          fatoresInfluencia,
          probabilidadeRisco
        });

        // Atualizar tendência baseada em feedback simulado
        tendenciaBase += (Math.random() - 0.5) * 0.01;
        volatilidade = Math.max(0.05, volatilidade + (Math.random() - 0.5) * 0.02);
      }

      return previsoes;
    };

    const gerarInsights = (previsoes: PrevisaoEmocional[]): InsightPreditivo[] => {
      const insights: InsightPreditivo[] = [];

      // Análise de tendência
      const valenciaInicio = previsoes.slice(0, 3).reduce((acc, p) => acc + p.valenciaPrevisao, 0) / 3;
      const valenciaFim = previsoes.slice(-3).reduce((acc, p) => acc + p.valenciaPrevisao, 0) / 3;
      const mudancaTendencia = valenciaFim - valenciaInicio;

      if (Math.abs(mudancaTendencia) > 0.1) {
        insights.push({
          id: 'tendencia-geral',
          tipo: mudancaTendencia > 0 ? 'oportunidade' : 'alerta',
          prioridade: Math.abs(mudancaTendencia) > 0.3 ? 'alta' : 'media',
          confianca: 0.85,
          titulo: mudancaTendencia > 0 ? 'Tendência de Melhoria Detectada' : 'Declínio Emocional Previsto',
          descricao: `Análise preditiva indica ${mudancaTendencia > 0 ? 'melhoria' : 'declínio'} de ${(Math.abs(mudancaTendencia) * 100).toFixed(1)}% no bem-estar da turma`,
          impactoEstimado: Math.abs(mudancaTendencia) * 100,
          acaoSugerida: mudancaTendencia > 0 ? 
            'Manter estratégias atuais e considerar intensificação' : 
            'Implementar intervenções preventivas imediatas',
          metricas: { precisao: 0.82, recall: 0.78, f1Score: 0.80 }
        });
      }

      // Detecção de períodos de risco
      const periodosRisco = previsoes.filter(p => p.probabilidadeRisco > 0.6);
      if (periodosRisco.length > 0) {
        const proximoRisco = periodosRisco[0];
        insights.push({
          id: 'periodo-risco',
          tipo: 'alerta',
          prioridade: proximoRisco.probabilidadeRisco > 0.8 ? 'alta' : 'media',
          confianca: proximoRisco.confianca,
          titulo: 'Período de Risco Identificado',
          descricao: `Alto risco de bem-estar baixo previsto para ${proximoRisco.data} (${(proximoRisco.probabilidadeRisco * 100).toFixed(0)}% probabilidade)`,
          impactoEstimado: proximoRisco.probabilidadeRisco * 100,
          dataRelevante: proximoRisco.dataCompleta,
          acaoSugerida: 'Preparar estratégias de suporte emocional e atividades de engajamento',
          metricas: { precisao: 0.75, recall: 0.88, f1Score: 0.81 }
        });
      }

      // Oportunidades de otimização
      const momentosPositivos = previsoes.filter(p => p.valenciaPrevisao > 0.3 && p.confianca > 0.7);
      if (momentosPositivos.length > 0) {
        insights.push({
          id: 'oportunidade-otimizacao',
          tipo: 'oportunidade',
          prioridade: 'media',
          confianca: 0.78,
          titulo: 'Janela de Oportunidade Detectada',
          descricao: `${momentosPositivos.length} período(s) com condições favoráveis para atividades desafiadoras`,
          impactoEstimado: 75,
          acaoSugerida: 'Agendar atividades importantes e avaliações durante estes períodos',
          metricas: { precisao: 0.72, recall: 0.85, f1Score: 0.78 }
        });
      }

      // Padrões sazonais
      const diasSemana = previsoes.map(p => ({ 
        dia: p.dataCompleta.getDay(), 
        valencia: p.valenciaPrevisao 
      }));
      
      const mediaPorDia = Array.from({ length: 7 }, (_, i) => {
        const registros = diasSemana.filter(d => d.dia === i);
        return registros.length > 0 ? 
          registros.reduce((acc, r) => acc + r.valencia, 0) / registros.length : 0;
      });

      const melhorDia = mediaPorDia.indexOf(Math.max(...mediaPorDia));
      const piorDia = mediaPorDia.indexOf(Math.min(...mediaPorDia));

      if (Math.abs(mediaPorDia[melhorDia] - mediaPorDia[piorDia]) > 0.2) {
        const nomesDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        insights.push({
          id: 'padrao-semanal',
          tipo: 'recomendacao',
          prioridade: 'baixa',
          confianca: 0.70,
          titulo: 'Padrão Semanal Identificado',
          descricao: `${nomesDias[melhorDia]} mostra melhor bem-estar, ${nomesDias[piorDia]} o pior`,
          impactoEstimado: 45,
          acaoSugerida: `Concentrar atividades importantes em ${nomesDias[melhorDia]}, dar suporte extra em ${nomesDias[piorDia]}`,
          metricas: { precisao: 0.68, recall: 0.72, f1Score: 0.70 }
        });
      }

      // Volatilidade anômala
      const volatilidades = previsoes.map(p => 
        Math.abs(p.cenarioOtimista - p.cenarioPessimista)
      );
      const volatilidade = volatilidades.reduce((acc, v) => acc + v, 0) / volatilidades.length;

      if (volatilidade > 0.4) {
        insights.push({
          id: 'volatilidade-alta',
          tipo: 'alerta',
          prioridade: 'media',
          confianca: 0.73,
          titulo: 'Alta Variabilidade Emocional Prevista',
          descricao: `Modelo prevê instabilidade emocional significativa (${(volatilidade * 100).toFixed(0)}% variação)`,
          impactoEstimado: volatilidade * 100,
          acaoSugerida: 'Implementar rotinas estabilizadoras e monitoramento contínuo',
          metricas: { precisao: 0.71, recall: 0.69, f1Score: 0.70 }
        });
      }

      return insights.sort((a, b) => {
        const prioridadeOrdem = { 'alta': 3, 'media': 2, 'baixa': 1 };
        return prioridadeOrdem[b.prioridade] - prioridadeOrdem[a.prioridade];
      });
    };

    const gerarModelo = (): ModeloPreditivo => {
      return {
        nome: 'ClassCheck Emotional Predictor',
        versao: 'v2.1.0',
        ultimoTreinamento: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
        acuracia: 0.847,
        parametros: {
          janelaTemporal: 14, // dias
          variaveisEntrada: [
            'Valencia histórica',
            'Arousal histórico', 
            'Participação',
            'Eventos da turma',
            'Padrões sazonais',
            'Dados meteorológicos',
            'Calendário acadêmico'
          ],
          algoritmo: 'LSTM + Random Forest Ensemble'
        },
        metricas: {
          mae: 0.127, // Mean Absolute Error
          rmse: 0.189, // Root Mean Square Error  
          mape: 12.3   // Mean Absolute Percentage Error
        }
      };
    };

    setLoading(true);
    setTimeout(() => {
      const novasPrevisoes = gerarPrevisoes();
      setPrevisoes(novasPrevisoes);
      setInsights(gerarInsights(novasPrevisoes));
      setModelo(gerarModelo());
      setLoading(false);
    }, 1200);
  }, [horizonteTemporal, tipoAnalise]);

  const formatarPorcentagem = (valor: number) => {
    return `${((valor + 1) * 50).toFixed(0)}%`;
  };

  const getCorConfianca = (confianca: number) => {
    if (confianca >= 0.8) return 'text-green-600';
    if (confianca >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'tendencia': return <TrendingUp className="h-4 w-4" />;
      case 'alerta': return <AlertTriangle className="h-4 w-4" />;
      case 'oportunidade': return <Target className="h-4 w-4" />;
      case 'recomendacao': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getCorTipo = (tipo: string) => {
    switch (tipo) {
      case 'tendencia': return 'text-blue-600';
      case 'alerta': return 'text-red-600';
      case 'oportunidade': return 'text-green-600';
      case 'recomendacao': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  // Calcular métricas resumo
  const calcularResumo = () => {
    if (previsoes.length === 0) return null;

    const confiancaMedia = previsoes.reduce((acc, p) => acc + p.confianca, 0) / previsoes.length;
    const valenciaMedia = previsoes.reduce((acc, p) => acc + p.valenciaPrevisao, 0) / previsoes.length;
    const riscoAlto = previsoes.filter(p => p.probabilidadeRisco > 0.6).length;
    const insightsAlta = insights.filter(i => i.prioridade === 'alta').length;

    return {
      confiancaMedia,
      valenciaMedia,
      riscoAlto,
      insightsAlta,
      periodoAnalise: previsoes.length
    };
  };

  const resumo = calcularResumo();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
            Insights Preditivos
          </h2>
          <p className="text-gray-600">
            Análise {tipoAnalise} usando IA - Horizonte: {horizonteTemporal.replace('_', ' ')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={modoAvancado ? "default" : "outline"} 
            size="sm"
            onClick={() => setModoAvancado(!modoAvancado)}
          >
            <Brain className="h-4 w-4 mr-2" />
            Modo {modoAvancado ? 'Simples' : 'Avançado'}
          </Button>
          
          <Button variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Retreinar Modelo
          </Button>
        </div>
      </div>

      {/* Resumo Executivo */}
      {resumo && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confiança Média</p>
                  <p className={`text-xl font-bold ${getCorConfianca(resumo.confiancaMedia)}`}>
                    {(resumo.confiancaMedia * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bem-estar Previsto</p>
                  <p className="text-xl font-bold">
                    {formatarPorcentagem(resumo.valenciaMedia)}
                  </p>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Períodos de Risco</p>
                  <p className={`text-xl font-bold ${resumo.riscoAlto > 2 ? 'text-red-600' : 'text-green-600'}`}>
                    {resumo.riscoAlto}
                  </p>
                  <p className="text-xs text-gray-500">de {resumo.periodoAnalise} dias</p>
                </div>
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Insights Prioritários</p>
                  <p className="text-xl font-bold">{resumo.insightsAlta}</p>
                  <p className="text-xs text-gray-500">requerem ação</p>
                </div>
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Informações do Modelo (Modo Avançado) */}
      {modoAvancado && modelo && (
        <Card>
          <CardHeader>
            <CardTitle>Informações do Modelo Preditivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Configuração</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Modelo:</strong> {modelo.nome} {modelo.versao}</p>
                  <p><strong>Algoritmo:</strong> {modelo.parametros.algoritmo}</p>
                  <p><strong>Janela:</strong> {modelo.parametros.janelaTemporal} dias</p>
                  <p><strong>Último treino:</strong> {format(modelo.ultimoTreinamento, 'dd/MM/yy', { locale: ptBR })}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Métricas de Performance</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Acurácia</span>
                      <span>{(modelo.acuracia * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={modelo.acuracia * 100} className="h-2" />
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>MAE: {modelo.metricas.mae.toFixed(3)}</p>
                    <p>RMSE: {modelo.metricas.rmse.toFixed(3)}</p>
                    <p>MAPE: {modelo.metricas.mape.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Variáveis de Entrada</h4>
                <div className="space-y-1">
                  {modelo.parametros.variaveisEntrada.map((variavel, index) => (
                    <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                      {variavel}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análises Preditivas */}
      <Tabs defaultValue="previsoes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="previsoes">Previsões</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="cenarios">Cenários</TabsTrigger>
          <TabsTrigger value="metricas">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="previsoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Previsões de Bem-estar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={previsoes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis domain={[-1, 1]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        formatarPorcentagem(value as number),
                        name === 'valenciaPrevisao' ? 'Bem-estar Previsto' : 
                        name === 'arousalPrevisao' ? 'Energia Prevista' : name
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cenarioOtimista" 
                      fill="#10B981" 
                      fillOpacity={0.2}
                      stroke="none"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cenarioPessimista" 
                      fill="#EF4444" 
                      fillOpacity={0.2}
                      stroke="none"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="valenciaPrevisao" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="2 2" />
                    <ReferenceLine y={-0.3} stroke="#EF4444" strokeDasharray="4 4" label="Zona de Risco" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Linha do Tempo de Previsões */}
          <Card>
            <CardHeader>
              <CardTitle>Linha do Tempo - Próximos {previsoes.length} Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previsoes.slice(0, 7).map((previsao, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className={`h-4 w-4 rounded-full ${
                        previsao.valenciaPrevisao > 0.2 ? 'bg-green-500' :
                        previsao.valenciaPrevisao < -0.2 ? 'bg-red-500' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="font-medium">{previsao.data}</p>
                        <p className="text-sm text-gray-600">
                          {format(previsao.dataCompleta, 'EEEE', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatarPorcentagem(previsao.valenciaPrevisao)}
                      </p>
                      <p className={`text-xs ${getCorConfianca(previsao.confianca)}`}>
                        {(previsao.confianca * 100).toFixed(0)}% confiança
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-red-600">
                        {(previsao.probabilidadeRisco * 100).toFixed(0)}% risco
                      </p>
                      {previsao.fatoresInfluencia.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {previsao.fatoresInfluencia[0]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {insights.map((insight) => (
              <Card key={insight.id} className={`border-l-4 ${
                insight.prioridade === 'alta' ? 'border-l-red-500' :
                insight.prioridade === 'media' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        insight.tipo === 'alerta' ? 'bg-red-100' :
                        insight.tipo === 'oportunidade' ? 'bg-green-100' :
                        insight.tipo === 'tendencia' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        <div className={getCorTipo(insight.tipo)}>
                          {getIconeTipo(insight.tipo)}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{insight.titulo}</h3>
                          <Badge variant={
                            insight.prioridade === 'alta' ? 'destructive' :
                            insight.prioridade === 'media' ? 'default' : 'secondary'
                          }>
                            {insight.prioridade}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">{insight.descricao}</p>
                        
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <strong>Ação sugerida:</strong> {insight.acaoSugerida}
                        </div>
                        
                        {modoAvancado && (
                          <div className="mt-2 text-xs text-gray-600">
                            <span>Precisão: {(insight.metricas.precisao * 100).toFixed(0)}%</span>
                            <span className="mx-2">•</span>
                            <span>Recall: {(insight.metricas.recall * 100).toFixed(0)}%</span>
                            <span className="mx-2">•</span>
                            <span>F1: {(insight.metricas.f1Score * 100).toFixed(0)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="flex items-center space-x-1 mb-1">
                        <span className={`text-sm font-medium ${getCorConfianca(insight.confianca)}`}>
                          {(insight.confianca * 100).toFixed(0)}%
                        </span>
                        <span className="text-xs text-gray-500">confiança</span>
                      </div>
                      
                      <div className="text-xs text-gray-600">
                        Impacto: {insight.impactoEstimado.toFixed(0)}%
                      </div>
                      
                      {insight.dataRelevante && (
                        <div className="text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {format(insight.dataRelevante, 'dd/MM', { locale: ptBR })}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Cenários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={previsoes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis domain={[-1, 1]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        formatarPorcentagem(value as number),
                        name === 'cenarioOtimista' ? 'Cenário Otimista' :
                        name === 'valenciaPrevisao' ? 'Cenário Esperado' :
                        name === 'cenarioPessimista' ? 'Cenário Pessimista' : name
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cenarioOtimista" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="valenciaPrevisao" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cenarioPessimista" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                    />
                    <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="2 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-700 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Cenário Otimista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 mb-2">
                  {formatarPorcentagem(Math.max(...previsoes.map(p => p.cenarioOtimista)))}
                </p>
                <p className="text-sm text-gray-600 mb-3">Melhor caso previsto</p>
                <ul className="text-xs space-y-1">
                  <li>• Estratégias funcionando perfeitamente</li>
                  <li>• Eventos externos favoráveis</li>
                  <li>• Alta participação dos alunos</li>
                  <li>• Minimização de fatores estressantes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-700 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Cenário Esperado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {formatarPorcentagem(resumo?.valenciaMedia || 0)}
                </p>
                <p className="text-sm text-gray-600 mb-3">Projeção mais provável</p>
                <ul className="text-xs space-y-1">
                  <li>• Condições normais de operação</li>
                  <li>• Variações sazonais típicas</li>
                  <li>• Intervenções conforme planejado</li>
                  <li>• Margem de erro considerada</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-red-700 flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  Cenário Pessimista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600 mb-2">
                  {formatarPorcentagem(Math.min(...previsoes.map(p => p.cenarioPessimista)))}
                </p>
                <p className="text-sm text-gray-600 mb-3">Pior caso previsto</p>
                <ul className="text-xs space-y-1">
                  <li>• Múltiplos fatores estressantes</li>
                  <li>• Baixa eficácia das intervenções</li>
                  <li>• Eventos externos negativos</li>
                  <li>• Necessidade de ação urgente</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metricas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Confiança</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { faixa: '90-100%', quantidade: previsoes.filter(p => p.confianca >= 0.9).length },
                      { faixa: '80-89%', quantidade: previsoes.filter(p => p.confianca >= 0.8 && p.confianca < 0.9).length },
                      { faixa: '70-79%', quantidade: previsoes.filter(p => p.confianca >= 0.7 && p.confianca < 0.8).length },
                      { faixa: '60-69%', quantidade: previsoes.filter(p => p.confianca >= 0.6 && p.confianca < 0.7).length },
                      { faixa: '<60%', quantidade: previsoes.filter(p => p.confianca < 0.6).length }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="faixa" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantidade" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Probabilidade de Risco por Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={previsoes.slice(0, 14)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="data" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip formatter={(value) => [`${(value as number * 100).toFixed(0)}%`, 'Probabilidade de Risco']} />
                      <Area 
                        type="monotone" 
                        dataKey="probabilidadeRisco" 
                        fill="#EF4444" 
                        fillOpacity={0.6}
                        stroke="#EF4444"
                        strokeWidth={2}
                      />
                      <ReferenceLine y={0.6} stroke="#DC2626" strokeDasharray="4 4" label="Limite de Risco" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {modoAvancado && modelo && (
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance do Modelo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Erro Médio Absoluto (MAE)</h4>
                    <p className="text-2xl font-bold text-blue-600">{modelo.metricas.mae.toFixed(3)}</p>
                    <p className="text-sm text-gray-600">Menor é melhor (0.000 = perfeito)</p>
                    <Progress value={(1 - modelo.metricas.mae) * 100} className="mt-2" />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Erro Quadrático Médio (RMSE)</h4>
                    <p className="text-2xl font-bold text-green-600">{modelo.metricas.rmse.toFixed(3)}</p>
                    <p className="text-sm text-gray-600">Penaliza erros grandes</p>
                    <Progress value={(1 - modelo.metricas.rmse) * 100} className="mt-2" />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Erro Percentual (MAPE)</h4>
                    <p className="text-2xl font-bold text-purple-600">{modelo.metricas.mape.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Erro relativo médio</p>
                    <Progress value={100 - modelo.metricas.mape} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Alertas de Ação Urgente */}
      {insights.filter(i => i.prioridade === 'alta').length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{insights.filter(i => i.prioridade === 'alta').length} insight(s) de alta prioridade</strong> 
            {' '}requerem ação imediata. Revise a aba "Insights" para detalhes específicos.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default InsightsPreditivos;
