# Componente AlertaPanel

**Status**: ✅ Completo  
**Data**: 21/10/2025  
**Arquivos Criados**: 7

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

O **AlertaPanel** é um sistema completo de gestão de alertas para avaliações psicológicas. Detecta automaticamente situações que requerem atenção e oferece:

- **8 tipos de alertas**: Risco de evasão, dificuldade de aprendizagem, ansiedade, fadiga, etc.
- **4 níveis de severidade**: Verde, Amarelo, Laranja, Vermelho
- **Gestão de status**: Ativo, Visualizado, Em Acompanhamento, Resolvido
- **Recomendações automáticas** baseadas em evidências
- **Sistema de ajuda** com notificações para responsáveis
- **Filtros e organização** por abas e níveis
- **Auto-refresh** para monitoramento em tempo real

---

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── types/
│   └── alerta.ts                  # Tipos TypeScript
├── lib/
│   └── alerta-utils.ts            # Funções utilitárias
├── hooks/
│   └── useAlertas.ts              # TanStack Query hooks
└── components/
    └── avaliacoes/
        ├── AlertaCard.tsx         # Card individual
        ├── AlertaDetalhesModal.tsx # Modal de detalhes
        └── AlertaPanel.tsx        # Componente principal
```

### Fluxo de Dados

```
[API /api/alertas] → [TanStack Query Cache]
                            ↓
                  [useAlertas Hook]
                            ↓
              [AlertaPanel + Cards + Modal]
                            ↓
                  [Ações: Visualizar, Atualizar Status, Buscar Ajuda]
                            ↓
                  [Mutations → Invalidate Cache]
```

---

## 🧩 Componentes

### 1. AlertaCard

**Arquivo**: `src/components/avaliacoes/AlertaCard.tsx` (150 linhas)

Card individual de alerta com 2 variantes:

#### Variant: `compact`
- Layout horizontal minimalista
- Ícone + Título + Data
- Descrição truncada (1 linha)
- Chevron indicador
- **Uso**: Listas, sidebars, mobile

#### Variant: `default` (padrão)
- Layout expandido
- Ícone grande colorido
- Título + Descrição + Mensagem
- Badges de status e nível
- Botão "Ver detalhes"
- Border lateral colorida
- **Uso**: Painéis principais, dashboards

**Props**:
- `alerta`: Objeto com dados do alerta
- `onClick`: Callback ao clicar
- `compact`: Ativa modo compacto
- `showStatus`: Exibe badge de status

---

### 2. AlertaDetalhesModal

**Arquivo**: `src/components/avaliacoes/AlertaDetalhesModal.tsx` (340 linhas)

Modal completo com:

**Seções**:
1. **Header**: Ícone, título, descrição, badges (status + nível)
2. **Detalhes**: Mensagem expandida
3. **Metadados IRT**: Theta, Confiança, Tempo de Resposta
4. **Recomendações**: Lista com checkmarks e ações sugeridas
5. **Formulário de Ajuda**: Textarea + botão enviar
6. **Timeline**: Histórico (criado, visualizado)

**Ações**:
- ✅ **Marcar como Visualizado** (automático ao abrir)
- 🔄 **Marcar em Acompanhamento**
- ✔️ **Marcar como Resolvido**
- 🆘 **Buscar Ajuda** (envia notificação)

**Integrações**:
- `useMarcarAlertaVisualizado()` - Marca como visualizado
- `useAtualizarStatusAlerta()` - Atualiza status
- `useBuscarAjuda()` - Solicita ajuda externa
- Toast notifications (sonner)

---

### 3. AlertaPanel

**Arquivo**: `src/components/avaliacoes/AlertaPanel.tsx` (260 linhas)

Componente principal com 2 modos:

#### Modo: `compact`
- Header com contador
- Lista simples de alertas
- Botão refresh
- Máximo de alertas configurável
- **Uso**: Sidebars, widgets

#### Modo: `default` (padrão)
- Header completo com descrição
- Filtros por nível (com contadores)
- 4 abas:
  - **Ativos**: Alertas não visualizados (badge vermelho)
  - **Visualizados**: Já vistos mas não resolvidos
  - **Em Acompanhamento**: Sendo tratados
  - **Resolvidos**: Concluídos
- Auto-refresh opcional (15s)
- Estado vazio com ícone e mensagem
- **Uso**: Páginas principais, dashboards

**Props**:
- `sessaoId`: Filtra alertas de uma sessão
- `usuarioId`: Filtra alertas de um usuário
- `compact`: Ativa modo compacto
- `maxAlertas`: Limita quantidade exibida
- `autoRefresh`: Ativa atualização automática

---

## 🔧 Tipos e Utilities

### Tipos (`src/types/alerta.ts`)

```typescript
// 8 Tipos de Alerta
export type TipoAlerta =
  | 'RISCO_EVASAO'
  | 'DIFICULDADE_APRENDIZAGEM'
  | 'BAIXO_ENGAJAMENTO'
  | 'ANSIEDADE_AVALIATIVA'
  | 'FADIGA_COGNITIVA'
  | 'INCONSISTENCIA_RESPOSTAS'
  | 'TEMPO_EXCESSIVO'
  | 'PADRAO_ALEATORIO';

