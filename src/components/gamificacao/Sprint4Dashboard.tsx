'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Importando componentes do Sprint 4
import SistemaConquistas from './SistemaConquistas';
import RankingLeaderboard from './RankingLeaderboard';
import SistemaPontuacao from './SistemaPontuacao';
import SistemaMissoes from './SistemaMissoes';
import PerfilGamificado from './PerfilGamificado';
import SistemaNotificacoes from './SistemaNotificacoes';

import { 
  Trophy, 
  Star, 
  Target, 
  Crown,
  Zap,
  Bell,
  User,
  TrendingUp,
  Calendar,
  Award,
  Users,
  BookOpen,
  Heart,
  Flame,
  Gift,
  Settings,
  BarChart3,
  Activity,
  CheckCircle
} from 'lucide-react';

interface DashboardStats {
  nivel: number;
  experiencia: number;
  experienciaProximo: number;
  pontosTotal: number;
  pontosHoje: number;
  ranking: number;
  conquistas: number;
  conquistasTotal: number;
  missoesAtivas: number;
  missoesConcluidas: number;
  streak: number;
  notificacoesNaoLidas: number;
  multiplicadorAtual: number;
  participacaoSemanal: number;
}

interface AtividadeRecente {
  id: string;
  tipo: 'conquista' | 'missao' | 'nivel' | 'pontos';
  descricao: string;
  valor: number | string;
  timestamp: Date;
  icone: React.ReactNode;
  cor: string;
}

interface ResumoGamificacao {
  statusGeral: 'excelente' | 'bom' | 'regular' | 'precisa-melhorar';
  pontosFortesFortes: string[];
  areasParaMelhoria: string[];
  proximasMetas: string[];
  recomendacoes: string[];
}

