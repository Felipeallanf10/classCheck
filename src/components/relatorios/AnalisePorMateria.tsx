'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DadoAvaliacao {
  id: number
  valencia: number
  ativacao: number
  estadoPrimario: string
  createdAt: string
  aula: {
    titulo: string
    materia: string
    dataHora: string
  }
}

interface AnalisePorMateriaProps {
  avaliacoes: DadoAvaliacao[]
}

export default function AnalisePorMateria({ avaliacoes }: AnalisePorMateriaProps) {
  // Agrupar por matéria
  const porMateria = avaliacoes.reduce((acc, av) => {
    const materia = av.aula.materia
    if (!acc[materia]) {
      acc[materia] = { 
        total: 0, 
        valenciaSum: 0, 
        ativacaoSum: 0,
        estados: {} as Record<string, number>
      }
    }
    acc[materia].total++
    acc[materia].valenciaSum += av.valencia
    acc[materia].ativacaoSum += av.ativacao
    acc[materia].estados[av.estadoPrimario] = (acc[materia].estados[av.estadoPrimario] || 0) + 1
    return acc
  }, {} as Record<string, { 
    total: number, 
    valenciaSum: number, 
    ativacaoSum: number,
    estados: Record<string, number>
  }>)

  // Preparar dados para gráfico
  const dadosGrafico = Object.entries(porMateria).map(([materia, dados]) => ({
    materia: materia.length > 15 ? materia.substring(0, 15) + '...' : materia,
    materiaCompleta: materia,
    valencia: Number((dados.valenciaSum / dados.total).toFixed(2)),
    ativacao: Number((dados.ativacaoSum / dados.total).toFixed(2)),
    total: dados.total,
    estados: dados.estados,
    estadoMaisFrequente: Object.entries(dados.estados).sort(([,a], [,b]) => b - a)[0]
  })).sort((a, b) => b.valencia - a.valencia) // Ordenar por valência (melhor primeiro)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm mb-2">{data.materiaCompleta}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span>Valência média:</span>
              <span className="font-semibold text-blue-600">
                {data.valencia > 0 ? '+' : ''}{data.valencia}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Ativação média:</span>
              <span className="font-semibold text-purple-600">
                {data.ativacao > 0 ? '+' : ''}{data.ativacao}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Total de aulas:</span>
              <span className="font-semibold">{data.total}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Estado mais comum:</span>
              <span className="font-semibold text-green-600">{data.estadoMaisFrequente[0]}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Função para determinar cor baseada em valência
  const getCorValencia = (valencia: number) => {
    if (valencia > 0.5) return '#10b981' // Verde forte
    if (valencia > 0.2) return '#84cc16' // Verde claro
    if (valencia > -0.2) return '#f59e0b' // Amarelo
    if (valencia > -0.5) return '#f97316' // Laranja
    return '#ef4444' // Vermelho
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise por Matéria</CardTitle>
        <CardDescription>
          Compare seu estado emocional médio em diferentes disciplinas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Gráfico de Barras - Valência */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold mb-4">Valência Média por Matéria</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="materia" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                domain={[-1, 1]}
                ticks={[-1, -0.5, 0, 0.5, 1]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
              <Bar dataKey="valencia" name="Valência" radius={[8, 8, 0, 0]}>
                {dadosGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCorValencia(entry.valencia)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cards detalhados por matéria */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold mb-3">Detalhamento por Disciplina</h4>
          {dadosGrafico.map((materia) => {
            const valenciaEmoji = materia.valencia > 0.3 ? '😊' : materia.valencia < -0.3 ? '😢' : '😐'
            const ativacaoEmoji = materia.ativacao > 0.3 ? '⚡' : materia.ativacao < -0.3 ? '😴' : '🎯'
            
            return (
              <div key={materia.materiaCompleta} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="font-semibold text-base mb-1">{materia.materiaCompleta}</h5>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {materia.total} {materia.total === 1 ? 'aula' : 'aulas'}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {materia.estadoMaisFrequente[0]}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-3xl">{valenciaEmoji}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Valência */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Valência</span>
                      <span className="text-sm font-semibold">
                        {materia.valencia > 0 ? '+' : ''}{materia.valencia}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${((materia.valencia + 1) / 2) * 100}%`,
                          backgroundColor: getCorValencia(materia.valencia)
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {materia.valencia > 0.3 ? 'Experiência positiva' : materia.valencia < -0.3 ? 'Experiência negativa' : 'Neutro'}
                    </p>
                  </div>

                  {/* Ativação */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Ativação</span>
                      <span className="text-sm font-semibold">
                        {materia.ativacao > 0 ? '+' : ''}{materia.ativacao} {ativacaoEmoji}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all bg-purple-500"
                        style={{ 
                          width: `${((materia.ativacao + 1) / 2) * 100}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {materia.ativacao > 0.3 ? 'Alta energia' : materia.ativacao < -0.3 ? 'Baixa energia' : 'Moderado'}
                    </p>
                  </div>
                </div>

                {/* Estados emocionais */}
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Estados emocionais:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(materia.estados)
                      .sort(([,a], [,b]) => b - a)
                      .map(([estado, count]) => (
                        <Badge key={estado} variant="outline" className="text-xs">
                          {estado} ({count})
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
