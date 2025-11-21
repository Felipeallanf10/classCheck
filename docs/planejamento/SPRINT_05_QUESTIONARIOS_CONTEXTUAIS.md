# 🚀 SPRINT 5: Questionários Contextuais

**Branch**: `feature/contextual-questionnaires`  
**Prioridade**: 🟡 MÉDIA  
**Esforço**: 10-12 horas  
**Prazo**: Semana 5

---

## 🎯 Objetivos

- ✅ Criar 15 perguntas para CHECK_IN_DIARIO (1-2 min)
- ✅ Criar 18 perguntas para contexto AULA (3-5 min)
- ✅ Criar 12 perguntas para contexto EVENTO (2-3 min)
- ✅ Implementar templates não-adaptativos
- ✅ Sistema de agendamento de questionários
- ✅ **Total**: +45 perguntas validadas

---

## 📋 Tarefas

### 1. Criar `prisma/seeds/seed-checkin-diario.ts`

```typescript
import { PrismaClient, TipoPergunta, CategoriaPergunta } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCheckinDiario() {
  console.log('🌱 Seeding Check-in Diário...');

  const perguntas = [
    {
      codigo: 'CHECKIN_001',
      texto: 'Como você está se sentindo hoje?',
      categoria: 'HUMOR_GERAL' as CategoriaPergunta,
      tipoPergunta: 'LIKERT_10' as TipoPergunta,
      opcoes: Array.from({ length: 10 }, (_, i) => ({
        valor: i + 1,
        label: `${i + 1}`,
      })),
      configuracaoIRT: { discriminacao: 1.2, dificuldade: 0.0, acerto: 0.0 },
      valencia: 0.0,
      ativacao: 0.0,
      contexto: 'CHECK_IN_DIARIO',
    },
    {
      codigo: 'CHECKIN_002',
      texto: 'Como foi a qualidade do seu sono na última noite?',
      categoria: 'SONO' as CategoriaPergunta,
      tipoPergunta: 'LIKERT_5' as TipoPergunta,
      opcoes: [
        { valor: 1, label: 'Muito ruim' },
        { valor: 2, label: 'Ruim' },
        { valor: 3, label: 'Regular' },
        { valor: 4, label: 'Bom' },
        { valor: 5, label: 'Muito bom' },
      ],
      configuracaoIRT: { discriminacao: 1.5, dificuldade: -0.5, acerto: 0.0 },
      valencia: 0.6,
      ativacao: -0.4,
      contexto: 'CHECK_IN_DIARIO',
    },
    {
      codigo: 'CHECKIN_003',
      texto: 'Qual é o seu nível de energia agora?',
      categoria: 'HUMOR_GERAL' as CategoriaPergunta,
      tipoPergunta: 'LIKERT_5' as TipoPergunta,
      opcoes: [
        { valor: 1, label: 'Muito baixo' },
        { valor: 2, label: 'Baixo' },
        { valor: 3, label: 'Médio' },
        { valor: 4, label: 'Alto' },
        { valor: 5, label: 'Muito alto' },
      ],
      configuracaoIRT: { discriminacao: 1.4, dificuldade: 0.0, acerto: 0.0 },
      valencia: 0.5,
      ativacao: 0.8,
      contexto: 'CHECK_IN_DIARIO',
    },
    {
      codigo: 'CHECKIN_004',
      texto: 'Quão motivado(a) você está para estudar hoje?',
      categoria: 'ENGAJAMENTO' as CategoriaPergunta,
      tipoPergunta: 'LIKERT_5' as TipoPergunta,
      opcoes: [
        { valor: 1, label: 'Nada motivado' },
        { valor: 2, label: 'Pouco motivado' },
        { valor: 3, label: 'Moderadamente motivado' },
        { valor: 4, label: 'Muito motivado' },
        { valor: 5, label: 'Extremamente motivado' },
      ],
      configuracaoIRT: { discriminacao: 1.6, dificuldade: 0.2, acerto: 0.0 },
      valencia: 0.7,
      ativacao: 0.6,
      contexto: 'CHECK_IN_DIARIO',
    },
    {
      codigo: 'CHECKIN_005',
      texto: 'Algo está te preocupando hoje?',
      categoria: 'ANSIEDADE' as CategoriaPergunta,
      tipoPergunta: 'SIM_NAO' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Não' },
        { valor: 1, label: 'Sim' },
      ],
      configuracaoIRT: { discriminacao: 1.3, dificuldade: 0.5, acerto: 0.0 },
      valencia: -0.4,
      ativacao: 0.5,
      contexto: 'CHECK_IN_DIARIO',
    },
    // ... Adicionar mais 10 perguntas similares
  ];

  for (const pergunta of perguntas) {
    await prisma.bancoPerguntasAdaptativo.upsert({
      where: { codigo: pergunta.codigo },
      update: pergunta,
      create: pergunta,
    });
  }

  console.log('✅ Check-in Diário: 15 perguntas criadas');
}
```

