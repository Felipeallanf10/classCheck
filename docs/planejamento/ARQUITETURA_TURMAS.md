# 🏫 Arquitetura de Turmas - ClassCheck

## 📊 **ESTRUTURA DE DADOS**

### **Modelo de Relacionamentos**

```
┌─────────────────────────────────────────────────────────┐
│                        TURMA                            │
│  id, nome, codigo, ano, periodo, ativa                  │
└──────────────┬──────────────────────┬───────────────────┘
               │                      │
               │                      │
       ┌───────▼──────────┐   ┌──────▼────────────┐
       │  TurmaAluno (N:N)│   │ TurmaProfessor    │
       │  - turmaId       │   │ (N:N)             │
       │  - alunoId       │   │ - turmaId         │
       │  - matricula     │   │ - professorId     │
       │  - ativo         │   │ - materia         │
       └───────┬──────────┘   └──────┬────────────┘
               │                     │
               │                     │
       ┌───────▼──────────────────────▼────────────┐
       │           USUARIO                         │
       │  role: ALUNO | PROFESSOR | ADMIN          │
       └───────────────────────────────────────────┘
                           │
                           │
                   ┌───────▼────────┐
                   │      AULA      │
                   │  - professorId │
                   │  - turmaId     │
                   └────────────────┘
```

---

## 🎯 **CASOS DE USO**

### **1. Turma 3A - Matemática**

```typescript
// Professor João leciona Matemática na Turma 3A
{
  turma: { nome: "3º Ano A", codigo: "3A" },
  professor: { nome: "João Silva", role: "PROFESSOR", materia: "Matemática" },
  alunos: [
    { nome: "Maria Santos", matricula: "2025001" },
    { nome: "Pedro Costa", matricula: "2025002" },
    // ... 25 alunos
  ]
}
```

### **2. Professor em Múltiplas Turmas**

```typescript
// Professor João leciona em 3 turmas
TurmaProfessor = [
  { turmaId: 1, professorId: 10, materia: "Matemática" }, // 3A
  { turmaId: 2, professorId: 10, materia: "Matemática" }, // 3B
  { turmaId: 3, professorId: 10, materia: "Matemática" }, // 3C
]
```

### **3. Aluno em Múltiplas Turmas** (menos comum, mas possível)

```typescript
// Maria está em 2 turmas (horário integral + reforço)
TurmaAluno = [
  { turmaId: 1, alunoId: 52, matricula: "2025001" }, // 3A manhã
  { turmaId: 5, alunoId: 52, matricula: "2025001" }, // Reforço tarde
]
```

---

## 📋 **QUERIES IMPORTANTES**

### **1. Buscar Turmas de um Professor**

```typescript
const turmasProfessor = await prisma.turmaProfessor.findMany({
  where: { professorId: userId },
  include: {
    turma: {
      include: {
        alunos: {
          include: { aluno: true }
        }
      }
    }
  }
});

// Resultado:
// [
//   { turma: "3A", materia: "Matemática", totalAlunos: 25 },
//   { turma: "3B", materia: "Matemática", totalAlunos: 28 }
// ]
```

### **2. Buscar Turmas de um Aluno**

```typescript
const turmasAluno = await prisma.turmaAluno.findMany({
  where: { alunoId: userId },
  include: {
    turma: {
      include: {
        professores: {
          include: { professor: true }
        }
      }
    }
  }
});

// Resultado:
// [
//   {
//     turma: "3A",
//     professores: [
//       { nome: "João Silva", materia: "Matemática" },
//       { nome: "Maria Costa", materia: "Português" }
//     ]
//   }
// ]
```

### **3. Buscar Aulas de uma Turma**

```typescript
const aulasTurma = await prisma.aula.findMany({
  where: {
    turmaId: turmaId,
    dataHora: {
      gte: new Date('2025-11-01'),
      lte: new Date('2025-11-30')
    }
  },
  include: {
    professor: true,
    turma: true
  },
  orderBy: { dataHora: 'asc' }
});
```

### **4. Estatísticas de Turma (Professor)**

```typescript
// Professor quer ver média da turma 3A
const estatisticasTurma = await prisma.avaliacaoSocioemocional.findMany({
  where: {
    aula: {
      turmaId: turmaId,
      dataHora: {
        gte: periodoInicio,
        lte: periodoFim
      }
    }
  },
  select: {
    valencia: true,
    ativacao: true,
    estadoPrimario: true,
    confianca: true
  }
});

// Calcular médias agregadas (anônimas)
const valenciaMedia = estatisticasTurma.reduce((sum, av) => sum + av.valencia, 0) / estatisticasTurma.length;
const ativacaoMedia = estatisticasTurma.reduce((sum, av) => sum + av.ativacao, 0) / estatisticasTurma.length;

// Distribuição de estados
const distribuicaoEstados = estatisticasTurma.reduce((acc, av) => {
  acc[av.estadoPrimario] = (acc[av.estadoPrimario] || 0) + 1;
  return acc;
}, {});
```

---

## 🔒 **REGRAS DE ACESSO**

### **ALUNO pode:**
- ✅ Ver suas próprias turmas
- ✅ Ver professores das suas turmas
- ✅ Ver aulas das suas turmas
- ✅ Avaliar aulas das suas turmas
- ❌ Ver dados de outros alunos
- ❌ Ver estatísticas da turma

### **PROFESSOR pode:**
- ✅ Ver turmas onde leciona
- ✅ Ver lista de alunos (nome + matrícula)
- ✅ Ver estatísticas **agregadas anônimas** da turma
- ✅ Ver tendências emocionais da turma
- ✅ Receber alertas de turma (sem identificar aluno)
- ❌ Ver avaliações individuais identificadas
- ❌ Ver turmas de outros professores

