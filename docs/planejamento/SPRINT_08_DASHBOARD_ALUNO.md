# 🚀 SPRINT 8: Melhorias Dashboard Aluno

**Branch**: `feature/student-dashboard-improvements`  
**Esforço**: 8-10 horas  
**Prazo**: Semana 8  
**Dependências**: APIs de relatórios (Sprint 7), Sistema de cache (Sprint 4)  

---

## 🎯 Objetivos do Sprint

- ✅ Criar 5 novos widgets visuais e interativos
- ✅ Integrar com APIs de relatórios do Sprint 7
- ✅ Implementar sistema de conquistas/gamificação
- ✅ Loading states e error boundaries
- ✅ Responsivo mobile-first
- ✅ Acessibilidade (ARIA labels, keyboard nav)

---

## 🧩 Widgets a Implementar

### 1. **Jornada Emocional** (últimos 30 dias)
**Descrição**: Mini gráfico de linha mostrando evolução do theta  
**API**: `/api/relatorios/evolucao-temporal`  
**Visual**: Line chart com tendência (seta ↑↓→) e badge de variação

### 2. **Conquistas Recentes**
**Descrição**: Sistema de badges/XP com níveis e progresso  
**API**: Buscar `Usuario.xp` e calcular conquistas  
**Visual**: Grid de badges com tooltip e barra de progresso

### 3. **Próximos Check-ins**
**Descrição**: Agenda de questionários agendados + countdown  
**API**: Buscar `AgendamentoQuestionario` do usuário  
**Visual**: Lista cronológica com ícones de tipo de questionário

### 4. **Circumplex Interativo**
**Descrição**: Gráfico circumplex clicável com tooltip detalhado  
**API**: Buscar últimas respostas com valencia/ativação  
**Visual**: Scatter plot com zoom, hover, animação

### 5. **Timeline de Alertas**
**Descrição**: Histórico de alertas resolvidos/pendentes  
**API**: Buscar `AlertaSocioemocional` do usuário  
**Visual**: Timeline vertical com badges coloridos por severidade

---

## 📂 Estrutura de Componentes

### Widget 1: `src/components/dashboard/JornadaEmocional.tsx`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface JornadaEmocionalProps {
  usuarioId: number;
}

