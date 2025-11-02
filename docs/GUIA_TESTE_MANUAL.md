# 🧪 GUIA DE TESTE MANUAL - Phase 3 Analytics & Adaptive Flow

**Projeto:** ClassCheck v3.0  
**Branch:** `refactor/phase3-analytics-and-adaptive-flow`  
**Data:** 02/11/2025

---

## 📋 PRÉ-REQUISITOS

### 1. Preparar o ambiente
```bash
# 1. Certifique-se de estar na branch correta
git checkout refactor/phase3-analytics-and-adaptive-flow

# 2. Instalar dependências (se necessário)
npm install

# 3. Verificar se as migrações estão aplicadas
npx prisma migrate status

# 4. Gerar o Prisma Client (se necessário)
npx prisma generate

# 5. Popular o banco com dados de teste (se vazio)
npm run db:seed
# ou
npx tsx prisma/seed-adaptativo.ts

# 6. Iniciar o servidor de desenvolvimento
npm run dev
```

### 2. Usuário de teste
Crie ou use um usuário existente para realizar os testes. Você precisará:
- **Email:** seu-email@exemplo.com
- **ID do usuário:** (anote após login)
- **Sessões de questionário:** pelo menos 3-5 sessões concluídas

---

## 🧩 TESTE 1: SISTEMA ADAPTATIVO (CAT) - Navegação Reversa

### Objetivo
Testar a navegação reversa nas últimas 3 perguntas com recalibração de theta.

### Passos

1. **Iniciar um novo questionário adaptativo**
   ```
   URL: /questionario/adaptativo
   ou através do dashboard
   ```

2. **Responder 5 perguntas**
   - Anote o valor do theta após cada resposta (deve aparecer na UI ou console)
   - Exemplo de respostas:
     - Pergunta 1: 7/10 → theta ≈ 0.5
     - Pergunta 2: 8/10 → theta ≈ 0.8
     - Pergunta 3: 6/10 → theta ≈ 0.6
     - Pergunta 4: 9/10 → theta ≈ 1.0
     - Pergunta 5: 5/10 → theta ≈ 0.7

3. **Testar botão "Voltar"**
   - Após a 5ª pergunta, clique no botão "Voltar" (se existir na UI)
   - Ou abra o console do navegador e execute:
   ```javascript
   // No console do browser
   const store = window.__ZUSTAND_STORE__ || {}
   // ou se o store estiver exposto globalmente
   useSessaoAdaptativaStore.getState().perguntaAnterior()
   ```

4. **Verificações esperadas**
   - ✅ Deve voltar para a pergunta 4
   - ✅ A resposta anterior (9/10) deve estar pré-preenchida
   - ✅ O theta deve ser recalibrado (valor diferente do anterior)
   - ✅ Console deve mostrar: "Recalibrando theta..."

5. **Alterar resposta anterior**
   - Mude a resposta da pergunta 4 de 9/10 para 3/10
   - Submeta a nova resposta
   - **Verificação:** Theta deve mudar significativamente (de ~1.0 para ~0.3)

6. **Tentar voltar mais de 3 vezes**
   - Continue clicando "Voltar"
   - Após 3 voltas, deve aparecer erro:
   ```
   "Limite de navegação reversa atingido (últimas 3 perguntas)"
   ```

### API de teste direto

Abra o Postman ou Insomnia e teste a API de recalibração:

```http
POST http://localhost:3000/api/questionario/recalibrar-theta
Content-Type: application/json

{
  "sessaoId": "sua-sessao-id-aqui",
  "respostasAtuais": [
    { "perguntaId": "pergunta-1-id", "valorNormalizado": 0.7 },
    { "perguntaId": "pergunta-2-id", "valorNormalizado": 0.8 }
  ]
}
```

**Resposta esperada:**
```json
{
  "theta": 0.65,
  "erro": 0.35,
  "confianca": 0.75,
  "respostasConsideradas": 2,
  "deltaTheta": -0.15
}
```

---

## 📊 TESTE 2: RELATÓRIOS ANALÍTICOS - Dados Reais

