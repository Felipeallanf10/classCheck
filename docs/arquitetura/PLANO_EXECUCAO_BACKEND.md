# 🚀 PLANO DE EXECUÇÃO - Backend ClassCheck

**Objetivo:** Completar o backend faltante em ordem de prioridade  
**Prazo:** 2-3 dias para MVP, 1-2 semanas para produção  
**Status:** 🟡 Em Execução

---

## 📋 **FASE 1 - IMPLEMENTAÇÕES CRÍTICAS (AGORA)**

### **SPRINT 1.1 - API Favoritos** ⏱️ 2-3 horas

#### **Tasks:**
1. ✅ Criar `/api/favoritos/route.ts`
   - POST: Adicionar favorito
   - GET: Listar favoritos do usuário
   - Validações: usuário ativo, aula existe, não duplicar

2. ✅ Criar `/api/favoritos/[id]/route.ts`
   - GET: Buscar favorito específico
   - DELETE: Remover favorito
   - Validação: apenas dono pode deletar

3. ✅ Atualizar Schema Prisma
   - Adicionar índices em `AulaFavorita`
   - Otimizar queries

4. ✅ Criar testes básicos
   - Testar criação de favorito
   - Testar constraint unique
   - Testar remoção

**Entregáveis:**
- [x] `src/app/api/favoritos/route.ts`
- [x] `src/app/api/favoritos/[id]/route.ts`
- [x] Schema atualizado com índices
- [x] Documentação da API

---

### **SPRINT 1.2 - Middleware de Autenticação** ⏱️ 4-5 horas

#### **Tasks:**
1. ✅ Criar `src/middleware.ts`
   - Interceptar todas as requisições `/api/*`
   - Verificar token/session
   - Retornar 401 se não autenticado

2. ✅ Criar `src/lib/auth.ts`
   - Helper `getAuthenticatedUser()`
   - Helper `requireAuth()`
   - Integrar com NextAuth

3. ✅ Proteger rotas privadas
   - `/api/avaliacoes/*` - requer auth
   - `/api/humor/*` - requer auth
   - `/api/favoritos/*` - requer auth
   - `/api/relatorios/*` - requer auth específica

4. ✅ Criar rotas públicas
   - `/api/auth/*` - público
   - `/api/professores` (GET) - público
   - `/api/aulas` (GET) - público

**Entregáveis:**
- [x] `src/middleware.ts`
- [x] `src/lib/auth.ts`
- [x] Todas APIs protegidas
- [x] Testes de autenticação

---

### **SPRINT 1.3 - Sistema de Permissões (RBAC)** ⏱️ 3-4 horas

#### **Tasks:**
1. ✅ Criar `src/lib/permissions.ts`
   ```typescript
   // Definir permissões por role
   const PERMISSIONS = {
     ALUNO: ['read:avaliacoes', 'create:avaliacoes', 'update:own_avaliacoes'],
     PROFESSOR: ['read:relatorios', 'read:avaliacoes'],
     ADMIN: ['*']
   }
   ```

2. ✅ Criar helper `checkPermission()`
   ```typescript
   function checkPermission(user, action, resource) {
     // Verificar se user.role tem permissão
   }
   ```

3. ✅ Adicionar em cada endpoint
   - Verificar se usuário tem permissão
   - Retornar 403 se não autorizado
   - Logs de tentativas não autorizadas

4. ✅ Regras específicas
   - Aluno só edita próprias avaliações
   - Professor vê relatórios de suas aulas
   - Admin acesso total

**Entregáveis:**
- [x] `src/lib/permissions.ts`
- [x] Helper `checkPermission()`
- [x] APIs com verificação de permissão
- [x] Documentação de permissões

---

### **SPRINT 1.4 - Validações de Segurança** ⏱️ 2-3 horas

#### **Tasks:**
1. ✅ Adicionar sanitização de HTML
   ```bash
   npm install sanitize-html
   ```
   - Sanitizar campo `feedback` em avaliações
   - Sanitizar campo `observacao` em humor

2. ✅ Adicionar rate limiting
   ```bash
   npm install next-rate-limit
   ```
   - 100 req/min para rotas GET
   - 20 req/min para rotas POST/PUT/DELETE
   - 5 req/min para login

