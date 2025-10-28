# Test Harness - Sistema de Testes Dinâmicos

## 📋 Visão Geral

Sistema completo para testar o fluxo de questionários socioemocionais de forma **dinâmica, automatizada e reproduzível**.

## 🎯 Objetivos

- ✅ Testar todos os tipos de perguntas em um ambiente controlado
- ✅ Simular sessões completas de forma automática ou manual
- ✅ Exportar dados de teste para análise posterior
- ✅ Validar o comportamento do sistema adaptativo (CAT)
- ✅ Detectar problemas antes de ir para produção

---

## 🚀 Como Usar

### 1. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
# ou
npm run dev:turbo  # modo turbo (mais rápido)
```

### 2. Acessar as Páginas de Teste

#### **Página de Teste Estático** (todos os componentes isolados)
- **URL:** http://localhost:3000/teste-componentes
- **Funcionalidade:** Visualiza e testa cada tipo de pergunta individualmente
- **Uso:** Para validar UI e comportamento de componentes isolados

#### **Página de Teste Dinâmico** (simulação de fluxo completo)
- **URL:** http://localhost:3000/teste-fluxo
- **Funcionalidade:** Simula uma sessão completa de questionário
- **Uso:** Para testar fluxo adaptativo e validar integração

---

## 📊 Página de Teste Dinâmico (`/teste-fluxo`)

### Funcionalidades

#### 🤖 Modo Automático
- Responde automaticamente cada pergunta
- Velocidade configurável (padrão: 800ms)
- Usa respostas aleatórias realistas por tipo

**Como usar:**
1. Clique em **"Iniciar Automático"**
2. Ajuste a velocidade se desejar (campo "Velocidade (ms)")
3. Observe o fluxo avançar automaticamente
4. Clique em **"Parar Automático"** para pausar

#### ✋ Modo Manual
- Responda cada pergunta manualmente
- Clique em **"Próxima Pergunta"** para avançar
- Útil para testar casos específicos

#### 💾 Exportar Respostas
- Clique em **"Exportar JSON"**
- Arquivo baixado: `respostas_simulacao_[timestamp].json`
- Contém todas as respostas com metadados

**Formato do JSON exportado:**
```json
[
  {
    "perguntaId": "phq9_1",
    "valor": 2,
    "tempoResposta": 1,
    "timestamp": "2025-10-23T14:30:00.000Z"
  }
]
```

#### 🔄 Reiniciar Sessão
- Clique em **"Reiniciar"**
- Volta para a primeira pergunta
- Limpa todas as respostas anteriores

---

## 🧪 Estrutura dos Dados de Teste

### Arquivo de Perguntas Mock
**Localização:** `src/data/test-perguntas.json`

**Estrutura:**
```json
[
  {
    "id": "phq9_1",
    "texto": "Pouco interesse ou prazer em fazer as coisas",
    "categoria": "DEPRESSAO",
    "tipoPergunta": "ESCALA_FREQUENCIA",
    "obrigatoria": true,
    "ordem": 1,
    "opcoes": [
      { "valor": 0, "texto": "Nenhuma vez" },
      { "valor": 1, "texto": "Vários dias" },
      { "valor": 2, "texto": "Mais da metade" },
      { "valor": 3, "texto": "Quase todos os dias" }
    ]
  }
]
```

### Utilitário de Simulação
**Localização:** `src/lib/test-harness/simularResposta.ts`

**Função:** `responderAleatorio(pergunta: PerguntaSocioemocional)`

**Retorna:**
- `ESCALA_FREQUENCIA`: 0-3 (aleatório)
- `ESCALA_INTENSIDADE`: 1-5 (aleatório)
- `ESCALA_VISUAL`: `{x: -1..1, y: -1..1}` (coordenadas aleatórias)
- `SIM_NAO`: `true` ou `false` (50% cada)
- `LIKERT_5`: 1-5 (aleatório)
- `LIKERT_7`: 1-7 (aleatório)
- `MULTIPLA_ESCOLHA`: Uma opção aleatória
- `MULTIPLA_SELECAO`: Array de opções (35% de chance cada)

---

## 🎨 Tipos de Perguntas Testados

### 1. ESCALA_FREQUENCIA (PHQ-9, GAD-7)
- **Escala:** 0-3
- **Labels:** Nenhuma vez → Quase todos os dias
- **Uso:** Frequência de sintomas

### 2. ESCALA_INTENSIDADE (PANAS, ISI)
- **Escala:** 1-5
- **Labels:** Nada → Extremamente
- **Uso:** Intensidade de emoções/sintomas

### 3. ESCALA_VISUAL (Circumplex Model)
- **Escala:** Bidimensional (-1..1, -1..1)
- **Dimensões:** Valência x Ativação
- **Uso:** Modelo Circumplex de Russell

### 4. SIM_NAO
- **Escala:** Binária (true/false)
- **Uso:** Perguntas dicotômicas

### 5. LIKERT_5 (PSS-10)
- **Escala:** 1-5
- **Uso:** Avaliações gerais

### 6. LIKERT_7 (SWLS)
- **Escala:** 1-7
- **Uso:** Satisfação com a vida

### 7. MULTIPLA_ESCOLHA
- **Retorno:** Valor único
- **Uso:** Seleção de uma opção

### 8. MULTIPLA_SELECAO
- **Retorno:** Array de valores
- **Uso:** Seleção de múltiplas opções

### 9. EMOJI_PICKER
- **Escala:** 1-5
- **Uso:** Avaliação visual com emojis

### 10. SLIDER_NUMERICO
- **Escala:** Configurável (min-max)
- **Uso:** Escalas contínuas

---

## 📈 Casos de Uso

### 1. Validação de UI
**Objetivo:** Garantir que todos os componentes renderizam corretamente

**Passos:**
1. Acesse `/teste-componentes`
2. Navegue pelas abas
3. Teste cada tipo de pergunta
4. Verifique responsividade (mobile/desktop)

### 2. Teste de Fluxo Completo
**Objetivo:** Validar navegação e submissão de respostas

**Passos:**
1. Acesse `/teste-fluxo`
2. Responda manualmente todas as perguntas
3. Verifique se o fluxo avança corretamente
4. Confirme que o relatório está correto

### 3. Simulação Automatizada
**Objetivo:** Testar estabilidade com respostas geradas

**Passos:**
1. Acesse `/teste-fluxo`
2. Clique em "Iniciar Automático"
3. Ajuste velocidade para 100ms (rápido)
4. Observe se há erros no console
5. Exporte JSON ao final

### 4. Teste de Dados
**Objetivo:** Validar formato de respostas exportadas

**Passos:**
1. Simule uma sessão completa
2. Exporte JSON
3. Valide estrutura dos dados
4. Use dados para testes de integração

### 5. Teste de Normalização
**Objetivo:** Garantir que valores são normalizados corretamente

**Passos:**
1. Responda perguntas com valores extremos
2. Verifique no relatório se normalização está correta
3. Para ESCALA_FREQUENCIA (0-3): deve normalizar para 0.0-1.0
4. Para ESCALA_INTENSIDADE (1-5): deve normalizar para 0.0-1.0

---

## 🔧 Personalização

### Adicionar Novas Perguntas ao Mock

Edite `src/data/test-perguntas.json`:

```json
{
  "id": "nova_pergunta",
  "texto": "Texto da pergunta",
  "categoria": "BEM_ESTAR",
  "tipoPergunta": "LIKERT_5",
  "obrigatoria": false,
  "ordem": 6,
  "opcoes": [
    { "valor": 1, "texto": "Discordo totalmente" },
    { "valor": 5, "texto": "Concordo totalmente" }
  ]
}
```

### Modificar Velocidade do Modo Automático

No código (`src/app/teste-fluxo/page.tsx`):

```typescript
const [speedMs, setSpeedMs] = useState(800); // Altere o valor padrão
```

### Adicionar Novos Modos de Simulação

Edite `src/lib/test-harness/simularResposta.ts`:

```typescript
export function responderExtremos(pergunta: PerguntaSocioemocional) {
  // Sempre responde valores máximos
  switch (pergunta.tipoPergunta) {
    case 'ESCALA_FREQUENCIA':
      return 3; // Sempre "Quase todos os dias"
    case 'ESCALA_INTENSIDADE':
      return 5; // Sempre "Extremamente"
    // ... outros tipos
  }
}
```

---

## 🐛 Resolução de Problemas

### Problema: Componentes não renderizam
**Solução:**
1. Verifique se todos os componentes estão em `src/components/avaliacoes/tipos/`
2. Confirme imports no `PerguntaRenderer.tsx`
3. Execute `npm run build` para verificar erros de compilação

### Problema: Modo automático não avança
**Solução:**
1. Abra o console do navegador (F12)
2. Verifique se há erros de validação
3. Confirme que `responderAleatorio()` retorna valores válidos

### Problema: Exportar JSON não funciona
**Solução:**
1. Verifique permissões do navegador para downloads
2. Teste em modo anônimo
3. Verifique se há bloqueadores de pop-up

### Problema: Valores não normalizam
**Solução:**
1. Verifique `src/lib/validations/resposta-schemas.ts`
2. Confirme que tipos de pergunta estão corretos
3. Teste manualmente com valores conhecidos

---

## 📚 Próximos Passos

### Funcionalidades Futuras

1. **Integração com Banco Real**
   - Carregar perguntas do `BancoPerguntasAdaptativo`
   - Usar API `/api/sessoes/:id` para fluxo real

2. **Modos de Simulação Avançados**
   - Modo "Extremos" (sempre max/min)
   - Modo "Coerente" (respostas logicamente consistentes)
   - Modo "Aleatório Ponderado" (distribuição realista)

3. **Análise de Resultados**
   - Dashboard de visualização de dados
   - Gráficos de distribuição de respostas
   - Relatório de tempo médio por tipo

4. **Testes de Regressão**
   - Scripts automatizados com Playwright/Cypress
   - Validação de snapshots de UI
   - Testes E2E completos

5. **Integração com Vitest**
   - Testes unitários para `simularResposta()`
   - Testes de integração para fluxo completo
   - Coverage de componentes UI

---

## 📖 Referências

- **Componentes UI:** `docs/implementacoes/IMPLEMENTACAO_COMPONENTES_UI.md`
- **Fluxo Adaptativo:** `docs/fluxo-perguntas-adaptativas.html`
- **Tipos de Perguntas:** `docs/ANALISE_TIPOS_PERGUNTAS.html`
- **PerguntaRenderer:** `src/components/avaliacoes/PerguntaRenderer.tsx`

---

## ✅ Status de Implementação

- [x] Página de teste estático (`/teste-componentes`)
- [x] Página de teste dinâmico (`/teste-fluxo`)
- [x] Modo automático com velocidade configurável
- [x] Modo manual de navegação
- [x] Exportar JSON de respostas
- [x] Utilitário de simulação de respostas
- [x] Dados mock de perguntas
- [x] Relatório em tempo real
- [ ] Integração com banco real
- [ ] Modos de simulação avançados
- [ ] Dashboard de análise
- [ ] Testes E2E automatizados

---

## 🤝 Como Contribuir

1. Adicione novos tipos de perguntas em `test-perguntas.json`
2. Implemente novos modos de simulação em `simularResposta.ts`
3. Melhore a UI da página de testes
4. Adicione testes automatizados
5. Documente casos de uso descobertos

---

**Última atualização:** 23 de outubro de 2025
**Autor:** GitHub Copilot + Felipe Allan
