/**
 * EscalaFrequencia - Componente para escalas de frequência
 * Usado em: PHQ-9, GAD-7
 * Escala: 0-3 (Nenhuma vez, Vários dias, Mais da metade, Quase todos os dias)
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface EscalaFrequenciaProps {
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  labels?: Record<0 | 1 | 2 | 3, string>;
}

const DEFAULT_LABELS: Record<0 | 1 | 2 | 3, string> = {
  0: 'Nenhuma vez',
  1: 'Vários dias',
  2: 'Mais da metade dos dias',
  3: 'Quase todos os dias',
};

export function EscalaFrequencia({
  value,
  onChange,
  disabled = false,
  labels = DEFAULT_LABELS,
}: EscalaFrequenciaProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const opcoes = [0, 1, 2, 3] as const;

  return (
    <div className="space-y-4">
      {/* Descrição da escala */}
      <p className="text-sm text-muted-foreground text-center">
        Com que frequência você experimentou isso nas últimas 2 semanas?
      </p>

      {/* Grid de opções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {opcoes.map((opcao) => {
          const isSelected = value === opcao;
          const isHovered = hoveredValue === opcao;

          return (
            <Button
              key={opcao}
              type="button"
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'h-auto py-4 px-6 text-left justify-start relative transition-all',
                'hover:scale-105 hover:shadow-md',
                isSelected && 'ring-2 ring-primary ring-offset-2',
                isHovered && !isSelected && 'bg-accent'
              )}
              onClick={() => {
                console.log(`[EscalaFrequencia] Selecionado: ${opcao} (${labels[opcao]})`);
                onChange(opcao);
              }}
              onMouseEnter={() => setHoveredValue(opcao)}
              onMouseLeave={() => setHoveredValue(null)}
              disabled={disabled}
            >
              <div className="flex items-start gap-3 w-full">
                {/* Checkbox visual */}
                <div
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5',
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground/50'
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>

                {/* Texto */}
                <div className="flex-1">
                  <div className="font-medium">{labels[opcao]}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Valor: {opcao}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Indicador de seleção */}
      {value !== undefined && value !== null && (
        <div className="text-center text-sm text-muted-foreground">
          Selecionado: <span className="font-medium text-foreground">{labels[value as 0 | 1 | 2 | 3]}</span>
        </div>
      )}
    </div>
  );
}

export default EscalaFrequencia;
