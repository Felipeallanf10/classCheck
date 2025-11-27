# 📋 Plano de Execução Profissional - ClassCheck v3.1

**Data**: 21 de novembro de 2025  
**Versão**: 3.1  
**Responsável**: Felipe Allan  
**Branch Base**: `develop`

---

## 📊 Auditoria do Código Atual

### ✅ Componentes Existentes (80% Completo)
- Sistema IRT completo e funcional
- 40+ índices Prisma otimizados
- Relatórios usando dados reais (não mockados)
- 15+ componentes de visualização (gráficos)
- 2 escalas clínicas implementadas (WHO-5, PHQ-9)
- Hooks React Query para fetching de dados
- Cache em memória (LRU)

### ❌ Gaps Identificados

#### 🔴 Críticos:
1. **4 escalas clínicas faltantes**: GAD-7, PSS-10, Rosenberg, UCLA-3
2. **Bibliotecas de exportação não instaladas**: jsPDF, xlsx
3. **Exportação PDF/Excel mockada**: Precisa implementação real

#### 🟡 Médios:
4. **Redis/Upstash não implementado**: Cache distribuído
5. **Dashboard Professor sem rota dedicada**: `/professor/relatorios` não existe

#### 🟢 Baixos:
6. Templates de questionários contextuais
7. APIs específicas de relatórios (comparativos, radar)

---

## 🎯 Estratégia de Branches

```
develop (base)
├── feature/clinical-scales-expansion    # Sprint 1: Escalas Clínicas
├── feature/pdf-excel-export            # Sprint 2: Exportação Real
├── feature/professor-dashboard         # Sprint 3: Dashboard Professor
└── feature/redis-caching               # Sprint 4: Cache Distribuído (opcional)
```

### Processo Git para cada Sprint:
1. Criar branch a partir de `develop`
2. Implementar funcionalidades
3. Testar localmente
4. Commit com mensagem semântica
5. Push e criar PR para `develop`
6. Review (auto-review se solo)
7. Merge (squash and merge)
8. Deletar branch após merge
9. Deploy `develop` → `main` quando estável

---

## 🚀 SPRINT 1: Expansão de Escalas Clínicas

**Branch**: `feature/clinical-scales-expansion`  
**Prioridade**: 🔴 CRÍTICA  
**Esforço**: 8-12 horas  
**Prazo**: Semana 1-2

### 🎯 Objetivos
- ✅ Criar seed para GAD-7 (7 perguntas sobre ansiedade)
- ✅ Criar seed para PSS-10 (10 perguntas sobre estresse)
- ✅ Criar seed para Rosenberg (10 perguntas sobre autoestima)
- ✅ Criar seed para UCLA-3 (3 perguntas sobre solidão)
- ✅ Atualizar seed-completo.ts para incluir novas escalas

### 📋 Tarefas Detalhadas

#### 1.1. Criar `prisma/seed-gad7.ts`
```typescript
// GAD-7: Generalized Anxiety Disorder 7-item scale
// Escala validada clinicamente para ansiedade
// Scoring: 0-4 (mínima), 5-9 (leve), 10-14 (moderada), 15-21 (severa)

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedGAD7() {
  console.log('🌱 Seeding GAD-7 (Ansiedade)...');
  
  const perguntas = [
    {
      codigo: 'GAD7_001',
      texto: 'Nas últimas 2 semanas, com que frequência você foi incomodado(a) por sentir-se nervoso(a), ansioso(a) ou muito tenso(a)?',
      categoria: 'ANSIEDADE',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      // ... configuração IRT
    },
    // ... 6 perguntas restantes
  ];
  
  for (const pergunta of perguntas) {
    await prisma.bancoPerguntasAdaptativo.create({ data: pergunta });
  }
  
  console.log('✅ GAD-7 seed completo');
}
```

**Perguntas GAD-7**:
1. Sentir-se nervoso, ansioso ou muito tenso
2. Não conseguir impedir ou controlar preocupações
3. Preocupar-se muito com diversas coisas
4. Dificuldade para relaxar
5. Ficar tão agitado que é difícil permanecer sentado
6. Ficar facilmente aborrecido ou irritado
7. Sentir medo como se algo horrível fosse acontecer