### Objetivo
Verificar que os relatórios estão usando dados reais do banco (não mock).

### Passos

1. **Acessar o dashboard de análise**
   ```
   URL: /relatorios/meu-estado-emocional
   ou
   URL: /api/questionario/analise?usuarioId=SEU_ID
   ```

2. **Verificar JSON da API**
   - Abra: `http://localhost:3000/api/questionario/analise?usuarioId=1&periodo=30`
   - Verifique se os dados NÃO são mock
   - **Mock data** teria valores fixos como:
   ```json
   { "estadoDominante": "MOCK_FELIZ", "score": 7.5 }
   ```
   - **Real data** terá:
   ```json
   {
     "estadoDominante": "ANSIOSO",
     "tendencia": "ASCENDENTE",
     "pontuacaoGeral": 6.8,
     "totalSessoes": 5,
     "ultimaSessao": "2024-11-02T..."
   }
   ```

3. **Verificar scores por categoria**
   - A API deve retornar scores reais calculados:
   ```json
   {
     "detalhes": {
       "scoresPorCategoria": {
         "ANSIEDADE": 6.5,
         "DEPRESSAO": 4.2,
         "BEM_ESTAR": 7.8,
         "SONO": 5.5
       }
     }
   }
   ```

4. **Teste de tendência**
   - Complete 3 sessões com scores crescentes:
     - Sessão 1: Ansiedade = 4/10
     - Sessão 2: Ansiedade = 6/10
     - Sessão 3: Ansiedade = 8/10
   - API deve retornar: `"tendencia": "ASCENDENTE"`

5. **Verificar no banco de dados**
   ```bash
   # Abrir Prisma Studio
   npx prisma studio
   
   # Ou via SQL direto
   # Verificar se há dados reais em SessaoAdaptativa
   ```

---

## 📈 TESTE 3: COMPONENTES DE VISUALIZAÇÃO

### Objetivo
Testar os 4 componentes de gráficos criados.

### 3A. Gráfico Circumplex (Valência × Ativação)

1. **Acessar página de relatórios**
   ```
   URL: /relatorios/meu-estado-emocional
   ```

2. **Localizar o Gráfico Circumplex**
   - Deve aparecer um gráfico de dispersão 2D
   - Eixo X: Valência (-1 a 1)
   - Eixo Y: Ativação (-1 a 1)

3. **Verificações visuais**
   - ✅ Deve ter 4 quadrantes coloridos:
     - Superior direito: Verde (Animado/Feliz)
     - Superior esquerdo: Amarelo (Ansioso/Tenso)
     - Inferior esquerdo: Vermelho (Triste/Deprimido)
     - Inferior direito: Azul (Calmo/Relaxado)
   - ✅ Pontos devem aparecer distribuídos
   - ✅ Legenda deve mostrar as emoções

4. **Interatividade**
   - Passe o mouse sobre um ponto
   - Deve aparecer tooltip com: Data, Valência, Ativação, Estado

### 3B. Linha Temporal de Scores

1. **Localizar o gráfico de linha temporal**
   - Deve aparecer abaixo ou ao lado do Circumplex

2. **Verificações**
   - ✅ Eixo X: Datas das sessões
   - ✅ Eixo Y: Scores (0-10)
   - ✅ Múltiplas linhas coloridas (uma por categoria):
     - 🔴 Ansiedade
     - 🔵 Depressão
     - 🟢 Bem-estar
     - 🟡 Sono
     - etc.

3. **Estatísticas**
   - À direita do gráfico deve aparecer:
   ```
   Ansiedade
   Média: 6.5 | Último: 7.0 | Variação: +15%
   ```

4. **Hover**
   - Passe o mouse sobre a linha
   - Tooltip deve mostrar: Data, Categoria, Score

### 3C. Heatmap Emocional

1. **Localizar o heatmap**
   - Matriz 7×24 (dias da semana × horas)

