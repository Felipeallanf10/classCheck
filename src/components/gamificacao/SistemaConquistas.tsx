'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Medal, 
  Award, 
  Target, 
  Zap,
  Heart,
  BookOpen,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  Lock
} from 'lucide-react';

interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  icone: React.ReactNode;
  categoria: 'participacao' | 'desempenho' | 'colaboracao' | 'consistencia' | 'especial';
  nivel: 'bronze' | 'prata' | 'ouro' | 'platina';
  pontos: number;
  conquistada: boolean;
  progresso: number;
  progressoMaximo: number;
  dataConquista?: Date;
  raridade: 'comum' | 'raro' | 'epico' | 'lendario';
}

const SistemaConquistas: React.FC = () => {
  const [conquistas, setConquistas] = useState<Conquista[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroStatus, setFiltroStatus] = useState<string>('todas');

  useEffect(() => {
    // Simulando dados de conquistas
    const conquistasData: Conquista[] = [
      {
        id: 'primeiro-dia',
        nome: 'Primeiro Dia',
        descricao: 'Complete sua primeira avaliação socioemocional',
        icone: <Star className="h-6 w-6" />,
        categoria: 'participacao',
        nivel: 'bronze',
        pontos: 10,
        conquistada: true,
        progresso: 1,
        progressoMaximo: 1,
        dataConquista: new Date('2024-01-15'),
        raridade: 'comum'
      },
      {
        id: 'sequencia-7-dias',
        nome: 'Semana Dedicada',
        descricao: 'Participe de avaliações por 7 dias consecutivos',
        icone: <Calendar className="h-6 w-6" />,
        categoria: 'consistencia',
        nivel: 'prata',
        pontos: 50,
        conquistada: true,
        progresso: 7,
        progressoMaximo: 7,
        dataConquista: new Date('2024-01-22'),
        raridade: 'raro'
      },
      {
        id: 'mestre-emocoes',
        nome: 'Mestre das Emoções',
        descricao: 'Demonstre consistência emocional por 30 dias',
        icone: <Heart className="h-6 w-6" />,
        categoria: 'desempenho',
        nivel: 'ouro',
        pontos: 150,
        conquistada: false,
        progresso: 18,
        progressoMaximo: 30,
        raridade: 'epico'
      },
      {
        id: 'colaborador-exemplar',
        nome: 'Colaborador Exemplar',
        descricao: 'Ajude 5 colegas com feedback positivo',
        icone: <Users className="h-6 w-6" />,
        categoria: 'colaboracao',
        nivel: 'prata',
        pontos: 75,
        conquistada: false,
        progresso: 3,
        progressoMaximo: 5,
        raridade: 'raro'
      },
      {
        id: 'estudioso',
        nome: 'Estudioso Dedicado',
        descricao: 'Complete 50 atividades de aprendizado',
        icone: <BookOpen className="h-6 w-6" />,
        categoria: 'participacao',
        nivel: 'ouro',
        pontos: 100,
        conquistada: false,
        progresso: 32,
        progressoMaximo: 50,
        raridade: 'raro'
      },
      {
        id: 'inovador',
        nome: 'Inovador',
        descricao: 'Sugira 3 melhorias implementadas no sistema',
        icone: <Zap className="h-6 w-6" />,
        categoria: 'especial',
        nivel: 'platina',
        pontos: 300,
        conquistada: false,
        progresso: 1,
        progressoMaximo: 3,
        raridade: 'lendario'
      },
      {
        id: 'crescimento-continuo',
        nome: 'Crescimento Contínuo',
        descricao: 'Mantenha tendência positiva por 3 meses',
        icone: <TrendingUp className="h-6 w-6" />,
        categoria: 'desempenho',
        nivel: 'platina',
        pontos: 250,
        conquistada: false,
        progresso: 1,
        progressoMaximo: 3,
        raridade: 'epico'
      },
      {
        id: 'perfeccionista',
        nome: 'Perfeccionista',
        descricao: 'Obtenha pontuação máxima em 10 avaliações',
        icone: <Target className="h-6 w-6" />,
        categoria: 'desempenho',
        nivel: 'ouro',
        pontos: 200,
        conquistada: false,
        progresso: 6,
        progressoMaximo: 10,
        raridade: 'epico'
      }
    ];

    setConquistas(conquistasData);
  }, []);

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'participacao': return <Star className="h-4 w-4" />;
      case 'desempenho': return <Trophy className="h-4 w-4" />;
      case 'colaboracao': return <Users className="h-4 w-4" />;
      case 'consistencia': return <Calendar className="h-4 w-4" />;
      case 'especial': return <Award className="h-4 w-4" />;
      default: return <Medal className="h-4 w-4" />;
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'bronze': return 'bg-amber-600';
      case 'prata': return 'bg-gray-400';
      case 'ouro': return 'bg-yellow-500';
      case 'platina': return 'bg-blue-500';
      default: return 'bg-gray-600';
    }
  };

  const getRaridadeColor = (raridade: string) => {
    switch (raridade) {
      case 'comum': return 'border-gray-300';
      case 'raro': return 'border-blue-400';
      case 'epico': return 'border-purple-500';
      case 'lendario': return 'border-yellow-500 shadow-yellow-200 shadow-lg';
      default: return 'border-gray-300';
    }
  };

  const conquistasFiltradas = conquistas.filter(conquista => {
    const categoriaMatch = filtroCategoria === 'todas' || conquista.categoria === filtroCategoria;
    const statusMatch = filtroStatus === 'todas' || 
      (filtroStatus === 'conquistadas' && conquista.conquistada) ||
      (filtroStatus === 'em-progresso' && !conquista.conquistada);
    
    return categoriaMatch && statusMatch;
  });

  const totalConquistas = conquistas.length;
  const conquistasObtidas = conquistas.filter(c => c.conquistada).length;
  const pontosTotal = conquistas.filter(c => c.conquistada).reduce((sum, c) => sum + c.pontos, 0);

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{conquistasObtidas}/{totalConquistas}</p>
                <p className="text-sm text-gray-600">Conquistas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{pontosTotal}</p>
                <p className="text-sm text-gray-600">Pontos Totais</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Medal className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{Math.round((conquistasObtidas / totalConquistas) * 100)}%</p>
                <p className="text-sm text-gray-600">Progresso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium">Categoria:</label>
              <select 
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="ml-2 px-3 py-1 border rounded-md"
              >
                <option value="todas">Todas</option>
                <option value="participacao">Participação</option>
                <option value="desempenho">Desempenho</option>
                <option value="colaboracao">Colaboração</option>
                <option value="consistencia">Consistência</option>
                <option value="especial">Especial</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Status:</label>
              <select 
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="ml-2 px-3 py-1 border rounded-md"
              >
                <option value="todas">Todas</option>
                <option value="conquistadas">Conquistadas</option>
                <option value="em-progresso">Em Progresso</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Conquistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {conquistasFiltradas.map((conquista) => (
          <Card 
            key={conquista.id} 
            className={`relative ${getRaridadeColor(conquista.raridade)} border-2 transition-all hover:scale-105 ${
              conquista.conquistada ? '' : 'opacity-75'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${conquista.conquistada ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {conquista.conquistada ? (
                      <div className="text-green-600">
                        {conquista.icone}
                      </div>
                    ) : (
                      <div className="text-gray-400">
                        {conquista.icone}
                      </div>
                    )}
                  </div>
                  {!conquista.conquistada && (
                    <Lock className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  <div className={`px-2 py-1 rounded-full text-xs text-white ${getNivelColor(conquista.nivel)}`}>
                    {conquista.nivel.toUpperCase()}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {conquista.pontos} pts
                  </Badge>
                </div>
              </div>
              
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {conquista.nome}
                  {getCategoriaIcon(conquista.categoria)}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{conquista.descricao}</p>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {!conquista.conquistada ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{conquista.progresso}/{conquista.progressoMaximo}</span>
                  </div>
                  <Progress 
                    value={(conquista.progresso / conquista.progressoMaximo) * 100} 
                    className="h-2"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Conquistado em {conquista.dataConquista?.toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SistemaConquistas;
