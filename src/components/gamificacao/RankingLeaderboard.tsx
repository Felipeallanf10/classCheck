'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Star,
  Zap,
  Users,
  Calendar
} from 'lucide-react';

interface UsuarioRanking {
  id: string;
  nome: string;
  avatar: string;
  pontuacao: number;
  posicao: number;
  posicaoAnterior: number;
  nivel: number;
  experiencia: number;
  experienciaProximo: number;
  conquistas: number;
  participacaoSemanal: number;
  streak: number;
  classe: 'novato' | 'regular' | 'avancado' | 'expert' | 'mestre';
}

interface EstatisticasRanking {
  totalUsuarios: number;
  mediaGeral: number;
  topPerformers: number;
  crescimentoSemanal: number;
}

const RankingLeaderboard: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioRanking[]>([]);
  const [periodo, setPeriodo] = useState<'semanal' | 'mensal' | 'anual' | 'geral'>('semanal');
  const [categoria, setCategoria] = useState<'pontuacao' | 'participacao' | 'conquistas' | 'consistencia'>('pontuacao');
  const [usuarioAtual] = useState<string>('user-3'); // Simulando usuário logado
  const [estatisticas, setEstatisticas] = useState<EstatisticasRanking>({
    totalUsuarios: 0,
    mediaGeral: 0,
    topPerformers: 0,
    crescimentoSemanal: 0
  });

  useEffect(() => {
    // Simulando dados do ranking
    const usuariosData: UsuarioRanking[] = [
      {
        id: 'user-1',
        nome: 'Ana Silva',
        avatar: '/api/placeholder/40/40',
        pontuacao: 2850,
        posicao: 1,
        posicaoAnterior: 2,
        nivel: 15,
        experiencia: 2850,
        experienciaProximo: 3000,
        conquistas: 24,
        participacaoSemanal: 98,
        streak: 45,
        classe: 'mestre'
      },
      {
        id: 'user-2',
        nome: 'Carlos Mendes',
        avatar: '/api/placeholder/40/40',
        pontuacao: 2640,
        posicao: 2,
        posicaoAnterior: 1,
        nivel: 14,
        experiencia: 2640,
        experienciaProximo: 2800,
        conquistas: 22,
        participacaoSemanal: 94,
        streak: 32,
        classe: 'expert'
      },
      {
        id: 'user-3',
        nome: 'Você',
        avatar: '/api/placeholder/40/40',
        pontuacao: 2420,
        posicao: 3,
        posicaoAnterior: 4,
        nivel: 13,
        experiencia: 2420,
        experienciaProximo: 2600,
        conquistas: 18,
        participacaoSemanal: 89,
        streak: 28,
        classe: 'expert'
      },
      {
        id: 'user-4',
        nome: 'Maria Santos',
        avatar: '/api/placeholder/40/40',
        pontuacao: 2180,
        posicao: 4,
        posicaoAnterior: 3,
        nivel: 12,
        experiencia: 2180,
        experienciaProximo: 2400,
        conquistas: 16,
        participacaoSemanal: 85,
        streak: 21,
        classe: 'avancado'
      },
      {
        id: 'user-5',
        nome: 'João Oliveira',
        avatar: '/api/placeholder/40/40',
        pontuacao: 1950,
        posicao: 5,
        posicaoAnterior: 5,
        nivel: 11,
        experiencia: 1950,
        experienciaProximo: 2200,
        conquistas: 14,
        participacaoSemanal: 82,
        streak: 15,
        classe: 'avancado'
      },
      {
        id: 'user-6',
        nome: 'Luana Costa',
        avatar: '/api/placeholder/40/40',
        pontuacao: 1720,
        posicao: 6,
        posicaoAnterior: 7,
        nivel: 10,
        experiencia: 1720,
        experienciaProximo: 2000,
        conquistas: 12,
        participacaoSemanal: 78,
        streak: 12,
        classe: 'regular'
      },
      {
        id: 'user-7',
        nome: 'Pedro Lima',
        avatar: '/api/placeholder/40/40',
        pontuacao: 1580,
        posicao: 7,
        posicaoAnterior: 6,
        nivel: 9,
        experiencia: 1580,
        experienciaProximo: 1800,
        conquistas: 10,
        participacaoSemanal: 75,
        streak: 8,
        classe: 'regular'
      },
      {
        id: 'user-8',
        nome: 'Sofia Rodrigues',
        avatar: '/api/placeholder/40/40',
        pontuacao: 1340,
        posicao: 8,
        posicaoAnterior: 8,
        nivel: 8,
        experiencia: 1340,
        experienciaProximo: 1600,
        conquistas: 8,
        participacaoSemanal: 70,
        streak: 5,
        classe: 'regular'
      }
    ];

    setUsuarios(usuariosData);
    
    // Calculando estatísticas
    const stats: EstatisticasRanking = {
      totalUsuarios: usuariosData.length,
      mediaGeral: usuariosData.reduce((sum, u) => sum + u.pontuacao, 0) / usuariosData.length,
      topPerformers: usuariosData.filter(u => u.pontuacao > 2000).length,
      crescimentoSemanal: 12.5
    };
    
    setEstatisticas(stats);
  }, [periodo, categoria]);

  const getPosicaoTendencia = (atual: number, anterior: number) => {
    if (atual < anterior) return { icon: <TrendingUp className="h-4 w-4 text-green-500" />, tipo: 'subiu' };
    if (atual > anterior) return { icon: <TrendingDown className="h-4 w-4 text-red-500" />, tipo: 'desceu' };
    return { icon: <Minus className="h-4 w-4 text-gray-400" />, tipo: 'manteve' };
  };

  const getPosicaoIcon = (posicao: number) => {
    switch (posicao) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-600">#{posicao}</span>;
    }
  };

  const getClasseColor = (classe: string) => {
    switch (classe) {
      case 'novato': return 'bg-gray-100 text-gray-700';
      case 'regular': return 'bg-blue-100 text-blue-700';
      case 'avancado': return 'bg-purple-100 text-purple-700';
      case 'expert': return 'bg-orange-100 text-orange-700';
      case 'mestre': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const usuarioLogado = usuarios.find(u => u.id === usuarioAtual);

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.totalUsuarios}</p>
                <p className="text-sm text-gray-600">Participantes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{Math.round(estatisticas.mediaGeral)}</p>
                <p className="text-sm text-gray-600">Média Geral</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.topPerformers}</p>
                <p className="text-sm text-gray-600">Top Performers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">+{estatisticas.crescimentoSemanal}%</p>
                <p className="text-sm text-gray-600">Crescimento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sua Posição */}
      {usuarioLogado && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              Sua Posição Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getPosicaoIcon(usuarioLogado.posicao)}
                  <div>
                    <p className="font-bold text-lg">#{usuarioLogado.posicao}</p>
                    <div className="flex items-center space-x-1">
                      {getPosicaoTendencia(usuarioLogado.posicao, usuarioLogado.posicaoAnterior).icon}
                      <span className="text-sm text-gray-600">
                        vs. semana anterior
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-2xl font-bold text-blue-600">{usuarioLogado.pontuacao}</p>
                <p className="text-sm text-gray-600">Pontos Totais</p>
              </div>

              <div>
                <p className="text-lg font-bold">Nível {usuarioLogado.nivel}</p>
                <div className="mt-1">
                  <Progress 
                    value={(usuarioLogado.experiencia / usuarioLogado.experienciaProximo) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    {usuarioLogado.experiencia}/{usuarioLogado.experienciaProximo} XP
                  </p>
                </div>
              </div>

              <div>
                <Badge className={getClasseColor(usuarioLogado.classe)}>
                  {usuarioLogado.classe.toUpperCase()}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">
                  {usuarioLogado.streak} dias seguidos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium">Período:</label>
              <select 
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value as any)}
                className="ml-2 px-3 py-1 border rounded-md"
              >
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
                <option value="geral">Geral</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Categoria:</label>
              <select 
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as any)}
                className="ml-2 px-3 py-1 border rounded-md"
              >
                <option value="pontuacao">Pontuação</option>
                <option value="participacao">Participação</option>
                <option value="conquistas">Conquistas</option>
                <option value="consistencia">Consistência</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboard - {periodo.charAt(0).toUpperCase() + periodo.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usuarios.map((usuario, index) => (
              <div 
                key={usuario.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                  usuario.id === usuarioAtual ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12">
                    {getPosicaoIcon(usuario.posicao)}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  
                  <div>
                    <p className="font-semibold">{usuario.nome}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Badge className={getClasseColor(usuario.classe)} variant="outline">
                        {usuario.classe}
                      </Badge>
                      <span>Nível {usuario.nivel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="font-bold text-lg">{usuario.pontuacao}</p>
                    <p className="text-sm text-gray-600">Pontos</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-bold">{usuario.conquistas}</p>
                    <p className="text-sm text-gray-600">Conquistas</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <span className="font-bold">{usuario.streak}</span>
                    </div>
                    <p className="text-sm text-gray-600">Streak</p>
                  </div>
                  
                  <div className="flex items-center">
                    {getPosicaoTendencia(usuario.posicao, usuario.posicaoAnterior).icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingLeaderboard;
