'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  FileText,
  Eye
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface TabelaAlunosProps {
  alunos: AlunoStatus[];
  onFiltrarRisco: (risco: 'todos' | 'baixo' | 'medio' | 'alto') => void;
}

const TabelaAlunos: React.FC<TabelaAlunosProps> = ({ 
  alunos, 
  onFiltrarRisco 
}) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState<{
    campo: keyof AlunoStatus | 'ultimaAvaliacao' | 'risco';
    direcao: 'asc' | 'desc';
  }>({
    campo: 'nome',
    direcao: 'asc'
  });

  // Dados expandidos para demonstração
  const alunosExpandidos: AlunoStatus[] = [
    ...alunos,
    {
      id: 'aluno-004',
      nome: 'Diego Ferreira',
      ultimaAvaliacao: new Date(Date.now() - 4 * 60 * 60 * 1000),
      estadoAtual: {
        valencia: 0.5,
        arousal: -0.2,
        confianca: 0.88,
        quadrante: 'q2'
      },
      tendencia: 'estavel',
      risco: 'baixo',
      alertas: 0
    },
    {
      id: 'aluno-005',
      nome: 'Elena Costa',
      ultimaAvaliacao: new Date(Date.now() - 6 * 60 * 60 * 1000),
      estadoAtual: {
        valencia: -0.3,
        arousal: -0.5,
        confianca: 0.76,
        quadrante: 'q3'
      },
      tendencia: 'deteriorando',
      risco: 'medio',
      alertas: 1
    },
    {
      id: 'aluno-006',
      nome: 'Felipe Martins',
      ultimaAvaliacao: new Date(Date.now() - 45 * 60 * 1000),
      estadoAtual: {
        valencia: 0.8,
        arousal: 0.6,
        confianca: 0.94,
        quadrante: 'q1'
      },
      tendencia: 'melhorando',
      risco: 'baixo',
      alertas: 0
    },
    {
      id: 'aluno-007',
      nome: 'Gabriela Lima',
      ultimaAvaliacao: new Date(Date.now() - 8 * 60 * 60 * 1000),
      estadoAtual: {
        valencia: -0.7,
        arousal: 0.4,
        confianca: 0.82,
        quadrante: 'q4'
      },
      tendencia: 'deteriorando',
      risco: 'alto',
      alertas: 3
    }
  ];

  const alunosFiltrados = alunosExpandidos.filter(aluno =>
    aluno.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const alunosOrdenados = [...alunosFiltrados].sort((a, b) => {
    let valorA: string | number | Date | object = a[ordenacao.campo];
    let valorB: string | number | Date | object = b[ordenacao.campo];

    if (ordenacao.campo === 'ultimaAvaliacao') {
      valorA = a.ultimaAvaliacao.getTime();
      valorB = b.ultimaAvaliacao.getTime();
    }

    if (ordenacao.campo === 'risco') {
      const ordemRisco: Record<string, number> = { 'baixo': 1, 'medio': 2, 'alto': 3 };
      valorA = ordemRisco[a.risco];
      valorB = ordemRisco[b.risco];
    }

    // Só comparar se forem tipos comparáveis
    if (typeof valorA === 'string' && typeof valorB === 'string') {
      valorA = valorA.toLowerCase();
      valorB = valorB.toLowerCase();
    }

    // Garantir que estamos comparando valores primitivos
    const valA = typeof valorA === 'object' && valorA instanceof Date ? valorA.getTime() : valorA;
    const valB = typeof valorB === 'object' && valorB instanceof Date ? valorB.getTime() : valorB;

    if (ordenacao.direcao === 'asc') {
      return valA < valB ? -1 : valA > valB ? 1 : 0;
    } else {
      return valA > valB ? -1 : valA < valB ? 1 : 0;
    }
  });

  const getCorRisco = (risco: string) => {
    const cores = {
      baixo: 'bg-green-100 text-green-800',
      medio: 'bg-yellow-100 text-yellow-800',
      alto: 'bg-red-100 text-red-800'
    };
    return cores[risco as keyof typeof cores];
  };

  const getIconeTendencia = (tendencia: string) => {
    if (tendencia === 'melhorando') {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    if (tendencia === 'deteriorando') {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getNomeQuadrante = (quadrante: string) => {
    const nomes = {
      q1: 'Energizado+',
      q2: 'Calmo+',
      q3: 'Calmo-',
      q4: 'Energizado-'
    };
    return nomes[quadrante as keyof typeof nomes];
  };

  const getCorQuadrante = (quadrante: string) => {
    const cores = {
      q1: 'bg-green-100 text-green-800',
      q2: 'bg-blue-100 text-blue-800',
      q3: 'bg-orange-100 text-orange-800',
      q4: 'bg-red-100 text-red-800'
    };
    return cores[quadrante as keyof typeof cores];
  };

  const formatarValencia = (valencia: number) => {
    return `${((valencia + 1) * 50).toFixed(0)}%`;
  };

  const formatarArousal = (arousal: number) => {
    return `${((arousal + 1) * 50).toFixed(0)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Lista de Alunos ({alunosOrdenados.length})</CardTitle>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar aluno..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onFiltrarRisco('todos')}>
                  Todos os alunos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFiltrarRisco('alto')}>
                  Risco alto
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFiltrarRisco('medio')}>
                  Risco médio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFiltrarRisco('baixo')}>
                  Risco baixo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Aluno</TableHead>
                <TableHead>Estado Atual</TableHead>
                <TableHead>Valência</TableHead>
                <TableHead>Ativação</TableHead>
                <TableHead>Tendência</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Última Avaliação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alunosOrdenados.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{aluno.nome}</span>
                      {aluno.alertas > 0 && (
                        <div className="flex items-center mt-1">
                          <AlertTriangle className="h-3 w-3 text-orange-500 mr-1" />
                          <span className="text-xs text-orange-600">
                            {aluno.alertas} alerta{aluno.alertas > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={getCorQuadrante(aluno.estadoAtual.quadrante)}
                    >
                      {getNomeQuadrante(aluno.estadoAtual.quadrante)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatarValencia(aluno.estadoAtual.valencia)}
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ 
                            width: `${(aluno.estadoAtual.valencia + 1) * 50}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatarArousal(aluno.estadoAtual.arousal)}
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full" 
                          style={{ 
                            width: `${(aluno.estadoAtual.arousal + 1) * 50}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center">
                      {getIconeTendencia(aluno.tendencia)}
                      <span className="ml-2 capitalize">{aluno.tendencia}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getCorRisco(aluno.risco)}>
                      {aluno.risco}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {formatDistanceToNow(aluno.ultimaAvaliacao, {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </span>
                      <span className="text-xs text-gray-500">
                        Confiança: {Math.round(aluno.estadoAtual.confianca * 100)}%
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Relatório individual
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Enviar mensagem
                        </DropdownMenuItem>
                        {aluno.risco === 'alto' && (
                          <DropdownMenuItem className="text-red-600">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Criar alerta
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {alunosOrdenados.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum aluno encontrado</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
            </div>
          </div>
        )}

        {/* Resumo da tabela */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-red-500 rounded mr-2"></div>
              <span>Risco Alto: {alunosOrdenados.filter(a => a.risco === 'alto').length}</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-yellow-500 rounded mr-2"></div>
              <span>Risco Médio: {alunosOrdenados.filter(a => a.risco === 'medio').length}</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded mr-2"></div>
              <span>Risco Baixo: {alunosOrdenados.filter(a => a.risco === 'baixo').length}</span>
            </div>
            <div className="flex items-center ml-auto">
              <Clock className="h-4 w-4 mr-1" />
              <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TabelaAlunos;