### 2. Criar `prisma/seeds/seed-contexto-aula.ts`

```typescript
export async function seedContextoAula() {
  console.log('🌱 Seeding Contexto Aula...');

  const perguntas = [
    {
      codigo: 'AULA_001',
      texto: 'Quão interessante foi a aula de hoje?',
      categoria: 'ENGAJAMENTO',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Nada interessante' },
        { valor: 2, label: 'Pouco interessante' },
        { valor: 3, label: 'Moderadamente interessante' },
        { valor: 4, label: 'Muito interessante' },
        { valor: 5, label: 'Extremamente interessante' },
      ],
      configuracaoIRT: { discriminacao: 1.7, dificuldade: 0.0, acerto: 0.0 },
      valencia: 0.6,
      ativacao: 0.4,
      contexto: 'AULA',
    },
    {
      codigo: 'AULA_002',
      texto: 'Conseguiu acompanhar o conteúdo apresentado?',
      categoria: 'COMPREENSAO',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Não consegui acompanhar' },
        { valor: 2, label: 'Tive muita dificuldade' },
        { valor: 3, label: 'Acompanhei parcialmente' },
        { valor: 4, label: 'Acompanhei bem' },
        { valor: 5, label: 'Acompanhei perfeitamente' },
      ],
      configuracaoIRT: { discriminacao: 1.8, dificuldade: -0.2, acerto: 0.0 },
      valencia: 0.5,
      ativacao: 0.3,
      contexto: 'AULA',
    },
    // ... Adicionar mais 16 perguntas
  ];

  for (const pergunta of perguntas) {
    await prisma.bancoPerguntasAdaptativo.upsert({
      where: { codigo: pergunta.codigo },
      update: pergunta,
      create: pergunta,
    });
  }

  console.log('✅ Contexto Aula: 18 perguntas criadas');
}
```

### 3. Criar `prisma/seeds/seed-contexto-evento.ts`

```typescript
export async function seedContextoEvento() {
  console.log('🌱 Seeding Contexto Evento...');

  const perguntas = [
    {
      codigo: 'EVENTO_001',
      texto: 'Como você se sentiu durante o evento?',
      categoria: 'HUMOR_GERAL',
      tipoPergunta: 'EMOJI_PICKER',
      opcoes: [
        { valor: 1, label: '😢', emoji: '😢' },
        { valor: 2, label: '😕', emoji: '😕' },
        { valor: 3, label: '😐', emoji: '😐' },
        { valor: 4, label: '🙂', emoji: '🙂' },
        { valor: 5, label: '😄', emoji: '😄' },
      ],
      configuracaoIRT: { discriminacao: 1.5, dificuldade: 0.0, acerto: 0.0 },
      valencia: 0.0,
      ativacao: 0.0,
      contexto: 'EVENTO',
    },
    // ... Adicionar mais 11 perguntas
  ];

  for (const pergunta of perguntas) {
    await prisma.bancoPerguntasAdaptativo.upsert({
      where: { codigo: pergunta.codigo },
      update: pergunta,
      create: pergunta,
    });
  }

  console.log('✅ Contexto Evento: 12 perguntas criadas');
}
```

### 4. Criar Templates `src/lib/questionarios/templates.ts`

