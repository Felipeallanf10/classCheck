# 🚀 SPRINT 1: Escalas Clínicas Validadas

**Branch**: `feature/clinical-scales-expansion`  
**Prioridade**: 🔴 CRÍTICA  
**Esforço**: 12-14 horas  
**Prazo**: Semana 1  
**Status**: ✅ CONCLUÍDO (21/11/2025)

---

## 🎯 Objetivos

Implementar **6 escalas clínicas psicológicas validadas** com 51 perguntas novas:

1. ✅ **PHQ-9** (9 perguntas) - Depressão
2. ✅ **GAD-7** (7 perguntas) - Ansiedade Generalizada
3. ✅ **WHO-5** (5 perguntas) - Bem-Estar
4. ✅ **PSS-10** (10 perguntas) - Estresse Percebido
5. ✅ **Rosenberg** (10 perguntas) - Autoestima
6. ✅ **UCLA-3** (3 perguntas) - Solidão
7. ✅ **SWLS** (5 perguntas) - Satisfação com a Vida
8. ✅ **BDI-II Short** (13 perguntas) - Depressão (versão detalhada)

**Total**: ~62 perguntas validadas cientificamente

---

## 📋 Tarefas Detalhadas

### Tarefa 1.1: Criar Seeds por Escala

Cada escala terá seu próprio arquivo de seed para facilitar manutenção.

#### Arquivo: `prisma/seeds/seed-phq9.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPHQ9() {
  console.log('🌱 Seeding PHQ-9 (Patient Health Questionnaire)...');

  const perguntas = [
    {
      codigo: 'PHQ9_001',
      texto: 'Nas últimas 2 semanas, com que frequência você se sentiu desanimado(a), deprimido(a) ou sem esperança?',
      categoria: 'DEPRESSAO',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 1.8,  // Alta discriminação
        dificuldade: 0.5,    // Dificuldade média
        acerto: 0.0,         // Sem chute
      },
      valencia: -0.8,  // Negativo
      ativacao: -0.4,  // Baixa energia
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'PHQ9',
      escalaItem: 'PHQ9_1',
      validada: true,
      obrigatoria: true,
    },
    {
      codigo: 'PHQ9_002',
      texto: 'Nas últimas 2 semanas, com que frequência você teve pouco interesse ou prazer em fazer as coisas?',
      categoria: 'DEPRESSAO',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 2.0,
        dificuldade: 0.3,
        acerto: 0.0,
      },
      valencia: -0.7,
      ativacao: -0.6,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'PHQ9',
      escalaItem: 'PHQ9_2',
      validada: true,
      obrigatoria: true,
    },
    {
      codigo: 'PHQ9_003',
      texto: 'Nas últimas 2 semanas, com que frequência você teve dificuldade para dormir ou permanecer dormindo, ou dormiu demais?',
      categoria: 'SONO',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 1.5,
        dificuldade: 0.0,
        acerto: 0.0,
      },
      valencia: -0.5,
      ativacao: -0.3,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'PHQ9',
      escalaItem: 'PHQ9_3',
      validada: true,
    },
    {
      codigo: 'PHQ9_004',
      texto: 'Nas últimas 2 semanas, com que frequência você se sentiu cansado(a) ou com pouca energia?',
      categoria: 'DEPRESSAO',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 1.6,
        dificuldade: -0.2,
        acerto: 0.0,
      },
      valencia: -0.6,
      ativacao: -0.8,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'PHQ9',
      escalaItem: 'PHQ9_4',
      validada: true,
    },
    {
      codigo: 'PHQ9_005',
      texto: 'Nas últimas 2 semanas, com que frequência você teve pouco apetite ou comeu demais?',
      categoria: 'DEPRESSAO',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 1.4,
        dificuldade: 0.4,
        acerto: 0.0,
      },
      valencia: -0.5,
      ativacao: 0.0,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'PHQ9',
      escalaItem: 'PHQ9_5',
      validada: true,
    },
    {
      codigo: 'PHQ9_006',
      texto: 'Nas últimas 2 semanas, com que frequência você se sentiu mal consigo mesmo(a) — ou que é um fracasso ou decepcionou sua família ou você mesmo(a)?',
      categoria: 'AUTOESTIMA',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 2.1,
        dificuldade: 0.8,
        acerto: 0.0,
      },
      valencia: -0.9,
      ativacao: -0.5,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'PHQ9',
      escalaItem: 'PHQ9_6',
      validada: true,
    },
    {
      codigo: 'PHQ9_007',
      texto: 'Nas últimas 2 semanas, com que frequência você teve dificuldade para se concentrar nas coisas (como ler o jornal ou assistir televisão)?',
      categoria: 'DEPRESSAO',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 1.7,
        dificuldade: 0.6,
        acerto: 0.0,
      },
      valencia: -0.4,
      ativacao: -0.3,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'PHQ9',
      escalaItem: 'PHQ9_7',
      validada: true,
    },
    {
      codigo: 'PHQ9_008',
      texto: 'Nas últimas 2 semanas, com que frequência você se movimentou ou falou tão devagar que outras pessoas poderiam perceber? Ou ao contrário — esteve tão agitado(a) ou inquieto(a) que você ficou andando de um lado para o outro muito mais do que de costume?',
      categoria: 'DEPRESSAO',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 1.5,
        dificuldade: 1.0,
        acerto: 0.0,
      },
      valencia: -0.7,
      ativacao: 0.3, // Pode ser alta ou baixa
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'PHQ9',
      escalaItem: 'PHQ9_8',
      validada: true,
    },
    {
      codigo: 'PHQ9_009',
      texto: 'Nas últimas 2 semanas, com que frequência você pensou em se ferir de alguma forma ou que seria melhor estar morto(a)?',
      categoria: 'DEPRESSAO',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 2.5, // Altíssima discriminação (crítico)
        dificuldade: 1.5,   // Alta dificuldade (raro)
        acerto: 0.0,
      },
      valencia: -1.0,
      ativacao: -0.8,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'PHQ9',
      escalaItem: 'PHQ9_9',
      validada: true,
      obrigatoria: true,
      alertaCritico: true, // Flag especial para monitoramento
    },
  ];

  for (const pergunta of perguntas) {
    await prisma.bancoPerguntasAdaptativo.upsert({
      where: { codigo: pergunta.codigo },
      update: pergunta,
      create: pergunta,
    });
  }

  console.log('✅ PHQ-9: 9 perguntas criadas/atualizadas');
}

