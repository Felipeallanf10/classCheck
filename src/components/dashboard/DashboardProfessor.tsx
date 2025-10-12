'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  Search
} from 'lucide-react';
import MetricasTurma from './MetricasTurma';
import TabelaAlunos from './TabelaAlunos';
import AlertasUrgentes from './AlertasUrgentes';

interface DashboardProfessorProps {
  turmaId?: string;
  professorId?: string;
}

interface AlunoStatus {
  id: string;
  nome: string;
  ultimaAvaliacao: Date;
  estadoAtual: {
    valencia: number;
    arousal: number;
    confianca: number;
    quadrante: 'q1' | 'q2' | 'q3' | 'q4';
  };
  tendencia: 'melhorando' | 'estavel' | 'deteriorando';
  risco: 'baixo' | 'medio' | 'alto';
  alertas: number;
}

interface MetricasGerais {
  totalAlunos: number;
  avaliacoesHoje: number;
  avaliacoesSemana: number;
  mediaGeralValencia: number;
  mediaGeralArousal: number;
  alunosRisco: number;
  alertasAtivos: number;
  tendenciaGeral: 'melhorando' | 'estavel' | 'deteriorando';
}

const DashboardProfessor: React.FC<DashboardProfessorProps> = ({
  turmaId = 'turma-001',
  professorId = 'prof-001'
}) => {
  const [metricas, setMetricas] = useState<MetricasGerais | null>(null);
  const [alunos, setAlunos] = useState<AlunoStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroRisco, setFiltroRisco] = useState<'todos' | 'baixo' | 'medio' | 'alto'>('todos');
  const [periodoAnalise, setPeriodoAnalise] = useState<'hoje' | 'semana' | 'mes'>('semana');

  // Dados mockados para demonstração
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const metricasMock: MetricasGerais = {
        totalAlunos: 28,
        avaliacoesHoje: 12,
        avaliacoesSemana: 84,
        mediaGeralValencia: 0.3,
        mediaGeralArousal: 0.1,
        alunosRisco: 3,
        alertasAtivos: 5,
        tendenciaGeral: 'melhorando'
      };

      const alunosMock: AlunoStatus[] = [
        {
          id: 'aluno-001',
          nome: 'Ana Silva',
          ultimaAvaliacao: new Date(Date.now() - 2 * 60 * 60 * 1000),
          estadoAtual: {
            valencia: 0.7,
            arousal: 0.4,
            confianca: 0.85,
            quadrante: 'q1'
          },
          tendencia: 'melhorando',
          risco: 'baixo',
          alertas: 0
        },
        {
          id: 'aluno-002',
          nome: 'Bruno Santos',
          ultimaAvaliacao: new Date(Date.now() - 30 * 60 * 1000),
          estadoAtual: {
            valencia: -0.6,
            arousal: 0.8,
            confianca: 0.92,
            quadrante: 'q4'
          },
          tendencia: 'deteriorando',
          risco: 'alto',
          alertas: 2
        },
        {
          id: 'aluno-003',
          nome: 'Carla Oliveira',
          ultimaAvaliacao: new Date(Date.now() - 1 * 60 * 60 * 1000),
          estadoAtual: {
            valencia: 0.2,
            arousal: -0.3,
            confianca: 0.78,
            quadrante: 'q2'
          },
          tendencia: 'estavel',
          risco: 'medio',
          alertas: 1
        }
      ];

      setMetricas(metricasMock);
      setAlunos(alunosMock);
      setLoading(false);
    };

    carregarDados();
  }, [turmaId, professorId, periodoAnalise]);

  const getCoresTendencia = (tendencia: string) => {
    const cores = {
      melhorando: 'text-green-600 bg-green-50',
      estavel: 'text-blue-600 bg-blue-50',
      deteriorando: 'text-red-600 bg-red-50'
    };
    return cores[tendencia as keyof typeof cores] || 'text-gray-600 bg-gray-50';
  };

  const getIconeTendencia = (tendencia: string) => {
    if (tendencia === 'melhorando') return <TrendingUp className="h-4 w-4" />;
    if (tendencia === 'deteriorando') return <AlertTriangle className="h-4 w-4" />;
    return <RefreshCw className="h-4 w-4" />;
  };

  const alunosFiltrados = alunos.filter(aluno => 
    filtroRisco === 'todos' || aluno.risco === filtroRisco
  );

  if (loading) {
    return (
      <div className="hidden sm:block min-h-screen bg-gray-50 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 sm:h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 sm:h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden sm:block min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Dashboard da Turma
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Visão geral do bem-estar socioemocional - Turma 8A
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">
                {periodoAnalise === 'hoje' ? 'Hoje' : 
                 periodoAnalise === 'semana' ? 'Esta Semana' : 'Este Mês'}
              </span>
              <span className="sm:hidden">
                {periodoAnalise === 'hoje' ? 'Hoje' : 
                 periodoAnalise === 'semana' ? 'Semana' : 'Mês'}
              </span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total de Alunos</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{metricas?.totalAlunos}</p>
                </div>
                <div className="h-8 w-8 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs sm:text-sm">
                <Badge variant="secondary" className="text-xs">
                  {metricas?.avaliacoesHoje} avaliações hoje
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Bem-estar Geral</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {((metricas?.mediaGeralValencia || 0) * 50 + 50).toFixed(0)}%
                  </p>
                </div>
                <div className="h-8 w-8 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                  <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs sm:text-sm">
                <Badge 
                  className={`text-xs ${getCoresTendencia(metricas?.tendenciaGeral || 'estavel')}`}
                >
                  {getIconeTendencia(metricas?.tendenciaGeral || 'estavel')}
                  <span className="ml-1 capitalize hidden sm:inline">{metricas?.tendenciaGeral}</span>
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Alunos em Risco</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-600">{metricas?.alunosRisco}</p>
                </div>
                <div className="h-8 w-8 sm:h-12 sm:w-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                  <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs sm:text-sm">
                <Badge variant="destructive" className="text-xs">
                  Requer atenção
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Alertas Ativos</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">{metricas?.alertasAtivos}</p>
                </div>
                <div className="h-8 w-8 sm:h-12 sm:w-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                  <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs sm:text-sm">
                <Badge variant="outline" className="text-xs text-orange-600">
                  Para revisar
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="overflow-x-auto">
          <Tabs defaultValue="visao-geral" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-10">
              <TabsTrigger value="visao-geral" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                <span className="hidden sm:inline">Visão Geral</span>
                <span className="sm:hidden">Geral</span>
              </TabsTrigger>
              <TabsTrigger value="alunos" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Alunos</TabsTrigger>
              <TabsTrigger value="alertas" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Alertas</TabsTrigger>
              <TabsTrigger value="relatorios" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                <span className="hidden sm:inline">Relatórios</span>
                <span className="sm:hidden">Rel.</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visao-geral" className="space-y-4 sm:space-y-6">
              <div className="overflow-x-auto">
                <div className="min-w-[600px] sm:min-w-0">
                  <MetricasTurma 
                    turmaId={turmaId}
                    periodo={periodoAnalise}
                    metricas={metricas}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alunos" className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-base sm:text-lg font-semibold">Lista de Alunos</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                    <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Buscar</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Filtrar: {filtroRisco}</span>
                    <span className="sm:hidden">{filtroRisco}</span>
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[600px] sm:min-w-0">
                  <TabelaAlunos 
                    alunos={alunosFiltrados}
                    onFiltrarRisco={setFiltroRisco}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alertas" className="space-y-4 sm:space-y-6">
              <AlertasUrgentes 
                turmaId={turmaId}
                alertas={alunos.filter(a => a.alertas > 0)}
              />
            </TabsContent>

            <TabsContent value="relatorios" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Relatórios Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <Button variant="outline" className="h-16 sm:h-20 flex-col text-xs sm:text-sm">
                      <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 mb-2" />
                      Relatório Semanal
                    </Button>
                    <Button variant="outline" className="h-16 sm:h-20 flex-col text-xs sm:text-sm">
                      <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 mb-2" />
                      Análise Longitudinal
                    </Button>
                    <Button variant="outline" className="h-16 sm:h-20 flex-col text-xs sm:text-sm">
                      <Users className="h-4 w-4 sm:h-6 sm:w-6 mb-2" />
                      Comparativo da Turma
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfessor;
