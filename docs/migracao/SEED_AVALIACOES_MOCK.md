# 🌱 Seed de Avaliações Mock - Guia de Uso

## Descrição

Script para popular o banco de dados PostgreSQL com avaliações socioemocionais e didáticas mock realistas para testes dos relatórios e analytics.

## 📋 O que o script faz:

### 1. Cria Aulas (se necessário)
- **Período**: Últimos 90 dias
- **Frequência**: 2-3 aulas por dia útil (pula fins de semana)
- **Matérias**: Matemática, Português, História, Geografia, Ciências, Inglês, Ed. Física, Arte, Física, Química
- **Duração**: 2 horas cada
- **Status**: CONCLUIDA

### 2. Gera Avaliações Socioemocionais
- **Cobertura**: ~70% das aulas (realista - nem todas são avaliadas)
- **Máximo**: 180 avaliações
- **Dados gerados**:
  - ✅ **Valencia**: -1.0 a 1.0 (negativo → positivo)
  - ✅ **Ativação**: -1.0 a 1.0 (baixa energia → alta energia)
  - ✅ **Confiança**: 0.7 a 0.95 (precisão IRT)
  - ✅ **Estado Primário**: "Alegre", "Calmo", "Ansioso", "Triste", etc.
  - ✅ **Total Perguntas**: 5-12 perguntas
  - ✅ **Tempo Resposta**: 60-180 segundos

### 3. Gera Avaliações Didáticas
- **Mesma quantidade** das avaliações socioemocionais
- **Campos (escala 1-5)**:
  - `compreensaoConteudo`: Correlacionado com valência emocional
  - `engajamento`: Correlacionado com valência emocional
  - `ritmoAula`: Aleatório em torno de 3 (ideal)
  - `recursosDidaticos`: Correlacionado com valência emocional
- **Campos opcionais**:
  - `pontoPositivo`: 30% de chance
  - `pontoMelhoria`: 20% de chance

## 🎯 Padrões Realistas Simulados

### Tendência Temporal
- **Melhora gradual** ao longo do tempo (+30% de tendência crescente)
- Simula progresso natural do semestre

### Ciclo Semanal
- **Piora no meio da semana** (quarta/quinta)
- **Melhora no fim da semana** (sexta)
- Amplitude: ±15%

### Volatilidade
- **Variação aleatória**: ±20-30%
- Simula flutuações naturais do dia a dia

### Correlação Emocional → Didática
- Estado emocional **positivo** = Notas didáticas **mais altas**
- Estado emocional **negativo** = Notas didáticas **mais baixas**
- Correlação realista observada em estudos educacionais

## 🚀 Como Usar

### 1. Executar o Seed

```bash
npm run db:seed:avaliacoes
```

### 2. Verificar no Prisma Studio

```bash
npm run db:studio
```

- Navegue para `AvaliacaoSocioemocional`
- Navegue para `AvaliacaoDidatica`
- Verifique os dados gerados

### 3. Testar os Relatórios

Acesse no navegador:
- http://localhost:3000/relatorios
- http://localhost:3000/relatorios/analise-avancada
- http://localhost:3000/minhas-avaliacoes

## 📊 Dados Esperados

Após executar o seed:

```
✅ Seed concluído com sucesso!
📊 Estatísticas:
   - Avaliações socioemocionais: ~150-180
   - Avaliações didáticas: ~150-180
   - Período: [Data início] a [Data fim]

🎯 Você pode testar os relatórios agora!
```

## 🗑️ Limpar Dados Mock

O script **automaticamente remove** avaliações antigas do usuário ID 52 antes de criar novas.

Para limpar manualmente:

```sql
-- No Prisma Studio ou psql
DELETE FROM avaliacoes_didaticas WHERE "usuarioId" = 52;
DELETE FROM avaliacoes_socioemocionais WHERE "usuarioId" = 52;
```

## 🔍 Validação dos Dados

### Verificar distribuição de estados emocionais:

```sql
SELECT 
  "estadoPrimario",
  COUNT(*) as total,
  ROUND(AVG(valencia)::numeric, 2) as valencia_media,
  ROUND(AVG(ativacao)::numeric, 2) as ativacao_media
FROM avaliacoes_socioemocionais
WHERE "usuarioId" = 52
GROUP BY "estadoPrimario"
ORDER BY total DESC;
```