**Scoring GAD-7**:
- 0-4: Ansiedade mínima
- 5-9: Ansiedade leve
- 10-14: Ansiedade moderada
- 15-21: Ansiedade severa

---

#### 1.2. Criar `prisma/seed-pss10.ts`
```typescript
// PSS-10: Perceived Stress Scale (10 itens)
// Escala de estresse percebido no último mês
// Scoring: 0-13 (baixo), 14-26 (moderado), 27-40 (alto)

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedPSS10() {
  console.log('🌱 Seeding PSS-10 (Estresse Percebido)...');
  
  const perguntas = [
    {
      codigo: 'PSS10_001',
      texto: 'No último mês, com que frequência você ficou aborrecido(a) por causa de algo que aconteceu inesperadamente?',
      categoria: 'ESTRESSE',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      // ... configuração IRT
    },
    // ... 9 perguntas restantes
  ];
  
  for (const pergunta of perguntas) {
    await prisma.bancoPerguntasAdaptativo.create({ data: pergunta });
  }
  
  console.log('✅ PSS-10 seed completo');
}
```

**Perguntas PSS-10** (resumidas):
1. Aborrecimento por algo inesperado
2. Incapacidade de controlar coisas importantes
3. Sentir-se nervoso e estressado
4. Lidar com aborrecimentos do dia a dia (reversa)
5. Lidar eficazmente com mudanças (reversa)
6. Confiança para lidar com problemas (reversa)
7. Sentir que as coisas estão indo bem (reversa)
8. Sentir que não consegue lidar com tudo
9. Controlar irritações (reversa)
10. Sentir que está por cima das coisas (reversa)

**Nota**: Itens 4, 5, 6, 7, 9, 10 são de pontuação reversa (0→4, 1→3, 2→2, 3→1, 4→0)

---

#### 1.3. Criar `prisma/seed-rosenberg.ts`
```typescript
// Escala de Autoestima de Rosenberg (10 itens)
// Escala global de autoestima
// Scoring: 0-15 (baixa), 15-25 (normal), 26-30 (alta)

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedRosenberg() {
  console.log('🌱 Seeding Rosenberg (Autoestima)...');
  
  const perguntas = [
    {
      codigo: 'ROSENBERG_001',
      texto: 'Eu sinto que sou uma pessoa de valor, no mínimo, tanto quanto as outras pessoas.',
      categoria: 'AUTOESTIMA',
      tipoPergunta: 'LIKERT_5',
      // ... configuração IRT
    },
    // ... 9 perguntas restantes
  ];
  
  for (const pergunta of perguntas) {
    await prisma.bancoPerguntasAdaptativo.create({ data: pergunta });
  }
  
  console.log('✅ Rosenberg seed completo');
}
```

**Perguntas Rosenberg** (resumidas):
1. Sou uma pessoa de valor
2. Tenho boas qualidades
3. Sou um fracasso (reversa)
4. Faço coisas tão bem quanto outras pessoas
5. Não tenho muito do que me orgulhar (reversa)
6. Tenho atitude positiva comigo mesmo
7. No geral, estou satisfeito comigo
8. Gostaria de ter mais respeito por mim (reversa)
9. Às vezes me sinto inútil (reversa)
10. Às vezes penso que não presto (reversa)

**Nota**: Itens 3, 5, 8, 9, 10 são de pontuação reversa

---

