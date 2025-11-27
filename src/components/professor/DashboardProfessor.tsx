'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { VisaoGeralTurma } from './VisaoGeralTurma';
import { AlunosEmRisco } from './AlunosEmRisco';
import { VisaoGeralTurmaSkeleton } from './VisaoGeralTurmaSkeleton';
import { AlunosEmRiscoSkeleton } from './AlunosEmRiscoSkeleton';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardProfessorProps {
  professorId: number;
  userRole: 'PROFESSOR' | 'ADMIN';
}

export function DashboardProfessor({ professorId, userRole }: DashboardProfessorProps) {
  const [turmaId, setTurmaId] = useState<number | null>(null);
  const [periodo, setPeriodo] = useState<string>('mes');
  const { toast } = useToast();
  
  // Buscar turmas do professor
  const { data: turmas, isLoading: loadingTurmas, error: errorTurmas } = useQuery<any>({
    queryKey: ['turmas-professor', professorId],
    queryFn: async () => {
      const res = await fetch(`/api/professor/turmas?professorId=${professorId}`);
      if (!res.ok) throw new Error('Erro ao carregar turmas');
      return res.json();
    },
  });
  
  // Mostrar erro de turmas
  if (errorTurmas) {
    toast.error({
      title: 'Erro ao carregar turmas',
      description: (errorTurmas as Error).message,
    });
  }
  
  // Buscar métricas da turma selecionada
  const { data: dadosTurma, isLoading: loadingMetricas, error: errorMetricas } = useQuery<any>({
    queryKey: ['metricas-turma', turmaId, periodo],
    queryFn: async () => {
      const res = await fetch(`/api/professor/relatorios/turma?turmaId=${turmaId}&periodo=${periodo}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || 'Erro ao carregar métricas');
      }
      return res.json();
    },
    enabled: !!turmaId,
  });
  
  // Mostrar erro de métricas
  if (errorMetricas && turmaId) {
    toast.error({
      title: 'Erro ao carregar métricas',
      description: (errorMetricas as Error).message,
    });
  }
  
  // Auto-selecionar primeira turma quando carregar
  if (!turmaId && turmas?.sucesso && turmas.dados?.length > 0) {
    setTurmaId(turmas.dados[0].id);
  }
  
  if (loadingTurmas) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando turmas...</span>
      </div>
    );
  }
  
  if (!turmas?.sucesso || !turmas.dados || turmas.dados.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Você não tem turmas cadastradas ainda.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Turma</label>
            <Select 
              value={turmaId?.toString() || ''} 
              onValueChange={(v) => setTurmaId(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas.dados.map((turma: any) => (
                  <SelectItem key={turma.id} value={turma.id.toString()}>
                    {turma.nome} ({turma.codigo}) - {turma.materia}
                    <span className="text-xs text-muted-foreground ml-2">
                      ({turma.estatisticas.totalAlunos} aluno{turma.estatisticas.totalAlunos !== 1 ? 's' : ''})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Período</label>
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Última Semana</SelectItem>
                <SelectItem value="mes">Último Mês</SelectItem>
                <SelectItem value="3meses">Últimos 3 Meses</SelectItem>
                <SelectItem value="semestre">Último Semestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Métricas */}
      {turmaId && (
        <>
          {loadingMetricas ? (
            <>
              <VisaoGeralTurmaSkeleton />
              <AlunosEmRiscoSkeleton />
            </>
          ) : errorMetricas ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-destructive mb-2">Erro ao carregar dados</p>
                <p className="text-sm text-muted-foreground">
                  {(errorMetricas as Error).message}
                </p>
              </CardContent>
            </Card>
          ) : dadosTurma?.sucesso ? (
            <>
              <VisaoGeralTurma metricas={dadosTurma.dados.metricsGerais} />
              <AlunosEmRisco alunos={dadosTurma.dados.metricas} userRole={userRole} />
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum dado disponível para o período selecionado
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