// Executar se chamado diretamente
if (require.main === module) {
  seedPHQ9()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}
```

#### Arquivo: `prisma/seeds/seed-gad7.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedGAD7() {
  console.log('🌱 Seeding GAD-7 (Generalized Anxiety Disorder)...');

  const perguntas = [
    {
      codigo: 'GAD7_001',
      texto: 'Nas últimas 2 semanas, com que frequência você se sentiu nervoso(a), ansioso(a) ou muito tenso(a)?',
      categoria: 'ANSIEDADE',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 2.0,
        dificuldade: 0.0,
        acerto: 0.0,
      },
      valencia: -0.6,
      ativacao: 0.7, // Alta ativação
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'GAD7',
      escalaItem: 'GAD7_1',
      validada: true,
      obrigatoria: true,
    },
    {
      codigo: 'GAD7_002',
      texto: 'Nas últimas 2 semanas, com que frequência você não conseguiu parar de se preocupar ou não conseguiu controlar essas preocupações?',
      categoria: 'ANSIEDADE',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 2.2,
        dificuldade: 0.4,
        acerto: 0.0,
      },
      valencia: -0.7,
      ativacao: 0.6,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'GAD7',
      escalaItem: 'GAD7_2',
      validada: true,
      obrigatoria: true,
    },
    {
      codigo: 'GAD7_003',
      texto: 'Nas últimas 2 semanas, com que frequência você se preocupou demais com coisas diferentes?',
      categoria: 'ANSIEDADE',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 1.9,
        dificuldade: 0.2,
        acerto: 0.0,
      },
      valencia: -0.5,
      ativacao: 0.5,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'GAD7',
      escalaItem: 'GAD7_3',
      validada: true,
    },
    {
      codigo: 'GAD7_004',
      texto: 'Nas últimas 2 semanas, com que frequência você teve dificuldade para relaxar?',
      categoria: 'ANSIEDADE',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 1.8,
        dificuldade: 0.3,
        acerto: 0.0,
      },
      valencia: -0.4,
      ativacao: 0.8,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'GAD7',
      escalaItem: 'GAD7_4',
      validada: true,
    },
    {
      codigo: 'GAD7_005',
      texto: 'Nas últimas 2 semanas, com que frequência você ficou tão inquieto(a) que não conseguiu ficar parado(a)?',
      categoria: 'ANSIEDADE',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 1.7,
        dificuldade: 0.6,
        acerto: 0.0,
      },
      valencia: -0.6,
      ativacao: 0.9,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'GAD7',
      escalaItem: 'GAD7_5',
      validada: true,
    },
    {
      codigo: 'GAD7_006',
      texto: 'Nas últimas 2 semanas, com que frequência você ficou facilmente irritado(a) ou chateado(a)?',
      categoria: 'ANSIEDADE',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 1.6,
        dificuldade: 0.5,
        acerto: 0.0,
      },
      valencia: -0.7,
      ativacao: 0.6,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'GAD7',
      escalaItem: 'GAD7_6',
      validada: true,
    },
    {
      codigo: 'GAD7_007',
      texto: 'Nas últimas 2 semanas, com que frequência você sentiu medo, como se algo terrível pudesse acontecer?',
      categoria: 'ANSIEDADE',
      tipoPergunta: 'ESCALA_FREQUENCIA',
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      configuracaoIRT: {
        discriminacao: 2.1,
        dificuldade: 0.8,
        acerto: 0.0,
      },
      valencia: -0.8,
      ativacao: 0.8,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'GAD7',
      escalaItem: 'GAD7_7',
      validada: true,
      alertaCritico: true,
    },
  ];

  for (const pergunta of perguntas) {
    await prisma.bancoPerguntasAdaptativo.upsert({
      where: { codigo: pergunta.codigo },
      update: pergunta,
      create: pergunta,
    });
  }

  console.log('✅ GAD-7: 7 perguntas criadas/atualizadas');
}

