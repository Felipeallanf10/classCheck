# 🚀 SPRINT 9: Dashboard Admin Completo

**Branch**: `feature/admin-dashboard-complete`  
**Esforço**: 14-16 horas (Sprint mais complexo)  
**Prazo**: Semana 9  
**Dependências**: Todos os Sprints anteriores (escalas, APIs, regras, cache)  

---

## 🎯 Objetivos do Sprint

- ✅ Dashboard `/admin/relatorios` com 5 seções analíticas
- ✅ Métricas de sistema (usuários, sessões, performance)
- ✅ Análise de questionários (taxa conclusão, eficácia IRT)
- ✅ Análise de alertas (distribuição, tempo resolução)
- ✅ Análise clínica agregada (PHQ-9, GAD-7, WHO-5 por faixa)
- ✅ Logs e auditoria (últimas 24h, filtros)
- ✅ Exportação CSV/JSON de relatórios
- ✅ Gráficos visuais (barras, pizza, linha, heatmap)
- ✅ Acesso restrito role ADMIN

---

## 📂 Estrutura da Dashboard

### Rota Principal: `src/app/admin/relatorios/page.tsx`

```typescript
import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { subDays, subMonths, subHours } from 'date-fns';

import { MetricasGerais } from '@/components/admin/MetricasGerais';
import { AnaliseQuestionarios } from '@/components/admin/AnaliseQuestionarios';
import { AnaliseAlertas } from '@/components/admin/AnaliseAlertas';
import { AnaliseClinica } from '@/components/admin/AnaliseClinica';
import { LogsAuditoria } from '@/components/admin/LogsAuditoria';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function RelatoriosAdminPage() {
  const usuario = await requireAuth();
  
  // Verificar role ADMIN
  if (usuario.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  
  // Buscar dados para cada seção
  const [metricas, questionarios, alertas, clinico, logs] = await Promise.all([
    buscarMetricasSistema(),
    buscarAnaliseQuestionarios(),
    buscarAnaliseAlertas(),
    buscarAnaliseClinica(),
    buscarLogsRecentes()
  ]);
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
        <ExportarRelatorioButton />
      </div>
      
      <Tabs defaultValue="metricas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="metricas">Métricas</TabsTrigger>
          <TabsTrigger value="questionarios">Questionários</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
          <TabsTrigger value="clinico">Análise Clínica</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metricas">
          <MetricasGerais dados={metricas} />
        </TabsContent>
        
        <TabsContent value="questionarios">
          <AnaliseQuestionarios dados={questionarios} />
        </TabsContent>
        
        <TabsContent value="alertas">
          <AnaliseAlertas dados={alertas} />
        </TabsContent>
        
        <TabsContent value="clinico">
          <AnaliseClinica dados={clinico} />
        </TabsContent>
        
        <TabsContent value="logs">
          <LogsAuditoria dados={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Funções de busca de dados
async function buscarMetricasSistema() {
  const agora = new Date();
  const inicio7d = subDays(agora, 7);
  const inicio30d = subDays(agora, 30);
  
  const [
    usuariosAtivos7d,
    usuariosTotal,
    sessoesCompletas30d,
    sessoesTotal,
    respostasTotal,
    tempoMedioResposta
  ] = await Promise.all([
    prisma.usuario.count({
      where: { ultimoAcesso: { gte: inicio7d } }
    }),
    prisma.usuario.count(),
    prisma.sessaoAdaptativa.count({
      where: {
        status: 'COMPLETA',
        createdAt: { gte: inicio30d }
      }
    }),
    prisma.sessaoAdaptativa.count(),
    prisma.respostaSocioemocional.count(),
    calcularTempoMedioResposta()
  ]);
  
  const sessoesIniciadas30d = await prisma.sessaoAdaptativa.count({
    where: { createdAt: { gte: inicio30d } }
  });
  
  const taxaConclusao = sessoesIniciadas30d > 0
    ? (sessoesCompletas30d / sessoesIniciadas30d) * 100
    : 0;
  
  return {
    usuariosAtivos7d,
    usuariosTotal,
    sessoesCompletas30d,
    sessoesTotal,
    respostasTotal,
    tempoMedioResposta,
    taxaConclusao
  };
}

async function calcularTempoMedioResposta(): Promise<number> {
  const sessoes = await prisma.sessaoAdaptativa.findMany({
    where: {
      status: 'COMPLETA',
      duracaoTotal: { not: null }
    },
    select: { duracaoTotal: true },
    take: 1000 // Últimas 1000 sessões
  });
  
  if (sessoes.length === 0) return 0;
  
  const media = sessoes.reduce((acc, s) => acc + (s.duracaoTotal || 0), 0) / sessoes.length;
  return Math.round(media / 1000); // Converter ms → s
}

async function buscarAnaliseQuestionarios() {
  const inicio30d = subDays(new Date(), 30);
  
  // Taxa conclusão por tipo
  const porTipo = await prisma.sessaoAdaptativa.groupBy({
    by: ['questionarioId'],
    where: { createdAt: { gte: inicio30d } },
    _count: { id: true },
    _avg: { duracaoTotal: true }
  });
  
  const detalhes = await Promise.all(
    porTipo.map(async (item) => {
      const questionario = await prisma.questionarioAdaptativo.findUnique({
        where: { id: item.questionarioId },
        select: { nome: true, tipo: true }
      });
      
      const completas = await prisma.sessaoAdaptativa.count({
        where: {
          questionarioId: item.questionarioId,
          status: 'COMPLETA',
          createdAt: { gte: inicio30d }
        }
      });
      
      return {
        nome: questionario?.nome || 'Desconhecido',
        tipo: questionario?.tipo || 'N/A',
        totalIniciadas: item._count.id,
        totalCompletas: completas,
        taxaConclusao: (completas / item._count.id) * 100,
        tempoMedio: Math.round((item._avg.duracaoTotal || 0) / 1000)
      };
    })
  );
  
  // Perguntas mais respondidas
  const perguntasMaisRespondidas = await prisma.respostaSocioemocional.groupBy({
    by: ['perguntaBancoId'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10
  });
  
  // Eficácia IRT (convergência)
  const logsConvergencia = await prisma.logAdaptativo.findMany({
    where: {
      tipo: 'CONVERGENCIA',
      createdAt: { gte: inicio30d }
    },
    select: { detalhes: true }
  });
  
  const convergencias = logsConvergencia.filter(
    log => (log.detalhes as any)?.convergiu === true
  );
  
  const taxaConvergencia = logsConvergencia.length > 0
    ? (convergencias.length / logsConvergencia.length) * 100
    : 0;
  
  return {
    porTipo: detalhes,
    perguntasMaisRespondidas,
    taxaConvergencia
  };
}

async function buscarAnaliseAlertas() {
  const inicio30d = subDays(new Date(), 30);
  
  // Distribuição por nível e status
  const distribuicao = await prisma.alertaSocioemocional.groupBy({
    by: ['nivel', 'status'],
    where: { createdAt: { gte: inicio30d } },
    _count: { id: true }
  });
  
  // Tempo médio de resolução
  const alertasResolvidos = await prisma.alertaSocioemocional.findMany({
    where: {
      status: 'RESOLVIDO',
      createdAt: { gte: inicio30d },
      resolvidoEm: { not: null }
    },
    select: { createdAt: true, resolvidoEm: true }
  });
  
  const temposResolucao = alertasResolvidos.map(a => {
    const diff = new Date(a.resolvidoEm!).getTime() - new Date(a.createdAt).getTime();
    return diff / (1000 * 60 * 60); // Converter para horas
  });
  
  const tempoMedioResolucao = temposResolucao.length > 0
    ? temposResolucao.reduce((a, b) => a + b, 0) / temposResolucao.length
    : 0;
  
  // Alertas não tratados > 7 dias
  const naoTratados = await prisma.alertaSocioemocional.count({
    where: {
      status: 'PENDENTE',
      createdAt: { lt: subDays(new Date(), 7) }
    }
  });
  
  // Distribuição por tipo
  const porTipo = await prisma.alertaSocioemocional.groupBy({
    by: ['tipo'],
    where: { createdAt: { gte: inicio30d } },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } }
  });
  
  return {
    distribuicao,
    tempoMedioResolucao,
    naoTratados,
    porTipo
  };
}

async function buscarAnaliseClinica() {
  const inicio30d = subDays(new Date(), 30);
  
  // Buscar respostas de escalas clínicas
  const respostasPHQ9 = await buscarRespostasEscala('PHQ9', inicio30d);
  const respostasGAD7 = await buscarRespostasEscala('GAD7', inicio30d);
  const respostasWHO5 = await buscarRespostasEscala('WHO5', inicio30d);
  
  return {
    phq9: calcularDistribuicaoPHQ9(respostasPHQ9),
    gad7: calcularDistribuicaoGAD7(respostasGAD7),
    who5: calcularDistribuicaoWHO5(respostasWHO5),
    totalAvaliacoes: respostasPHQ9.length + respostasGAD7.length + respostasWHO5.length
  };
}

async function buscarRespostasEscala(prefixo: string, dataInicio: Date) {
  return prisma.respostaSocioemocional.findMany({
    where: {
      pergunta: {
        texto: { contains: prefixo }
      },
      sessao: {
        status: 'COMPLETA',
        createdAt: { gte: dataInicio }
      }
    },
    include: {
      pergunta: { select: { texto: true, categoria: true } },
      sessao: { select: { usuarioId: true } }
    }
  });
}

function calcularDistribuicaoPHQ9(respostas: any[]) {
  // Agrupar por sessão e calcular score total
  const scoresPorSessao = new Map<string, number>();
  
  respostas.forEach(r => {
    const sessaoId = r.sessaoId;
    if (!scoresPorSessao.has(sessaoId)) scoresPorSessao.set(sessaoId, 0);
    scoresPorSessao.set(sessaoId, scoresPorSessao.get(sessaoId)! + r.valor);
  });
  
  const scores = Array.from(scoresPorSessao.values());
  
  return {
    minimo: scores.filter(s => s <= 4).length,
    leve: scores.filter(s => s >= 5 && s <= 9).length,
    moderado: scores.filter(s => s >= 10 && s <= 14).length,
    moderadoSevero: scores.filter(s => s >= 15 && s <= 19).length,
    severo: scores.filter(s => s >= 20).length,
    total: scores.length
  };
}

function calcularDistribuicaoGAD7(respostas: any[]) {
  const scoresPorSessao = new Map<string, number>();
  
  respostas.forEach(r => {
    const sessaoId = r.sessaoId;
    if (!scoresPorSessao.has(sessaoId)) scoresPorSessao.set(sessaoId, 0);
    scoresPorSessao.set(sessaoId, scoresPorSessao.get(sessaoId)! + r.valor);
  });
  
  const scores = Array.from(scoresPorSessao.values());
  
  return {
    minimo: scores.filter(s => s <= 4).length,
    leve: scores.filter(s => s >= 5 && s <= 9).length,
    moderado: scores.filter(s => s >= 10 && s <= 14).length,
    severo: scores.filter(s => s >= 15).length,
    total: scores.length
  };
}

function calcularDistribuicaoWHO5(respostas: any[]) {
  const scoresPorSessao = new Map<string, number>();
  
  respostas.forEach(r => {
    const sessaoId = r.sessaoId;
    if (!scoresPorSessao.has(sessaoId)) scoresPorSessao.set(sessaoId, 0);
    scoresPorSessao.set(sessaoId, scoresPorSessao.get(sessaoId)! + r.valor);
  });
  
  const scores = Array.from(scoresPorSessao.values()).map(s => s * 4); // 0-25 → 0-100
  
  return {
    bemEstarBaixo: scores.filter(s => s < 50).length, // < 50 indica depressão
    bemEstarNormal: scores.filter(s => s >= 50).length,
    total: scores.length
  };
}

async function buscarLogsRecentes() {
  const logs = await prisma.logAdaptativo.findMany({
    where: {
      createdAt: { gte: subHours(new Date(), 24) }
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      sessao: {
        select: {
          usuario: { select: { nome: true } }
        }
      }
    }
  });
  
  return logs;
}
```

