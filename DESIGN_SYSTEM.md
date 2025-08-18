# 🎨 ClassCheck Design System v2

## 📋 Visão Geral

Este design system implementa a **Fase 2.1** especificada no PROMPT.md, fornecendo uma biblioteca completa de componentes reutilizáveis, tokens de design e padrões de interface para a plataforma ClassCheck.

## 🗂️ Estrutura do Sistema

### 1. 🎨 Design Tokens
```
src/lib/design-tokens.ts
```
- **Cores**: Escalas completas (primary, success, warning, danger, neutral)
- **Tipografia**: Tamanhos, pesos e altura de linha consistentes
- **Espaçamento**: Sistema de grid de 4px com escala logarítmica
- **Sombras**: 5 níveis de profundidade
- **Bordas**: Raios de borda padronizados
- **Breakpoints**: Responsividade mobile-first
- **Z-index**: Hierarquia de camadas definida

### 2. 🔄 Componentes de Loading
```
src/components/ui/spinner.tsx
src/components/ui/loading-skeleton.tsx
src/components/ui/loading-button.tsx
src/components/ui/page-loading.tsx
```

#### Spinner
- **Variantes**: 3 tamanhos (sm, md, lg)
- **Cores**: Customizáveis via design tokens
- **Acessibilidade**: ARIA labels e screen reader friendly
- **Componentes**: `Spinner`, `SpinnerOverlay`, `SpinningDots`

#### Loading Skeleton
- **Padrões**: Texto, cards, listas, tabelas
- **ClassCheck específico**: `AulaCardSkeleton`, `ProfessorCardSkeleton`
- **Animação**: Shimmer effect suave
- **Responsivo**: Adapta-se a diferentes tamanhos de tela

#### Loading Button
- **Estados**: Loading integrado aos botões
- **ClassCheck específico**: `AvaliarButton`, `FavoritarButton`
- **Feedback**: Spinner + texto de loading
- **Acessibilidade**: Estados claramente comunicados

#### Page Loading
- **Experiências**: Loading de página completa
- **Progresso**: Barras de progresso com steps
- **Variantes**: App, Route, Component loading
- **Overlay**: Backgrounds semitransparentes

### 3. 🍞 Sistema de Toast
```
src/components/ui/toast.tsx
src/hooks/use-toast.ts
src/components/ui/toast-display.tsx
```

#### Toast Component
- **Variantes**: Success, Error, Warning, Info, Loading
- **Ações**: Botões de ação customizáveis
- **Auto-dismiss**: Tempo configurável
- **Acessibilidade**: ARIA live regions

#### useToast Hook
- **Context**: Provider para gerenciamento global
- **Queue**: Fila de toasts com limite
- **ClassCheck específico**: `useClassCheckToast` com shortcuts
- **SSR Safe**: Compatível com renderização server-side

#### Toast Display
- **Portal**: Renderização em camada superior
- **Posições**: 9 posições configuráveis
- **Animações**: Entrada/saída suaves
- **Hydration**: Seguro para SSR/SSG

### 4. 📝 Inputs Avançados
```
src/components/ui/enhanced-input.tsx
src/components/ui/enhanced-textarea.tsx
src/components/ui/masked-input.tsx
```

#### Enhanced Input
- **Estados**: Default, focused, error, disabled
- **Ícones**: Leading e trailing icons
- **Validação**: Estados visuais de erro/sucesso
- **ClassCheck específico**: `AulaSearchInput`, `ProfessorSearchInput`, `NotaInput`

#### Enhanced Textarea
- **Auto-expand**: Redimensionamento automático
- **Contadores**: Caracteres e palavras
- **ClassCheck específico**: `ComentarioTextarea`, `FeedbackTextarea`
- **Limites**: Validação visual de limites

#### Masked Input
- **Formatos BR**: CPF, CNPJ, telefone, CEP
- **Moeda**: Formatação de valores monetários
- **Datas**: Máscaras de data brasileira
- **Validação**: Integrada com regras brasileiras

### 5. 🏫 Componentes ClassCheck
```
src/components/classcheck/aula-card-v2.tsx
src/components/classcheck/professor-card.tsx
src/components/classcheck/avaliacao-card.tsx
```

#### Aula Card v2
- **Variantes**: Default, Compact, Featured
- **Funcionalidades**: Thumbnail, favoritos, progresso
- **Estados**: Disponível, lotada, cancelada
- **Interações**: Click, hover, favoritar

#### Professor Card
- **Layouts**: Vertical e horizontal
- **Informações**: Verificação, estatísticas, disponibilidade
- **Ações**: Seguir, avaliar, contatar
- **Estados**: Online, ocupado, offline

#### Avaliação Card
- **Sistema**: Avaliação por estrelas
- **Interações**: Like/dislike, resposta do professor
- **Aspectos**: Avaliação por critérios específicos
- **Moderação**: Sistema de reports

### 6. 📊 Estados e Feedback
```
src/components/ui/feedback-states.tsx
src/components/ui/metrics-progress.tsx
```

#### Feedback States
- **Empty States**: Personalizados por contexto
- **Error States**: Com ações de recuperação
- **Status Indicators**: Estados de sistema
- **ClassCheck específico**: Estados educacionais

