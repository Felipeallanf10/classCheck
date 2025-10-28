# Página de Sessão Ativa

**Status**: ✅ Completo  
**Data**: 21/10/2025  
**Rota**: `/avaliacoes/sessao/[id]`  
**Arquivos Criados**: 3

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Arquivos](#arquivos)
4. [Features](#features)
5. [Fluxo de Uso](#fluxo-de-uso)
6. [Integração de Componentes](#integração-de-componentes)
7. [Estados da Sessão](#estados-da-sessão)
8. [Testes](#testes)

---

## 🎯 Visão Geral

A **Página de Sessão Ativa** é o coração do sistema de avaliações. É onde o aluno responde as perguntas e o sistema monitora em tempo real, integrando:

- ✅ **ProgressBar Adaptativo** - Progresso visual com IRT
- ✅ **PerguntaRenderer** - Renderiza perguntas por tipo
- ✅ **AlertaPanel** - Monitora alertas em tempo real
- ✅ **SessaoControles** - Pausar, retomar, finalizar

**Funcionalidades**:
- Auto-refresh a cada 5 segundos
- Tracking de tempo de resposta
- Navegação automática entre perguntas
- Redirecionamento ao finalizar
- Estados pausado/finalizado
- Layout responsivo (desktop/mobile)

---

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── hooks/
│   └── useSessao.ts                    # Hook principal com queries/mutations
├── components/
│   └── avaliacoes/
│       └── SessaoControles.tsx         # Botões de controle
└── app/
    └── avaliacoes/
        ├── questionarios/
        │   └── page.tsx                # Listagem (ponto de entrada)
        └── sessao/
            └── [id]/
                └── page.tsx            # Página principal de sessão ✨
```

### Fluxo de Dados

```
[API /api/sessoes/[id]] ← Auto-refresh 5s
            ↓
      [useSessao Hook]
            ↓
    [SessaoPage Component]
            ↓
    ┌───────┴───────┐
    ↓               ↓
[ProgressBar]   [PerguntaRenderer]   [AlertaPanel]
    ↓               ↓
[Submit Resposta] → [POST /api/sessoes/[id]/resposta]
    ↓
[Invalida Cache] → [Auto-refresh pega nova pergunta]
```

---

## 📦 Arquivos

### 1. useSessao.ts (Hook)

**Arquivo**: `src/hooks/useSessao.ts` (140 linhas)

**Exports**:

#### `useSessao(sessaoId: string, enabled: boolean)`
Busca detalhes da sessão com auto-refresh:
```typescript
const { data: sessao, isLoading, error } = useSessao(sessaoId);
// Auto-refresh a cada 5 segundos
// Converte datas string → Date
```

#### `useSubmeterResposta()`
Mutation para enviar resposta:
```typescript
const submeter = useSubmeterResposta();
submeter.mutate({
  sessaoId,
  perguntaId,
  resposta,
  tempoResposta: 45, // segundos
});
// Invalida cache automaticamente
```

#### `useAtualizarSessao()`
Mutation para ações de sessão:
```typescript
const atualizar = useAtualizarSessao();
atualizar.mutate({
  sessaoId,
  acao: 'pausar' | 'retomar' | 'finalizar'
});
```

#### `useTempoDecorrido(iniciadoEm, pausadoEm)`
Hook para calcular tempo:
```typescript
const tempo = useTempoDecorrido(sessao.iniciadoEm, sessao.pausadoEm);
// Retorna: número de segundos
// Atualiza a cada 1s se não pausado
```

---

### 2. SessaoControles.tsx

**Arquivo**: `src/components/avaliacoes/SessaoControles.tsx` (200 linhas)

**Componente de Controle** com botões:

**Botões**:
- **Pausar** (⏸️) - Quando `status === 'EM_ANDAMENTO'`
- **Retomar** (▶️) - Quando `status === 'PAUSADA'`
- **Finalizar** (✅) - Sempre disponível
- **Sair** (❌) - Voltar para listagem

**Dialogs de Confirmação**:
- Dialog ao pausar: "Você pode retomar mais tarde"
- Dialog ao finalizar: "Não pode ser desfeito" (⚠️)

**Props**:
```typescript
interface SessaoControlesProps {
  sessaoId: string;
  status: StatusSessao;
  podeRetomar?: boolean; // default: true
  disabled?: boolean; // desabilita todos botões
}
```

**Integrações**:
- `useAtualizarSessao()` - Mutations
- `useRouter()` - Navegação
- `toast()` - Notificações

---

### 3. page.tsx (Sessão)

**Arquivo**: `src/app/avaliacoes/sessao/[id]/page.tsx` (300 linhas)

**Página Principal** com layout completo.

**Estados Gerenciados**:
```typescript
const [tempoInicioPergunta, setTempoInicioPergunta] = useState(Date.now());
const [respostaAtual, setRespostaAtual] = useState(null);
```

**Queries**:
```typescript
const { data: sessao, isLoading, error } = useSessao(sessaoId);
const tempoDecorrido = useTempoDecorrido(sessao?.iniciadoEm, sessao?.pausadoEm);
```

**Mutations**:
```typescript
const submeter = useSubmeterResposta();
```

**Effects**:
1. **Reset tempo ao trocar pergunta**:
```typescript
useEffect(() => {
  if (sessao?.perguntaAtual) {
    setTempoInicioPergunta(Date.now());
    setRespostaAtual(null);
  }
}, [sessao?.perguntaAtual?.id]);
```

2. **Redireciona se finalizada**:
```typescript
useEffect(() => {
  if (sessao?.status === 'FINALIZADA') {
    router.push(`/avaliacoes/resultado/${sessaoId}`);
  }
}, [sessao?.status]);
```

**Handler de Submissão**:
```typescript
const handleSubmeterResposta = (resposta: any) => {
  const tempoResposta = Math.floor((Date.now() - tempoInicioPergunta) / 1000);
  
  submeter.mutate({ sessaoId, perguntaId, resposta, tempoResposta }, {
    onSuccess: (data) => {
      toast.success('Resposta registrada!');
      if (data.finalizada) {
        router.push(`/avaliacoes/resultado/${sessaoId}`);
      }
    }
  });
};
```

---

## ✨ Features

### 1. Auto-Refresh (5 segundos)
```typescript
// No hook useSessao
refetchInterval: 5000
```
- Busca nova pergunta automaticamente
- Atualiza progresso em tempo real
- Sincroniza alertas

### 2. Tracking de Tempo
```typescript
// Tempo total da sessão
const tempoDecorrido = useTempoDecorrido(iniciadoEm, pausadoEm);

// Tempo da pergunta atual
const [tempoInicioPergunta, setTempoInicioPergunta] = useState(Date.now());
```

### 3. Layout Responsivo
```typescript
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Desktop: 2/3 conteúdo, 1/3 alertas */}
  <div className="lg:col-span-2">...</div>
  <div className="lg:col-span-1">...</div>
</div>
```

### 4. Estados Especiais

#### Estado: Loading
```tsx
<div className="space-y-6">
  <Skeleton className="h-12 w-3/4" />
  <Skeleton className="h-40" />
  <Skeleton className="h-96" />
</div>
```

#### Estado: Erro
```tsx
<Card className="border-destructive">
  <AlertCircle className="h-12 w-12 text-destructive" />
  <h2>Erro ao Carregar Sessão</h2>
  <Button onClick={() => router.push('/avaliacoes/questionarios')}>
    Voltar
  </Button>
</Card>
```

#### Estado: Pausada
```tsx
<Card>
  <Clock className="h-12 w-12 text-yellow-600" />
  <h2>Avaliação Pausada</h2>
  <SessaoControles sessaoId={sessaoId} status="PAUSADA" />
</Card>
```

#### Estado: Todas Perguntas Respondidas
```tsx
<Card>
  <CheckCircle2 className="h-12 w-12 text-green-600" />
  <h3>Todas as perguntas respondidas!</h3>
  <Button onClick={() => router.push(`/avaliacoes/resultado/${sessaoId}`)}>
    Ver Resultados
  </Button>
</Card>
```

---

## 🔄 Fluxo de Uso

### Fluxo Normal

```
1. Usuário acessa /avaliacoes/questionarios
2. Clica em "Iniciar Avaliação"
3. API cria sessão → POST /api/sessoes/iniciar
4. Redireciona para /avaliacoes/sessao/[id]
5. Página carrega com primeira pergunta
6. Aluno responde
7. PerguntaRenderer chama onComplete
8. handleSubmeterResposta envia para API
9. API retorna próxima pergunta
10. Auto-refresh atualiza a página
11. Repete 6-10 até completar
12. Redireciona para /avaliacoes/resultado/[id]
```

### Fluxo com Pausa

```
1. Aluno está respondendo
2. Clica "Pausar"
3. Dialog de confirmação
4. Confirma → PATCH /api/sessoes/[id] { acao: 'pausar' }
5. Página mostra estado "Pausada"
6. Aluno pode:
   a) Retomar → Volta para pergunta atual
   b) Sair → Volta para listagem
7. Ao retornar, acessa /avaliacoes/sessao/[id]
8. Clica "Retomar"
9. Continua de onde parou
```

### Fluxo Finalizar Antecipado

```
1. Aluno está respondendo
2. Clica "Finalizar Avaliação"
3. Dialog: "Tem certeza? Não pode desfazer"
4. Confirma → PATCH /api/sessoes/[id] { acao: 'finalizar' }
5. useEffect detecta status === 'FINALIZADA'
6. Redireciona para /avaliacoes/resultado/[id]
```

---

## 🧩 Integração de Componentes

### Layout da Página

```tsx
<Container>
  {/* Header */}
  <Header>
    <Title>{sessao.questionario.titulo}</Title>
    <SessaoControles />
  </Header>

  {/* Grid 2:1 Desktop, Stack Mobile */}
  <Grid>
    {/* Coluna Principal */}
    <MainColumn>
      <ProgressBarAdaptativo
        variant="detailed"
        progresso={progresso}
        irt={sessao.irt}
        nivelAlerta={sessao.nivelAlerta}
        tempoDecorrido={tempoDecorrido}
        adaptativo={sessao.questionario.adaptativo}
      />

      <Card>
        <PerguntaRenderer
          pergunta={sessao.perguntaAtual}
          value={respostaAtual}
          onChange={setRespostaAtual}
          onComplete={() => handleSubmeterResposta(respostaAtual)}
          disabled={submeter.isPending}
        />
      </Card>
    </MainColumn>

    {/* Sidebar */}
    <Sidebar>
      <AlertaPanel
        compact
        sessaoId={sessaoId}
        maxAlertas={10}
        autoRefresh={true}
      />
    </Sidebar>
  </Grid>

  {/* Footer (Informações IRT) */}
  {sessao.irt && (
    <Card>
      <IrtInfo theta={sessao.irt.theta} ... />
    </Card>
  )}
</Container>
```

---

## 📊 Estados da Sessão

### StatusSessao (5 possíveis)

| Status | Descrição | Ações Disponíveis |
|--------|-----------|-------------------|
| `INICIAL` | Criada mas não iniciada | Iniciar |
| `EM_ANDAMENTO` | Respondendo perguntas | Pausar, Finalizar, Sair |
| `PAUSADA` | Temporariamente pausada | Retomar, Finalizar, Sair |
| `FINALIZADA` | Concluída | Ver Resultados |
| `CANCELADA` | Cancelada pelo usuário | - |

### Renderização por Status

```typescript
if (status === 'PAUSADA') {
  return <EstadoPausado />;
}

if (status === 'FINALIZADA') {
  router.push(`/avaliacoes/resultado/${sessaoId}`);
  return null;
}

if (status === 'EM_ANDAMENTO' && !perguntaAtual) {
  return <TodasPerguntasRespondidas />;
}

return <LayoutPrincipal />;
```

---

## 🧪 Testes

### Como Testar

1. **Acessar listagem**:
```
http://localhost:3000/avaliacoes/questionarios
```

2. **Clicar em "Iniciar Avaliação"** em um questionário

3. **Testar fluxos**:
   - ✅ Responder perguntas normalmente
   - ✅ Pausar e retomar
   - ✅ Finalizar antecipadamente
   - ✅ Sair e voltar
   - ✅ Ver alertas na sidebar
   - ✅ Acompanhar progresso

### Cenários de Teste

#### 1. Fluxo Completo
```
1. Iniciar avaliação
2. Responder 5 perguntas
3. Finalizar
4. Ver resultados
✅ Progresso atualiza
✅ Tempo calculado corretamente
✅ Redirecionamento automático
```

#### 2. Pausar e Retomar
```
1. Iniciar avaliação
2. Responder 2 perguntas
3. Pausar
4. Voltar para listagem
5. Entrar novamente na sessão
6. Retomar
7. Continuar respondendo
✅ Estado preservado
✅ Progresso mantido
```

#### 3. Finalizar Antecipado
```
1. Iniciar avaliação
2. Responder 1 pergunta
3. Finalizar Avaliação
4. Confirmar dialog
✅ Redireciona para resultados
✅ Não pode mais responder
```

#### 4. Auto-Refresh
```
1. Abrir avaliação
2. Aguardar 5 segundos
✅ Dados atualizados automaticamente
✅ Progresso sincronizado
```

---

## 🎨 UI/UX

### Cores por Estado

| Elemento | Cor | Uso |
|----------|-----|-----|
| Pausado | Yellow/Amber | Clock icon, badge |
| Finalizando | Green | CheckCircle, success |
| Erro | Red | AlertCircle, border |
| Loading | Gray | Skeleton, loader |
| Progresso | Dynamic | Verde/Amarelo/Laranja/Vermelho |

### Responsividade

**Desktop (lg+)**:
```
┌──────────────────┬─────────┐
│                  │         │
│   ProgressBar    │ Alertas │
│                  │ (compact)│
│   Pergunta       │         │
│                  │         │
└──────────────────┴─────────┘
    2/3 width         1/3
```

**Mobile (<lg)**:
```
┌──────────────────┐
│   ProgressBar    │
├──────────────────┤
│   Pergunta       │
├──────────────────┤
│   Alertas        │
└──────────────────┘
   Stack vertical
```

---

## 📝 Notas Técnicas

### Performance
- Auto-refresh configurável (5s)
- TanStack Query faz cache inteligente
- Invalida apenas queries necessárias
- Skeleton para loading states

### Segurança
- Valida sessaoId (UUID)
- Verifica propriedade (usuarioId)
- Não permite editar sessões finalizadas
- Token/Auth (a implementar)

### Acessibilidade
- Skeleton para feedback visual
- Loading states claros
- Mensagens de erro descritivas
- Confirmações antes de ações destrutivas
- Keyboard navigation (dialogs)

### SEO
- Páginas com `'use client'` (não SSR)
- Metadata dinâmica (a implementar)
- OpenGraph para compartilhamento

---

## 🚀 Próximos Passos

- [ ] Implementar página de resultados
- [ ] Adicionar autenticação real
- [ ] Implementar salvar rascunho
- [ ] Adicionar navegação anterior/próxima (histórico)
- [ ] Modo offline (service worker)
- [ ] Analytics de tempo por pergunta
- [ ] Exportar PDF dos resultados

---

**Documentação criada em**: 21/10/2025  
**Versão**: 1.0  
**Autor**: GitHub Copilot  
**Páginas**: SessaoPage, QuestionariosPage
