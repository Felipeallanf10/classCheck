import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  Award,
  Users,
  BookOpen,
  Star,
  Clock,
  Calendar,
  Trophy,
  Activity,
  BarChart3,
  PieChart
} from "lucide-react"

// ✨ METRIC CARD VARIANTS
const metricCardVariants = cva(
  "relative overflow-hidden transition-all duration-200",
  {
    variants: {
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8"
      },
      variant: {
        default: "border-neutral-200",
        success: "border-success-200 bg-success-50 dark:bg-success-950",
        warning: "border-warning-200 bg-warning-50 dark:bg-warning-950",
        danger: "border-danger-200 bg-danger-50 dark:bg-danger-950",
        info: "border-primary-200 bg-primary-50 dark:bg-primary-950"
      },
      trend: {
        up: "hover:border-success-300",
        down: "hover:border-danger-300",
        neutral: "hover:border-neutral-300"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      trend: "neutral"
    }
  }
)

// 🎯 TYPES
export interface MetricData {
  /**
   * Valor principal da métrica
   */
  value: number | string
  /**
   * Label/título da métrica
   */
  label: string
  /**
   * Valor anterior para comparação
   */
  previousValue?: number
  /**
   * Percentual de mudança
   */
  changePercent?: number
  /**
   * Sufixo do valor (%, R$, etc)
   */
  suffix?: string
  /**
   * Prefixo do valor (R$, +, etc)
   */
  prefix?: string
  /**
   * Meta/objetivo
   */
  target?: number
  /**
   * Descrição adicional
   */
  description?: string
}

export interface MetricCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  /**
   * Dados da métrica
   */
  metric: MetricData
  /**
   * Ícone da métrica
   */
  icon?: React.ReactNode
  /**
   * Se deve mostrar trend
   */
  showTrend?: boolean
  /**
   * Se deve mostrar progresso para meta
   */
  showProgress?: boolean
  /**
   * Cor customizada
   */
  color?: string
  /**
   * Se é clicável
   */
  clickable?: boolean
  /**
   * Callback ao clicar
   */
  onClick?: () => void
}

// 🎪 METRIC CARD COMPONENT
const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      className,
      metric,
      icon,
      showTrend = true,
      showProgress = false,
      color,
      clickable = false,
      onClick,
      size,
      variant,
      trend,
      ...props
    },
    ref
  ) => {
    // Calcular trend
    const getTrend = () => {
      if (!metric.changePercent) return "neutral"
      return metric.changePercent > 0 ? "up" : metric.changePercent < 0 ? "down" : "neutral"
    }

    const getTrendIcon = () => {
      const trendDirection = getTrend()
      switch (trendDirection) {
        case "up": return <TrendingUp className="h-4 w-4 text-success-600" />
        case "down": return <TrendingDown className="h-4 w-4 text-danger-600" />
        default: return <Minus className="h-4 w-4 text-neutral-600" />
      }
    }

    const getTrendColor = () => {
      const trendDirection = getTrend()
      switch (trendDirection) {
        case "up": return "text-success-600"
        case "down": return "text-danger-600"
        default: return "text-neutral-600"
      }
    }

    // Calcular progresso para meta
    const getProgressValue = () => {
      if (!metric.target || typeof metric.value !== 'number') return 0
      return Math.min((metric.value / metric.target) * 100, 100)
    }

    return (
      <Card
        ref={ref}
        className={cn(
          metricCardVariants({ size, variant, trend: trend || getTrend() }),
          {
            "cursor-pointer hover:shadow-md": clickable
          },
          className
        )}
        onClick={clickable ? onClick : undefined}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {metric.label}
          </CardTitle>
          {icon && (
            <div className="text-muted-foreground" style={{ color }}>
              {icon}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {/* Valor principal */}
            <div className="text-2xl font-bold" style={{ color }}>
              {metric.prefix}
              {metric.value}
              {metric.suffix}
            </div>

            {/* Trend e mudança */}
            {showTrend && metric.changePercent !== undefined && (
              <div className="flex items-center space-x-2">
                {getTrendIcon()}
                <span className={cn("text-sm font-medium", getTrendColor())}>
                  {Math.abs(metric.changePercent).toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">
                  vs período anterior
                </span>
              </div>
            )}

            {/* Progresso para meta */}
            {showProgress && metric.target && typeof metric.value === 'number' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Meta</span>
                  <span className="font-medium">
                    {metric.prefix}{metric.target}{metric.suffix}
                  </span>
                </div>
                <Progress 
                  value={getProgressValue()} 
                  className="h-2"
                  style={{ 
                    '--progress-background': color 
                  } as React.CSSProperties}
                />
                <div className="text-xs text-muted-foreground">
                  {getProgressValue().toFixed(0)}% da meta alcançada
                </div>
              </div>
            )}

            {/* Descrição */}
            {metric.description && (
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)
MetricCard.displayName = "MetricCard"

// 📊 METRIC GRID
export interface MetricGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array de métricas
   */
  metrics: (MetricData & { 
    icon?: React.ReactNode
    color?: string
    showTrend?: boolean
    showProgress?: boolean
  })[]
  /**
   * Colunas da grid
   */
  columns?: 1 | 2 | 3 | 4
  /**
   * Se os cards são clicáveis
   */
  clickable?: boolean
  /**
   * Callback ao clicar em um card
   */
  onCardClick?: (metric: MetricData, index: number) => void
}

const MetricGrid = React.forwardRef<HTMLDivElement, MetricGridProps>(
  (
    {
      className,
      metrics,
      columns = 4,
      clickable = false,
      onCardClick,
      ...props
    },
    ref
  ) => {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2", 
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4",
          gridCols[columns],
          className
        )}
        {...props}
      >
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            metric={metric}
            icon={metric.icon}
            color={metric.color}
            showTrend={metric.showTrend}
            showProgress={metric.showProgress}
            clickable={clickable}
            onClick={() => onCardClick?.(metric, index)}
          />
        ))}
      </div>
    )
  }
)
MetricGrid.displayName = "MetricGrid"

