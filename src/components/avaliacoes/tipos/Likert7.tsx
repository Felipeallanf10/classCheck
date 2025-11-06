/**
 * Likert7 - Componente para escala Likert de 7 pontos
 * Usado em: SWLS (Satisfaction With Life Scale)
 * Escala: 1-7 (Discordo totalmente → Concordo totalmente)
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Likert7Props {
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  labels?: {
    inicio?: string;
    fim?: string;
    meio?: string;
  };
}

const DEFAULT_LABELS = {
  inicio: 'Discordo totalmente',
  meio: 'Neutro',
  fim: 'Concordo totalmente',
};

export function Likert7({
  value,
  onChange,
  disabled = false,
  labels = DEFAULT_LABELS,
}: Likert7Props) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const opcoes = [1, 2, 3, 4, 5, 6, 7];

  const getLabel = (opcao: number): string => {
    if (opcao === 1) return labels.inicio || DEFAULT_LABELS.inicio;
    if (opcao === 4) return labels.meio || DEFAULT_LABELS.meio;
    if (opcao === 7) return labels.fim || DEFAULT_LABELS.fim;
    return '';
  };

  const getShortLabel = (opcao: number): string => {
    const shortLabels: Record<number, string> = {
      1: 'Discordo totalmente',
      2: 'Discordo',
      3: 'Discordo um pouco',
      4: 'Neutro',
      5: 'Concordo um pouco',
      6: 'Concordo',
      7: 'Concordo totalmente',
    };
    return shortLabels[opcao] || `${opcao}`;
  };

  return (
    <div className="space-y-6">
      {/* Descrição */}
      <div className="flex justify-between text-sm text-muted-foreground px-2">
        <span>{labels.inicio}</span>
        <span>{labels.fim}</span>
      </div>

      {/* Escala visual horizontal */}
      <div className="relative">
        {/* Barra de fundo */}
        <div className="h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full" />
        
        {/* Indicador de progresso */}
        {value && (
          <div
            className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((value - 1) / 6) * 100}%` }}
          />
        )}

        {/* Marcadores */}
        <div className="relative flex justify-between -mt-1">
          {opcoes.map((opcao) => {
            const isSelected = value === opcao;
            const isHovered = hoveredValue === opcao;

            return (
              <button
                key={opcao}
                type="button"
                className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center',
                  'transition-all hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  isSelected
                    ? 'bg-primary border-primary text-primary-foreground scale-125 shadow-lg'
                    : 'bg-white border-muted-foreground/30 hover:border-primary',
                  isHovered && !isSelected && 'border-primary/50 scale-110'
                )}
                onClick={() => {
                  console.log(`[Likert7] Selecionado: ${opcao}`);
                  onChange(opcao);
                }}
                onMouseEnter={() => setHoveredValue(opcao)}
                onMouseLeave={() => setHoveredValue(null)}
                disabled={disabled}
                aria-label={getShortLabel(opcao)}
              >
                {isSelected ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-medium">{opcao}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de botões (alternativa mobile-friendly) */}
      <div className="grid grid-cols-7 gap-2 md:hidden">
        {opcoes.map((opcao) => {
          const isSelected = value === opcao;

          return (
            <Button
              key={opcao}
              type="button"
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'h-auto py-3 flex flex-col items-center gap-1',
                isSelected && 'ring-2 ring-primary ring-offset-2'
              )}
              onClick={() => onChange(opcao)}
              disabled={disabled}
            >
              <span className="text-lg font-bold">{opcao}</span>
            </Button>
          );
        })}
      </div>

      {/* Labels detalhados */}
      <div className="hidden md:grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
        {opcoes.map((opcao) => (
          <div key={opcao} className={cn(value === opcao && 'text-foreground font-medium')}>
            {getShortLabel(opcao)}
          </div>
        ))}
      </div>

      {/* Indicador de seleção */}
      {value !== undefined && value !== null && (
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Selecionado: </span>
          <span className="font-medium text-foreground">
            {value} - {getShortLabel(value)}
          </span>
        </div>
      )}
    </div>
  );
}
