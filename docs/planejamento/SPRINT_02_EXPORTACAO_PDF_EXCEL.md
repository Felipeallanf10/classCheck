# 🚀 SPRINT 2: Exportação PDF e Excel

**Branch**: `feature/pdf-excel-export`  
**Prioridade**: 🔴 CRÍTICA  
**Esforço**: 10-12 horas  
**Prazo**: Semana 2

---

## 🎯 Objetivos

- ✅ Implementar exportação de relatórios em PDF profissional
- ✅ Implementar exportação de relatórios em Excel/CSV
- ✅ Criar API `/api/relatorios/export`
- ✅ Adicionar botões de exportação nos dashboards
- ✅ Incluir gráficos nos PDFs (base64)

---

## 📋 Tarefas

### 1. Instalar Dependências

```bash
npm install jspdf jspdf-autotable
npm install xlsx
npm install recharts-to-png  # Para converter gráficos
```

### 2. Criar `src/lib/export/pdf-generator.ts`

```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface DadosRelatorioPDF {
  usuario: {
    nome: string;
    email: string;
  };
  periodo: {
    inicio: Date;
    fim: Date;
  };
  scoresPorCategoria: Record<string, {
    media: number;
    minimo: number;
    maximo: number;
    tendencia: string;
  }>;
  thetaEvolucao: Array<{
    data: Date;
    theta: number;
    confianca: number;
  }>;
  alertas: {
    total: number;
    porNivel: Record<string, number>;
  };
}

export async function gerarRelatorioPDF(dados: DadosRelatorioPDF): Promise<Blob> {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // primary-500
  doc.text('Relatório Socioemocional', 20, 20);
  
  // Informações do usuário
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Aluno: ${dados.usuario.nome}`, 20, 35);
  doc.text(`Email: ${dados.usuario.email}`, 20, 42);
  doc.text(
    `Período: ${dados.periodo.inicio.toLocaleDateString()} - ${dados.periodo.fim.toLocaleDateString()}`,
    20,
    49
  );
  
  // Linha separadora
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 55, 190, 55);
  
  // Tabela de Scores por Categoria
  doc.setFontSize(14);
  doc.text('Scores por Categoria', 20, 65);
  
  const tabelaScores = Object.entries(dados.scoresPorCategoria).map(([cat, score]) => [
    cat,
    score.media.toFixed(2),
    score.minimo.toFixed(2),
    score.maximo.toFixed(2),
    score.tendencia,
  ]);
  
  autoTable(doc, {
    head: [['Categoria', 'Média', 'Mínimo', 'Máximo', 'Tendência']],
    body: tabelaScores,
    startY: 70,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });
  
  // Evolução de Theta (nova página se necessário)
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  
  if (finalY > 200) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Evolução do Estado Emocional (Theta)', 20, 20);
  } else {
    doc.setFontSize(14);
    doc.text('Evolução do Estado Emocional (Theta)', 20, finalY + 15);
  }
  
  const tabelaTheta = dados.thetaEvolucao.slice(-10).map((item) => [
    item.data.toLocaleDateString(),
    item.theta.toFixed(3),
    `${(item.confianca * 100).toFixed(1)}%`,
  ]);
  
  autoTable(doc, {
    head: [['Data', 'Theta', 'Confiança']],
    body: tabelaTheta,
    startY: finalY > 200 ? 25 : finalY + 20,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });
  
  // Alertas
  const finalY2 = (doc as any).lastAutoTable.finalY || 160;
  doc.setFontSize(14);
  doc.text('Resumo de Alertas', 20, finalY2 + 15);
  doc.setFontSize(11);
  doc.text(`Total de alertas: ${dados.alertas.total}`, 25, finalY2 + 22);
  
  let yPos = finalY2 + 28;
  Object.entries(dados.alertas.porNivel).forEach(([nivel, qtd]) => {
    doc.text(`${nivel}: ${qtd}`, 25, yPos);
    yPos += 6;
  });
  
  // Rodapé
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${totalPages} | ClassCheck - Sistema de Avaliação Socioemocional`,
      20,
      285
    );
    doc.text(
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      20,
      290
    );
  }
  
  return doc.output('blob');
}
```

### 3. Criar `src/lib/export/excel-generator.ts`

