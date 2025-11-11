'use client';

import { useState } from 'react';
import CircumplexGrid from './CircumplexGrid';

interface EmotionalPoint {
  valencia: number;
  ativacao: number;
  timestamp?: Date;
  label?: string;
}

/**
 * Exemplo de uso do CircumplexGrid em um fluxo de check-in diário
 */
export function CircumplexGridExample() {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalPoint | null>(null);
  const [emotionalHistory, setEmotionalHistory] = useState<EmotionalPoint[]>([
    { valencia: 0.5, ativacao: 0.3, timestamp: new Date(Date.now() - 86400000 * 6), label: 'Alegre' },
    { valencia: 0.3, ativacao: -0.2, timestamp: new Date(Date.now() - 86400000 * 5), label: 'Calmo' },
    { valencia: -0.4, ativacao: 0.6, timestamp: new Date(Date.now() - 86400000 * 4), label: 'Ansioso' },
    { valencia: -0.2, ativacao: -0.5, timestamp: new Date(Date.now() - 86400000 * 3), label: 'Triste' },
    { valencia: 0.1, ativacao: 0.1, timestamp: new Date(Date.now() - 86400000 * 2), label: 'Neutro' },
    { valencia: 0.6, ativacao: 0.4, timestamp: new Date(Date.now() - 86400000), label: 'Animado' },
  ]);

  const handleEmotionSelect = (point: EmotionalPoint) => {
    setSelectedEmotion(point);
    console.log('Emoção selecionada:', point);
    
    // Adicionar ao histórico
    setEmotionalHistory(prev => [...prev, point]);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Check-in Emocional Diário</h1>
      <p className="text-gray-600 mb-6">
        Use o grid abaixo para registrar como você está se sentindo hoje
      </p>

      <CircumplexGrid
        width={500}
        height={500}
        onSelect={handleEmotionSelect}
        selectedPoint={selectedEmotion}
        historicalPoints={emotionalHistory}
        showLabels={true}
        interactive={true}
      />

      {selectedEmotion && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            ✅ Registro salvo com sucesso!
          </h3>
          <p className="text-sm text-green-700">
            Seu estado emocional foi registrado. Continue acompanhando sua trajetória emocional ao longo do tempo.
          </p>
        </div>
      )}

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📊 Histórico Emocional</h3>
        <p className="text-sm text-gray-600 mb-4">
          Os últimos {emotionalHistory.length} registros emocionais estão visualizados no grid acima.
          A linha tracejada mostra sua trajetória emocional ao longo do tempo.
        </p>
        
        <div className="space-y-2">
          {emotionalHistory.slice(-7).reverse().map((point, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="font-medium">{point.label}</span>
              <span className="text-gray-500">
                {point.timestamp?.toLocaleDateString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          📚 Sobre o Modelo Circumplex
        </h3>
        <p className="text-xs text-blue-700 leading-relaxed">
          Este modelo foi desenvolvido por James Russell (1980) e é amplamente utilizado
          em psicologia para medir estados emocionais em duas dimensões independentes:
          <strong> Valencia</strong> (negativo ↔ positivo) e <strong>Ativação</strong> (baixa energia ↔ alta energia).
          Esta abordagem permite capturar a complexidade das emoções de forma mais precisa
          do que escalas unidimensionais.
        </p>
      </div>
    </div>
  );
}

export default CircumplexGridExample;
