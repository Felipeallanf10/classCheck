'use client'

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, TrendingUp, Flame, Award, Calendar } from "lucide-react"

interface PerfilGamificacaoData {
  xpTotal: number
  nivel: number
  xpAtual: number
  xpProximoNivel: number
  progresso: number
  streakAtual: number
  melhorStreak: number
  totalAvaliacoes: number
  avaliacoesConsecutivas: number
  usuario: {
    nome: string
    email: string
    avatar: string | null
  }
}

interface HistoricoXPItem {
  id: number
  xpGanho: number
  acao: string
  descricao: string | null
  multiplicador: number
  createdAt: string
  aula: {
    titulo: string
    materia: string
  } | null
}

interface PerfilGamificacaoProps {
  usuarioId: number
}

export default function PerfilGamificacao({ usuarioId }: PerfilGamificacaoProps) {
  const [perfil, setPerfil] = useState<PerfilGamificacaoData | null>(null)
  const [historico, setHistorico] = useState<HistoricoXPItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    buscarDados()
  }, [usuarioId])

  async function buscarDados() {
    try {
      setLoading(true)
      const [perfilRes, historicoRes] = await Promise.all([
        fetch(`/api/gamificacao/perfil/${usuarioId}`),
        fetch(`/api/gamificacao/historico/${usuarioId}?limite=10`),
      ])

      const perfilData = await perfilRes.json()
      const historicoData = await historicoRes.json()

      setPerfil(perfilData)
      setHistorico(historicoData)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !perfil) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Carregando perfil...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Card Principal do Perfil */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={perfil.usuario.avatar || undefined} />
              <AvatarFallback className="text-xl">
                {perfil.usuario.nome
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{perfil.usuario.nome}</h3>
              <p className="text-sm text-muted-foreground">{perfil.usuario.email}</p>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              <Star className="h-4 w-4 mr-1" />
              Nível {perfil.nivel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progresso de XP */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progresso para o Nível {perfil.nivel + 1}</span>
              <span className="text-muted-foreground">
                {perfil.xpAtual} / {perfil.xpProximoNivel} XP
              </span>
            </div>
            <Progress value={perfil.progresso} className="h-3" />
            <p className="text-xs text-muted-foreground text-right">
              {perfil.progresso.toFixed(1)}% completo
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">XP Total</p>
                <p className="text-lg font-bold text-blue-600">{perfil.xpTotal}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Flame className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">Streak Atual</p>
                <p className="text-lg font-bold text-orange-600">
                  {perfil.streakAtual} {perfil.streakAtual === 1 ? 'dia' : 'dias'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">Melhor Streak</p>
                <p className="text-lg font-bold text-purple-600">
                  {perfil.melhorStreak} {perfil.melhorStreak === 1 ? 'dia' : 'dias'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Avaliações</p>
                <p className="text-lg font-bold text-green-600">{perfil.totalAvaliacoes}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de XP */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📜 Histórico de XP</CardTitle>
        </CardHeader>
        <CardContent>
          {historico.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum histórico de XP ainda. Comece avaliando aulas!
            </p>
          ) : (
            <div className="space-y-3">
              {historico.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.acao.replace(/_/g, ' ')}
                      </Badge>
                      {item.multiplicador > 1 && (
                        <Badge variant="default" className="text-xs">
                          {item.multiplicador}x
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm mt-1">{item.descricao}</p>
                    {item.aula && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.aula.materia} - {item.aula.titulo}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">+{item.xpGanho} XP</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