### Verificar tendência temporal:

```sql
SELECT 
  DATE_TRUNC('week', a."dataHora") as semana,
  COUNT(*) as avaliacoes,
  ROUND(AVG(ase.valencia)::numeric, 2) as valencia_media
FROM avaliacoes_socioemocionais ase
JOIN aulas a ON a.id = ase."aulaId"
WHERE ase."usuarioId" = 52
GROUP BY semana
ORDER BY semana;
```

### Verificar correlação emocional-didática:

```sql
SELECT 
  CASE 
    WHEN ase.valencia > 0 THEN 'Positivo'
    ELSE 'Negativo'
  END as estado_emocional,
  ROUND(AVG(ad."compreensaoConteudo")::numeric, 2) as compreensao_media,
  ROUND(AVG(ad.engajamento)::numeric, 2) as engajamento_medio
FROM avaliacoes_socioemocionais ase
JOIN avaliacoes_didaticas ad ON ad."aulaId" = ase."aulaId" AND ad."usuarioId" = ase."usuarioId"
WHERE ase."usuarioId" = 52
GROUP BY estado_emocional;
```

## 📝 Notas Técnicas

### Algoritmo de Geração

```typescript
function gerarValorComTendencia(base, dia, totalDias, volatilidade) {
  // Tendência: +30% ao longo do período
  const tendencia = (dia / totalDias) * 0.3;
  
  // Ruído aleatório: ±volatilidade
  const ruido = (Math.random() - 0.5) * volatilidade;
  
  // Ciclo semanal: senoidal com período de 7 dias
  const cicloSemanal = Math.sin((dia % 7) * PI / 3.5) * 0.15;
  
  return clamp(base + tendencia + ruido + cicloSemanal, -1, 1);
}
```

### Estados Emocionais (Modelo Circumplexo)

**Q1 - Positivo + Alta Ativação:**
- Alegre (0.7, 0.7)
- Animado (0.8, 0.8)
- Entusiasmado (0.6, 0.7)
- Confiante (0.7, 0.5)

**Q2 - Positivo + Baixa Ativação:**
- Calmo (0.6, -0.5)
- Relaxado (0.7, -0.6)
- Satisfeito (0.5, -0.3)
- Tranquilo (0.6, -0.4)

**Q3 - Negativo + Baixa Ativação:**
- Triste (-0.6, -0.5)
- Desanimado (-0.5, -0.4)
- Cansado (-0.3, -0.7)
- Entediado (-0.4, -0.6)

**Q4 - Negativo + Alta Ativação:**
- Ansioso (-0.5, 0.7)
- Estressado (-0.6, 0.8)
- Frustrado (-0.5, 0.6)
- Irritado (-0.7, 0.7)

## ✅ Checklist de Testes

Após rodar o seed, teste:

- [ ] Dashboard de Análise Avançada mostra gráficos populados
- [ ] Relatório Longitudinal exibe evolução temporal
- [ ] Minhas Avaliações lista as avaliações criadas
- [ ] Filtros por período funcionam corretamente
- [ ] Filtros por matéria funcionam corretamente
- [ ] Gráficos de tendência mostram padrão crescente
- [ ] Estados emocionais estão distribuídos pelos 4 quadrantes
- [ ] Notas didáticas correlacionam com valência emocional

## 🐛 Troubleshooting

### Erro: "Usuário ID 52 não encontrado"
```bash
# Execute o seed principal primeiro
npm run db:seed
```

### Erro: "Connection refused"
```bash
# Verifique se o PostgreSQL está rodando
docker-compose up -d
```

### Seed não cria aulas
```bash
# Verifique se já existem aulas
npm run db:studio
# Navegue para "aulas"
```

### Dados não aparecem nos relatórios
- Confirme que `usuarioId = 52` está sendo usado nos componentes
- Verifique console do navegador para erros de API
- Inspecione response da API: `/api/analytics/metricas-avaliacoes?usuarioId=52`

## 📚 Referências

- Modelo Circumplexo: Russell (1980)
- IRT (Item Response Theory): Lord & Novick (1968)
- Correlação Emocional-Cognitiva: Pekrun (2002)

---

**Desenvolvido para**: Sistema ClassCheck - Avaliações Adaptativas
**Versão**: 1.0.0
**Data**: Novembro 2025
