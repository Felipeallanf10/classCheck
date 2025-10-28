# QuestionarioSelector Component

## 📋 Visão Geral

Componente React para listar, filtrar e selecionar questionários socioemocionais. Integrado com TanStack Query para cache e gerenciamento de estado, e com a API de sessões adaptativas.

## ✨ Funcionalidades

- ✅ **Listagem de Questionários** - Busca questionários ativos via API
- 🔍 **Busca por Texto** - Filtro por título, descrição ou tipo
- 🎯 **Filtros Avançados** - Por tipo (WHO-5, PHQ-9, etc) e modo (adaptativo/padrão)
- 🎨 **Cards Visuais** - Design moderno com ícones, badges e animações
- ⚡ **Performance** - Cache de 5 minutos com TanStack Query
- 📱 **Responsivo** - Grid adaptativo (1/2/3 colunas)
- 🚀 **Início de Sessão** - Cria sessão automaticamente ao selecionar
- 🔔 **Notificações** - Toast com feedback de sucesso/erro

## 🎨 Componentes Criados

### 1. `QuestionarioSelector`
Componente principal com listagem e filtros.

**Props:**
- `usuarioId: number` - ID do usuário (obrigatório)
- `onQuestionarioSelect?: (questionarioId: string, sessaoId: string) => void` - Callback ao selecionar (opcional)

**Exemplo de uso:**
```tsx
import { QuestionarioSelector } from '@/components/avaliacoes';

export default function QuestionariosPage() {
  return (
    <QuestionarioSelector
      usuarioId={1}
      onQuestionarioSelect={(qId, sId) => {
        console.log('Sessão iniciada:', sId);
      }}
    />
  );
}
```

### 2. `QuestionarioCard`
Card individual de questionário.

**Props:**
- `questionario: QuestionarioResumo` - Dados do questionário
- `onSelect: (id: string) => void` - Callback ao clicar em "Iniciar"
- `isLoading?: boolean` - Estado de carregamento

### 3. `useQuestionarios` Hook
Hook personalizado com TanStack Query.

**Parâmetros:**
- `filtros?: QuestionarioFiltros` - Filtros opcionais

**Retorna:**
- `data: QuestionariosResponse` - Lista de questionários
- `isLoading: boolean` - Estado de carregamento
- `error: Error | null` - Erro se houver
- `refetch: () => void` - Função para recarregar

**Exemplo:**
```tsx
const { data, isLoading, error } = useQuestionarios({
  tipo: 'WHO5',
  adaptativo: true,
  ativo: true,
});
```

## 🎨 Design System

### Badges
- **Oficial** - Azul (checkmark)
- **Adaptativo** - Roxo (sparkles)
- **WHO-5** - Verde
- **PHQ-9** - Azul
- **GAD-7** - Roxo
- **Circumplex** - Rosa
- **Personalizado** - Cinza

### Ícones por Categoria
- `BEM_ESTAR` → SmilePlus (verde)
- `ANSIEDADE` → HeartPulse (roxo)
- `DEPRESSAO` → Brain (azul)
- `HUMOR` → Heart (rosa)
- `ENERGIA` → Sparkles (amarelo)
- `SONO` → Moon (índigo)
- `CONCENTRACAO` → Focus (ciano)
- `AUTOESTIMA` → Award (âmbar)
- `RELACIONAMENTOS` → Users (rose)
- `ESTRESSE` → Zap (vermelho)
- `MOTIVACAO` → Target (laranja)
- `EMOCIONAL` → Heart (fúcsia)

## 📦 Arquivos Criados

```
src/
├── components/
│   └── avaliacoes/
│       ├── QuestionarioSelector.tsx    # Componente principal
│       ├── QuestionarioCard.tsx        # Card individual
│       └── index.ts                    # Exportações
├── hooks/
│   └── useQuestionarios.ts             # Hook TanStack Query
├── lib/
│   └── questionario-utils.ts           # Utilitários (ícones, cores, formatação)
└── types/
    └── questionario.ts                 # Tipos TypeScript
```

## 🔌 Integração com API

### Endpoint: `GET /api/questionarios`

**Query Params:**
- `tipo?: TipoQuestionario`
- `categoria?: CategoriaPergunta`
- `adaptativo?: boolean`
- `ativo?: boolean`
- `oficial?: boolean`

