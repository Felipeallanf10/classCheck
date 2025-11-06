'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * CircumplexGrid - Componente Interativo para Avaliação Emocional
 * 
 * Baseado no Modelo Circumplex de Russell (1980):
 * - Eixo X: Valencia (-1 = negativo, +1 = positivo)
 * - Eixo Y: Ativação (-1 = baixa energia, +1 = alta energia)
 * 
 * Quadrantes:
 * - Q1 (valencia+, ativação+): Animado, Feliz, Energizado
 * - Q2 (valencia+, ativação-): Calmo, Relaxado, Tranquilo
 * - Q3 (valencia-, ativação-): Entediado, Triste, Deprimido
 * - Q4 (valencia-, ativação+): Ansioso, Estressado, Tenso
 * 
 * Referência: Russell, J. A. (1980). A circumplex model of affect.
 * Journal of Personality and Social Psychology, 39(6), 1161–1178.
 */

interface EmotionalPoint {
  valencia: number; // -1.0 a 1.0
  ativacao: number; // -1.0 a 1.0
  timestamp?: Date;
  label?: string;
}

interface CircumplexGridProps {
  width?: number;
  height?: number;
  onSelect?: (point: EmotionalPoint) => void;
  selectedPoint?: EmotionalPoint | null;
  historicalPoints?: EmotionalPoint[];
  showLabels?: boolean;
  interactive?: boolean;
  className?: string;
}

const GRID_SIZE = 400;
const PADDING = 60;
const AXIS_COLOR = '#94a3b8';
const GRID_COLOR = '#e2e8f0';
const POINT_COLOR = '#3b82f6';
const SELECTED_COLOR = '#ef4444';
const HISTORICAL_COLOR = '#94a3b8';

/**
 * Converte coordenadas do canvas para valores do modelo (-1 a 1)
 */
function canvasToModel(x: number, y: number, canvasSize: number): EmotionalPoint {
  const center = canvasSize / 2;
  const valencia = (x - center) / (canvasSize / 2);
  const ativacao = -(y - center) / (canvasSize / 2); // Invertido (Y cresce para baixo no canvas)
  
  return {
    valencia: Math.max(-1, Math.min(1, valencia)),
    ativacao: Math.max(-1, Math.min(1, ativacao))
  };
}

/**
 * Converte valores do modelo para coordenadas do canvas
 */
function modelToCanvas(point: EmotionalPoint, canvasSize: number): { x: number; y: number } {
  const center = canvasSize / 2;
  const x = center + (point.valencia * center);
  const y = center - (point.ativacao * center); // Invertido
  
  return { x, y };
}

/**
 * Determina o quadrante emocional baseado em valencia e ativação
 */
function getQuadrantLabel(valencia: number, ativacao: number): string {
  if (valencia >= 0 && ativacao >= 0) return 'Animado';
  if (valencia >= 0 && ativacao < 0) return 'Calmo';
  if (valencia < 0 && ativacao < 0) return 'Entediado';
  return 'Ansioso';
}

/**
 * Obtém descrição emocional detalhada baseada na posição
 */
function getEmotionalDescription(valencia: number, ativacao: number): string {
  const intensity = Math.sqrt(valencia * valencia + ativacao * ativacao);
  
  if (intensity < 0.3) return 'Neutro';
  
  if (valencia >= 0 && ativacao >= 0) {
    if (intensity > 0.7) return 'Muito Animado';
    if (intensity > 0.4) return 'Energizado';
    return 'Alegre';
  }
  
  if (valencia >= 0 && ativacao < 0) {
    if (intensity > 0.7) return 'Muito Relaxado';
    if (intensity > 0.4) return 'Tranquilo';
    return 'Calmo';
  }
  
  if (valencia < 0 && ativacao < 0) {
    if (intensity > 0.7) return 'Muito Deprimido';
    if (intensity > 0.4) return 'Triste';
    return 'Desanimado';
  }
  
  // valencia < 0 && ativacao >= 0
  if (intensity > 0.7) return 'Muito Ansioso';
  if (intensity > 0.4) return 'Estressado';
  return 'Tenso';
}

