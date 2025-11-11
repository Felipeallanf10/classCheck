'use client'

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface MobileDatePickerProps {
  date: Date
  onChange: (date: Date) => void
}

export function MobileDatePicker({ date, onChange }: MobileDatePickerProps) {
  const [open, setOpen] = useState(false)

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      onChange(newDate)
      setOpen(false)
    }
  }

  const handleQuickPick = (daysOffset: number) => {
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + daysOffset)
    onChange(newDate)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 lg:hidden mb-4"
        >
          <CalendarIcon className="h-4 w-4" />
          <span>{format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[60vh]">
        <SheetHeader>
          <SheetTitle>Selecionar Data</SheetTitle>
          <SheetDescription>
            Escolha uma data para ver as aulas
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border bg-background mx-auto"
            locale={ptBR}
          />
        </div>

        {/* Quick picks */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickPick(0)}
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickPick(1)}
          >
            Amanhã
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickPick(7)}
          >
            Próx. semana
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