**Response:**
```json
{
  "success": true,
  "total": 3,
  "questionarios": [
    {
      "id": "uuid",
      "titulo": "WHO-5 Bem-Estar",
      "descricao": "Avalia bem-estar geral",
      "tipo": "WHO5",
      "adaptativo": true,
      "duracaoEstimada": 5,
      "categorias": ["BEM_ESTAR", "HUMOR"],
      "_count": {
        "perguntas": 5,
        "sessoes": 120
      }
    }
  ]
}
```

### Endpoint: `POST /api/sessoes/iniciar`

Chamado automaticamente ao clicar em "Iniciar Avaliação".

**Body:**
```json
{
  "questionarioId": "uuid",
  "usuarioId": 1,
  "contexto": {
    "origem": "questionario-selector",
    "dispositivo": "desktop"
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessaoId": "uuid",
  "questionario": { ... },
  "primeiraPergunta": { ... },
  "progresso": { ... }
}
```

## 🎯 Filtros Disponíveis

### Busca por Texto
Campo de busca que filtra por:
- Título do questionário
- Descrição
- Tipo (WHO5, PHQ9, etc)

### Filtro por Tipo
- WHO-5 (Bem-estar)
- PHQ-9 (Depressão)
- GAD-7 (Ansiedade)
- Circumplex (Emoções)
- Personalizado

### Filtro por Modo
- **Adaptativo** - IRT com seleção dinâmica de perguntas
- **Padrão** - Todas as perguntas em ordem fixa
- **Todos** - Sem filtro

## 🚀 Fluxo de Uso

1. **Usuário** vê lista de questionários disponíveis
2. **Aplica filtros** (opcional) - tipo, modo, busca
3. **Clica** em "Iniciar Avaliação" no card
4. **Sistema** cria sessão via POST `/api/sessoes/iniciar`
5. **Navega** para `/avaliacoes/sessao/:id` (ou callback customizado)
6. **Inicia** responder perguntas

## 🎨 Customização

### Alterar comportamento ao selecionar

```tsx
<QuestionarioSelector
  usuarioId={1}
  onQuestionarioSelect={(questionarioId, sessaoId) => {
    // Customizar navegação ou ação
    router.push(`/minha-rota/${sessaoId}`);
  }}
/>
```

### Adicionar novos filtros

Edite `QuestionarioFiltros` em `src/types/questionario.ts`:

```typescript
export interface QuestionarioFiltros {
  tipo?: TipoQuestionario;
  categoria?: CategoriaPergunta;
  adaptativo?: boolean;
  ativo?: boolean;
  oficial?: boolean;
  // Adicione aqui:
  duracaoMaxima?: number;
}
```

## 📊 Performance

- **Cache**: 5 minutos (staleTime)
- **Garbage Collection**: 10 minutos (gcTime)
- **Refetch**: Automático ao focar janela (padrão TanStack Query)
- **Otimização**: Busca por texto é client-side (evita requests)

## 🐛 Tratamento de Erros

- ✅ Erro ao buscar questionários → Alert vermelho
- ✅ Erro ao iniciar sessão → Toast de erro
- ✅ Nenhum questionário encontrado → Alert informativo
- ✅ Loading states → Skeletons animados

## 📝 TODO Futuro

- [ ] Adicionar favoritos
- [ ] Histórico de sessões completadas por questionário
- [ ] Preview do questionário (modal com perguntas)
- [ ] Recomendações personalizadas
- [ ] Filtro por categoria
- [ ] Ordenação (popularidade, duração, alfabética)

## 🧪 Testes

Para testar o componente:

```bash
# 1. Inicie o servidor
npm run dev

# 2. Acesse a página (após criar a página)
http://localhost:3000/avaliacoes/questionarios

# 3. Ou importe em qualquer página:
import { QuestionarioSelector } from '@/components/avaliacoes';
```

## 🎓 Dependências

- `@tanstack/react-query` - Cache e estado
- `lucide-react` - Ícones
- `sonner` - Toast notifications
- `shadcn/ui` - Componentes UI (Button, Card, Badge, Select, Input, etc)
- `next/navigation` - Navegação
