'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

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

interface GraficoLinhaTemporalEmocionalProps {
  avaliacoes: DadoAvaliacao[]
}

export default function GraficoLinhaTemporalEmocional({ avaliacoes }: GraficoLinhaTemporalEmocionalProps) {
  // Ordenar por data (mais antigas primeiro) e preparar dados para o gráfico
  const dadosGrafico = [...avaliacoes]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((av, index) => ({
      index: index + 1,
      data: new Date(av.aula.dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      materia: av.aula.materia,
      valencia: Number(av.valencia.toFixed(2)),
      ativacao: Number(av.ativacao.toFixed(2)),
      estadoPrimario: av.estadoPrimario,
      titulo: av.aula.titulo
    }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm mb-1">{data.titulo}</p>
          <p className="text-xs text-muted-foreground mb-2">{data.materia} • {data.data}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs">Valência:</span>
              <span className="font-semibold text-blue-600">{data.valencia > 0 ? '+' : ''}{data.valencia}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs">Ativação:</span>
              <span className="font-semibold text-purple-600">{data.ativacao > 0 ? '+' : ''}{data.ativacao}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs">Estado:</span>
              <span className="font-semibold text-green-600">{data.estadoPrimario}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Temporal</CardTitle>
        <CardDescription>
          Como sua valência e ativação emocional mudaram ao longo das aulas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dadosGrafico} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="data" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              domain={[-1, 1]} 
              ticks={[-1, -0.5, 0, 0.5, 1]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            
            {/* Linha de Valência */}
            <Line 
              type="monotone" 
              dataKey="valencia" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6 }}
              name="Valência (Positivo/Negativo)"
            />
            
            {/* Linha de Ativação */}
            <Line 
              type="monotone" 
              dataKey="ativacao" 
              stroke="#a855f7" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#a855f7' }}
              activeDot={{ r: 6 }}
              name="Ativação (Energia)"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Legenda explicativa */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100">Valência</p>
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                Positivo (+1) = experiências agradáveis<br />
                Negativo (-1) = experiências desagradáveis
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-purple-900 dark:text-purple-100">Ativação</p>
              <p className="text-purple-700 dark:text-purple-300 text-xs">
                Alta (+1) = energia, alerta, excitação<br />
                Baixa (-1) = calma, relaxamento, sonolência
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
