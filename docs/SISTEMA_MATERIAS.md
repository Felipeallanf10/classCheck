# Sistema de Gerenciamento de Matérias

## 📚 Visão Geral

Sistema completo para gerenciar matérias disponíveis para professores, com cadastro, edição e seleção facilitada.

## ✨ Funcionalidades Implementadas

### 1. **Modelo de Dados**
- Tabela `materias` no banco de dados
- Campos: id, nome (único), descrição, ativa, createdAt, updatedAt
- Soft delete (desativação em vez de exclusão)

### 2. **API de Gerenciamento**

#### GET `/api/admin/materias`
- Lista todas as matérias
- Query param: `?ativas=true` para listar apenas ativas
- Retorna lista ordenada alfabeticamente
- **Acesso:** ADMIN apenas

#### POST `/api/admin/materias`
- Cria nova matéria
- Valida nome único
- **Acesso:** ADMIN apenas

#### PATCH `/api/admin/materias/[id]`
- Atualiza matéria existente
- Valida nome único ao alterar
- **Acesso:** ADMIN apenas

#### DELETE `/api/admin/materias/[id]`
- Desativa matéria (soft delete)
- **Acesso:** ADMIN apenas

### 3. **Página Admin - Gerenciar Matérias**
**Rota:** `/admin/materias`

**Recursos:**
- ✅ Listagem completa de matérias
- ✅ Estatísticas (Total, Ativas, Inativas)
- ✅ Criar nova matéria com modal
- ✅ Editar matéria existente
- ✅ Desativar matéria
- ✅ Campo de descrição opcional
- ✅ Status ativo/inativo com badges visuais

### 4. **Integração na Página de Usuários**
**Rota:** `/admin/usuarios`

**Melhorias:**
- ✅ Select com lista de matérias ativas ao invés de input de texto
- ✅ Opção "Cadastrar nova matéria" no próprio select
- ✅ Modal inline para criar matéria sem sair da página
- ✅ Atualização automática da lista após criar nova matéria
- ✅ Seleção automática da matéria recém-criada

**Fluxo de Uso:**
1. Admin seleciona role "PROFESSOR"
2. Aparece select de matérias
3. Admin pode:
   - Escolher matéria existente da lista
   - Clicar em "Cadastrar nova matéria"
   - Digitar nome da nova matéria inline
   - Pressionar Enter ou clicar em "Criar"
4. Nova matéria é criada e automaticamente selecionada
5. Admin finaliza cadastro do professor

## 📋 Matérias Iniciais (Seed)

14 matérias pré-cadastradas:
- Matemática
- Português
- História
- Geografia
- Ciências
- Biologia
- Física
- Química
- Inglês
- Espanhol
- Educação Física
- Artes
- Filosofia
- Sociologia

**Executar seed:**
```bash
node prisma/seed-materias.js
```

## 🎯 Benefícios

### Para o Admin:
- ✅ Controle centralizado de matérias
- ✅ Padronização de nomenclatura
- ✅ Evita duplicatas e variações
- ✅ Facilita relatórios e filtros
- ✅ Cadastro rápido sem sair do fluxo

### Para o Sistema:
- ✅ Dados consistentes
- ✅ Facilita queries e agregações
- ✅ Possibilita futuras features (ex: relatórios por matéria)
- ✅ Relacionamentos mais robustos

## 🔐 Segurança

- ✅ Todas as rotas protegidas com `checkRole(['ADMIN'])`
- ✅ Validação de nome único
- ✅ Soft delete preserva dados históricos
- ✅ Apenas matérias ativas aparecem no cadastro de professores

## 🚀 Próximos Passos (Opcional)

1. **Relatórios por Matéria:**
   - Dashboard com quantidade de professores por matéria
   - Matérias mais populares

2. **Filtros Avançados:**
   - Filtrar usuários por matéria na página de professores
   - Busca de turmas por matéria

3. **Histórico:**
   - Log de alterações de matérias
   - Auditoria de quem criou/editou

4. **Importação:**
   - Upload CSV para cadastro em lote
   - Sincronização com sistema externo

## 📝 Notas Técnicas

- Modelo usa `@unique` no campo nome para garantir unicidade no banco
- Soft delete mantém integridade referencial
- Select carrega apenas matérias ativas para evitar confusão
- Toast notifications em todas as operações
- Loading states e error handling completos
