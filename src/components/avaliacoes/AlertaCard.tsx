/**
 * AlertaCard - Card individual de alerta
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Alerta } from '@/types/alerta';
import { getAlertaColor } from '@/lib/progresso-utils';
import {
  getAlertaIcon,
  getAlertaTitulo,
  formatarDataRelativa,
  getStatusColors,
  getStatusLabel,
} from '@/lib/alerta-utils';
import { Eye, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertaCardProps {
  alerta: Alerta;
  onClick?: () => void;
  compact?: boolean;
  showStatus?: boolean;
  className?: string;
}

export function AlertaCard({
  alerta,
  onClick,
  compact = false,
  showStatus = true,
  className,
}: AlertaCardProps) {
  const Icon = getAlertaIcon(alerta.tipo);
  const alertaColors = getAlertaColor(alerta.nivel);
  const statusColors = getStatusColors(alerta.status);
  const titulo = alerta.titulo || getAlertaTitulo(alerta.tipo);

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'w-full text-left p-3 rounded-lg border transition-colors hover:bg-muted/50',
          alertaColors.border,
          alerta.status === 'ATIVO' && 'border-l-4',
          className
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'p-2 rounded-full',
              alertaColors.bg,
              alertaColors.text
            )}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-sm truncate">{titulo}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatarDataRelativa(alerta.criadoEm)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {alerta.descricao}
            </p>
          </div>

          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </button>
    );
  }

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md cursor-pointer border-l-4',
        alertaColors.border,
        alerta.status !== 'ATIVO' && 'opacity-75',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Ícone */}
          <div
            className={cn(
              'p-3 rounded-lg flex-shrink-0',
              alertaColors.bg,
              alertaColors.text
            )}
          >
            <Icon className="h-6 w-6" />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1">{titulo}</h3>
                <p className="text-sm text-muted-foreground">
                  {alerta.descricao}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {showStatus && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      statusColors.bg,
                      statusColors.text,
                      statusColors.border
                    )}
                  >
                    {getStatusLabel(alerta.status)}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatarDataRelativa(alerta.criadoEm)}
                </span>
              </div>
            </div>

            {/* Mensagem */}
            {alerta.mensagem && (
              <p className="text-sm mb-3 line-clamp-2">{alerta.mensagem}</p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                {alerta.status === 'ATIVO' && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs gap-1',
                      alertaColors.bg,
                      alertaColors.text,
                      alertaColors.border
                    )}
                  >
                    <Eye className="h-3 w-3" />
                    {alerta.nivel}
                  </Badge>
                )}
              </div>

              <Button variant="ghost" size="sm" className="text-xs">
                Ver detalhes
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
