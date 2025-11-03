/**
 * Página de Relatório Avançado
 * 
 * Dashboard completo com métricas agregadas, tendências e análises
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertCircle, 
  Download, 
  Calendar,
  Filter 
} from 'lucide-react';
import { DashboardAnalise } from '@/components/relatorios/DashboardAnalise';
import { MetricasAgregadas } from '@/lib/analytics/metricas-avaliacoes';
import { format, subDays, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// TODO: Pegar ID do usuário da sessão
const USUARIO_ID = 52;

type PeriodoFiltro = 'ultimos7dias' | 'ultimos30dias' | 'ultimos3meses' | 'todos';

export default function RelatorioAvancadoPage() {
  const router = useRouter();
  const [metricas, setMetricas] = useState<MetricasAgregadas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodoFiltro, setPeriodoFiltro] = useState<PeriodoFiltro>('ultimos30dias');

  useEffect(() => {
    fetchMetricas();
  }, [periodoFiltro]);

  async function fetchMetricas() {
    try {
      setLoading(true);
      setError(null);

      // Calcular datas baseado no filtro
      const hoje = new Date();
      let periodoInicio: string | undefined;

      switch (periodoFiltro) {
        case 'ultimos7dias':
          periodoInicio = subDays(hoje, 7).toISOString();
          break;
        case 'ultimos30dias':
          periodoInicio = subDays(hoje, 30).toISOString();
          break;
        case 'ultimos3meses':
          periodoInicio = subMonths(hoje, 3).toISOString();
          break;
        case 'todos':
          periodoInicio = undefined;
          break;
      }

      const params = new URLSearchParams({
        usuarioId: USUARIO_ID.toString(),
      });

      if (periodoInicio) {
        params.append('periodoInicio', periodoInicio);
      }

      const response = await fetch(`/api/analytics/metricas-avaliacoes?${params}`);

      if (!response.ok) {
        throw new Error('Erro ao carregar métricas');
      }

      const data = await response.json();

      if (!data.metricas) {
        throw new Error(data.mensagem || 'Nenhuma avaliação encontrada para o período');
      }

      setMetricas(data.metricas);
    } catch (err) {
      console.error('Erro ao buscar métricas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  function handleExportar() {
    if (!metricas) return;

    // Criar JSON para download
    const dataStr = JSON.stringify(metricas, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-analise-${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function getPeriodoTexto(): string {
    switch (periodoFiltro) {
      case 'ultimos7dias': return 'Últimos 7 dias';
      case 'ultimos30dias': return 'Últimos 30 dias';
      case 'ultimos3meses': return 'Últimos 3 meses';
      case 'todos': return 'Todo o período';
    }
  }

  if (loading) {
    return (
      <div className="container max-w-7xl py-8 space-y-6">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-16">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Análise</h2>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={fetchMetricas}>
                  Tentar Novamente
                </Button>
                <Button variant="outline" onClick={() => router.push('/minhas-avaliacoes')}>
                  Ver Avaliações
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metricas) {
    return (
      <div className="container max-w-4xl py-16">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nenhuma avaliação encontrada para análise. Complete algumas avaliações primeiro.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Análise Avançada</h1>
          <p className="text-muted-foreground mt-2">
            Métricas agregadas e insights sobre suas avaliações
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            <Calendar className="inline h-3 w-3 mr-1" />
            {format(metricas.periodoInicio, "dd 'de' MMM", { locale: ptBR })} até{' '}
            {format(metricas.periodoFim, "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filtro de Período */}
          <Select value={periodoFiltro} onValueChange={(value) => setPeriodoFiltro(value as PeriodoFiltro)}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultimos7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="ultimos30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="ultimos3meses">Últimos 3 meses</SelectItem>
              <SelectItem value="todos">Todo o período</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão Exportar */}
          <Button variant="outline" onClick={handleExportar}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Info Box */}
      <Alert>
        <AlertDescription>
          Analisando <strong>{metricas.totalAvaliacoes} avaliações</strong> no período de{' '}
          <strong>{getPeriodoTexto()}</strong>. As métricas são calculadas com médias ponderadas
          para maior precisão.
        </AlertDescription>
      </Alert>

      {/* Dashboard */}
      <DashboardAnalise metricas={metricas} />

      {/* Footer Actions */}
      <div className="flex justify-center gap-3 pt-6">
        <Button variant="outline" onClick={() => router.push('/minhas-avaliacoes')}>
          Ver Minhas Avaliações
        </Button>
        <Button variant="outline" onClick={() => router.push('/relatorios')}>
          Outros Relatórios
        </Button>
      </div>
    </div>
  );
}
