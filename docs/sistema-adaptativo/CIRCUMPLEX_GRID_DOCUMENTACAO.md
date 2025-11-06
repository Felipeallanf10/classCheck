# CircumplexGrid - Componente Interativo para Avaliação Emocional

## 📋 Visão Geral

O **CircumplexGrid** é um componente React interativo que implementa o **Modelo Circumplex de Afeto** desenvolvido por James A. Russell (1980). Este modelo revolucionou a medição de estados emocionais ao propor que as emoções podem ser representadas em um espaço bidimensional contínuo, ao invés de categorias discretas.

## 🧠 Fundamentação Científica

### Modelo Circumplex (Russell, 1980)

O modelo propõe que todas as emoções podem ser mapeadas em duas dimensões independentes:

1. **Valencia (Valence)**: Eixo horizontal
   - Varia de -1.0 (muito negativo) a +1.0 (muito positivo)
   - Representa o grau de prazer/desprazer da experiência emocional

2. **Ativação (Arousal)**: Eixo vertical
   - Varia de -1.0 (baixa energia) a +1.0 (alta energia)
   - Representa o grau de ativação fisiológica e mental

### Quadrantes Emocionais

```
        Alta Ativação (+1)
              |
    Ansioso   |   Animado
    (V-, A+)  |   (V+, A+)
              |
−1 ────────── 0 ────────── +1  (Valencia)
              |
   Entediado  |    Calmo
    (V-, A-)  |   (V+, A-)
              |
       Baixa Ativação (-1)
```

**Quadrante 1 (V+, A+)**: Estados de alta energia positiva
- Exemplos: Animado, Feliz, Energizado, Excitado, Entusiasmado

**Quadrante 2 (V+, A-)**: Estados de baixa energia positiva
- Exemplos: Calmo, Relaxado, Tranquilo, Sereno, Pacífico

**Quadrante 3 (V-, A-)**: Estados de baixa energia negativa
- Exemplos: Entediado, Triste, Deprimido, Letárgico, Desanimado

**Quadrante 4 (V-, A+)**: Estados de alta energia negativa
- Exemplos: Ansioso, Estressado, Tenso, Nervoso, Irritado

## 🎯 Casos de Uso

### 1. Check-in Emocional Diário

```typescript
import { CircumplexGrid } from '@/components/adaptive';

function DailyCheckIn() {
  const [emotion, setEmotion] = useState(null);

  const handleEmotionSelect = (point) => {
    // Salvar no banco de dados
    await saveEmotionalState({
      usuarioId: user.id,
      valencia: point.valencia,
      ativacao: point.ativacao,
      timestamp: new Date()
    });
    
    setEmotion(point);
  };

  return (
    <CircumplexGrid
      onSelect={handleEmotionSelect}
      selectedPoint={emotion}
      interactive={true}
    />
  );
}
```

### 2. Visualização de Trajetória Temporal

```typescript
function EmotionalTrajectory({ userId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Buscar histórico dos últimos 30 dias
    const data = await fetchEmotionalHistory(userId, 30);
    setHistory(data);
  }, [userId]);

  return (
    <CircumplexGrid
      historicalPoints={history}
      showLabels={true}
      interactive={false}
    />
  );
}
```

### 3. Integração com Questionário Adaptativo

```typescript
function AdaptiveQuestionnaire() {
  const [emotion, setEmotion] = useState(null);

  const handleEmotionSelect = async (point) => {
    setEmotion(point);
    
    // Usar estado emocional para personalizar próximas perguntas
    const nextQuestion = await getNextQuestion({
      valencia: point.valencia,
      ativacao: point.ativacao,
      contexto: 'CHECK_IN'
    });
    
    // Se ansiedade detectada (V-, A+), priorizar perguntas GAD-7
    // Se depressão detectada (V-, A-), priorizar perguntas PHQ-9
  };

  return (
    <>
      <CircumplexGrid onSelect={handleEmotionSelect} />
      {emotion && <QuestionDisplay question={nextQuestion} />}
    </>
  );
}
```

