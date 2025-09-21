'use client'

import { cn } from "@/lib/utils"

interface HumorSelectorProps {
  value: number
  onChange?: (humor: number) => void
  readonly?: boolean
  className?: string
}

const humorOptions = [
  {
    value: 1,
    emoji: "😢",
    label: "Muito triste",
    color: "hover:bg-red-100 data-[selected=true]:bg-red-100 data-[selected=true]:text-red-600"
  },
  {
    value: 2,
    emoji: "😕",
    label: "Triste",
    color: "hover:bg-orange-100 data-[selected=true]:bg-orange-100 data-[selected=true]:text-orange-600"
  },
  {
    value: 3,
    emoji: "😐",
    label: "Neutro",
    color: "hover:bg-yellow-100 data-[selected=true]:bg-yellow-100 data-[selected=true]:text-yellow-600"
  },
  {
    value: 4,
    emoji: "😊",
    label: "Feliz",
    color: "hover:bg-green-100 data-[selected=true]:bg-green-100 data-[selected=true]:text-green-600"
  },
  {
    value: 5,
    emoji: "😄",
    label: "Muito feliz",
    color: "hover:bg-emerald-100 data-[selected=true]:bg-emerald-100 data-[selected=true]:text-emerald-600"
  }
]

export function HumorSelector({ 
  value = 0, 
  onChange, 
  readonly = false,
  className 
}: HumorSelectorProps) {
  const handleSelect = (humor: number) => {
    if (!readonly && onChange) {
      onChange(humor)
    }
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {humorOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleSelect(option.value)}
          disabled={readonly}
          data-selected={value === option.value}
          className={cn(
            "group relative flex flex-col items-center justify-center",
            "p-3 rounded-lg border-2 border-transparent",
            "transition-all duration-200",
            readonly ? "cursor-default" : "cursor-pointer",
            option.color,
            value === option.value && "border-current",
            "focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          title={option.label}
        >
          <span className="text-2xl mb-1 transition-transform duration-200 group-hover:scale-110">
            {option.emoji}
          </span>
          <span className="text-xs font-medium text-center leading-tight">
            {option.label}
          </span>
          
          {/* Indicador de seleção */}
          {value === option.value && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-current rounded-full animate-pulse" />
          )}
        </button>
      ))}
    </div>
  )
}