// 🎓 CLASSCHECK MÉTRICAS ESPECÍFICAS
export interface ClassCheckMetricsProps extends Omit<MetricGridProps, 'metrics'> {
  /**
   * Dados específicos do ClassCheck
   */
  data: {
    totalAulas?: number
    aulasCompletadas?: number
    totalProfessores?: number
    avaliacaoMedia?: number
    totalAlunos?: number
    horasEnsino?: number
    rendaMensal?: number
    crescimentoMensal?: number
  }
  /**
   * Tipo de usuário (determina quais métricas mostrar)
   */
  userType?: "aluno" | "professor" | "admin"
}

const ClassCheckMetrics = React.forwardRef<HTMLDivElement, ClassCheckMetricsProps>(
  (
    {
      data,
      userType = "aluno",
      ...props
    },
    ref
  ) => {
    const getMetricsForUser = () => {
      const baseMetrics = []

      if (userType === "aluno") {
        if (data.totalAulas !== undefined) {
          baseMetrics.push({
            value: data.totalAulas,
            label: "Aulas Frequentadas",
            icon: <BookOpen className="h-4 w-4" />,
            color: "#3b82f6",
            changePercent: 12.5,
            showTrend: true
          })
        }

        if (data.aulasCompletadas !== undefined && data.totalAulas !== undefined) {
          const completionRate = (data.aulasCompletadas / data.totalAulas) * 100
          baseMetrics.push({
            value: completionRate.toFixed(0),
            label: "Taxa de Conclusão",
            suffix: "%",
            icon: <Target className="h-4 w-4" />,
            color: "#10b981",
            target: 100,
            showProgress: true
          })
        }

        if (data.avaliacaoMedia !== undefined) {
          baseMetrics.push({
            value: data.avaliacaoMedia.toFixed(1),
            label: "Avaliação Média",
            suffix: "/5",
            icon: <Star className="h-4 w-4" />,
            color: "#f59e0b",
            changePercent: 5.2
          })
        }

        if (data.horasEnsino !== undefined) {
          baseMetrics.push({
            value: data.horasEnsino,
            label: "Horas de Estudo",
            suffix: "h",
            icon: <Clock className="h-4 w-4" />,
            color: "#8b5cf6",
            changePercent: 8.3
          })
        }
      }

      if (userType === "professor") {
        if (data.totalAlunos !== undefined) {
          baseMetrics.push({
            value: data.totalAlunos,
            label: "Total de Alunos",
            icon: <Users className="h-4 w-4" />,
            color: "#3b82f6",
            changePercent: 15.2,
            showTrend: true
          })
        }

        if (data.totalAulas !== undefined) {
          baseMetrics.push({
            value: data.totalAulas,
            label: "Aulas Ministradas",
            icon: <BookOpen className="h-4 w-4" />,
            color: "#10b981",
            changePercent: 8.7
          })
        }

        if (data.avaliacaoMedia !== undefined) {
          baseMetrics.push({
            value: data.avaliacaoMedia.toFixed(1),
            label: "Avaliação Média",
            suffix: "/5",
            icon: <Star className="h-4 w-4" />,
            color: "#f59e0b",
            target: 5,
            showProgress: true
          })
        }

        if (data.rendaMensal !== undefined) {
          baseMetrics.push({
            value: data.rendaMensal.toLocaleString(),
            label: "Renda Mensal",
            prefix: "R$ ",
            icon: <Award className="h-4 w-4" />,
            color: "#059669",
            changePercent: data.crescimentoMensal
          })
        }
      }

      if (userType === "admin") {
        baseMetrics.push(
          {
            value: data.totalProfessores || 0,
            label: "Professores Ativos",
            icon: <Users className="h-4 w-4" />,
            color: "#3b82f6",
            changePercent: 12.3
          },
          {
            value: data.totalAlunos || 0,
            label: "Alunos Cadastrados",
            icon: <Trophy className="h-4 w-4" />,
            color: "#10b981",
            changePercent: 23.1
          },
          {
            value: data.totalAulas || 0,
            label: "Aulas Realizadas",
            icon: <BookOpen className="h-4 w-4" />,
            color: "#f59e0b",
            changePercent: 18.7
          },
          {
            value: data.avaliacaoMedia?.toFixed(1) || "0.0",
            label: "Satisfação Geral",
            suffix: "/5",
            icon: <Star className="h-4 w-4" />,
            color: "#8b5cf6",
            target: 5,
            showProgress: true
          }
        )
      }

      return baseMetrics
    }

    return (
      <MetricGrid
        ref={ref}
        metrics={getMetricsForUser()}
        {...props}
      />
    )
  }
)
ClassCheckMetrics.displayName = "ClassCheckMetrics"