## 📊 Props API

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `width` | `number` | `400` | Largura do canvas em pixels |
| `height` | `number` | `400` | Altura do canvas em pixels |
| `onSelect` | `(point: EmotionalPoint) => void` | - | Callback ao selecionar ponto |
| `selectedPoint` | `EmotionalPoint \| null` | `null` | Ponto atualmente selecionado |
| `historicalPoints` | `EmotionalPoint[]` | `[]` | Array de pontos históricos |
| `showLabels` | `boolean` | `true` | Mostrar labels dos quadrantes |
| `interactive` | `boolean` | `true` | Permitir interação do usuário |
| `className` | `string` | `''` | Classes CSS adicionais |

### Interface EmotionalPoint

```typescript
interface EmotionalPoint {
  valencia: number;    // -1.0 a 1.0
  ativacao: number;    // -1.0 a 1.0
  timestamp?: Date;    // Momento do registro
  label?: string;      // Label descritivo (ex: "Animado")
}
```

## 🎨 Customização Visual

### Cores Padrão

```typescript
const AXIS_COLOR = '#94a3b8';        // Cor dos eixos
const GRID_COLOR = '#e2e8f0';        // Cor do grid
const POINT_COLOR = '#3b82f6';       // Cor do ponto hover
const SELECTED_COLOR = '#ef4444';    // Cor do ponto selecionado
const HISTORICAL_COLOR = '#94a3b8';  // Cor dos pontos históricos
```

Para customizar, você pode criar seu próprio componente extendendo o base:

```typescript
import CircumplexGrid from './CircumplexGrid';

export function CustomCircumplexGrid(props) {
  return (
    <CircumplexGrid
      {...props}
      className="custom-circumplex"
    />
  );
}
```

## 🔧 Funções Auxiliares

### canvasToModel(x, y, canvasSize)

Converte coordenadas do canvas para valores do modelo (-1 a 1).

**Parâmetros:**
- `x`: Coordenada X no canvas
- `y`: Coordenada Y no canvas
- `canvasSize`: Tamanho do canvas

**Retorna:** `{ valencia: number, ativacao: number }`

### modelToCanvas(point, canvasSize)

Converte valores do modelo para coordenadas do canvas.

**Parâmetros:**
- `point`: Objeto com `valencia` e `ativacao`
- `canvasSize`: Tamanho do canvas

**Retorna:** `{ x: number, y: number }`

### getQuadrantLabel(valencia, ativacao)

Determina o quadrante emocional.

**Retorna:** `'Animado' | 'Calmo' | 'Entediado' | 'Ansioso'`

### getEmotionalDescription(valencia, ativacao)

Fornece descrição detalhada baseada na intensidade.

**Retorna:** String descritiva (ex: "Muito Animado", "Neutro", "Levemente Ansioso")

## 📈 Integração com Backend

### Estrutura de Dados

```prisma
model HumorRegistro {
  id         String   @id @default(uuid())
  usuarioId  Int
  valencia   Float    // -1.0 a 1.0
  ativacao   Float    // -1.0 a 1.0
  quadrante  String   // "Animado", "Calmo", etc
  timestamp  DateTime @default(now())
  
  usuario Usuario @relation(fields: [usuarioId], references: [id])
  
  @@index([usuarioId, timestamp])
  @@map("humor_registros")
}
```

### Exemplo de API Route (Next.js)

```typescript
// app/api/emotional-state/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { usuarioId, valencia, ativacao } = await req.json();
  
  const quadrante = getQuadrantLabel(valencia, ativacao);
  
  const registro = await prisma.humorRegistro.create({
    data: {
      usuarioId,
      valencia,
      ativacao,
      quadrante,
      timestamp: new Date()
    }
  });
  
  return NextResponse.json(registro);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const usuarioId = parseInt(searchParams.get('usuarioId') || '0');
  const dias = parseInt(searchParams.get('dias') || '30');
  
  const dataInicio = new Date();
  dataInicio.setDate(dataInicio.getDate() - dias);
  
  const historico = await prisma.humorRegistro.findMany({
    where: {
      usuarioId,
      timestamp: { gte: dataInicio }
    },
    orderBy: { timestamp: 'asc' }
  });
  
  return NextResponse.json(historico);
}
```