#### Metrics Progress
- **Cards de Métricas**: KPIs visuais
- **Progress Tracking**: Barras e círculos de progresso
- **Gamificação**: Achievements e badges
- **ClassCheck específico**: Métricas educacionais

### 7. 🚀 Componentes Avançados
```
src/components/ui/advanced-components.tsx
src/components/ui/analytics-dashboard.tsx
src/components/ui/configuration-panel.tsx
```

#### Study Timer (Pomodoro)
- **Técnica Pomodoro**: 25min trabalho / 5min pausa
- **Estados**: Trabalho, pausa, pausa longa
- **Sessões**: Contador de sessões completadas
- **Notificações**: Avisos sonoros e visuais

#### Agenda Component
- **Time Slots**: Divisão por horários (7h-22h)
- **Eventos**: Tipos de evento (aula, reunião, etc.)
- **Estados**: Disponível, ocupado, bloqueado
- **Ações**: Join, detalhes, professor info

#### Analytics Dashboard
- **Métricas**: Views, alunos, aulas, avaliações
- **Trends**: Indicadores de crescimento
- **Gráficos**: Visualização temporal
- **Filtros**: Períodos (7d, 30d, 90d, 1y)
- **Export**: Exportação de dados

#### Configuration Panel
- **User Settings**: Aparência, notificações, privacidade
- **System Settings**: Admin configurations
- **Feature Flags**: Controle de funcionalidades
- **Security**: Políticas de senha e 2FA

## 🎯 Guia de Uso

### Importação Centralizada
```typescript
// Importar múltiplos componentes
import { 
  Spinner, 
  LoadingButton, 
  Toast,
  AulaCard,
  ProfessorCard 
} from '@/components/ui'

// Importar hooks
import { useToast } from '@/hooks/use-toast'

// Importar design tokens
import { designTokens } from '@/components/ui'
```

### Exemplos Práticos

#### Toast System
```typescript
const { toast } = useClassCheckToast()

// Toast de sucesso
toast.success("Aula favoritada com sucesso!")

// Toast de avaliação
toast.avaliacaoEnviada("Sua avaliação foi enviada")

// Toast com ação
toast.error("Erro ao carregar", {
  action: {
    label: "Tentar novamente",
    onClick: () => refetch()
  }
})
```

#### Loading States
```typescript
// Loading button
<LoadingButton loading={isSubmitting}>
  Salvar Alterações
</LoadingButton>

// Page loading
<PageLoading 
  steps={["Carregando aulas", "Verificando permissões", "Pronto!"]}
  currentStep={currentStep}
/>

// Skeleton loading
<AulaCardSkeleton count={6} />
```

#### ClassCheck Components
```typescript
// Aula Card
<AulaCard
  aula={aulaData}
  variant="featured"
  onFavorite={(id) => toggleFavorite(id)}
  onEnroll={(id) => enrollInClass(id)}
/>

// Professor Card
<ProfessorCard
  professor={profData}
  layout="horizontal"
  showStats={true}
  onFollow={(id) => followProfessor(id)}
/>
```

## 🛠️ Tecnologias Utilizadas

- **React 18**: Hooks, Context, Portals
- **TypeScript**: Tipagem completa e type safety
- **Tailwind CSS**: Utility-first CSS framework
- **CVA**: Class Variance Authority para variantes
- **Lucide React**: Ícones consistentes
- **Radix UI**: Primitivos acessíveis (onde aplicável)

## 📱 Responsividade

Todos os componentes seguem a abordagem **mobile-first**:

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

## ♿ Acessibilidade

### Padrões Implementados
- **ARIA**: Labels, roles, states adequados
- **Keyboard Navigation**: Suporte completo a teclado
- **Screen Readers**: Compatibilidade total
- **Color Contrast**: WCAG 2.1 AA compliant
- **Focus Management**: Indicadores visuais claros

### Ferramentas de Teste
- **axe-core**: Testes automatizados
- **NVDA/JAWS**: Testes com screen readers
- **Keyboard Only**: Navegação sem mouse

## 🔧 Desenvolvimento

### Scripts Úteis
```bash
# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint

# Testes de componentes
npm run test:components

# Build de produção
npm run build
```

### Contribuição
1. **Clone** do repositório
2. **Feature branch** a partir de `main`
3. **Implementação** seguindo os padrões estabelecidos
4. **Testes** de acessibilidade e responsividade
5. **Pull Request** com documentação

## 📈 Roadmap

### Próximas Fases
- **Fase 2.2**: Componentes de Data Visualization
- **Fase 2.3**: Sistema de Drag & Drop
- **Fase 2.4**: Componentes de Video/Audio
- **Fase 3.0**: Design System Mobile (React Native)

### Melhorias Contínuas
- Performance optimization
- Bundle size reduction
- A11y improvements
- Dark mode refinements

## 📞 Suporte

Para dúvidas sobre o design system:
- **Documentação**: `/docs/design-system`
- **Storybook**: `/storybook` (quando disponível)
- **Issues**: GitHub Issues para bugs/features

---

**ClassCheck Design System v2** - Construído com ❤️ para educação de qualidade.
