'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ComposedChart,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Users,
  BarChart3,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertCircle
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GraficoTendenciasTurmaProps {
  turmaId?: string;
  periodo: 'semana' | 'mes' | 'trimestre' | 'ano';
}

interface DadoTendencia {
  data: string;
  dataCompleta: Date;
  valenciaMedia: number;
  arousalMedio: number;
  participacao: number;
  numeroAlunos: number;
  desvioValencia: number;
  desvioArousal: number;
  tendenciaValencia: number;
  tendenciaArousal: number;
  eventos?: {
    tipo: 'positivo' | 'negativo' | 'neutro';
    descricao: string;
  }[];
}

interface PrevisaoTendencia {
  data: string;
  dataCompleta: Date;
  valenciaPrevista: number;
  arousalPrevisto: number;
  confianca: number;
  limite_superior: number;
  limite_inferior: number;
}

const GraficoTendenciasTurma: React.FC<GraficoTendenciasTurmaProps> = ({
  turmaId = 'turma-001',
  periodo = 'mes'
}) => {
  const [dadosTendencia, setDadosTendencia] = useState<DadoTendencia[]>([]);
  const [previsoes, setPrevisoes] = useState<PrevisaoTendencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarPrevisao, setMostrarPrevisao] = useState(false);

  // Gerar dados realistas de tendência
  useEffect(() => {
    const gerarDadosTendencia = () => {
      const dados: DadoTendencia[] = [];
      const hoje = new Date();
      const diasPeriodo = periodo === 'semana' ? 7 : periodo === 'mes' ? 30 : periodo === 'trimestre' ? 90 : 365;
      
      let tendenciaGeral = 0.02; // Tendência ligeiramente positiva
      let cicloSemanal = 0;
      
      for (let i = diasPeriodo; i >= 0; i--) {
        const data = subDays(hoje, i);
        
        // Simular ciclos semanais (pior na segunda, melhor na sexta)
        cicloSemanal = Math.sin((i % 7) * Math.PI / 3.5) * 0.15;
        
        // Tendência com ruído
        const ruido = (Math.random() - 0.5) * 0.3;
        const tendenciaLongo = tendenciaGeral * (diasPeriodo - i);
        
        const valenciaBase = Math.max(-0.8, Math.min(0.8, tendenciaLongo + cicloSemanal + ruido * 0.5));
        const arousalBase = Math.max(-0.6, Math.min(0.6, (Math.random() - 0.5) * 0.8 + cicloSemanal * 0.5));
        
        // Simular eventos especiais
        const eventos = [];
        if (i === 14) {
          eventos.push({ tipo: 'negativo' as const, descricao: 'Semana de Provas' });
        } else if (i === 7) {
          eventos.push({ tipo: 'positivo' as const, descricao: 'Festival da Escola' });
        }
        
        dados.push({
          data: format(data, 'dd/MM'),
          dataCompleta: data,
          valenciaMedia: valenciaBase,
          arousalMedio: arousalBase,
          participacao: 75 + Math.random() * 20 + cicloSemanal * 10,
          numeroAlunos: 25 + Math.floor(Math.random() * 5),
          desvioValencia: 0.2 + Math.random() * 0.15,
          desvioArousal: 0.15 + Math.random() * 0.1,
          tendenciaValencia: (valenciaBase > 0 ? 1 : -1) * Math.abs(valenciaBase) * 0.5,
          tendenciaArousal: (arousalBase > 0 ? 1 : -1) * Math.abs(arousalBase) * 0.3,
          eventos: eventos.length > 0 ? eventos : undefined
        });
      }
      
      return dados;
    };

    const gerarPrevisoes = (dadosHistoricos: DadoTendencia[]) => {
      const previsoes: PrevisaoTendencia[] = [];
      const ultimosDados = dadosHistoricos.slice(-7); // Últimos 7 dias para tendência
      
      // Calcular tendência simples
      const tendenciaValencia = ultimosDados.reduce((acc, d, i) => 
        acc + d.valenciaMedia * (i + 1), 0) / ultimosDados.length - 
        ultimosDados.reduce((acc, d) => acc + d.valenciaMedia, 0) / ultimosDados.length;
      
      const ultimaValencia = ultimosDados[ultimosDados.length - 1].valenciaMedia;
      const ultimoArousal = ultimosDados[ultimosDados.length - 1].arousalMedio;
      
      for (let i = 1; i <= 7; i++) {
        const dataPrevisao = addDays(new Date(), i);
        const valenciaPrevista = Math.max(-1, Math.min(1, ultimaValencia + tendenciaValencia * i));
        const confianca = Math.max(0.3, 0.9 - i * 0.1); // Confiança diminui com o tempo
        
        previsoes.push({
          data: format(dataPrevisao, 'dd/MM'),
          dataCompleta: dataPrevisao,
          valenciaPrevista,
          arousalPrevisto: ultimoArousal + (Math.random() - 0.5) * 0.1 * i,
          confianca,
          limite_superior: valenciaPrevista + (1 - confianca) * 0.5,
          limite_inferior: valenciaPrevista - (1 - confianca) * 0.5
        });
      }
      
      return previsoes;
    };

    setLoading(true);
    setTimeout(() => {
      const dados = gerarDadosTendencia();
      setDadosTendencia(dados);
      setPrevisoes(gerarPrevisoes(dados));
      setLoading(false);
    }, 800);
  }, [periodo]);

  // Calcular estatísticas de tendência
  const calcularEstatisticasTendencia = () => {
    if (dadosTendencia.length < 2) return null;

    const dadosRecentes = dadosTendencia.slice(-7);
    const dadosAnteriores = dadosTendencia.slice(-14, -7);
    
    const mediaRecente = dadosRecentes.reduce((acc, d) => acc + d.valenciaMedia, 0) / dadosRecentes.length;
    const mediaAnterior = dadosAnteriores.reduce((acc, d) => acc + d.valenciaMedia, 0) / dadosAnteriores.length;
    
    const mudancaPercentual = dadosAnteriores.length > 0 ? 
      ((mediaRecente - mediaAnterior) / Math.abs(mediaAnterior)) * 100 : 0;
    
    const tendenciaGeral = mediaRecente > mediaAnterior ? 'crescente' : 
                          mediaRecente < mediaAnterior ? 'decrescente' : 'estável';
    
    // Calcular volatilidade
    const volatilidade = dadosRecentes.reduce((acc, d) => 
      acc + Math.abs(d.valenciaMedia - mediaRecente), 0) / dadosRecentes.length;
    
    return {
      tendenciaGeral,
      mudancaPercentual,
      volatilidade,
      mediaRecente,
      mediaAnterior,
      consistencia: volatilidade < 0.15 ? 'alta' : volatilidade < 0.3 ? 'media' : 'baixa'
    };
  };

  const estatisticas = calcularEstatisticasTendencia();

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

  const getIconeTendencia = (tendencia: string) => {
    switch (tendencia) {
      case 'crescente': return <TrendingUp className="h-4 w-4" />;
      case 'decrescente': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  // Combinar dados históricos e previsões para o gráfico
  const dadosCombinados = [
    ...dadosTendencia.map(d => ({
      ...d,
      tipo: 'historico' as const
    })),
    ...(mostrarPrevisao ? previsoes.map(p => ({
      data: p.data,
      dataCompleta: p.dataCompleta,
      valenciaMedia: p.valenciaPrevista,
      arousalMedio: p.arousalPrevisto,
      participacao: 80, // Valor estimado
      numeroAlunos: 27, // Valor estimado
      desvioValencia: 0.2,
      desvioArousal: 0.15,
      tendenciaValencia: 0,
      tendenciaArousal: 0,
      tipo: 'previsao' as const,
      confianca: p.confianca,
      limite_superior: p.limite_superior,
      limite_inferior: p.limite_inferior
    })) : [])
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Gráfico de Tendências da Turma
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Análise temporal de {periodo} - Turma 8A ({dadosTendencia[dadosTendencia.length - 1]?.numeroAlunos || 0} alunos)
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={mostrarPrevisao ? "default" : "outline"} 
            size="sm"
            onClick={() => setMostrarPrevisao(!mostrarPrevisao)}
          >
            <Activity className="h-4 w-4 mr-2" />
            {mostrarPrevisao ? 'Ocultar' : 'Mostrar'} Previsão
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            {periodo}
          </Button>
        </div>
      </div>

      {/* Estatísticas de Tendência */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tendência Geral</p>
                  <div className={`flex items-center ${getCorTendencia(estatisticas.tendenciaGeral)}`}>
                    {getIconeTendencia(estatisticas.tendenciaGeral)}
                    <span className="ml-1 font-bold capitalize">
                      {estatisticas.tendenciaGeral}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {estatisticas.mudancaPercentual > 0 ? '+' : ''}{estatisticas.mudancaPercentual.toFixed(1)}% vs período anterior
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bem-estar Médio</p>
                  <p className="text-xl font-bold dark:text-gray-100">
                    {formatarPorcentagem(estatisticas.mediaRecente)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Últimos 7 dias
                  </p>
                </div>
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Consistência</p>
                  <div className="flex items-center">
                    <Badge variant={
                      estatisticas.consistencia === 'alta' ? 'default' :
                      estatisticas.consistencia === 'media' ? 'secondary' : 'destructive'
                    }>
                      {estatisticas.consistencia}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Volatilidade: {(estatisticas.volatilidade * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráficos de Tendência */}
      <Tabs defaultValue="tendencia" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tendencia">Tendência Principal</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
          <TabsTrigger value="volatilidade">Volatilidade</TabsTrigger>
        </TabsList>

        <TabsContent value="tendencia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Bem-estar da Turma</CardTitle>
              {mostrarPrevisao && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Linha sólida: dados históricos | Linha tracejada: previsão
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dadosCombinados}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis domain={[-1, 1]} />
                    <Tooltip 
                      formatter={(value, name, props) => {
                        const isPrevisao = props.payload?.tipo === 'previsao';
                        return [
                          formatarPorcentagem(value as number),
                          name === 'valenciaMedia' ? 'Bem-estar' : 'Energia',
                          isPrevisao ? ' (Previsão)' : ''
                        ];
                      }}
                    />
                    
                    {/* Linha histórica */}
                    <Line 
                      type="monotone" 
                      dataKey="valenciaMedia" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#3B82F6' }}
                      connectNulls={false}
                    />
                    
                    {/* Área de confiança para previsões */}
                    {mostrarPrevisao && (
                      <>
                        <Area 
                          type="monotone" 
                          dataKey="limite_superior" 
                          fill="#3B82F620" 
                          stroke="none"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="limite_inferior" 
                          fill="#3B82F620" 
                          stroke="none"
                        />
                      </>
                    )}
                    
                    {/* Linha de referência */}
                    <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="2 2" />
                    
                    {/* Linha vertical separando histórico de previsão */}
                    {mostrarPrevisao && (
                      <ReferenceLine 
                        x={dadosTendencia[dadosTendencia.length - 1]?.data} 
                        stroke="#EF4444" 
                        strokeDasharray="4 4"
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparativo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bem-estar vs Energia vs Participação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dadosTendencia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis yAxisId="left" domain={[-1, 1]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'participacao' ? `${value}%` : formatarPorcentagem(value as number),
                        name === 'valenciaMedia' ? 'Bem-estar' :
                        name === 'arousalMedio' ? 'Energia' : 'Participação'
                      ]}
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="valenciaMedia" 
                      fill="#3B82F6" 
                      fillOpacity={0.3}
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="arousalMedio" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="participacao" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volatilidade" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Volatilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dadosTendencia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${(value as number * 100).toFixed(1)}%`, 'Desvio Padrão']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="desvioValencia" 
                      fill="#EF4444" 
                      fillOpacity={0.4}
                      stroke="#EF4444"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="desvioArousal" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Eventos Marcantes */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Impactantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dadosTendencia
              .filter(d => d.eventos && d.eventos.length > 0)
              .map((dia, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`h-3 w-3 rounded-full ${
                      dia.eventos?.[0].tipo === 'positivo' ? 'bg-green-500' :
                      dia.eventos?.[0].tipo === 'negativo' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></div>
                    <div>
                      <p className="font-medium dark:text-gray-100">{dia.eventos?.[0].descricao}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{dia.data}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium dark:text-gray-100">
                      {formatarPorcentagem(dia.valenciaMedia)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">bem-estar médio</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Previsões Detalhadas */}
      {mostrarPrevisao && (
        <Card>
          <CardHeader>
            <CardTitle>Previsões para os Próximos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {previsoes.map((previsao, index) => (
                <div key={index} className="text-center p-3 border dark:border-gray-700 rounded-lg">
                  <p className="font-medium text-sm dark:text-gray-100">{previsao.data}</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatarPorcentagem(previsao.valenciaPrevista)}
                  </p>
                  <div className="flex items-center justify-center mt-1">
                    <div className={`h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700`}>
                      <div 
                        className="h-2 bg-blue-500 dark:bg-blue-400 rounded-full transition-all"
                        style={{ width: `${previsao.confianca * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {(previsao.confianca * 100).toFixed(0)}% confiança
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GraficoTendenciasTurma;