## 📊 Análise de Dados

### Detecção de Padrões

```typescript
function analisarPadroesEmocionais(historico: EmotionalPoint[]) {
  // Calcular médias
  const mediaValencia = historico.reduce((sum, p) => sum + p.valencia, 0) / historico.length;
  const mediaAtivacao = historico.reduce((sum, p) => sum + p.ativacao, 0) / historico.length;
  
  // Detectar tendências
  const tendenciaDepressiva = mediaValencia < -0.3 && mediaAtivacao < -0.2;
  const tendenciaAnsiosa = mediaValencia < -0.2 && mediaAtivacao > 0.3;
  
  // Calcular variabilidade
  const variabilidadeValencia = calcularDesvioPadrao(historico.map(p => p.valencia));
  const variabilidadeAtivacao = calcularDesvioPadrao(historico.map(p => p.ativacao));
  
  return {
    mediaValencia,
    mediaAtivacao,
    tendenciaDepressiva,
    tendenciaAnsiosa,
    variabilidadeValencia,
    variabilidadeAtivacao
  };
}
```

### Alertas Clínicos

```typescript
function gerarAlertasEmocionais(ponto: EmotionalPoint) {
  const alertas = [];
  
  // Ansiedade alta (V-, A++)
  if (ponto.valencia < -0.5 && ponto.ativacao > 0.7) {
    alertas.push({
      nivel: 'LARANJA',
      tipo: 'ANSIEDADE_ALTA',
      mensagem: 'Estado de alta ansiedade detectado',
      recomendacao: 'Considere técnicas de respiração ou relaxamento'
    });
  }
  
  // Depressão indicada (V--, A-)
  if (ponto.valencia < -0.7 && ponto.ativacao < -0.3) {
    alertas.push({
      nivel: 'VERMELHO',
      tipo: 'DEPRESSAO_INDICADA',
      mensagem: 'Sinais de estado depressivo detectados',
      recomendacao: 'Recomendamos conversar com um profissional de saúde mental'
    });
  }
  
  return alertas;
}
```

## 🔬 Validação Científica

### Estudos de Referência

1. **Russell, J. A. (1980)**
   - *A circumplex model of affect*
   - Journal of Personality and Social Psychology, 39(6), 1161–1178
   - [DOI: 10.1037/h0077714]

2. **Posner, J., Russell, J. A., & Peterson, B. S. (2005)**
   - *The circumplex model of affect: An integrative approach to affective neuroscience*
   - Development and Psychopathology, 17(3), 715-734

3. **Barrett, L. F., & Russell, J. A. (1999)**
   - *The structure of current affect: Controversies and emerging consensus*
   - Current Directions in Psychological Science, 8(1), 10-14

### Confiabilidade Psicométrica

- **Validade de Constructo**: Alta correlação com escalas tradicionais (PANAS, MAACL)
- **Confiabilidade Test-Retest**: r = 0.78 - 0.85 (Russell, 1980)
- **Sensibilidade a Mudanças**: Captura variações sutis em estados emocionais

## 🎓 Vantagens do Modelo Circumplex

1. **Precisão Dimensional**: Captura nuances emocionais que categorias discretas perdem
2. **Simplicidade Cognitiva**: Apenas 2 dimensões são intuitivas para usuários
3. **Universalidade**: Aplicável cross-culturalmente
4. **Integração Clínica**: Alinha-se com teorias neurobiológicas de emoção
5. **Visualização Intuitiva**: Interface gráfica facilita auto-relato

## 🚀 Próximos Passos

- [ ] Adicionar suporte para dispositivos touch
- [ ] Implementar animações de transição
- [ ] Criar dashboard de análise temporal
- [ ] Adicionar export de dados (CSV/JSON)
- [ ] Integrar com sistema de notificações

## 📝 Licença

Este componente faz parte do sistema ClassCheck e segue a mesma licença do projeto principal.

---

**Desenvolvido para ClassCheck** | Última atualização: Outubro 2025
