/**
 * Componente Seleção Múltipla (várias opções)
 */

'use client';

import { cn } from '@/lib/utils';
import type { OpcaoPergunta } from '@/types/pergunta';
import { CheckSquare2, Square } from 'lucide-react';

interface SelecaoMultiplaProps {
  opcoes: OpcaoPergunta[];
  value?: Array<string | number>;
  onChange: (value: Array<string | number>) => void;
  disabled?: boolean;
}

export function SelecaoMultipla({ opcoes, value = [], onChange, disabled }: SelecaoMultiplaProps) {
  const toggle = (val: string | number) => {
    const existe = value.includes(val);
    const novo = existe ? value.filter(v => v !== val) : [...value, val];
    onChange(novo);
  };

  return (
    <div className="space-y-3">
      {opcoes.map((opcao) => {
        const isSelected = value.includes(opcao.valor as any);
        return (
          <button
            key={String(opcao.valor)}
            type="button"
            onClick={() => toggle(opcao.valor as any)}
            disabled={disabled}
            className={cn(
              'w-full text-left p-4 rounded-lg border-2 transition-all',
              'hover:bg-accent hover:border-primary/50',
              'disabled:cursor-not-allowed disabled:opacity-50',
              isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {isSelected ? (
                  <CheckSquare2 className="h-5 w-5 text-primary" />
                ) : (
                  <Square className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                {opcao.emoji && <span className="text-2xl mr-2">{opcao.emoji}</span>}
                <div className="font-medium">{opcao.label || opcao.texto}</div>
                {opcao.descricao && (
                  <div className="text-sm text-muted-foreground">{opcao.descricao}</div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
