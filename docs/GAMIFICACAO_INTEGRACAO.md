# 🎮 Sistema de Gamificação - Guia de Integração

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Integração em Formulários de Avaliação](#integração-em-formulários-de-avaliação)
3. [Exibição de Perfil de Gamificação](#exibição-de-perfil-de-gamificação)
4. [Exibição do Ranking Top 3](#exibição-do-ranking-top-3)
5. [Configuração de Ranking (Admin)](#configuração-de-ranking-admin)
6. [Exemplos Práticos](#exemplos-práticos)

---

## 🎯 Visão Geral

O sistema de gamificação do ClassCheck permite:
- **Ganho de XP** ao avaliar aulas
- **Sistema de níveis** baseado em XP acumulado
- **Streaks** para incentivar uso diário
- **Ranking Top 3** com bônus nas notas
- **Multiplicadores** de XP por comportamentos positivos

---

## 📝 Integração em Formulários de Avaliação

### Exemplo: Formulário de Avaliação Completa

```tsx
'use client'

import { useState } from 'react'
import { useGamificacao } from '@/hooks/useGamificacao'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FormularioAvaliacaoCompleta({ 
  aulaId, 
  usuarioId 
}: { 
  aulaId: number
  usuarioId: number 
}) {
  const [avaliacao, setAvaliacao] = useState({
    humor: 5,
    compreensao: 5,
    interesse: 5,
    comentario: '',
  })
  const [enviando, setEnviando] = useState(false)
  
  // Hook de gamificação
  const { registrarAvaliacaoCompleta } = useGamificacao(usuarioId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)

    try {
      // 1. Salva a avaliação no banco
      const response = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aulaId,
          usuarioId,
          ...avaliacao,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar avaliação')
      }

      // 2. Registra XP pela avaliação completa
      // Isso mostrará automaticamente notificações de XP ganho
      await registrarAvaliacaoCompleta(aulaId)

      // 3. Redireciona ou mostra mensagem de sucesso
      // A notificação de XP já foi exibida pelo hook
      
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Avaliar Aula</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Campos de avaliação */}
          <div>
            <label>Como você se sentiu? (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={avaliacao.humor}
              onChange={(e) =>
                setAvaliacao({ ...avaliacao, humor: parseInt(e.target.value) })
              }
            />
          </div>

          <div>
            <label>Nível de compreensão (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={avaliacao.compreensao}
              onChange={(e) =>
                setAvaliacao({
                  ...avaliacao,
                  compreensao: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label>Comentários</label>
            <textarea
              value={avaliacao.comentario}
              onChange={(e) =>
                setAvaliacao({ ...avaliacao, comentario: e.target.value })
              }
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={enviando} className="w-full">
            {enviando ? 'Enviando...' : 'Enviar Avaliação e Ganhar XP 🎯'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            💡 Você ganhará 100 XP por esta avaliação completa!
          </p>
        </CardContent>
      </Card>
    </form>
  )
}
```

### Exemplo: Avaliação Rápida (Apenas Humor)

```tsx
'use client'

import { useState } from 'react'
import { useGamificacao } from '@/hooks/useGamificacao'
import { Button } from '@/components/ui/button'

const EMOCOES = [
  { valor: 1, emoji: '😢', label: 'Muito Triste' },
  { valor: 2, emoji: '😕', label: 'Triste' },
  { valor: 3, emoji: '😐', label: 'Neutro' },
  { valor: 4, emoji: '🙂', label: 'Feliz' },
  { valor: 5, emoji: '😄', label: 'Muito Feliz' },
]

export default function AvaliacaoRapida({ 
  aulaId, 
  usuarioId 
}: { 
  aulaId: number
  usuarioId: number 
}) {
  const [humorSelecionado, setHumorSelecionado] = useState<number | null>(null)
  const { registrarAvaliacaoRapida } = useGamificacao(usuarioId)

  async function handleAvaliar(humor: number) {
    setHumorSelecionado(humor)

    try {
      // 1. Salva avaliação rápida
      await fetch('/api/avaliacoes/rapida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aulaId, usuarioId, humor }),
      })

      // 2. Registra XP (50 XP para avaliação rápida)
      await registrarAvaliacaoRapida(aulaId)
      
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {EMOCOES.map((emocao) => (
        <Button
          key={emocao.valor}
          variant={humorSelecionado === emocao.valor ? 'default' : 'outline'}
          onClick={() => handleAvaliar(emocao.valor)}
          className="text-3xl"
          title={emocao.label}
        >
          {emocao.emoji}
        </Button>
      ))}
    </div>
  )
}
```

---

## 👤 Exibição de Perfil de Gamificação

### Página de Perfil do Aluno

```tsx
// src/app/perfil/[usuarioId]/page.tsx
import PerfilGamificacao from '@/components/gamificacao/PerfilGamificacao'

export default function PaginaPerfil({ 
  params 
}: { 
  params: { usuarioId: string } 
}) {
  const usuarioId = parseInt(params.usuarioId)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      
      {/* Componente de Gamificação */}
      <PerfilGamificacao usuarioId={usuarioId} />
    </div>
  )
}
```

---

## 🏆 Exibição do Ranking Top 3

### Na Dashboard Principal

```tsx
// src/app/dashboard/page.tsx
import RankingTop3 from '@/components/gamificacao/RankingTop3'

export default function Dashboard() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outras informações da dashboard */}
        <div className="lg:col-span-2">
          {/* Conteúdo principal */}
        </div>

        {/* Ranking na sidebar */}
        <div>
          <RankingTop3 
            configuracaoId={1} 
            turma="Turma A - Matemática" 
          />
        </div>
      </div>
    </div>
  )
}
```

### Na Página de Gamificação

```tsx
// src/app/gamificacao/page.tsx
import RankingTop3 from '@/components/gamificacao/RankingTop3'
import PerfilGamificacao from '@/components/gamificacao/PerfilGamificacao'

export default function PaginaGamificacao({ 
  searchParams 
}: { 
  searchParams: { usuarioId: string } 
}) {
  const usuarioId = parseInt(searchParams.usuarioId || '1')

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">🎮 Gamificação</h1>

      {/* Ranking Top 3 */}
      <RankingTop3 configuracaoId={1} />

      {/* Perfil do Usuário */}
      <PerfilGamificacao usuarioId={usuarioId} />
    </div>
  )
}
```

---

## ⚙️ Configuração de Ranking (Admin)

### Página de Configuração para Coordenadores

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function ConfiguracaoRanking({ adminId }: { adminId: number }) {
  const [config, setConfig] = useState({
    periodoCalculo: 'SEMANAL',
    bonusPrimeiroLugar: 0.3,
    bonusSegundoLugar: 0.2,
    bonusTerceiroLugar: 0.1,
    minimoAvaliacoes: 5,
    aplicarAutomaticamente: true,
    notificarAlunos: true,
    visibilidadeRanking: 'PUBLICO',
  })

  async function handleSalvar() {
    try {
      const response = await fetch('/api/gamificacao/configuracao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          criadoPorId: adminId,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar configuração')
      }

      toast.success('Configuração salva com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar configuração')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>⚙️ Configurar Ranking e Bônus</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Período de Cálculo</Label>
          <Select
            value={config.periodoCalculo}
            onValueChange={(value) =>
              setConfig({ ...config, periodoCalculo: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SEMANAL">Semanal</SelectItem>
              <SelectItem value="MENSAL">Mensal</SelectItem>
              <SelectItem value="BIMESTRAL">Bimestral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Bônus 1º Lugar</Label>
            <Input
              type="number"
              step="0.1"
              value={config.bonusPrimeiroLugar}
              onChange={(e) =>
                setConfig({
                  ...config,
                  bonusPrimeiroLugar: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div>
            <Label>Bônus 2º Lugar</Label>
            <Input
              type="number"
              step="0.1"
              value={config.bonusSegundoLugar}
              onChange={(e) =>
                setConfig({
                  ...config,
                  bonusSegundoLugar: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div>
            <Label>Bônus 3º Lugar</Label>
            <Input
              type="number"
              step="0.1"
              value={config.bonusTerceiroLugar}
              onChange={(e) =>
                setConfig({
                  ...config,
                  bonusTerceiroLugar: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div>
          <Label>Mínimo de Avaliações</Label>
          <Input
            type="number"
            value={config.minimoAvaliacoes}
            onChange={(e) =>
              setConfig({
                ...config,
                minimoAvaliacoes: parseInt(e.target.value),
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Aplicar bônus automaticamente</Label>
          <Switch
            checked={config.aplicarAutomaticamente}
            onCheckedChange={(checked) =>
              setConfig({ ...config, aplicarAutomaticamente: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Notificar alunos</Label>
          <Switch
            checked={config.notificarAlunos}
            onCheckedChange={(checked) =>
              setConfig({ ...config, notificarAlunos: checked })
            }
          />
        </div>

        <Button onClick={handleSalvar} className="w-full">
          Salvar Configuração
        </Button>
      </CardContent>
    </Card>
  )
}
```

---

## 🔧 Exemplos Práticos

### 1. Adicionar Widget de XP em Cards de Aula

```tsx
import { Badge } from '@/components/ui/badge'

export function CardAula({ aula }: { aula: any }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <h3>{aula.titulo}</h3>
        <Badge variant="secondary">
          +100 XP 🎯
        </Badge>
      </div>
      {/* Resto do card */}
    </div>
  )
}
```

### 2. Mostrar Progresso de Nível na Navbar

```tsx
'use client'

import { useGamificacao } from '@/hooks/useGamificacao'
import { Progress } from '@/components/ui/progress'

export function NavbarUsuario({ usuarioId }: { usuarioId: number }) {
  const { perfil } = useGamificacao(usuarioId)

  if (!perfil) return null

  return (
    <div className="flex items-center gap-3">
      <div>
        <p className="text-sm font-medium">Nível {perfil.nivel}</p>
        <Progress value={perfil.progresso} className="w-20 h-2" />
      </div>
      <span className="text-xs text-muted-foreground">
        {perfil.xpAtual}/{perfil.xpProximoNivel} XP
      </span>
    </div>
  )
}
```

### 3. Notificação de Streak

```tsx
'use client'

import { useEffect } from 'react'
import { useGamificacao } from '@/hooks/useGamificacao'
import { toast } from 'sonner'

export function StreakNotification({ usuarioId }: { usuarioId: number }) {
  const { perfil } = useGamificacao(usuarioId)

  useEffect(() => {
    if (perfil && perfil.streakAtual >= 5) {
      toast.success(`🔥 Você está em um streak de ${perfil.streakAtual} dias!`, {
        description: 'Continue avaliando aulas para manter seu streak ativo',
      })
    }
  }, [perfil?.streakAtual])

  return null
}
```

---

## 📚 Recursos Adicionais

### Hooks Disponíveis
- `useGamificacao(usuarioId)` - Hook principal para gerenciar XP

### Componentes Disponíveis
- `<RankingTop3 />` - Exibe Top 3 do ranking
- `<PerfilGamificacao />` - Exibe perfil completo do usuário

### API Routes
- `POST /api/gamificacao/xp` - Adicionar XP
- `GET /api/gamificacao/perfil/[usuarioId]` - Buscar perfil
- `GET /api/gamificacao/historico/[usuarioId]` - Buscar histórico
- `GET /api/gamificacao/ranking` - Buscar Top 3
- `POST /api/gamificacao/ranking` - Calcular ranking
- `GET/POST /api/gamificacao/configuracao` - Gerenciar configurações

---

## ✅ Checklist de Integração

- [ ] Adicionar registro de XP em formulários de avaliação
- [ ] Exibir perfil de gamificação na página do usuário
- [ ] Mostrar ranking Top 3 na dashboard
- [ ] Configurar página de administração para coordenadores
- [ ] Adicionar badges de XP em cards de aula
- [ ] Implementar notificações de ganho de XP
- [ ] Testar multiplicadores e streaks
- [ ] Configurar período de ranking (semanal/mensal/bimestral)

---

**Pronto!** O sistema de gamificação está completo e pronto para uso. 🎉
