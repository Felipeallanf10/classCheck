/**
 * Componente: Gráfico Circumplex de Russell
 * 
 * Visualiza emoções em 2 dimensões:
 * - Eixo X: Valencia (Negativo → Positivo)
 * - Eixo Y: Ativação (Baixa → Alta)
 * 
 * Quadrantes:
 * - Q1 (top-right): Animado, Entusiasmado, Feliz
 * - Q2 (top-left): Ansioso, Estressado, Tenso
 * - Q3 (bottom-left): Triste, Deprimido, Cansado
 * - Q4 (bottom-right): Calmo, Relaxado, Sereno
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CircumplexData {
  valencia: number; // -1 a 1
  ativacao: number; // -1 a 1
}

interface CircumplexChartProps {
  data: CircumplexData | null;
  className?: string;
}

export function CircumplexChart({ data, className }: CircumplexChartProps) {
  if (!data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Modelo Circumplex</CardTitle>
          <CardDescription>
            Dados insuficientes para gerar o gráfico emocional
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { valencia, ativacao } = data;

  // Converter coordenadas (-1 a 1) para posição no SVG (0 a 100)
  const x = ((valencia + 1) / 2) * 100;
  const y = ((1 - ativacao) / 2) * 100; // Inverter Y (SVG cresce para baixo)

  // Determinar quadrante e estado emocional
  const { quadrante, estado, cor, emoji } = determinarEstadoEmocional(valencia, ativacao);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Modelo Circumplex de Russell</CardTitle>
        <CardDescription>
          Seu estado emocional: <strong className={`text-${cor}-600`}>{estado} {emoji}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-square max-w-md mx-auto">
          {/* SVG Canvas */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ backgroundColor: '#f9fafb' }}
          >
            {/* Grid de fundo */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Eixos */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="#9ca3af" strokeWidth="1" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#9ca3af" strokeWidth="1" />

            {/* Labels dos eixos */}
            <text x="50" y="8" textAnchor="middle" className="text-xs fill-gray-600">
              Alta Ativação
            </text>
            <text x="50" y="98" textAnchor="middle" className="text-xs fill-gray-600">
              Baixa Ativação
            </text>
            <text x="5" y="53" className="text-xs fill-gray-600">
              Negativo
            </text>
            <text x="85" y="53" className="text-xs fill-gray-600">
              Positivo
            </text>

            {/* Quadrantes coloridos (sutis) */}
            <rect x="50" y="0" width="50" height="50" fill="#dcfce7" opacity="0.3" />
            {/* Q1 - Verde (Feliz) */}
            <rect x="0" y="0" width="50" height="50" fill="#fef3c7" opacity="0.3" />
            {/* Q2 - Amarelo (Ansioso) */}
            <rect x="0" y="50" width="50" height="50" fill="#dbeafe" opacity="0.3" />
            {/* Q3 - Azul (Triste) */}
            <rect x="50" y="50" width="50" height="50" fill="#e0e7ff" opacity="0.3" />
            {/* Q4 - Roxo (Calmo) */}

            {/* Estados emocionais (labels) */}
            <text x="75" y="20" textAnchor="middle" className="text-xs fill-green-700 font-semibold">
              Animado 😊
            </text>
            <text x="25" y="20" textAnchor="middle" className="text-xs fill-yellow-700 font-semibold">
              Ansioso 😰
            </text>
            <text x="25" y="85" textAnchor="middle" className="text-xs fill-blue-700 font-semibold">
              Triste 😔
            </text>
            <text x="75" y="85" textAnchor="middle" className="text-xs fill-purple-700 font-semibold">
              Calmo 😌
            </text>

            {/* Ponto do usuário */}
            <circle
              cx={x}
              cy={y}
              r="4"
              fill={cor === 'green' ? '#16a34a' : cor === 'yellow' ? '#eab308' : cor === 'blue' ? '#2563eb' : '#7c3aed'}
              stroke="white"
              strokeWidth="2"
              className="drop-shadow-lg"
            />

            {/* Anel ao redor do ponto (animado) */}
            <circle
              cx={x}
              cy={y}
              r="6"
              fill="none"
              stroke={cor === 'green' ? '#16a34a' : cor === 'yellow' ? '#eab308' : cor === 'blue' ? '#2563eb' : '#7c3aed'}
              strokeWidth="1"
              opacity="0.5"
              className="animate-ping"
            />

            {/* Label do ponto */}
            <text
              x={x}
              y={y - 10}
              textAnchor="middle"
              className="text-sm font-bold fill-gray-900"
              style={{ textShadow: '0 0 3px white' }}
            >
              Você
            </text>
          </svg>
        </div>

        {/* Legenda */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Valencia:</p>
            <p className="text-gray-600">
              {valencia > 0.3 ? 'Positiva' : valencia < -0.3 ? 'Negativa' : 'Neutra'} ({(valencia * 100).toFixed(0)}%)
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Ativação:</p>
            <p className="text-gray-600">
              {ativacao > 0.3 ? 'Alta' : ativacao < -0.3 ? 'Baixa' : 'Média'} ({(ativacao * 100).toFixed(0)}%)
            </p>
          </div>
        </div>

        {/* Interpretação */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Interpretação:</strong> {interpretarQuadrante(quadrante)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Determina estado emocional baseado nas coordenadas
 */
function determinarEstadoEmocional(valencia: number, ativacao: number) {
  // Quadrante 1 (top-right): Valencia positiva, ativação alta
  if (valencia > 0 && ativacao > 0) {
    return {
      quadrante: 1,
      estado: 'Animado/Entusiasmado',
      cor: 'green',
      emoji: '😊',
    };
  }

  // Quadrante 2 (top-left): Valencia negativa, ativação alta
  if (valencia < 0 && ativacao > 0) {
    return {
      quadrante: 2,
      estado: 'Ansioso/Estressado',
      cor: 'yellow',
      emoji: '😰',
    };
  }

  // Quadrante 3 (bottom-left): Valencia negativa, ativação baixa
  if (valencia < 0 && ativacao < 0) {
    return {
      quadrante: 3,
      estado: 'Triste/Deprimido',
      cor: 'blue',
      emoji: '😔',
    };
  }

  // Quadrante 4 (bottom-right): Valencia positiva, ativação baixa
  if (valencia > 0 && ativacao < 0) {
    return {
      quadrante: 4,
      estado: 'Calmo/Relaxado',
      cor: 'purple',
      emoji: '😌',
    };
  }

  // Centro (neutro)
  return {
    quadrante: 0,
    estado: 'Neutro',
    cor: 'gray',
    emoji: '😐',
  };
}

/**
 * Interpreta significado do quadrante
 */
function interpretarQuadrante(quadrante: number): string {
  switch (quadrante) {
    case 1:
      return 'Você está em um estado emocional positivo e energizado. Aproveite esse momento para atividades produtivas e sociais.';
    case 2:
      return 'Você está experimentando emoções de alta ativação com valência negativa. Técnicas de respiração e pausas podem ajudar.';
    case 3:
      return 'Você está em um estado de baixa energia com emoções negativas. Considere buscar apoio e praticar autocuidado.';
    case 4:
      return 'Você está em um estado de calma e serenidade. Ótimo momento para reflexão e atividades tranquilas.';
    default:
      return 'Você está em um estado emocional equilibrado, sem predominância de uma direção específica.';
  }
}

export default CircumplexChart;
