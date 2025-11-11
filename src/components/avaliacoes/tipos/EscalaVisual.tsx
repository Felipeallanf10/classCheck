/**
 * EscalaVisual - Componente para escalas visuais bidimensionais
 * Usado em: Circumplex Model (Russell) - Valência x Ativação
 * Permite seleção em grid 2D para avaliar emoções
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EscalaVisualProps {
  value?: { x: number; y: number }; // x: valência (-1 a 1), y: ativação (-1 a 1)
  onChange: (value: { x: number; y: number }) => void;
  disabled?: boolean;
}

const EMOTIONS: Record<string, { x: number; y: number; label: string; emoji: string }> = {
  excited: { x: 0.7, y: 0.7, label: 'Animado', emoji: '🤩' },
  happy: { x: 0.7, y: 0, label: 'Feliz', emoji: '😊' },
  calm: { x: 0.7, y: -0.7, label: 'Calmo', emoji: '😌' },
  relaxed: { x: 0, y: -0.7, label: 'Relaxado', emoji: '😴' },
  sad: { x: -0.7, y: -0.7, label: 'Triste', emoji: '😢' },
  depressed: { x: -0.7, y: 0, label: 'Deprimido', emoji: '😔' },
  anxious: { x: -0.7, y: 0.7, label: 'Ansioso', emoji: '😰' },
  tense: { x: 0, y: 0.7, label: 'Tenso', emoji: '😬' },
};

export function EscalaVisual({ value, onChange, disabled = false }: EscalaVisualProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Converter coordenadas do mouse para valores -1 a 1
  const getCoordinates = (clientX: number, clientY: number): { x: number; y: number } | null => {
    if (!gridRef.current) return null;

    const rect = gridRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1; // -1 a 1
    const y = -(((clientY - rect.top) / rect.height) * 2 - 1); // -1 a 1 (invertido)

    // Limitar entre -1 e 1
    return {
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    const coords = getCoordinates(e.clientX, e.clientY);
    if (coords) {
      console.log('[EscalaVisual] Click:', coords);
      onChange(coords);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || disabled) return;
    const coords = getCoordinates(e.clientX, e.clientY);
    if (coords) {
      onChange(coords);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  const handleEmotionClick = (emotion: { x: number; y: number; label: string }) => {
    if (disabled) return;
    console.log(`[EscalaVisual] Emoção selecionada: ${emotion.label}`, { x: emotion.x, y: emotion.y });
    onChange({ x: emotion.x, y: emotion.y });
  };

  // Converter valor (-1 a 1) para posição em pixels (%)
  const getPosition = (coord: number) => {
    return ((coord + 1) / 2) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Descrição */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Clique no grid para indicar como você se sente agora
        </p>
        <div className="flex justify-between text-xs text-muted-foreground max-w-md mx-auto">
          <span>← Negativo</span>
          <span>Positivo →</span>
        </div>
      </div>

      {/* Grid Circumplex */}
      <div className="relative max-w-md mx-auto">
        <div
          ref={gridRef}
          className={cn(
            'relative w-full aspect-square rounded-lg overflow-hidden',
            'bg-gradient-to-br from-red-100 via-yellow-100 to-green-100',
            'border-2 border-border',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-crosshair'
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Linhas de grade */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="border border-muted-foreground/10" />
            ))}
          </div>

          {/* Eixos centrais */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground/30 pointer-events-none" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-muted-foreground/30 pointer-events-none" />

          {/* Labels dos eixos */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
            Alta Ativação
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
            Baixa Ativação
          </div>

          {/* Emoções de referência */}
          {Object.entries(EMOTIONS).map(([key, emotion]) => (
            <button
              key={key}
              type="button"
              className={cn(
                'absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2',
                'rounded-full border-2 border-background shadow-md',
                'flex items-center justify-center text-xl',
                'transition-all hover:scale-125 hover:z-10',
                'bg-white/80 backdrop-blur-sm',
                hoveredEmotion === key && 'scale-125 z-10'
              )}
              style={{
                left: `${getPosition(emotion.x)}%`,
                top: `${getPosition(-emotion.y)}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleEmotionClick(emotion);
              }}
              onMouseEnter={() => setHoveredEmotion(key)}
              onMouseLeave={() => setHoveredEmotion(null)}
              disabled={disabled}
              title={emotion.label}
            >
              {emotion.emoji}
            </button>
          ))}

          {/* Indicador de seleção */}
          {value && (
            <div
              className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              style={{
                left: `${getPosition(value.x)}%`,
                top: `${getPosition(-value.y)}%`,
              }}
            >
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
              <div className="absolute inset-0 rounded-full bg-primary border-2 border-white shadow-lg" />
            </div>
          )}
        </div>
      </div>

      {/* Seleção rápida de emoções */}
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(EMOTIONS).map(([key, emotion]) => (
          <button
            key={key}
            type="button"
            className={cn(
              'p-3 rounded-lg border-2 transition-all text-center',
              'hover:scale-105 hover:shadow-md',
              value?.x === emotion.x && value?.y === emotion.y
                ? 'border-primary bg-primary/10'
                : 'border-border bg-background'
            )}
            onClick={() => handleEmotionClick(emotion)}
            disabled={disabled}
          >
            <div className="text-2xl mb-1">{emotion.emoji}</div>
            <div className="text-xs font-medium">{emotion.label}</div>
          </button>
        ))}
      </div>

      {/* Valores atuais */}
      {value && (
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <div>
            Valência: <span className="font-medium text-foreground">{value.x > 0 ? 'Positiva' : 'Negativa'}</span>{' '}
            ({value.x.toFixed(2)})
          </div>
          <div>
            Ativação: <span className="font-medium text-foreground">{value.y > 0 ? 'Alta' : 'Baixa'}</span>{' '}
            ({value.y.toFixed(2)})
          </div>
        </div>
      )}
    </div>
  );
}
