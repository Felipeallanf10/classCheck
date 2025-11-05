"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function DatabaseWarmup() {
  const [dots, setDots] = useState(".")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "." : prev + ".")
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
          <CardTitle>Conectando ao banco de dados{dots}</CardTitle>
          <CardDescription>
            O banco de dados está acordando. Isso pode levar alguns segundos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>💡 <strong>Dica:</strong> O Neon (plano gratuito) suspende o banco após alguns minutos de inatividade.</p>
            <p>🔄 A primeira conexão após a suspensão pode demorar 5-10 segundos.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
