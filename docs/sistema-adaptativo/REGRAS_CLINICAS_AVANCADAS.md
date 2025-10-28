# Regras Clínicas Avançadas - Sistema CAT

## 📋 Visão Geral

Sistema de **análise clínica inteligente** que detecta padrões complexos, co-ocorrências e gera alertas multi-nível baseados em protocolos clínicos validados.

### 🎯 Objetivos

1. **Segurança Clínica**: Detectar situações de risco crítico (ideação suicida, sintomas graves)
2. **Co-ocorrências**: Identificar padrões comórbidos (depressão+ansiedade, insônia+depressão)
3. **Desvios Estatísticos**: Detectar mudanças atípicas em relação ao baseline pessoal (2SD)
4. **Alertas Inteligentes**: Sistema multi-nível (VERDE/AMARELO/LARANJA/VERMELHO)

---

## 🏥 Thresholds Clínicos

### PHQ-9 (Patient Health Questionnaire - Depressão)

| Nível | Score | Classificação |
|-------|-------|---------------|
| 🟢 Mínimo | 0-4 | Nenhuma/mínima depressão |
| 🟡 Leve | 5-9 | Depressão leve |
| 🟠 Moderado | 10-14 | Depressão moderada |
| 🔴 Mod. Grave | 15-19 | Depressão moderadamente grave |
| 🚨 Grave | 20-27 | Depressão grave |

**Referência**: Kroenke et al. (2001) - *JGIM*

### GAD-7 (Generalized Anxiety Disorder - Ansiedade)

| Nível | Score | Classificação |
|-------|-------|---------------|
| 🟢 Mínimo | 0-4 | Ansiedade mínima |
| 🟡 Leve | 5-9 | Ansiedade leve |
| 🟠 Moderado | 10-14 | Ansiedade moderada |
| 🚨 Grave | 15-21 | Ansiedade grave |

**Referência**: Spitzer et al. (2006) - *Arch Intern Med*

### PSS-10 (Perceived Stress Scale - Estresse)

| Nível | Score | Classificação |
|-------|-------|---------------|
| 🟢 Baixo | 0-13 | Estresse baixo |
| 🟡 Moderado | 14-26 | Estresse moderado |
| 🚨 Alto | 27-40 | Estresse alto |

**Referência**: Cohen et al. (1983) - *J Health Soc Behav*

### ISI (Insomnia Severity Index - Insônia)

| Nível | Score | Classificação |
|-------|-------|---------------|
| 🟢 Ausente | 0-7 | Ausência de insônia |
| 🟡 Limiar | 8-14 | Insônia subclínica |
| 🟠 Moderada | 15-21 | Insônia moderada |
| 🚨 Grave | 22-28 | Insônia grave |

**Referência**: Bastien et al. (2001) - *Sleep*

### SWLS (Satisfaction With Life Scale - Bem-Estar)

| Nível | Score | Classificação |
|-------|-------|---------------|
| 🔴 Ext. Insatisfeito | 5-9 | Extremamente insatisfeito |
| 🟠 Insatisfeito | 10-14 | Insatisfeito |
| 🟡 Leve Insatisfeito | 15-19 | Levemente insatisfeito |
| 🟢 Leve Satisfeito | 20-24 | Levemente satisfeito |
| 🟢 Satisfeito | 25-29 | Satisfeito |
| 🟢 Ext. Satisfeito | 30-35 | Extremamente satisfeito |

**Referência**: Diener et al. (1985) - *J Pers Assess*

---

## 🔍 Padrões de Co-ocorrência

### 1. Depressão + Ansiedade Comórbida

**Critérios de Detecção**:
- PHQ-9 ≥ 10 (moderado) **E** GAD-7 ≥ 10 (moderado)

**Base Científica**:
- 60% dos casos de depressão apresentam ansiedade comórbida
- Comorbidade associada a pior prognóstico e maior cronicidade