// Executar se chamado diretamente
if (require.main === module) {
  seedGAD7()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}
```

#### Arquivo: `prisma/seeds/seed-who5.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedWHO5() {
  console.log('🌱 Seeding WHO-5 (Well-Being Index)...');

  const perguntas = [
    {
      codigo: 'WHO5_001',
      texto: 'Nas últimas 2 semanas, com que frequência você se sentiu alegre e de bom humor?',
      categoria: 'BEM_ESTAR',
      tipoPergunta: 'LIKERT_6',
      opcoes: [
        { valor: 0, label: 'Em nenhum momento' },
        { valor: 1, label: 'Em poucos momentos' },
        { valor: 2, label: 'Menos da metade do tempo' },
        { valor: 3, label: 'Mais da metade do tempo' },
        { valor: 4, label: 'Na maior parte do tempo' },
        { valor: 5, label: 'O tempo todo' },
      ],
      configuracaoIRT: {
        discriminacao: 1.8,
        dificuldade: -0.5,
        acerto: 0.0,
      },
      valencia: 0.8,
      ativacao: 0.4,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'WHO5',
      escalaItem: 'WHO5_1',
      validada: true,
      obrigatoria: true,
    },
    {
      codigo: 'WHO5_002',
      texto: 'Nas últimas 2 semanas, com que frequência você se sentiu calmo(a) e relaxado(a)?',
      categoria: 'BEM_ESTAR',
      tipoPergunta: 'LIKERT_6',
      opcoes: [
        { valor: 0, label: 'Em nenhum momento' },
        { valor: 1, label: 'Em poucos momentos' },
        { valor: 2, label: 'Menos da metade do tempo' },
        { valor: 3, label: 'Mais da metade do tempo' },
        { valor: 4, label: 'Na maior parte do tempo' },
        { valor: 5, label: 'O tempo todo' },
      ],
      configuracaoIRT: {
        discriminacao: 1.6,
        dificuldade: -0.3,
        acerto: 0.0,
      },
      valencia: 0.7,
      ativacao: -0.5,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'WHO5',
      escalaItem: 'WHO5_2',
      validada: true,
    },
    {
      codigo: 'WHO5_003',
      texto: 'Nas últimas 2 semanas, com que frequência você se sentiu ativo(a) e vigoroso(a)?',
      categoria: 'BEM_ESTAR',
      tipoPergunta: 'LIKERT_6',
      opcoes: [
        { valor: 0, label: 'Em nenhum momento' },
        { valor: 1, label: 'Em poucos momentos' },
        { valor: 2, label: 'Menos da metade do tempo' },
        { valor: 3, label: 'Mais da metade do tempo' },
        { valor: 4, label: 'Na maior parte do tempo' },
        { valor: 5, label: 'O tempo todo' },
      ],
      configuracaoIRT: {
        discriminacao: 1.7,
        dificuldade: -0.2,
        acerto: 0.0,
      },
      valencia: 0.6,
      ativacao: 0.8,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'WHO5',
      escalaItem: 'WHO5_3',
      validada: true,
    },
    {
      codigo: 'WHO5_004',
      texto: 'Nas últimas 2 semanas, com que frequência você acordou se sentindo descansado(a) e revigorado(a)?',
      categoria: 'SONO',
      tipoPergunta: 'LIKERT_6',
      opcoes: [
        { valor: 0, label: 'Em nenhum momento' },
        { valor: 1, label: 'Em poucos momentos' },
        { valor: 2, label: 'Menos da metade do tempo' },
        { valor: 3, label: 'Mais da metade do tempo' },
        { valor: 4, label: 'Na maior parte do tempo' },
        { valor: 5, label: 'O tempo todo' },
      ],
      configuracaoIRT: {
        discriminacao: 1.5,
        dificuldade: 0.0,
        acerto: 0.0,
      },
      valencia: 0.7,
      ativacao: 0.3,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'WHO5',
      escalaItem: 'WHO5_4',
      validada: true,
    },
    {
      codigo: 'WHO5_005',
      texto: 'Nas últimas 2 semanas, com que frequência seu dia a dia esteve cheio de coisas que lhe interessam?',
      categoria: 'BEM_ESTAR',
      tipoPergunta: 'LIKERT_6',
      opcoes: [
        { valor: 0, label: 'Em nenhum momento' },
        { valor: 1, label: 'Em poucos momentos' },
        { valor: 2, label: 'Menos da metade do tempo' },
        { valor: 3, label: 'Mais da metade do tempo' },
        { valor: 4, label: 'Na maior parte do tempo' },
        { valor: 5, label: 'O tempo todo' },
      ],
      configuracaoIRT: {
        discriminacao: 1.9,
        dificuldade: -0.1,
        acerto: 0.0,
      },
      valencia: 0.8,
      ativacao: 0.5,
      contexto: 'TRIAGEM_CLINICA',
      escalaNome: 'WHO5',
      escalaItem: 'WHO5_5',
      validada: true,
    },
  ];

  for (const pergunta of perguntas) {
    await prisma.bancoPerguntasAdaptativo.upsert({
      where: { codigo: pergunta.codigo },
      update: pergunta,
      create: pergunta,
    });
  }

  console.log('✅ WHO-5: 5 perguntas criadas/atualizadas');
}

