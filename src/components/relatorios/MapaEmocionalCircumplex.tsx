'use client'

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts'
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

interface MapaEmocionalCircumplexProps {
  avaliacoes: DadoAvaliacao[]
}

export default function MapaEmocionalCircumplex({ avaliacoes }: MapaEmocionalCircumplexProps) {
  // Preparar dados para scatter plot
  const dadosScatter = avaliacoes.map(av => ({
    x: Number(av.valencia.toFixed(2)),
    y: Number(av.ativacao.toFixed(2)),
    estado: av.estadoPrimario,
    materia: av.aula.materia,
    titulo: av.aula.titulo,
    data: new Date(av.aula.dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }))

  // Calcular centro de massa (ponto médio)
  const centroX = dadosScatter.reduce((sum, d) => sum + d.x, 0) / dadosScatter.length
  const centroY = dadosScatter.reduce((sum, d) => sum + d.y, 0) / dadosScatter.length

  const pontoMedio = [{
    x: Number(centroX.toFixed(2)),
    y: Number(centroY.toFixed(2)),
    estado: 'Centro',
    materia: 'Média Geral',
    titulo: 'Ponto médio de todas as avaliações',
    data: 'Geral'
  }]

  // Mapear estados para cores
  const coresEstados: Record<string, string> = {
    'Animado': '#f59e0b',
    'Engajado': '#10b981',
    'Calmo': '#3b82f6',
    'Entediado': '#6366f1',
    'Frustrado': '#ef4444',
    'Ansioso': '#f97316',
    'Relaxado': '#06b6d4',
    'Satisfeito': '#84cc16',
    'Centro': '#8b5cf6'
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const cor = coresEstados[data.estado] || '#6b7280'
      
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cor }}></div>
            <p className="font-semibold text-sm">{data.estado}</p>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{data.titulo}</p>
          <p className="text-xs text-muted-foreground mb-2">{data.materia} • {data.data}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-3">
              <span>Valência:</span>
              <span className="font-semibold">{data.x > 0 ? '+' : ''}{data.x}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Ativação:</span>
              <span className="font-semibold">{data.y > 0 ? '+' : ''}{data.y}</span>
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
        <CardTitle>Mapa Emocional Circumplex</CardTitle>
        <CardDescription>
          Distribuição espacial das suas emoções no modelo circumplex de Russell (1980)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            
            {/* Eixos */}
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Valência" 
              domain={[-1, 1]}
              ticks={[-1, -0.5, 0, 0.5, 1]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Valência (Negativo ← → Positivo)', position: 'insideBottom', offset: -10, fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Ativação" 
              domain={[-1, 1]}
              ticks={[-1, -0.5, 0, 0.5, 1]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Ativação', angle: -90, position: 'insideLeft', fontSize: 12 }}
            />
            
            <ZAxis range={[100, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            
            {/* Ponto médio (destaque especial) */}
            <Scatter 
              name="Média Geral" 
              data={pontoMedio} 
              fill="#8b5cf6"
              shape="star"
            >
              {pontoMedio.map((entry, index) => (
                <Cell key={`center-${index}`} fill="#8b5cf6" strokeWidth={2} stroke="#fff" />
              ))}
            </Scatter>
            
            {/* Pontos de avaliações */}
            <Scatter 
              name="Avaliações" 
              data={dadosScatter} 
              fill="#3b82f6"
            >
              {dadosScatter.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={coresEstados[entry.estado] || '#6b7280'} 
                  fillOpacity={0.7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Legenda dos quadrantes */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border-l-4 border-orange-500">
            <p className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
              🔥 Alto Positivo
            </p>
            <p className="text-orange-700 dark:text-orange-300">
              Animado, Engajado, Entusiasmado
            </p>
          </div>
          
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
            <p className="font-semibold text-green-900 dark:text-green-100 mb-1">
              ✨ Baixo Positivo
            </p>
            <p className="text-green-700 dark:text-green-300">
              Calmo, Relaxado, Satisfeito
            </p>
          </div>
          
          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border-l-4 border-red-500">
            <p className="font-semibold text-red-900 dark:text-red-100 mb-1">
              ⚡ Alto Negativo
            </p>
            <p className="text-red-700 dark:text-red-300">
              Ansioso, Frustrado, Estressado
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              😴 Baixo Negativo
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              Entediado, Desanimado, Cansado
            </p>
          </div>
        </div>

        {/* Estatística do ponto médio */}
        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⭐</span>
            <p className="font-semibold text-purple-900 dark:text-purple-100">
              Seu Centro Emocional
            </p>
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Em média, você se posiciona em <strong>Valência: {centroX > 0 ? '+' : ''}{centroX.toFixed(2)}</strong> e <strong>Ativação: {centroY > 0 ? '+' : ''}{centroY.toFixed(2)}</strong>
            {' '}({centroX > 0.3 ? 'experiências predominantemente positivas' : centroX < -0.3 ? 'experiências predominantemente negativas' : 'experiências equilibradas'}, 
            {' '}{centroY > 0.3 ? 'com alta energia' : centroY < -0.3 ? 'com baixa energia' : 'com energia moderada'})
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