**Evidências**:
```typescript
{
  tipo: 'CO_OCORRENCIA',
  nome: 'Depressão + Ansiedade Comórbida',
  construtos: ['DEPRESSAO', 'ANSIEDADE'],
  confianca: 0.85 // baseado em scores relativos aos thresholds
}
```

### 2. Insônia + Depressão

**Critérios de Detecção**:
- ISI ≥ 15 (moderado) **E** PHQ-9 ≥ 5 (leve)

**Base Científica**:
- Insônia presente em 80% dos episódios depressivos
- Distúrbios do sono são fator de risco e sintoma de depressão

**Evidências**:
```typescript
{
  tipo: 'CO_OCORRENCIA',
  nome: 'Insônia + Depressão',
  construtos: ['SONO', 'DEPRESSAO'],
  evidencias: [
    'Insônia é sintoma presente em 80% dos episódios depressivos',
    'Relação bidirecional: insônia prediz e perpetua depressão'
  ]
}
```

### 3. Estresse Crônico + Ansiedade

**Critérios de Detecção**:
- PSS-10 ≥ 27 (alto) **E** GAD-7 ≥ 10 (moderado)

**Base Científica**:
- Estresse crônico é fator de risco para transtornos de ansiedade
- Ativação persistente do eixo HPA (hipotálamo-pituitária-adrenal)

### 4. Bem-Estar Baixo + Distúrbios do Sono

**Critérios de Detecção**:
- SWLS < 19 (insatisfeito) **E** ISI ≥ 8 (limiar)

**Base Científica**:
- Qualidade do sono impacta diretamente satisfação com a vida
- Privação de sono reduz afeto positivo e bem-estar subjetivo

---

## 🚨 Detecção de Risco Crítico

### Ideação Suicida (PHQ9_09)

**Item PHQ-9**: *"Pensamentos de que seria melhor estar morto ou se ferir de alguma forma"*

**Detecção**:
```typescript
function detectarIdeacaoSuicida(respostas: any[]): PadraoDetectado | null {
  const phq9_09 = respostas.find(r => r.codigo === 'PHQ9_09');
  
  if (phq9_09 && phq9_09.valor > 0) {
    return {
      tipo: 'RISCO_CRITICO',
      nome: 'Ideação Suicida Detectada',
      confianca: 1.0, // Máxima confiança quando endossado
      evidencias: [
        'PROTOCOLO: Avaliação imediata de risco suicida necessária',
        'Contatar responsável e coordenação IMEDIATAMENTE'
      ]
    };
  }
}
```

**Ações Automáticas**:
1. **Alerta VERMELHO** automático
2. **Notificar coordenação** e responsáveis
3. **Protocolo de crise** ativado
4. **Contato imediato** com estudante

### Risco Crítico Combinado

**Critérios**:
- PHQ-9 ≥ 20 (grave) **E** GAD-7 ≥ 15 (grave)

**Ação**:
- Encaminhamento psiquiátrico urgente
- Monitoramento intensivo

---

## 📊 Desvios Estatísticos (2SD)

### Conceito

Detecta mudanças atípicas em relação ao **baseline pessoal** do estudante.

### Método

1. **Baseline**: Média e desvio padrão das últimas 10 sessões
2. **Detecção**: Score atual > 2SD da média histórica
3. **Mínimo**: Requer ≥ 3 sessões anteriores

### Exemplo

```typescript
// Histórico do estudante em ANSIEDADE
mediaHistorica = {
  categoria: 'ANSIEDADE',
  media: 0.45,
  desvioPadrao: 0.10,
  numeroSessoes: 8
}

// Sessão atual
scoreAtual = 0.70

// Cálculo
desvio = |0.70 - 0.45| = 0.25
numeroDesviosPadrao = 0.25 / 0.10 = 2.5 SD

// Resultado
{
  tipo: 'DESVIO_ESTATISTICO',
  nome: 'Desvio Significativo: ANSIEDADE',
  descricao: 'Aumento atípico em relação ao baseline pessoal',
  confianca: 0.83, // min(2.5/3, 1)
  evidencias: [
    'Score atual: 0.70',
    'Média histórica: 0.45 (±0.10)',
    'Desvio: 2.5 desvios padrão',
    'Baseado em 8 sessões anteriores'
  ]
}
```