```typescript
import * as XLSX from 'xlsx';

export interface DadosRelatorioExcel {
  usuario: {
    nome: string;
    email: string;
  };
  periodo: {
    inicio: Date;
    fim: Date;
  };
  scoresPorCategoria: Record<string, any>;
  thetaEvolucao: Array<any>;
  respostas: Array<{
    pergunta: string;
    resposta: string;
    categoria: string;
    data: Date;
  }>;
}

export function gerarRelatorioExcel(dados: DadosRelatorioExcel): ArrayBuffer {
  const wb = XLSX.utils.book_new();
  
  // Aba 1: Resumo
  const resumo = [
    ['Relatório Socioemocional - ClassCheck'],
    [''],
    ['Aluno:', dados.usuario.nome],
    ['Email:', dados.usuario.email],
    ['Período:', `${dados.periodo.inicio.toLocaleDateString()} - ${dados.periodo.fim.toLocaleDateString()}`],
    ['Gerado em:', new Date().toLocaleString('pt-BR')],
  ];
  const wsResumo = XLSX.utils.aoa_to_sheet(resumo);
  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');
  
  // Aba 2: Scores por Categoria
  const scores = Object.entries(dados.scoresPorCategoria).map(([cat, score]) => ({
    Categoria: cat,
    Média: score.media,
    Mínimo: score.minimo,
    Máximo: score.maximo,
    'Desvio Padrão': score.desvioPadrao || 0,
    Tendência: score.tendencia,
  }));
  const wsScores = XLSX.utils.json_to_sheet(scores);
  XLSX.utils.book_append_sheet(wb, wsScores, 'Scores');
  
  // Aba 3: Evolução Theta
  const evolucao = dados.thetaEvolucao.map((item) => ({
    Data: item.data.toLocaleDateString(),
    Theta: item.theta,
    Confiança: item.confianca,
    'Confiança %': `${(item.confianca * 100).toFixed(1)}%`,
  }));
  const wsEvolucao = XLSX.utils.json_to_sheet(evolucao);
  XLSX.utils.book_append_sheet(wb, wsEvolucao, 'Evolução');
  
  // Aba 4: Respostas Detalhadas
  if (dados.respostas && dados.respostas.length > 0) {
    const respostas = dados.respostas.map((r) => ({
      Data: r.data.toLocaleDateString(),
      Pergunta: r.pergunta,
      Resposta: r.resposta,
      Categoria: r.categoria,
    }));
    const wsRespostas = XLSX.utils.json_to_sheet(respostas);
    XLSX.utils.book_append_sheet(wb, wsRespostas, 'Respostas');
  }
  
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}
```

