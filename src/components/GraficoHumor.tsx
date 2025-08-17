"use client"

import * as React from "react"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Dados de exemplo: cada dia tem a contagem de cada humor
const humorData = [
  { date: "2024-06-01", triste: 1, confuso: 2, neutro: 3, feliz: 4, muitoFeliz: 2 },
  { date: "2024-06-02", triste: 0, confuso: 1, neutro: 2, feliz: 5, muitoFeliz: 3 },
  { date: "2024-06-03", triste: 2, confuso: 1, neutro: 2, feliz: 3, muitoFeliz: 2 },
  { date: "2024-06-04", triste: 1, confuso: 0, neutro: 1, feliz: 4, muitoFeliz: 4 },
  { date: "2024-06-05", triste: 0, confuso: 2, neutro: 2, feliz: 3, muitoFeliz: 3 },
  { date: "2024-06-06", triste: 1, confuso: 1, neutro: 2, feliz: 4, muitoFeliz: 2 },
  { date: "2024-06-07", triste: 0, confuso: 0, neutro: 3, feliz: 5, muitoFeliz: 2 },
  { date: "2024-06-08", triste: 1, confuso: 10, neutro: 2, feliz: 3, muitoFeliz: 3 },
  { date: "2024-06-09", triste: 0, confuso: 1, neutro: 2, feliz: 4, muitoFeliz: 4 },
  { date: "2024-06-10", triste: 1, confuso: 0, neutro: 1, feliz: 5, muitoFeliz: 2 },
  { date: "2024-04-01", triste: 1, confuso: 2, neutro: 3, feliz: 4, muitoFeliz: 2 },
  { date: "2024-04-02", triste: 0, confuso: 1, neutro: 2, feliz: 5, muitoFeliz: 3 },
  { date: "2024-04-03", triste: 2, confuso: 1, neutro: 2, feliz: 3, muitoFeliz: 2 },
  { date: "2024-04-04", triste: 1, confuso: 0, neutro: 1, feliz: 4, muitoFeliz: 4 },
  { date: "2024-04-05", triste: 0, confuso: 2, neutro: 2, feliz: 3, muitoFeliz: 3 },
  { date: "2024-04-06", triste: 1, confuso: 1, neutro: 2, feliz: 4, muitoFeliz: 2 },
  { date: "2024-04-07", triste: 0, confuso: 0, neutro: 3, feliz: 5, muitoFeliz: 2 },
  { date: "2024-04-08", triste: 1, confuso: 2, neutro: 2, feliz: 3, muitoFeliz: 3 },
  { date: "2024-04-09", triste: 0, confuso: 1, neutro: 2, feliz: 4, muitoFeliz: 4 },
  { date: "2024-04-10", triste: 1, confuso: 0, neutro: 1, feliz: 5, muitoFeliz: 2 },
  { date: "2024-05-06", triste: 1, confuso: 1, neutro: 2, feliz: 4, muitoFeliz: 2 },
  { date: "2024-05-07", triste: 0, confuso: 0, neutro: 3, feliz: 5, muitoFeliz: 2 },
  { date: "2024-05-08", triste: 1, confuso: 2, neutro: 2, feliz: 3, muitoFeliz: 3 },
  { date: "2024-05-09", triste: 0, confuso: 1, neutro: 2, feliz: 4, muitoFeliz: 4 },
  { date: "2024-05-1", triste: 1, confuso: 0, neutro: 1, feliz: 5, muitoFeliz: 2 },
]

const humorLabels = [
  { key: "triste", label: "Triste", emoji: "😢", color: "#6366f1" },
  { key: "confuso", label: "Confuso", emoji: "😕", color: "#f59e42" },
  { key: "neutro", label: "Neutro", emoji: "😐", color: "#a3a3a3" },
  { key: "feliz", label: "Feliz", emoji: "🙂", color: "#22c55e" },
  { key: "muitoFeliz", label: "Muito Feliz", emoji: "😄", color: "#eab308" },
]

// Função para extrair meses disponíveis dos dados, ordenados cronologicamente
function getAvailableMonths(data: typeof humorData) {
  const months = Array.from(new Set(data.map(d => d.date.slice(0, 7))))
  // Ordena os meses cronologicamente
  months.sort((a, b) => new Date(a + '-01').getTime() - new Date(b + '-01').getTime())
  return months
}

const mesesPt = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

function getNomeMes(mesIso: string) {
  const [ano, mes] = mesIso.split("-");
  return `${mesesPt[parseInt(mes, 10) - 1]} de ${ano}`;
}

export function GraficoHumor() {
  const meses = getAvailableMonths(humorData)
  const [mesSelecionado, setMesSelecionado] = React.useState(meses[0])

  // Filtra e ordena os dados para o mês selecionado
  const dadosFiltrados = humorData
    .filter(d => d.date.startsWith(mesSelecionado))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Variação de Humor - {mesSelecionado.replace('-', '/')}</CardTitle>
          <CardDescription>
            Veja a quantidade de avaliações de cada humor ao longo do mês
          </CardDescription>
        </div>
        <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
          <SelectTrigger className="w-[160px] rounded-lg ml-auto" aria-label="Selecione o mês">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {meses.map(mes => (
              <SelectItem key={mes} value={mes} className="rounded-lg">
                {getNomeMes(mes)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosFiltrados} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={v => new Date(v).getDate().toString()}
                tickLine={false}
                axisLine={false}
                minTickGap={2}
                label={{ value: "Dia", position: "insideBottomRight", offset: -5 }}
              />
              <YAxis allowDecimals={false} label={{ value: "Qtd", angle: -90, position: "insideLeft" }} />
              <Tooltip
                formatter={(value, name) => {
                  const humor = humorLabels.find(h => h.key === name)
                  return [`${value} ${humor?.emoji ?? ''}`, humor?.label ?? name]
                }}
                labelFormatter={v => `Dia ${new Date(v).getDate()}`}
              />
              {humorLabels.map(humor => (
                <Line
                  key={humor.key}
                  type="monotone"
                  dataKey={humor.key}
                  stroke={humor.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                  name={`${humor.label} ${humor.emoji}`}
                />
              ))}
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
