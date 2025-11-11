# 🧪 Guia de Teste - Fase 3: Melhorias de Avaliação

**Data:** 02/11/2025  
**Branch:** `refactor/phase3-assessment-improvements`  
**Commits:** 5 implementados

---

## 📋 Pré-requisitos

1. **Banco de dados atualizado:**
   ```bash
   # Executar seed do questionário didático
   node prisma/seed-questionario-didatico.js
   ```

2. **Servidor rodando:**
   ```bash
   npm run dev
   ```

3. **Usuário de teste:** ID 52 (já configurado no código)

---

## ✅ Teste 1: Fluxo Completo de Avaliação de Aula

### Objetivo
Validar a transição automática entre questionários e criação de registros no banco.

### Passos

1. **Acessar lista de aulas**
   - URL: `http://localhost:3000/aulas`
   - Verificar que há aulas listadas

2. **Selecionar aula para avaliar**
   - Buscar aula com status "Pendente" (badge vermelho)
   - Clicar no botão "Avaliar"

3. **Questionário Socioemocional (Parte 1)**
   - Deve iniciar automaticamente o questionário "Impacto Socioemocional da Aula"
   - Responder 3-5 perguntas (depende das respostas adaptativas)
   - Perguntas esperadas:
     - "Como você se sentiu durante esta aula?" (emoji)
     - "Qual foi seu nível de ansiedade?" (slider 0-10)
     - "Você se sentiu incluído?" (Likert 1-5)
     - Possível: "Você conseguiu se concentrar?" (se aplicável)
   
   **Validações:**
   - ✅ Progress bar mostrando progresso
   - ✅ Botão "Voltar" disponível nas 3 primeiras perguntas
   - ✅ IRT info mostrando theta, erro e confiança (se adaptativo)

4. **Transição Automática**
   - Ao finalizar última pergunta socioemocional:
   - ✅ Toast: "Parte 1 concluída! Iniciando avaliação didática..."
   - ✅ Aguardar 1.5 segundos
   - ✅ Redirecionamento automático para questionário didático

5. **Questionário Didático (Parte 2)**
   - Deve carregar questionário "Avaliação Didática da Aula"
   - Responder 6 perguntas fixas:
     1. Compreensão do conteúdo (Likert 1-5)
     2. Ritmo da aula (Likert 1-5)
     3. Recursos didáticos (Likert 1-5)
     4. Engajamento (Slider 0-10)
     5. Ponto positivo (texto opcional)
     6. Sugestão de melhoria (texto opcional)
   
   **Validações:**
   - ✅ Progress bar mostrando 6 perguntas
   - ✅ Questionário NÃO é adaptativo
   - ✅ Todas as perguntas são apresentadas

6. **Finalização**
   - Ao responder última pergunta:
   - ✅ Toast: "Avaliação concluída!"
   - ✅ Redirecionamento para `/avaliacoes/resultado/[id]`

---

## ✅ Teste 2: Status Visual de Aula Avaliada

### Objetivo
Verificar se a aula é marcada como avaliada após conclusão.

### Passos

1. **Verificar antes da avaliação**
   - Acessar: `http://localhost:3000/aulas`
   - Anotar aula escolhida e verificar badge "Pendente"

2. **Completar avaliação**
   - Seguir passos do Teste 1 completamente

3. **Verificar após avaliação**
   - Voltar para: `http://localhost:3000/aulas`
   - Atualizar página (F5)
   
   **Validações:**
   - ✅ Badge mudou de "Pendente" para "Avaliada" ✅
   - ✅ Cor do badge é verde/primária
   - ✅ Status persiste após recarregar

4. **Verificar no banco (opcional)**
   ```bash
   # Conectar ao banco e verificar
   npx prisma studio
   ```
   
   Verificar tabelas:
   - ✅ `AvaliacaoSocioemocional`: 1 registro novo
     - valencia, ativacao, estadoPrimario preenchidos
   - ✅ `AvaliacaoDidatica`: 1 registro novo
     - compreensaoConteudo, ritmoAula, etc. preenchidos
   - ✅ `Aula`: status = "CONCLUIDA"

---

## ✅ Teste 3: Minhas Avaliações (Dados Reais)

### Objetivo
Validar que a página exibe dados do banco, não mocks.

### Passos

1. **Acessar Minhas Avaliações**
   - URL: `http://localhost:3000/minhas-avaliacoes`
   
   **Validações - Loading:**
   - ✅ Skeleton aparece enquanto carrega
   - ✅ Transição suave para conteúdo

2. **Verificar Estatísticas (Cards superiores)**
   - Card "Aulas Avaliadas":
     - ✅ Número > 0 (após Teste 1)
     - ✅ Incrementa após nova avaliação
   
   - Card "Check-ins":
     - ✅ Número correto (pode ser 0)
   
   - Card "Sequência Atual":
     - ✅ Mostra dias consecutivos
   
   - Card "Humor Médio":
     - ✅ Valor calculado da valência
     - ✅ Estrelas preenchidas corretamente

3. **Tab: Aulas**
   - ✅ Lista avaliações reais do banco
   - ✅ Mostra título, matéria, professor da aula
   - ✅ Data formatada corretamente
   
   **Socioemocional:**
   - ✅ Emoji correspondente ao estado
   - ✅ Estado primário (ex: "Animado", "Calmo")
   - ✅ Confiança e total de perguntas
   
   **Didática:**
   - ✅ Compreensão, Ritmo, Recursos, Engajamento
   - ✅ Valores numéricos corretos
   - ✅ Ponto positivo exibido (se preenchido)

