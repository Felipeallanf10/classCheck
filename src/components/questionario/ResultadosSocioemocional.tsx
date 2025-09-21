'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Trophy, 
  Target, 
  Brain, 
  Heart, 
  BarChart3, 
  Download, 
  Share2, 
  RefreshCw,
  Info,
  TrendingUp
} from 'lucide-react';
import VisualizacaoCircumplex from './VisualizacaoCircumplex';
import GraficoEvolucionEmocional from './GraficoEvolucionEmocional';
import RecomendacoesPersonalizadas from './RecomendacoesPersonalizadas';

interface ResultadoSocioemocionaalProps {
  resultado: any;
  onNovoQuestionario: () => void;
}

const ResultadosSocioemocional: React.FC<ResultadoSocioemocionaalProps> = ({
  resultado,
  onNovoQuestionario
}) => {
  const [abaSelecionada, setAbaSelecionada] = useState<'visao-geral' | 'detalhes' | 'recomendacoes'>('visao-geral');
  const [mostrarDetalhesCompletos, setMostrarDetalhesCompletos] = useState(false);

  if (!resultado) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Processando resultados...</p>
        </div>
      </div>
    );
  }

  // Interpretar nível de confiança
  const interpretarConfianca = (confianca: number) => {
    if (confianca >= 0.85) return { nivel: 'Muito Alta', cor: 'text-green-600', descricao: 'Resultados altamente confiáveis' };
    if (confianca >= 0.70) return { nivel: 'Alta', cor: 'text-blue-600', descricao: 'Resultados confiáveis' };
    if (confianca >= 0.55) return { nivel: 'Moderada', cor: 'text-yellow-600', descricao: 'Resultados moderadamente confiáveis' };
    return { nivel: 'Baixa', cor: 'text-red-600', descricao: 'Pode ser necessário questionário mais longo' };
  };

  // Obter estatísticas resumidas
  const estatisticas = {
    perguntasRespondidas: resultado.totalQuestions || 0,
    tempoMedio: '45s', // Seria calculado com base em timestamps reais
    estadoIdentificado: resultado.primaryState || 'Indeterminado',
    precisao: Math.round((resultado.confidence || 0) * 100)
  };

  const confiancaInfo = interpretarConfianca(resultado.confidence || 0);

  // Renderizar visão geral
  const renderVisaoGeral = () => (
    <div className="space-y-6">
      {/* Cartões de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estado Identificado</p>
                <p className="text-lg font-semibold">{estatisticas.estadoIdentificado}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confiança</p>
                <p className={`text-lg font-semibold ${confiancaInfo.cor}`}>
                  {estatisticas.precisao}%
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Perguntas</p>
                <p className="text-lg font-semibold">{estatisticas.perguntasRespondidas}/12</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eficiência</p>
                <p className="text-lg font-semibold">{estatisticas.tempoMedio}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de confiança */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Confiança {confiancaInfo.nivel}:</strong> {confiancaInfo.descricao}
          {resultado.confidence < 0.7 && (
            <span className="block mt-1 text-sm">
              Para aumentar a precisão, considere responder algumas perguntas adicionais.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Visualização principal */}
      <VisualizacaoCircumplex
        posicaoAtual={resultado.finalPosition}
        historico={resultado.responses}
        showDetails={true}
      />
    </div>
  );

  // Renderizar detalhes científicos
  const renderDetalhes = () => (
    <div className="space-y-6">
      {/* Métricas psicométricas */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Psicométricas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Posição no Modelo Circumplex</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Valência (Agradabilidade):</span>
                  <Badge variant="secondary">
                    {resultado.finalPosition?.valence?.toFixed(3) || 'N/A'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Ativação (Energia):</span>
                  <Badge variant="secondary">
                    {resultado.finalPosition?.arousal?.toFixed(3) || 'N/A'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Confiança Estatística:</span>
                  <Badge variant="secondary">
                    {((resultado.finalPosition?.confidence || 0) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Validação Científica</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Teórica:</span>
                  <Badge variant="outline">Russell (1980)</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Escala PANAS:</span>
                  <Badge variant="outline">Watson & Clark</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Algoritmo:</span>
                  <Badge variant="outline">IRT + Bayesiano</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de respostas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Histórico de Respostas</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarDetalhesCompletos(!mostrarDetalhesCompletos)}
            >
              {mostrarDetalhesCompletos ? 'Menos Detalhes' : 'Mais Detalhes'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resultado.responses?.map((resposta: any, index: number) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">Pergunta {index + 1}</Badge>
                  <Badge>Resposta: {resposta.answer}</Badge>
                </div>
                {mostrarDetalhesCompletos && (
                  <div className="text-sm text-gray-600">
                    <p>ID: {resposta.questionId}</p>
                    <p>Timestamp: {new Date(resposta.timestamp).toLocaleString()}</p>
                  </div>
                )}
              </div>
            )) || (
              <p className="text-gray-500">Nenhuma resposta registrada</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de evolução */}
      {resultado.responses && resultado.responses.length > 1 && (
        <GraficoEvolucionEmocional responses={resultado.responses} />
      )}
    </div>
  );

  // Renderizar recomendações
  const renderRecomendacoes = () => (
    <RecomendacoesPersonalizadas
      estadoAtual={resultado.primaryState}
      posicaoCircumplex={resultado.finalPosition}
      confianca={resultado.confidence}
    />
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header dos resultados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Resultados da Avaliação Socioemocional</CardTitle>
              <p className="text-gray-600 mt-2">
                Análise completa baseada no Modelo Circumplex de Russell
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Relatório PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button onClick={onNovoQuestionario} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Novo Questionário
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navegação por abas */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b">
            <div className="flex">
              {[
                { id: 'visao-geral', label: 'Visão Geral', icon: BarChart3 },
                { id: 'detalhes', label: 'Detalhes Científicos', icon: Brain },
                { id: 'recomendacoes', label: 'Recomendações', icon: Heart }
              ].map((aba) => {
                const Icon = aba.icon;
                return (
                  <button
                    key={aba.id}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      abaSelecionada === aba.id
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setAbaSelecionada(aba.id as any)}
                  >
                    <Icon className="h-4 w-4" />
                    {aba.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-6">
            {abaSelecionada === 'visao-geral' && renderVisaoGeral()}
            {abaSelecionada === 'detalhes' && renderDetalhes()}
            {abaSelecionada === 'recomendacoes' && renderRecomendacoes()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultadosSocioemocional;
