'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, BarChart3, CheckCircle } from 'lucide-react';
import { AdaptiveQuestionnaireEngine, type AdaptiveSession } from '@/lib/psychometrics/adaptive-engine';
import { CircumplexModel } from '@/lib/psychometrics/circumplex-model';
import PerguntaAdaptiva from './PerguntaAdaptiva';
import VisualizacaoCircumplex from './VisualizacaoCircumplex';
import ResultadosSocioemocional from './ResultadosSocioemocional';

interface QuestionarioSocioemocionalalProps {
  onComplete?: (resultado: any) => void;
  contexto?: 'aula' | 'geral' | 'avaliacao';
}

const QuestionarioSocioemocional: React.FC<QuestionarioSocioemocionalalProps> = ({
  onComplete,
  contexto = 'geral'
}) => {
  // Estados do componente
  const [motor] = useState(() => new AdaptiveQuestionnaireEngine());
  const [sessao, setSessao] = useState<AdaptiveSession | null>(null);
  const [etapaAtual, setEtapaAtual] = useState<'introducao' | 'questionario' | 'resultados'>('introducao');
  const [perguntaAtual, setPerguntaAtual] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  // Inicializar sessão
  useEffect(() => {
    // O motor já é inicializado no construtor
    setSessao(motor['session']); // Acesso interno para demonstração
    
    const proximaPergunta = motor.selectNextQuestion();
    setPerguntaAtual(proximaPergunta);
  }, [motor]);

  // Progresso do questionário
  const calcularProgresso = () => {
    if (!sessao) return 0;
    return Math.round((sessao.questionHistory.length / sessao.terminationCriteria.maxQuestions) * 100);
  };

  // Manipular resposta
  const handleResposta = async (valor: number) => {
    if (!sessao || !perguntaAtual) return;

    setIsLoading(true);

    try {
      // Registrar resposta
      motor.processResponse(perguntaAtual.id, valor);
      
      // Atualizar sessão (acessar internamente para demonstração)
      setSessao({...motor['session']});

      // Verificar se deve continuar
      const proximaPergunta = motor.selectNextQuestion();
      if (proximaPergunta) {
        setPerguntaAtual(proximaPergunta);
      } else {
        // Finalizar questionário
        const resultadoFinal = {
          finalPosition: sessao.estimatedPosition,
          confidence: sessao.confidenceMetrics.overall,
          totalQuestions: sessao.questionHistory.length,
          responses: sessao.questionHistory,
          primaryState: 'analyzed', // Seria calculado baseado na posição final
          timestamp: new Date().toISOString()
        };
        setResultado(resultadoFinal);
        setEtapaAtual('resultados');
        onComplete?.(resultadoFinal);
      }
    } catch (error) {
      console.error('Erro ao processar resposta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar questionário
  const iniciarQuestionario = () => {
    setEtapaAtual('questionario');
  };

  // Renderizar etapa de introdução
  const renderIntroducao = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          Questionário Socioemocional
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Este questionário utiliza o Modelo Circumplex de Russell para avaliar seu estado emocional atual
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Heart className="h-6 w-6 mx-auto text-red-500 mb-2" />
            <h3 className="font-semibold">Validado Cientificamente</h3>
            <p className="text-sm text-gray-600">
              Baseado em pesquisas de Russell (1980) e PANAS
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <BarChart3 className="h-6 w-6 mx-auto text-blue-500 mb-2" />
            <h3 className="font-semibold">Adaptativo</h3>
            <p className="text-sm text-gray-600">
              Perguntas personalizadas baseadas em suas respostas
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <CheckCircle className="h-6 w-6 mx-auto text-green-500 mb-2" />
            <h3 className="font-semibold">Rápido</h3>
            <p className="text-sm text-gray-600">
              Apenas 5-12 perguntas para resultados precisos
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Como funciona:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Responda às perguntas sobre como você se sente agora</li>
            <li>• O sistema adapta as próximas perguntas baseado em suas respostas</li>
            <li>• Receba insights sobre seu estado emocional atual</li>
            <li>• Visualize sua posição no modelo científico de emoções</li>
          </ul>
        </div>

        <Button 
          onClick={iniciarQuestionario}
          className="w-full"
          size="lg"
        >
          Iniciar Questionário
        </Button>
      </CardContent>
    </Card>
  );

  // Renderizar etapa do questionário
  const renderQuestionario = () => (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header com progresso */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Questionário Adaptativo</h2>
              <p className="text-gray-600">
                Pergunta {(sessao?.questionHistory.length || 0) + 1} • 
                Confiança: {Math.round((sessao?.confidenceMetrics.overall || 0) * 100)}%
              </p>
            </div>
            <Badge variant="secondary">
              {contexto === 'aula' ? 'Avaliação de Aula' : 'Avaliação Geral'}
            </Badge>
          </div>
          <Progress value={calcularProgresso()} className="h-2" />
        </CardContent>
      </Card>

      {/* Pergunta atual */}
      {perguntaAtual && (
        <PerguntaAdaptiva
          pergunta={perguntaAtual}
          onResposta={handleResposta}
          isLoading={isLoading}
        />
      )}

      {/* Visualização em tempo real */}
      {sessao && sessao.questionHistory.length > 0 && (
        <VisualizacaoCircumplex
          posicaoAtual={sessao.estimatedPosition}
          historico={sessao.questionHistory}
          showDetails={false}
        />
      )}
    </div>
  );

  // Renderizar etapa de resultados
  const renderResultados = () => (
    <ResultadosSocioemocional
      resultado={resultado}
      onNovoQuestionario={() => {
        setEtapaAtual('introducao');
        setSessao(null);
        setResultado(null);
        setPerguntaAtual(null);
      }}
    />
  );

  // Render principal
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {etapaAtual === 'introducao' && renderIntroducao()}
      {etapaAtual === 'questionario' && renderQuestionario()}
      {etapaAtual === 'resultados' && renderResultados()}
    </div>
  );
};

export default QuestionarioSocioemocional;
