/**
 * Componente Múltipla Escolha (única seleção)
 */

'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { OpcaoPergunta } from '@/types/pergunta';
import { CheckCircle2, Circle } from 'lucide-react';

interface MultiplaEscolhaProps {
  opcoes: OpcaoPergunta[];
  value?: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
}

export function MultiplaEscolha({ opcoes, value, onChange, disabled }: MultiplaEscolhaProps) {
  return (
    <div className="space-y-3">
      {opcoes.map((opcao) => {
        const isSelected = value === opcao.valor;
        
        return (
          <button
            key={String(opcao.valor)}
            type="button"
            onClick={() => onChange(opcao.valor)}
            disabled={disabled}
            className={cn(
              'w-full text-left p-4 rounded-lg border-2 transition-all',
              'hover:bg-accent hover:border-primary/50',
              'disabled:cursor-not-allowed disabled:opacity-50',
              isSelected
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {isSelected ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 space-y-1">
                {opcao.emoji && (
                  <span className="text-2xl mr-2">{opcao.emoji}</span>
                )}
                <div className="font-medium">{opcao.label || opcao.texto}</div>
                {opcao.descricao && (
                  <div className="text-sm text-muted-foreground">
                    {opcao.descricao}
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
