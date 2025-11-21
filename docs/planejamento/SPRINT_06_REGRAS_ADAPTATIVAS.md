# 🚀 SPRINT 6: Sistema de Regras Adaptativas Avançadas

**Branch**: `feature/advanced-adaptive-rules`  
**Esforço**: 12-14 horas  
**Prazo**: Semana 6  
**Dependências**: IRT Refinado, Banco Adaptativo  

---

## 🎯 Objetivos do Sprint

- ✅ Implementar 10+ regras adaptativas predefinidas
- ✅ Integrar json-rules-engine para gerenciamento de regras
- ✅ Criar dashboard de monitoramento `/admin/regras`
- ✅ Sistema de logs e auditoria de regras aplicadas
- ✅ Priorização e conflito de regras
- ✅ Testes de cenários complexos

---

## 📦 Instalação de Dependências

```bash
npm install json-rules-engine
npm install -D @types/json-rules-engine
```

---

## 🧠 Regras a Implementar

### 1. **Ansiedade Alta** (Prioridade: 9)
**Condição**: Score ANSIEDADE > 10  
**Ação**: Inserir 3 perguntas GAD-7 + Criar alerta laranja

### 2. **Depressão Severa** (Prioridade: 10)
**Condição**: Score PHQ-9 > 20  
**Ação**: Alerta crítico vermelho + Notificar coordenador + Suspender adaptação

### 3. **Confiança Alta** (Prioridade: 8)
**Condição**: Confiança > 95% E min 5 perguntas respondidas  
**Ação**: Terminar sessão precocemente

### 4. **Solidão Detectada** (Prioridade: 7)
**Condição**: Score RELACIONAMENTOS < -1.5  
**Ação**: Inserir UCLA-3 (3 perguntas sobre solidão)

### 5. **Inconsistência de Respostas** (Prioridade: 6)
**Condição**: Desvio padrão respostas > 2.5  
**Ação**: Reduzir confiança, ajustar theta para neutro

### 6. **Baixo Bem-Estar** (Prioridade: 8)
**Condição**: Score WHO-5 < 10  
**Ação**: Inserir perguntas complementares + Alerta amarelo

### 7. **Estresse Alto** (Prioridade: 7)
**Condição**: Score ESTRESSE > 15  
**Ação**: Inserir PSS-10 (10 perguntas sobre estresse)

### 8. **Autoestima Baixa** (Prioridade: 6)
**Condição**: Score AUTOESTIMA < -1.0  
**Ação**: Inserir Rosenberg Self-Esteem Scale (5 perguntas)

### 9. **Risco Suicida** (Prioridade: 10)
**Condição**: Resposta PHQ-9 pergunta 9 > 0  
**Ação**: Alerta vermelho crítico + Notificar imediato + Protocolo emergência

### 10. **Progresso Rápido** (Prioridade: 5)
**Condição**: Theta estabilizou em < 5 perguntas  
**Ação**: Reduzir número total de perguntas para 10

---

## 📂 Estrutura de Código

### Arquivo: `src/lib/adaptive/regras-predefinidas.ts`

