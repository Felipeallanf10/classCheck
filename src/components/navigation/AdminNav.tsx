"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Users, 
  School, 
  Calendar, 
  BarChart3, 
  FileText, 
  Settings, 
  User, 
  LogOut 
} from "lucide-react"

const navItems = [
  {
    title: "Início",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Usuários",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Turmas",
    href: "/admin/turmas",
    icon: School,
  },
  {
    title: "Aulas",
    href: "/admin/aulas",
    icon: Calendar,
  },
  {
    title: "Analytics Gerais",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Relatórios do Sistema",
    href: "/admin/relatorios",
    icon: FileText,
  },
  {
    title: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
  {
    title: "Perfil",
    href: "/admin/perfil",
    icon: User,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col h-full bg-white dark:bg-gray-900 border-r">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">ClassCheck</h2>
        <p className="text-sm text-muted-foreground mt-1">Painel Admin</p>
      </div>

      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
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
