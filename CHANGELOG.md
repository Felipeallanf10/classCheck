# 📋 CHANGELOG - ClassCheck

Registro cronológico de todas as alterações e implementações do projeto.

---

## 🔄 Branch: copilot/fix-kata-solution-length

### 📅 30 de Março de 2026

#### 🔧 CORREÇÃO: **Kata Python - Solução One-Liner para `raises_once()`**
- **Commit**: `fix: implement shortest compliant one-liner for raises_once kata`
- **Arquivos**: `solution.py`, `tests.py`
- **Descrição**: Corrigida falha `Restrictions -> Length` (`Too long!`). A tentativa anterior usava `try/except` em duas linhas físicas, falhando na checagem de linha única. A nova solução `exec("try:raises_once()\nexcept:magic=raises_once()")` é uma linha única (53 chars, sem `\n` real no source), chama `raises_once()` duas vezes, silencia a primeira exceção via try/except embutido no `exec`, e atribui o valor mágico a `magic`. O `exec` não é palavra proibida (apenas `eval` é proibido). Adicionado `tests.py` com harness completo de restrições e lógica.

---

## 🔄 Branch: main

### 📅 27 de Novembro de 2025

#### 🔀 MERGE: **Sprint 4 - Sistema de Cache Distribuído Redis**
- **Commit**: `merge: Sprint 4 - Redis distributed caching para main`
- **Arquivos**: `src/lib/cache/redis-cache.ts`, `src/app/api/admin/cache/route.ts`, APIs de relatórios, scripts de teste
- **Descrição**: Sistema completo de cache com Redis/Upstash e fallback automático para memória. TTL de 300-600s em relatórios. Invalidação automática ao finalizar sessões. API admin de gerenciamento.

---

## 🔄 Branch: feature/redis-caching

### 📅 27 de Novembro de 2025

#### ✅ IMPLEMENTAÇÃO: **Sistema de Cache Distribuído com Redis**
- **Commit**: `feat: implementar cache distribuído com Upstash Redis`
- **Arquivos**: `src/lib/cache/redis-cache.ts`, `src/app/api/admin/cache/route.ts`, `src/app/api/relatorios/route.ts`, `src/app/api/professor/relatorios/turma/route.ts`, `src/app/api/sessoes/[id]/resposta/route.ts`
- **Descrição**: Implementado sistema de cache com Redis/Upstash e fallback automático para memória. TTL de 300-600s em relatórios. Invalidação automática ao finalizar sessões.

#### 📚 DOCUMENTAÇÃO: **Guias de Teste e Scripts de Validação**
- **Commit**: `docs: adicionar guias de teste e scripts de validação do cache Redis`
- **Arquivos**: `docs/guias/TESTAR_CACHE_REDIS.md`, `scripts/test-cache.js`, `scripts/test-cache-simple.js`
- **Descrição**: Criado guia completo de testes com 4 métodos de validação e scripts automatizados para verificar funcionamento do cache.

---

## 🔄 Branch: feature/auth-and-roles

### 📅 11 de Novembro de 2025

#### ✅ IMPLEMENTAÇÃO: **Sistema de Autenticação e Autorização**
- **Commit**: `feat: integrar sistema de autenticação e autorização`
- **Arquivos**: `src/lib/auth.ts`, `src/middleware.ts`, `src/app/admin/*`, `src/app/professor/*`, `prisma/schema.prisma`
- **Descrição**: Sistema completo com NextAuth.js, 3 roles (ALUNO, PROFESSOR, ADMIN), proteção de rotas, páginas admin/professor, migração unificando Usuario.

#### 🔧 CORREÇÃO: **Script dev:poll compatibilidade WSL**
- **Commit**: `fix: remover cross-env do script dev:poll`
- **Arquivos**: `package.json`
- **Descrição**: Removido `cross-env` do script `dev:poll` para compatibilidade com WSL.

---

## 📌 Convenções de Commit

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção
- `perf:` - Performance
- `merge:` - Merge de branches

---

**Última atualização**: 27/11/2025  
**Branch atual**: main  
**Status**: ✅ Produção