```typescript
import { Engine, RuleProperties } from 'json-rules-engine';
import { prisma } from '@/lib/prisma';

export interface AcaoRegra {
  tipo: 'INSERIR_PERGUNTA' | 'CRIAR_ALERTA' | 'TERMINAR_SESSAO' | 'AJUSTAR_THETA' | 'NOTIFICAR';
  params: Record<string, any>;
}

export interface RegraAdaptativa extends RuleProperties {
  nome: string;
  descricao: string;
  prioridade: number; // 1-10 (10 = mais crítica)
  ativa: boolean;
  condicoes: any;
  acoes: AcaoRegra[];
}

// REGRA 1: Ansiedade Alta
export const REGRA_ANSIEDADE_ALTA: RegraAdaptativa = {
  nome: 'Detectar Ansiedade Alta',
  descricao: 'Insere perguntas GAD-7 quando score de ansiedade > 10',
  prioridade: 9,
  ativa: true,
  conditions: {
    all: [
      {
        fact: 'categoriaAtual',
        operator: 'equal',
        value: 'ANSIEDADE'
      },
      {
        fact: 'scoreAtual',
        operator: 'greaterThan',
        value: 10
      }
    ]
  },
  event: {
    type: 'ANSIEDADE_ALTA',
    params: {
      acoes: [
        { tipo: 'INSERIR_PERGUNTA', params: { escalas: ['GAD7'], quantidade: 3 } },
        { tipo: 'CRIAR_ALERTA', params: { nivel: 'LARANJA', mensagem: 'Ansiedade alta detectada' } }
      ]
    }
  }
};

// REGRA 2: Depressão Severa
export const REGRA_DEPRESSAO_SEVERA: RegraAdaptativa = {
  nome: 'Detectar Depressão Severa',
  descricao: 'Alerta crítico quando PHQ-9 > 20',
  prioridade: 10,
  ativa: true,
  conditions: {
    all: [
      {
        fact: 'escalaCorporal',
        operator: 'equal',
        value: 'PHQ9'
      },
      {
        fact: 'scoreTotal',
        operator: 'greaterThan',
        value: 20
      }
    ]
  },
  event: {
    type: 'DEPRESSAO_SEVERA',
    params: {
      acoes: [
        { tipo: 'CRIAR_ALERTA', params: { nivel: 'VERMELHO', mensagem: 'Depressão severa - PHQ-9 > 20' } },
        { tipo: 'NOTIFICAR', params: { destinatarios: ['coordenador', 'psicologo'], urgente: true } },
        { tipo: 'TERMINAR_SESSAO', params: { motivo: 'ALERTA_CRITICO' } }
      ]
    }
  }
};

// REGRA 3: Confiança Alta (Termino Precoce)
export const REGRA_CONFIANCA_ALTA: RegraAdaptativa = {
  nome: 'Termino Precoce - Alta Confiança',
  descricao: 'Finaliza sessão quando confiança > 95% e min 5 perguntas',
  prioridade: 8,
  ativa: true,
  conditions: {
    all: [
      {
        fact: 'confianca',
        operator: 'greaterThan',
        value: 0.95
      },
      {
        fact: 'perguntasRespondidas',
        operator: 'greaterThanInclusive',
        value: 5
      }
    ]
  },
  event: {
    type: 'CONFIANCA_ALTA',
    params: {
      acoes: [
        { tipo: 'TERMINAR_SESSAO', params: { motivo: 'CONFIANCA_ALTA', mensagem: 'Estimativa estável alcançada' } }
      ]
    }
  }
};

// REGRA 9: Risco Suicida
export const REGRA_RISCO_SUICIDA: RegraAdaptativa = {
  nome: 'Detectar Risco Suicida',
  descricao: 'Alerta vermelho crítico quando PHQ-9 item 9 > 0',
  prioridade: 10,
  ativa: true,
  conditions: {
    all: [
      {
        fact: 'perguntaId',
        operator: 'equal',
        value: 'PHQ9_9' // "Pensamentos de morte ou autoagressão"
      },
      {
        fact: 'valorResposta',
        operator: 'greaterThan',
        value: 0
      }
    ]
  },
  event: {
    type: 'RISCO_SUICIDA',
    params: {
      acoes: [
        { tipo: 'CRIAR_ALERTA', params: { nivel: 'VERMELHO', severidade: 'CRITICA', mensagem: 'RISCO SUICIDA DETECTADO - PHQ-9 item 9' } },
        { tipo: 'NOTIFICAR', params: { destinatarios: ['coordenador', 'psicologo', 'responsavel'], urgente: true, protocolo: 'EMERGENCIA' } },
        { tipo: 'TERMINAR_SESSAO', params: { motivo: 'PROTOCOLO_EMERGENCIA' } }
      ]
    }
  }
};

// TODAS AS REGRAS
export const REGRAS_PREDEFINIDAS: RegraAdaptativa[] = [
  REGRA_ANSIEDADE_ALTA,
  REGRA_DEPRESSAO_SEVERA,
  REGRA_CONFIANCA_ALTA,
  // ... (adicionar todas as 10 regras)
];

// Engine de execução
export async function aplicarRegrasAdaptativas(
  sessaoId: string,
  facts: Record<string, any>
): Promise<AcaoRegra[]> {
  const engine = new Engine();
  
  // Adicionar todas as regras ativas
  REGRAS_PREDEFINIDAS
    .filter(regra => regra.ativa)
    .sort((a, b) => b.prioridade - a.prioridade) // Ordenar por prioridade
    .forEach(regra => {
      engine.addRule(regra);
    });
  
  // Executar engine
  const { events } = await engine.run(facts);
  
  // Extrair ações
  const acoes: AcaoRegra[] = [];
  events.forEach(event => {
    if (event.params?.acoes) {
      acoes.push(...event.params.acoes);
    }
  });
  
  // Log de auditoria
  await prisma.logAdaptativo.create({
    data: {
      sessaoId,
      tipo: 'REGRAS_APLICADAS',
      detalhes: {
        facts,
        regrasAcionadas: events.map(e => e.type),
        acoesGeradas: acoes
      }
    }
  });
  
  return acoes;
}

// Executar ações
export async function executarAcoes(sessaoId: string, acoes: AcaoRegra[]) {
  for (const acao of acoes) {
    switch (acao.tipo) {
      case 'INSERIR_PERGUNTA':
        await inserirPerguntasEscala(sessaoId, acao.params);
        break;
      case 'CRIAR_ALERTA':
        await criarAlertaSocioemocional(sessaoId, acao.params);
        break;
      case 'TERMINAR_SESSAO':
        await finalizarSessao(sessaoId, acao.params.motivo);
        break;
      case 'AJUSTAR_THETA':
        await ajustarThetaSessao(sessaoId, acao.params);
        break;
      case 'NOTIFICAR':
        await enviarNotificacoes(sessaoId, acao.params);
        break;
    }
  }
}
```

