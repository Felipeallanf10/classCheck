# 🚀 SPRINT 3: Dashboard Professor Completo

**Branch**: `feature/professor-dashboard`  
**Prioridade**: 🔴 CRÍTICA  
**Esforço**: 12-14 horas  
**Prazo**: Semana 3

---

## 🎯 Objetivos

- ✅ Criar dashboard `/professor/relatorios`
- ✅ API `/api/professor/relatorios/turma`
- ✅ Visão geral da turma (theta médio, alunos em risco)
- ✅ Filtros por turma e período
- ✅ Tabela de alunos com nível de risco
- ✅ Gráficos agregados

---

## 📋 Tarefas

### 1. API `/api/professor/relatorios/turma/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { subDays, subMonths } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth();
    
    if (usuario.role !== 'PROFESSOR' && usuario.role !== 'ADMIN') {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const turmaId = Number(searchParams.get('turmaId'));
    const periodo = searchParams.get('periodo') || 'mes'; // semana | mes | 3meses | semestre
    
    // Calcular data início
    let dataInicio: Date;
    switch (periodo) {
      case 'semana':
        dataInicio = subDays(new Date(), 7);
        break;
      case '3meses':
        dataInicio = subMonths(new Date(), 3);
        break;
      case 'semestre':
        dataInicio = subMonths(new Date(), 6);
        break;
      default:
        dataInicio = subMonths(new Date(), 1);
    }
    
    // Buscar alunos da turma
    const alunos = await prisma.turmaAluno.findMany({
      where: { turmaId },
      include: {
        aluno: {
          include: {
            sessoes: {
              where: {
                status: 'COMPLETA',
                iniciadoEm: { gte: dataInicio },
              },
              select: {
                id: true,
                thetaEstimado: true,
                confianca: true,
                iniciadoEm: true,
              },
            },
            alertasSocioemocionais: {
              where: {
                status: { in: ['PENDENTE', 'EM_ANALISE'] },
                nivel: { in: ['VERMELHO', 'LARANJA'] },
              },
              select: {
                id: true,
                nivel: true,
                tipo: true,
              },
            },
          },
        },
      },
    });
    
    // Calcular métricas por aluno
    const metricas = alunos.map((turmaAluno) => {
      const sessoes = turmaAluno.aluno.sessoes;
      const alertas = turmaAluno.aluno.alertasSocioemocionais;
      
      const thetaMedio = sessoes.length > 0
        ? sessoes.reduce((sum, s) => sum + (s.thetaEstimado || 0), 0) / sessoes.length
        : 0;
      
      const confiancaMedia = sessoes.length > 0
        ? sessoes.reduce((sum, s) => sum + (s.confianca || 0), 0) / sessoes.length
        : 0;
      
      // Calcular tendência (última sessão vs primeira)
      let tendencia: 'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE' = 'ESTAVEL';
      if (sessoes.length >= 2) {
        const primeiroTheta = sessoes[0].thetaEstimado || 0;
        const ultimoTheta = sessoes[sessoes.length - 1].thetaEstimado || 0;
        const variacao = ultimoTheta - primeiroTheta;
        
        if (variacao > 0.3) tendencia = 'CRESCENTE';
        else if (variacao < -0.3) tendencia = 'DECRESCENTE';
      }
      
      // Calcular nível de risco
      let nivelRisco: 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO' = 'BAIXO';
      const alertasVermelhos = alertas.filter((a) => a.nivel === 'VERMELHO').length;
      const alertasLaranjas = alertas.filter((a) => a.nivel === 'LARANJA').length;
      
      if (alertasVermelhos > 0 || thetaMedio < -2) {
        nivelRisco = 'CRITICO';
      } else if (alertasLaranjas > 1 || thetaMedio < -1) {
        nivelRisco = 'ALTO';
      } else if (alertasLaranjas > 0 || thetaMedio < 0) {
        nivelRisco = 'MEDIO';
      }
      
      return {
        aluno: {
          id: turmaAluno.aluno.id,
          nome: turmaAluno.aluno.nome,
          email: turmaAluno.aluno.email,
        },
        thetaMedio: Number(thetaMedio.toFixed(3)),
        confiancaMedia: Number(confiancaMedia.toFixed(3)),
        tendencia,
        totalSessoes: sessoes.length,
        alertasAbertos: alertas.length,
        alertasVermelhos,
        alertasLaranjas,
        nivelRisco,
      };
    });
    
    // Métricas gerais da turma
    const metricsGerais = {
      totalAlunos: alunos.length,
      alunosCriticos: metricas.filter((m) => m.nivelRisco === 'CRITICO').length,
      alunosAltoRisco: metricas.filter((m) => m.nivelRisco === 'ALTO').length,
      alunosMedioRisco: metricas.filter((m) => m.nivelRisco === 'MEDIO').length,
      thetaMedioTurma: metricas.length > 0
        ? metricas.reduce((sum, m) => sum + m.thetaMedio, 0) / metricas.length
        : 0,
      totalAlertasAbertos: metricas.reduce((sum, m) => sum + m.alertasAbertos, 0),
    };
    
    return NextResponse.json({
      sucesso: true,
      dados: {
        metricsGerais,
        metricas: metricas.sort((a, b) => {
          const ordem = { CRITICO: 0, ALTO: 1, MEDIO: 2, BAIXO: 3 };
          return ordem[a.nivelRisco] - ordem[b.nivelRisco];
        }),
      },
    });
  } catch (erro) {
    console.error('[API Professor] Erro:', erro);
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
```

### 2. Página `/professor/relatorios/page.tsx`

```typescript
import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardProfessor } from '@/components/professor/DashboardProfessor';

