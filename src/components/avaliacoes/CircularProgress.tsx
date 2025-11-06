/**
 * CircularProgress - Progresso circular para cards e dashboards
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { NivelAlerta } from '@/types/sessao';
import { getAlertaColor, getAlertaLabel, getProgressColor } from '@/lib/progresso-utils';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  porcentagem: number;
  nivelAlerta?: NivelAlerta;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { circle: 60, stroke: 4, fontSize: 'text-xs' },
  md: { circle: 100, stroke: 6, fontSize: 'text-base' },
  lg: { circle: 140, stroke: 8, fontSize: 'text-xl' },
};

export function CircularProgress({
  porcentagem,
  nivelAlerta = 'VERDE',
  size = 'md',
  showBadge = true,
  showLabel = false,
  className,
}: CircularProgressProps) {
  const { circle: circleSize, stroke: strokeWidth, fontSize } = sizeConfig[size];
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (porcentagem / 100) * circumference;

  const alertaColors = getAlertaColor(nivelAlerta);
  const progressColor = getProgressColor(nivelAlerta);

  // Mapear cores para stroke CSS
  const strokeColorMap: Record<string, string> = {
    'bg-green-500': 'stroke-green-500',
    'bg-yellow-500': 'stroke-yellow-500',
    'bg-orange-500': 'stroke-orange-500',
    'bg-red-500': 'stroke-red-500',
  };

  const strokeColor = strokeColorMap[progressColor] || 'stroke-primary';

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative inline-flex">
        <svg
          width={circleSize}
          height={circleSize}
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted opacity-20"
          />

          {/* Progress Circle */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(strokeColor, 'transition-all duration-300 ease-in-out')}
          />
        </svg>

        {/* Percentage Text */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ width: circleSize, height: circleSize }}
        >
          <span className={cn('font-bold', fontSize)}>
            {Math.round(porcentagem)}%
          </span>
        </div>
      </div>

      {/* Badge com nível de alerta */}
      {showBadge && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  alertaColors.bg,
                  alertaColors.text,
                  alertaColors.border
                )}
              >
                {getAlertaLabel(nivelAlerta)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nível de atenção baseado nas respostas</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Label adicional */}
      {showLabel && (
        <span className="text-xs text-muted-foreground text-center">
          Progresso
        </span>
      )}
    </div>
  );
}
