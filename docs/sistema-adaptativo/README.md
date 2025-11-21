# 🧠 Sistema Adaptativo - ClassCheck

Documentação completa do sistema de questionários adaptativos usando IRT (Item Response Theory) e CAT (Computer Adaptive Testing).

---

## ⭐ Documentos Principais

### Visão Completa
- **[SISTEMA_ADAPTATIVO_COMPLETO.md](./SISTEMA_ADAPTATIVO_COMPLETO.md)** - Overview completo do sistema
- **[SISTEMA_COMPLETO_RESUMO_FINAL.md](./SISTEMA_COMPLETO_RESUMO_FINAL.md)** - Resumo executivo final
- **[RESUMO_EXECUTIVO_CAT_DOUTORADO.md](./RESUMO_EXECUTIVO_CAT_DOUTORADO.md)** - Nível doutorado

---

## 📚 Implementações

### CAT (Computer Adaptive Testing)
- **[IMPLEMENTACAO_CAT_COMPLETA.md](./IMPLEMENTACAO_CAT_COMPLETA.md)** - Implementação completa
- **[INTEGRACAO_CAT_COMPLETA.md](./INTEGRACAO_CAT_COMPLETA.md)** - Integração com sistema
- **[INTEGRACAO_CAT_AVANCADO.md](./INTEGRACAO_CAT_AVANCADO.md)** - Recursos avançados

### Sistema Adaptativo Avançado
- **[SISTEMA_ADAPTATIVO_AVANCADO.md](./SISTEMA_ADAPTATIVO_AVANCADO.md)** - Algoritmos avançados

---

## 🚨 Regras e Alertas

- **[REGRAS_CLINICAS_AVANCADAS.md](./REGRAS_CLINICAS_AVANCADAS.md)** - Regras clínicas e alertas
- Ver também: [../planejamento/SPRINT_06_REGRAS_ADAPTATIVAS.md](../planejamento/SPRINT_06_REGRAS_ADAPTATIVAS.md)

---

## 🎨 Componentes Visuais

- **[CIRCUMPLEX_GRID_DOCUMENTACAO.md](./CIRCUMPLEX_GRID_DOCUMENTACAO.md)** - Modelo Circumplex de Russell

---

## 🔑 Conceitos-Chave

### IRT (Item Response Theory)
- **Modelo 3PL**: Discriminação (a), Dificuldade (b), Acerto (c)
- **Estimação θ**: MLE, EAP, MAP
- **Informação de Fisher**: I(θ)
- **Convergência**: Newton-Raphson

### CAT (Computer Adaptive Testing)
- **Seleção de perguntas**: Máxima informação em θ
- **Critérios de parada**: Erro < 0.3 ou 20 perguntas
- **Theta inicial**: 0 (neutro)
- **Banco adaptativo**: 15 tipos de perguntas

### Modelo Circumplex
- **Valencia**: Prazer (-1 negativo, +1 positivo)
- **Ativação**: Energia (-1 baixa, +1 alta)
- **Categorias**: Animado, Calmo, Ansioso, Triste

---

## 📊 Arquivos Implementados

### Core IRT/CAT
```
src/lib/adaptive/
├── irt-refinado.ts              # Cálculos IRT (P, I, θ)
├── proxima-pergunta-service.ts  # Seleção adaptativa
├── criterios-parada.ts          # Quando parar
└── regras-predefinidas.ts       # Regras clínicas
```

### Otimizações (Sprint 10)
```
src/lib/adaptive/
├── irt-cache.ts                 # Cache LRU
└── fisher-precalc.ts            # Pré-cálculo
```

---

## 🔗 Links Relacionados

- [../planejamento/SPRINT_01_ESCALAS_CLINICAS.md](../planejamento/SPRINT_01_ESCALAS_CLINICAS.md) - PHQ-9, GAD-7, WHO-5
- [../planejamento/SPRINT_06_REGRAS_ADAPTATIVAS.md](../planejamento/SPRINT_06_REGRAS_ADAPTATIVAS.md) - Regras avançadas
- [../planejamento/SPRINT_10_OTIMIZACAO_PERFORMANCE.md](../planejamento/SPRINT_10_OTIMIZACAO_PERFORMANCE.md) - Performance

---

**Última Atualização**: 21 de novembro de 2025  
**Total de Documentos**: 8  
**Status**: Sistema completo e funcional