/**
 * Dashboard de Análise Avançada
 * 
 * Exibe métricas agregadas, tendências e comparativos
 * com gráficos interativos usando Recharts
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Brain,
  BookOpen,
  BarChart3,
  Award 
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { MetricasAgregadas, formatarVariacao, corTendencia, iconeTendencia } from '@/lib/analytics/metricas-avaliacoes';

interface DashboardAnaliseProps {
  metricas: MetricasAgregadas;
}

const CORES_GRAFICOS = {
  primaria: '#3b82f6',
  secundaria: '#8b5cf6',
  sucesso: '#10b981',
  alerta: '#f59e0b',
  perigo: '#ef4444',
  neutra: '#6b7280',
};

const CORES_ESTADOS = [
  '#10b981', // Verde
  '#3b82f6', // Azul
  '#8b5cf6', // Roxo
  '#f59e0b', // Amarelo
  '#ef4444', // Vermelho
];

export function DashboardAnalise({ metricas }: DashboardAnaliseProps) {
  // Preparar dados para gráfico de distribuição de notas
  const dadosDistribuicao = metricas.didatica.distribuicaoNotas.map(item => ({
    nota: `⭐${item.nota}`,
    quantidade: item.quantidade,
    percentual: (item.quantidade / metricas.totalAvaliacoes) * 100,
  }));

  // Preparar dados para gráfico radar (por matéria)
  const dadosRadarMaterias = metricas.porMateria.slice(0, 5).map(m => ({
    materia: m.materia.substring(0, 10),
    compreensao: m.compreensaoMedia,
    engajamento: (m.engajamentoMedio / 10) * 5, // Normalizar para escala 0-5
    valencia: ((m.valenciaMedia + 1) / 2) * 5, // Converter -1,1 para 0-5
  }));

  // Preparar dados para gráfico de estados
  const dadosEstados = metricas.socioemocional.estadosPredominantes
    .slice(0, 5)
    .map(item => ({
      estado: item.estado,
      frequencia: item.frequencia,
      percentual: item.percentual,
    }));

  const IconeTendenciaComponent = ({ tipo }: { tipo: 'crescente' | 'estavel' | 'decrescente' }) => {
    switch (tipo) {
      case 'crescente': return <TrendingUp className="h-4 w-4" />;
      case 'decrescente': return <TrendingDown className="h-4 w-4" />;
      case 'estavel': return <Minus className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Valência Média */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valência Emocional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {metricas.socioemocional.valenciaMedia.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Desvio: ±{metricas.socioemocional.valenciaDesvio.toFixed(2)}
            </p>
            <Badge className="mt-2" variant="secondary">
              {metricas.socioemocional.estadosPredominantes[0]?.estado || 'N/A'}
            </Badge>
          </CardContent>
        </Card>

        {/* Nota Geral Média */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nota Didática Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">
                {metricas.didatica.notaGeralMedia.toFixed(1)}
              </div>
              <span className="text-lg text-muted-foreground">/5.0</span>
            </div>
            <div className="flex gap-0.5 mt-2">
              {[...Array(Math.round(metricas.didatica.notaGeralMedia))].map((_, i) => (
                <span key={i} className="text-yellow-500">⭐</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engajamento Médio */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Engajamento Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">
                {metricas.didatica.engajamentoMedio.toFixed(1)}
              </div>
              <span className="text-lg text-muted-foreground">/10</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Compreensão: {metricas.didatica.compreensaoMedia.toFixed(1)}/5
            </p>
          </CardContent>
        </Card>

        {/* Confiança Média */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confiança IRT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(metricas.socioemocional.confiancaMedia * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Theta: {metricas.socioemocional.thetaMedio.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tendências */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Tendências Identificadas
          </CardTitle>
          <CardDescription>
            Análise de evolução ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metricas.tendencias.map((tendencia, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{iconeTendencia(tendencia.tipo)}</span>
                  <div>
                    <p className="font-medium">{tendencia.metrica}</p>
                    <p className="text-sm text-muted-foreground">
                      {tendencia.tipo === 'crescente' && 'Tendência positiva'}
                      {tendencia.tipo === 'decrescente' && 'Tendência negativa'}
                      {tendencia.tipo === 'estavel' && 'Mantendo estabilidade'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconeTendenciaComponent tipo={tendencia.tipo} />
                  <span className={`font-bold ${corTendencia(tendencia.tipo)}`}>
                    {formatarVariacao(tendencia.variacao)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Notas */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Notas Gerais</CardTitle>
            <CardDescription>
              Frequência de cada nível de avaliação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosDistribuicao}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nota" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'quantidade') return [value, 'Avaliações'];
                    return [value.toFixed(1) + '%', 'Percentual'];
                  }}
                />
                <Legend />
                <Bar dataKey="quantidade" fill={CORES_GRAFICOS.primaria} name="Avaliações" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Estados Emocionais */}
        <Card>
          <CardHeader>
            <CardTitle>Estados Emocionais Predominantes</CardTitle>
            <CardDescription>
              Top 5 estados mais frequentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosEstados}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.estado} (${entry.percentual.toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="frequencia"
                >
                  {dadosEstados.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES_ESTADOS[index % CORES_ESTADOS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Radar por Matéria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Comparativo por Matéria
          </CardTitle>
          <CardDescription>
            Top 5 matérias - Compreensão, Engajamento e Valência Emocional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={dadosRadarMaterias}>
              <PolarGrid />
              <PolarAngleAxis dataKey="materia" />
              <PolarRadiusAxis angle={90} domain={[0, 5]} />
              <Radar
                name="Compreensão"
                dataKey="compreensao"
                stroke={CORES_GRAFICOS.primaria}
                fill={CORES_GRAFICOS.primaria}
                fillOpacity={0.3}
              />
              <Radar
                name="Engajamento"
                dataKey="engajamento"
                stroke={CORES_GRAFICOS.sucesso}
                fill={CORES_GRAFICOS.sucesso}
                fillOpacity={0.3}
              />
              <Radar
                name="Valência"
                dataKey="valencia"
                stroke={CORES_GRAFICOS.secundaria}
                fill={CORES_GRAFICOS.secundaria}
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ranking de Matérias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Ranking de Matérias
          </CardTitle>
          <CardDescription>
            Ordenadas por nota geral ponderada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metricas.porMateria.map((materia, index) => (
              <div
                key={materia.materia}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{materia.materia}</p>
                    <p className="text-sm text-muted-foreground">
                      {materia.totalAvaliacoes} avaliações
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {materia.notaGeralMedia.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Eng: {materia.engajamentoMedio.toFixed(1)}/10
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
