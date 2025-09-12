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
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Filter,
  User,
  Users,
  BarChart3,
  Activity,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RelatorioLongitudinalProps {
  alunoId?: string;
  turmaId?: string;
  periodo: 'semana' | 'mes' | 'trimestre' | 'semestre';
}

interface DadoTemporal {
  data: string;
  valencia: number;
  arousal: number;
  confianca: number;
  participacao: number;
  quadrante: 'q1' | 'q2' | 'q3' | 'q4';
  eventos?: string[];
}

interface MarcoSignificativo {
  data: Date;
  tipo: 'avaliacao' | 'projeto' | 'evento' | 'feriado';
  descricao: string;
  impacto: 'positivo' | 'negativo' | 'neutro';
}

const RelatorioLongitudinal: React.FC<RelatorioLongitudinalProps> = ({
  alunoId,
  turmaId = 'turma-001',
  periodo = 'mes'
}) => {
  const [dadosTemporais, setDadosTemporais] = useState<DadoTemporal[]>([]);
  const [marcos, setMarcos] = useState<MarcoSignificativo[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipoAnalise, setTipoAnalise] = useState<'individual' | 'turma'>('turma');

  // Gerar dados mockados para demonstração
  useEffect(() => {
    const gerarDadosTemporais = () => {
      const dados: DadoTemporal[] = [];
      const hoje = new Date();
      
      for (let i = 30; i >= 0; i--) {
        const data = subDays(hoje, i);
        
        // Simular variações realistas
        const tendencia = Math.sin(i * 0.1) * 0.3;
        const ruido = (Math.random() - 0.5) * 0.4;
        
        const valencia = Math.max(-1, Math.min(1, tendencia + ruido));
        const arousal = Math.max(-1, Math.min(1, (Math.random() - 0.5) * 0.8));
        
        // Determinar quadrante
        let quadrante: 'q1' | 'q2' | 'q3' | 'q4';
        if (valencia > 0 && arousal > 0) quadrante = 'q1';
        else if (valencia > 0 && arousal <= 0) quadrante = 'q2';
        else if (valencia <= 0 && arousal <= 0) quadrante = 'q3';
        else quadrante = 'q4';

        dados.push({
          data: format(data, 'dd/MM'),
          valencia,
          arousal,
          confianca: 0.7 + Math.random() * 0.25,
          participacao: 80 + Math.random() * 20,
          quadrante,
          eventos: i % 7 === 0 ? ['Avaliação semanal'] : undefined
        });
      }
      
      return dados;
    };

    const gerarMarcos = () => {
      const hoje = new Date();
      return [
        {
          data: subDays(hoje, 21),
          tipo: 'avaliacao' as const,
          descricao: 'Prova de Matemática',
          impacto: 'negativo' as const
        },
        {
          data: subDays(hoje, 14),
          tipo: 'projeto' as const,
          descricao: 'Apresentação de Ciências',
          impacto: 'positivo' as const
        },
        {
          data: subDays(hoje, 7),
          tipo: 'evento' as const,
          descricao: 'Festival da Escola',
          impacto: 'positivo' as const
        }
      ];
    };

    setLoading(true);
    setTimeout(() => {
      setDadosTemporais(gerarDadosTemporais());
      setMarcos(gerarMarcos());
      setLoading(false);
    }, 1000);
  }, [periodo, tipoAnalise]);

  const calcularEstatisticas = () => {
    if (dadosTemporais.length === 0) return null;

    const valenciaMedia = dadosTemporais.reduce((acc, d) => acc + d.valencia, 0) / dadosTemporais.length;
    const arousalMedio = dadosTemporais.reduce((acc, d) => acc + d.arousal, 0) / dadosTemporais.length;
    const confiancaMedia = dadosTemporais.reduce((acc, d) => acc + d.confianca, 0) / dadosTemporais.length;
    
    // Calcular tendência (slope)
    const n = dadosTemporais.length;
    const somaX = dadosTemporais.reduce((acc, _, i) => acc + i, 0);
    const somaY = dadosTemporais.reduce((acc, d) => acc + d.valencia, 0);
    const somaXY = dadosTemporais.reduce((acc, d, i) => acc + i * d.valencia, 0);
    const somaX2 = dadosTemporais.reduce((acc, _, i) => acc + i * i, 0);
    
    const tendencia = (n * somaXY - somaX * somaY) / (n * somaX2 - somaX * somaX);
    
    return {
      valenciaMedia,
      arousalMedio,
      confiancaMedia,
      tendencia,
      estabilidade: 1 - (dadosTemporais.reduce((acc, d) => acc + Math.abs(d.valencia - valenciaMedia), 0) / n)
    };
  };

  const estatisticas = calcularEstatisticas();

  const formatarPorcentagem = (valor: number) => {
    return `${((valor + 1) * 50).toFixed(0)}%`;
  };

  const getCorTendencia = (tendencia: number) => {
    if (tendencia > 0.02) return 'text-green-600';
    if (tendencia < -0.02) return 'text-red-600';
    return 'text-gray-600';
  };

  const getIconeTendencia = (tendencia: number) => {
    if (tendencia > 0.02) return <TrendingUp className="h-4 w-4" />;
    if (tendencia < -0.02) return <TrendingDown className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
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
            Relatório Longitudinal
          </h2>
          <p className="text-gray-600">
            Análise temporal de {periodo} - {tipoAnalise === 'individual' ? 'Aluno Individual' : 'Turma 8A'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            {periodo}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {tipoAnalise === 'individual' ? 'Individual' : 'Turma'}
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas Resumo */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bem-estar Médio</p>
                  <p className="text-xl font-bold">
                    {formatarPorcentagem(estatisticas.valenciaMedia)}
                  </p>
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
                  <p className="text-sm text-gray-600">Energia Média</p>
                  <p className="text-xl font-bold">
                    {formatarPorcentagem(estatisticas.arousalMedio)}
                  </p>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tendência</p>
                  <div className={`flex items-center ${getCorTendencia(estatisticas.tendencia)}`}>
                    {getIconeTendencia(estatisticas.tendencia)}
                    <span className="ml-1 font-bold">
                      {estatisticas.tendencia > 0 ? 'Melhorando' : 
                       estatisticas.tendencia < 0 ? 'Piorando' : 'Estável'}
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Estabilidade</p>
                  <p className="text-xl font-bold">
                    {(estatisticas.estabilidade * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Análises Temporais */}
      <Tabs defaultValue="tendencias" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tendencias">Tendências</TabsTrigger>
          <TabsTrigger value="distribuicao">Distribuição</TabsTrigger>
          <TabsTrigger value="correlacao">Correlação</TabsTrigger>
          <TabsTrigger value="marcos">Marcos</TabsTrigger>
        </TabsList>

        <TabsContent value="tendencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução Temporal - Valência e Ativação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dadosTemporais}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis domain={[-1, 1]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'valencia' ? formatarPorcentagem(value as number) :
                        name === 'arousal' ? formatarPorcentagem(value as number) :
                        `${value}%`,
                        name === 'valencia' ? 'Bem-estar' :
                        name === 'arousal' ? 'Energia' : 'Participação'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="valencia" 
                      fill="#3B82F6" 
                      fillOpacity={0.3}
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="arousal" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribuicao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Quadrantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { quadrante: 'Energizado+', quantidade: dadosTemporais.filter(d => d.quadrante === 'q1').length },
                    { quadrante: 'Calmo+', quantidade: dadosTemporais.filter(d => d.quadrante === 'q2').length },
                    { quadrante: 'Calmo-', quantidade: dadosTemporais.filter(d => d.quadrante === 'q3').length },
                    { quadrante: 'Energizado-', quantidade: dadosTemporais.filter(d => d.quadrante === 'q4').length }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quadrante" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Correlação Valência vs Ativação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={dadosTemporais}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="valencia" 
                      domain={[-1, 1]} 
                      type="number"
                      name="Valência"
                    />
                    <YAxis 
                      dataKey="arousal" 
                      domain={[-1, 1]} 
                      type="number"
                      name="Ativação"
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        formatarPorcentagem(value as number),
                        name === 'valencia' ? 'Bem-estar' : 'Energia'
                      ]}
                    />
                    <Scatter 
                      dataKey="arousal" 
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marcos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marcos Significativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marcos.map((marco, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      marco.impacto === 'positivo' ? 'bg-green-100' :
                      marco.impacto === 'negativo' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {marco.tipo === 'avaliacao' ? <BarChart3 className="h-5 w-5" /> :
                       marco.tipo === 'projeto' ? <User className="h-5 w-5" /> :
                       marco.tipo === 'evento' ? <Users className="h-5 w-5" /> :
                       <Calendar className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{marco.descricao}</h4>
                        <Badge variant={
                          marco.impacto === 'positivo' ? 'default' :
                          marco.impacto === 'negativo' ? 'destructive' : 'secondary'
                        }>
                          {marco.impacto}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {format(marco.data, "dd 'de' MMMM", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights Automatizados */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Automatizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Padrão Identificado</span>
              </div>
              <p className="text-sm text-blue-700">
                Melhoria consistente nos últimos 7 dias, com aumento de 15% no bem-estar geral.
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                <span className="font-semibold text-orange-800">Atenção</span>
              </div>
              <p className="text-sm text-orange-700">
                Variabilidade emocional alta detectada. Considere investigar fatores externos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatorioLongitudinal;