### 4. Criar API `/api/relatorios/export/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { gerarRelatorioPDF } from '@/lib/export/pdf-generator';
import { gerarRelatorioExcel } from '@/lib/export/excel-generator';
import { subMonths } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth();
    const { searchParams } = new URL(request.url);
    
    const formato = searchParams.get('formato') || 'pdf'; // pdf | excel | csv
    const periodo = Number(searchParams.get('periodo')) || 30; // dias
    
    const dataInicio = subMonths(new Date(), Math.floor(periodo / 30));
    
    // Buscar dados
    const sessoes = await prisma.sessaoAdaptativa.findMany({
      where: {
        usuarioId: usuario.id,
        status: 'COMPLETA',
        iniciadoEm: { gte: dataInicio },
      },
      include: {
        respostas: {
          include: {
            perguntaBanco: {
              select: { texto: true, categoria: true },
            },
          },
        },
      },
      orderBy: { iniciadoEm: 'asc' },
    });
    
    // Calcular scores por categoria
    const scoresPorCategoria: Record<string, any> = {};
    sessoes.forEach((sessao) => {
      sessao.respostas.forEach((resposta) => {
        const cat = resposta.categoria || 'GERAL';
        if (!scoresPorCategoria[cat]) {
          scoresPorCategoria[cat] = { valores: [], soma: 0, count: 0 };
        }
        scoresPorCategoria[cat].valores.push(resposta.valorNormalizado);
        scoresPorCategoria[cat].soma += resposta.valorNormalizado;
        scoresPorCategoria[cat].count++;
      });
    });
    
    Object.keys(scoresPorCategoria).forEach((cat) => {
      const valores = scoresPorCategoria[cat].valores;
      const media = scoresPorCategoria[cat].soma / scoresPorCategoria[cat].count;
      scoresPorCategoria[cat] = {
        media,
        minimo: Math.min(...valores),
        maximo: Math.max(...valores),
        desvioPadrao: calcularDesvioPadrao(valores, media),
        tendencia: 'ESTAVEL', // Calcular baseado em regressão linear
      };
    });
    
    // Theta evolução
    const thetaEvolucao = sessoes.map((s) => ({
      data: s.iniciadoEm,
      theta: s.thetaEstimado || 0,
      confianca: s.confianca || 0,
    }));
    
    // Alertas
    const alertas = await prisma.alertaSocioemocional.groupBy({
      by: ['nivel'],
      where: {
        usuarioId: usuario.id,
        criadoEm: { gte: dataInicio },
      },
      _count: true,
    });
    
    const dados = {
      usuario: {
        nome: usuario.nome,
        email: usuario.email,
      },
      periodo: {
        inicio: dataInicio,
        fim: new Date(),
      },
      scoresPorCategoria,
      thetaEvolucao,
      alertas: {
        total: alertas.reduce((sum, a) => sum + a._count, 0),
        porNivel: Object.fromEntries(alertas.map((a) => [a.nivel, a._count])),
      },
      respostas: sessoes.flatMap((s) =>
        s.respostas.map((r) => ({
          pergunta: r.perguntaBanco?.texto || 'Pergunta removida',
          resposta: r.valorOriginal?.toString() || '',
          categoria: r.categoria || 'GERAL',
          data: r.respondidoEm,
        }))
      ),
    };
    
    if (formato === 'pdf') {
      const pdfBlob = await gerarRelatorioPDF(dados);
      return new NextResponse(pdfBlob, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="relatorio-${usuario.nome.replace(/\s/g, '_')}.pdf"`,
        },
      });
    } else if (formato === 'excel') {
      const excelBuffer = gerarRelatorioExcel(dados);
      return new NextResponse(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="relatorio-${usuario.nome.replace(/\s/g, '_')}.xlsx"`,
        },
      });
    } else {
      return NextResponse.json({ erro: 'Formato inválido' }, { status: 400 });
    }
  } catch (erro) {
    console.error('[API Export] Erro:', erro);
    return NextResponse.json({ erro: 'Erro ao gerar relatório' }, { status: 500 });
  }
}

function calcularDesvioPadrao(valores: number[], media: number): number {
  const variancia = valores.reduce((sum, v) => sum + Math.pow(v - media, 2), 0) / valores.length;
  return Math.sqrt(variancia);
}
```

### 5. Adicionar Botões no Dashboard

```typescript
// src/app/dashboard/page.tsx (adicionar ao final)

'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function BotoesExportacao({ usuarioId }: { usuarioId: number }) {
  const handleExport = async (formato: 'pdf' | 'excel') => {
    const url = `/api/relatorios/export?formato=${formato}&periodo=30`;
    window.open(url, '_blank');
  };
  
  return (
    <div className="flex gap-2">
      <Button onClick={() => handleExport('pdf')} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
      <Button onClick={() => handleExport('excel')} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Exportar Excel
      </Button>
    </div>
  );
}
```

---

## ✅ Checklist de Validação

- [ ] Dependências instaladas (jspdf, xlsx)
- [ ] PDF gerado com cabeçalho, tabelas e rodapé
- [ ] Excel gerado com múltiplas abas
- [ ] API `/api/relatorios/export` funcional
- [ ] Botões de exportação nos dashboards
- [ ] Download automático funciona
- [ ] Dados reais do banco (não mock)
- [ ] Testes com 10+ sessões

---

## 🔧 Comandos Git

```bash
git checkout develop
git pull origin develop
git checkout -b feature/pdf-excel-export

npm install jspdf jspdf-autotable xlsx

# Criar arquivos acima

git add .
git commit -m "feat: implementar exportação de relatórios em PDF e Excel

- Adicionar jspdf e xlsx como dependências
- Criar pdf-generator.ts com geração profissional de PDFs
- Criar excel-generator.ts com múltiplas abas (Resumo, Scores, Evolução, Respostas)
- Implementar API /api/relatorios/export com formatos pdf/excel
- Adicionar botões de exportação no dashboard
- Incluir cabeçalho, rodapé e paginação em PDFs
- Calcular scores agregados por categoria
- Incluir evolução de theta e alertas nos relatórios
- Suportar download direto via window.open

Closes #[issue]"

git push origin feature/pdf-excel-export
```

---

**Próximo**: `SPRINT_03_DASHBOARD_PROFESSOR.md`
