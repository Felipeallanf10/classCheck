"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  BarChart3, 
  ClipboardList, 
  BookOpen, 
  User, 
  LogOut 
} from "lucide-react"

const navItems = [
  {
    title: "Início",
    href: "/aluno",
    icon: Home,
  },
  {
    title: "Minhas Estatísticas",
    href: "/aluno/estatisticas",
    icon: BarChart3,
  },
  {
    title: "Avaliar Aulas",
    href: "/aluno/avaliar",
    icon: ClipboardList,
  },
  {
    title: "Histórico",
    href: "/aluno/historico",
    icon: BookOpen,
  },
  {
    title: "Perfil",
    href: "/aluno/perfil",
    icon: User,
  },
]

export function AlunoNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col h-full bg-white dark:bg-gray-900 border-r">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">ClassCheck</h2>
        <p className="text-sm text-muted-foreground mt-1">Área do Aluno</p>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </div>

      <div className="p-3 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </div>
    </nav>
  )
}
