'use client'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { cn } from "@/lib/utils"

const backgroundColors = [
    "bg-red-400",
    "bg-violet-300",
    "bg-zinc-300",
    "bg-yellow-200",
    "bg-green-300",
]

export function DrawerAvaliacao() {
  const [value, setValue] = useState(3) // valores de 1 a 5
  const [step, setStep] = useState<"emoji" | "pergunta">("emoji")
  const [comentario, setComentario] = useState("")

  const handleIncrement = () => {
    setValue((prev) => Math.min(prev + 1, 5))
  }

  const handleDecrement = () => {
    setValue((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    console.log({ humor: value, comentario })
    setStep("emoji")
    setComentario("")
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default">Avaliar Aula</Button>
      </DrawerTrigger>

      <DrawerContent
        className={cn(
          "h-[100dvh] flex flex-col items-center justify-start px-4 py-6 transition-all duration-300",
          backgroundColors[value - 1]
        )}
      >
        {step === "emoji" && (
          <div className="w-full max-w-md text-center flex flex-col items-center">
            <DrawerHeader >
              <DrawerTitle className="text-2xl font-extrabold font-['Poppins'] text-black">Como você se sentiu nessa aula?</DrawerTitle>
            </DrawerHeader>

            {/* Emoji grande */}
            <div className="relative w-52 h-52 sm:w-64 sm:h-64 mt-4 mb-4">
              <Image
                src={`/emotions/face-${value}.svg`}
                alt={`Emoji ${value}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Botões + Progress */}
            <div className="flex items-center gap-4 w-full">
              <Button onClick={handleDecrement} variant="outline" className="text-xl w-10 h-10 p-0 rounded-full">
                –
              </Button>
              <Progress value={(value / 5) * 100} className="flex-1 h-4 bg-white/20"/>
              <Button onClick={handleIncrement} variant="outline" className="text-xl w-10 h-10 p-0 rounded-full">
                +
              </Button>
            </div>

            <DrawerFooter className="mt-6 w-full">
              <Button className="w-full" onClick={() => setStep("pergunta")}>
                Enviar Avaliação
              </Button>
            </DrawerFooter>
          </div>
        )}

        {step === "pergunta" && (
          <div className="w-full max-w-md text-center flex flex-col items-center">
            <DrawerHeader>
              <DrawerTitle className="text-xl text-black">Conte mais sobre como se sentiu</DrawerTitle>
            </DrawerHeader>

            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Ex: A aula estava difícil, fiquei perdido em um ponto..."
              className="w-full h-32 p-4 mt-4 text-sm border rounded-md resize-none shadow bg-white text-black"
            />

            <DrawerFooter className="mt-6 w-full">
              <Button className="w-full" onClick={handleSubmit}>
                Enviar
              </Button>
              <Button variant="ghost" onClick={() => setStep("emoji")}>
                Voltar
              </Button>
            </DrawerFooter>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
