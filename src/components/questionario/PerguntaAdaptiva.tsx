'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Star } from 'lucide-react';
import { QuestionnaireQuestion } from '@/lib/psychometrics/adaptive-engine';

interface PerguntaAdaptivaProps {
  pergunta: QuestionnaireQuestion;
  onResposta: (valor: number) => void;
  isLoading?: boolean;
}

const PerguntaAdaptiva: React.FC<PerguntaAdaptivaProps> = ({
  pergunta,
  onResposta,
  isLoading = false
}) => {
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // Cores para diferentes tipos de pergunta
  const getCoresTipo = (tipo: string) => {
    const cores = {
      behavioral: 'bg-blue-100 text-blue-800',
      cognitive: 'bg-purple-100 text-purple-800',
      physiological: 'bg-green-100 text-green-800',
      social: 'bg-orange-100 text-orange-800',
      temporal: 'bg-indigo-100 text-indigo-800'
    };
    return cores[tipo as keyof typeof cores] || 'bg-gray-100 text-gray-800';
  };

  // Traduzir tipo para português
  const traduzirTipo = (tipo: string) => {
    const traducoes = {
      behavioral: 'Comportamental',
      cognitive: 'Cognitivo',
      physiological: 'Fisiológico',
      social: 'Social',
      temporal: 'Temporal'
    };
    return traducoes[tipo as keyof typeof traducoes] || tipo;
  };

  // Manipular seleção de resposta
  const handleSelecao = (valor: number) => {
    setRespostaSelecionada(valor);
  };

  // Confirmar resposta
  const confirmarResposta = () => {
    if (respostaSelecionada !== null) {
      onResposta(respostaSelecionada);
      setRespostaSelecionada(null);
    }
  };

  // Renderizar escala de resposta
  const renderEscalaResposta = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {pergunta.options.map((opcao, index) => (
          <div
            key={opcao.value}
            className="animate-in fade-in-50 slide-in-from-left-5"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Button
              variant={respostaSelecionada === opcao.value ? "default" : "outline"}
              className={`w-full p-4 h-auto text-left justify-start transition-all duration-200 ${
                respostaSelecionada === opcao.value 
                  ? 'ring-2 ring-blue-500 shadow-md' 
                  : 'hover:bg-gray-50 hover:shadow-sm'
              }`}
              onClick={() => handleSelecao(opcao.value)}
              disabled={isLoading}
            >
              <div className="flex items-center w-full">
                <div className="flex items-center mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < opcao.value 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <span className="font-medium">{opcao.label}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    Valência: {opcao.circumplexImpact.valence > 0 ? '+' : ''}{opcao.circumplexImpact.valence.toFixed(1)} | 
                    Ativação: {opcao.circumplexImpact.arousal > 0 ? '+' : ''}{opcao.circumplexImpact.arousal.toFixed(1)}
                  </div>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {opcao.value}
                </Badge>
              </div>
            </Button>
          </div>
        ))}
      </div>

      {/* Botão de confirmação */}
      {respostaSelecionada !== null && (
        <div className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
          <Button
            onClick={confirmarResposta}
            disabled={isLoading}
            className="w-full transition-all duration-200 hover:scale-105"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processando...
              </div>
            ) : (
              'Confirmar Resposta'
            )}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getCoresTipo(pergunta.type)}>
                {traduzirTipo(pergunta.type)}
              </Badge>
              <Badge variant="outline">
                Informação: {Math.round(pergunta.informationWeight * 100)}%
              </Badge>
            </div>
            <CardTitle className="text-lg leading-relaxed">
              {pergunta.text}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo(!showInfo)}
            className="transition-all duration-200 hover:bg-blue-50"
          >
            <HelpCircle className={`h-4 w-4 transition-transform duration-200 ${showInfo ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Informações científicas expandidas */}
        {showInfo && (
          <div className="bg-blue-50 p-4 rounded-lg mt-4 animate-in fade-in-50 slide-in-from-top-5 duration-300">
            <h4 className="font-semibold text-blue-900 mb-2">Base Científica:</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <div>
                <strong>Escalas Psicométricas:</strong>
                <ul className="list-disc list-inside ml-2">
                  {pergunta.psychometricBasis.map((escala, index) => (
                    <li key={index}>{escala}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Estados Discriminados:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {pergunta.discriminantStates.map((estado, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {estado}
                    </Badge>
                  ))}
                </div>
              </div>
              {pergunta.optimalContexts && pergunta.optimalContexts.length > 0 && (
                <div>
                  <strong>Contextos Ideais:</strong>
                  <span className="ml-2">{pergunta.optimalContexts.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Selecione a opção que melhor descreve como você se sente <strong>neste momento</strong>:
          </p>
          {renderEscalaResposta()}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerguntaAdaptiva;