### Utilidade Clínica

- Detecta **crises agudas** (piora súbita)
- Detecta **melhora inesperada** (possível negação/dissimulação)
- Personaliza alertas para cada estudante

---

## 🚦 Sistema de Alertas Multi-Nível

### 🟢 VERDE (Urgência: BAIXA)

**Critérios**:
- PHQ-9 < 10 (leve ou mínimo)
- GAD-7 < 10 (leve ou mínimo)
- Nenhuma co-ocorrência detectada

**Recomendações**:
- ✅ Continue praticando hábitos saudáveis
- 🎯 Mantenha atividades que geram prazer
- 📊 Continue monitoramento regular

**Ações**: Nenhuma ação especial

---

### 🟡 AMARELO (Urgência: MÉDIA)

**Critérios**:
- PHQ-9 10-14 (moderado) **OU** GAD-7 10-14 (moderado)
- **OU** 1 co-ocorrência detectada

**Recomendações**:
- 📅 Considere avaliação psicológica (próxima semana)
- 🏃 Mantenha atividade física regular (30min/dia)
- 😴 Cuide da higiene do sono

**Ações**:
- Aumentar frequência de monitoramento (semanal)
- Orientações psicoeducativas

---

### 🟠 LARANJA (Urgência: ALTA)

**Critérios**:
- PHQ-9 ≥ 15 (moderadamente grave) **OU** GAD-7 ≥ 10 (moderado)
- **OU** ≥ 2 co-ocorrências detectadas

**Recomendações**:
- ⚠️ Agende consulta psicológica/psiquiátrica (48-72h)
- 🧘 Pratique técnicas de relaxamento (respiração, mindfulness)
- 👥 Converse com pessoas de confiança

**Ações**:
- **SUGERIR_ENCAMINHAMENTO** para psicólogo/psiquiatra
- **AUMENTAR_FREQUENCIA** monitoramento (2x/semana)
- **NOTIFICAR** coordenação pedagógica

---

### 🔴 VERMELHO (Urgência: CRÍTICA)

**Critérios**:
- PHQ-9 ≥ 20 (grave) **OU** GAD-7 ≥ 15 (grave)
- **OU** Ideação suicida (PHQ9_09 > 0)
- **OU** Padrão RISCO_CRITICO detectado

**Recomendações**:
- 🚨 Procure ajuda profissional URGENTE
- 💬 CVV - 188 (24h, gratuito, confidencial)
- 🏥 Emergência: dirija-se ao pronto-socorro

**Ações**:
- **PROTOCOLO_IDEACAO_SUICIDA** (se PHQ9_09 > 0)
- **NOTIFICAR_RESPONSAVEL** (pais/responsáveis)
- **NOTIFICAR_COORDENACAO** (imediato)
- **REGISTRAR_PROTOCOLO_CRISE**
- **CONTATO_IMEDIATO** com estudante

---

## 💻 Uso Prático

### Exemplo 1: Análise Completa