export function JornadaEmocional({ usuarioId }: JornadaEmocionalProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['jornada-emocional', usuarioId],
    queryFn: async () => {
      const res = await fetch(`/api/relatorios/evolucao-temporal?usuarioId=${usuarioId}&dias=30`);
      if (!res.ok) throw new Error('Erro ao buscar jornada');
      return res.json();
    },
    staleTime: 5 * 60 * 1000 // 5 minutos
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data?.sucesso) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
          Erro ao carregar jornada emocional
        </CardContent>
      </Card>
    );
  }
  
  const { pontos, tendencia, variacao } = data.dados;
  
  const getTrendIcon = () => {
    switch (tendencia) {
      case 'CRESCENTE': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'DECRESCENTE': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };
  
  const getTrendColor = () => {
    switch (tendencia) {
      case 'CRESCENTE': return 'success';
      case 'DECRESCENTE': return 'destructive';
      default: return 'secondary';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Sua Jornada Emocional
        </CardTitle>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <Badge variant={getTrendColor()}>
            {tendencia} {Math.abs(variacao).toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={pontos}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="data"
              tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              stroke="#888"
            />
            <YAxis
              domain={[-3, 3]}
              ticks={[-3, -2, -1, 0, 1, 2, 3]}
              stroke="#888"
            />
            <Tooltip
              labelFormatter={(val) => new Date(val).toLocaleString('pt-BR')}
              formatter={(value: number) => [value.toFixed(2), 'Theta']}
            />
            <Line
              type="monotone"
              dataKey="theta"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Últimos 30 dias • {pontos.length} avaliações
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### Widget 2: `src/components/dashboard/ConquistasRecentes.tsx`

```typescript
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Conquista {
  id: string;
  titulo: string;
  descricao: string;
  xp: number;
  icone: string;
  desbloqueada: boolean;
  progresso?: number; // 0-100
}

const CONQUISTAS: Conquista[] = [
  {
    id: 'primeira-sessao',
    titulo: 'Primeira Avaliação',
    descricao: 'Complete sua primeira avaliação socioemocional',
    xp: 10,
    icone: '🎯',
    desbloqueada: false
  },
  {
    id: '7-dias-sequencia',
    titulo: '7 Dias Consecutivos',
    descricao: 'Faça check-ins diários por 7 dias seguidos',
    xp: 50,
    icone: '🔥',
    desbloqueada: false,
    progresso: 42 // 3/7 dias
  },
  {
    id: '30-sessoes',
    titulo: '30 Sessões Completas',
    descricao: 'Complete 30 avaliações no total',
    xp: 100,
    icone: '🏆',
    desbloqueada: false,
    progresso: 60 // 18/30
  },
  {
    id: 'explorador',
    titulo: 'Explorador Emocional',
    descricao: 'Teste todos os tipos de questionário',
    xp: 75,
    icone: '🧭',
    desbloqueada: false
  },
  {
    id: 'reflexivo',
    titulo: 'Reflexivo',
    descricao: 'Escreva 10 respostas de texto longo',
    xp: 30,
    icone: '📝',
    desbloqueada: true
  }
];

interface ConquistasRecentesProps {
  usuarioId: number;
  xpAtual: number;
}

export function ConquistasRecentes({ usuarioId, xpAtual }: ConquistasRecentesProps) {
  const nivelAtual = Math.floor(xpAtual / 100) + 1;
  const xpProximoNivel = (nivelAtual * 100) - xpAtual;
  const progressoNivel = ((xpAtual % 100) / 100) * 100;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Conquistas</CardTitle>
          <Badge variant="secondary" className="text-base">
            Nível {nivelAtual}
          </Badge>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>{xpAtual} XP</span>
            <span>Faltam {xpProximoNivel} XP para nível {nivelAtual + 1}</span>
          </div>
          <Progress value={progressoNivel} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <TooltipProvider>
            {CONQUISTAS.map(conquista => (
              <Tooltip key={conquista.id}>
                <TooltipTrigger>
                  <div
                    className={`
                      relative p-4 rounded-lg border-2 transition-all cursor-pointer
                      ${conquista.desbloqueada
                        ? 'border-primary bg-primary/10 hover:bg-primary/20'
                        : 'border-muted bg-muted/50 opacity-60 hover:opacity-80'
                      }
                    `}
                  >
                    <div className="text-4xl mb-2">{conquista.icone}</div>
                    <h4 className="text-sm font-semibold line-clamp-2">
                      {conquista.titulo}
                    </h4>
                    
                    {conquista.progresso !== undefined && !conquista.desbloqueada && (
                      <div className="mt-2">
                        <Progress value={conquista.progresso} className="h-1" />
                        <span className="text-xs text-muted-foreground mt-1">
                          {conquista.progresso}%
                        </span>
                      </div>
                    )}
                    
                    <Badge
                      variant="outline"
                      className="absolute top-2 right-2 text-xs"
                    >
                      {conquista.xp} XP
                    </Badge>
                  </div>
                </TooltipTrigger>
                
                <TooltipContent>
                  <p className="max-w-xs">{conquista.descricao}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### Widget 3: `src/components/dashboard/ProximosCheckins.tsx`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProximosCheckinsProps {
  usuarioId: number;
}

export function ProximosCheckins({ usuarioId }: ProximosCheckinsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['proximos-checkins', usuarioId],
    queryFn: async () => {
      const res = await fetch(`/api/agendamentos?usuarioId=${usuarioId}&status=PENDENTE`);
      return res.json();
    }
  });
  
  if (isLoading) return <Card><CardContent>Carregando...</CardContent></Card>;
  
  const agendamentos = data?.dados || [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Próximos Check-ins
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {agendamentos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum check-in agendado</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {agendamentos.map((agendamento: any) => (
              <li
                key={agendamento.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
              >
                <div className="text-2xl">{getIconeQuestionario(agendamento.tipo)}</div>
                
                <div className="flex-1">
                  <h4 className="font-semibold">{agendamento.titulo}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(agendamento.dataAgendada), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
                
                <Badge variant="outline">
                  {agendamento.tipo}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function getIconeQuestionario(tipo: string): string {
  const icones: Record<string, string> = {
    CHECK_IN_DIARIO: '☀️',
    POS_AULA: '📚',
    TRIAGEM_ADAPTATIVA: '🎯',
    SEMANAL: '📅'
  };
  return icones[tipo] || '📋';
}
```

---

### Widget 4: `src/components/dashboard/CircumplexInterativo.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';

interface CircumplexInterativoProps {
  usuarioId: number;
}

export function CircumplexInterativo({ usuarioId }: CircumplexInterativoProps) {
  const [dadosSelecionados, setDadosSelecionados] = useState<any>(null);
  
  // Mock data - substituir com fetch real
  const dados = [
    { valencia: 0.7, ativacao: 0.5, data: '2024-01-15', emocao: 'Animado', z: 10 },
    { valencia: -0.3, ativacao: 0.8, data: '2024-01-16', emocao: 'Ansioso', z: 8 },
    { valencia: 0.5, ativacao: -0.4, data: '2024-01-17', emocao: 'Calmo', z: 12 }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Circumplex Emocional</CardTitle>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="valencia"
              domain={[-1, 1]}
              ticks={[-1, -0.5, 0, 0.5, 1]}
              label={{ value: 'Valencia (Prazer)', position: 'bottom' }}
            />
            <YAxis
              type="number"
              dataKey="ativacao"
              domain={[-1, 1]}
              ticks={[-1, -0.5, 0, 0.5, 1]}
              label={{ value: 'Ativação (Energia)', angle: -90, position: 'left' }}
            />
            <ZAxis type="number" dataKey="z" range={[50, 200]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ payload }) => {
                if (!payload?.[0]) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">{data.emocao}</p>
                    <p className="text-sm text-muted-foreground">{data.data}</p>
                    <p className="text-xs mt-1">
                      Valencia: {data.valencia.toFixed(2)} | Ativação: {data.ativacao.toFixed(2)}
                    </p>
                  </div>
                );
              }}
            />
            <Scatter
              data={dados}
              fill="#3b82f6"
              onClick={(data) => setDadosSelecionados(data)}
            />
          </ScatterChart>
        </ResponsiveContainer>
        
        {dadosSelecionados && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <h4 className="font-semibold">Detalhes: {dadosSelecionados.emocao}</h4>
            <p className="text-sm text-muted-foreground">{dadosSelecionados.data}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

### Widget 5: `src/components/dashboard/TimelineAlertas.tsx`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface TimelineAlertasProps {
  usuarioId: number;
}

export function TimelineAlertas({ usuarioId }: TimelineAlertasProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['alertas-timeline', usuarioId],
    queryFn: async () => {
      const res = await fetch(`/api/alertas?usuarioId=${usuarioId}&limit=10`);
      return res.json();
    }
  });
  
  if (isLoading) return <Card><CardContent>Carregando...</CardContent></Card>;
  
  const alertas = data?.dados || [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Histórico de Alertas
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="relative">
          {/* Linha vertical da timeline */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-muted" />
          
          <ul className="space-y-6">
            {alertas.map((alerta: any, index: number) => (
              <li key={alerta.id} className="relative pl-12">
                {/* Marcador da timeline */}
                <div
                  className={`absolute left-3 top-1 w-4 h-4 rounded-full border-2 ${
                    alerta.status === 'RESOLVIDO'
                      ? 'bg-green-500 border-green-500'
                      : 'bg-yellow-500 border-yellow-500'
                  }`}
                />
                
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{alerta.tipo}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alerta.descricao}
                      </p>
                    </div>
                    
                    <Badge variant={getSeveridadeVariant(alerta.severidade)}>
                      {alerta.severidade}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alerta.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    
                    {alerta.status === 'RESOLVIDO' && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-3 h-3" />
                        Resolvido
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function getSeveridadeVariant(severidade: string): 'default' | 'secondary' | 'destructive' {
  switch (severidade) {
    case 'BAIXA': return 'secondary';
    case 'MODERADA': return 'default';
    case 'ALTA': return 'destructive';
    default: return 'default';
  }
}
```

---

## 📄 Integração na Página Principal

### Atualizar: `src/app/dashboard/page.tsx`

```typescript
import { requireAuth } from '@/lib/auth';
import { JornadaEmocional } from '@/components/dashboard/JornadaEmocional';
import { ConquistasRecentes } from '@/components/dashboard/ConquistasRecentes';
import { ProximosCheckins } from '@/components/dashboard/ProximosCheckins';
import { CircumplexInterativo } from '@/components/dashboard/CircumplexInterativo';
import { TimelineAlertas } from '@/components/dashboard/TimelineAlertas';

export default async function DashboardPage() {
  const usuario = await requireAuth();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Meu Dashboard</h1>
      
      {/* Grid responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linha 1 */}
        <JornadaEmocional usuarioId={usuario.id} />
        <ConquistasRecentes usuarioId={usuario.id} xpAtual={usuario.xp} />
        
        {/* Linha 2 */}
        <ProximosCheckins usuarioId={usuario.id} />
        <TimelineAlertas usuarioId={usuario.id} />
        
        {/* Linha 3 - Full width */}
        <div className="lg:col-span-2">
          <CircumplexInterativo usuarioId={usuario.id} />
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Checklist de Validação

- [ ] **5 widgets implementados** e funcionais
- [ ] **Integração com APIs** do Sprint 7
- [ ] **Loading states** (Spinner, Skeleton) em todos os componentes
- [ ] **Error boundaries** com fallback UI
- [ ] **Responsivo** mobile (grid adapta para 1 coluna)
- [ ] **Acessibilidade**:
  - [ ] ARIA labels em botões/links
  - [ ] Navegação por teclado funciona
  - [ ] Contraste de cores adequado
- [ ] **Performance**:
  - [ ] React Query com staleTime adequado
  - [ ] Lazy loading de gráficos pesados
  - [ ] Imagens otimizadas
- [ ] **Testes com usuário real** (não mocado)

---

## 🔧 Workflow Git

```bash
# 1. Criar branch
git checkout develop
git pull origin develop
git checkout -b feature/student-dashboard-improvements

# 2. Implementar
# - Criar 5 widgets em src/components/dashboard/
# - Atualizar src/app/dashboard/page.tsx
# - Adicionar testes

# 3. Commit semântico
git add .
git commit -m "feat: melhorar dashboard aluno com 5 novos widgets

- Widget Jornada Emocional (gráfico linha 30 dias + tendência)
- Widget Conquistas (sistema badges/XP/níveis)
- Widget Próximos Check-ins (agenda + countdown)
- Widget Circumplex Interativo (clicável, tooltip, zoom)
- Widget Timeline Alertas (histórico visual)
- Integração com APIs relatórios
- Loading states e error boundaries
- Responsivo mobile-first
- Acessibilidade (ARIA, keyboard nav)"

# 4. Push e PR
git push origin feature/student-dashboard-improvements
```

---

## 📊 Métricas de Sucesso

- **Engajamento**: Aumento de 30% no tempo médio na dashboard
- **Responsividade**: Layout funcional em mobile/tablet/desktop
- **Performance**: < 2s para carregar todos os widgets
- **Acessibilidade**: Score 90+ no Lighthouse
- **Satisfação**: NPS > 8 com alunos testadores

---

**Próximo Sprint**: Sprint 9 - Dashboard Admin Completo