3. ✅ Configurar CORS
   - Adicionar em `next.config.ts`
   - Permitir apenas domínios específicos
   - Bloquear em produção

4. ✅ Validar tamanhos
   - Feedback: max 1000 chars
   - Observação: max 500 chars
   - Títulos: max 255 chars

**Entregáveis:**
- [x] Sanitização implementada
- [x] Rate limiting configurado
- [x] CORS configurado
- [x] Validações de tamanho

---

## 📋 **FASE 2 - MELHORIAS IMPORTANTES (PRÓXIMA SEMANA)**

### **SPRINT 2.1 - Testes Automatizados** ⏱️ 1-2 dias

#### **Tasks:**
1. ✅ Configurar ambiente de testes
   ```bash
   npm install -D jest @testing-library/react @testing-library/jest-dom
   npm install -D supertest
   ```

2. ✅ Criar testes unitários
   - `__tests__/api/usuarios.test.ts`
   - `__tests__/api/avaliacoes.test.ts`
   - `__tests__/api/humor.test.ts`
   - Coverage mínimo: 70%

3. ✅ Criar testes de integração
   - Fluxo completo: cadastro → login → avaliar aula
   - Fluxo de humor: registrar → alertas
   - Fluxo de relatórios: gerar → exportar

4. ✅ CI/CD com GitHub Actions
   - `.github/workflows/test.yml`
   - Rodar testes em cada PR
   - Bloquear merge se testes falharem

**Entregáveis:**
- [x] Suite de testes completa
- [x] Coverage report
- [x] CI/CD configurado

---

### **SPRINT 2.2 - Documentação Swagger** ⏱️ 1 dia

#### **Tasks:**
1. ✅ Instalar swagger
   ```bash
   npm install next-swagger-doc swagger-ui-react
   ```

2. ✅ Criar `/api/docs/route.ts`
   - Gerar spec OpenAPI
   - Servir Swagger UI

3. ✅ Documentar cada endpoint
   - Parâmetros
   - Responses
   - Exemplos
   - Schemas

4. ✅ Publicar documentação
   - Hospedar em `/api-docs`
   - README com link

**Entregáveis:**
- [x] Swagger UI acessível
- [x] Todas APIs documentadas
- [x] Exemplos de uso

---

### **SPRINT 2.3 - Logging & Monitoring** ⏱️ 1 dia

#### **Tasks:**
1. ✅ Integrar Sentry
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

2. ✅ Configurar Winston
   ```bash
   npm install winston
   ```
   - Logs estruturados
   - Níveis: error, warn, info, debug
   - Rotação de logs

3. ✅ Adicionar tracking
   - Request ID único
   - Tempo de resposta
   - Erros capturados
   - Métricas de uso

**Entregáveis:**
- [x] Sentry integrado
- [x] Logs estruturados
- [x] Dashboard de métricas

---

## 📋 **FASE 3 - FEATURES ADICIONAIS (OPCIONAL)**

### **SPRINT 3.1 - Sistema de Notificações** ⏱️ 2-3 dias

#### **Tasks:**
1. ✅ Criar modelo no Prisma
   ```prisma
   model Notificacao {
     id        Int      @id @default(autoincrement())
     usuarioId Int
     tipo      TipoNotificacao
     titulo    String
     mensagem  String
     lida      Boolean  @default(false)
     link      String?
     createdAt DateTime @default(now())
     usuario   Usuario  @relation(...)
   }
   
   enum TipoNotificacao {
     NOVA_AULA
     LEMBRETE_HUMOR
     FEEDBACK_PROFESSOR
     ALERTA_HUMOR_BAIXO
     CONQUISTA
   }
   ```

2. ✅ Criar API completa
   - GET `/api/notificacoes`
   - POST `/api/notificacoes`
   - PUT `/api/notificacoes/[id]/lida`
   - DELETE `/api/notificacoes/[id]`

3. ✅ Sistema de disparo
   - Trigger automático após avaliação
   - Lembrete diário de humor (cron job)
   - Alerta para professores (humor baixo)

4. ✅ WebSocket (opcional)
   - Notificações em tempo real
   - Socket.io integration