```typescript
import { analisarRespostasClinicas } from '@/lib/adaptive/regras-clinicas-avancadas';

// Após finalizar sessão adaptativa
const resultado = await analisarRespostasClinicas(
  sessaoId,
  usuarioId // opcional, para análise de desvios
);

console.log(resultado);
// {
//   padroes: [
//     {
//       tipo: 'CO_OCORRENCIA',
//       nome: 'Depressão + Ansiedade Comórbida',
//       confianca: 0.85,
//       construtos: ['DEPRESSAO', 'ANSIEDADE']
//     }
//   ],
//   alerta: {
//     nivel: 'LARANJA',
//     titulo: '⚠️ Alerta Alto: Atenção Requerida',
//     urgencia: 'ALTA',
//     recomendacoes: [
//       '⚠️ Agende consulta com psicólogo/psiquiatra nas próximas 48-72h',
//       '🧘 Pratique técnicas de relaxamento (respiração, mindfulness)'
//     ],
//     acoes: [
//       'SUGERIR_ENCAMINHAMENTO',
//       'AUMENTAR_FREQUENCIA_MONITORAMENTO'
//     ]
//   },
//   mediasHistoricas: [
//     { categoria: 'ANSIEDADE', media: 0.42, desvioPadrao: 0.12, numeroSessoes: 7 },
//     { categoria: 'DEPRESSAO', media: 0.38, desvioPadrao: 0.09, numeroSessoes: 7 }
//   ]
// }
```

### Exemplo 2: Detecção de Ideação Suicida

```typescript
// Estudante responde PHQ9_09 = 2 ("Mais da metade dos dias")

const resultado = await analisarRespostasClinicas(sessaoId, usuarioId);

// resultado.padroes conterá:
{
  tipo: 'RISCO_CRITICO',
  nome: 'Ideação Suicida Detectada',
  confianca: 1.0,
  evidencias: [
    'PHQ9_09 endossado com valor 2/3',
    'Frequência: Mais da metade dos dias',
    'PROTOCOLO: Avaliação imediata de risco suicida necessária'
  ]
}

// resultado.alerta será:
{
  nivel: 'VERMELHO',
  urgencia: 'CRITICA',
  acoes: [
    'PROTOCOLO_IDEACAO_SUICIDA',
    'NOTIFICAR_RESPONSAVEL',
    'NOTIFICAR_COORDENACAO',
    'REGISTRAR_PROTOCOLO_CRISE',
    'CONTATO_IMEDIATO'
  ]
}
```

### Exemplo 3: Desvio Estatístico

```typescript
// Estudante tem histórico de ANSIEDADE estável (média: 0.35)
// Nesta sessão, score = 0.70 (2.5 SD acima da média)

const resultado = await analisarRespostasClinicas(sessaoId, usuarioId);

// resultado.padroes conterá:
{
  tipo: 'DESVIO_ESTATISTICO',
  nome: 'Desvio Significativo: ANSIEDADE',
  descricao: 'Aumento atípico em relação ao baseline pessoal',
  confianca: 0.83,
  evidencias: [
    'Score atual: 0.70',
    'Média histórica: 0.35 (±0.14)',
    'Desvio: 2.5 desvios padrão',
    'Baseado em 8 sessões anteriores'
  ]
}

// Isso pode indicar:
// - Evento estressor agudo (prova, conflito familiar)
// - Início de episódio ansioso
// - Necessidade de atenção imediata
```

---

## 📈 Fluxo de Análise

```
1. BUSCAR RESPOSTAS
   ↓
2. CALCULAR SCORES (escalas + categorias)
   ↓
3. DETECTAR CO-OCORRÊNCIAS
   - Depressão + Ansiedade
   - Insônia + Depressão
   - Estresse + Ansiedade
   - Bem-Estar Baixo + Sono
   ↓
4. DETECTAR IDEAÇÃO SUICIDA
   - PHQ9_09 > 0?
   ↓
5. DETECTAR RISCO CRÍTICO
   - Scores graves simultâneos?
   ↓
6. BUSCAR BASELINE (se usuarioId fornecido)
   ↓
7. DETECTAR DESVIOS ESTATÍSTICOS
   - Score atual > 2SD da média?
   ↓
8. DETERMINAR NÍVEL ALERTA
   - VERMELHO: Risco crítico / ideação suicida / grave
   - LARANJA: Moderadamente grave / múltiplas co-ocorrências
   - AMARELO: Moderado / uma co-ocorrência
   - VERDE: Leve/mínimo
   ↓
9. GERAR RECOMENDAÇÕES
   - Baseadas em nível + padrões
   ↓
10. GERAR AÇÕES
    - Notificações, protocolos, encaminhamentos
    ↓
11. RETORNAR ALERTA COMPLETO
```

