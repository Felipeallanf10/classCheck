'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  Heart, 
  Activity,
  Target,
  Zap,
  AlertTriangle
} from 'lucide-react';

// Dados simulados para gráficos
const dadosTendencia = [
  { data: '12/09', valenca: 20, ativacao: 20 },
  { data: '19/09', valenca: 60, ativacao: 70 },
  { data: '26/09', valenca: -30, ativacao: 40 },
  { data: '03/10', valenca: 50, ativacao: 30 },
  { data: '10/10', valenca: 70, ativacao: 60 }
];

const dadosEmocoes = [
  { emocao: 'Animado', frequencia: 35 },
  { emocao: 'Calmo', frequencia: 28 },
  { emocao: 'Ansioso', frequencia: 15 },
  { emocao: 'Entusiasmado', frequencia: 12 },
  { emocao: 'Tranquilo', frequencia: 10 }
];

const dadosRadar = [
  { categoria: 'Bem-estar', valor: 75 },
  { categoria: 'Energia', valor: 65 },
  { categoria: 'Estabilidade', valor: 70 },
  { categoria: 'Positividade', valor: 80 },
  { categoria: 'Engajamento', valor: 60 }
];

export function AnaliseTab() {
  return (
    <div className="space-y-6">
      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-900 dark:text-green-100">
                Bem-estar Geral
              </CardDescription>
              <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-950 dark:text-green-50">75%</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp className="h-3 w-3 text-green-700 dark:text-green-300" />
              <span className="text-green-700 dark:text-green-300">+5% esta semana</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-900 dark:text-blue-100">
                Valência Média
              </CardDescription>
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-950 dark:text-blue-50">+42%</div>
            <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
              Predominantemente Positivo
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-orange-900 dark:text-orange-100">
                Nível de Energia
              </CardDescription>
              <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-950 dark:text-orange-50">62%</div>
            <Badge className="mt-2 bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200">
              Moderado
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-purple-900 dark:text-purple-100">
                Consistência
              </CardDescription>
              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-950 dark:text-purple-50">85%</div>
            <Badge className="mt-2 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200">
              Alta Estabilidade
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Tendência */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência Emocional</CardTitle>
          <CardDescription>Evolução da valência e ativação ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dadosTendencia}>
              <defs>
                <linearGradient id="colorValenca" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAtivacao" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="data" 
                className="text-xs fill-gray-600 dark:fill-gray-400"
              />
              <YAxis className="text-xs fill-gray-600 dark:fill-gray-400" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="valenca" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorValenca)"
                name="Valência"
              />
              <Area 
                type="monotone" 
                dataKey="ativacao" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorAtivacao)"
                name="Ativação"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Emoções Frequentes */}
        <Card>
          <CardHeader>
            <CardTitle>Emoções Mais Frequentes</CardTitle>
            <CardDescription>Distribuição das suas emoções registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosEmocoes}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="emocao" 
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis className="text-xs fill-gray-600 dark:fill-gray-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="frequencia" 
                  fill="#8b5cf6" 
                  radius={[8, 8, 0, 0]}
                  name="Frequência (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico Radar de Dimensões */}
        <Card>
          <CardHeader>
            <CardTitle>Análise Multidimensional</CardTitle>
            <CardDescription>Avaliação em diferentes dimensões emocionais</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={dadosRadar}>
                <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
                <PolarAngleAxis 
                  dataKey="categoria" 
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                />
                <Radar 
                  name="Pontuação" 
                  dataKey="valor" 
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.6} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights e Recomendações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Insights Positivos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Sua valência emocional tem se mantido consistentemente positiva nas últimas semanas.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Alta estabilidade emocional indica boa adaptação ao ambiente acadêmico.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Níveis de energia adequados para manter o engajamento nas atividades.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <CardTitle>Pontos de Atenção</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-orange-900 dark:text-orange-100">
                Houve um pico de ansiedade em 26/09. Considere técnicas de relaxamento.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-orange-900 dark:text-orange-100">
                Monitore padrões de baixa energia que possam afetar o desempenho.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-orange-900 dark:text-orange-100">
                Avaliações regulares ajudam a identificar padrões precocemente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
