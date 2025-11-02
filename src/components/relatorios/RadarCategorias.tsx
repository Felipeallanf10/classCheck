'use client';

/**
 * @file RadarCategorias.tsx
 * @description Gráfico Radar para comparar scores de diferentes categorias socioemocionais
 * @author ClassCheck v3.0
 * @date 2025-11-02
 */

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DadoRadar {
  categoria: string;
  scoreAtual: number;
  scoreAnterior?: number;
  scoreIdeal?: number;
}

interface RadarCategoriasProps {
  dados: DadoRadar[];
  titulo?: string;
  altura?: number;
  mostrarComparacao?: boolean;
}

export function RadarCategorias({
  dados,
  titulo = 'Perfil Socioemocional - Radar',
  altura = 400,
  mostrarComparacao = true,
}: RadarCategoriasProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-sm mb-2">{data.categoria}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-medium">{entry.value.toFixed(1)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Normalizar dados para escala 0-10
  const dadosNormalizados = dados.map((d) => ({
    ...d,
    categoria: d.categoria.replace(/_/g, ' ').substring(0, 15), // Abreviar nomes longos
    scoreAtual: Math.min(10, Math.max(0, d.scoreAtual)),
    scoreAnterior: d.scoreAnterior
      ? Math.min(10, Math.max(0, d.scoreAnterior))
      : undefined,
    scoreIdeal: d.scoreIdeal ? Math.min(10, Math.max(0, d.scoreIdeal)) : undefined,
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{titulo}</h3>

      {dados.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={altura}>
            <RadarChart data={dadosNormalizados}>
              <PolarGrid stroke="#e5e7eb" />
              
              <PolarAngleAxis
                dataKey="categoria"
                tick={{ fontSize: 11, fill: '#6b7280' }}
              />
              
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              
              {/* Score Atual */}
              <Radar
                name="Atual"
                dataKey="scoreAtual"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                strokeWidth={2}
              />
              
              {/* Score Anterior (se disponível) */}
              {mostrarComparacao && dadosNormalizados.some((d) => d.scoreAnterior) && (
                <Radar
                  name="Anterior"
                  dataKey="scoreAnterior"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.3}
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
              )}
              
              {/* Score Ideal (referência) */}
              {dadosNormalizados.some((d) => d.scoreIdeal) && (
                <Radar
                  name="Ideal"
                  dataKey="scoreIdeal"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              )}
            </RadarChart>
          </ResponsiveContainer>

          {/* Análise por categoria */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dadosNormalizados.map((dado, idx) => {
              const diferenca = dado.scoreAnterior
                ? dado.scoreAtual - dado.scoreAnterior
                : 0;
              
              return (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      {dado.categoria}
                    </p>
                    <span className="text-lg font-bold text-blue-600">
                      {dado.scoreAtual.toFixed(1)}
                    </span>
                  </div>
                  
                  {/* Barra de progresso */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${(dado.scoreAtual / 10) * 100}%` }}
                    />
                  </div>
                  
                  {/* Variação */}
                  {mostrarComparacao && dado.scoreAnterior !== undefined && (
                    <p
                      className={`text-xs mt-1 ${
                        diferenca > 0
                          ? 'text-green-600'
                          : diferenca < 0
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {diferenca > 0 ? '↑' : diferenca < 0 ? '↓' : '→'}{' '}
                      {Math.abs(diferenca).toFixed(1)} pts
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Resumo Geral */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-800 mb-2">📈 Resumo Geral</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {(dadosNormalizados.reduce((acc, d) => acc + d.scoreAtual, 0) / dadosNormalizados.length).toFixed(1)}
                </p>
                <p className="text-xs text-gray-600">Média Geral</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {dadosNormalizados.filter((d) => d.scoreAtual >= 7).length}
                </p>
                <p className="text-xs text-gray-600">Categorias Positivas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {dadosNormalizados.filter((d) => d.scoreAtual < 5).length}
                </p>
                <p className="text-xs text-gray-600">Requerem Atenção</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