---

## 🔬 Validação Científica

### Instrumentos Validados

Todos os thresholds são baseados em **estudos de validação originais**:

- **PHQ-9**: Kroenke et al. (2001) - n=6,000
- **GAD-7**: Spitzer et al. (2006) - n=2,740
- **PSS-10**: Cohen et al. (1983) - n=2,387
- **ISI**: Bastien et al. (2001) - n=549
- **SWLS**: Diener et al. (1985) - n=176

### Padrões de Co-ocorrência

- **Depressão+Ansiedade**: Lamers et al. (2011) - NEMESIS-2 study
- **Insônia+Depressão**: Baglioni et al. (2011) - Meta-análise 21 estudos
- **Estresse+Ansiedade**: McEwen (2007) - Stress physiology

### Desvios Estatísticos

- **2SD threshold**: Padrão estatístico para detecção de outliers
- **Baseline pessoal**: Método idiográfico (individual) validado por Molenaar & Campbell (2009)

---

## ⚠️ Limitações e Considerações

### Limitações

1. **Não substitui avaliação clínica**: Sistema é triagem, não diagnóstico
2. **Falsos positivos**: Possíveis com scores próximos aos thresholds
3. **Contexto individual**: Cada caso requer análise qualitativa
4. **Baseline requer histórico**: Desvios só detectados com ≥3 sessões

### Considerações Éticas

1. **Confidencialidade**: Alertas sensíveis requerem sigilo
2. **Consentimento**: Usuário deve saber que dados são monitorados
3. **Protocolo de crise**: Instituição deve ter fluxo definido para alertas VERMELHO
4. **Capacitação**: Profissionais que recebem alertas devem estar treinados

### Próximos Passos

1. **Validação empírica**: Testar com dados reais de estudantes
2. **Ajuste de thresholds**: Calibrar para população específica
3. **Machine learning**: Treinar modelos para melhorar detecção
4. **Integração com EHR**: Conectar com prontuário eletrônico

---

## 📚 Referências

1. Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001). The PHQ-9: validity of a brief depression severity measure. *Journal of General Internal Medicine*, 16(9), 606-613.

2. Spitzer, R. L., Kroenke, K., Williams, J. B., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder: the GAD-7. *Archives of Internal Medicine*, 166(10), 1092-1097.

3. Cohen, S., Kamarck, T., & Mermelstein, R. (1983). A global measure of perceived stress. *Journal of Health and Social Behavior*, 24(4), 385-396.

4. Bastien, C. H., Vallières, A., & Morin, C. M. (2001). Validation of the Insomnia Severity Index as an outcome measure for insomnia research. *Sleep Medicine*, 2(4), 297-307.

5. Diener, E. D., Emmons, R. A., Larsen, R. J., & Griffin, S. (1985). The satisfaction with life scale. *Journal of Personality Assessment*, 49(1), 71-75.

6. Lamers, F., van Oppen, P., Comijs, H. C., et al. (2011). Comorbidity patterns of anxiety and depressive disorders in a large cohort study: the Netherlands Study of Depression and Anxiety (NESDA). *The Journal of Clinical Psychiatry*, 72(3), 341-348.

7. Baglioni, C., Battagliese, G., Feige, B., et al. (2011). Insomnia as a predictor of depression: a meta-analytic evaluation of longitudinal epidemiological studies. *Journal of Affective Disorders*, 135(1-3), 10-19.

8. Molenaar, P. C., & Campbell, C. G. (2009). The new person-specific paradigm in psychology. *Current Directions in Psychological Science*, 18(2), 112-117.

---

**Status**: ✅ Implementado e Documentado
**Versão**: 1.0
**Data**: 22/10/2025
