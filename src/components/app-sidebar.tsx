"use client"

import * as React from "react"
import Link from "next/link"
import { useSession } from "@/hooks/useSession"
import {
  Command,
  Home, 
  Calendar, 
  Heart, 
  FileText, 
  Trophy, 
  Target, 
  BookOpen, 
  Settings,
  HelpCircle, 
  Mail, 
  Info, 
  Shield,
  Brain,
  Users,
  ClipboardList,
  School,
  UserCheck,
  GraduationCap,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarGroup,
} from "@/components/ui/sidebar"

// Navegação por ROLE
const navItemsByRole = {
  ALUNO: [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Avaliar Aulas", icon: ClipboardList, href: "/aulas" },
    { label: "Avaliar Professores", icon: UserCheck, href: "/professores" },
    { label: "Minhas Avaliações", icon: Target, href: "/minhas-avaliacoes" },
    { label: "Check-in Diário", icon: Heart, href: "/check-in" },
  ],
  PROFESSOR: [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Turmas", icon: Users, href: "/professor/turmas" },
    { label: "Aulas", icon: BookOpen, href: "/aulas" },
  ],
  ADMIN: [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Usuários", icon: Users, href: "/admin/usuarios" },
    { label: "Matérias", icon: GraduationCap, href: "/admin/materias" },
    { label: "Turmas", icon: School, href: "/admin/turmas" },
  ],
}

// Relatórios por ROLE
const relatoriosByRole = {
  ALUNO: [
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: FileText,
      items: [
        { title: "Visão Geral", url: "/relatorios" },
        { title: "Minha Jornada Emocional", url: "/relatorios/meu-estado-emocional" },
      ],
    },
  ],
  PROFESSOR: [
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: FileText,
      items: [
        { title: "Visão Geral", url: "/relatorios" },
        { title: "Relatórios da Turma", url: "/professor/relatorios" },
      ],
    },
  ],
  ADMIN: [
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: FileText,
      items: [
        { title: "Visão Geral", url: "/relatorios" },
        { title: "Relatórios do Sistema", url: "/admin/relatorios" },
      ],
    },
  ],
}

// Seção de páginas institucionais (igual para todos)
const institutionalItems = [
  { label: "Configurações", icon: Settings, href: "/configuracoes" },
  { label: "Central de Ajuda", icon: HelpCircle, href: "/ajuda" },
  { label: "Contato", icon: Mail, href: "/contato" },
  { label: "Sobre", icon: Info, href: "/sobre" },
]

// Seção de políticas no footer (igual para todos)
const policyItems = [
  { label: "Privacidade", icon: Shield, href: "/politica-de-privacidade" },
  { label: "Termos", icon: FileText, href: "/termos-de-uso" },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  
  // Se não tiver sessão, não renderiza sidebar
  if (!session) return null
  
  const userRole = session.user.role as keyof typeof navItemsByRole
  
  // Pega os itens de navegação baseado no role
  const navItems = navItemsByRole[userRole] || navItemsByRole.ALUNO
  const relatoriosItems = relatoriosByRole[userRole] || relatoriosByRole.ALUNO
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="/">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">ClassCheck</span>
                    <span className="truncate text-xs">Software</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Navegação Principal */}
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map(({ label, icon: Icon, href }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton asChild>
                  <Link href={href}>
                    <Icon className="size-4" />
                    <span className="ml-2">{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Relatórios com Sub-menu */}
        <NavMain items={relatoriosItems} />

        {/* Seção Institucional */}
        <SidebarGroup>
          <div className="px-2 py-1 group-data-[collapsible=icon]:hidden">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Suporte
            </h4>
          </div>
          <SidebarMenu>
            {institutionalItems.map(({ label, icon: Icon, href }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton asChild size="sm">
                  <Link href={href}>
                    <Icon className="size-4" />
                    <span className="ml-2">{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Links de Política no Footer */}
        <SidebarGroup>
          <SidebarMenu>
            {policyItems.map(({ label, icon: Icon, href }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton asChild size="sm" variant="outline">
                  <Link href={href} className="text-xs">
                    <Icon className="size-3" />
                    <span className="ml-1">{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}