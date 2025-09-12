"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Icon,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Trophy,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Visão Geral",
          url: "/dashboard",
        },
        {
          title: "Métricas da Turma",
          url: "/dashboard?tab=metricas",
        },
        {
          title: "Tabela de Alunos",
          url: "/dashboard?tab=alunos",
        },
        {
          title: "Alertas Urgentes",
          url: "/dashboard?tab=alertas",
        },
      ],
    },
    {
      title: "Questionário Socioemocional",
      url: "/questionario",
      icon: BookOpen,
      items: [
        {
          title: "Questionário Adaptivo",
          url: "/questionario",
        },
        {
          title: "Avaliação Socioemocional",
          url: "/avaliacao-socioemocional",
        },
        {
          title: "Histórico de Respostas",
          url: "/questionario/historico",
        },
        {
          title: "Análise Científica",
          url: "/questionario/analise",
        },
        {
          title: "Resultados Detalhados",
          url: "/questionario/resultados",
        },
      ],
    },
    {
      title: "Relatórios Científicos",
      url: "/relatorios",
      icon: PieChart,
      items: [
        {
          title: "Análise Longitudinal",
          url: "/relatorios?type=longitudinal",
        },
        {
          title: "Tendências da Turma",
          url: "/relatorios?type=tendencias",
        },
        {
          title: "Circumplex de Russell",
          url: "/relatorios?type=circumplex",
        },
        {
          title: "Evolução Emocional",
          url: "/relatorios?type=evolucao",
        },
        {
          title: "Mapa de Calor Emocional",
          url: "/relatorios?type=mapa",
        },
        {
          title: "Validação Psicométrica",
          url: "/relatorios?type=validacao",
        },
      ],
    },
    {
      title: "Insights Científicos",
      url: "/insights",
      icon: Bot,
      items: [
        {
          title: "Previsões TRI",
          url: "/insights?tab=previsoes",
        },
        {
          title: "Análise de Cenários",
          url: "/insights?tab=cenarios",
        },
        {
          title: "Recomendações Adaptivas",
          url: "/insights?tab=recomendacoes",
        },
        {
          title: "Métricas do Modelo",
          url: "/insights?tab=metricas",
        },
        {
          title: "Validação Científica",
          url: "/insights?tab=validacao",
        },
        {
          title: "Motor Adaptativo",
          url: "/insights?tab=motor",
        },
      ],
    },
    {
      title: "Exportação",
      url: "/exportacao",
      icon: BookOpen,
      items: [
        {
          title: "Gerar Relatórios",
          url: "/exportacao",
        },
        {
          title: "Templates",
          url: "/exportacao?tab=templates",
        },
        {
          title: "Histórico",
          url: "/exportacao?tab=historico",
        },
        {
          title: "Compartilhamento",
          url: "/exportacao?tab=compartilhar",
        },
      ],
    },
    {
      title: "Sistema Científico",
      url: "/sprint3",
      icon: Trophy,
      items: [
        {
          title: "Motor Adaptativo",
          url: "/sprint3?component=adaptive-engine",
        },
        {
          title: "Seleção de Questões",
          url: "/sprint3?component=question-selection",
        },
        {
          title: "Analytics Científicas",
          url: "/sprint3?component=scientific-analytics",
        },
        {
          title: "Banco de Questões",
          url: "/sprint3?component=validated-questions",
        },
        {
          title: "Testes Unitários",
          url: "/sprint3?component=tests",
        },
      ],
    },
    {
      title: "Gamificação",
      url: "/gamificacao",
      icon: Trophy,
      items: [
        {
          title: "Dashboard",
          url: "/gamificacao",
        },
        {
          title: "Conquistas",
          url: "/gamificacao/conquistas",
        },
        {
          title: "Ranking",
          url: "/gamificacao/ranking",
        },
        {
          title: "Missões",
          url: "/gamificacao/missoes",
        },
        {
          title: "Perfil",
          url: "/gamificacao/perfil",
        },
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Perfil",
          url: "#",
        },
        {
          title: "Notificações",
          url: "#",
        },
        {
          title: "Privacidade",
          url: "#",
        },
        {
          title: "Integrações",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}


import { Home, Star, Calendar, Brain, BarChart3, FileText, Zap, Target, Users } from "lucide-react"
import Link from "next/link"

const navItems = [
  { label: "Início", icon: Home, href: "/home" },
  { label: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { label: "Questionário", icon: Brain, href: "/questionario" },
  { label: "Avaliação Socioemocional", icon: Target, href: "/avaliacao-socioemocional" },
  { label: "Sistema Científico", icon: Users, href: "/sprint3" },
  { label: "Aulas", icon: BookOpen, href: "/aulas" },
  { label: "Favoritas", icon: Star, href: "/favoritos" },
  { label: "Relatórios", icon: FileText, href: "/relatorios" },
  { label: "Insights Preditivos", icon: Zap, href: "/insights" },
  { label: "Gamificação", icon: Trophy, href: "/gamificacao" },
  { label: "Exportação", icon: Calendar, href: "/exportacao" },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <SidebarGroup>
        <SidebarMenu>
          {navItems.map(({ label, icon: Icon, href }) => (
            <SidebarMenuItem key={label}>
              <SidebarMenuButton asChild>
                <Link href={href}>
                  <Icon className="size-8" />
                  <span className="ml-2">{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}