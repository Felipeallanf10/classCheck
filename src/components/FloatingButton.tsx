'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Star, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingButtonProps {
  onClick?: () => void
  className?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  variant?: "default" | "success" | "warning"
}

export function FloatingButton({ 
  onClick, 
  className,
  position = "bottom-right",
  variant = "default"
}: FloatingButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-6 left-6"
      case "top-right":
        return "top-6 right-6"
      case "top-left":
        return "top-6 left-6"
      default:
        return "bottom-6 right-6"
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-green-600 hover:bg-green-700 shadow-green-500/25"
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 shadow-yellow-500/25"
      default:
        return "bg-primary hover:bg-primary/90 shadow-primary/25"
    }
  }

  return (
    <Button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={cn(
        "fixed z-50 h-14 w-14 rounded-full shadow-2xl transition-all duration-300",
        "hover:scale-110 active:scale-95",
        "border-2 border-white/20",
        getPositionClasses(),
        getVariantClasses(),
        isPressed && "scale-95",
        className
      )}
      size="icon"
    >
      <div className="relative flex items-center justify-center">
        {/* Ícone principal */}
        <Star 
          className={cn(
            "h-6 w-6 text-white transition-all duration-200",
            isHovered ? "rotate-12 scale-110" : "rotate-0 scale-100"
          )} 
        />
        
        {/* Ícone de plus pequeno no canto */}
        <Plus 
          className={cn(
            "absolute -top-1 -right-1 h-3 w-3 text-white transition-all duration-200",
            isHovered ? "opacity-100 scale-110" : "opacity-70 scale-90"
          )} 
        />

        {/* Efeito de ripple */}
        {isPressed && (
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
        )}
      </div>

      {/* Tooltip */}
      <div className={cn(
        "absolute right-16 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg",
        "transition-all duration-200 pointer-events-none whitespace-nowrap",
        "before:content-[''] before:absolute before:left-full before:top-1/2",
        "before:-translate-y-1/2 before:border-4 before:border-transparent", 
        "before:border-l-gray-900",
        isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        Avaliar Aula
      </div>
    </Button>
  )
}