# 🚀 PRÓXIMOS PASSOS - ClassCheck

Guia sequencial para implementar as funcionalidades essenciais.

## 📋 **FASE 1: INTEGRAÇÃO COM BANCO DE DADOS (Prioridade 1)**

### 1.1 Instalar Dependências do Prisma
```bash
# No container
docker-compose exec app npm install @prisma/client prisma zod

# Ou rebuild completo
docker-compose down
docker-compose up -d --build
```

### 1.2 Configurar Prisma
```bash
# Gerar cliente Prisma
docker-compose exec app npx prisma generate

# Criar primeira migração
docker-compose exec app npx prisma migrate dev --name init

# Verificar se funciona
docker-compose exec app npx prisma studio
```

### 1.3 Criar Lib Prisma
Criar arquivo `src/lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## 🎯 **FASE 2: APIs REST (Prioridade 2)**

### 2.1 Criar API Routes
```
src/app/api/
├── usuarios/
│   ├── route.ts          # GET /api/usuarios, POST /api/usuarios
│   └── [id]/route.ts     # GET, PUT, DELETE /api/usuarios/[id]
├── aulas/
│   ├── route.ts          # GET /api/aulas, POST /api/aulas
│   └── [id]/route.ts     # GET, PUT, DELETE /api/aulas/[id]
├── avaliacoes/
│   ├── route.ts          # GET /api/avaliacoes, POST /api/avaliacoes
│   └── [id]/route.ts     # CRUD avaliacoes
└── humor/
    ├── route.ts          # GET /api/humor, POST /api/humor
    └── dashboard/route.ts # GET /api/humor/dashboard
```

### 2.2 Exemplo API de Usuários
```typescript
// src/app/api/usuarios/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createUserSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['ALUNO', 'PROFESSOR', 'ADMIN']).default('ALUNO')
})

export async function GET() {
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, nome: true, email: true, role: true }
  })
  return NextResponse.json(usuarios)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createUserSchema.parse(body)
    
    const usuario = await prisma.usuario.create({ data })
    return NextResponse.json(usuario, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }
}
```

## 🎨 **FASE 3: ATUALIZAR COMPONENTES (Prioridade 3)**

### 3.1 Integrar Dados Reais nos Componentes
Substituir dados mockados por dados do banco:

```typescript
// src/components/GraficoHumor.tsx
'use client'

import { useEffect, useState } from 'react'
import { ChartData } from '@/types'

export function GraficoHumor() {
  const [data, setData] = useState<ChartData[]>([])

  useEffect(() => {
    fetch('/api/humor/dashboard')
      .then(res => res.json())
      .then(setData)
  }, [])

  // Resto do componente...
}
```

### 3.2 Criar Custom Hooks
```typescript
// src/hooks/useHumor.ts
import { useState, useEffect } from 'react'
import { TipoHumor } from '@prisma/client'

export function useHumor() {
  const [humor, setHumor] = useState<TipoHumor[]>([])

  const registrarHumor = async (novoHumor: TipoHumor) => {
    const response = await fetch('/api/humor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ humor: novoHumor })
    })
    
    if (response.ok) {
      // Atualizar estado...
    }
  }

  return { humor, registrarHumor }
}
```

## 🔐 **FASE 4: AUTENTICAÇÃO (Prioridade 4)**

### 4.1 Configurar NextAuth
```bash
docker-compose exec app npm install next-auth @auth/prisma-adapter
```

### 4.2 Configurar Provider
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google, GitHub, etc...
  ],
  session: { strategy: 'jwt' },
})

export { handler as GET, handler as POST }
```

## 🧪 **FASE 5: TESTES (Prioridade 5)**

### 5.1 Configurar Jest
```bash
docker-compose exec app npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### 5.2 Criar Testes
```typescript
// src/__tests__/components/GraficoHumor.test.tsx
import { render, screen } from '@testing-library/react'
import { GraficoHumor } from '@/components/GraficoHumor'

describe('GraficoHumor', () => {
  it('renderiza título corretamente', () => {
    render(<GraficoHumor />)
    expect(screen.getByText('Variação de Humor')).toBeInTheDocument()
  })
})
```

## 📱 **FASE 6: PWA & DEPLOYMENT (Prioridade 6)**

### 6.1 Configurar PWA
```bash
docker-compose exec app npm install next-pwa
```

### 6.2 Deploy no Vercel
```bash
# Conectar repositório no Vercel
# Configurar variáveis de ambiente
# DATABASE_URL com PlanetScale ou Railway
```

## 📊 **CHECKLIST DE PROGRESSO**

### Fase 1: Banco de Dados
- [x] Prisma instalado e configurado
- [x] Schema definido
- [x] Migrações executadas  
- [x] Prisma Studio funcionando
- [x] Cliente Prisma configurado
- [x] Seed executado com sucesso

### Fase 2: APIs
- [x] API de usuários
- [ ] API de aulas
- [ ] API de avaliações
- [ ] API de humor
- [x] Validação com Zod

### Fase 3: Frontend
- [ ] Componentes integrados com APIs
- [ ] Custom hooks criados
- [ ] Estados gerenciados
- [ ] Loading states
- [ ] Error handling

### Fase 4: Auth
- [ ] NextAuth configurado
- [ ] Login/Logout funcionando
- [ ] Proteção de rotas
- [ ] Sessões persistentes

### Fase 5: Testes
- [ ] Jest configurado
- [ ] Testes de componentes
- [ ] Testes de APIs
- [ ] Coverage > 80%

### Fase 6: Deploy
- [ ] PWA configurado
- [ ] Build de produção
- [ ] Deploy no Vercel
- [ ] Banco em produção

## 🎯 **PRIMEIRO PASSO AGORA**

Execute no terminal:

```bash
# 1. Verificar se containers estão rodando
docker-compose ps

# 2. Instalar Prisma
docker-compose exec app npm install @prisma/client prisma zod

# 3. Gerar cliente
docker-compose exec app npx prisma generate

# 4. Executar migração
docker-compose exec app npx prisma migrate dev --name init

# 5. Abrir Prisma Studio
docker-compose exec app npx prisma studio
```

**URL do Prisma Studio**: http://localhost:5556

---

## 🎉 **STATUS ATUAL - FASE 1 COMPLETA!**

✅ **Concluído com sucesso:**
- Docker environment rodando (containers: app, db, phpmyadmin)
- MySQL database configurado e operacional
- Prisma ORM integrado com schema completo
- Database migrado com todas as tabelas criadas
- Seed executado - dados de teste populados
- Prisma Studio disponível em http://localhost:5556
- API `/api/usuarios` funcionando (GET/POST)

🚀 **Acesso aos serviços:**
- **Aplicação**: http://localhost:3000
- **Prisma Studio**: http://localhost:5556  
- **phpMyAdmin**: http://localhost:8080 (user: classcheck_user, pass: classcheck_pass)

## 🎯 **PRÓXIMOS PASSOS IMEDIATOS**

**1. Testar a API de usuários:**
```bash
# Listar usuários
curl http://localhost:3000/api/usuarios

# Criar novo usuário
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome": "Novo Aluno", "email": "novo@exemplo.com", "role": "ALUNO"}'
```

**2. Criar API de aulas (próximo passo):**
```bash
mkdir -p src/app/api/aulas
# Implementar CRUD de aulas
```

**Próximo:** Implementar APIs restantes (aulas, avaliações, humor) - **FASE 2**
