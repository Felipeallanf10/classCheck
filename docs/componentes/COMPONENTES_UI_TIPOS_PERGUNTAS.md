# Componentes UI de Tipos de Perguntas - ClassCheck

## Visão Geral

Sistema completo de 10 componentes para renderizar diferentes tipos de perguntas no sistema de avaliações adaptativas.

---

## 1. LIKERT_5 ✅

**Arquivo:** `src/components/avaliacoes/tipos/Likert5.tsx`

**Uso:** PSS-10, perguntas gerais de concordância

**Escala:** 1 a 5

**Props:**
```typescript
{
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  labels?: Record<1 | 2 | 3 | 4 | 5, string>;
}
```

**Labels padrão:**
- 1: Nunca
- 2: Quase nunca
- 3: Às vezes
- 4: Quase sempre
- 5: Sempre

**Características:**
- Botões horizontais com cores gradientes (verde → vermelho)
- Visual de checkbox circular
- Indicador de progresso
- Responsivo (grid em mobile)

---

## 2. LIKERT_7 ✅

**Arquivo:** `src/components/avaliacoes/tipos/Likert7.tsx`

**Uso:** SWLS (Satisfaction With Life Scale)

**Escala:** 1 a 7

**Props:**
```typescript
{
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  labels?: {
    inicio?: string;
    meio?: string;
    fim?: string;
  };
}
```

**Labels padrão:**
- 1: Discordo totalmente
- 4: Neutro
- 7: Concordo totalmente

**Características:**
- Escala visual horizontal com marcadores
- Barra de progresso gradiente (vermelho → amarelo → verde)
- Grid alternativo para mobile
- Hover effects e animações

---

## 3. ESCALA_FREQUENCIA ✅

**Arquivo:** `src/components/avaliacoes/tipos/EscalaFrequencia.tsx`

**Uso:** PHQ-9 (depressão), GAD-7 (ansiedade)

**Escala:** 0 a 3

**Props:**
```typescript
{
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  labels?: Record<0 | 1 | 2 | 3, string>;
}
```

**Labels padrão:**
- 0: Nenhuma vez
- 1: Vários dias
- 2: Mais da metade dos dias
- 3: Quase todos os dias

**Características:**
- Grid 2x2 em desktop, vertical em mobile
- Checkboxes visuais grandes
- Hover scale effect
- Ring de foco quando selecionado
- Indicador textual de seleção

**Justificativa científica:**
- PHQ-9 e GAD-7 são instrumentos validados que medem frequência de sintomas
- Escala original usa exatamente estas 4 opções (Kroenke et al., 2001; Spitzer et al., 2006)

---

## 4. ESCALA_INTENSIDADE ✅

**Arquivo:** `src/components/avaliacoes/tipos/EscalaIntensidade.tsx`

**Uso:** PANAS (afeto), ISI (insônia)

**Escala:** 1 a 5

**Props:**
```typescript
{
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  labels?: Record<1 | 2 | 3 | 4 | 5, string>;
  showEmojis?: boolean;
}
```

**Labels padrão:**
- 1: Nada
- 2: Pouco
- 3: Moderado
- 4: Bastante
- 5: Extremamente

**Características:**
- Grid de 5 colunas com emojis
- Cores gradientes por intensidade (verde → azul → amarelo → laranja → vermelho)
- Barra de progresso visual abaixo
- Emojis opcionais (😌 🙂 😐 😟 😰)
- Scale e shadow effects ao selecionar

**Justificativa científica:**
- PANAS usa escala de intensidade/magnitude (Watson et al., 1988)
- ISI mede severidade/intensidade dos sintomas de insônia (Bastien et al., 2001)

---

## 5. ESCALA_VISUAL ✅

**Arquivo:** `src/components/avaliacoes/tipos/EscalaVisual.tsx`

**Uso:** Circumplex Model (Russell) - Avaliação emocional bidimensional

**Escala:** Bidimensional { x: -1 a 1, y: -1 a 1 }

**Props:**
```typescript
{
  value?: { x: number; y: number };
  onChange: (value: { x: number; y: number }) => void;
  disabled?: boolean;
}
```

**Eixos:**
- X: Valência (-1 = Negativo, +1 = Positivo)
- Y: Ativação (-1 = Baixa, +1 = Alta)

**Características:**
- Grid interativo clicável e arrastável
- 8 emoções de referência com emojis
- Gradiente de fundo (vermelho → amarelo → verde)
- Linhas de grade e eixos centrais
- Seleção rápida por botões de emoções
- Indicador animado de posição

**Emoções de referência:**
- Animado (0.7, 0.7) 🤩
- Feliz (0.7, 0) 😊
- Calmo (0.7, -0.7) 😌
- Relaxado (0, -0.7) 😴
- Triste (-0.7, -0.7) 😢
- Deprimido (-0.7, 0) 😔
- Ansioso (-0.7, 0.7) 😰
- Tenso (0, 0.7) 😬

**Justificativa científica:**
- Baseado no Circumplex Model of Affect (Russell, 1980)
- Dimensões de valência e ativação bem estabelecidas na literatura
- Permite capturar nuances emocionais que escalas unidimensionais não capturam

---

## 6. SIM_NAO ✅

**Arquivo:** `src/components/avaliacoes/tipos/SimNao.tsx`

**Uso:** Perguntas binárias simples

**Escala:** boolean (true/false)

**Props:**
```typescript
{
  value?: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}
```

**Características:**
- Dois botões grandes (Sim/Não)
- Ícones Check e X
- Cores verde e vermelho
- Animações hover

---

## 7. MULTIPLA_ESCOLHA ✅

**Arquivo:** `src/components/avaliacoes/tipos/MultiplaEscolha.tsx`

