'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface GraficoEvolucionEmocionalProps {
  responses: Array<{
    questionId: string;
    answer: number;
    timestamp: number;
  }>;
}

const GraficoEvolucionEmocional: React.FC<GraficoEvolucionEmocionalProps> = ({ responses }) => {
  // Processar dados para o gráfico
  const dadosGrafico = responses.map((resposta, index) => {
    // Aproximações baseadas na resposta (1-5 para valência e ativação)
    const valencia = (resposta.answer - 3) / 2; // Normalizar para -1 a 1
    const ativacao = Math.sin(index * 0.8) * 0.5 + (resposta.answer > 3 ? 0.3 : -0.3);
    
    return {
      pergunta: index + 1,
      valencia: valencia,
      ativacao: ativacao,
      resposta: resposta.answer,
      timestamp: resposta.timestamp
    };
  });

  // Dados para área chart (bem-estar geral)
  const dadosBemEstar = responses.map((resposta, index) => ({
    pergunta: index + 1,
    bemEstar: resposta.answer * 20, // Converter escala 1-5 para 0-100
  }));

  // Formatador personalizado para tooltip
  const formatarTooltip = (value: number, name: string) => {
    if (name === 'valencia') {
      return [value.toFixed(2), 'Valência (Agradabilidade)'];
    }
    if (name === 'ativacao') {
      return [value.toFixed(2), 'Ativação (Energia)'];
    }
    if (name === 'bemEstar') {
      return [`${value.toFixed(0)}%`, 'Bem-estar Geral'];
    }
    return [value, name];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Emocional Durante o Questionário</CardTitle>
        <p className="text-sm text-gray-600">
          Visualização das mudanças nas dimensões emocionais ao longo das respostas
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Gráfico de linha - Valência e Ativação */}
          <div>
            <h4 className="font-medium mb-4">Dimensões do Modelo Circumplex</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="pergunta" 
                    label={{ value: 'Pergunta', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    domain={[-1, 1]}
                    label={{ value: 'Score (-1 a +1)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={formatarTooltip}
                    labelFormatter={(value) => `Pergunta ${value}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="valencia" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="valencia"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ativacao" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    name="ativacao"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Valência (Agradabilidade)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Ativação (Energia)</span>
              </div>
            </div>
          </div>

          {/* Gráfico de área - Bem-estar geral */}
          <div>
            <h4 className="font-medium mb-4">Indicador Geral de Bem-estar</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dadosBemEstar}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="pergunta"
                    label={{ value: 'Pergunta', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    label={{ value: 'Bem-estar (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={formatarTooltip}
                    labelFormatter={(value) => `Pergunta ${value}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="bemEstar"
                    stroke="#10B981"
                    fill="url(#bemEstarGradient)"
                    strokeWidth={2}
                    name="bemEstar"
                  />
                  <defs>
                    <linearGradient id="bemEstarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resumo estatístico */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Valência Média</div>
              <div className="text-lg font-bold text-blue-700">
                {(dadosGrafico.reduce((acc, item) => acc + item.valencia, 0) / dadosGrafico.length).toFixed(2)}
              </div>
              <div className="text-xs text-blue-500">
                {dadosGrafico.reduce((acc, item) => acc + item.valencia, 0) / dadosGrafico.length > 0 ? 'Tendência Positiva' : 'Tendência Negativa'}
              </div>
            </div>
            
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-sm text-red-600 font-medium">Ativação Média</div>
              <div className="text-lg font-bold text-red-700">
                {(dadosGrafico.reduce((acc, item) => acc + item.ativacao, 0) / dadosGrafico.length).toFixed(2)}
              </div>
              <div className="text-xs text-red-500">
                {dadosGrafico.reduce((acc, item) => acc + item.ativacao, 0) / dadosGrafico.length > 0 ? 'Alta Energia' : 'Baixa Energia'}
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Bem-estar Médio</div>
              <div className="text-lg font-bold text-green-700">
                {(dadosBemEstar.reduce((acc, item) => acc + item.bemEstar, 0) / dadosBemEstar.length).toFixed(0)}%
              </div>
              <div className="text-xs text-green-500">
                {dadosBemEstar.reduce((acc, item) => acc + item.bemEstar, 0) / dadosBemEstar.length > 60 ? 'Acima da Média' : 'Abaixo da Média'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GraficoEvolucionEmocional;
