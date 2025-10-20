# 🎮 API de Gamificação - ClassCheck

Sistema completo de gamificação com XP, níveis, rankings e conquistas.

## 📚 Índice

- [Perfil de Gamificação](#perfil-de-gamificação)
- [Sistema de XP](#sistema-de-xp)
- [Histórico e Estatísticas](#histórico-e-estatísticas)
- [Rankings](#rankings)
- [Conquistas](#conquistas)
- [Schemas de Validação](#schemas-de-validação)

---

## 🎯 Perfil de Gamificação

### GET `/api/gamificacao/perfil/[usuarioId]`

Busca o perfil completo de gamificação de um usuário.

**Resposta:**
```json
{
  "id": 1,
  "usuarioId": 123,
  "xpTotal": 1250,
  "nivel": 8,
  "xpNivelAtual": 250,
  "xpProximoNivel": 400,
  "progressoNivel": 62.5,
  "streakAtual": 7,
  "melhorStreak": 15,
  "totalAvaliacoes": 45,
  "avaliacoesConsecutivas": 20,
  "usuario": {
    "nome": "João Silva",
    "email": "joao@example.com",
    "avatar": "https://..."
  }
}
```

---

## ⚡ Sistema de XP

### POST `/api/gamificacao/xp`

Adiciona XP para um usuário.

**Body:**
```json
{
  "usuarioId": 123,
  "acao": "AVALIAR_AULA",
  "aulaId": 456,
  "descricao": "Avaliou a aula de Matemática"
}
```

**Ações Disponíveis:**
- `AVALIAR_AULA` - 10 XP
- `AVALIAR_AULA_COMPLETA` - 20 XP
- `PRIMEIRA_AVALIACAO_DIA` - 5 XP (bônus)
- `COMPLETAR_PERFIL` - 30 XP
- `STREAK_BONUS` - 10 XP

**Resposta:**
```json
{
  "xpGanho": 25,
  "xpTotal": 1275,
  "nivelAtual": 8,
  "nivelAnterior": 8,
  "subiuNivel": false,
  "multiplicadorAplicado": 1.5,
  "detalhesMultiplicadores": [
    { "tipo": "Primeira avaliação do dia", "multiplicador": 1.5 }
  ],
  "streakAtual": 8
}
```

---

## 📊 Histórico e Estatísticas

### GET `/api/gamificacao/historico/[usuarioId]`

Busca histórico de XP com paginação e filtros.

**Query Params:**
- `limite` - Itens por página (padrão: 20, max: 100)
- `pagina` - Número da página (padrão: 1)
- `acao` - Filtrar por tipo de ação (opcional)

**Exemplo:** `/api/gamificacao/historico/123?limite=10&pagina=1&acao=AVALIAR_AULA`

**Resposta:**
```json
{
  "historico": [
    {
      "id": 789,
      "xpGanho": 25,
      "acao": "AVALIAR_AULA",
      "descricao": "Avaliou a aula de Matemática",
      "multiplicador": 1.5,
      "createdAt": "2025-10-20T10:30:00Z",
      "aula": {
        "titulo": "Álgebra Linear",
        "materia": "Matemática"
      }
    }
  ],
  "paginacao": {
    "total": 45,
    "pagina": 1,
    "limite": 10,
    "totalPaginas": 5
  }
}
```

### GET `/api/gamificacao/historico/[usuarioId]/estatisticas`

Busca estatísticas agregadas de XP.

**Resposta:**
```json
{
  "hoje": {
    "xpGanho": 75,
    "acoes": 3
  },
  "semana": {
    "xpGanho": 425,
    "acoes": 18
  },
  "mes": {
    "xpGanho": 1250,
    "acoes": 52
  },
  "porAcao": [
    {
      "acao": "AVALIAR_AULA",
      "xpTotal": 800,
      "quantidade": 40
    },
    {
      "acao": "AVALIAR_AULA_COMPLETA",
      "xpTotal": 240,
      "quantidade": 12
    }
  ],
  "ultimasAtividades": [...]
}
```

---

## 🏆 Rankings

### GET `/api/gamificacao/ranking`

Busca o Top 3 do ranking.

**Query Params:**
- `configuracaoId` - ID da configuração (padrão: 1)
- `periodo` - SEMANAL, MENSAL ou BIMESTRAL (opcional)

**Resposta:**
```json
{
  "top3": [
    {
      "posicao": 1,
      "usuario": {
        "nome": "Maria Santos",
        "email": "maria@example.com",
        "avatar": "https://..."
      },
      "xpPeriodo": 850,
      "xpTotal": 5420,
      "nivel": 25,
      "bonus": 0.3,
      "aplicado": true
    }
  ]
}
```

### GET `/api/gamificacao/ranking/[usuarioId]`

Busca a posição específica de um usuário no ranking.

**Query Params:**
- `configuracaoId` - ID da configuração (padrão: 1)

**Resposta:**
```json
{
  "usuario": {
    "nome": "João Silva",
    "email": "joao@example.com",
    "avatar": "https://..."
  },
  "posicao": 15,
  "xpPeriodo": 420,
  "xpTotal": 1250,
  "nivel": 8,
  "totalParticipantes": 120
}
```

### POST `/api/gamificacao/ranking`

Calcula o ranking do período atual.

**Body:**
```json
{
  "configuracaoId": 1
}
```

---

## 🎖️ Conquistas

### GET `/api/gamificacao/conquistas`

Lista todas as conquistas disponíveis no sistema.

**Resposta:**
```json
[
  {
    "id": 1,
    "tipo": "XP_100",
    "nome": "Primeiros Passos",
    "descricao": "Alcance 100 XP",
    "icone": "🎯",
    "categoria": "XP",
    "xpRecompensa": 10
  }
]
```

### GET `/api/gamificacao/conquistas/[usuarioId]`

Busca conquistas de um usuário.

**Query Params:**
- `progresso=true` - Incluir progresso de todas as conquistas

**Sem progresso:**
```json
[
  {
    "id": 5,
    "conquistaId": 1,
    "desbloqueadaEm": "2025-10-15T14:30:00Z",
    "conquista": {
      "tipo": "XP_100",
      "nome": "Primeiros Passos",
      "descricao": "Alcance 100 XP",
      "icone": "🎯",
      "categoria": "XP",
      "xpRecompensa": 10
    }
  }
]
```

**Com progresso:**
```json
[
  {
    "id": 1,
    "tipo": "XP_100",
    "nome": "Primeiros Passos",
    "descricao": "Alcance 100 XP",
    "icone": "🎯",
    "categoria": "XP",
    "xpRecompensa": 10,
    "desbloqueada": true,
    "progresso": 100
  },
  {
    "id": 2,
    "tipo": "XP_500",
    "nome": "Ganhando Ritmo",
    "descricao": "Alcance 500 XP",
    "icone": "🚀",
    "categoria": "XP",
    "xpRecompensa": 50,
    "desbloqueada": false,
    "progresso": 65
  }
]
```

### POST `/api/gamificacao/conquistas/verificar`

Verifica e desbloqueia conquistas para um usuário.

**Body:**
```json
{
  "usuarioId": 123,
  "acao": "AVALIAR_AULA"
}
```

**Resposta:**
```json
{
  "novasConquistas": [
    {
      "conquista": {
        "tipo": "AVALIACOES_10",
        "nome": "Opinião Importa",
        "descricao": "Faça 10 avaliações",
        "icone": "📝",
        "xpRecompensa": 25
      },
      "desbloqueadaEm": "2025-10-20T10:35:00Z"
    }
  ],
  "quantidade": 1
}
```

---

## ⚙️ Configuração de Ranking

### GET `/api/gamificacao/configuracao`

Lista configurações de ranking ativas.

### POST `/api/gamificacao/configuracao`

Cria nova configuração de ranking.

**Body:**
```json
{
  "periodoCalculo": "SEMANAL",
  "bonusPrimeiroLugar": 0.3,
  "bonusSegundoLugar": 0.2,
  "bonusTerceiroLugar": 0.1,
  "minimoAvaliacoes": 5,
  "aplicarAutomaticamente": true,
  "notificarAlunos": true,
  "visibilidadeRanking": "PUBLICO",
  "criadoPorId": 1
}
```

---

## 🔐 Schemas de Validação

Todos os endpoints utilizam validação com Zod. Veja os schemas disponíveis:

- `adicionarXPSchema`
- `buscarHistoricoSchema`
- `rankingSchema`
- `criarConfiguracaoRankingSchema`
- `verificarConquistasSchema`

Exemplo de uso:
```typescript
import { validarDados, adicionarXPSchema } from '@/lib/gamificacao/validations';

const { sucesso, dados, erros } = validarDados(adicionarXPSchema, body);
if (!sucesso) {
  return NextResponse.json({ erros }, { status: 400 });
}
```

---

## 📋 Tipos de Conquistas

### Por XP
- `XP_100` - Primeiros Passos
- `XP_500` - Ganhando Ritmo
- `XP_1000` - Milionário de XP
- `XP_5000` - Lendário

### Por Nível
- `NIVEL_5` - Aprendiz
- `NIVEL_10` - Estudante Dedicado
- `NIVEL_20` - Mestre do Conhecimento
- `NIVEL_50` - Grande Sábio

### Por Streak
- `STREAK_3` - Consistência
- `STREAK_7` - Semana Perfeita
- `STREAK_14` - Duas Semanas Fortes
- `STREAK_30` - Mestre da Disciplina

### Por Avaliações
- `PRIMEIRA_AVALIACAO` - Primeira Impressão
- `AVALIACOES_10` - Opinião Importa
- `AVALIACOES_50` - Crítico Experiente
- `AVALIACOES_100` - Especialista em Feedback

### Especiais
- `MADRUGADOR` - Avaliação antes das 7h
- `NOTURNO` - Avaliação depois das 22h
- `FIM_DE_SEMANA` - Avaliação no fim de semana
- `TOP_3` - Ficar no Top 3 do ranking

---

## 🚀 Setup

### 1. Gerar Prisma Client
```bash
npm run db:generate
```

### 2. Criar Conquistas no Banco
```bash
npx ts-node prisma/seeds/conquistas.ts
```

### 3. Testar API
```bash
curl http://localhost:3000/api/gamificacao/perfil/1
```

---

## 🔄 Fluxo de Integração

### Ao criar uma avaliação:

```typescript
// 1. Criar avaliação
const avaliacao = await prisma.avaliacao.create({ ... });

// 2. Adicionar XP
const xp = await adicionarXP({
  usuarioId: avaliacao.usuarioId,
  acao: 'AVALIAR_AULA',
  aulaId: avaliacao.aulaId,
});

// 3. Conquistas são verificadas automaticamente
// (feito internamente no adicionarXP)
```

---

## 🎨 Próximas Features

- [ ] Sistema de missões diárias
- [ ] Loja de recompensas
- [ ] Eventos especiais sazonais
- [ ] Desafios entre turmas
- [ ] Dashboard de analytics
- [ ] Sistema de notificações push
- [ ] Webhooks para eventos de gamificação

---

## 📝 Notas

- O sistema verifica conquistas automaticamente ao adicionar XP
- Rankings são calculados por período (semanal/mensal/bimestral)
- Streaks são resetados após 24h de inatividade
- XP pode ter multiplicadores por horário e streak ativo
