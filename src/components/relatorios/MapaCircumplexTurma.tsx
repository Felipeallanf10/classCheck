'use client'

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis, ReferenceLine } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AvaliacaoAluno {
  usuarioId: number
  usuarioNome: string
  usuarioAvatar: string | null
  valencia: number
  ativacao: number
  estadoPrimario: string
  confianca: number
}

interface MapaCircumplexTurmaProps {
  avaliacoes: AvaliacaoAluno[]
  aulaInfo?: {
    titulo: string
    materia: string
    dataHora: string
  }
}

export default function MapaCircumplexTurma({ avaliacoes, aulaInfo }: MapaCircumplexTurmaProps) {
  // Preparar dados para scatter plot
  const dadosScatter = avaliacoes.map(av => ({
    x: Number(av.valencia.toFixed(2)),
    y: Number(av.ativacao.toFixed(2)),
    nome: av.usuarioNome,
    avatar: av.usuarioAvatar,
    estado: av.estadoPrimario,
    confianca: av.confianca
  }))

  // Calcular centro de massa (média da turma)
  const centroX = dadosScatter.reduce((sum, d) => sum + d.x, 0) / dadosScatter.length
  const centroY = dadosScatter.reduce((sum, d) => sum + d.y, 0) / dadosScatter.length

  const pontoMedio = [{
    x: Number(centroX.toFixed(2)),
    y: Number(centroY.toFixed(2)),
    nome: 'Média da Turma',
    estado: 'Centro',
    confianca: 1
  }]

  // Cores por estado
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
            <p className="font-semibold text-sm">{data.nome}</p>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-3">
              <span>Estado:</span>
              <span className="font-semibold">{data.estado}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Valência:</span>
              <span className="font-semibold">{data.x > 0 ? '+' : ''}{data.x}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Ativação:</span>
              <span className="font-semibold">{data.y > 0 ? '+' : ''}{data.y}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Confiança:</span>
              <span className="font-semibold">{(data.confianca * 100).toFixed(0)}%</span>
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
        <CardTitle>Distribuição Emocional da Turma</CardTitle>
        <CardDescription>
          {aulaInfo ? (
            <>
              {aulaInfo.titulo} • {aulaInfo.materia} • {new Date(aulaInfo.dataHora).toLocaleDateString('pt-BR')}
            </>
          ) : (
            'Mapa circumplex mostrando onde cada aluno se posicionou emocionalmente'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            
            {/* Linhas de referência nos eixos */}
            <ReferenceLine x={0} stroke="#666" strokeWidth={2} />
            <ReferenceLine y={0} stroke="#666" strokeWidth={2} />
            
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
              label={{ value: 'Ativação (Baixa ↓ ↑ Alta)', angle: -90, position: 'insideLeft', fontSize: 12 }}
            />
            
            <ZAxis range={[150, 150]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            
            {/* Ponto médio (média da turma) */}
            <Scatter 
              name="Média da Turma" 
              data={pontoMedio} 
              fill="#8b5cf6"
              shape="star"
            >
              {pontoMedio.map((entry, index) => (
                <Cell key={`center-${index}`} fill="#8b5cf6" strokeWidth={3} stroke="#fff" />
              ))}
            </Scatter>
            
            {/* Pontos dos alunos */}
            <Scatter 
              name="Alunos" 
              data={dadosScatter} 
              fill="#3b82f6"
            >
              {dadosScatter.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={coresEstados[entry.estado] || '#6b7280'} 
                  fillOpacity={0.8}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Legenda dos quadrantes */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border-l-4 border-orange-500">
            <p className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
              🔥 Alto Positivo (+/+)
            </p>
            <p className="text-orange-700 dark:text-orange-300">
              Animado, Engajado, Entusiasmado
            </p>
          </div>
          
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
            <p className="font-semibold text-green-900 dark:text-green-100 mb-1">
              ✨ Baixo Positivo (+/-)
            </p>
            <p className="text-green-700 dark:text-green-300">
              Calmo, Relaxado, Satisfeito
            </p>
          </div>
          
          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border-l-4 border-red-500">
            <p className="font-semibold text-red-900 dark:text-red-100 mb-1">
              ⚡ Alto Negativo (-/+)
            </p>
            <p className="text-red-700 dark:text-red-300">
              Ansioso, Frustrado, Estressado
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              😴 Baixo Negativo (-/-)
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
              Centro Emocional da Turma
            </p>
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            A turma, em média, se posiciona em <strong>Valência: {centroX > 0 ? '+' : ''}{centroX.toFixed(2)}</strong> e <strong>Ativação: {centroY > 0 ? '+' : ''}{centroY.toFixed(2)}</strong>
            {' '}({centroX > 0.3 ? 'clima predominantemente positivo' : centroX < -0.3 ? 'clima predominantemente negativo' : 'clima equilibrado'}, 
            {' '}{centroY > 0.3 ? 'com alta energia' : centroY < -0.3 ? 'com baixa energia' : 'com energia moderada'})
          </p>
        </div>

        {/* Lista de alunos */}
        <div className="mt-6">
          <h4 className="font-semibold text-sm mb-3">Alunos Avaliados ({avaliacoes.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {avaliacoes.map((aluno) => {
              const cor = coresEstados[aluno.estadoPrimario] || '#6b7280'
              return (
                <div key={aluno.usuarioId} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={aluno.usuarioAvatar || undefined} alt={aluno.usuarioNome} />
                    <AvatarFallback>{aluno.usuarioNome.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{aluno.usuarioNome}</p>
                    <p className="text-xs text-muted-foreground">
                      V: {aluno.valencia > 0 ? '+' : ''}{aluno.valencia.toFixed(2)} • A: {aluno.ativacao > 0 ? '+' : ''}{aluno.ativacao.toFixed(2)}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ 
                      borderColor: cor, 
                      color: cor 
                    }}
                  >
                    {aluno.estadoPrimario}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