// 4 Níveis de Severidade
export type NivelAlerta = 'VERDE' | 'AMARELO' | 'LARANJA' | 'VERMELHO';

// 4 Status
export type StatusAlerta = 
  | 'ATIVO'                // Não visualizado
  | 'VISUALIZADO'          // Visto mas não tratado
  | 'EM_ACOMPANHAMENTO'    // Sendo tratado
  | 'RESOLVIDO';           // Concluído

// Alerta Completo
export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  nivel: NivelAlerta;
  status: StatusAlerta;
  titulo: string;
  descricao: string;
  mensagem: string;
  recomendacoes: string[];
  criadoEm: Date | string;
  visualizadoEm?: Date | string;
  sessaoId: string;
  usuarioId: string;
  metadados?: {
    theta?: number;
    confianca?: number;
    tempoResposta?: number;
    [key: string]: any;
  };
}

// Filtros
export interface AlertaFiltros {
  nivel?: NivelAlerta[];
  tipo?: TipoAlerta[];
  status?: StatusAlerta[];
  sessaoId?: string;
  usuarioId?: string;
  dataInicio?: Date | string;
  dataFim?: Date | string;
}
```

### Utilities (`src/lib/alerta-utils.ts`)

#### 1. **getAlertaIcon(tipo: TipoAlerta)**
Retorna ícone do Lucide React:
```typescript
RISCO_EVASAO → TrendingDown
DIFICULDADE_APRENDIZAGEM → BookOpen
ANSIEDADE_AVALIATIVA → AlertTriangle
FADIGA_COGNITIVA → Brain
// ... etc
```

#### 2. **getAlertaTitulo(tipo: TipoAlerta)**
Títulos amigáveis:
```typescript
'RISCO_EVASAO' → 'Risco de Evasão'
'FADIGA_COGNITIVA' → 'Fadiga Cognitiva'
```

#### 3. **getAlertaDescricaoCurta(tipo: TipoAlerta)**
Descrições curtas:
```typescript
'RISCO_EVASAO' → 'Padrões indicam possível abandono'
```

#### 4. **getRecomendacoesPadrao(tipo: TipoAlerta)**
Recomendações baseadas em evidências:
```typescript
'RISCO_EVASAO' → [
  'Agendar conversa individual com o aluno',
  'Verificar frequência e participação',
  'Oferecer suporte adicional ou tutoria',
  'Avaliar dificuldades pessoais ou acadêmicas'
]
```

#### 5. **formatarDataRelativa(data: Date | string)**
Formata datas:
```typescript
'há 2 horas'
'há 1 dia'
'agora mesmo'
```

#### 6. **getStatusLabel(status: string)**
Labels de status:
```typescript
'ATIVO' → 'Ativo'
'EM_ACOMPANHAMENTO' → 'Em Acompanhamento'
```

#### 7. **getStatusColors(status: string)**
Cores Tailwind para badges:
```typescript
{
  bg: 'bg-blue-100',
  text: 'text-blue-700',
  border: 'border-blue-300'
}
```

---

## 🔗 Hooks (`src/hooks/useAlertas.ts`)

### 1. useAlertas(options)
Busca lista de alertas com filtros:
```typescript
const { data: alertas, isLoading } = useAlertas({
  filtros: {
    nivel: ['VERMELHO', 'LARANJA'],
    status: ['ATIVO'],
    sessaoId: 'sessao-123'
  },
  refetchInterval: 15000 // Auto-refresh
});
```

### 2. useAlerta(alertaId)
Busca alerta específico:
```typescript
const { data: alerta } = useAlerta('alerta-123');
```

### 3. useResumoAlertas(usuarioId?)
Busca resumo estatístico:
```typescript
const { data: resumo } = useResumoAlertas('user-456');
// resumo.total, resumo.ativos, resumo.porNivel, resumo.porTipo
```

### 4. useMarcarAlertaVisualizado()
Mutation para marcar como visualizado:
```typescript
const marcar = useMarcarAlertaVisualizado();
marcar.mutate('alerta-123');
```

### 5. useAtualizarStatusAlerta()
Mutation para atualizar status:
```typescript
const atualizar = useAtualizarStatusAlerta();
atualizar.mutate({ alertaId: '123', status: 'RESOLVIDO' });
```

### 6. useBuscarAjuda()
Mutation para solicitar ajuda:
```typescript
const buscar = useBuscarAjuda();
buscar.mutate({
  alertaId: '123',
  mensagem: 'Situação requer atenção urgente'
});
```

---

## 📖 Uso

### Instalação

Os componentes já estão criados. Certifique-se de ter:

```bash
# Componentes UI necessários (já instalados)
# dialog, separator, textarea, tabs, badge, button, card
```

### Import

```typescript
import { AlertaPanel } from '@/components/avaliacoes/AlertaPanel';
import { AlertaCard } from '@/components/avaliacoes/AlertaCard';
import { AlertaDetalhesModal } from '@/components/avaliacoes/AlertaDetalhesModal';
import { useAlertas } from '@/hooks/useAlertas';
import type { Alerta, TipoAlerta } from '@/types/alerta';
```

---

## 💡 Exemplos

### Exemplo 1: Painel Completo (Página de Alertas)

```tsx
'use client';