---

## 🧩 Componentes Visuais

### Componente 1: `src/components/admin/MetricasGerais.tsx`

```typescript
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Activity, CheckCircle, Clock } from 'lucide-react';

interface MetricasGeraisProps {
  dados: {
    usuariosAtivos7d: number;
    usuariosTotal: number;
    sessoesCompletas30d: number;
    sessoesTotal: number;
    respostasTotal: number;
    tempoMedioResposta: number;
    taxaConclusao: number;
  };
}

export function MetricasGerais({ dados }: MetricasGeraisProps) {
  const metricas = [
    {
      titulo: 'Usuários Ativos (7d)',
      valor: dados.usuariosAtivos7d,
      total: dados.usuariosTotal,
      icone: Users,
      cor: 'text-blue-500'
    },
    {
      titulo: 'Sessões Completas (30d)',
      valor: dados.sessoesCompletas30d,
      total: dados.sessoesTotal,
      icone: CheckCircle,
      cor: 'text-green-500'
    },
    {
      titulo: 'Taxa de Conclusão',
      valor: `${dados.taxaConclusao.toFixed(1)}%`,
      total: null,
      icone: Activity,
      cor: 'text-purple-500'
    },
    {
      titulo: 'Tempo Médio de Resposta',
      valor: `${dados.tempoMedioResposta}s`,
      total: null,
      icone: Clock,
      cor: 'text-orange-500'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricas.map((metrica, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {metrica.titulo}
                </p>
                <h3 className="text-3xl font-bold mt-2">{metrica.valor}</h3>
                {metrica.total !== null && (
                  <p className="text-xs text-muted-foreground mt-1">
                    de {metrica.total} total
                  </p>
                )}
              </div>
              <metrica.icone className={`w-12 h-12 ${metrica.cor} opacity-80`} />
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Estatísticas Globais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total de Respostas</span>
              <span className="font-semibold">{dados.respostasTotal.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sessões por Usuário (média)</span>
              <span className="font-semibold">
                {(dados.sessoesTotal / dados.usuariosTotal).toFixed(1)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Componente 2: `src/components/admin/AnaliseQuestionarios.tsx`

```typescript
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnaliseQuestionariosProps {
  dados: {
    porTipo: Array<{
      nome: string;
      tipo: string;
      totalIniciadas: number;
      totalCompletas: number;
      taxaConclusao: number;
      tempoMedio: number;
    }>;
    taxaConvergencia: number;
  };
}

