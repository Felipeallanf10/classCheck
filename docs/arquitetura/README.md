# 🏗️ Arquitetura - ClassCheck

Diagramas, decisões arquiteturais e estrutura técnica do sistema.

---

## 📊 Diagramas

- **[DIAGRAMA_ER_CLASSCHECK.md](./DIAGRAMA_ER_CLASSCHECK.md)** - Modelo Entidade-Relacionamento (30+ models)
- **[MAPA_FLUXOS_COMPLETO.md](./MAPA_FLUXOS_COMPLETO.md)** - Fluxos do sistema

---

## 🔐 Autenticação

- **[AUTH_TEMP_SYSTEM.md](./AUTH_TEMP_SYSTEM.md)** - Sistema de autenticação
- Ver também: [../planejamento/IMPLEMENTACAO_AUTH.md](../planejamento/IMPLEMENTACAO_AUTH.md)

---

## 🧭 Navegação e UX

- **[NAVEGACAO_AVALIACOES.md](./NAVEGACAO_AVALIACOES.md)** - Fluxo de avaliações
- **[REFINAMENTO_UX_UI.md](./REFINAMENTO_UX_UI.md)** - Design e UX
- **[ATUALIZACAO_MENU_RELATORIOS.md](./ATUALIZACAO_MENU_RELATORIOS.md)** - Menu de relatórios

---

## 🗄️ Banco de Dados

### Models Prisma (30+)
```
Core:
- Usuario (ALUNO, PROFESSOR, ADMIN)
- Materia
- Turma

Adaptativo:
- QuestionarioAdaptativo
- BancoPerguntasAdaptativo
- SessaoAdaptativa
- RespostaSocioemocional

Alertas:
- AlertaSocioemocional
- LogAdaptativo

Gamificação:
- Conquista
- ConquistaUsuario
```

---

## 🔗 Links Relacionados

- [DIAGRAMA_ER_CLASSCHECK.md](./DIAGRAMA_ER_CLASSCHECK.md) - Ver modelo completo
- [../planejamento/PLANEJAMENTO_BANCO_DADOS_ADAPTATIVO.md](../planejamento/PLANEJAMENTO_BANCO_DADOS_ADAPTATIVO.md)

---

**Última Atualização**: 21 de novembro de 2025