**Uso:** Perguntas com uma resposta entre várias opções

**Props:**
```typescript
{
  opcoes: Array<{
    id: string;
    texto: string;
    valor: string | number;
    label?: string;
  }>;
  value?: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
}
```

**Características:**
- Radio buttons visuais
- Lista vertical de opções
- Indicação clara de seleção
- Suporta valores string ou number

---

## 8. MULTIPLA_SELECAO ✅

**Arquivo:** `src/components/avaliacoes/tipos/SelecaoMultipla.tsx`

**Uso:** Perguntas onde múltiplas respostas são permitidas (ex: sintomas)

**Props:**
```typescript
{
  opcoes: Array<{
    id: string;
    texto: string;
    valor: string | number;
    label?: string;
  }>;
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  disabled?: boolean;
}
```

**Características:**
- Checkboxes visuais
- Permite selecionar 0 a N opções
- Contador de seleções
- Toggle individual de cada opção

---

## 9. EMOJI_PICKER ✅

**Arquivo:** `src/components/avaliacoes/tipos/EmojiRating.tsx`

**Uso:** Avaliação rápida visual com emojis

**Escala:** 1 a 5

**Props:**
```typescript
{
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}
```

**Emojis:**
- 1: 😢 (Muito mal)
- 2: 😟 (Mal)
- 3: 😐 (Neutro)
- 4: 🙂 (Bem)
- 5: 😊 (Muito bem)

**Características:**
- Emojis grandes clicáveis
- Escala de tamanho ao hover
- Cores associadas aos estados emocionais

---

## 10. SLIDER_NUMERICO ✅

**Arquivo:** `src/components/avaliacoes/tipos/Slider.tsx`

**Uso:** Escalas contínuas (0-100, etc)

**Props:**
```typescript
{
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
}
```

**Características:**
- Slider HTML5 estilizado
- Valores min/max configuráveis
- Step configurável
- Display opcional do valor
- Barra de progresso visual

---

## Uso no PerguntaRenderer

O componente `PerguntaRenderer` detecta automaticamente o tipo da pergunta e renderiza o componente apropriado:

```typescript
import { PerguntaRenderer } from '@/components/avaliacoes/PerguntaRenderer';

<PerguntaRenderer
  pergunta={pergunta}
  value={resposta}
  onChange={setResposta}
  onComplete={handleProximaPergunta}
/>
```

## Mapeamento Tipo → Componente

| tipoPergunta         | Componente         | Escala      |
|---------------------|--------------------|-------------|
| LIKERT_5            | Likert5            | 1-5         |
| LIKERT_7            | Likert7            | 1-7         |
| ESCALA_FREQUENCIA   | EscalaFrequencia   | 0-3         |
| ESCALA_INTENSIDADE  | EscalaIntensidade  | 1-5         |
| ESCALA_VISUAL       | EscalaVisual       | {x,y}       |
| SIM_NAO             | SimNao             | boolean     |
| MULTIPLA_ESCOLHA    | MultiplaEscolha    | string/num  |
| MULTIPLA_SELECAO    | SelecaoMultipla    | array       |
| EMOJI_PICKER        | EmojiRating        | 1-5         |
| SLIDER_NUMERICO     | Slider             | min-max     |

## Normalização de Respostas

Para o IRT, todas as respostas são normalizadas para 0.0-1.0:

```typescript
// ESCALA_FREQUENCIA (0-3) → 0.0-1.0
const normalized = value / 3;

// ESCALA_INTENSIDADE (1-5) → 0.0-1.0
const normalized = (value - 1) / 4;

// LIKERT_5 (1-5) → 0.0-1.0
const normalized = (value - 1) / 4;

// LIKERT_7 (1-7) → 0.0-1.0
const normalized = (value - 1) / 6;

// SIM_NAO (boolean) → 0.0 ou 1.0
const normalized = value ? 1.0 : 0.0;

// ESCALA_VISUAL ({x,y}) → média das coordenadas normalizadas
const normalized = ((value.x + 1) / 2 + (value.y + 1) / 2) / 2;
```

## Página de Teste

Acesse `/teste-componentes` para visualizar e testar todos os componentes interativamente.

## Próximos Passos

1. ✅ Criar componentes ESCALA_FREQUENCIA, ESCALA_INTENSIDADE, ESCALA_VISUAL
2. ✅ Atualizar PerguntaRenderer para usar os novos componentes
3. ✅ Criar página de teste `/teste-componentes`
4. ⏳ Validar normalização de respostas
5. ⏳ Testar integração com fluxo adaptativo
6. ⏳ Adicionar testes unitários para cada componente

## Referências

- Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001). The PHQ-9. Journal of General Internal Medicine, 16(9), 606-613.
- Spitzer, R. L., Kroenke, K., Williams, J. B., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder: the GAD-7. Archives of Internal Medicine, 166(10), 1092-1097.
- Watson, D., Clark, L. A., & Tellegen, A. (1988). Development and validation of brief measures of positive and negative affect: the PANAS scales. Journal of Personality and Social Psychology, 54(6), 1063.
- Russell, J. A. (1980). A circumplex model of affect. Journal of Personality and Social Psychology, 39(6), 1161.
- Cohen, S., Kamarck, T., & Mermelstein, R. (1983). A global measure of perceived stress. Journal of Health and Social Behavior, 385-396.
- Bastien, C. H., Vallières, A., & Morin, C. M. (2001). Validation of the Insomnia Severity Index as an outcome measure for insomnia research. Sleep Medicine, 2(4), 297-307.
- Diener, E. D., Emmons, R. A., Larsen, R. J., & Griffin, S. (1985). The satisfaction with life scale. Journal of Personality Assessment, 49(1), 71-75.
