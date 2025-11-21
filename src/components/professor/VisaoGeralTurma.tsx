import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

interface VisaoGeralTurmaProps {
  metricas: {
    totalAlunos: number;
    alunosCriticos: number;
    alunosAltoRisco: number;
    alunosMedioRisco: number;
    alunosBaixoRisco: number;
    thetaMedioTurma: number;
    totalAlertasAbertos: number;
    totalSessoesRealizadas: number;
  };
}

export function VisaoGeralTurma({ metricas }: VisaoGeralTurmaProps) {
  const alunosEmRisco = metricas.alunosCriticos + metricas.alunosAltoRisco;
  const percentualRisco = metricas.totalAlunos > 0
    ? ((alunosEmRisco / metricas.totalAlunos) * 100).toFixed(1)
    : '0';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Alunos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.totalAlunos}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {alunosEmRisco} em risco ({percentualRisco}%)
          </p>
        </CardContent>
      </Card>
      
      {/* Alertas Abertos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Alertas Abertos</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.totalAlertasAbertos}</div>
          <div className="flex gap-2 mt-1 text-xs">
            <span className="text-red-600">
              {metricas.alunosCriticos} críticos
            </span>
            <span className="text-orange-600">
              {metricas.alunosAltoRisco} altos
            </span>
          </div>
        </CardContent>
      </Card>
      
      {/* Theta Médio da Turma */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Theta Médio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metricas.thetaMedioTurma > 0 ? '+' : ''}
            {metricas.thetaMedioTurma.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {metricas.thetaMedioTurma > 0 
              ? '✓ Acima da média' 
              : metricas.thetaMedioTurma < -0.5
              ? '✗ Abaixo da média'
              : '○ Neutro'}
          </p>
        </CardContent>
      </Card>
      
      {/* Sessões Realizadas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Sessões Realizadas</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.totalSessoesRealizadas}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Média: {metricas.totalAlunos > 0 
              ? (metricas.totalSessoesRealizadas / metricas.totalAlunos).toFixed(1)
              : '0'} por aluno
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
