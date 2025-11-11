/**
 * Componente Escala Numérica (0-10)
 * Comum em escalas de dor, satisfação, etc
 */

'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface EscalaNumerica {
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  labels?: {
    inicio: string;
    fim: string;
  };
}

const defaultLabels = {
  inicio: 'Nenhum',
  fim: 'Extremo',
};

export function EscalaNumerica({
  value,
  onChange,
  disabled,
  min = 0,
  max = 10,
  labels = defaultLabels,
}: EscalaNumerica) {
  const valores = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-11 gap-2">
        {valores.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            disabled={disabled}
            className={cn(
              'aspect-square rounded-lg border-2 font-bold text-lg transition-all',
              'hover:bg-accent hover:border-primary/50 hover:scale-110',
              'disabled:cursor-not-allowed disabled:opacity-50',
              value === num
                ? 'border-primary bg-primary text-primary-foreground scale-110'
                : 'border-border bg-card'
            )}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-sm text-muted-foreground px-1">
        <span>{labels.inicio}</span>
        <span>{labels.fim}</span>
      </div>
    </div>
  );
}
