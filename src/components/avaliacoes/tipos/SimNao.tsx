/**
 * Componente Sim/Não
 */

'use client';

import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimNaoProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  labels?: {
    sim: string;
    nao: string;
  };
}

const defaultLabels = {
  sim: 'Sim',
  nao: 'Não',
};

export function SimNao({ value, onChange, disabled, labels = defaultLabels }: SimNaoProps) {
  return (
    <div className="flex gap-4 justify-center">
      <Button
        type="button"
        variant={value === false ? 'default' : 'outline'}
        size="lg"
        onClick={() => onChange(false)}
        disabled={disabled}
        className={cn(
          'flex-1 max-w-xs h-24 flex-col gap-2',
          value === false && 'bg-red-500 hover:bg-red-600 text-white'
        )}
      >
        <X className="h-8 w-8" />
        <span className="text-lg font-semibold">{labels.nao}</span>
      </Button>

      <Button
        type="button"
        variant={value === true ? 'default' : 'outline'}
        size="lg"
        onClick={() => onChange(true)}
        disabled={disabled}
        className={cn(
          'flex-1 max-w-xs h-24 flex-col gap-2',
          value === true && 'bg-green-500 hover:bg-green-600 text-white'
        )}
      >
        <Check className="h-8 w-8" />
        <span className="text-lg font-semibold">{labels.sim}</span>
      </Button>
    </div>
  );
}
