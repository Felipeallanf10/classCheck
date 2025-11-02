# 🧠 PLANO DE APRIMORAMENTO DOS QUESTIONÁRIOS ADAPTATIVOS E RELATÓRIOS ANALÍTICOS  
**Projeto:** ClassCheck v3.0  
**Responsável Técnico:** [Seu nome ou Gerente de Projeto]  
**Data de início:** [inserir data]

---

## 🎯 OBJETIVO PRINCIPAL

Aprimorar o módulo de **questionários adaptativos (CAT + IRT)** e **relatórios analíticos**, garantindo:
1. Escolha da próxima pergunta com base em dados psicométricos reais (não apenas regras simples);
2. Relatórios alimentados diretamente pelos dados armazenados no banco;
3. Métricas interpretativas e visuais que agreguem valor clínico e educacional;
4. Código limpo, padronizado e sem redundâncias entre backend e frontend.

> ⚠️ **Importante:** Todas as alterações devem ser feitas em **nova branch** baseada em `develop`, conforme padrão:
> ```
> git checkout develop
> git pull
> git checkout -b refactor/phase3-analytics-and-adaptive-flow
> ```

---

## 🧩 1. MELHORAR O FLUXO ADAPTATIVO (CAT)

### 🧱 Arquivos-chave:
- `src/lib/adaptive/proxima-pergunta-service.ts`
- `src/lib/adaptive/engine.ts`
- `src/lib/adaptive/selecao-avancada-service.ts`

### 🧠 Melhorias obrigatórias:
1. **Otimizar seleção da próxima pergunta**
   - Garantir que os parâmetros IRT (`a`, `b`, `c`) estejam sendo usados corretamente;
   - Se estiverem com valores padrão (1.0, 0.0, 0.0), implementar fallback inteligente baseado na média dos parâmetros por categoria.

2. **Adicionar diversidade e contexto**
   - Evitar repetição excessiva de escalas e domínios;
   - Incluir lógica de “contexto emocional” para adaptar o tipo de pergunta conforme o padrão detectado (ex: se ansiedade alta → reforçar bem-estar).

3. **Permitir navegação reversa controlada**
   - Adicionar função `perguntaAnterior()` no Zustand Store (`src/stores/sessao-store.ts`);
   - Permitir editar até as 3 últimas respostas com recalibração do θ (theta).

4. **Gerar logs técnicos de adaptação**
   - Criar tabela `LogAdaptativo` (timestamp, sessão, perguntaId, regra aplicada);
   - Registrar todas as transições de perguntas e gatilhos ativados.

---

## 📊 2. CONECTAR RELATÓRIOS AO BANCO (FASE 1)

### 🔧 Nova pasta:
src/lib/analytics/

bash
Copiar código

### 🔹 Criar arquivo:
`src/lib/analytics/queries.ts`

**Funções obrigatórias:**
```ts
export async function buscarSessoesUsuario(usuarioId: number, periodo: { inicio: Date; fim: Date }) { ... }
export async function calcularScoresPorCategoria(sessoes) { ... }
export async function calcularTendencia(sessoes) { ... }
🔹 Atualizar:
src/app/api/questionario/analise/route.ts

Substituir dados mock por queries reais.

Incluir cálculo de:

estadoDominante

tendência

pontuacaoGeral

recomendacoes baseadas em scores reais.

🔹 Teste:
Validar com 10 sessões reais;

Garantir resposta <500ms para requisições analíticas.

📈 3. IMPLEMENTAR RELATÓRIOS PROFUNDOS (FASE 2)
🧠 Objetivo:
Transformar relatórios de “gráficos genéricos” em painéis de análise socioemocional real.

🔹 Componentes a criar:
src/components/relatorios/GraficoCircumplex.tsx

Exibir estado emocional (Valência × Ativação) conforme modelo de Russell.

src/components/relatorios/LinhaTemporalScores.tsx

Exibir evolução de categorias ao longo do tempo.

src/components/relatorios/HeatmapEmocional.tsx

Distribuir emoções por hora/dia.

src/components/relatorios/RadarCategorias.tsx

Comparar ansiedades, bem-estar, sono, estresse etc.

🔹 Bibliotecas:
Recharts (já instalado)

Zod para validação dos dados antes do render

🧭 4. INTELIGÊNCIA CLÍNICA (FASE 3)
🔹 Objetivos:
Criar módulo src/lib/analytics/interpretacao-clinica.ts

Implementar funções:

ts
Copiar código
interpretarPHQ9(score)
interpretarGAD7(score)
interpretarWHO5(score)
Gerar alertas automáticos e notificações via AlertaSocioemocional:

Severidade grave → alerta visual e log

Moderada → recomendação personalizada

Integrar painel de alertas no dashboard do coordenador.

🧩 5. DADOS E RELATÓRIOS FUTUROS (FASE 4)
🔹 Objetivo:
Preparar terreno para análises preditivas e benchmarking.

Criar tabela MetricaSocioemocional (pré-agregação de scores por semana/mês)

Implementar exportações CSV e API de pesquisa (/api/relatorios/export)

Documentar o modelo de dados analítico.

✅ 6. PADRÕES DE DESENVOLVIMENTO
Nenhuma modificação direta em develop.

Commits padronizados (Conventional Commits).

Adicionar documentação inline nos serviços IRT e analytics.

Criar testes unitários para:

calcularTendencia()

interpretarPHQ9()

buscarSessoesUsuario()

🧩 7. TESTES E VALIDAÇÃO
Teste	Descrição	Resultado Esperado
Teste de API /api/questionario/analise	Deve retornar dados reais, não mock	✅
Teste de tempo de resposta	Query analytics < 500ms	✅
Teste de integração IRT	Seleção de perguntas conforme Fisher Info	✅
Teste de relatórios	Exibir gráficos Circumplex e Longitudinal	✅
Teste de alertas	Gerar alertas em caso de score grave	✅

📅 CRONOGRAMA SUGERIDO
Fase	Duração	Entregas Principais
Fase 1	1 semana	Queries reais + API real
Fase 2	1 semana	Relatórios científicos
Fase 3	2 semanas	Interpretação + alertas
Fase 4	2 semanas	Benchmarking + exportação

💬 COMUNICAÇÃO
Dúvidas técnicas devem ser documentadas em docs/relatorios/diarios/.

Atualizações de progresso via commits diários.

Pull Request revisado somente após testes de dados reais.

Resumo:
O foco agora é dar vida aos dados coletados — eliminando mocks e gerando relatórios que realmente refletem o estado emocional, progresso e bem-estar dos usuários. O sistema já coleta tudo o que precisa — só falta conectar, analisar e apresentar com profundidade.