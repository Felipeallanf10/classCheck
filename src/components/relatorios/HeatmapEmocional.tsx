'use client';

/**
 * @file HeatmapEmocional.tsx
 * @description Heatmap de estados emocionais por hora/dia da semana
 * @author ClassCheck v3.0
 * @date 2025-11-02
 */

import React from 'react';

interface DadoHeatmap {
  dia: string; // 'Segunda', 'Terça', etc. ou dia do mês
  hora: number; // 0-23
  intensidade: number; // 0-1 (normalizado)
  count: number; // quantidade de registros
}

interface HeatmapEmocionalProps {
  dados: DadoHeatmap[];
  titulo?: string;
  tipo?: 'semana' | 'mes';
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HORAS = Array.from({ length: 24 }, (_, i) => i);

function corParaIntensidade(intensidade: number): string {
  // Escala de verde (baixo) a vermelho (alto)
  if (intensidade < 0.2) return '#d1fae5'; // Verde muito claro
  if (intensidade < 0.4) return '#6ee7b7'; // Verde claro
  if (intensidade < 0.6) return '#fde68a'; // Amarelo
  if (intensidade < 0.8) return '#fbbf24'; // Laranja
  return '#ef4444'; // Vermelho
}

export function HeatmapEmocional({
  dados,
  titulo = 'Padrões Emocionais - Heatmap',
  tipo = 'semana',
}: HeatmapEmocionalProps) {
  // Criar matriz de dados
  const matriz = tipo === 'semana'
    ? DIAS_SEMANA.map((dia) =>
        HORAS.map((hora) => {
          const celula = dados.find((d) => d.dia === dia && d.hora === hora);
          return celula || { dia, hora, intensidade: 0, count: 0 };
        })
      )
    : [];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{titulo}</h3>

      {dados.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-xs font-medium text-gray-600 p-2 sticky left-0 bg-white">
                  Dia/Hora
                </th>
                {HORAS.map((hora) => (
                  <th
                    key={hora}
                    className="text-xs font-medium text-gray-600 p-1 min-w-[30px]"
                  >
                    {hora}h
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matriz.map((linha, diaIdx) => (
                <tr key={diaIdx}>
                  <td className="text-xs font-medium text-gray-700 p-2 sticky left-0 bg-white">
                    {DIAS_SEMANA[diaIdx]}
                  </td>
                  {linha.map((celula, horaIdx) => (
                    <td
                      key={horaIdx}
                      className="p-1 border border-gray-200 relative group cursor-pointer"
                      style={{
                        backgroundColor: corParaIntensidade(celula.intensidade),
                      }}
                    >
                      <div className="w-full h-8"></div>
                      {celula.count > 0 && (
                        <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded shadow-lg z-10 -top-16 left-1/2 transform -translate-x-1/2 w-32">
                          <p className="font-semibold">{celula.dia} - {celula.hora}h</p>
                          <p>Intensidade: {(celula.intensidade * 100).toFixed(0)}%</p>
                          <p>Registros: {celula.count}</p>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legenda */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-gray-600">Intensidade:</span>
        <div className="flex gap-1">
          {[0, 0.25, 0.5, 0.75, 1].map((valor) => (
            <div key={valor} className="flex flex-col items-center">
              <div
                className="w-8 h-8 border border-gray-300"
                style={{ backgroundColor: corParaIntensidade(valor) }}
              />
              <span className="text-xs text-gray-500 mt-1">
                {(valor * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {dados.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">📊 Insights:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Total de registros: {dados.reduce((acc, d) => acc + d.count, 0)}</li>
            <li>
              • Hora com maior intensidade:{' '}
              {dados.sort((a, b) => b.intensidade - a.intensidade)[0]?.hora}h
            </li>
            <li>
              • Dia com maior atividade:{' '}
              {dados.sort((a, b) => b.count - a.count)[0]?.dia}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
