'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Heart, Brain, Users, Activity } from 'lucide-react';

interface MetricasData {
  totalAlunos: number;
  participacaoMedia: number;
  taxaConclusao: number;
  distribuicaoEmocional: {
    energizado_positivo: number;
    energizado_negativo: number;
    calmo_positivo: number;
    calmo_negativo: number;
  };
  mediaGeralValencia?: number;
  mediaGeralArousal?: number;
  quadrantes?: QuadranteData[];
  tendencias?: TendenciaData[];
  alertasAtivos?: number;
  mediasCategoria?: Record<string, number>;
}

interface MetricasTurmaProps {
  turmaId: string;
  periodo: 'hoje' | 'semana' | 'mes';
  metricas: MetricasData;
}

interface QuadranteData {
  nome: string;
  quantidade: number;
  porcentagem: number;
  cor: string;
  descricao: string;
}

interface TendenciaData {
  periodo: string;
  valencia: number;
  arousal: number;
  participacao: number;
}

const MetricasTurma: React.FC<MetricasTurmaProps> = ({
  turmaId,
  periodo,
  metricas
}) => {
  // Dados dos quadrantes do modelo circumplex
  const dadosQuadrantes: QuadranteData[] = [
    {
      nome: 'Energizado-Positivo',
      quantidade: 8,
      porcentagem: 28.6,
      cor: '#10B981',
      descricao: 'Motivados e engajados'
    },
    {
      nome: 'Calmo-Positivo',
      quantidade: 12,
      porcentagem: 42.9,
      cor: '#3B82F6',
      descricao: 'Relaxados e satisfeitos'
    },
    {
      nome: 'Calmo-Negativo',
      quantidade: 5,
      porcentagem: 17.9,
      cor: '#F59E0B',
      descricao: 'Desanimados mas estáveis'
    },
    {
      nome: 'Energizado-Negativo',
      quantidade: 3,
      porcentagem: 10.7,
      cor: '#EF4444',
      descricao: 'Ansiosos ou irritados'
    }
  ];

  // Dados de tendência ao longo do tempo
  const dadosTendencia: TendenciaData[] = [
    { periodo: 'Seg', valencia: 0.2, arousal: 0.1, participacao: 85 },
    { periodo: 'Ter', valencia: 0.3, arousal: 0.2, participacao: 92 },
    { periodo: 'Qua', valencia: 0.1, arousal: -0.1, participacao: 88 },
    { periodo: 'Qui', valencia: 0.4, arousal: 0.3, participacao: 95 },
    { periodo: 'Sex', valencia: 0.5, arousal: 0.2, participacao: 78 }
  ];

  // Dados do radar para análise multidimensional
  const dadosRadar = [
    { dimensao: 'Bem-estar', valor: 75, maximo: 100 },
    { dimensao: 'Engajamento', valor: 82, maximo: 100 },
    { dimensao: 'Estabilidade', valor: 68, maximo: 100 },
    { dimensao: 'Participação', valor: 89, maximo: 100 },
    { dimensao: 'Progresso', valor: 73, maximo: 100 },
    { dimensao: 'Colaboração', valor: 77, maximo: 100 }
  ];

  const getIconeTendencia = (valor: number) => {
    if (valor > 0.1) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (valor < -0.1) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const formatarPorcentagem = (valor: number) => {
    return `${((valor + 1) * 50).toFixed(0)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <Badge variant="secondary">Valência Média</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatarPorcentagem(metricas?.mediaGeralValencia || 0)}
                </span>
                {getIconeTendencia(metricas?.mediaGeralValencia || 0)}
              </div>
              <Progress value={((metricas?.mediaGeralValencia || 0) + 1) * 50} className="h-2" />
              <p className="text-xs text-gray-600">
                Nível geral de prazer/desprazer da turma
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <Badge variant="secondary">Ativação Média</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatarPorcentagem(metricas?.mediaGeralArousal || 0)}
                </span>
                {getIconeTendencia(metricas?.mediaGeralArousal || 0)}
              </div>
              <Progress value={((metricas?.mediaGeralArousal || 0) + 1) * 50} className="h-2" />
              <p className="text-xs text-gray-600">
                Nível geral de energia/calma da turma
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <Badge variant="secondary">Estabilidade</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">73%</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <Progress value={73} className="h-2" />
              <p className="text-xs text-gray-600">
                Consistência emocional da turma
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <Badge variant="secondary">Participação</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">89%</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <Progress value={89} className="h-2" />
              <p className="text-xs text-gray-600">
                Taxa de participação nas avaliações
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Quadrantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="h-5 w-5 bg-purple-100 rounded mr-2 flex items-center justify-center">
                <div className="h-2 w-2 bg-purple-600 rounded"></div>
              </div>
              Distribuição Emocional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosQuadrantes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="quantidade"
                    label={({ nome, porcentagem }) => `${porcentagem.toFixed(1)}%`}
                  >
                    {dadosQuadrantes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} alunos (${props.payload.porcentagem.toFixed(1)}%)`,
                      props.payload.descricao
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {dadosQuadrantes.map((quadrante, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div 
                    className="h-3 w-3 rounded mr-2"
                    style={{ backgroundColor: quadrante.cor }}
                  ></div>
                  <span className="truncate">{quadrante.nome}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tendência Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="h-5 w-5 bg-blue-100 rounded mr-2 flex items-center justify-center">
                <div className="h-2 w-2 bg-blue-600 rounded"></div>
              </div>
              Tendência da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dadosTendencia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis domain={[-1, 1]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'valencia' ? formatarPorcentagem(value as number) :
                      name === 'arousal' ? formatarPorcentagem(value as number) :
                      `${value}%`,
                      name === 'valencia' ? 'Valência' :
                      name === 'arousal' ? 'Ativação' : 'Participação'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="valencia" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="arousal" 
                    stackId="2"
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise Multidimensional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Análise Multidimensional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={dadosRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimensao" />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={false}
                  />
                  <Radar
                    name="Turma 8A"
                    dataKey="valor"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Score']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participação Diária</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosTendencia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Participação']}
                  />
                  <Bar 
                    dataKey="participacao" 
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <Badge variant="secondary">
                Média: 88% de participação
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle>Insights da Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">Ponto Forte</span>
              </div>
              <p className="text-sm text-green-700">
                42% da turma está em estado calmo-positivo, indicando boa estabilidade emocional.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center mb-2">
                <Activity className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="font-semibold text-yellow-800">Atenção</span>
              </div>
              <p className="text-sm text-yellow-700">
                18% dos alunos estão em estado calmo-negativo. Considere atividades motivacionais.
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center mb-2">
                <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
                <span className="font-semibold text-red-800">Prioridade</span>
              </div>
              <p className="text-sm text-red-700">
                11% estão em estado energizado-negativo. Intervenção imediata recomendada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricasTurma;
