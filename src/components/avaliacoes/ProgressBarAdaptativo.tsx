/**
 * ProgressBar Adaptativo - Barra de progresso com informações IRT
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ProgressoSessao, IRTInfo, NivelAlerta } from '@/types/sessao';
import {
  getAlertaColor,
  getAlertaLabel,
  getProgressColor,
  formatarTempo,
  formatarConfianca,
  interpretarTheta,
  calcularTempoRestante,
} from '@/lib/progresso-utils';
import {
  Clock,
  CheckCircle2,
  Target,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressBarAdaptativoProps {
  progresso: ProgressoSessao;
  irt?: IRTInfo;
  nivelAlerta?: NivelAlerta;
  tempoDecorrido?: number;
  adaptativo?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  showIRT?: boolean;
  showTempo?: boolean;
  showAlerta?: boolean;
  className?: string;
}

export function ProgressBarAdaptativo({
  progresso,
  irt,
  nivelAlerta = 'VERDE',
  tempoDecorrido = 0,
  adaptativo = false,
  variant = 'default',
  showIRT = true,
  showTempo = true,
  showAlerta = true,
  className,
}: ProgressBarAdaptativoProps) {
  const alertaColors = getAlertaColor(nivelAlerta);
  const progressColor = getProgressColor(nivelAlerta);
  const tempoRestante = calcularTempoRestante(tempoDecorrido, progresso.porcentagem);

  // Variant Compact: Apenas barra + porcentagem
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-semibold">{Math.round(progresso.porcentagem)}%</span>
        </div>
        <Progress value={progresso.porcentagem} className="h-2" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {progresso.perguntasRespondidas} de {progresso.totalEstimado}
          </span>
          {showTempo && tempoDecorrido > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatarTempo(tempoDecorrido)}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Variant Default: Barra + Cards de informações
  return (
    <Card className={cn('', className)}>
      <CardContent className="pt-6 space-y-4">
        {/* Cabeçalho com título e alerta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Progresso da Avaliação</h3>
          </div>

          {showAlerta && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className={cn(
                      'gap-1.5',
                      alertaColors.bg,
                      alertaColors.text,
                      alertaColors.border
                    )}
                  >
                    <AlertCircle className="h-3 w-3" />
                    {getAlertaLabel(nivelAlerta)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nível de atenção baseado nas respostas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Pergunta {progresso.perguntasRespondidas} de {progresso.totalEstimado}
            </span>
            <span className="font-bold text-lg">
              {Math.round(progresso.porcentagem)}%
            </span>
          </div>

          <div className="relative">
            <Progress
              value={progresso.porcentagem}
              className={cn('h-3', `[&>div]:${progressColor}`)}
            />
          </div>
        </div>

        {/* Informações Adicionais */}
        {variant === 'detailed' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {/* Tempo Decorrido */}
            {showTempo && tempoDecorrido > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Tempo</div>
                  <div className="font-semibold text-sm">
                    {formatarTempo(tempoDecorrido)}
                  </div>
                </div>
              </div>
            )}

            {/* Tempo Estimado Restante */}
            {showTempo && tempoRestante > 0 && progresso.porcentagem < 100 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Restante</div>
                  <div className="font-semibold text-sm">
                    ~{formatarTempo(tempoRestante)}
                  </div>
                </div>
              </div>
            )}

            {/* Theta (IRT) */}
            {showIRT && irt && adaptativo && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted cursor-help">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Theta</div>
                        <div className="font-semibold text-sm">
                          {irt.theta.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-semibold">Nível do Traço Latente</p>
                      <p className="text-xs">
                        Interpretação: {interpretarTheta(irt.theta)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Escala: -3 (baixo) a +3 (alto)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Confiança (IRT) */}
            {showIRT && irt && adaptativo && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted cursor-help">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Confiança</div>
                        <div className="font-semibold text-sm">
                          {formatarConfianca(irt.confianca)}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-semibold">Confiança da Medição</p>
                      <p className="text-xs">
                        Erro padrão: {irt.erro.toFixed(3)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Quanto maior, mais precisa é a avaliação
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}

        {/* Badge Adaptativo */}
        {adaptativo && showIRT && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-muted-foreground">
              Questionário adaptativo - perguntas selecionadas por IRT
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    A Teoria de Resposta ao Item (IRT) seleciona perguntas
                    dinamicamente baseadas em suas respostas, oferecendo uma
                    avaliação mais precisa com menos perguntas.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