2. **Verificações**
   - ✅ Eixo Y: Segunda, Terça, ..., Domingo
   - ✅ Eixo X: 00h, 01h, ..., 23h
   - ✅ Cores: Verde (calmo) → Vermelho (intenso)

3. **Insights automáticos**
   - Deve aparecer abaixo do heatmap:
   ```
   📊 Insights:
   - Total: 42 registros
   - Pico: 15h (Quarta-feira)
   - Dia mais ativo: Sexta-feira
   ```

4. **Hover**
   - Passe o mouse sobre uma célula
   - Tooltip: "Quarta, 15h - Intensidade: 8.5 (12 registros)"

### 3D. Radar de Categorias

1. **Localizar o gráfico radar**
   - Forma de estrela/polígono

2. **Verificações**
   - ✅ Eixos radiais: ANSIEDADE, DEPRESSÃO, BEM_ESTAR, SONO, etc.
   - ✅ 3 séries de dados:
     - 🔵 Atual (sessão mais recente)
     - 🟡 Anterior (média últimos 7 dias)
     - 🟢 Ideal (referência 7/10)

3. **Cards de categorias**
   - Abaixo do radar, cards devem mostrar:
   ```
   Ansiedade: 6.5/10
   [████████░░] Moderado
   ```

4. **Resumo estatístico**
   ```
   Resumo:
   - Média geral: 6.8/10
   - Categorias positivas: 5
   - Requerem atenção: 2
   ```

---

## 🧭 TESTE 4: INTELIGÊNCIA CLÍNICA (Interpretações)

### Objetivo
Testar as interpretações clínicas PHQ-9, GAD-7, WHO-5.

### 4A. Teste PHQ-9 (Depressão)

1. **Responder questionário de depressão**
   - Complete um questionário que tenha perguntas PHQ-9
   - Ou teste direto via API:

```http
GET http://localhost:3000/api/questionario/analise?usuarioId=1&escalaNome=PHQ9
```

2. **Verificar interpretação por score**

| Score | Nível | Cor | Recomendação |
|-------|-------|-----|--------------|
| 0-4 | MÍNIMO | Verde | Manter hábitos saudáveis |
| 5-9 | LEVE | Verde-claro | Monitorar sintomas |
| 10-14 | MODERADO | Amarelo | Considerar avaliação profissional |
| 15-19 | MODERADAMENTE_GRAVE | Laranja | Consulta recomendada |
| 20-27 | GRAVE | Vermelho | URGENTE: Avaliação imediata |

3. **Testar alertas automáticos**
   - Responda com score >= 15
   - Verifique no banco:
   ```sql
   SELECT * FROM alertas_socioemocionais 
   WHERE usuarioId = 1 
   ORDER BY criadoEm DESC LIMIT 1;
   ```
   - Deve ter criado um alerta VERMELHO

### 4B. Teste GAD-7 (Ansiedade)

1. **Responder questionário de ansiedade**

2. **Verificar interpretação**

| Score | Nível | Alerta |
|-------|-------|--------|
| 0-4 | MÍNIMO | Verde |
| 5-9 | LEVE | Amarelo |
| 10-14 | MODERADO | Laranja |
| 15-21 | GRAVE | Vermelho |

### 4C. Teste WHO-5 (Bem-estar)

1. **Responder questionário WHO-5**
   - 5 perguntas, cada uma 0-5 pontos
   - Score bruto: 0-25
   - **Conversão:** (score / 25) × 100 = percentual

2. **Verificar cutoff de depressão**
   - Score < 28% → "Rastreamento para depressão recomendado"
   - Score >= 28% → Normal

**Exemplo:**
```
Score bruto: 10/25
Percentual: (10/25) × 100 = 40%
Nível: BEM_ESTAR_BAIXO
Alerta: Laranja
```

3. **Verificar na UI**
   - Deve aparecer badge ou card:
   ```
   ⚠️ Bem-estar: 40%
   Recomenda-se acompanhamento profissional
   ```

---

## 📥 TESTE 5: EXPORTAÇÃO DE DADOS

### Objetivo
Testar a exportação CSV e JSON dos relatórios.

### 5A. Exportação CSV

