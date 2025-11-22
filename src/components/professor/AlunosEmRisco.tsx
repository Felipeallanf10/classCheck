'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Aluno {
  aluno: { id: number; nome: string; email: string };
  thetaMedio: number;
  confiancaMedia: number;
  tendencia: 'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE';
  totalSessoes: number;
  alertasAbertos: number;
  alertasVermelhos: number;
  alertasLaranjas: number;
  nivelRisco: 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  ultimaSessao: Date | null;
}

interface AlunosEmRiscoProps {
  alunos: Aluno[];
  userRole: 'PROFESSOR' | 'ADMIN';
}

export function AlunosEmRisco({ alunos, userRole }: AlunosEmRiscoProps) {
  const getBadgeVariant = (nivel: string) => {
    switch (nivel) {
      case 'CRITICO': return 'destructive';
      case 'ALTO': return 'destructive';
      case 'MEDIO': return 'default';
      default: return 'secondary';
    }
  };
  
  const getBadgeColor = (nivel: string) => {
    switch (nivel) {
      case 'CRITICO': return 'bg-red-600 text-white hover:bg-red-700';
      case 'ALTO': return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'MEDIO': return 'bg-yellow-500 text-white hover:bg-yellow-600';
      default: return 'bg-green-500 text-white hover:bg-green-600';
    }
  };
  
  const getTrendIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'CRESCENTE': 
        return (
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Crescente</span>
          </div>
        );
      case 'DECRESCENTE': 
        return (
          <div className="flex items-center gap-1 text-red-600">
            <TrendingDown className="h-4 w-4" />
            <span className="text-xs">Decrescente</span>
          </div>
        );
      default: 
        return (
          <div className="flex items-center gap-1 text-gray-500">
            <Minus className="h-4 w-4" />
            <span className="text-xs">Estável</span>
          </div>
        );
    }
  };
  
  if (alunos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alunos da Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum aluno encontrado nesta turma para o período selecionado.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alunos (Ordenados por Risco)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Mostrando {alunos.length} aluno{alunos.length !== 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead className="text-center">Theta Médio</TableHead>
                <TableHead className="text-center">Confiança</TableHead>
                <TableHead className="text-center">Tendência</TableHead>
                <TableHead className="text-center">Sessões</TableHead>
                <TableHead className="text-center">Alertas</TableHead>
                <TableHead className="text-center">Risco</TableHead>
                <TableHead className="text-center">Última Sessão</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alunos.map((aluno) => (
                <TableRow key={aluno.aluno.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{aluno.aluno.nome}</div>
                      <div className="text-xs text-muted-foreground">
                        {aluno.aluno.email}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className={`font-mono ${
                      aluno.thetaMedio > 0 ? 'text-green-600' : 
                      aluno.thetaMedio < -1 ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {aluno.thetaMedio > 0 ? '+' : ''}{aluno.thetaMedio.toFixed(2)}
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className="text-sm text-muted-foreground">
                      {(aluno.confiancaMedia * 100).toFixed(0)}%
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    {getTrendIcon(aluno.tendencia)}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Badge variant="outline">{aluno.totalSessoes}</Badge>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    {aluno.alertasAbertos > 0 ? (
                      <div className="flex flex-col gap-1 items-center">
                        <Badge variant="destructive">{aluno.alertasAbertos}</Badge>
                        <div className="text-xs text-muted-foreground">
                          {aluno.alertasVermelhos > 0 && `${aluno.alertasVermelhos} crítico${aluno.alertasVermelhos > 1 ? 's' : ''}`}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Badge className={getBadgeColor(aluno.nivelRisco)}>
                      {aluno.nivelRisco}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    {aluno.ultimaSessao ? (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(aluno.ultimaSessao), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Link 
                      href={userRole === 'ADMIN' 
                        ? `/admin/usuarios/${aluno.aluno.id}` 
                        : `/professor/aluno/${aluno.aluno.id}`
                      }
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Ver detalhes
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
