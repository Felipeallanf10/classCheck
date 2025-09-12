'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, TrendingUp, BarChart3 } from 'lucide-react'

interface HistoricoAvaliacao {
  id: string
  data: string
  hora: string
  estadoEmocional: string
  valencia: number
  ativacao: number
  confianca: number
  observacoes?: string
}

export default function HistoricoQuestionarioPage() {
  const [historico, setHistorico] = useState<HistoricoAvaliacao[]>([])

  useEffect(() => {
    // Simular dados de histórico
    const dadosSimulados: HistoricoAvaliacao[] = [
      {
        id: '1',
        data: '2025-09-07',
        hora: '14:30',
        estadoEmocional: 'Focado',
        valencia: 0.3,
        ativacao: 0.6,
        confianca: 0.85,
        observacoes: 'Boa concentração durante a aula de matemática'
      },
      {
        id: '2',
        data: '2025-09-06',
        hora: '10:15',
        estadoEmocional: 'Ansioso',
        valencia: -0.4,
        ativacao: 0.7,
        confianca: 0.78,
        observacoes: 'Apresentação oral causou nervosismo'
      },
      {
        id: '3',
        data: '2025-09-05',
        hora: '16:45',
        estadoEmocional: 'Feliz',
        valencia: 0.8,
        ativacao: 0.4,
        confianca: 0.92,
        observacoes: 'Atividade em grupo bem-sucedida'
      },
      {
        id: '4',
        data: '2025-09-04',
        hora: '11:20',
        estadoEmocional: 'Cansado',
        valencia: -0.2,
        ativacao: -0.6,
        confianca: 0.74,
        observacoes: 'Falta de sono afetou o desempenho'
      }
    ]
    setHistorico(dadosSimulados)
  }, [])

  const getEstadoBadgeColor = (estado: string) => {
    const cores: Record<string, string> = {
      'Feliz': 'bg-green-100 text-green-800',
      'Focado': 'bg-blue-100 text-blue-800',
      'Ansioso': 'bg-orange-100 text-orange-800',
      'Cansado': 'bg-gray-100 text-gray-800',
      'Triste': 'bg-purple-100 text-purple-800'
    }
    return cores[estado] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Histórico de Avaliações</h1>
          <p className="text-muted-foreground">
            Acompanhe sua evolução socioemocional ao longo do tempo
          </p>
        </div>
        <Button>
          <BarChart3 className="mr-2 h-4 w-4" />
          Ver Análise Completa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {historico.map((avaliacao) => (
          <Card key={avaliacao.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge className={getEstadoBadgeColor(avaliacao.estadoEmocional)}>
                  {avaliacao.estadoEmocional}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Confiança: {Math.round(avaliacao.confianca * 100)}%
                </div>
              </div>
              <CardTitle className="text-lg">{avaliacao.estadoEmocional}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {avaliacao.hora}
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Valência:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${((avaliacao.valencia + 1) / 2) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Ativação:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${((avaliacao.ativacao + 1) / 2) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                {avaliacao.observacoes && (
                  <div className="text-sm text-muted-foreground p-2 bg-gray-50 rounded">
                    {avaliacao.observacoes}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {historico.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma avaliação encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Comece fazendo sua primeira avaliação socioemocional
            </p>
            <Button>Fazer Avaliação</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
