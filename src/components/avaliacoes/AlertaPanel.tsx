/**
 * AlertaPanel - Painel principal de alertas
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertaCard } from './AlertaCard';
import { AlertaDetalhesModal } from './AlertaDetalhesModal';
import { useAlertas } from '@/hooks/useAlertas';
import type { Alerta, AlertaFiltros } from '@/types/alerta';
import type { NivelAlerta } from '@/types/sessao';
import { AlertCircle, CheckCircle2, Eye, Filter, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertaPanelProps {
  sessaoId?: string;
  usuarioId?: string;
  compact?: boolean;
  maxAlertas?: number;
  autoRefresh?: boolean;
  className?: string;
}

export function AlertaPanel({
  sessaoId,
  usuarioId,
  compact = false,
  maxAlertas,
  autoRefresh = true,
  className,
}: AlertaPanelProps) {
  const [filtros, setFiltros] = useState<AlertaFiltros>({
    sessaoId,
    usuarioId,
    status: ['ATIVO', 'VISUALIZADO', 'EM_ACOMPANHAMENTO'],
  });
  const [alertaSelecionado, setAlertaSelecionado] = useState<Alerta | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: alertas = [], isLoading, refetch, isFetching } = useAlertas({
    filtros,
    refetchInterval: autoRefresh ? 15000 : undefined, // Atualiza a cada 15s
  });

  // Filtrar alertas por status
  const alertasAtivos = alertas.filter((a: Alerta) => a.status === 'ATIVO');
  const alertasVisualizados = alertas.filter((a: Alerta) => a.status === 'VISUALIZADO');
  const alertasAcompanhamento = alertas.filter((a: Alerta) => a.status === 'EM_ACOMPANHAMENTO');
  const alertasResolvidos = alertas.filter((a: Alerta) => a.status === 'RESOLVIDO');

  // Contar por nível
  const contarPorNivel = (lista: Alerta[]) => {
    return {
      VERMELHO: lista.filter((a) => a.nivel === 'VERMELHO').length,
      LARANJA: lista.filter((a) => a.nivel === 'LARANJA').length,
      AMARELO: lista.filter((a) => a.nivel === 'AMARELO').length,
      VERDE: lista.filter((a) => a.nivel === 'VERDE').length,
    };
  };

  const contagemAtivos = contarPorNivel(alertasAtivos);

  const handleOpenAlerta = (alerta: Alerta) => {
    setAlertaSelecionado(alerta);
    setModalOpen(true);
  };

  const handleFiltrarNivel = (nivel: NivelAlerta) => {
    setFiltros((prev) => ({
      ...prev,
      nivel: prev.nivel?.includes(nivel)
        ? prev.nivel.filter((n) => n !== nivel)
        : [...(prev.nivel || []), nivel],
    }));
  };

  // Limitar alertas se especificado
  const alertasExibidos = maxAlertas ? alertas.slice(0, maxAlertas) : alertas;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Versão Compact
  if (compact) {
    return (
      <>
        <Card className={className}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Alertas
                  {alertasAtivos.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {alertasAtivos.length}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Acompanhamento em tempo real</CardDescription>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {alertasExibidos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Nenhum alerta no momento</p>
              </div>
            ) : (
              <div className="space-y-2">
                {alertasExibidos.map((alerta: Alerta) => (
                  <AlertaCard
                    key={alerta.id}
                    alerta={alerta}
                    onClick={() => handleOpenAlerta(alerta)}
                    compact
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <AlertaDetalhesModal
          alerta={alertaSelecionado}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </>
    );
  }

  // Versão Completa
  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Painel de Alertas
              </CardTitle>
              <CardDescription>
                Acompanhamento de alertas gerados durante as avaliações
              </CardDescription>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
              Atualizar
            </Button>
          </div>

          {/* Filtros por Nível */}
          {alertasAtivos.length > 0 && (
            <div className="flex items-center gap-2 pt-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filtrar por nível:</span>

              {(['VERMELHO', 'LARANJA', 'AMARELO', 'VERDE'] as NivelAlerta[]).map((nivel) => {
                const count = contagemAtivos[nivel];
                if (count === 0) return null;

                const isActive = filtros.nivel?.includes(nivel);
                const colorMap = {
                  VERMELHO: 'bg-red-500 hover:bg-red-600',
                  LARANJA: 'bg-orange-500 hover:bg-orange-600',
                  AMARELO: 'bg-yellow-500 hover:bg-yellow-600',
                  VERDE: 'bg-green-500 hover:bg-green-600',
                };

                return (
                  <Button
                    key={nivel}
                    size="sm"
                    variant={isActive ? 'default' : 'outline'}
                    onClick={() => handleFiltrarNivel(nivel)}
                    className={cn(
                      'gap-2',
                      isActive && colorMap[nivel]
                    )}
                  >
                    {nivel}
                    <Badge variant="secondary" className="ml-1">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          )}
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="ativos">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ativos" className="gap-2">
                <Eye className="h-4 w-4" />
                Ativos
                {alertasAtivos.length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {alertasAtivos.length}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="visualizados">
                Visualizados
                {alertasVisualizados.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {alertasVisualizados.length}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="acompanhamento">
                Em Acompanhamento
                {alertasAcompanhamento.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {alertasAcompanhamento.length}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="resolvidos">
                Resolvidos
                {alertasResolvidos.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {alertasResolvidos.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Tab: Ativos */}
            <TabsContent value="ativos" className="space-y-4 mt-6">
              {alertasAtivos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Nenhum alerta ativo</p>
                  <p className="text-sm mt-1">Tudo está funcionando bem! 🎉</p>
                </div>
              ) : (
                alertasAtivos.map((alerta: Alerta) => (
                  <AlertaCard
                    key={alerta.id}
                    alerta={alerta}
                    onClick={() => handleOpenAlerta(alerta)}
                  />
                ))
              )}
            </TabsContent>

            {/* Tab: Visualizados */}
            <TabsContent value="visualizados" className="space-y-4 mt-6">
              {alertasVisualizados.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">Nenhum alerta visualizado</p>
                </div>
              ) : (
                alertasVisualizados.map((alerta: Alerta) => (
                  <AlertaCard
                    key={alerta.id}
                    alerta={alerta}
                    onClick={() => handleOpenAlerta(alerta)}
                  />
                ))
              )}
            </TabsContent>

            {/* Tab: Em Acompanhamento */}
            <TabsContent value="acompanhamento" className="space-y-4 mt-6">
              {alertasAcompanhamento.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">Nenhum alerta em acompanhamento</p>
                </div>
              ) : (
                alertasAcompanhamento.map((alerta: Alerta) => (
                  <AlertaCard
                    key={alerta.id}
                    alerta={alerta}
                    onClick={() => handleOpenAlerta(alerta)}
                  />
                ))
              )}
            </TabsContent>

            {/* Tab: Resolvidos */}
            <TabsContent value="resolvidos" className="space-y-4 mt-6">
              {alertasResolvidos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">Nenhum alerta resolvido</p>
                </div>
              ) : (
                alertasResolvidos.map((alerta: Alerta) => (
                  <AlertaCard
                    key={alerta.id}
                    alerta={alerta}
                    onClick={() => handleOpenAlerta(alerta)}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertaDetalhesModal
        alerta={alertaSelecionado}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