// 🏆 ACHIEVEMENT CARD
export interface AchievementData {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number // 0-100
  isCompleted: boolean
  completedAt?: Date
  reward?: string
  category: "learning" | "teaching" | "social" | "milestone"
}

export interface AchievementCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  achievement: AchievementData
  size?: "sm" | "default" | "lg"
  showProgress?: boolean
  onClick?: (achievement: AchievementData) => void
}

const AchievementCard = React.forwardRef<HTMLDivElement, AchievementCardProps>(
  (
    {
      className,
      achievement,
      size = "default",
      showProgress = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const categoryColors = {
      learning: "bg-blue-500",
      teaching: "bg-green-500", 
      social: "bg-purple-500",
      milestone: "bg-yellow-500"
    }

    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          {
            "p-4": size === "sm",
            "p-6": size === "default",
            "p-8": size === "lg",
            "cursor-pointer hover:shadow-md": onClick,
            "opacity-100": achievement.isCompleted,
            "opacity-75": !achievement.isCompleted
          },
          className
        )}
        onClick={() => onClick?.(achievement)}
        {...props}
      >
        {/* Background pattern para completed */}
        {achievement.isCompleted && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-success-50 dark:from-primary-950 dark:to-success-950" />
        )}

        <CardContent className="relative space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full",
              categoryColors[achievement.category]
            )}>
              <div className="text-white">
                {achievement.icon}
              </div>
            </div>

            {achievement.isCompleted && (
              <Badge variant="default" className="bg-success-500">
                <Award className="h-3 w-3 mr-1" />
                Conquistado
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="font-semibold">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground">
              {achievement.description}
            </p>
          </div>

          {/* Progress */}
          {showProgress && !achievement.isCompleted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">{achievement.progress}%</span>
              </div>
              <Progress value={achievement.progress} className="h-2" />
            </div>
          )}

          {/* Completion info */}
          {achievement.isCompleted && achievement.completedAt && (
            <div className="text-xs text-muted-foreground">
              Conquistado em {achievement.completedAt.toLocaleDateString()}
            </div>
          )}

          {/* Reward */}
          {achievement.reward && (
            <div className="bg-primary-50 dark:bg-primary-950 rounded-lg p-3">
              <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                🎁 Recompensa: {achievement.reward}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)
AchievementCard.displayName = "AchievementCard"

// 📤 EXPORTS
export {
  MetricCard,
  MetricGrid,
  ClassCheckMetrics,
  AchievementCard,
  metricCardVariants
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Metric card individual
 * <MetricCard
 *   metric={{
 *     value: 1250,
 *     label: "Total de Aulas",
 *     changePercent: 12.5,
 *     target: 1500
 *   }}
 *   icon={<BookOpen />}
 *   showTrend
 *   showProgress
 * />
 * 
 * // Grid de métricas
 * <MetricGrid
 *   metrics={[
 *     { value: 50, label: "Aulas", icon: <BookOpen /> },
 *     { value: 4.8, label: "Avaliação", suffix: "/5", icon: <Star /> }
 *   ]}
 *   columns={2}
 *   clickable
 *   onCardClick={(metric) => console.log(metric)}
 * />
 * 
 * // Métricas específicas do ClassCheck
 * <ClassCheckMetrics
 *   data={{
 *     totalAulas: 45,
 *     aulasCompletadas: 38,
 *     avaliacaoMedia: 4.7,
 *     horasEnsino: 120
 *   }}
 *   userType="aluno"
 *   columns={4}
 * />
 * 
 * // Achievement card
 * <AchievementCard
 *   achievement={{
 *     id: "1",
 *     title: "Primeiro Passo",
 *     description: "Complete sua primeira aula",
 *     icon: <Trophy />,
 *     progress: 100,
 *     isCompleted: true,
 *     category: "learning"
 *   }}
 * />
 */