**Entregáveis:**
- [x] API notificações
- [x] Sistema de triggers
- [x] WebSocket (opcional)

---

### **SPRINT 3.2 - Upload de Arquivos** ⏱️ 2 dias

#### **Tasks:**
1. ✅ Integrar Cloudinary
   ```bash
   npm install cloudinary next-cloudinary
   ```

2. ✅ Criar API upload
   - POST `/api/upload/avatar`
   - POST `/api/upload/anexo`
   - DELETE `/api/upload/[id]`

3. ✅ Validações
   - Tipos: jpg, png, pdf, docx
   - Tamanho max: 5MB
   - Scan de vírus (opcional)

4. ✅ Otimizações
   - Resize automático de imagens
   - Compression
   - CDN delivery

**Entregáveis:**
- [x] API upload funcional
- [x] Integração com Cloudinary
- [x] Validações e otimizações

---

### **SPRINT 3.3 - Cache Redis** ⏱️ 1-2 dias

#### **Tasks:**
1. ✅ Configurar Redis
   ```bash
   npm install ioredis
   ```

2. ✅ Criar helper de cache
   ```typescript
   // src/lib/cache.ts
   async function getCached<T>(key, ttl, fallback) {
     // Check cache → fallback → save cache
   }
   ```

3. ✅ Cachear queries pesadas
   - `/api/avaliacoes/stats` - 5 min
   - `/api/humor/stats` - 5 min
   - `/api/relatorios` - 10 min
   - `/api/calendario` - 1 hora

4. ✅ Invalidação de cache
   - Ao criar/editar avaliação
   - Ao registrar humor
   - Ao criar evento

**Entregáveis:**
- [x] Redis configurado
- [x] Cache implementado
- [x] Invalidação automática

---

## 📊 **CRONOGRAMA ESTIMADO**

### **Semana 1 (Dias 1-3): FASE 1**
- ✅ Dia 1: API Favoritos + Middleware Auth (6-8h)
- ✅ Dia 2: RBAC + Validações Segurança (5-7h)
- ✅ Dia 3: Testes básicos + Revisão (4-6h)

### **Semana 2 (Dias 4-8): FASE 2**
- ✅ Dia 4-5: Testes Automatizados (12-16h)
- ✅ Dia 6: Swagger + Documentação (6-8h)
- ✅ Dia 7: Logging & Monitoring (6-8h)
- ✅ Dia 8: Revisão + Ajustes (4-6h)

### **Semana 3-4 (Opcional): FASE 3**
- ✅ Notificações: 2-3 dias
- ✅ Upload: 2 dias
- ✅ Cache: 1-2 dias

---

## ✅ **CHECKLIST DE EXECUÇÃO**

### **FASE 1 - AGORA (CRÍTICO)**
- [ ] 1.1 API Favoritos implementada
- [ ] 1.2 Middleware de Autenticação
- [ ] 1.3 Sistema de Permissões (RBAC)
- [ ] 1.4 Validações de Segurança
- [ ] Commit e push na branch `backend`

### **FASE 2 - PRÓXIMA SEMANA**
- [ ] 2.1 Testes Automatizados
- [ ] 2.2 Documentação Swagger
- [ ] 2.3 Logging & Monitoring
- [ ] Merge com `main` após testes

### **FASE 3 - OPCIONAL**
- [ ] 3.1 Sistema de Notificações
- [ ] 3.2 Upload de Arquivos
- [ ] 3.3 Cache Redis
- [ ] Deploy em produção

---

## 🎯 **META FINAL**

### **MVP (Mínimo Viável):**
- ✅ Todas APIs funcionais
- ✅ Autenticação/Autorização
- ✅ Validações de segurança
- ✅ Testes básicos

### **Produção (Completo):**
- ✅ MVP +
- ✅ Testes automatizados (70%+ coverage)
- ✅ Documentação Swagger
- ✅ Monitoring integrado
- ✅ Performance otimizada

### **Ideal (Extras):**
- ✅ Produção +
- ✅ Notificações em tempo real
- ✅ Upload de arquivos
- ✅ Cache Redis
- ✅ CI/CD completo

---

**Vamos começar a execução? 🚀**

Aguardando aprovação para iniciar FASE 1...
