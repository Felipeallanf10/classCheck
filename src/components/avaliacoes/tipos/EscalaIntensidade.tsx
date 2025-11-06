/**
 * EscalaIntensidade - Componente para escalas de intensidade/severidade
 * Usado em: PANAS, ISI
 * Escala: 1-5 (Nada, Pouco, Moderado, Bastante, Extremamente)
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface EscalaIntensidadeProps {
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  labels?: Record<1 | 2 | 3 | 4 | 5, string>;
  showEmojis?: boolean;
}

const DEFAULT_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Nada',
  2: 'Pouco',
  3: 'Moderado',
  4: 'Bastante',
  5: 'Extremamente',
};

const EMOJIS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '😌',
  2: '🙂',
  3: '😐',
  4: '😟',
  5: '😰',
};

const COLORS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-300',
  2: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-300',
  3: 'from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border-yellow-300',
  4: 'from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-orange-300',
  5: 'from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-red-300',
};

export function EscalaIntensidade({
  value,
  onChange,
  disabled = false,
  labels = DEFAULT_LABELS,
  showEmojis = true,
}: EscalaIntensidadeProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const opcoes = [1, 2, 3, 4, 5] as const;

  return (
    <div className="space-y-4">
      {/* Descrição da escala */}
      <p className="text-sm text-muted-foreground text-center">
        Qual a intensidade ou o quanto você sentiu isso?
      </p>

      {/* Grid de opções */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {opcoes.map((opcao) => {
          const isSelected = value === opcao;
          const isHovered = hoveredValue === opcao;

          return (
            <Button
              key={opcao}
              type="button"
              variant="outline"
              className={cn(
                'h-auto py-6 px-4 flex flex-col items-center gap-3 relative transition-all',
                'hover:scale-105 hover:shadow-md bg-gradient-to-br',
                isSelected && 'ring-2 ring-primary ring-offset-2 shadow-lg scale-105',
                !isSelected && COLORS[opcao]
              )}
              onClick={() => {
                console.log(`[EscalaIntensidade] Selecionado: ${opcao} (${labels[opcao]})`);
                onChange(opcao);
              }}
              onMouseEnter={() => setHoveredValue(opcao)}
              onMouseLeave={() => setHoveredValue(null)}
              disabled={disabled}
            >
              {/* Emoji */}
              {showEmojis && (
                <div className="text-3xl md:text-4xl">{EMOJIS[opcao]}</div>
              )}

              {/* Checkbox visual */}
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                  isSelected
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground/30 bg-white'
                )}
              >
                {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>

              {/* Texto */}
              <div className="text-center">
                <div className="font-medium text-sm">{labels[opcao]}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {opcao}
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Barra de progresso visual */}
      <div className="relative h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-full overflow-hidden">
        {value && (
          <div
            className="absolute top-0 left-0 h-full bg-primary/50 transition-all duration-300"
            style={{ width: `${(value / 5) * 100}%` }}
          />
        )}
      </div>

      {/* Indicador de seleção */}
      {value !== undefined && value !== null && (
        <div className="text-center text-sm text-muted-foreground">
          Intensidade: <span className="font-medium text-foreground">{labels[value as 1 | 2 | 3 | 4 | 5]}</span>
        </div>
      )}
    </div>
  );
}