1. **Via interface (se existir botão)**
   - Procure por botão "Exportar CSV" nos relatórios
   - Clique e verifique o download

2. **Via API direta**
```http
GET http://localhost:3000/api/relatorios/export?usuarioId=1&formato=csv&periodo=30
```

3. **Verificar conteúdo do CSV**
   - Abra o arquivo baixado em Excel/Google Sheets
   - **Esperado:**
   ```csv
   Data,Categoria,Score,Theta,Estado Emocional,Nível Alerta
   2024-11-02,ANSIEDADE,6.5,0.65,ANSIOSO,AMARELO
   2024-11-01,DEPRESSAO,4.2,0.42,TRISTE,VERDE
   ```

4. **Validar formatação**
   - ✅ Cabeçalhos em português
   - ✅ Datas no formato DD/MM/YYYY
   - ✅ Números com vírgula (6,5 não 6.5)
   - ✅ Texto entre aspas se contiver vírgulas

### 5B. Exportação JSON

1. **API Request**
```http
GET http://localhost:3000/api/relatorios/export?usuarioId=1&formato=json&periodo=30
```

2. **Verificar estrutura**
```json
{
  "metadata": {
    "usuarioId": 1,
    "periodoInicio": "2024-10-03T00:00:00.000Z",
    "periodoFim": "2024-11-02T23:59:59.999Z",
    "totalRegistros": 15,
    "geradoEm": "2024-11-02T22:30:00.000Z"
  },
  "sessoes": [
    {
      "id": "sessao-123",
      "data": "2024-11-02",
      "categoria": "ANSIEDADE",
      "score": 6.5,
      "theta": 0.65,
      "confianca": 0.85,
      "estadoEmocional": "ANSIOSO",
      "nivelAlerta": "AMARELO"
    }
  ],
  "resumo": {
    "scoresPorCategoria": { "ANSIEDADE": 6.5 },
    "tendencia": "ASCENDENTE",
    "alertasAtivos": 2
  }
}
```

3. **Validar com JSON Validator**
   - Cole o JSON em https://jsonlint.com/
   - Deve ser válido

---

## 📊 TESTE 6: MÉTRICAS AGREGADAS (Background)

### Objetivo
Testar o sistema de agregação de métricas (MetricaSocioemocional).

### 6A. Verificar tabela no banco

```bash
# Prisma Studio
npx prisma studio

# Ir para tabela: metricas_socioemocionais
```

**Esperado:**
- Tabela vazia inicialmente (agregações rodam em background)

### 6B. Executar agregação manual (FUTURO)

```http
POST http://localhost:3000/api/relatorios/agregar
Content-Type: application/json

{
  "usuarioId": 1,
  "granularidade": "SEMANAL"
}
```

**Nota:** Esta API ainda não está totalmente ativa (aguarda implementação de cron/background job).

### 6C. Verificar agregação criada

```sql
SELECT * FROM metricas_socioemocionais 
WHERE usuarioId = 1 
ORDER BY calculadoEm DESC;
```

**Esperado:**
```
id: uuid
usuarioId: 1
periodoInicio: 2024-10-28
periodoFim: 2024-11-03
granularidade: SEMANAL
scoreMedio: 6.5
totalSessoes: 5
```

---

## 🧪 TESTE 7: LOGS ADAPTATIVOS

### Objetivo
Verificar se o sistema está registrando decisões do algoritmo adaptativo.

### Passos

1. **Complete uma sessão de questionário**

2. **Verificar logs no banco**
```bash
npx prisma studio
# Tabela: logs_adaptativos
```

3. **Verificações esperadas**

Para cada pergunta, deve ter um log com:
```
id: uuid
sessaoId: sua-sessao-id
usuarioId: 1
perguntaId: pergunta-xyz-id
regraAplicada: "FISHER_INFO_MAXIMA"
algoritmo: "IRT"
thetaAtual: 0.65
informacaoFisher: 1.23
ordem: 3
timestamp: 2024-11-02T...
```

