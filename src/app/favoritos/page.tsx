"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function FavoritosRedirectPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animação do progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 50)

    // Redirect após 2 segundos
    const timer = setTimeout(() => {
      router.push('/aulas?filtro=favoritas')
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-50 via-background to-orange-50 dark:from-yellow-950/20 dark:via-background dark:to-orange-950/20">
      <Card className="max-w-md w-full border-yellow-500/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-950 rounded-full flex items-center justify-center mb-4">
            <Star className="h-8 w-8 fill-yellow-500 text-yellow-500 animate-pulse" />
          </div>
          <CardTitle className="text-2xl">Aulas Favoritas</CardTitle>
          <CardDescription>
            Redirecionando para a página de aulas com filtro de favoritas...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Carregando aulas favoritas</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}