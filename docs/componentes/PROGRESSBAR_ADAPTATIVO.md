# Componente ProgressBar Adaptativo

**Status**: ✅ Completo  
**Data**: 15/01/2025  
**Arquivos Criados**: 4

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Componentes](#componentes)
4. [Tipos e Utilities](#tipos-e-utilities)
5. [Uso](#uso)
6. [Props e API](#props-e-api)
7. [Exemplos](#exemplos)
8. [Integração](#integração)

---

## 🎯 Visão Geral

O **ProgressBar Adaptativo** é um sistema completo de visualização de progresso para sessões de avaliação psicológica. Suporta:

- **Progresso visual** com cores baseadas em níveis de alerta
- **Informações IRT** (Teoria de Resposta ao Item)
- **Tracking de tempo** (decorrido + estimado)
- **Múltiplas variantes** (compact, default, detailed)
- **Versão circular** para cards e dashboards
- **Tooltips informativos** com explicações técnicas

---

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── types/
│   └── sessao.ts              # Tipos TypeScript para sessões
├── lib/
│   └── progresso-utils.ts     # Funções utilitárias
└── components/
    └── avaliacoes/
        ├── ProgressBarAdaptativo.tsx  # Componente principal
        └── CircularProgress.tsx       # Versão circular
```

### Fluxo de Dados

```
[API Sessão] → [Tipos: SessaoDetalhes]
                      ↓
            [Progresso Utils: formatação/cálculos]
                      ↓
        [ProgressBar/CircularProgress: renderização]
```

---

## 🧩 Componentes

### 1. ProgressBarAdaptativo

**Arquivo**: `src/components/avaliacoes/ProgressBarAdaptativo.tsx` (200 linhas)

Componente principal com 3 variantes:

#### Variant: `compact`
- Barra de progresso minimalista
- Porcentagem e contador de perguntas
- Tempo decorrido (opcional)
- **Uso**: Mobile, sidebar, espaços reduzidos

#### Variant: `default`
- Barra de progresso estilizada
- Badge de nível de alerta
- Informações básicas
- **Uso**: Conteúdo principal, maioria dos casos

#### Variant: `detailed`
- Tudo do `default` +
- Grid com 4 cards informativos:
  - ⏱️ Tempo decorrido
  - ⏱️ Tempo estimado restante
  - 🎯 Theta (IRT)
  - 📈 Confiança (IRT)
- Badge "Adaptativo" com explicação
- **Uso**: Sessão ativa, máximo de informações

### 2. CircularProgress

**Arquivo**: `src/components/avaliacoes/CircularProgress.tsx` (120 linhas)

Progresso circular com SVG:

**Tamanhos**:
- `sm`: 60px (cards pequenos)
- `md`: 100px (cards médios, padrão)
- `lg`: 140px (destaque, dashboards)

**Features**:
- SVG animado com `stroke-dashoffset`
- Porcentagem centralizada
- Badge de alerta opcional
- Label opcional

---

## 🔧 Tipos e Utilities

### Tipos (`src/types/sessao.ts`)

```typescript
// Níveis de Alerta
export type NivelAlerta = 'VERDE' | 'AMARELO' | 'LARANJA' | 'VERMELHO';

// Status da Sessão
export type StatusSessao = 
  | 'INICIAL' 
  | 'EM_ANDAMENTO' 
  | 'PAUSADA' 
  | 'FINALIZADA' 
  | 'CANCELADA';

// Progresso
export interface ProgressoSessao {
  perguntasRespondidas: number;
  totalEstimado: number;
  porcentagem: number; // 0-100
}

// IRT (Teoria de Resposta ao Item)
export interface IRTInfo {
  theta: number;      // -3 a 3 (traço latente)
  erro: number;       // Erro padrão
  confianca: number;  // 0-1 (confiabilidade)
}

// Sessão Completa
export interface SessaoDetalhes {
  id: string;
  status: StatusSessao;
  progresso: ProgressoSessao;
  irt: IRTInfo;
  nivelAlerta: NivelAlerta;
  tempoDecorrido: number;
  tempoEstimado?: number;
  questionario: {
    id: string;
    titulo: string;
    adaptativo: boolean;
  };
}
```

### Utilities (`src/lib/progresso-utils.ts`)

#### 1. **getAlertaColor(nivel: NivelAlerta)**
Retorna classes Tailwind para o nível de alerta:
```typescript
{
  bg: 'bg-green-100',
  text: 'text-green-700',
  border: 'border-green-300',
  ring: 'ring-green-200'
}
```

#### 2. **getAlertaLabel(nivel: NivelAlerta)**
Labels amigáveis:
- `VERDE` → "Tudo bem"
- `AMARELO` → "Atenção"
- `LARANJA` → "Alerta"
- `VERMELHO` → "Crítico"

#### 3. **getProgressColor(nivel: NivelAlerta)**
Classes de cor para barra de progresso:
- `VERDE` → `bg-green-500`
- `AMARELO` → `bg-yellow-500`
- etc.

#### 4. **formatarTempo(segundos: number)**
Formata tempo em texto legível:
- `45` → "45s"
- `150` → "2m 30s"
- `4500` → "1h 15m"

#### 5. **calcularTempoRestante(decorrido: number, porcentagem: number)**
Estima tempo restante baseado no progresso:
```typescript
calcularTempoRestante(120, 40) // 180s (3 minutos restantes)
```

#### 6. **interpretarTheta(theta: number)**
Interpreta valor theta da IRT:
- `< -2` → "Muito baixo"
- `-2 a -1` → "Baixo"
- `-1 a 1` → "Médio"
- `1 a 2` → "Alto"
- `> 2` → "Muito alto"

#### 7. **formatarConfianca(confianca: number)**
Converte confiança para porcentagem:
- `0.85` → "85%"
- `0.92` → "92%"

---

## 📖 Uso

### Instalação

Os componentes já estão criados. Certifique-se de ter os componentes UI:

```bash
# Se ainda não tiver
npx shadcn@latest add progress tooltip badge
```

### Import

```typescript
import { ProgressBarAdaptativo } from '@/components/avaliacoes/ProgressBarAdaptativo';
import { CircularProgress } from '@/components/avaliacoes/CircularProgress';
import type { ProgressoSessao, IRTInfo, NivelAlerta } from '@/types/sessao';
```

---

## 🎨 Props e API

### ProgressBarAdaptativo

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `progresso` | `ProgressoSessao` | **obrigatório** | Progresso da sessão |
| `irt` | `IRTInfo` | `undefined` | Informações IRT (opcional) |
| `nivelAlerta` | `NivelAlerta` | `'VERDE'` | Nível de alerta |
| `tempoDecorrido` | `number` | `0` | Tempo em segundos |
| `adaptativo` | `boolean` | `false` | Se é questionário adaptativo |
| `variant` | `'compact' \| 'default' \| 'detailed'` | `'default'` | Variante do componente |
| `showIRT` | `boolean` | `true` | Mostrar informações IRT |
| `showTempo` | `boolean` | `true` | Mostrar informações de tempo |
| `showAlerta` | `boolean` | `true` | Mostrar badge de alerta |
| `className` | `string` | `''` | Classes CSS adicionais |

### CircularProgress

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `porcentagem` | `number` | **obrigatório** | Porcentagem 0-100 |
| `nivelAlerta` | `NivelAlerta` | `'VERDE'` | Nível de alerta |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do círculo |
| `showBadge` | `boolean` | `true` | Mostrar badge de alerta |
| `showLabel` | `boolean` | `false` | Mostrar label "Progresso" |
| `className` | `string` | `''` | Classes CSS adicionais |

---

## 💡 Exemplos

### Exemplo 1: Progress Bar Compact (Mobile)

```tsx
<ProgressBarAdaptativo
  variant="compact"
  progresso={{
    perguntasRespondidas: 5,
    totalEstimado: 10,
    porcentagem: 50
  }}
  tempoDecorrido={120}
/>
```

**Resultado**: Barra minimalista, ideal para mobile/sidebar.

---

### Exemplo 2: Progress Bar Default

```tsx
<ProgressBarAdaptativo
  variant="default"
  progresso={{
    perguntasRespondidas: 8,
    totalEstimado: 15,
    porcentagem: 53
  }}
  nivelAlerta="AMARELO"
  tempoDecorrido={240}
  adaptativo={true}
  irt={{
    theta: 0.5,
    erro: 0.3,
    confianca: 0.85
  }}
/>
```

**Resultado**: Card completo com barra, badge de alerta, e informações básicas.

---

### Exemplo 3: Progress Bar Detailed (Sessão Ativa)

```tsx
<ProgressBarAdaptativo
  variant="detailed"
  progresso={{
    perguntasRespondidas: 12,
    totalEstimado: 20,
    porcentagem: 60
  }}
  nivelAlerta="LARANJA"
  tempoDecorrido={600}
  adaptativo={true}
  irt={{
    theta: -1.2,
    erro: 0.25,
    confianca: 0.92
  }}
  showIRT={true}
  showTempo={true}
/>
```

**Resultado**: Card expandido com:
- Barra de progresso colorida (laranja)
- Badge "Alerta"
- 4 cards: Tempo (10m), Restante (~7m), Theta (-1.20), Confiança (92%)
- Badge "Adaptativo" com tooltip explicativo

---

### Exemplo 4: Circular Progress (Dashboard Card)

```tsx
<CircularProgress
  porcentagem={75}
  nivelAlerta="VERDE"
  size="lg"
  showBadge={true}
/>
```

**Resultado**: Círculo grande (140px) verde com 75% preenchido e badge "Tudo bem".

---

### Exemplo 5: Circular Progress Small (Mini Card)

```tsx
<CircularProgress
  porcentagem={30}
  nivelAlerta="VERMELHO"
  size="sm"
  showBadge={false}
  showLabel={true}
/>
```

**Resultado**: Círculo pequeno (60px) vermelho com label "Progresso".

---

## 🔌 Integração

### Com API de Sessão

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { ProgressBarAdaptativo } from '@/components/avaliacoes/ProgressBarAdaptativo';

export function SessaoAtiva({ sessaoId }: { sessaoId: string }) {
  const { data: sessao } = useQuery({
    queryKey: ['sessao', sessaoId],
    queryFn: () => fetch(`/api/sessoes/${sessaoId}`).then(r => r.json()),
    refetchInterval: 3000, // Atualiza a cada 3s
  });

  if (!sessao) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <ProgressBarAdaptativo
        variant="detailed"
        progresso={{
          perguntasRespondidas: sessao.respostas.length,
          totalEstimado: sessao.totalPerguntasEstimado,
          porcentagem: (sessao.respostas.length / sessao.totalPerguntasEstimado) * 100,
        }}
        irt={sessao.irt}
        nivelAlerta={sessao.nivelAlerta}
        tempoDecorrido={Math.floor((Date.now() - new Date(sessao.iniciadoEm).getTime()) / 1000)}
        adaptativo={sessao.questionario.adaptativo}
      />

      {/* Resto da página... */}
    </div>
  );
}
```

---

### Em uma Página de Sessão

```tsx
// app/avaliacoes/sessao/[id]/page.tsx

import { ProgressBarAdaptativo } from '@/components/avaliacoes/ProgressBarAdaptativo';
import { PerguntaRenderer } from '@/components/avaliacoes/PerguntaRenderer';

export default async function SessaoPage({ params }: { params: { id: string } }) {
  const sessao = await fetch(`/api/sessoes/${params.id}`).then(r => r.json());

  return (
    <div className="container max-w-4xl py-8">
      {/* Progress Bar no topo */}
      <ProgressBarAdaptativo
        variant="default"
        progresso={{
          perguntasRespondidas: sessao.respostas.length,
          totalEstimado: sessao.totalPerguntasEstimado,
          porcentagem: (sessao.respostas.length / sessao.totalPerguntasEstimado) * 100,
        }}
        irt={sessao.irt}
        nivelAlerta={sessao.nivelAlerta}
        tempoDecorrido={sessao.tempoDecorrido}
        adaptativo={sessao.questionario.adaptativo}
      />

      {/* Pergunta Atual */}
      <div className="mt-8">
        <PerguntaRenderer
          pergunta={sessao.perguntaAtual}
          onResposta={handleResposta}
        />
      </div>
    </div>
  );
}
```

---

### Em Cards de Dashboard

```tsx
// Dashboard com múltiplas sessões

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {sessoes.map(sessao => (
    <Card key={sessao.id}>
      <CardHeader>
        <CardTitle>{sessao.questionario.titulo}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <CircularProgress
          porcentagem={(sessao.respostas.length / sessao.totalEstimado) * 100}
          nivelAlerta={sessao.nivelAlerta}
          size="md"
        />
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/avaliacoes/sessao/${sessao.id}`}>
            Continuar
          </Link>
        </Button>
      </CardFooter>
    </Card>
  ))}
</div>
```

---

## 🎯 Casos de Uso

### 1. Sessão em Andamento (Página Principal)
**Variante**: `detailed`  
**Local**: `/avaliacoes/sessao/[id]`  
**Razão**: Máximo de informações para o usuário durante avaliação

### 2. Sidebar ou Mobile
**Variante**: `compact`  
**Local**: Layout fixo, espaços reduzidos  
**Razão**: Economia de espaço, informações essenciais

### 3. Dashboard/Overview
**Componente**: `CircularProgress`  
**Tamanho**: `md` ou `lg`  
**Local**: Listagem de sessões, cards resumidos  
**Razão**: Visual compacto, fácil comparação

### 4. Modal ou Drawer
**Variante**: `default`  
**Local**: Modais, drawers laterais  
**Razão**: Equilíbrio entre informação e espaço

---

## 🧪 Testes

### Estados a Testar

```tsx
// 1. Progresso inicial (0%)
<ProgressBarAdaptativo
  progresso={{ perguntasRespondidas: 0, totalEstimado: 10, porcentagem: 0 }}
  nivelAlerta="VERDE"
/>

// 2. Progresso médio com alerta
<ProgressBarAdaptativo
  progresso={{ perguntasRespondidas: 5, totalEstimado: 10, porcentagem: 50 }}
  nivelAlerta="AMARELO"
/>

// 3. Quase completo com alerta crítico
<ProgressBarAdaptativo
  progresso={{ perguntasRespondidas: 9, totalEstimado: 10, porcentagem: 90 }}
  nivelAlerta="VERMELHO"
/>

// 4. Completo (100%)
<ProgressBarAdaptativo
  progresso={{ perguntasRespondidas: 10, totalEstimado: 10, porcentagem: 100 }}
  nivelAlerta="VERDE"
/>

// 5. IRT com theta extremo
<ProgressBarAdaptativo
  progresso={{ perguntasRespondidas: 5, totalEstimado: 10, porcentagem: 50 }}
  irt={{ theta: -2.5, erro: 0.4, confianca: 0.70 }}
  adaptativo={true}
/>
```

---

## 📊 Cores e Estilo

### Paleta de Alertas

| Nível | Background | Text | Border | Uso |
|-------|-----------|------|--------|-----|
| VERDE | `bg-green-100` | `text-green-700` | `border-green-300` | Progresso normal |
| AMARELO | `bg-yellow-100` | `text-yellow-700` | `border-yellow-300` | Atenção leve |
| LARANJA | `bg-orange-100` | `text-orange-700` | `border-orange-300` | Alerta moderado |
| VERMELHO | `bg-red-100` | `text-red-700` | `border-red-300` | Crítico |

### Cores de Progresso (Barra)

| Nível | Classe | Hex |
|-------|--------|-----|
| VERDE | `bg-green-500` | #22c55e |
| AMARELO | `bg-yellow-500` | #eab308 |
| LARANJA | `bg-orange-500` | #f97316 |
| VERMELHO | `bg-red-500` | #ef4444 |

---

## ✅ Checklist de Implementação

- [x] Tipos TypeScript (`sessao.ts`)
- [x] Funções utilitárias (`progresso-utils.ts`)
- [x] Componente ProgressBarAdaptativo
  - [x] Variant: compact
  - [x] Variant: default
  - [x] Variant: detailed
- [x] Componente CircularProgress
  - [x] Tamanhos: sm, md, lg
  - [x] Animação SVG
- [x] Tooltips informativos
- [x] Documentação completa
- [ ] Testes visuais (próximo passo)
- [ ] Integração na página de sessão (próximo passo)

---

## 🚀 Próximos Passos

1. **Testar componentes visualmente** em página isolada
2. **Integrar** na página `/avaliacoes/sessao/[id]`
3. **Criar AlertaPanel** para complementar o sistema
4. **Adicionar animações** no CircularProgress
5. **Responsividade** - testar mobile/tablet/desktop

---

## 📝 Notas Técnicas

### IRT (Teoria de Resposta ao Item)
- **Theta**: Representa o "traço latente" (nível do construto medido)
- **Erro**: Quanto menor, mais precisa é a medição
- **Confiança**: Derivada do erro (1 - erro normalizado)

### Performance
- SVG é performático para círculos animados
- Tooltips com `TooltipProvider` evitam re-renders
- `Progress` do shadcn usa transform para animação eficiente

### Acessibilidade
- Cores com contraste adequado (WCAG AA)
- Tooltips com informações descritivas
- Aria-labels implícitos nos ícones do lucide-react

---

**Documentação criada em**: 15/01/2025  
**Versão**: 1.0  
**Autor**: GitHub Copilot  
**Componentes**: ProgressBarAdaptativo, CircularProgress
