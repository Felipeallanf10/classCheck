// components/Sidebar.tsx
'use client'

import { Home, Star, BookOpen, Calendar, LogOut } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Início", icon: Home, href: "/" },
  { label: "Favoritas", icon: Star, href: "/favoritas" },
  { label: "Aulas", icon: BookOpen, href: "/aulas" },
  { label: "Eventos", icon: Calendar, href: "/eventos" },
]

export function Sidebar() {
  return (
    <>
      {/* Sidebar vertical fixa (desktop) */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen bg-muted px-4 py-6 space-y-6 border-r w-52 z-40">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">AvaliaAula</h2>
          <nav className="space-y-2">
            {navItems.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Bottom bar fixa (mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-muted border-t flex justify-around items-center py-2 z-50">
        {navItems.map(({ icon: Icon, href, label }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition"
            )}
            aria-label={label}
          >
            <Icon className="w-6 h-6" />
          </Link>
        ))}
        <button className="flex flex-col items-center justify-center text-muted-foreground hover:text-destructive transition" aria-label="Sair">
          <LogOut className="w-6 h-6" />
        </button>
      </nav>
    </>
  )
}