4. **Verificar sequência de regras**
   - Os logs devem mostrar a evolução do theta
   - Exemplo:
   ```
   Pergunta 1: theta=0.0, regra=INICIAL
   Pergunta 2: theta=0.5, regra=FISHER_INFO_MAXIMA
   Pergunta 3: theta=0.7, regra=DIVERSIDADE_CATEGORIA
   Pergunta 4: theta=0.8, regra=FISHER_INFO_MAXIMA
   ```

---

## 🎯 CHECKLIST FINAL DE TESTES

Marque conforme completa os testes:

### Sistema Adaptativo
- [ ] Navegação reversa funciona (últimas 3 perguntas)
- [ ] Theta é recalibrado ao voltar
- [ ] Respostas anteriores são pré-preenchidas
- [ ] Limite de 3 voltas é respeitado
- [ ] API `/api/questionario/recalibrar-theta` funciona

### Relatórios Analíticos
- [ ] API retorna dados reais (não mock)
- [ ] Scores por categoria estão corretos
- [ ] Tendência é calculada corretamente
- [ ] Histórico de theta está disponível

### Componentes Visuais
- [ ] GraficoCircumplex renderiza corretamente
- [ ] LinhaTemporalScores mostra múltiplas categorias
- [ ] HeatmapEmocional exibe matriz 7×24
- [ ] RadarCategorias compara 3 séries

### Inteligência Clínica
- [ ] PHQ-9 interpreta corretamente (5 níveis)
- [ ] GAD-7 interpreta corretamente (4 níveis)
- [ ] WHO-5 usa cutoff de 28%
- [ ] Alertas são criados automaticamente

### Exportação
- [ ] CSV é gerado com formatação correta
- [ ] JSON tem estrutura válida
- [ ] Metadados estão incluídos
- [ ] Datas estão no formato correto

### Logs e Auditoria
- [ ] LogAdaptativo registra decisões
- [ ] Sequência de perguntas está correta
- [ ] Theta evolui conforme esperado

---

## 🐛 TROUBLESHOOTING

### Problema: "Não consigo ver os gráficos"

**Solução:**
1. Verifique se há dados suficientes (mínimo 3 sessões)
2. Abra o console do browser (F12)
3. Procure por erros JavaScript
4. Verifique se Recharts está instalado:
   ```bash
   npm list recharts
   ```

### Problema: "API retorna erro 500"

**Solução:**
1. Verifique os logs do servidor
2. Confirme que o banco está acessível
3. Execute: `npx prisma generate`
4. Reinicie o servidor: `npm run dev`

### Problema: "Theta não está sendo recalibrado"

**Solução:**
1. Verifique logs no terminal
2. Confirme que API está sendo chamada:
   ```javascript
   // No console do browser
   fetch('/api/questionario/recalibrar-theta', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       sessaoId: 'sua-sessao-id',
       respostasAtuais: []
     })
   }).then(r => r.json()).then(console.log)
   ```

### Problema: "Exportação CSV está com caracteres estranhos"

**Solução:**
- Abra o CSV no Excel
- Vá em: Dados → De Texto/CSV
- Selecione encoding: UTF-8

---

## 📝 RELATÓRIO DE BUGS

Se encontrar problemas, documente assim:

```markdown
### Bug: [Título curto]

**Passos para reproduzir:**
1. ...
2. ...

**Comportamento esperado:**
...

**Comportamento atual:**
...

**Screenshots/Logs:**
[anexar]

**Ambiente:**
- Browser: Chrome 120
- Node: v20.10.0
- Prisma: v6.18.0
```

---

## ✅ CONCLUSÃO

Após completar todos os testes acima, você terá validado:
- ✅ Sistema de navegação reversa com recalibração IRT
- ✅ Relatórios com dados reais do banco
- ✅ 4 componentes de visualização científica
- ✅ Interpretações clínicas (PHQ-9, GAD-7, WHO-5)
- ✅ Exportações CSV/JSON
- ✅ Logs técnicos de decisões adaptativas

**Próximo passo:** Merge na develop e deploy! 🚀