#### 1.4. Criar `prisma/seed-ucla3.ts`
```typescript
// UCLA Loneliness Scale (versão 3 itens)
// Escala curta de solidão
// Scoring: 3-6 (baixa solidão), 7-9 (alta solidão)

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedUCLA3() {
  console.log('🌱 Seeding UCLA-3 (Solidão)...');
  
  const perguntas = [
    {
      codigo: 'UCLA3_001',
      texto: 'Com que frequência você sente que não tem companhia?',
      categoria: 'RELACIONAMENTOS',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 1, label: 'Quase nunca' },
        { valor: 2, label: 'Às vezes' },
        { valor: 3, label: 'Frequentemente' }
      ],
      // ... configuração IRT
    },
    {
      codigo: 'UCLA3_002',
      texto: 'Com que frequência você se sente excluído(a)?',
      categoria: 'RELACIONAMENTOS',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      // ...
    },
    {
      codigo: 'UCLA3_003',
      texto: 'Com que frequência você se sente isolado(a) dos outros?',
      categoria: 'RELACIONAMENTOS',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      // ...
    },
  ];
  
  for (const pergunta of perguntas) {
    await prisma.bancoPerguntasAdaptativo.create({ data: pergunta });
  }
  
  console.log('✅ UCLA-3 seed completo');
}
```

---

#### 1.5. Atualizar `prisma/seed-completo.ts`
```typescript
import { seedGAD7 } from './seed-gad7';
import { seedPSS10 } from './seed-pss10';
import { seedRosenberg } from './seed-rosenberg';
import { seedUCLA3 } from './seed-ucla3';
// ... imports existentes

async function main() {
  console.log('🌱 Iniciando seed completo...');
  
  // Seeds existentes
  await seedUsuarios();
  await seedMaterias();
  // ...
  
  // Novas escalas clínicas
  await seedGAD7();
  await seedPSS10();
  await seedRosenberg();
  await seedUCLA3();
  
  console.log('✅ Seed completo finalizado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

### ✅ Checklist de Validação Sprint 1

- [ ] Cada escala tem perguntas com textos validados clinicamente
- [ ] Parâmetros IRT calibrados (discriminacao: 0.5-2.5, dificuldade: -3 a +3, acerto: 0-0.3)
- [ ] Valencia e ativação definidas conforme Modelo Circumplex
- [ ] Categoria correta (ANSIEDADE, ESTRESSE, AUTOESTIMA, RELACIONAMENTOS)
- [ ] Tipos de pergunta apropriados (LIKERT_5, ESCALA_FREQUENCIA)
- [ ] Opções de resposta padronizadas
- [ ] Perguntas reversas identificadas (PSS-10, Rosenberg)
- [ ] Seeds executam sem erros (`npm run seed`)
- [ ] Banco atualizado (`npx prisma db push`)
- [ ] Testes manuais com questionários usando novas perguntas

---

### 🔧 Comandos Git Sprint 1

```bash
# 1. Criar branch
git checkout develop
git pull origin develop
git checkout -b feature/clinical-scales-expansion

# 2. Implementar seeds (criar arquivos acima)

# 3. Testar localmente
npx prisma db push
npm run seed

# 4. Commit
git add prisma/seed-*.ts
git commit -m "feat: adicionar escalas clínicas GAD-7, PSS-10, Rosenberg e UCLA-3

- Implementar seed-gad7.ts com 7 perguntas validadas de ansiedade
- Implementar seed-pss10.ts com 10 perguntas de estresse percebido
- Implementar seed-rosenberg.ts com 10 perguntas de autoestima
- Implementar seed-ucla3.ts com 3 perguntas de solidão
- Atualizar seed-completo.ts para incluir novas escalas
- Calibrar parâmetros IRT para cada pergunta
- Definir valencia/ativação conforme Modelo Circumplex
- Adicionar scoring e interpretação para cada escala

BREAKING CHANGE: Banco de perguntas expandido de ~50 para ~80 perguntas"

# 5. Push
git push origin feature/clinical-scales-expansion

# 6. Criar PR no GitHub
# Título: "feat: Adicionar 4 escalas clínicas validadas (GAD-7, PSS-10, Rosenberg, UCLA-3)"
# Descrição: Expandir banco de perguntas com escalas clínicas padrão-ouro

# 7. Merge (após review)
# Via GitHub: Squash and merge

