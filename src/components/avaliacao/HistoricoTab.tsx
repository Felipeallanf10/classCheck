'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Search,
  Eye,
  FileText
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dados simulados de histórico
const historicoAvaliacoes = [
  {
    id: '1',
    data: '2025-10-10',
    hora: '14:30',
    contexto: 'geral',
    valenca: 0.7,
    ativacao: 0.6,
    emocaoPrincipal: 'Animado',
    tendencia: 'up'
  },
  {
    id: '2',
    data: '2025-10-03',
    hora: '10:15',
    contexto: 'geral',
    valenca: 0.5,
    ativacao: 0.3,
    emocaoPrincipal: 'Calmo',
    tendencia: 'stable'
  },
  {
    id: '3',
    data: '2025-09-26',
    hora: '16:45',
    contexto: 'geral',
    valenca: -0.3,
    ativacao: 0.4,
    emocaoPrincipal: 'Ansioso',
    tendencia: 'down'
  },
  {
    id: '4',
    data: '2025-09-19',
    hora: '11:00',
    contexto: 'geral',
    valenca: 0.6,
    ativacao: 0.7,
    emocaoPrincipal: 'Entusiasmado',
    tendencia: 'up'
  },
  {
    id: '5',
    data: '2025-09-12',
    hora: '09:30',
    contexto: 'geral',
    valenca: 0.2,
    ativacao: 0.2,
    emocaoPrincipal: 'Tranquilo',
    tendencia: 'stable'
  }
];

export function HistoricoTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroData, setFiltroData] = useState('todos');

  const getTrendIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getValencaBadge = (valenca: number) => {
    if (valenca > 0.3) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400">Positivo</Badge>;
    } else if (valenca < -0.3) {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400">Negativo</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">Neutro</Badge>;
    }
  };

  const formatData = (data: string) => {
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Filtrar avaliações
  const avaliacoesFiltradas = historicoAvaliacoes.filter(avaliacao => {
    const matchSearch = searchTerm === '' || 
      avaliacao.emocaoPrincipal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avaliacao.data.includes(searchTerm);
    
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-900 dark:text-blue-100">Total de Avaliações</CardDescription>
            <CardTitle className="text-3xl text-blue-950 dark:text-blue-50">
              {historicoAvaliacoes.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardDescription className="text-green-900 dark:text-green-100">Última Avaliação</CardDescription>
            <CardTitle className="text-lg text-green-950 dark:text-green-50">
              {formatData(historicoAvaliacoes[0].data)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <CardDescription className="text-purple-900 dark:text-purple-100">Emoção Frequente</CardDescription>
            <CardTitle className="text-lg text-purple-950 dark:text-purple-50">
              Animado
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por emoção ou data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroData} onValueChange={setFiltroData}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 3 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de avaliações */}
      <div className="space-y-4">
        {avaliacoesFiltradas.map((avaliacao) => (
          <Card key={avaliacao.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatData(avaliacao.data)}</span>
                    <span className="text-sm text-muted-foreground">{avaliacao.hora}</span>
                    {getTrendIcon(avaliacao.tendencia)}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {avaliacao.emocaoPrincipal}
                    </Badge>
                    {getValencaBadge(avaliacao.valenca)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Valência:</span>{' '}
                      <span className="font-medium">
                        {(avaliacao.valenca * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ativação:</span>{' '}
                      <span className="font-medium">
                        {(avaliacao.ativacao * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="ghost">
                    <FileText className="h-3 w-3 mr-2" />
                    Relatório
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mensagem quando não há resultados */}
      {avaliacoesFiltradas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma avaliação encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente usar outros termos de busca' : 'Você ainda não fez nenhuma avaliação'}
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Limpar Busca
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