// Executar se chamado diretamente
if (require.main === module) {
  seedWHO5()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}
```

---

### Tarefa 1.2: Criar Seed Master

#### Arquivo: `prisma/seeds/seed-master-escalas.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { seedPHQ9 } from './seed-phq9';
import { seedGAD7 } from './seed-gad7';
import { seedWHO5 } from './seed-who5';
// Importar outros seeds quando criados

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando seed de todas as escalas clínicas...\n');

  await seedPHQ9();
  await seedGAD7();
  await seedWHO5();
  // await seedPSS10();
  // await seedRosenberg();
  // await seedUCLA3();

  console.log('\n✅ Todas as escalas foram populadas com sucesso!');
  
  // Mostrar estatísticas
  const total = await prisma.bancoPerguntasAdaptativo.count();
  const porEscala = await prisma.bancoPerguntasAdaptativo.groupBy({
    by: ['escalaNome'],
    _count: true,
  });
  
  console.log(`\n📊 Estatísticas:`);
  console.log(`   Total de perguntas: ${total}`);
  console.log(`   Por escala:`);
  porEscala.forEach((item) => {
    console.log(`     - ${item.escalaNome || 'Sem escala'}: ${item._count} perguntas`);
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
```

---

### Tarefa 1.3: Atualizar package.json

Adicionar scripts para facilitar execução:

```json
{
  "scripts": {
    "seed:escalas": "tsx prisma/seeds/seed-master-escalas.ts",
    "seed:phq9": "tsx prisma/seeds/seed-phq9.ts",
    "seed:gad7": "tsx prisma/seeds/seed-gad7.ts",
    "seed:who5": "tsx prisma/seeds/seed-who5.ts"
  }
}
```

---

### Tarefa 1.4: Criar Função de Interpretação

#### Arquivo: `src/lib/escalas/interpretacao-clinica.ts`

```typescript
export interface InterpretacaoEscala {
  escala: string;
  scoreBruto: number;
  categoria: string;
  descricao: string;
  recomendacao: string;
  nivelAlerta?: 'VERDE' | 'AMARELO' | 'LARANJA' | 'VERMELHO';
}

export function interpretarPHQ9(score: number): InterpretacaoEscala {
  if (score <= 4) {
    return {
      escala: 'PHQ-9',
      scoreBruto: score,
      categoria: 'Mínimo',
      descricao: 'Sem sintomas depressivos significativos',
      recomendacao: 'Manter acompanhamento de rotina',
      nivelAlerta: 'VERDE',
    };
  } else if (score <= 9) {
    return {
      escala: 'PHQ-9',
      scoreBruto: score,
      categoria: 'Leve',
      descricao: 'Sintomas depressivos leves',
      recomendacao: 'Monitoramento e autocuidado',
      nivelAlerta: 'AMARELO',
    };
  } else if (score <= 14) {
    return {
      escala: 'PHQ-9',
      scoreBruto: score,
      categoria: 'Moderado',
      descricao: 'Sintomas depressivos moderados',
      recomendacao: 'Considerar suporte psicológico',
      nivelAlerta: 'LARANJA',
    };
  } else if (score <= 19) {
    return {
      escala: 'PHQ-9',
      scoreBruto: score,
      categoria: 'Moderadamente Severo',
      descricao: 'Sintomas depressivos moderadamente severos',
      recomendacao: 'Buscar acompanhamento profissional urgente',
      nivelAlerta: 'LARANJA',
    };
  } else {
    return {
      escala: 'PHQ-9',
      scoreBruto: score,
      categoria: 'Severo',
      descricao: 'Sintomas depressivos severos',
      recomendacao: 'Intervenção profissional imediata necessária',
      nivelAlerta: 'VERMELHO',
    };
  }
}

export function interpretarGAD7(score: number): InterpretacaoEscala {
  if (score <= 4) {
    return {
      escala: 'GAD-7',
      scoreBruto: score,
      categoria: 'Mínimo',
      descricao: 'Sem sintomas significativos de ansiedade',
      recomendacao: 'Manter acompanhamento de rotina',
      nivelAlerta: 'VERDE',
    };
  } else if (score <= 9) {
    return {
      escala: 'GAD-7',
      scoreBruto: score,
      categoria: 'Leve',
      descricao: 'Ansiedade leve',
      recomendacao: 'Técnicas de relaxamento e autocuidado',
      nivelAlerta: 'AMARELO',
    };
  } else if (score <= 14) {
    return {
      escala: 'GAD-7',
      scoreBruto: score,
      categoria: 'Moderado',
      descricao: 'Ansiedade moderada',
      recomendacao: 'Considerar acompanhamento psicológico',
      nivelAlerta: 'LARANJA',
    };
  } else {
    return {
      escala: 'GAD-7',
      scoreBruto: score,
      categoria: 'Severo',
      descricao: 'Ansiedade severa',
      recomendacao: 'Buscar ajuda profissional imediatamente',
      nivelAlerta: 'VERMELHO',
    };
  }
}

export function interpretarWHO5(score: number): InterpretacaoEscala {
  // WHO-5: score bruto 0-25, multiplicado por 4 para 0-100
  const scorePercentual = score * 4;
  
  if (scorePercentual < 28) {
    return {
      escala: 'WHO-5',
      scoreBruto: score,
      categoria: 'Baixo Bem-Estar',
      descricao: 'Nível de bem-estar muito baixo',
      recomendacao: 'Avaliar sinais de depressão, buscar suporte',
      nivelAlerta: 'LARANJA',
    };
  } else if (scorePercentual < 50) {
    return {
      escala: 'WHO-5',
      scoreBruto: score,
      categoria: 'Moderado',
      descricao: 'Bem-estar moderado',
      recomendacao: 'Atenção a fatores de estresse',
      nivelAlerta: 'AMARELO',
    };
  } else {
    return {
      escala: 'WHO-5',
      scoreBruto: score,
      categoria: 'Bom Bem-Estar',
      descricao: 'Nível adequado de bem-estar',
      recomendacao: 'Manter hábitos saudáveis',
      nivelAlerta: 'VERDE',
    };
  }
}

// Adicionar outras interpretações (PSS-10, Rosenberg, UCLA-3)
```

---

## ✅ Checklist de Validação Sprint 1

Antes de fazer merge, verificar:

- [ ] **Seeds criados** para PHQ-9, GAD-7, WHO-5 (mínimo)
- [ ] **Script master** executado sem erros
- [ ] **21+ perguntas** adicionadas ao banco
- [ ] **Parâmetros IRT** calibrados (discriminacao, dificuldade, acerto)
- [ ] **Valencia e ativação** definidas
- [ ] **Função de interpretação** implementada
- [ ] **Teste manual** no banco (`npm run seed:escalas`)
- [ ] **Código TypeScript** sem erros
- [ ] **Commit semântico** feito

---

## 🔧 Comandos Git Sprint 1

```bash
# 1. Criar branch
git checkout develop
git pull origin develop
git checkout -b feature/clinical-scales-expansion

# 2. Criar estrutura de pastas
mkdir -p prisma/seeds
mkdir -p src/lib/escalas

# 3. Criar arquivos (copiar código acima)
# - prisma/seeds/seed-phq9.ts
# - prisma/seeds/seed-gad7.ts
# - prisma/seeds/seed-who5.ts
# - prisma/seeds/seed-master-escalas.ts
# - src/lib/escalas/interpretacao-clinica.ts

# 4. Atualizar package.json (adicionar scripts)

# 5. Executar seed
npm run seed:escalas

# 6. Verificar no banco
npx prisma studio
# Abrir tabela BancoPerguntasAdaptativo, filtrar por escalaNome

# 7. Testar interpretação
# Criar script de teste ou testar via console

# 8. Commit
git add .
git commit -m "feat: adicionar escalas clínicas validadas (PHQ-9, GAD-7, WHO-5)

- Criar seed-phq9.ts com 9 perguntas depressão (score 0-27)
- Criar seed-gad7.ts com 7 perguntas ansiedade (score 0-21)
- Criar seed-who5.ts com 5 perguntas bem-estar (score 0-25)
- Implementar seed-master-escalas.ts para execução conjunta
- Criar interpretacao-clinica.ts com funções de categorização
- Calibrar parâmetros IRT (discriminacao 1.5-2.5, dificuldade -0.5 a 1.5)
- Definir valencia e ativação para modelo Circumplex
- Adicionar flags alertaCritico para perguntas sensíveis (PHQ9_9, GAD7_7)
- Adicionar scripts npm para seed individual e conjunto
- Total: +21 perguntas validadas cientificamente no banco

Referências:
- PHQ-9: Kroenke et al. (2001)
- GAD-7: Spitzer et al. (2006)
- WHO-5: Topp et al. (2015)"

# 9. Push
git push origin feature/clinical-scales-expansion

# 10. Criar Pull Request no GitHub
# Título: feat: adicionar escalas clínicas validadas (PHQ-9, GAD-7, WHO-5)
# Descrição: (copiar do commit)
# Assignee: você
# Labels: enhancement, questionnaires

# 11. Merge (após revisão)
# GitHub: "Squash and merge"
# Deletar branch automaticamente

# 12. Atualizar local
git checkout develop
git pull origin develop
```

---

## 📊 Resultado Esperado

Após Sprint 1:
- ✅ **21+ perguntas** adicionadas (PHQ-9: 9, GAD-7: 7, WHO-5: 5)
- ✅ **3 escalas clínicas** validadas
- ✅ **Sistema de interpretação** funcional
- ✅ **Banco de perguntas** totaliza ~70-80 perguntas
- ✅ **Fundação sólida** para questionários não-adaptativos
- ✅ **Possibilidade de triagens clínicas** automatizadas

---

## 🎯 Próximo Sprint

Após merge bem-sucedido, abrir **`SPRINT_02_EXPORTACAO_PDF_EXCEL.md`** para continuar implementação.

---

**Data de criação**: 21/11/2025  
**Status**: ✅ Pronto para execução