# 8. Cleanup
git checkout develop
git pull origin develop
git branch -d feature/clinical-scales-expansion
```

---

## 🚀 SPRINT 2: Exportação Real PDF/Excel

**Branch**: `feature/pdf-excel-export`  
**Prioridade**: 🔴 CRÍTICA  
**Esforço**: 10-14 horas  
**Prazo**: Semana 2-3

### 🎯 Objetivos
- ✅ Instalar jsPDF, jspdf-autotable, xlsx
- ✅ Implementar gerador de PDF com tabelas e gráficos
- ✅ Implementar gerador de Excel com múltiplas abas
- ✅ Integrar com componente ExportDropdown existente
- ✅ Remover lógica mockada
- ✅ Testar com dados reais

### 📋 Tarefas Detalhadas

#### 2.1. Instalar Dependências
```bash
npm install jspdf jspdf-autotable xlsx html2canvas
npm install --save-dev @types/jspdf
```

#### 2.2. Criar `src/lib/export/pdf-generator.ts`
```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MetricasAvaliacoes } from '@/types/relatorios';

export function gerarRelatorioPDF(
  dados: MetricasAvaliacoes,
  nomeUsuario: string
): Blob {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.text('ClassCheck - Relatório Socioemocional', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Aluno: ${nomeUsuario}`, 20, 30);
  doc.text(`Período: ${formatDate(dados.periodo.inicio)} - ${formatDate(dados.periodo.fim)}`, 20, 35);
  doc.text(`Data de Geração: ${formatDate(new Date())}`, 20, 40);
  
  // Linha separadora
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 45, 190, 45);
  
  // Seção 1: Estatísticas Gerais
  doc.setFontSize(14);
  doc.text('📊 Estatísticas Gerais', 20, 55);
  
  autoTable(doc, {
    startY: 60,
    head: [['Métrica', 'Valor']],
    body: [
      ['Total de Sessões', dados.estatisticas.totalSessoes.toString()],
      ['Total de Respostas', dados.estatisticas.totalRespostas.toString()],
      ['Tempo Médio de Resposta', `${dados.estatisticas.tempoMedioResposta}s`],
      ['Taxa de Resposta', `${(dados.estatisticas.taxaResposta * 100).toFixed(1)}%`],
    ],
    theme: 'grid',
  });
  
  // Seção 2: Scores por Categoria
  const finalY = (doc as any).lastAutoTable.finalY || 90;
  doc.setFontSize(14);
  doc.text('📈 Scores por Categoria', 20, finalY + 10);
  
  const scoresData = Object.entries(dados.scoresPorCategoria).map(([cat, score]) => [
    cat,
    score.media.toFixed(2),
    score.tendencia,
    `${score.minimo.toFixed(1)} - ${score.maximo.toFixed(1)}`,
  ]);
  
  autoTable(doc, {
    startY: finalY + 15,
    head: [['Categoria', 'Média', 'Tendência', 'Range']],
    body: scoresData,
    theme: 'striped',
  });
  
  // Seção 3: Alertas
  doc.addPage();
  doc.setFontSize(14);
  doc.text('🚨 Alertas', 20, 20);
  
  autoTable(doc, {
    startY: 25,
    head: [['Nível', 'Quantidade']],
    body: Object.entries(dados.alertas.porNivel).map(([nivel, qtd]) => [
      nivel,
      qtd.toString(),
    ]),
    theme: 'grid',
  });
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `ClassCheck © 2025 - Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc.output('blob');
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}
```

#### 2.3. Criar `src/lib/export/excel-generator.ts`
```typescript
import * as XLSX from 'xlsx';
import { MetricasAvaliacoes } from '@/types/relatorios';

export function gerarRelatorioExcel(
  dados: MetricasAvaliacoes,
  nomeUsuario: string
): ArrayBuffer {
  const wb = XLSX.utils.book_new();
  
  // Aba 1: Resumo
  const resumoData = [
    ['ClassCheck - Relatório Socioemocional'],
    [''],
    ['Aluno', nomeUsuario],
    ['Período Início', dados.periodo.inicio.toISOString()],
    ['Período Fim', dados.periodo.fim.toISOString()],
    [''],
    ['Total de Sessões', dados.estatisticas.totalSessoes],
    ['Total de Respostas', dados.estatisticas.totalRespostas],
    ['Tempo Médio de Resposta (s)', dados.estatisticas.tempoMedioResposta],
    ['Taxa de Resposta', dados.estatisticas.taxaResposta],
  ];
  const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');
  
  // Aba 2: Scores por Categoria
  const scoresData = Object.entries(dados.scoresPorCategoria).map(([cat, score]) => ({
    Categoria: cat,
    Média: score.media,
    Mínimo: score.minimo,
    Máximo: score.maximo,
    Mediana: score.mediana,
    'Desvio Padrão': score.desvioPadrao,
    Tendência: score.tendencia,
  }));
  const wsScores = XLSX.utils.json_to_sheet(scoresData);
  XLSX.utils.book_append_sheet(wb, wsScores, 'Scores');
  
  // Aba 3: Evolução Theta
  const evolucaoData = dados.thetaEvolucao.map((item) => ({
    Data: item.data.toISOString(),
    Theta: item.theta,
    Confiança: item.confianca,
  }));
  const wsEvolucao = XLSX.utils.json_to_sheet(evolucaoData);
  XLSX.utils.book_append_sheet(wb, wsEvolucao, 'Evolução Theta');
  
  // Aba 4: Alertas
  const alertasData = [
    ['Total de Alertas', dados.alertas.total],
    ['Não Lidos', dados.alertas.naoLidos],
    [''],
    ['Distribuição por Nível'],
    ...Object.entries(dados.alertas.porNivel).map(([nivel, qtd]) => [nivel, qtd]),
  ];
  const wsAlertas = XLSX.utils.aoa_to_sheet(alertasData);
  XLSX.utils.book_append_sheet(wb, wsAlertas, 'Alertas');
  
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}
```

#### 2.4. Atualizar `src/components/exportacao/ExportDropdown.tsx`
```typescript
'use client';

import { useState } from 'react';
import { Download, FileText, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { gerarRelatorioPDF } from '@/lib/export/pdf-generator';
import { gerarRelatorioExcel } from '@/lib/export/excel-generator';
import { useToast } from '@/hooks/use-toast';

interface ExportDropdownProps {
  usuarioId: number;
  nomeUsuario: string;
  periodo: {
    inicio: Date;
    fim: Date;
  };
}

export function ExportDropdown({ usuarioId, nomeUsuario, periodo }: ExportDropdownProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const fetchMetricas = async () => {
    const res = await fetch(`/api/relatorios/metricas-avaliacoes?usuarioId=${usuarioId}&periodo=${JSON.stringify(periodo)}`);
    if (!res.ok) throw new Error('Falha ao buscar métricas');
    return res.json();
  };
  
  const handleExportPDF = async () => {
    setLoading(true);
    try {
      const dados = await fetchMetricas();
      const blob = gerarRelatorioPDF(dados, nomeUsuario);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${nomeUsuario}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'PDF gerado com sucesso!',
        description: 'O download começará em instantes.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao gerar PDF',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const dados = await fetchMetricas();
      const buffer = gerarRelatorioExcel(dados, nomeUsuario);
      
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${nomeUsuario}-${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Excel gerado com sucesso!',
        description: 'O download começará em instantes.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao gerar Excel',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading}>
          <Download className="mr-2 h-4 w-4" />
          {loading ? 'Gerando...' : 'Exportar'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Exportar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <Table className="mr-2 h-4 w-4" />
          Exportar Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### ✅ Checklist de Validação Sprint 2

- [ ] Bibliotecas instaladas (jsPDF, xlsx) sem erros
- [ ] PDF gerado com cabeçalho, tabelas e rodapé
- [ ] Excel com 4 abas (Resumo, Scores, Evolução, Alertas)
- [ ] Dados reais do banco (não mock)
- [ ] Download funciona em Chrome, Firefox, Safari
- [ ] Performance aceitável (< 3 segundos para gerar)
- [ ] Arquivos abrem corretamente (PDF no navegador, Excel no Excel/LibreOffice)
- [ ] Testes com diferentes períodos e usuários
- [ ] Código mockado removido de ExportDropdown

---

### 🔧 Comandos Git Sprint 2

```bash
git checkout develop
git pull origin develop
git checkout -b feature/pdf-excel-export

# Implementar arquivos acima

npm install jspdf jspdf-autotable xlsx html2canvas
npm install --save-dev @types/jspdf

# Testar localmente
npm run dev
# Acessar /relatorios e testar exportação

git add .
git commit -m "feat: implementar exportação real de relatórios em PDF e Excel

- Adicionar dependências jsPDF, jspdf-autotable, xlsx, html2canvas
- Criar pdf-generator.ts com tabelas e formatação profissional
- Criar excel-generator.ts com 4 abas (Resumo, Scores, Evolução, Alertas)
- Atualizar ExportDropdown para usar geradores reais
- Remover lógica mockada de exportação
- Adicionar tratamento de erros e loading states
- Testar com dados reais do banco
- Otimizar performance de geração (< 3s)

BREAKING CHANGE: Exportação agora usa dados reais (não mock)"

git push origin feature/pdf-excel-export
# Criar PR, merge, cleanup
```

---

## 🚀 SPRINT 3: Dashboard Professor

**Branch**: `feature/professor-dashboard`  
**Prioridade**: 🟡 MÉDIA  
**Esforço**: 12-16 horas  
**Prazo**: Semana 3-4

### 🎯 Objetivos
- ✅ Criar rota `/professor/relatorios`
- ✅ Implementar API `/api/professor/relatorios/turma`
- ✅ Componentes de visualização para professor
- ✅ Filtros por turma, período, matéria
- ✅ Lista de alunos em risco com alertas

### 📋 Tarefas Detalhadas

#### 3.1. Criar API `src/app/api/professor/relatorios/turma/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { z } from 'zod';
import { subMonths } from 'date-fns';

export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  turmaId: z.string().transform(Number),
  periodo: z.enum(['semana', 'mes', '3meses', 'semestre']).optional().default('mes'),
});

export async function GET(request: NextRequest) {
  try {
    const usuario = await getAuthenticatedUser();
    if (!usuario || usuario.role !== 'PROFESSOR') {
      return NextResponse.json({ erro: 'Não autorizado' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const validated = QuerySchema.safeParse({
      turmaId: searchParams.get('turmaId'),
      periodo: searchParams.get('periodo'),
    });
    
    if (!validated.success) {
      return NextResponse.json(
        { erro: 'Parâmetros inválidos', detalhes: validated.error.flatten() },
        { status: 400 }
      );
    }
    
    const { turmaId, periodo } = validated.data;
    
    // Calcular período
    const periodoMap = {
      semana: 7,
      mes: 30,
      '3meses': 90,
      semestre: 180,
    };
    const dataInicio = subMonths(new Date(), periodoMap[periodo]);
    
    // Buscar alunos da turma
    const turmaAlunos = await prisma.turmaAluno.findMany({
      where: { turmaId },
      include: {
        aluno: {
          include: {
            alertasSocioemocionais: {
              where: {
                nivel: { in: ['VERMELHO', 'LARANJA'] },
                status: { in: ['PENDENTE', 'EM_ANALISE'] },
                criadoEm: { gte: dataInicio },
              },
            },
            sessoesAdaptativas: {
              where: {
                status: 'COMPLETA',
                iniciadoEm: { gte: dataInicio },
              },
              select: {
                thetaEstimado: true,
                confianca: true,
                iniciadoEm: true,
              },
            },
          },
        },
      },
    });
    
    // Calcular métricas por aluno
    const metricas = turmaAlunos.map((ta) => {
      const sessoes = ta.aluno.sessoesAdaptativas;
      const thetaMedio = sessoes.length > 0
        ? sessoes.reduce((sum, s) => sum + (s.thetaEstimado || 0), 0) / sessoes.length
        : 0;
      
      const alertasAbertos = ta.aluno.alertasSocioemocionais.length;
      
      let nivelRisco: 'BAIXO' | 'MEDIO' | 'ALTO' = 'BAIXO';
      if (alertasAbertos > 0) {
        const temVermelho = ta.aluno.alertasSocioemocionais.some((a) => a.nivel === 'VERMELHO');
        nivelRisco = temVermelho ? 'ALTO' : 'MEDIO';
      } else if (thetaMedio < -1.5) {
        nivelRisco = 'MEDIO';
      }
      
      return {
        aluno: {
          id: ta.aluno.id,
          nome: ta.aluno.nome,
          avatar: ta.aluno.avatar,
        },
        alertasAbertos,
        thetaMedio,
        totalSessoes: sessoes.length,
        nivelRisco,
      };
    });
    
    // Ordenar por nível de risco (alto primeiro)
    metricas.sort((a, b) => {
      const nivelMap = { ALTO: 3, MEDIO: 2, BAIXO: 1 };
      return nivelMap[b.nivelRisco] - nivelMap[a.nivelRisco];
    });
    
    return NextResponse.json({
      sucesso: true,
      dados: {
        turmaId,
        periodo,
        totalAlunos: metricas.length,
        alunosEmRisco: metricas.filter((m) => m.nivelRisco !== 'BAIXO').length,
        metricas,
      },
    });
  } catch (erro) {
    console.error('[API] Erro em /api/professor/relatorios/turma:', erro);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

#### 3.2. Criar Página `src/app/professor/relatorios/page.tsx`
```typescript
import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardProfessor } from '@/components/professor/DashboardProfessor';

export default async function ProfessorRelatoriosPage() {
  const usuario = await requireAuth();
  
  if (usuario.role !== 'PROFESSOR') {
    redirect('/dashboard');
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Relatórios das Minhas Turmas</h1>
      <DashboardProfessor professorId={usuario.id} />
    </div>
  );
}
```

#### 3.3. Criar Componente `src/components/professor/DashboardProfessor.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { AlunosEmRisco } from './AlunosEmRisco';
import { VisaoGeralTurma } from './VisaoGeralTurma';
import { Spinner } from '@/components/ui/spinner';

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
  const { data: metricas, isLoading: loadingMetricas } = useQuery({
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
                {turmas?.dados.map((turma: any) => (
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
          ) : (
            <>
              <VisaoGeralTurma metricas={metricas?.dados} />
              <AlunosEmRisco alunos={metricas?.dados.metricas} />
            </>
          )}
        </>
      )}
    </div>
  );
}
```

#### 3.4. Componentes Auxiliares

**`src/components/professor/VisaoGeralTurma.tsx`**:
- Cards com total de alunos, alunos em risco, theta médio
- Gráfico de barras com distribuição de risco

**`src/components/professor/AlunosEmRisco.tsx`**:
- Tabela com alunos ordenados por risco
- Badges de nível de risco (vermelho/laranja/verde)
- Link para detalhes do aluno

---

### ✅ Checklist de Validação Sprint 3

- [ ] Rota `/professor/relatorios` acessível apenas por PROFESSOR
- [ ] API `/api/professor/relatorios/turma` retorna dados corretos
- [ ] Filtros de turma e período funcionam
- [ ] Métricas calculadas corretamente (theta médio, alertas, risco)
- [ ] Alunos em risco listados com badges visuais
- [ ] Performance < 2 segundos com 50+ alunos
- [ ] Responsivo (mobile/tablet/desktop)
- [ ] Testes com role PROFESSOR e múltiplas turmas

---

### 🔧 Comandos Git Sprint 3

```bash
git checkout develop
git pull origin develop
git checkout -b feature/professor-dashboard

# Implementar arquivos acima

npm run dev
# Testar com usuário professor

git add .
git commit -m "feat: criar dashboard de relatórios para professores

- Criar rota /professor/relatorios com autenticação por role
- Implementar API /api/professor/relatorios/turma com métricas agregadas
- Adicionar componente DashboardProfessor com filtros de turma e período
- Criar VisaoGeralTurma com cards de estatísticas e gráficos
- Criar AlunosEmRisco com tabela ordenada por nível de risco
- Implementar cálculo automático de nível de risco (theta + alertas)
- Otimizar queries Prisma com select e índices
- Adicionar loading states e tratamento de erros
- Testar com role PROFESSOR e múltiplas turmas

Closes #[número-da-issue]"

git push origin feature/professor-dashboard
# Criar PR, merge, cleanup
```

---

## 🚀 SPRINT 4 (Opcional): Cache Distribuído com Redis

**Branch**: `feature/redis-caching`  
**Prioridade**: 🟢 BAIXA (Otimização)  
**Esforço**: 8-10 horas  
**Prazo**: Semana 4-5

### 🎯 Objetivos
- ✅ Configurar Upstash Redis (free tier)
- ✅ Implementar redis-cache.ts
- ✅ Migrar cache LRU para Redis
- ✅ Estratégia de invalidação automática
- ✅ Configurar variáveis de ambiente

### 📋 Tarefas Resumidas

1. Criar conta em [upstash.com](https://upstash.com)
2. Criar banco Redis
3. `npm install @upstash/redis`
4. Implementar `src/lib/cache/redis-cache.ts`
5. Migrar APIs de relatórios para usar Redis
6. Implementar invalidação em POST/PUT/DELETE
7. Configurar `REDIS_URL` e `REDIS_TOKEN` no Vercel

---

## 📊 Cronograma Visual

```
Semana 1    ████████░░░░░░░░  Sprint 1: Escalas Clínicas (50%)
Semana 2    ████████████████  Sprint 1: Escalas (100%) + Sprint 2: Exportação (50%)
Semana 3    ████████████████  Sprint 2: Exportação (100%) + Sprint 3: Dashboard Prof (50%)
Semana 4    ████████████████  Sprint 3: Dashboard (100%) + Sprint 4: Redis (opcional)
```

---

## ✅ Processo Padrão de Merge

### Para cada Sprint:

1. **Desenvolvimento**:
```bash
git checkout -b feature/[nome]
# Implementar
npm run dev           # Testar
npm run lint          # Verificar
```

2. **Commit**:
```bash
git add .
git commit -m "feat: [descrição]"
git push origin feature/[nome]
```

3. **Pull Request**:
- Criar PR no GitHub
- Título: feat/fix/refactor: descrição curta
- Descrição: O que foi feito, como testar, screenshots
- Assignees: você mesmo
- Labels: enhancement/bug/documentation

4. **Merge**:
- GitHub: "Squash and merge"
- Deletar branch automaticamente após merge

5. **Deploy**:
```bash
git checkout develop
git pull origin develop
# Testar deploy preview do Vercel

# Quando estável:
git checkout main
git merge develop
git push origin main
# Vercel faz deploy automático
```

---

## 📊 Métricas de Sucesso Final

### Questionários:
- ✅ **Banco com 80+ perguntas** (50 atuais + 30 novas escalas)
- ✅ **6 escalas clínicas validadas** (WHO-5, PHQ-9, GAD-7, PSS-10, Rosenberg, UCLA-3)
- ✅ **Tempo médio < 5 minutos**
- ✅ **Taxa de conclusão > 80%**

### Relatórios:
- ✅ **100% dados reais** (não mock)
- ✅ **Exportação PDF/Excel funcional**
- ✅ **Dashboard Professor completo**
- ✅ **Tempo de carregamento < 2s** (com cache)

### Performance:
- ✅ **40+ índices Prisma** (já implementado)
- ✅ **Cache em memória** (já implementado)
- ⚠️ **Redis** (opcional)

---

## 📞 Próximos Passos Imediatos

1. **Revisar este plano** e confirmar prioridades
2. **Alocar tempo** (8-12h/semana por 4 semanas)
3. **Começar Sprint 1** criando branch e seeds
4. **Iterar** sprint a sprint, testando e fazendo merge

---

**Última Atualização**: 21/11/2025  
**Status**: Pronto para Execução  
**Responsável**: Felipe Allan