export function AnaliseQuestionarios({ dados }: AnaliseQuestionariosProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Conclusão por Questionário</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.porTipo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis label={{ value: 'Taxa (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="taxaConclusao" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes por Questionário</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Questionário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Iniciadas</TableHead>
                <TableHead>Completas</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Tempo Médio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.porTipo.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell><Badge variant="outline">{item.tipo}</Badge></TableCell>
                  <TableCell>{item.totalIniciadas}</TableCell>
                  <TableCell>{item.totalCompletas}</TableCell>
                  <TableCell>
                    <Badge variant={item.taxaConclusao >= 80 ? 'success' : 'secondary'}>
                      {item.taxaConclusao.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>{item.tempoMedio}s</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Eficácia do Algoritmo IRT</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Convergência</p>
              <p className="text-3xl font-bold mt-2">{dados.taxaConvergencia.toFixed(1)}%</p>
            </div>
            <Badge variant={dados.taxaConvergencia >= 90 ? 'success' : 'secondary'} className="text-lg px-4 py-2">
              {dados.taxaConvergencia >= 90 ? 'Excelente' : 'Bom'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Componente 3: `src/components/admin/AnaliseClinica.tsx`

```typescript
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CORES_PHQ9 = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#991b1b'];
const CORES_GAD7 = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
const CORES_WHO5 = ['#ef4444', '#10b981'];

interface AnaliseClinicaProps {
  dados: {
    phq9: { minimo: number; leve: number; moderado: number; moderadoSevero: number; severo: number; total: number };
    gad7: { minimo: number; leve: number; moderado: number; severo: number; total: number };
    who5: { bemEstarBaixo: number; bemEstarNormal: number; total: number };
    totalAvaliacoes: number;
  };
}

export function AnaliseClinica({ dados }: AnaliseClinicaProps) {
  const dadosPHQ9 = [
    { name: 'Mínimo (0-4)', value: dados.phq9.minimo },
    { name: 'Leve (5-9)', value: dados.phq9.leve },
    { name: 'Moderado (10-14)', value: dados.phq9.moderado },
    { name: 'Moderado-Severo (15-19)', value: dados.phq9.moderadoSevero },
    { name: 'Severo (≥20)', value: dados.phq9.severo }
  ];
  
  const dadosGAD7 = [
    { name: 'Mínimo (0-4)', value: dados.gad7.minimo },
    { name: 'Leve (5-9)', value: dados.gad7.leve },
    { name: 'Moderado (10-14)', value: dados.gad7.moderado },
    { name: 'Severo (≥15)', value: dados.gad7.severo }
  ];
  
  const dadosWHO5 = [
    { name: 'Baixo Bem-Estar (<50)', value: dados.who5.bemEstarBaixo },
    { name: 'Normal (≥50)', value: dados.who5.bemEstarNormal }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição PHQ-9 (Depressão)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosPHQ9}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosPHQ9.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_PHQ9[index % CORES_PHQ9.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Total de avaliações: {dados.phq9.total}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Distribuição GAD-7 (Ansiedade)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosGAD7}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosGAD7.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_GAD7[index % CORES_GAD7.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Total de avaliações: {dados.gad7.total}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Distribuição WHO-5 (Bem-Estar)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosWHO5}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosWHO5.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_WHO5[index % CORES_WHO5.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Total de avaliações: {dados.who5.total}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## ✅ Checklist de Validação

- [ ] **5 seções implementadas** (Métricas, Questionários, Alertas, Clínico, Logs)
- [ ] **Métricas corretas** (usuários ativos, taxa conclusão, tempo médio)
- [ ] **Gráficos visuais** (barras, pizza, linha)
- [ ] **Queries otimizadas** com select/include
- [ ] **Performance < 3s** para carregar todas as seções
- [ ] **Acesso restrito** (apenas role ADMIN)
- [ ] **Exportação CSV/JSON** funcional
- [ ] **Responsivo** em todas as telas
- [ ] **Testes com dados reais** (não mocados)

---

## 🔧 Workflow Git

```bash
git checkout develop
git pull origin develop
git checkout -b feature/admin-dashboard-complete

git add .
git commit -m "feat: dashboard admin completo

- 5 seções analíticas (métricas, questionários, alertas, clínico, logs)
- Métricas sistema (usuários ativos, sessões, performance)
- Análise questionários (taxa conclusão, tempo, eficácia IRT)
- Análise alertas (distribuição, tempo resolução, não tratados)
- Análise clínica (PHQ-9/GAD-7/WHO-5 por faixa)
- Logs auditoria (últimas 24h)
- Gráficos visuais (barras, pizza, linha)
- Acesso restrito role ADMIN
- Queries otimizadas com cache"

git push origin feature/admin-dashboard-complete
```

---

**Próximo Sprint**: Sprint 10 - Otimização Performance IRT
