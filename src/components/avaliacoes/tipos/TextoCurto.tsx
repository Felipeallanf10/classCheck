/**
 * Componente Texto Curto (input simples)
 */

'use client';

import { Input } from '@/components/ui/input';

interface TextoCurtoProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function TextoCurto({
  value,
  onChange,
  disabled,
  placeholder = 'Digite sua resposta...',
  maxLength = 200,
}: TextoCurtoProps) {
  const valueStr = typeof value === 'string' ? value : '';
  return (
    <div className="space-y-2">
      <Input
        type="text"
        value={valueStr}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        className="text-base"
      />
      {maxLength && (
        <p className="text-xs text-muted-foreground text-right">
          {valueStr.length} / {maxLength} caracteres
        </p>
      )}
    </div>
  );
}
