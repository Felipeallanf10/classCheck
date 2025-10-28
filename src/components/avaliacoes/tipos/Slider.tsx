/**
 * Componente Slider (escala deslizante)
 */

'use client';

import { Slider as SliderUI } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SliderProps {
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  labels?: {
    inicio: string;
    fim: string;
  };
  showValue?: boolean;
}

const defaultLabels = {
  inicio: 'Mínimo',
  fim: 'Máximo',
};

export function Slider({
  value = 50,
  onChange,
  disabled,
  min = 0,
  max = 100,
  step = 1,
  labels = defaultLabels,
  showValue = true,
}: SliderProps) {
  return (
    <div className="space-y-6">
      {showValue && (
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">{value}</div>
          <div className="text-sm text-muted-foreground mt-1">
            de {min} a {max}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <SliderUI
          value={[value]}
          onValueChange={([val]) => onChange(val)}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className="cursor-pointer"
        />

        <div className="flex justify-between text-sm text-muted-foreground px-1">
          <span>{labels.inicio}</span>
          <span>{labels.fim}</span>
        </div>
      </div>
    </div>
  );
}
