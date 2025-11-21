'use client';

/**
 * @file GraficoCircumplex.tsx
 * @description Gráfico do Modelo Circumplex de Russell (Valência × Ativação)
 * @author ClassCheck v3.0
 * @date 2025-11-02
 */

import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Cell,
} from 'recharts';

interface DadoCircumplex {
  x: number; // Valência (-1 a +1)
  y: number; // Ativação (-1 a +1)
  nome: string;
  data: Date;
}

interface GraficoCircumplexProps {
  dados: DadoCircumplex[];
  titulo?: string;
  altura?: number;
}

const QUADRANTES = [
  { nome: 'Alta Ativação + Positivo', cor: '#10b981', label: 'Animado/Feliz' },
  { nome: 'Alta Ativação + Negativo', cor: '#ef4444', label: 'Ansioso/Tenso' },
  { nome: 'Baixa Ativação + Negativo', cor: '#f59e0b', label: 'Triste/Deprimido' },
  { nome: 'Baixa Ativação + Positivo', cor: '#3b82f6', label: 'Calmo/Relaxado' },
];

function determinarQuadrante(x: number, y: number): number {
  if (x >= 0 && y >= 0) return 0; // Positivo + Alta ativação
  if (x < 0 && y >= 0) return 1; // Negativo + Alta ativação
  if (x < 0 && y < 0) return 2; // Negativo + Baixa ativação
  return 3; // Positivo + Baixa ativação
}

function corParaPonto(x: number, y: number): string {
  const quadrante = determinarQuadrante(x, y);
  return QUADRANTES[quadrante].cor;
}

export function GraficoCircumplex({
  dados,
  titulo = 'Modelo Circumplex - Estado Emocional',
  altura = 400,
}: GraficoCircumplexProps) {
  // Calcular média para mostrar posição dominante
  const mediaX = dados.length > 0
    ? dados.reduce((acc, d) => acc + d.x, 0) / dados.length
    : 0;
  const mediaY = dados.length > 0
    ? dados.reduce((acc, d) => acc + d.y, 0) / dados.length
    : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-sm">{data.nome}</p>
          <p className="text-xs text-gray-600">
            {new Date(data.data).toLocaleDateString('pt-BR')}
          </p>
          <p className="text-xs mt-1">
            Valência: <span className="font-medium">{data.x.toFixed(2)}</span>
          </p>
          <p className="text-xs">
            Ativação: <span className="font-medium">{data.y.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{titulo}</h3>
      
      {/* Legenda dos quadrantes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {QUADRANTES.map((q, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: q.cor }}
            />
            <span className="text-xs text-gray-600">{q.label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={altura}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          
          <XAxis
            type="number"
            dataKey="x"
            domain={[-1, 1]}
            ticks={[-1, -0.5, 0, 0.5, 1]}
            tickFormatter={(value) => value.toFixed(1)}
          >
            <Label
              value="Valência (Negativo ← → Positivo)"
              position="insideBottom"
              offset={-10}
              style={{ fontSize: '12px', fill: '#6b7280' }}
            />
          </XAxis>
          
          <YAxis
            type="number"
            dataKey="y"
            domain={[-1, 1]}
            ticks={[-1, -0.5, 0, 0.5, 1]}
            tickFormatter={(value) => value.toFixed(1)}
          >
            <Label
              value="Ativação (Baixa ← → Alta)"
              angle={-90}
              position="insideLeft"
              style={{ fontSize: '12px', fill: '#6b7280' }}
            />
          </YAxis>
          
          {/* Linhas de referência para dividir quadrantes */}
          <ReferenceLine x={0} stroke="#9ca3af" strokeDasharray="5 5" />
          <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="5 5" />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Pontos individuais */}
          <Scatter name="Estados" data={dados} fill="#8884d8">
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={corParaPonto(entry.x, entry.y)} />
            ))}
          </Scatter>
          
          {/* Ponto médio (estado dominante) */}
          {dados.length > 0 && (
            <Scatter
              name="Média"
              data={[{ x: mediaX, y: mediaY, nome: 'Estado Médio' }]}
              fill="#6366f1"
              shape="cross"
              legendType="cross"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>

      {/* Indicador do estado dominante */}
      {dados.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">
            Estado Emocional Dominante:
          </p>
          <p className="text-lg font-semibold" style={{ color: corParaPonto(mediaX, mediaY) }}>
            {QUADRANTES[determinarQuadrante(mediaX, mediaY)].label}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Baseado na média de {dados.length} registro{dados.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