import { AlertaPanel } from '@/components/avaliacoes/AlertaPanel';

export default function AlertasPage() {
  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Alertas do Sistema</h1>
      
      <AlertaPanel
        usuarioId="user-123"
        autoRefresh={true}
      />
    </div>
  );
}
```

**Resultado**: Painel completo com abas, filtros, auto-refresh a cada 15s.

---

### Exemplo 2: Painel Compact (Sidebar)

```tsx
<aside className="w-80">
  <AlertaPanel
    compact
    maxAlertas={5}
    sessaoId="sessao-atual"
    autoRefresh={true}
  />
</aside>
```

**Resultado**: Widget compacto mostrando até 5 alertas mais recentes.

---

### Exemplo 3: Durante Sessão Ativa

```tsx
'use client';

import { AlertaPanel } from '@/components/avaliacoes/AlertaPanel';
import { ProgressBarAdaptativo } from '@/components/avaliacoes/ProgressBarAdaptativo';

export default function SessaoAtiva({ sessaoId }: { sessaoId: string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Conteúdo Principal */}
      <div className="lg:col-span-2 space-y-6">
        <ProgressBarAdaptativo {...progressProps} />
        {/* Pergunta atual... */}
      </div>

      {/* Sidebar com Alertas */}
      <div>
        <AlertaPanel
          compact
          sessaoId={sessaoId}
          maxAlertas={10}
          autoRefresh={true}
        />
      </div>
    </div>
  );
}
```

**Resultado**: Alertas em tempo real na sidebar durante avaliação.

---

### Exemplo 4: Card Individual

```tsx
'use client';

