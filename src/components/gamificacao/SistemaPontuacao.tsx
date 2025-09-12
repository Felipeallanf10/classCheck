'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Zap, 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  Plus,
  Minus,
  RotateCcw,
  Clock
} from 'lucide-react';

interface AtividadePontuacao {
  id: string;
  tipo: 'avaliacao' | 'participacao' | 'conquista' | 'bonus' | 'penalidade';
  descricao: string;
  pontos: number;
  multiplicador?: number;
  timestamp: Date;
  detalhes?: string;
}

interface EstatisticasPontuacao {
  pontosTotal: number;
  pontosHoje: number;
  pontosSemana: number;
  pontosMes: number;
  nivel: number;
  experienciaAtual: number;
  experienciaProximo: number;
  multiplicadorAtual: number;
  streak: number;
  melhorSequencia: number;
}

interface ConfiguracaoPontuacao {
  avaliacaoBase: number;
  participacaoBase: number;
  bonusConsistencia: number;
  penalidades: {
    inatividade: number;
    avaliacaoIncompleta: number;
  };
  multiplicadores: {
    streak7: number;
    streak30: number;
    weekendBonus: number;
    eveningBonus: number;
  };
}

const SistemaPontuacao: React.FC = () => {
  const [estatisticas, setEstatisticas] = useState<EstatisticasPontuacao>({
    pontosTotal: 2420,
    pontosHoje: 45,
    pontosSemana: 280,
    pontosMes: 890,
    nivel: 13,
    experienciaAtual: 2420,
    experienciaProximo: 2600,
    multiplicadorAtual: 1.5,
    streak: 28,
    melhorSequencia: 45
  });

  const [atividades, setAtividades] = useState<AtividadePontuacao[]>([]);
  const [configuracao] = useState<ConfiguracaoPontuacao>({
    avaliacaoBase: 20,
    participacaoBase: 10,
    bonusConsistencia: 5,
    penalidades: {
      inatividade: -10,
      avaliacaoIncompleta: -5
    },
    multiplicadores: {
      streak7: 1.2,
      streak30: 1.5,
      weekendBonus: 1.3,
      eveningBonus: 1.1
    }
  });

  const [filtroTempo, setFiltroTempo] = useState<'hoje' | 'semana' | 'mes' | 'tudo'>('semana');

  useEffect(() => {
    // Simulando histórico de atividades
    const atividadesData: AtividadePontuacao[] = [
      {
        id: '1',
        tipo: 'avaliacao',
        descricao: 'Avaliação Socioemocional Matinal',
        pontos: 30,
        multiplicador: 1.5,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        detalhes: 'Sequência de 28 dias ativa'
      },
      {
        id: '2',
        tipo: 'participacao',
        descricao: 'Participação em Discussão',
        pontos: 15,
        multiplicador: 1.5,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        detalhes: 'Contribuição positiva'
      },
      {
        id: '3',
        tipo: 'conquista',
        descricao: 'Conquista: Semana Dedicada',
        pontos: 50,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
        detalhes: '7 dias consecutivos'
      },
      {
        id: '4',
        tipo: 'bonus',
        descricao: 'Bônus de Final de Semana',
        pontos: 25,
        multiplicador: 1.3,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
        detalhes: 'Atividade no domingo'
      },
      {
        id: '5',
        tipo: 'avaliacao',
        descricao: 'Avaliação Socioemocional Vespertina',
        pontos: 20,
        multiplicador: 1.5,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      },
      {
        id: '6',
        tipo: 'participacao',
        descricao: 'Feedback para Colega',
        pontos: 10,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      },
      {
        id: '7',
        tipo: 'penalidade',
        descricao: 'Avaliação Incompleta',
        pontos: -5,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
        detalhes: 'Avaliação não finalizada'
      }
    ];

    setAtividades(atividadesData);
  }, []);

  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case 'avaliacao': return <Target className="h-4 w-4" />;
      case 'participacao': return <Star className="h-4 w-4" />;
      case 'conquista': return <Award className="h-4 w-4" />;
      case 'bonus': return <Plus className="h-4 w-4" />;
      case 'penalidade': return <Minus className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'avaliacao': return 'text-blue-600 bg-blue-100';
      case 'participacao': return 'text-yellow-600 bg-yellow-100';
      case 'conquista': return 'text-purple-600 bg-purple-100';
      case 'bonus': return 'text-green-600 bg-green-100';
      case 'penalidade': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatarTempo = (timestamp: Date) => {
    const agora = new Date();
    const diferenca = agora.getTime() - timestamp.getTime();
    const horas = Math.floor(diferenca / (1000 * 60 * 60));
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));

    if (dias > 0) return `${dias}d atrás`;
    if (horas > 0) return `${horas}h atrás`;
    return 'Agora';
  };

  const atividadesFiltradas = atividades.filter(atividade => {
    const agora = new Date();
    const timestamp = atividade.timestamp;
    
    switch (filtroTempo) {
      case 'hoje':
        return timestamp.toDateString() === agora.toDateString();
      case 'semana':
        const inicioSemana = new Date(agora);
        inicioSemana.setDate(agora.getDate() - 7);
        return timestamp >= inicioSemana;
      case 'mes':
        const inicioMes = new Date(agora);
        inicioMes.setDate(agora.getDate() - 30);
        return timestamp >= inicioMes;
      default:
        return true;
    }
  });

  const progressoNivel = (estatisticas.experienciaAtual / estatisticas.experienciaProximo) * 100;
  const experienciaRestante = estatisticas.experienciaProximo - estatisticas.experienciaAtual;

  return (
    <div className="space-y-6">
      {/* Dashboard Principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Nível e Experiência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">Nível {estatisticas.nivel}</p>
                  <p className="text-sm text-gray-600">
                    {estatisticas.experienciaAtual} / {estatisticas.experienciaProximo} XP
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">
                    {experienciaRestante} XP
                  </p>
                  <p className="text-sm text-gray-600">para próximo nível</p>
                </div>
              </div>
              
              <Progress value={progressoNivel} className="h-3" />
              
              <div className="flex items-center justify-between text-sm">
                <span>Progresso: {progressoNivel.toFixed(1)}%</span>
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-orange-500" />
                  Multiplicador: {estatisticas.multiplicadorAtual}x
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.pontosTotal}</p>
                <p className="text-sm text-gray-600">Total de Pontos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.streak}</p>
                <p className="text-sm text-gray-600">Dias Seguidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas por Período */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{estatisticas.pontosHoje}</p>
              <p className="text-sm text-gray-600">Pontos Hoje</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{estatisticas.pontosSemana}</p>
              <p className="text-sm text-gray-600">Pontos esta Semana</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{estatisticas.pontosMes}</p>
              <p className="text-sm text-gray-600">Pontos este Mês</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sistema de Pontuação */}
      <Card>
        <CardHeader>
          <CardTitle>Como Ganhar Pontos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Atividades Base</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    Avaliação Completa
                  </span>
                  <Badge variant="outline">{configuracao.avaliacaoBase} pts</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    Participação Ativa
                  </span>
                  <Badge variant="outline">{configuracao.participacaoBase} pts</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    Bônus Consistência
                  </span>
                  <Badge variant="outline">+{configuracao.bonusConsistencia} pts</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Multiplicadores</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                  <span>7 dias seguidos</span>
                  <Badge variant="outline">{configuracao.multiplicadores.streak7}x</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span>30 dias seguidos</span>
                  <Badge variant="outline">{configuracao.multiplicadores.streak30}x</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                  <span>Final de semana</span>
                  <Badge variant="outline">{configuracao.multiplicadores.weekendBonus}x</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Atividades */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Histórico de Pontuação
            </CardTitle>
            <div>
              <select 
                value={filtroTempo}
                onChange={(e) => setFiltroTempo(e.target.value as any)}
                className="px-3 py-1 border rounded-md"
              >
                <option value="hoje">Hoje</option>
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mês</option>
                <option value="tudo">Tudo</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {atividadesFiltradas.map((atividade) => (
              <div 
                key={atividade.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getCorPorTipo(atividade.tipo)}`}>
                    {getIconePorTipo(atividade.tipo)}
                  </div>
                  <div>
                    <p className="font-medium">{atividade.descricao}</p>
                    {atividade.detalhes && (
                      <p className="text-sm text-gray-600">{atividade.detalhes}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${
                      atividade.pontos > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {atividade.pontos > 0 ? '+' : ''}{atividade.pontos}
                    </span>
                    {atividade.multiplicador && atividade.multiplicador !== 1 && (
                      <Badge variant="outline" className="text-xs">
                        {atividade.multiplicador}x
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatarTempo(atividade.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SistemaPontuacao;
