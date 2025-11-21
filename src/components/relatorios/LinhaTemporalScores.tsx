'use client';

/**
 * @file LinhaTemporalScores.tsx
 * @description Gráfico de linha mostrando evolução temporal dos scores por categoria
 * @author ClassCheck v3.0
 * @date 2025-11-02
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PontoTemporal {
  data: string; // ISO string ou formato pt-BR
  [categoria: string]: number | string; // Scores por categoria
}

interface LinhaTemporalScoresProps {
  dados: PontoTemporal[];
  categorias: string[];
  titulo?: string;
  altura?: number;
}

const CORES_CATEGORIAS: Record<string, string> = {
  ANSIEDADE: '#ef4444',
  DEPRESSAO: '#f59e0b',
  BEM_ESTAR: '#10b981',
  SONO: '#3b82f6',
  ESTRESSE: '#ec4899',
  CONCENTRACAO: '#8b5cf6',
  MOTIVACAO: '#14b8a6',
  AUTOESTIMA: '#f97316',
  ENERGIA: '#eab308',
  RELACIONAMENTOS: '#06b6d4',
};

function corParaCategoria(categoria: string): string {
  return CORES_CATEGORIAS[categoria] || '#6b7280';
}

export function LinhaTemporalScores({
  dados,
  categorias,
  titulo = 'Evolução Temporal dos Scores',
  altura = 350,
}: LinhaTemporalScoresProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-medium">{entry.value.toFixed(2)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{titulo}</h3>
      
      {dados.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum dado disponível para o período selecionado</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={altura}>
          <LineChart
            data={dados}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            
            <XAxis
              dataKey="data"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => {
                try {
                  const date = new Date(value);
                  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                } catch {
                  return value;
                }
              }}
            />
            
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              label={{
                value: 'Score Médio',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: '12px', fill: '#6b7280' },
              }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
            
            {categorias.map((categoria) => (
              <Line
                key={categoria}
                type="monotone"
                dataKey={categoria}
                stroke={corParaCategoria(categoria)}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name={categoria.replace(/_/g, ' ')}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Resumo estatístico */}
      {dados.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {categorias.map((categoria) => {
            const valores = dados
              .map((d) => Number(d[categoria]))
              .filter((v) => !isNaN(v));
            
            if (valores.length === 0) return null;

            const media = valores.reduce((a, b) => a + b, 0) / valores.length;
            const ultimo = valores[valores.length - 1];
            const primeiro = valores[0];
            const variacao = primeiro !== 0 ? ((ultimo - primeiro) / primeiro) * 100 : 0;

            return (
              <div
                key={categoria}
                className="p-3 bg-gray-50 rounded-lg border-l-4"
                style={{ borderLeftColor: corParaCategoria(categoria) }}
              >
                <p className="text-xs text-gray-600 mb-1">
                  {categoria.replace(/_/g, ' ')}
                </p>
                <p className="text-lg font-semibold" style={{ color: corParaCategoria(categoria) }}>
                  {media.toFixed(1)}
                </p>
                <p className={`text-xs mt-1 ${variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {variacao >= 0 ? '↑' : '↓'} {Math.abs(variacao).toFixed(1)}%
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
