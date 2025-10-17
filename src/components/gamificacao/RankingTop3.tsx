'use client'

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Top3Usuario {
  posicao: number
  usuario: {
    nome: string
    email: string
    avatar: string | null
  }
  xpPeriodo: number
  xpTotal: number
  nivel: number
  bonus: number
  aplicado: boolean
}

interface RankingTop3Props {
  configuracaoId: number
  turma?: string
}

export default function RankingTop3({ configuracaoId, turma }: RankingTop3Props) {
  const [top3, setTop3] = useState<Top3Usuario[]>([])
  const [periodo, setPeriodo] = useState<'SEMANAL' | 'MENSAL' | 'BIMESTRAL'>('SEMANAL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    buscarTop3()
  }, [configuracaoId, periodo])

  async function buscarTop3() {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/gamificacao/ranking?configuracaoId=${configuracaoId}&periodo=${periodo}`
      )
      const data = await response.json()
      setTop3(data.top3 || [])
    } catch (error) {
      console.error('Erro ao buscar top 3:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIconePosicao = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />
      case 3:
        return <Award className="h-8 w-8 text-amber-700" />
      default:
        return null
    }
  }

  const getCorPosicao = (posicao: number) => {
    switch (posicao) {
      case 1:
        return 'border-yellow-500 bg-yellow-50'
      case 2:
        return 'border-gray-400 bg-gray-50'
      case 3:
        return 'border-amber-700 bg-amber-50'
      default:
        return 'border-gray-200'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            🏆 Top 3 - Ranking de XP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Carregando ranking...</p>
        </CardContent>
      </Card>
    )
  }

  if (top3.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            🏆 Top 3 - Ranking de XP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhum aluno no ranking ainda. Continue avaliando aulas para ganhar XP!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            🏆 Top 3 - Ranking de XP
          </CardTitle>
          <Select value={periodo} onValueChange={(value: 'SEMANAL' | 'MENSAL' | 'BIMESTRAL') => setPeriodo(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SEMANAL">Semanal</SelectItem>
              <SelectItem value="MENSAL">Mensal</SelectItem>
              <SelectItem value="BIMESTRAL">Bimestral</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {turma && (
          <p className="text-sm text-muted-foreground mt-2">Turma: {turma}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {top3.map((usuario) => (
            <div
              key={usuario.posicao}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${getCorPosicao(
                usuario.posicao
              )}`}
            >
              <div className="flex-shrink-0">
                {getIconePosicao(usuario.posicao)}
              </div>

              <Avatar className="h-12 w-12">
                <AvatarImage src={usuario.usuario.avatar || undefined} />
                <AvatarFallback>
                  {usuario.usuario.nome
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h4 className="font-semibold">{usuario.usuario.nome}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    Nível {usuario.nivel}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {usuario.xpPeriodo} XP no período
                  </span>
                </div>
              </div>

              <div className="text-right">
                <Badge
                  variant={usuario.aplicado ? 'default' : 'outline'}
                  className="text-sm font-bold"
                >
                  +{usuario.bonus.toFixed(1)} pts
                </Badge>
                {usuario.aplicado && (
                  <p className="text-xs text-green-600 mt-1">✓ Aplicado</p>
                )}
                {!usuario.aplicado && (
                  <p className="text-xs text-muted-foreground mt-1">Pendente</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-semibold text-sm text-blue-900 mb-2">
            💡 Como funciona o bônus?
          </h5>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• 1º lugar: +{top3[0]?.bonus.toFixed(1)} pontos nas notas</li>
            {top3[1] && (
              <li>• 2º lugar: +{top3[1].bonus.toFixed(1)} pontos nas notas</li>
            )}
            {top3[2] && (
              <li>• 3º lugar: +{top3[2].bonus.toFixed(1)} pontos nas notas</li>
            )}
            <li>• O bônus é aplicado pelo professor/coordenador</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
