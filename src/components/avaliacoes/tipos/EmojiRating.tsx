/**
 * Componente Emoji Rating (5 emojis de emoções)
 */

'use client';

import { cn } from '@/lib/utils';

interface EmojiRatingProps {
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const emojis = [
  { valor: 1, emoji: '😭', label: 'Muito mal', cor: 'hover:bg-red-100' },
  { valor: 2, emoji: '😔', label: 'Mal', cor: 'hover:bg-orange-100' },
  { valor: 3, emoji: '😐', label: 'Neutro', cor: 'hover:bg-yellow-100' },
  { valor: 4, emoji: '😊', label: 'Bem', cor: 'hover:bg-lime-100' },
  { valor: 5, emoji: '😄', label: 'Muito bem', cor: 'hover:bg-green-100' },
];

export function EmojiRating({ value, onChange, disabled }: EmojiRatingProps) {
  return (
    <div className="flex justify-center gap-2 md:gap-4">
      {emojis.map((item) => (
        <button
          key={item.valor}
          type="button"
          onClick={() => onChange(item.valor)}
          disabled={disabled}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
            item.cor,
            'hover:scale-110 hover:shadow-lg',
            'disabled:cursor-not-allowed disabled:opacity-50',
            value === item.valor
              ? 'border-primary bg-primary/10 scale-110'
              : 'border-border'
          )}
        >
          <span className="text-4xl md:text-5xl">{item.emoji}</span>
          <span className="text-xs font-medium text-center">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
