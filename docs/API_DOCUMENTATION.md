# 📚 ClassCheck - Documentação Completa de APIs

**Última atualização:** 20/10/2025  
**Versão:** 1.0.0  
**Base URL:** `http://localhost:3000/api`

---

## 📋 Índice

1. [Usuários](#-usuários)
2. [Professores](#-professores)
3. [Aulas](#-aulas)
4. [Avaliações](#-avaliações)
5. [Humor](#-humor)
6. [Eventos](#-eventos)
7. [Calendário](#-calendário)
8. [Relatórios](#-relatórios)

---

## 👤 Usuários

### **GET /api/usuarios**
Lista todos os usuários.

**Response:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "ALUNO",
    "ativo": true,
    "createdAt": "2025-10-20T10:00:00Z"
  }
]
```

---

### **POST /api/usuarios**
Cria um novo usuário.

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "role": "ALUNO" // ALUNO | PROFESSOR | ADMIN
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "role": "ALUNO",
  "createdAt": "2025-10-20T10:00:00Z"
}
```

**Errors:**
- `400` - Email já em uso
- `400` - Dados inválidos

---

### **GET /api/usuarios/[id]**
Busca usuário por ID com dados completos.

**Response:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "avatar": "https://...",
  "role": "ALUNO",
  "ativo": true,
  "createdAt": "2025-10-20T10:00:00Z",
  "updatedAt": "2025-10-20T10:00:00Z",
  "avaliacoes": [...], // Últimas 10
  "humorRegistros": [...], // Últimos 30 dias
  "aulasFavoritas": [...],
  "_count": {
    "avaliacoes": 25,
    "humorRegistros": 18,
    "aulasFavoritas": 5
  }
}
```

---

### **PUT /api/usuarios/[id]**
Atualiza dados do usuário.

**Request Body:**
```json
{
  "nome": "João Silva Santos",
  "email": "novo@email.com",
  "avatar": "https://...",
  "role": "PROFESSOR",
  "ativo": false
}
```

**Errors:**
- `404` - Usuário não encontrado
- `409` - Email já em uso por outro usuário

---

### **DELETE /api/usuarios/[id]**
Remove ou desativa usuário.

**Comportamento:**
- **Com dados históricos:** Soft delete (desativa usuário)
- **Sem dados históricos:** Hard delete (remove permanentemente)

**Response:**
```json
{
  "message": "Usuário desativado com sucesso (soft delete)",
  "usuario": { ... }
}
```

---

## 👨‍🏫 Professores

### **GET /api/professores**
Lista todos os professores (API já implementada).

### **POST /api/professores**
Cria novo professor (API já implementada).

### **PUT /api/professores/[id]**
Atualiza professor (API já implementada).

### **DELETE /api/professores/[id]**
Remove professor (API já implementada).

---

## 📖 Aulas

### **GET /api/aulas**
Lista aulas com filtros (API já implementada).

**Query Params:**
- `data` - Filtrar por data
- `materia` - Filtrar por matéria
- `professorId` - Filtrar por professor
- `status` - AGENDADA | EM_ANDAMENTO | CONCLUIDA | CANCELADA

### **POST /api/aulas**
Cria nova aula (API já implementada).

### **GET /api/aulas/[id]**
Busca aula por ID (API já implementada).

### **PUT /api/aulas/[id]**
Atualiza aula (API já implementada).

### **DELETE /api/aulas/[id]**
Remove aula (API já implementada).

---

## ⭐ Avaliações

### **GET /api/avaliacoes**
Lista avaliações com filtros e paginação.

**Query Params:**
- `usuarioId` - Filtrar por usuário
- `aulaId` - Filtrar por aula
- `professorId` - Filtrar por professor
- `materia` - Filtrar por matéria
- `humor` - Filtrar por humor
- `dataInicio` - Data início (ISO 8601)
- `dataFim` - Data fim (ISO 8601)
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 20)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "humor": "FELIZ",
      "nota": 5,
      "feedback": "Aula excelente!",
      "createdAt": "2025-10-20T10:00:00Z",
      "usuario": { "id": 1, "nome": "João Silva", "avatar": "..." },
      "aula": {
        "id": 1,
        "titulo": "Introdução ao React",
        "materia": "Programação",
        "dataHora": "2025-10-20T08:00:00Z",
        "professor": { "id": 1, "nome": "Prof. Maria", "materia": "Programação" }
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

### **POST /api/avaliacoes**
Cria nova avaliação.

**Request Body:**
```json
{
  "usuarioId": 1,
  "aulaId": 1,
  "humor": "FELIZ", // MUITO_TRISTE | TRISTE | NEUTRO | FELIZ | MUITO_FELIZ
  "nota": 5, // 1-5 (opcional)
  "feedback": "Aula excelente!" // min 10, max 1000 caracteres (opcional)
}
```

**Validações:**
- ✅ Usuário existe e está ativo
- ✅ Aula existe e não está cancelada
- ✅ Aula já aconteceu (não pode avaliar aula futura)
- ✅ Usuário não avaliou esta aula anteriormente

**Response:** `201 Created`

**Errors:**
- `404` - Usuário ou aula não encontrado
- `400` - Aula cancelada ou futura
- `409` - Usuário já avaliou esta aula

---

### **GET /api/avaliacoes/[id]**
Busca avaliação por ID.

---

### **PUT /api/avaliacoes/[id]**
Atualiza avaliação.

**Request Body:**
```json
{
  "humor": "MUITO_FELIZ",
  "nota": 5,
  "feedback": "Aula ainda melhor que eu pensava!"
}
```

---

### **DELETE /api/avaliacoes/[id]**
Remove avaliação.

---

### **GET /api/avaliacoes/stats**
Estatísticas e agregações de avaliações.

**Query Params:**
- `usuarioId` - Estatísticas de um usuário
- `professorId` - Estatísticas de um professor
- `materia` - Estatísticas de uma matéria
- `aulaId` - Estatísticas de uma aula
- `dataInicio` - Período de análise
- `dataFim` - Período de análise

**Response:**
```json
{
  "resumo": {
    "totalAvaliacoes": 150,
    "totalAvaliacoesComNota": 120,
    "mediaNotas": 4.2,
    "mediaHumor": 3.8
  },
  "distribuicaoHumor": {
    "MUITO_TRISTE": 5,
    "TRISTE": 10,
    "NEUTRO": 30,
    "FELIZ": 60,
    "MUITO_FELIZ": 45
  },
  "percentualHumor": {
    "MUITO_TRISTE": 3.33,
    "TRISTE": 6.67,
    "NEUTRO": 20.0,
    "FELIZ": 40.0,
    "MUITO_FELIZ": 30.0
  },
  "distribuicaoNotas": {
    "nota1": 2,
    "nota2": 8,
    "nota3": 25,
    "nota4": 45,
    "nota5": 40
  },
  "estatisticasPorMateria": [
    {
      "materia": "Programação",
      "total": 50,
      "mediaNotas": 4.5,
      "mediaHumor": 4.2
    }
  ],
  "estatisticasPorProfessor": [
    {
      "professor": { "id": 1, "nome": "Prof. Maria", "materia": "Programação" },
      "total": 30,
      "mediaNotas": 4.8,
      "mediaHumor": 4.5
    }
  ],
  "tendenciaTemporal": [
    {
      "data": "2025-10-01",
      "total": 5,
      "mediaNotas": 4.2,
      "mediaHumor": 3.8
    }
  ]
}
```

---

## 😊 Humor

### **GET /api/humor**
Lista registros de humor com paginação.

**Query Params:**
- `usuarioId` - Filtrar por usuário
- `humor` - Filtrar por tipo de humor
- `dataInicio` - Data início
- `dataFim` - Data fim
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 30)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "humor": "FELIZ",
      "data": "2025-10-20",
      "observacao": "Dia produtivo!",
      "createdAt": "2025-10-20T10:00:00Z",
      "usuario": {
        "id": 1,
        "nome": "João Silva",
        "avatar": "..."
      }
    }
  ],
  "pagination": {
    "total": 30,
    "page": 1,
    "limit": 30,
    "totalPages": 1
  }
}
```

---

### **POST /api/humor**
Registra humor diário.

**Request Body:**
```json
{
  "usuarioId": 1,
  "humor": "FELIZ",
  "data": "2025-10-20T00:00:00Z", // Opcional (padrão: hoje)
  "observacao": "Dia produtivo!" // Opcional, max 500 caracteres
}
```

**Validações:**
- ✅ Usuário existe e está ativo
- ✅ Um registro por usuário por dia (constraint unique)
- ✅ Data não pode ser futura

**⚠️ Sistema de Alertas:**
Se detectar 3+ dias consecutivos de humor baixo (MUITO_TRISTE ou TRISTE), retorna:

```json
{
  "id": 1,
  "humor": "TRISTE",
  "data": "2025-10-20",
  "...": "...",
  "alerta": {
    "tipo": "HUMOR_BAIXO_CONSECUTIVO",
    "mensagem": "Detectamos 3 dias consecutivos de humor baixo. Considere procurar apoio.",
    "diasConsecutivos": 3,
    "gravidade": "MEDIA" // MEDIA | ALTA (5+ dias)
  }
}
```

**Response:** `201 Created`

**Errors:**
- `404` - Usuário não encontrado
- `409` - Já existe registro de humor para esta data

---

### **GET /api/humor/[id]**
Busca registro de humor por ID.

---

### **PUT /api/humor/[id]**
Atualiza registro de humor.

---

### **DELETE /api/humor/[id]**
Remove registro de humor.

---

### **GET /api/humor/stats**
Estatísticas avançadas de humor.

**Query Params:**
- `usuarioId` - Estatísticas de um usuário
- `dataInicio` - Período de análise
- `dataFim` - Período de análise
- `dias` - Últimos N dias (padrão: 30)

**Response:**
```json
{
  "periodo": {
    "dataInicio": "2025-09-20T00:00:00Z",
    "dataFim": "2025-10-20T00:00:00Z",
    "dias": 30
  },
  "resumo": {
    "totalRegistros": 25,
    "mediaHumor": 3.8,
    "tendencia": "MELHORANDO", // MELHORANDO | PIORANDO | ESTAVEL
    "variacaoTendencia": 0.5
  },
  "distribuicaoHumor": {
    "MUITO_TRISTE": 2,
    "TRISTE": 3,
    "NEUTRO": 8,
    "FELIZ": 10,
    "MUITO_FELIZ": 2
  },
  "percentualHumor": { ... },
  "serieTemporal": [
    {
      "data": "2025-10-01",
      "totalRegistros": 1,
      "mediaHumor": 4.0,
      "distribuicao": { ... }
    }
  ],
  "mediaPorDiaSemana": [
    {
      "dia": "Segunda",
      "total": 4,
      "mediaHumor": 3.5
    }
  ],
  "alertas": [
    {
      "tipo": "HUMOR_BAIXO_CONSECUTIVO",
      "gravidade": "MEDIA",
      "mensagem": "3 dias consecutivos de humor baixo detectados",
      "diasConsecutivos": 3
    }
  ]
}
```

---

## 📅 Eventos

### **GET /api/eventos**
Lista eventos com filtros.

**Query Params:**
- `tipo` - AULA | PROVA | EVENTO | FERIADO | REUNIAO
- `dataInicio` - Data início
- `dataFim` - Data fim
- `mes` - Filtrar por mês (formato: YYYY-MM)
- `aulaId` - Filtrar por aula
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 50)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "titulo": "Prova de Matemática",
      "descricao": "Primeira avaliação do semestre",
      "dataInicio": "2025-10-25T08:00:00Z",
      "dataFim": "2025-10-25T10:00:00Z",
      "cor": "#EF4444",
      "tipo": "PROVA",
      "createdAt": "2025-10-20T10:00:00Z",
      "aula": null
    }
  ],
  "pagination": { ... }
}
```

---

### **POST /api/eventos**
Cria novo evento.

**Request Body:**
```json
{
  "titulo": "Prova de Matemática",
  "descricao": "Primeira avaliação do semestre",
  "dataInicio": "2025-10-25T08:00:00Z",
  "dataFim": "2025-10-25T10:00:00Z", // Opcional
  "cor": "#EF4444", // Hex color (opcional, usa cor padrão por tipo)
  "tipo": "PROVA",
  "aulaId": 1 // Opcional
}
```

**Cores Padrão por Tipo:**
- AULA: `#3B82F6` (Azul)
- PROVA: `#EF4444` (Vermelho)
- EVENTO: `#10B981` (Verde)
- FERIADO: `#F59E0B` (Laranja)
- REUNIAO: `#8B5CF6` (Roxo)

**Validações:**
- ✅ dataFim deve ser posterior a dataInicio
- ✅ Se tipo=AULA e aulaId fornecido, aula deve existir
- ✅ Cor deve estar no formato hexadecimal (#RRGGBB)

**Response:** `201 Created`

---

### **GET /api/eventos/[id]**
Busca evento por ID.

---

### **PUT /api/eventos/[id]**
Atualiza evento.

---

### **DELETE /api/eventos/[id]**
Remove evento.

---

## 📆 Calendário

### **GET /api/calendario**
Visualização completa do calendário mensal.

**Query Params:**
- `ano` - Ano (padrão: ano atual)
- `mes` - Mês 1-12 (padrão: mês atual)

**Response:**
```json
{
  "periodo": {
    "ano": 2025,
    "mes": 10,
    "mesNome": "outubro",
    "diasNoMes": 31,
    "primeiroDiaSemana": 3, // 0=Domingo, 6=Sábado
    "ultimoDiaSemana": 5
  },
  "eventos": [
    {
      "id": 1,
      "titulo": "Prova de Matemática",
      "dataInicio": "2025-10-25T08:00:00Z",
      "tipo": "PROVA",
      "..."
    },
    {
      "id": "aula-10", // IDs temporários para aulas sem evento
      "titulo": "Introdução ao React",
      "dataInicio": "2025-10-20T08:00:00Z",
      "tipo": "AULA",
      "aula": { ... }
    }
  ],
  "eventosPorDia": {
    "01": [...],
    "15": [...],
    "25": [...]
  },
  "estatisticas": {
    "totalEventos": 45,
    "porTipo": {
      "AULA": 30,
      "PROVA": 5,
      "EVENTO": 8,
      "FERIADO": 1,
      "REUNIAO": 1
    },
    "diasComEventos": 20
  }
}
```

**Comportamento Especial:**
- ✨ **Integração automática:** Aulas sem evento vinculado são automaticamente incluídas como eventos temporários
- 🎨 Eventos de aulas usam cor azul padrão
- 📊 Agrupamento por dia para fácil renderização

---

## 📊 Relatórios

### **GET /api/relatorios**
Relatórios consolidados com agregações.

**Query Params:**
- `tipo` - **geral** | professor | aluno
- `professorId` - ID do professor (se tipo=professor)
- `usuarioId` - ID do usuário (se tipo=aluno)
- `materia` - Filtrar por matéria
- `dataInicio` - Período de análise (padrão: últimos 30 dias)
- `dataFim` - Período de análise

---

### **Relatório Geral (Dashboard Diretoria)**

**Request:** `GET /api/relatorios?tipo=geral`

**Response:**
```json
{
  "tipo": "geral",
  "periodo": {
    "inicio": "2025-09-20T00:00:00Z",
    "fim": "2025-10-20T00:00:00Z"
  },
  "resumo": {
    "totalUsuarios": 150,
    "usuariosPorRole": [
      { "role": "ALUNO", "_count": 120 },
      { "role": "PROFESSOR", "_count": 25 },
      { "role": "ADMIN", "_count": 5 }
    ],
    "totalProfessores": 25,
    "totalAulas": 200,
    "aulasPorStatus": [
      { "status": "CONCLUIDA", "_count": 150 },
      { "status": "AGENDADA", "_count": 40 },
      { "status": "CANCELADA", "_count": 10 }
    ],
    "totalAvaliacoes": 1200,
    "totalHumorRegistros": 800,
    "mediaNotasGeral": 4.2,
    "mediaHumorGeral": 3.8
  },
  "topProfessores": [
    {
      "professor": { "id": 1, "nome": "Prof. Maria", "materia": "Programação" },
      "mediaNotas": 4.8,
      "totalAvaliacoes": 50
    }
  ],
  "estatisticasPorMateria": [
    {
      "materia": "Programação",
      "totalAvaliacoes": 300,
      "mediaNotas": 4.5,
      "mediaHumor": 4.2
    }
  ]
}
```

---

### **Relatório por Professor**

**Request:** `GET /api/relatorios?tipo=professor&professorId=1`

**Response:**
```json
{
  "tipo": "professor",
  "professor": {
    "id": 1,
    "nome": "Prof. Maria",
    "email": "maria@escola.com",
    "materia": "Programação"
  },
  "periodo": { ... },
  "resumo": {
    "totalAulas": 30,
    "totalAvaliacoes": 120,
    "mediaNotas": 4.8,
    "mediaHumor": 4.5
  },
  "aulas": [
    {
      "id": 1,
      "titulo": "Introdução ao React",
      "dataHora": "2025-10-20T08:00:00Z",
      "status": "CONCLUIDA",
      "_count": { "avaliacoes": 25 }
    }
  ],
  "avaliacoes": [...]
}
```

---

### **Relatório por Aluno**

**Request:** `GET /api/relatorios?tipo=aluno&usuarioId=1`

**Response:**
```json
{
  "tipo": "aluno",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "ALUNO"
  },
  "periodo": { ... },
  "resumo": {
    "totalAvaliacoes": 25,
    "totalHumorRegistros": 18,
    "mediaNotas": 4.2,
    "mediaHumorAvaliacoes": 4.0,
    "mediaHumorRegistros": 3.8
  },
  "avaliacoes": [...],
  "humorRegistros": [...]
}
```

---

## 🔐 Autenticação

⚠️ **Status:** Não implementado  
📝 **Planejado:** NextAuth.js (Fase 4)

Por enquanto, todas as APIs estão **públicas** e não requerem autenticação.

---

## ⚠️ Tratamento de Erros

Todos os endpoints seguem o padrão de erros:

```json
{
  "error": "Mensagem de erro clara",
  "details": [...] // Opcional, para erros de validação Zod
}
```

**Códigos HTTP:**
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `404` - Recurso não encontrado
- `409` - Conflito (ex: constraint unique violado)
- `500` - Erro interno do servidor

---

## 🎯 Próximos Passos

### **Fase 4 (Planejado):**
1. ✅ Autenticação com NextAuth.js
2. ✅ API de Notificações
3. ✅ API de Upload de Arquivos
4. ✅ Exportação de Relatórios (PDF/CSV/Excel)
5. ✅ WebSockets para atualizações em tempo real
6. ✅ Rate limiting e cache

---

## 📝 Observações Importantes

### **Performance:**
- ✅ Índices criados em campos frequentemente consultados
- ✅ Paginação implementada em endpoints de listagem
- ✅ Uso de `select` para retornar apenas campos necessários

### **Validações:**
- ✅ Todas as entradas são validadas com Zod
- ✅ Constraints de banco de dados (unique, foreign keys)
- ✅ Validações de regras de negócio

### **Sistema de Alertas:**
- ✅ Detecção automática de humor baixo consecutivo
- ✅ Alertas personalizados por gravidade (BAIXA, MEDIA, ALTA)
- ✅ Integrado na API de humor

---

**Desenvolvido com ❤️ para o ClassCheck**
