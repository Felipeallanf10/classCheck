'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Clock, 
  Users, 
  TrendingUp, 
  PlayCircle, 
  CheckCircle,
  BarChart3
} from 'lucide-react';
import QuestionarioSocioemocional from './QuestionarioSocioemocional';

interface AvaliacaoAulaProps {
  aulaId: string;
  professorId?: string;
  tituloAula?: string;
  duracao?: number;
  participantes?: number;
  onAvaliacaoCompleta?: (resultado: any) => void;
}

const AvaliacaoAula: React.FC<AvaliacaoAulaProps> = ({
  aulaId,
  professorId,
  tituloAula = 'Aula sem título',
  duracao = 0,
  participantes = 0,
  onAvaliacaoCompleta
}) => {
  const [etapa, setEtapa] = useState<'pre-aula' | 'questionario' | 'pos-aula' | 'completo'>('pre-aula');
  const [resultadoPreAula, setResultadoPreAula] = useState<any>(null);
  const [resultadoPosAula, setResultadoPosAula] = useState<any>(null);

  // Manipular avaliação pré-aula
  const handlePreAula = (resultado: any) => {
    setResultadoPreAula(resultado);
    setEtapa('pos-aula');
  };

  // Manipular avaliação pós-aula
  const handlePosAula = (resultado: any) => {
    setResultadoPosAula(resultado);
    setEtapa('completo');
    
    // Combinar resultados e notificar componente pai
    const avaliacaoCompleta = {
      aulaId,
      preAula: resultadoPreAula,
      posAula: resultado,
      mudancaEmocional: calcularMudancaEmocional(resultadoPreAula, resultado),
      timestamp: new Date().toISOString()
    };
    
    onAvaliacaoCompleta?.(avaliacaoCompleta);
  };

  // Calcular mudança emocional entre pré e pós aula
  const calcularMudancaEmocional = (pre: any, pos: any) => {
    if (!pre || !pos) return null;
    
    const mudancaValencia = pos.finalPosition.valence - pre.finalPosition.valence;
    const mudancaAtivacao = pos.finalPosition.arousal - pre.finalPosition.arousal;
    
    return {
      valencia: mudancaValencia,
      ativacao: mudancaAtivacao,
      magnitude: Math.sqrt(mudancaValencia ** 2 + mudancaAtivacao ** 2),
      direcao: mudancaValencia > 0 ? 'positiva' : 'negativa',
      significativa: Math.abs(mudancaValencia) > 0.3 || Math.abs(mudancaAtivacao) > 0.3
    };
  };

  // Renderizar introdução pré-aula
  const renderPreAula = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Avaliação Socioemocional - Pré-Aula
              </CardTitle>
              <p className="text-gray-600 mt-1">{tituloAula}</p>
            </div>
            <Badge variant="secondary">Antes da Aula</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-gray-600">Duração</div>
                <div className="font-medium">{duracao || 'N/A'} min</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm text-gray-600">Participantes</div>
                <div className="font-medium">{participantes || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-sm text-gray-600">Avaliação</div>
                <div className="font-medium">Pré-Aula</div>
              </div>
            </div>
          </div>

          <Alert className="mb-6">
            <AlertDescription>
              Esta avaliação captura seu estado emocional <strong>antes</strong> da aula começar.
              Responda com base em como você se sente neste momento.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={() => setEtapa('questionario')}
            className="w-full"
            size="lg"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Iniciar Avaliação Pré-Aula
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar transição pós-aula
  const renderPosAula = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Avaliação Pré-Aula Concluída
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-green-900 mb-2">Estado Emocional Inicial</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700">Estado Principal:</span>
                <span className="ml-2 font-medium">{resultadoPreAula?.primaryState}</span>
              </div>
              <div>
                <span className="text-green-700">Confiança:</span>
                <span className="ml-2 font-medium">
                  {Math.round((resultadoPreAula?.confidence || 0) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <Alert className="mb-6">
            <AlertDescription>
              Agora que a aula terminou, faça uma nova avaliação para capturar 
              possíveis mudanças no seu estado emocional.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={() => setEtapa('questionario')}
            className="w-full"
            size="lg"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Iniciar Avaliação Pós-Aula
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar resultados completos
  const renderCompleto = () => {
    const mudanca = calcularMudancaEmocional(resultadoPreAula, resultadoPosAula);
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Comparativo: Antes e Depois da Aula
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Estado pré-aula */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Antes da Aula</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Estado:</span>
                    <Badge variant="secondary">{resultadoPreAula?.primaryState}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Valência:</span>
                    <span>{resultadoPreAula?.finalPosition?.valence?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ativação:</span>
                    <span>{resultadoPreAula?.finalPosition?.arousal?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Estado pós-aula */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-3">Depois da Aula</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Estado:</span>
                    <Badge variant="secondary">{resultadoPosAula?.primaryState}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Valência:</span>
                    <span>{resultadoPosAula?.finalPosition?.valence?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ativação:</span>
                    <span>{resultadoPosAula?.finalPosition?.arousal?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Análise da mudança */}
            {mudanca && (
              <div className="mt-6 p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Análise da Mudança Emocional</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Direção:</span>
                    <Badge 
                      className={`ml-2 ${mudanca.direcao === 'positiva' ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {mudanca.direcao === 'positiva' ? 'Melhora' : 'Declínio'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Magnitude:</span>
                    <span className="ml-2 font-medium">{mudanca.magnitude.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Significativa:</span>
                    <span className="ml-2 font-medium">
                      {mudanca.significativa ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Button 
                onClick={() => {
                  setEtapa('pre-aula');
                  setResultadoPreAula(null);
                  setResultadoPosAula(null);
                }}
                variant="outline"
              >
                Nova Avaliação
              </Button>
              <Button onClick={() => window.print()}>
                Salvar Relatório
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render principal
  if (etapa === 'questionario') {
    return (
      <QuestionarioSocioemocional
        onComplete={resultadoPreAula ? handlePosAula : handlePreAula}
        contexto="aula"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {etapa === 'pre-aula' && renderPreAula()}
        {etapa === 'pos-aula' && renderPosAula()}
        {etapa === 'completo' && renderCompleto()}
      </div>
    </div>
  );
};

export default AvaliacaoAula;