4. **Tab: Professores**
   - ✅ Lista avaliações de professores
   - ✅ Média geral calculada (6 critérios)
   - ✅ Estrelas preenchidas
   - ✅ Período (ex: "2025-10")

5. **Tab: Check-ins**
   - ✅ Lista check-ins se houver
   - ✅ Data formatada
   - ✅ Scores por categoria

6. **Busca em Tempo Real**
   - Digitar no campo de busca:
     - Nome da matéria (ex: "História")
     - Nome do professor
     - Título da aula
   
   **Validações:**
   - ✅ Filtra resultados instantaneamente
   - ✅ Mostra "Nenhuma avaliação encontrada" se vazio
   - ✅ Limpar busca restaura todos

7. **Insights (rodapé)**
   - ✅ "Disciplina Favorita" aparece
   - ✅ Valor correto (mais avaliada)

---

## ✅ Teste 4: API de Avaliações

### Objetivo
Validar que a API retorna dados corretos.

### Passos

1. **Testar endpoint direto**
   - URL: `http://localhost:3000/api/avaliacoes/minhas?usuarioId=52`
   - Abrir no navegador ou Postman
   
   **Validações:**
   - ✅ Status 200
   - ✅ JSON estruturado:
     ```json
     {
       "avaliacoesAulas": [...],
       "avaliacoesProfessores": [...],
       "checkIns": [...],
       "estatisticas": {
         "totalAvaliacoesAulas": number,
         "totalCheckIns": number,
         "sequenciaAtual": number,
         "mediaHumor": number,
         "disciplinaFavorita": string
       }
     }
     ```

2. **Verificar dados de aula**
   - Cada item de `avaliacoesAulas` deve ter:
     - ✅ `socioemocional` (se completou parte 1)
     - ✅ `didatica` (se completou parte 2)
     - ✅ Aula vinculada com título, matéria, professor

---

## ✅ Teste 5: Correção de Tipo TypeScript

### Objetivo
Verificar que não há erros de tipo no código.

### Passos

1. **Verificar ausência de erros**
   - No VS Code, abrir: `src/app/avaliacoes/sessao/[id]/page.tsx`
   - Ir para linha 112: `sessao.usuario.id`
   
   **Validações:**
   - ✅ Sem sublinhado vermelho
   - ✅ IntelliSense funciona
   - ✅ TypeScript reconhece propriedade `usuario`

2. **Build do projeto**
   ```bash
   npm run build
   ```
   
   **Validações:**
   - ✅ Build completa sem erros TypeScript
   - ✅ Sem warnings relacionados a tipos

---

## ✅ Teste 6: Navegação Reversa (Voltar Pergunta)

### Objetivo
Validar funcionalidade de voltar nas primeiras 3 perguntas.

### Passos

1. **Iniciar questionário adaptativo**
   - Avaliar uma nova aula
   - Responder pergunta 1
   - Responder pergunta 2

2. **Clicar em "Voltar"**
   - ✅ Botão visível nas primeiras 3 perguntas
   - ✅ Ao clicar, recarrega página
   - ✅ Volta para pergunta anterior
   - ✅ Contador diminui

3. **Limite de 3 perguntas**
   - Após 4ª pergunta:
   - ✅ Botão "Voltar" desaparece
   - ✅ Não é mais possível voltar

---

## 🐛 Possíveis Problemas e Soluções

### Erro: "Questionário não encontrado"
**Causa:** Seed do questionário didático não executado  
**Solução:**
```bash
node prisma/seed-questionario-didatico.js
```

### Erro: "Expected number, received string"
**Causa:** Tipo incorreto em contexto.aulaId  
**Solução:** Já corrigido no commit 1, se persistir verificar código

### Página Minhas Avaliações vazia
**Causa:** Nenhuma avaliação completa no banco  
**Solução:** Completar pelo menos 1 avaliação de aula (Teste 1)

### Status da aula não atualiza
**Causa:** Cache do React Query  
**Solução:** Recarregar página (F5) ou limpar cache do navegador

---

## 📊 Checklist Final

Após todos os testes:

- [ ] ✅ Fluxo completo de avaliação funciona
- [ ] ✅ Transição automática entre questionários
- [ ] ✅ Badge de status atualiza corretamente
- [ ] ✅ Minhas Avaliações mostra dados reais
- [ ] ✅ Estatísticas calculadas corretamente
- [ ] ✅ Busca e filtros funcionam
- [ ] ✅ API retorna dados corretos
- [ ] ✅ Sem erros TypeScript
- [ ] ✅ Botão voltar funciona (3 primeiras perguntas)

---

## 🎯 Próximos Testes (Após Implementação)

Quando as próximas tarefas forem implementadas:

- [ ] Teste 7: Relatórios com gráficos (recharts)
- [ ] Teste 8: Salvamento automático e retomada
- [ ] Teste 9: UX de feedback pós-avaliação

---

## 📝 Notas

- Usuário de teste: ID 52
- Questionário socioemocional: `questionario-impacto-aula`
- Questionário didático: `questionario-didatico-aula`
- Todos os dados são persistidos no PostgreSQL (Neon)

**Boa sorte com os testes! 🚀**