import { useState } from 'react';
import { AlertaCard } from '@/components/avaliacoes/AlertaCard';
import { AlertaDetalhesModal } from '@/components/avaliacoes/AlertaDetalhesModal';
import { useAlertas } from '@/hooks/useAlertas';

export function ListaAlertas() {
  const [alertaSelecionado, setAlertaSelecionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: alertas = [] } = useAlertas({
    filtros: { status: ['ATIVO'] }
  });

  return (
    <div className="space-y-4">
      {alertas.map(alerta => (
        <AlertaCard
          key={alerta.id}
          alerta={alerta}
          onClick={() => {
            setAlertaSelecionado(alerta);
            setModalOpen(true);
          }}
        />
      ))}

      <AlertaDetalhesModal
        alerta={alertaSelecionado}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
```

---

### Exemplo 5: Dashboard com Resumo

```tsx
'use client';

import { useResumoAlertas } from '@/hooks/useAlertas';
import { AlertaPanel } from '@/components/avaliacoes/AlertaPanel';

export function DashboardAlertas() {
  const { data: resumo } = useResumoAlertas();

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{resumo?.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Vermelho</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {resumo?.porNivel.VERMELHO}
            </div>
          </CardContent>
        </Card>

        {/* ... mais cards */}
      </div>

      {/* Painel Completo */}
      <AlertaPanel autoRefresh={true} />
    </div>
  );
}
```

---

## 🔌 Integração com API

### Estrutura Esperada

#### GET /api/alertas
```typescript
// Query params: nivel, tipo, status, sessaoId, usuarioId
Response: Alerta[]
```

#### GET /api/alertas/resumo
```typescript
Response: ResumoAlertas {
  total: number;
  ativos: number;
  porNivel: { VERDE, AMARELO, LARANJA, VERMELHO };
  porTipo: Record<TipoAlerta, number>;
}
```

#### PATCH /api/alertas/[id]/visualizar
```typescript
Response: { success: true }
```

#### PATCH /api/alertas/[id]/status
```typescript
Body: { status: StatusAlerta }
Response: Alerta
```

#### POST /api/alertas/[id]/buscar-ajuda
```typescript
Body: { mensagem?: string }
Response: { success: true, notificacaoId: string }
```

---

## 🎯 Tipos de Alerta

### 1. RISCO_EVASAO (🔴 Crítico)
**Indicadores**:
- Baixo engajamento persistente
- Taxa de conclusão decrescente
- Aumento no tempo de resposta
- Padrões de desistência

**Recomendações**:
- Conversa individual urgente
- Verificar situação pessoal/familiar
- Avaliar dificuldades financeiras
- Oferecer suporte psicológico

---

### 2. DIFICULDADE_APRENDIZAGEM (🟠 Alto)
**Indicadores**:
- Erros em conceitos fundamentais
- Theta IRT consistentemente baixo (< -1.5)
- Dificuldade mesmo com múltiplas tentativas

**Recomendações**:
- Revisar conteúdo com abordagem diferenciada
- Material de apoio adicional
- Atividades de reforço
- Acompanhamento especializado

---

### 3. ANSIEDADE_AVALIATIVA (🟠 Alto)
**Indicadores**:
- Tempo excessivo em perguntas simples
- Padrão de respostas inseguras
- Inconsistências por estresse

**Recomendações**:
- Formatos alternativos de avaliação
- Ambiente mais acolhedor
- Feedback encorajador
- Técnicas de relaxamento

---

### 4. FADIGA_COGNITIVA (🟡 Moderado)
**Indicadores**:
- Queda de desempenho ao longo do tempo
- Aumento progressivo no tempo de resposta
- Erros por desatenção

**Recomendações**:
- Pausas mais frequentes
- Dividir atividades em blocos
- Avaliar carga total
- Descanso adequado

---

### 5. BAIXO_ENGAJAMENTO (🟡 Moderado)
**Indicadores**:
- Respostas superficiais
- Tempo mínimo nas questões
- Baixa participação

**Recomendações**:
- Variar metodologias
- Atividades interativas
- Verificar motivação
- Metas alcançáveis

---

### 6. TEMPO_EXCESSIVO (🟡 Moderado)
**Indicadores**:
- Demora acima da média esperada
- Dificuldade de decisão

**Recomendações**:
- Investigar dificuldades específicas
- Verificar problemas de leitura
- Mais tempo ou adaptações
- Avaliar perfeccionismo

---

### 7. INCONSISTENCIA_RESPOSTAS (🟠 Alto)
**Indicadores**:
- Respostas contraditórias
- Padrões inconsistentes

**Recomendações**:
- Revisar compreensão das perguntas
- Verificar leitura adequada
- Avaliar distrações
- Considerar reaplicação

---

### 8. PADRAO_ALEATORIO (🔴 Crítico)
**Indicadores**:
- Respostas sem padrão coerente
- Análise estatística indica aleatoriedade (p < 0.01)

**Recomendações**:
- Verificar compreensão das instruções
- Avaliar nível de atenção
- Invalidar e reaplicar
- Conversar sobre importância

---

## 🎨 Cores e Estilo

### Paleta de Níveis

| Nível | Badge BG | Badge Text | Border | Uso |
|-------|----------|------------|--------|-----|
| VERDE | `bg-green-100` | `text-green-700` | `border-green-300` | Informativo |
| AMARELO | `bg-yellow-100` | `text-yellow-700` | `border-yellow-300` | Atenção |
| LARANJA | `bg-orange-100` | `text-orange-700` | `border-orange-300` | Alerta |
| VERMELHO | `bg-red-100` | `text-red-700` | `border-red-300` | Crítico |

### Status

| Status | Badge BG | Badge Text | Significado |
|--------|----------|------------|-------------|
| ATIVO | `bg-blue-100` | `text-blue-700` | Requer ação |
| VISUALIZADO | `bg-gray-100` | `text-gray-700` | Visto |
| EM_ACOMPANHAMENTO | `bg-purple-100` | `text-purple-700` | Tratando |
| RESOLVIDO | `bg-green-100` | `text-green-700` | Concluído |

---

## ✅ Checklist de Implementação

- [x] Tipos TypeScript (`alerta.ts`)
- [x] Funções utilitárias (`alerta-utils.ts`)
- [x] Hooks TanStack Query (`useAlertas.ts`)
- [x] Componente AlertaCard (2 variantes)
- [x] Componente AlertaDetalhesModal
- [x] Componente AlertaPanel (2 modos)
- [x] Página de teste (`/teste/alertas`)
- [x] Documentação completa
- [ ] API endpoints (próximo passo)
- [ ] Integração em página de sessão (próximo passo)

---

## 🚀 Próximos Passos

1. **Testar visualmente** em `/teste/alertas`
2. **Implementar API endpoints** faltantes:
   - `/api/alertas/[id]/visualizar`
   - `/api/alertas/[id]/status`
   - `/api/alertas/[id]/buscar-ajuda`
   - `/api/alertas/resumo`
3. **Integrar** na página de sessão `/avaliacoes/sessao/[id]`
4. **Criar página** `/avaliacoes/alertas`
5. **Notificações** para responsáveis (email/push)
6. **Analytics** de alertas (dashboard)

---

## 📝 Notas Técnicas

### Performance
- TanStack Query faz cache automático
- Auto-refresh configurável (15s padrão)
- Invalidação otimista após mutations
- Lazy loading do modal

### Acessibilidade
- Cores com contraste WCAG AA
- Ícones descritivos
- Keyboard navigation no modal
- Screen reader friendly

### UX
- Loading states consistentes
- Toast notifications (sonner)
- Confirmações implícitas
- Estados vazios amigáveis

---

**Documentação criada em**: 21/10/2025  
**Versão**: 1.0  
**Autor**: GitHub Copilot  
**Componentes**: AlertaPanel, AlertaCard, AlertaDetalhesModal