### **ADMIN pode:**
- ✅ Criar/editar/excluir turmas
- ✅ Vincular alunos ↔ turmas
- ✅ Vincular professores ↔ turmas
- ✅ Ver todas as estatísticas
- ✅ Gerenciar matrículas

---

## 🎨 **INTERFACES DE USUÁRIO**

### **Dashboard do Professor**

```
┌─────────────────────────────────────────────────────┐
│ Minhas Turmas (3)                                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🏫 3º Ano A (Manhã)                               │
│     📊 25 alunos   📚 Matemática                    │
│     Valencia média: 0.6  Ativação: 0.5             │
│     [Ver Relatório Detalhado]                      │
│                                                     │
│  🏫 3º Ano B (Manhã)                               │
│     📊 28 alunos   📚 Matemática                    │
│     Valencia média: 0.7  Ativação: 0.6             │
│     [Ver Relatório Detalhado]                      │
│                                                     │
│  🏫 3º Ano C (Tarde)                               │
│     📊 22 alunos   📚 Matemática                    │
│     Valencia média: 0.5  Ativação: 0.4             │
│     ⚠️ 3 alertas de risco                          │
│     [Ver Relatório Detalhado]                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### **Dashboard do Aluno**

```
┌─────────────────────────────────────────────────────┐
│ Minha Turma: 3º Ano A                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  👨‍🏫 Professores:                                    │
│     • João Silva - Matemática                      │
│     • Maria Costa - Português                      │
│     • Pedro Almeida - História                     │
│                                                     │
│  📅 Próximas Aulas:                                │
│     • 14:00 - Matemática (Prof. João)              │
│     • 16:00 - Português (Profa. Maria)             │
│                                                     │
│  📊 Sua Evolução:                                  │
│     Valencia: 0.7  Ativação: 0.5                   │
│     [Ver Detalhes]                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### **Página de Relatório da Turma (Professor)**

```
┌─────────────────────────────────────────────────────┐
│ Relatório: 3º Ano A - Matemática                   │
│ Período: Novembro/2025                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📊 Estatísticas Agregadas (Anônimas)              │
│  ┌───────────────────────────────────────────┐     │
│  │ Valencia Média: 0.65  Ativação: 0.52      │     │
│  │ Total Avaliações: 152                     │     │
│  │ Taxa de Participação: 85%                 │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
│  📈 Distribuição de Estados Emocionais             │
│  ┌───────────────────────────────────────────┐     │
│  │ [Gráfico de Pizza]                        │     │
│  │ Alegre: 35%                               │     │
│  │ Calmo: 28%                                │     │
│  │ Ansioso: 22%                              │     │
│  │ Cansado: 15%                              │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
│  ⚠️ Alertas Identificados: 3                       │
│  • 2 alunos com valencia baixa consistente         │
│  • 1 aluno com alta ansiedade                      │
│  (IDs não mostrados - apenas contagem)             │
│                                                     │
│  📊 Evolução Temporal                              │
│  [Gráfico de Linha - média da turma por dia]       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 **MIGRAÇÃO DE DADOS**

### **Script SQL para Popular Turmas**

```sql
-- 1. Criar turma exemplo
INSERT INTO turmas (nome, codigo, ano, periodo, ativa)
VALUES ('3º Ano A', '3A', '2025', 'MANHA', true);

-- 2. Vincular alunos à turma (assumindo usuários já existentes)
INSERT INTO turmas_alunos (turma_id, aluno_id, matricula, ativo)
SELECT 1, id, CONCAT('2025', LPAD(ROW_NUMBER() OVER()::text, 3, '0')), true
FROM usuarios
WHERE role = 'ALUNO'
LIMIT 25;

-- 3. Vincular professor à turma
INSERT INTO turmas_professores (turma_id, professor_id, materia, ativo)
VALUES (1, 52, 'Matemática', true);

-- 4. Atualizar aulas existentes para vincular à turma
UPDATE aulas
SET turma_id = 1
WHERE professor_id = 52;
```

---

## ✅ **PRÓXIMOS PASSOS**

1. **Criar Migration**
   ```bash
   npx prisma migrate dev --name adicionar_sistema_turmas
   ```

2. **Popular Turmas Iniciais**
   ```bash
   npx tsx prisma/seed-turmas.ts
   ```

3. **Criar APIs**
   - `GET /api/turmas` - Listar turmas
   - `GET /api/turmas/[id]` - Detalhes da turma
   - `GET /api/turmas/[id]/alunos` - Alunos da turma (professor)
   - `GET /api/turmas/[id]/estatisticas` - Estatísticas agregadas (professor)

4. **Criar Páginas**
   - `/professor/turmas` - Lista de turmas do professor
   - `/professor/turmas/[id]` - Relatório da turma
   - `/aluno/turma` - Informações da turma do aluno

5. **Atualizar Seed Mock**
   - Criar turmas de exemplo
   - Vincular usuário 52 a uma turma
   - Vincular aulas às turmas

---

## 📝 **NOTAS IMPORTANTES**

- **Turma é opcional**: `turmaId` em Aula é nullable para permitir aulas avulsas
- **N:N flexível**: Alunos e professores podem estar em múltiplas turmas
- **Matéria por vínculo**: Professor pode lecionar matérias diferentes em turmas diferentes
- **Privacidade**: Professor vê apenas estatísticas agregadas, nunca dados individuais identificados

---

**Arquitetura criada para suportar:**
- ✅ Multi-turmas por professor
- ✅ Multi-turmas por aluno (casos especiais)
- ✅ Relatórios agregados anônimos
- ✅ Gestão de matrículas
- ✅ Diferentes períodos (manhã/tarde/noite)