const Sprint4Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    nivel: 15,
    experiencia: 3240,
    experienciaProximo: 3500,
    pontosTotal: 3240,
    pontosHoje: 85,
    ranking: 3,
    conquistas: 18,
    conquistasTotal: 25,
    missoesAtivas: 4,
    missoesConcluidas: 24,
    streak: 32,
    notificacoesNaoLidas: 3,
    multiplicadorAtual: 1.5,
    participacaoSemanal: 94
  });

  const [atividadesRecentes, setAtividadesRecentes] = useState<AtividadeRecente[]>([]);
  const [resumoGamificacao, setResumoGamificacao] = useState<ResumoGamificacao>({
    statusGeral: 'excelente',
    pontosFortesFortes: ['Consistência', 'Participação Ativa', 'Colaboração'],
    areasParaMelhoria: ['Diversificação de Atividades', 'Engajamento Social'],
    proximasMetas: ['Alcançar Nível 16', 'Completar 5 missões esta semana', 'Manter streak por mais 13 dias'],
    recomendacoes: [
      'Continue mantendo sua sequência diária',
      'Explore novas missões disponíveis',
      'Participe mais dos desafios em grupo'
    ]
  });

  const [componenteAtivo, setComponenteAtivo] = useState<string>('dashboard');

  useEffect(() => {
    // Simulando atividades recentes
    const atividades: AtividadeRecente[] = [
      {
        id: 'ativ-1',
        tipo: 'conquista',
        descricao: 'Desbloqueou "Sequência Dourada"',
        valor: '30 dias',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icone: <Trophy className="h-4 w-4" />,
        cor: 'text-yellow-600'
      },
      {
        id: 'ativ-2',
        tipo: 'nivel',
        descricao: 'Subiu para Nível 15',
        valor: '+200 XP',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        icone: <Crown className="h-4 w-4" />,
        cor: 'text-purple-600'
      },
      {
        id: 'ativ-3',
        tipo: 'missao',
        descricao: 'Completou "Colaborador Exemplar"',
        valor: '+75 pts',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        icone: <Target className="h-4 w-4" />,
        cor: 'text-green-600'
      },
      {
        id: 'ativ-4',
        tipo: 'pontos',
        descricao: 'Avaliação matinal concluída',
        valor: '+25 pts',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        icone: <Star className="h-4 w-4" />,
        cor: 'text-blue-600'
      }
    ];

    setAtividadesRecentes(atividades);
  }, []);

  const progressoNivel = (stats.experiencia / stats.experienciaProximo) * 100;
  const progressoConquistas = (stats.conquistas / stats.conquistasTotal) * 100;
  const experienciaRestante = stats.experienciaProximo - stats.experiencia;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excelente': return 'text-green-600 bg-green-100';
      case 'bom': return 'text-blue-600 bg-blue-100';
      case 'regular': return 'text-yellow-600 bg-yellow-100';
      case 'precisa-melhorar': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatarTempo = (timestamp: Date) => {
    const agora = new Date();
    const diferenca = agora.getTime() - timestamp.getTime();
    const horas = Math.floor(diferenca / (1000 * 60 * 60));
    
    if (horas > 0) return `${horas}h atrás`;
    return 'Agora';
  };

  const renderComponente = () => {
    switch (componenteAtivo) {
      case 'conquistas': return <SistemaConquistas />;
      case 'ranking': return <RankingLeaderboard />;
      case 'pontuacao': return <SistemaPontuacao />;
      case 'missoes': return <SistemaMissoes />;
      case 'perfil': return <PerfilGamificado />;
      case 'notificacoes': return <SistemaNotificacoes />;
      default: return null;
    }
  };

  if (componenteAtivo !== 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setComponenteAtivo('dashboard')}
          >
            ← Voltar ao Dashboard
          </Button>
          
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            {stats.notificacoesNaoLidas > 0 && (
              <Badge className="bg-red-500 text-white">
                {stats.notificacoesNaoLidas}
              </Badge>
            )}
          </div>
        </div>
        
        {renderComponente()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header do Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Gamificação</h1>
          <p className="text-gray-600">Sistema completo de engajamento e progressão</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge className={getStatusColor(resumoGamificacao.statusGeral)}>
            Status: {resumoGamificacao.statusGeral.toUpperCase()}
          </Badge>
          
          <Button 
            variant="outline" 
            onClick={() => setComponenteAtivo('notificacoes')}
            className="relative"
          >
            <Bell className="h-4 w-4 mr-1" />
            Notificações
            {stats.notificacoesNaoLidas > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                {stats.notificacoesNaoLidas}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">Nível {stats.nivel}</p>
                <p className="text-sm text-gray-600">
                  {experienciaRestante} XP para próximo
                </p>
              </div>
              <Crown className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={progressoNivel} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.pontosTotal}</p>
                <p className="text-sm text-gray-600">
                  +{stats.pontosHoje} hoje
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-3">
              <Zap className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-sm">{stats.multiplicadorAtual}x multiplicador</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">#{stats.ranking}</p>
                <p className="text-sm text-gray-600">Ranking Geral</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-3">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm">Top 5% dos usuários</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.streak}</p>
                <p className="text-sm text-gray-600">Dias Seguidos</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-3">
              <Calendar className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm">{stats.participacaoSemanal}% esta semana</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Progresso e Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progresso Atual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progresso Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Conquistas</span>
                <span className="text-sm text-gray-600">{stats.conquistas}/{stats.conquistasTotal}</span>
              </div>
              <Progress value={progressoConquistas} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Missões Ativas</span>
                <span className="text-sm text-gray-600">{stats.missoesAtivas} em andamento</span>
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: stats.missoesAtivas }, (_, i) => (
                  <div key={i} className="flex-1 h-2 bg-green-200 rounded"></div>
                ))}
                {Array.from({ length: 6 - stats.missoesAtivas }, (_, i) => (
                  <div key={i} className="flex-1 h-2 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Participação Semanal</span>
                <span className="text-sm text-gray-600">{stats.participacaoSemanal}%</span>
              </div>
              <Progress value={stats.participacaoSemanal} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atividadesRecentes.map((atividade) => (
                <div 
                  key={atividade.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className={`p-2 rounded-lg bg-gray-100 ${atividade.cor}`}>
                    {atividade.icone}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{atividade.descricao}</p>
                    <p className="text-xs text-gray-500">{formatarTempo(atividade.timestamp)}</p>
                  </div>
                  <Badge variant="outline">{atividade.valor}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo e Recomendações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo de Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Resumo de Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-green-600 mb-2">Pontos Fortes</h4>
              <ul className="space-y-1">
                {resumoGamificacao.pontosFortesFortes.map((ponto, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                    {ponto}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-orange-600 mb-2">Áreas para Melhoria</h4>
              <ul className="space-y-1">
                {resumoGamificacao.areasParaMelhoria.map((area, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <Target className="h-3 w-3 text-orange-500 mr-2" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Próximas Metas e Recomendações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Próximas Metas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Metas Próximas</h4>
              <ul className="space-y-1">
                {resumoGamificacao.proximasMetas.map((meta, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    {meta}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Recomendações</h4>
              <ul className="space-y-1">
                {resumoGamificacao.recomendacoes.map((recomendacao, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <Gift className="h-3 w-3 text-purple-500 mr-2" />
                    {recomendacao}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acesso Rápido aos Componentes */}
      <Card>
        <CardHeader>
          <CardTitle>Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { id: 'conquistas', label: 'Conquistas', icone: <Trophy className="h-6 w-6" />, cor: 'bg-yellow-100 text-yellow-600' },
              { id: 'ranking', label: 'Ranking', icone: <Crown className="h-6 w-6" />, cor: 'bg-purple-100 text-purple-600' },
              { id: 'pontuacao', label: 'Pontuação', icone: <Star className="h-6 w-6" />, cor: 'bg-blue-100 text-blue-600' },
              { id: 'missoes', label: 'Missões', icone: <Target className="h-6 w-6" />, cor: 'bg-green-100 text-green-600' },
              { id: 'perfil', label: 'Perfil', icone: <User className="h-6 w-6" />, cor: 'bg-indigo-100 text-indigo-600' },
              { id: 'notificacoes', label: 'Notificações', icone: <Bell className="h-6 w-6" />, cor: 'bg-red-100 text-red-600' }
            ].map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => setComponenteAtivo(item.id)}
              >
                <div className={`p-2 rounded-lg ${item.cor}`}>
                  {item.icone}
                </div>
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sprint4Dashboard;
