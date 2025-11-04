'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertCircle,
  Activity
} from 'lucide-react';
import { useRelatorioLongitudinal } from '@/hooks/useRelatorioLongitudinal';

interface RelatorioLongitudinalProps {
  usuarioId?: number;
  periodo: 'semana' | 'mes' | 'trimestre' | 'semestre';
}

const DIAS_POR_PERIODO = {
  semana: 7,
  mes: 30,
  trimestre: 90,
  semestre: 180,
};

const RelatorioLongitudinal: React.FC<RelatorioLongitudinalProps> = ({
  usuarioId = 52,
  periodo = 'mes'
}) => {
  const diasRetroativos = DIAS_POR_PERIODO[periodo];
  const { data, isLoading, error } = useRelatorioLongitudinal(usuarioId, diasRetroativos);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar relatório: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.dadosTemporais.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução Temporal</CardTitle>
          <CardDescription>
            Nenhuma avaliação encontrada no período selecionado
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { dadosTemporais, estatisticas } = data;

  const IconeTendencia = () => {
    switch (estatisticas.tendencia) {
      case 'crescente':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrescente':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'estavel':
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const corTendencia = () => {
    switch (estatisticas.tendencia) {
      case 'crescente': return 'text-green-600';
      case 'decrescente': return 'text-red-600';
      case 'estavel': return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Evolução Temporal - {periodo.charAt(0).toUpperCase() + periodo.slice(1)}
        </CardTitle>
        <CardDescription>
          Análise longitudinal das suas avaliações socioemocionais
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valência Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estatisticas.valenciaMedia.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Escala: -1.0 a 1.0
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ativação Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estatisticas.ativacaoMedia.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Escala: -1.0 a 1.0
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Confiança Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(estatisticas.confiancaMedia * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Precisão IRT
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tendência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <IconeTendencia />
                <span className={`text-lg font-bold ${corTendencia()}`}>
                  {estatisticas.tendencia.charAt(0).toUpperCase() + estatisticas.tendencia.slice(1)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {estatisticas.variacaoPercentual !== null ? (
                  <>
                    {estatisticas.variacaoPercentual > 0 ? '+' : ''}
                    {estatisticas.variacaoPercentual.toFixed(1)}%
                  </>
                ) : (
                  'N/A'
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Valência e Ativação ao Longo do Tempo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={dadosTemporais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="data" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis domain={[-1, 1]} />
              <Tooltip 
                formatter={(value: number) => value.toFixed(2)}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="valencia" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Valência"
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="ativacao" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Ativação"
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Confiança das Medições</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dadosTemporais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="data" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis domain={[0, 1]} />
              <Tooltip 
                formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="confianca" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3}
                name="Confiança"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Análise do Período:</strong> Foram analisadas avaliações de {dadosTemporais.length} dias
            no período de <strong>{periodo}</strong>. A tendência geral é{' '}
            <strong className={corTendencia()}>{estatisticas.tendencia}</strong>
            {estatisticas.variacaoPercentual !== null && (
              <>
                {' '}com variação de{' '}
                <strong>
                  {estatisticas.variacaoPercentual > 0 ? '+' : ''}
                  {estatisticas.variacaoPercentual.toFixed(1)}%
                </strong>
              </>
            )}.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default RelatorioLongitudinal;
