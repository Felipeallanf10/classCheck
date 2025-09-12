'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircumplexPosition } from '@/lib/psychometrics/circumplex-model';
import { VALIDATED_EMOTIONAL_STATES } from '@/lib/psychometrics/circumplex-model';

interface VisualizacaoCircumplexProps {
  posicaoAtual: CircumplexPosition & { confidence?: number };
  historico?: Array<{ questionId: string; response: number; timestamp: Date; informationGain: number }>;
  showDetails?: boolean;
  width?: number;
  height?: number;
}

const VisualizacaoCircumplex: React.FC<VisualizacaoCircumplexProps> = ({
  posicaoAtual,
  historico = [],
  showDetails = true,
  width = 400,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cores para diferentes quadrantes
  const getCoresQuadrante = (valence: number, arousal: number) => {
    if (valence > 0 && arousal > 0) return '#10B981'; // Verde - Prazer Alto + Ativação Alta
    if (valence > 0 && arousal < 0) return '#3B82F6'; // Azul - Prazer Alto + Ativação Baixa
    if (valence < 0 && arousal < 0) return '#6366F1'; // Índigo - Prazer Baixo + Ativação Baixa
    return '#EF4444'; // Vermelho - Prazer Baixo + Ativação Alta
  };

  // Desenhar o modelo circumplex
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    // Limpar canvas
    ctx.clearRect(0, 0, width, height);

    // Desenhar fundo com gradiente
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Desenhar círculos concêntricos
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 3, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Desenhar eixos
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    // Eixo horizontal (Valência)
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.stroke();
    // Eixo vertical (Ativação)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.stroke();

    // Desenhar labels dos eixos
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // Labels Valência
    ctx.fillText('Desagradável', centerX - radius + 20, centerY - 10);
    ctx.fillText('Agradável', centerX + radius - 20, centerY - 10);
    
    // Labels Ativação
    ctx.save();
    ctx.translate(centerX - 20, centerY - radius + 20);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Alta Ativação', 0, 0);
    ctx.restore();
    
    ctx.save();
    ctx.translate(centerX - 20, centerY + radius - 20);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Baixa Ativação', 0, 0);
    ctx.restore();

    // Desenhar estados emocionais validados
    if (Array.isArray(VALIDATED_EMOTIONAL_STATES)) {
      VALIDATED_EMOTIONAL_STATES.forEach((estado) => {
        const x = centerX + (estado.position.valence * radius);
        const y = centerY - (estado.position.arousal * radius);
        
        // Ponto do estado
        ctx.fillStyle = getCoresQuadrante(
          estado.position.valence, 
          estado.position.arousal
        );
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Label do estado
        ctx.fillStyle = '#374151';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(estado.name, x, y + 15);
      });
    }

    // Desenhar posição atual
    const currentX = centerX + (posicaoAtual.valence * radius);
    const currentY = centerY - (posicaoAtual.arousal * radius);
    
    // Círculo de confiança
    const confidenceRadius = Math.max(5, (1 - (posicaoAtual.confidence || 0.5)) * 30);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.beginPath();
    ctx.arc(currentX, currentY, confidenceRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Posição atual
    ctx.fillStyle = '#1D4ED8';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Desenhar trajetória se houver histórico
    if (historico.length > 1) {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      historico.forEach((ponto, index) => {
        // Calcular posição aproximada baseada na resposta
        const approxValence = (ponto.response - 3) / 2; // Aproximação
        const approxArousal = Math.sin(index * 0.5) * 0.3; // Aproximação
        const x = centerX + (approxValence * radius);
        const y = centerY - (approxArousal * radius);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

  }, [posicaoAtual, historico, width, height]);

  // Identificar quadrante atual
  const getQuadranteAtual = () => {
    const { valence, arousal } = posicaoAtual;
    if (valence > 0 && arousal > 0) return 'Entusiasmado';
    if (valence > 0 && arousal < 0) return 'Calmo';
    if (valence < 0 && arousal < 0) return 'Desanimado';
    return 'Agitado';
  };

  const getDescricaoQuadrante = () => {
    const quadrante = getQuadranteAtual();
    const descricoes = {
      'Entusiasmado': 'Alta energia positiva - Estado ideal para atividades desafiadoras',
      'Calmo': 'Bem-estar tranquilo - Estado ideal para reflexão e relaxamento',
      'Desanimado': 'Baixa energia - Pode indicar necessidade de descanso ou suporte',
      'Agitado': 'Alta energia negativa - Estado que pode se beneficiar de técnicas de regulação'
    };
    return descricoes[quadrante as keyof typeof descricoes];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          Modelo Circumplex - Posição Atual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Canvas do modelo */}
          <div className="flex-1 flex justify-center">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="border rounded-lg bg-white"
            />
          </div>

          {/* Detalhes da posição */}
          {showDetails && (
            <div className="lg:w-80 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Estado Atual</h3>
                <Badge 
                  className={`text-white ${getCoresQuadrante(posicaoAtual.valence, posicaoAtual.arousal) === '#10B981' ? 'bg-green-500' :
                    getCoresQuadrante(posicaoAtual.valence, posicaoAtual.arousal) === '#3B82F6' ? 'bg-blue-500' :
                    getCoresQuadrante(posicaoAtual.valence, posicaoAtual.arousal) === '#6366F1' ? 'bg-indigo-500' : 'bg-red-500'
                  }`}
                >
                  {getQuadranteAtual()}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  {getDescricaoQuadrante()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Valência</div>
                  <div className="font-semibold">
                    {posicaoAtual.valence > 0 ? '+' : ''}{posicaoAtual.valence.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {posicaoAtual.valence > 0 ? 'Agradável' : 'Desagradável'}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Ativação</div>
                  <div className="font-semibold">
                    {posicaoAtual.arousal > 0 ? '+' : ''}{posicaoAtual.arousal.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {posicaoAtual.arousal > 0 ? 'Alta' : 'Baixa'}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-900 font-medium">
                  Confiança da Avaliação
                </div>
                <div className="text-lg font-bold text-blue-700">
                  {Math.round((posicaoAtual.confidence || 0) * 100)}%
                </div>
                <div className="text-xs text-blue-600">
                  {(posicaoAtual.confidence || 0) > 0.8 ? 'Alta precisão' :
                   (posicaoAtual.confidence || 0) > 0.6 ? 'Precisão moderada' : 'Precisão baixa'}
                </div>
              </div>

              {historico.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Progresso</h4>
                  <div className="text-sm text-gray-600">
                    {historico.length} resposta{historico.length !== 1 ? 's' : ''} coletada{historico.length !== 1 ? 's' : ''}
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (historico.length / 12) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualizacaoCircumplex;