---

## 🖥️ Dashboard de Monitoramento

### Arquivo: `src/app/admin/regras/page.tsx`

```typescript
import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { REGRAS_PREDEFINIDAS } from '@/lib/adaptive/regras-predefinidas';

export default async function RegrasPage() {
  // Estatísticas de acionamento
  const logs = await prisma.logAdaptativo.findMany({
    where: {
      tipo: 'REGRAS_APLICADAS',
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Últimos 30 dias
    },
    select: { detalhes: true, createdAt: true }
  });
  
  // Contar acionamentos por regra
  const estatisticas = new Map<string, { count: number; ultimoAcionamento: Date }>();
  logs.forEach(log => {
    const regrasAcionadas = (log.detalhes as any)?.regrasAcionadas || [];
    regrasAcionadas.forEach((regra: string) => {
      if (!estatisticas.has(regra)) {
        estatisticas.set(regra, { count: 0, ultimoAcionamento: log.createdAt });
      }
      const stat = estatisticas.get(regra)!;
      stat.count++;
      if (log.createdAt > stat.ultimoAcionamento) {
        stat.ultimoAcionamento = log.createdAt;
      }
    });
  });
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sistema de Regras Adaptativas</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Regras Ativas ({REGRAS_PREDEFINIDAS.filter(r => r.ativa).length}/{REGRAS_PREDEFINIDAS.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Regra</TableCell>
                <TableCell>Prioridade</TableCell>
                <TableCell>Acionamentos (30d)</TableCell>
                <TableCell>Último Acionamento</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REGRAS_PREDEFINIDAS.map(regra => {
                const stat = estatisticas.get(regra.event.type);
                return (
                  <TableRow key={regra.nome}>
                    <TableCell>{regra.nome}</TableCell>
                    <TableCell>
                      <Badge variant={regra.prioridade >= 8 ? 'destructive' : 'default'}>
                        {regra.prioridade}
                      </Badge>
                    </TableCell>
                    <TableCell>{stat?.count || 0}</TableCell>
                    <TableCell>
                      {stat?.ultimoAcionamento
                        ? new Date(stat.ultimoAcionamento).toLocaleString('pt-BR')
                        : 'Nunca'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={regra.ativa ? 'success' : 'secondary'}>
                        {regra.ativa ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## ✅ Checklist de Validação

- [ ] **10+ regras criadas** com condições e ações corretas
- [ ] **json-rules-engine integrado** e testado
- [ ] **Dashboard `/admin/regras`** funcional e visual
- [ ] **Logs salvos** em `LogAdaptativo` com detalhes completos
- [ ] **Performance < 100ms** para executar engine (10 regras)
- [ ] **Testes de cenários**:
  - [ ] Ansiedade alta → Insere GAD-7
  - [ ] PHQ-9 > 20 → Alerta vermelho + notifica
  - [ ] Confiança > 95% → Termina precocemente
  - [ ] Risco suicida → Protocolo emergência
- [ ] **Priorização funciona** (regras críticas executam primeiro)
- [ ] **Conflitos resolvidos** (regras conflitantes não geram ações duplicadas)

---

## 🔧 Workflow Git

```bash
# 1. Criar branch
git checkout develop
git pull origin develop
git checkout -b feature/advanced-adaptive-rules

# 2. Implementar
# - Criar src/lib/adaptive/regras-predefinidas.ts
# - Criar src/app/admin/regras/page.tsx
# - Adicionar testes em src/__tests__/adaptive/regras.test.ts

# 3. Commit semântico
git add .
git commit -m "feat: expandir sistema de regras adaptativas

- 10+ regras predefinidas (ansiedade, depressão, solidão, estresse, etc)
- Integração json-rules-engine
- Dashboard monitoramento /admin/regras
- Logs auditoria com detalhes de acionamento
- Sistema de prioridades 1-10
- Detecção risco suicida com protocolo emergência
- Testes cenários complexos"

# 4. Push e PR
git push origin feature/advanced-adaptive-rules
# Criar PR para develop
# Aprovar e merge
```

---

## 📊 Métricas de Sucesso

- **Cobertura de regras**: 100% das situações críticas cobertas
- **Taxa de acionamento**: Pelo menos 5 regras acionadas em 100 sessões
- **Performance**: < 100ms para executar engine completo
- **Falsos positivos**: < 5% (regras não devem acionar incorretamente)
- **Logs completos**: 100% das decisões auditáveis

---

**Próximo Sprint**: Sprint 7 - APIs Faltantes de Relatórios