export function CircumplexGrid({
  width = GRID_SIZE,
  height = GRID_SIZE,
  onSelect,
  selectedPoint,
  historicalPoints = [],
  showLabels = true,
  interactive = true,
  className = ''
}: CircumplexGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<EmotionalPoint | null>(null);
  const [emotionalState, setEmotionalState] = useState<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, width, height);

    // Configurar canvas de alta resolução
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const center = width / 2;

    // Desenhar grid de fundo
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    for (let i = 0.25; i <= 0.75; i += 0.25) {
      const offset = center * i;
      
      // Linhas verticais
      ctx.beginPath();
      ctx.moveTo(center - offset, 0);
      ctx.lineTo(center - offset, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(center + offset, 0);
      ctx.lineTo(center + offset, height);
      ctx.stroke();
      
      // Linhas horizontais
      ctx.beginPath();
      ctx.moveTo(0, center - offset);
      ctx.lineTo(width, center - offset);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, center + offset);
      ctx.lineTo(width, center + offset);
      ctx.stroke();
    }

    // Desenhar círculos concêntricos
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    for (let i = 0.25; i <= 1; i += 0.25) {
      const radius = (center - PADDING / 2) * i;
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Desenhar eixos principais
    ctx.strokeStyle = AXIS_COLOR;
    ctx.lineWidth = 2;
    
    // Eixo horizontal (Valencia)
    ctx.beginPath();
    ctx.moveTo(PADDING / 2, center);
    ctx.lineTo(width - PADDING / 2, center);
    ctx.stroke();
    
    // Eixo vertical (Ativação)
    ctx.beginPath();
    ctx.moveTo(center, PADDING / 2);
    ctx.lineTo(center, height - PADDING / 2);
    ctx.stroke();

    // Desenhar labels dos eixos
    if (showLabels) {
      ctx.fillStyle = AXIS_COLOR;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      
      // Labels Valencia
      ctx.fillText('Negativo', PADDING / 2, center - 10);
      ctx.fillText('Positivo', width - PADDING / 2, center - 10);
      
      // Labels Ativação
      ctx.save();
      ctx.translate(center + 10, PADDING / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Alta Energia', 0, 0);
      ctx.restore();
      
      ctx.save();
      ctx.translate(center + 10, height - PADDING / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Baixa Energia', 0, 0);
      ctx.restore();
      
      // Labels dos quadrantes
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#64748b';
      
      const labelOffset = center * 0.6;
      ctx.fillText('Animado', center + labelOffset, center - labelOffset);
      ctx.fillText('Calmo', center + labelOffset, center + labelOffset);
      ctx.fillText('Entediado', center - labelOffset, center + labelOffset);
      ctx.fillText('Ansioso', center - labelOffset, center - labelOffset);
    }

    // Desenhar pontos históricos
    if (historicalPoints.length > 0) {
      // Desenhar trajetória
      if (historicalPoints.length > 1) {
        ctx.strokeStyle = HISTORICAL_COLOR;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        
        const firstPoint = modelToCanvas(historicalPoints[0], width);
        ctx.moveTo(firstPoint.x, firstPoint.y);
        
        for (let i = 1; i < historicalPoints.length; i++) {
          const point = modelToCanvas(historicalPoints[i], width);
          ctx.lineTo(point.x, point.y);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Desenhar pontos
      historicalPoints.forEach((point, index) => {
        const { x, y } = modelToCanvas(point, width);
        const alpha = 0.3 + (index / historicalPoints.length) * 0.4; // Fade antigos
        
        ctx.fillStyle = HISTORICAL_COLOR;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    // Desenhar ponto selecionado
    if (selectedPoint) {
      const { x, y } = modelToCanvas(selectedPoint, width);
      
      // Círculo externo (pulso)
      ctx.strokeStyle = SELECTED_COLOR;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Ponto central
      ctx.fillStyle = SELECTED_COLOR;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Desenhar ponto hover
    if (hoveredPoint && interactive) {
      const { x, y } = modelToCanvas(hoveredPoint, width);
      
      ctx.strokeStyle = POINT_COLOR;
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [width, height, selectedPoint, historicalPoints, hoveredPoint, showLabels, interactive]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive || !onSelect) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const point = canvasToModel(x, y, width);
    const quadrant = getQuadrantLabel(point.valencia, point.ativacao);
    
    onSelect({
      ...point,
      timestamp: new Date(),
      label: quadrant
    });
    
    setEmotionalState(getEmotionalDescription(point.valencia, point.ativacao));
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const point = canvasToModel(x, y, width);
    setHoveredPoint(point);
    setEmotionalState(getEmotionalDescription(point.valencia, point.ativacao));
  };

  const handleCanvasMouseLeave = () => {
    setHoveredPoint(null);
    if (!selectedPoint) {
      setEmotionalState('');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Como você está se sentindo agora?</CardTitle>
        <CardDescription>
          Clique no ponto do grid que melhor representa seu estado emocional atual
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
          className={`border border-gray-200 rounded-lg ${interactive ? 'cursor-crosshair' : ''}`}
        />
        
        {emotionalState && (
          <div className="text-center">
            <p className="text-sm text-gray-600">Estado emocional:</p>
            <p className="text-lg font-semibold text-gray-900">{emotionalState}</p>
            {hoveredPoint && (
              <p className="text-xs text-gray-500 mt-1">
                Valencia: {hoveredPoint.valencia.toFixed(2)} | Ativação: {hoveredPoint.ativacao.toFixed(2)}
              </p>
            )}
          </div>
        )}
        
        {selectedPoint && (
          <div className="w-full p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">Selecionado:</p>
            <p className="text-lg font-bold text-blue-700">{selectedPoint.label}</p>
            <p className="text-xs text-blue-600 mt-1">
              V: {selectedPoint.valencia.toFixed(2)} | A: {selectedPoint.ativacao.toFixed(2)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CircumplexGrid;