```typescript
export interface QuestionarioTemplate {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'AUTOAVALIACAO' | 'AVALIACAO_AULA' | 'CHECKIN' | 'EVENTO';
  adaptativo: boolean;
  perguntas: string[]; // Códigos das perguntas
  tempoEstimado: number; // minutos
  contexto: string;
}

export const TEMPLATE_CHECKIN_DIARIO: QuestionarioTemplate = {
  id: 'checkin-diario-v1',
  titulo: 'Check-in Diário',
  descricao: 'Acompanhamento rápido do seu bem-estar',
  tipo: 'CHECKIN',
  adaptativo: false,
  perguntas: [
    'CHECKIN_001', 'CHECKIN_002', 'CHECKIN_003', 'CHECKIN_004', 'CHECKIN_005',
    // ... todos os códigos
  ],
  tempoEstimado: 2,
  contexto: 'CHECK_IN_DIARIO',
};

export const TEMPLATE_AVALIACAO_AULA: QuestionarioTemplate = {
  id: 'avaliacao-aula-completa-v1',
  titulo: 'Avaliação de Aula',
  descricao: 'Feedback sobre a aula e seu aprendizado',
  tipo: 'AVALIACAO_AULA',
  adaptativo: false,
  perguntas: [
    'AULA_001', 'AULA_002', 'AULA_003',
    // ... todos os 18
  ],
  tempoEstimado: 5,
  contexto: 'AULA',
};

export const TEMPLATES_DISPONIVEIS = [
  TEMPLATE_CHECKIN_DIARIO,
  TEMPLATE_AVALIACAO_AULA,
  // ...
];
```

### 5. Sistema de Agendamento `src/lib/questionarios/scheduler.ts`

```typescript
export interface AgendamentoQuestionario {
  id: string;
  questionarioId: string;
  turmaId?: number;
  usuarioId?: number;
  frequencia: 'DIARIA' | 'SEMANAL' | 'QUINZENAL' | 'MENSAL' | 'UNICA';
  diasDaSemana?: number[]; // [0-6]
  horarios?: string[]; // ["09:00", "14:00"]
  dataInicio: Date;
  dataFim?: Date;
  ativo: boolean;
  notificar: boolean;
}

export async function agendarQuestionario(
  agendamento: Omit<AgendamentoQuestionario, 'id'>
): Promise<string> {
  const novoAgendamento = await prisma.agendamentoQuestionario.create({
    data: agendamento,
  });
  
  if (agendamento.notificar) {
    await criarNotificacoesAgendamento(novoAgendamento.id);
  }
  
  return novoAgendamento.id;
}
```

---

## ✅ Checklist de Validação

- [ ] 15 perguntas check-in criadas
- [ ] 18 perguntas aula criadas
- [ ] 12 perguntas evento criadas
- [ ] Templates implementados
- [ ] Sistema de agendamento funcional
- [ ] Seeds executam sem erros
- [ ] Perguntas calibradas com IRT
- [ ] Valencia/ativação definidas
- [ ] Total de 125+ perguntas no banco

---

## 🔧 Comandos Git

```bash
git checkout develop
git pull origin develop
git checkout -b feature/contextual-questionnaires

mkdir -p prisma/seeds
# Criar arquivos acima

npm run seed:contextos

git add .
git commit -m "feat: adicionar questionários contextuais (check-in, aula, evento)

- Criar seed-checkin-diario.ts com 15 perguntas curtas (1-2min)
- Criar seed-contexto-aula.ts com 18 perguntas de avaliação (3-5min)
- Criar seed-contexto-evento.ts com 12 perguntas de feedback (2-3min)
- Implementar templates de questionários não-adaptativos
- Criar sistema de agendamento de questionários
- Calibrar parâmetros IRT para novas perguntas
- Definir valencia/ativação conforme contexto
- Adicionar suporte a emoji picker para eventos

Total: +45 perguntas validadas (banco atinge 125+ perguntas)"

git push origin feature/contextual-questionnaires
```

---

**Próximo**: `SPRINT_06_REGRAS_ADAPTATIVAS.md`