export default async function ProfessorRelatoriosPage() {
  const usuario = await requireAuth();
  
  if (usuario.role !== 'PROFESSOR' && usuario.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Relatórios da Turma</h1>
      <DashboardProfessor professorId={usuario.id} />
    </div>
  );
}
```

### 3. Componente `src/components/professor/DashboardProfessor.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { VisaoGeralTurma } from './VisaoGeralTurma';
import { AlunosEmRisco } from './AlunosEmRisco';

interface DashboardProfessorProps {
  professorId: number;
}

export function DashboardProfessor({ professorId }: DashboardProfessorProps) {
  const [turmaId, setTurmaId] = useState<number | null>(null);
  const [periodo, setPeriodo] = useState<string>('mes');
  
  // Buscar turmas do professor
  const { data: turmas, isLoading: loadingTurmas } = useQuery({
    queryKey: ['turmas-professor', professorId],
    queryFn: async () => {
      const res = await fetch(`/api/professor/turmas?professorId=${professorId}`);
      return res.json();
    },
  });
  
  // Buscar métricas da turma selecionada
  const { data: dadosTurma, isLoading: loadingMetricas } = useQuery({
    queryKey: ['metricas-turma', turmaId, periodo],
    queryFn: async () => {
      const res = await fetch(`/api/professor/relatorios/turma?turmaId=${turmaId}&periodo=${periodo}`);
      return res.json();
    },
    enabled: !!turmaId,
  });
  
  if (loadingTurmas) {
    return <Spinner size="lg" />;
  }
  
  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Turma</label>
            <Select value={turmaId?.toString()} onValueChange={(v) => setTurmaId(Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas?.dados?.map((turma: any) => (
                  <SelectItem key={turma.id} value={turma.id.toString()}>
                    {turma.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
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
            <Spinner size="lg" />
          ) : dadosTurma?.sucesso ? (
            <>
              <VisaoGeralTurma metricas={dadosTurma.dados.metricsGerais} />
              <AlunosEmRisco alunos={dadosTurma.dados.metricas} />
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
```

### 4. Componente `src/components/professor/VisaoGeralTurma.tsx`

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, AlertTriangle, TrendingUp } from 'lucide-react';

interface VisaoGeralTurmaProps {
  metricas: {
    totalAlunos: number;
    alunosCriticos: number;
    alunosAltoRisco: number;
    alunosMedioRisco: number;
    thetaMedioTurma: number;
    totalAlertasAbertos: number;
  };
}

export function VisaoGeralTurma({ metricas }: VisaoGeralTurmaProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.totalAlunos}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {metricas.alunosCriticos + metricas.alunosAltoRisco} em risco
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Alertas Abertos</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.totalAlertasAbertos}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {metricas.alunosCriticos} críticos
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Theta Médio da Turma</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.thetaMedioTurma.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {metricas.thetaMedioTurma > 0 ? 'Acima da média' : 'Abaixo da média'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 5. Componente `src/components/professor/AlunosEmRisco.tsx`

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Link from 'next/link';

interface Aluno {
  aluno: { id: number; nome: string; email: string };
  thetaMedio: number;
  tendencia: 'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE';
  totalSessoes: number;
  alertasAbertos: number;
  nivelRisco: 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';
}

export function AlunosEmRisco({ alunos }: { alunos: Aluno[] }) {
  const getBadgeVariant = (nivel: string) => {
    switch (nivel) {
      case 'CRITICO': return 'destructive';
      case 'ALTO': return 'destructive';
      case 'MEDIO': return 'warning';
      default: return 'default';
    }
  };
  
  const getTrendIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'CRESCENTE': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'DECRESCENTE': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alunos (Ordenados por Risco)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Theta Médio</TableHead>
              <TableHead>Tendência</TableHead>
              <TableHead>Sessões</TableHead>
              <TableHead>Alertas</TableHead>
              <TableHead>Risco</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alunos.map((aluno) => (
              <TableRow key={aluno.aluno.id}>
                <TableCell>
                  <Link href={`/admin/usuarios/${aluno.aluno.id}`} className="hover:underline">
                    {aluno.aluno.nome}
                  </Link>
                </TableCell>
                <TableCell>{aluno.thetaMedio.toFixed(2)}</TableCell>
                <TableCell>{getTrendIcon(aluno.tendencia)}</TableCell>
                <TableCell>{aluno.totalSessoes}</TableCell>
                <TableCell>
                  {aluno.alertasAbertos > 0 && (
                    <Badge variant="destructive">{aluno.alertasAbertos}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(aluno.nivelRisco)}>
                    {aluno.nivelRisco}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

---

## ✅ Checklist de Validação

- [ ] API `/api/professor/relatorios/turma` funcional
- [ ] Acesso restrito a PROFESSOR/ADMIN
- [ ] Filtros de turma e período funcionam
- [ ] Métricas calculadas corretamente
- [ ] Alunos ordenados por risco
- [ ] Badges visuais (CRITICO, ALTO, MEDIO, BAIXO)
- [ ] Links para detalhes do aluno
- [ ] Performance < 2s com 50+ alunos
- [ ] Responsivo (mobile/desktop)

---

## 🔧 Comandos Git

```bash
git checkout develop
git pull origin develop
git checkout -b feature/professor-dashboard

# Criar arquivos acima

git add .
git commit -m "feat: criar dashboard completo para professores

- Criar API /api/professor/relatorios/turma com métricas agregadas
- Implementar cálculo automático de nível de risco (theta + alertas)
- Criar página /professor/relatorios com autenticação role-based
- Adicionar componente DashboardProfessor com filtros (turma, período)
- Criar VisaoGeralTurma com cards de estatísticas (alunos, alertas, theta médio)
- Criar AlunosEmRisco com tabela ordenada por risco
- Adicionar badges visuais para níveis de risco
- Implementar ícones de tendência (crescente, estável, decrescente)
- Otimizar queries Prisma com select e includes estratégicos
- Adicionar loading states e tratamento de erros

Closes #[issue]"

git push origin feature/professor-dashboard
```

---

**Próximo**: `SPRINT_04_REDIS_CACHING.md`
