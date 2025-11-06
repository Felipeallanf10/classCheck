/**
 * Componente Likert 5 pontos
 * Escala: 1 (Discordo totalmente) a 5 (Concordo totalmente)
 */

'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface Likert5Props {
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  labels?: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
}

const defaultLabels = {
  1: 'Discordo totalmente',
  2: 'Discordo',
  3: 'Neutro',
  4: 'Concordo',
  5: 'Concordo totalmente',
};

export function Likert5({ value, onChange, disabled, labels = defaultLabels }: Likert5Props) {
  return (
    <RadioGroup
      value={value?.toString()}
      onValueChange={(val) => onChange(parseInt(val, 10))}
      disabled={disabled}
      className="grid grid-cols-1 md:grid-cols-5 gap-3"
    >
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num} className="relative">
          <RadioGroupItem
            value={num.toString()}
            id={`likert-${num}`}
            className="peer sr-only"
          />
          <Label
            htmlFor={`likert-${num}`}
            className={cn(
              'flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all',
              'hover:bg-accent hover:border-primary/50',
              'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
              value === num && 'border-primary bg-primary/10'
            )}
          >
            <span className="text-2xl font-bold">{num}</span>
            <span className="text-xs text-center text-muted-foreground">
              {labels[num as keyof typeof labels]}
            </span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
