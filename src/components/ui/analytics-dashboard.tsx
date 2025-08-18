import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Star,
  Calendar,
  Clock,
  Target,
  Award,
  Activity,
  Eye,
  MessageCircle,
  Download,
  Filter,
  RefreshCw
} from "lucide-react"

// 🎯 TYPES
export interface AnalyticsData {
  period: "7d" | "30d" | "90d" | "1y"
  metrics: {
    totalViews: number
    totalStudents: number
    totalClasses: number
    averageRating: number
    completionRate: number
    engagement: number
    revenue?: number
  }
  trends: {
    views: number
    students: number
    classes: number
    rating: number
  }
  chartData: {
    labels: string[]
    datasets: {
      name: string
      data: number[]
      color: string
    }[]
  }
  topPerforming: {
    classes: Array<{
      id: string
      name: string
      students: number
      rating: number
      views: number
    }>
    categories: Array<{
      name: string
      percentage: number
      growth: number
    }>
  }
}

export interface AnalyticsDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Dados de analytics
   */
  data: AnalyticsData
  /**
   * Se está carregando
   */
  loading?: boolean
  /**
   * Tipo de usuário (professor/admin)
   */
  userType?: "professor" | "admin"
  /**
   * Callback para mudança de período
   */
  onPeriodChange?: (period: "7d" | "30d" | "90d" | "1y") => void
  /**
   * Callback para refresh
   */
  onRefresh?: () => void
  /**
   * Callback para exportar dados
   */
  onExport?: () => void
}

// 📊 ANALYTICS DASHBOARD
const AnalyticsDashboard = React.forwardRef<HTMLDivElement, AnalyticsDashboardProps>(
  (
    {
      className,
      data,
      loading = false,
      userType = "professor",
      onPeriodChange,
      onRefresh,
      onExport,
      ...props
    },
    ref
  ) => {
    const periodLabels = {
      "7d": "7 dias",
      "30d": "30 dias", 
      "90d": "90 dias",
      "1y": "1 ano"
    }

    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M"
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K"
      }
      return num.toString()
    }

    const getTrendIcon = (trend: number) => {
      if (trend > 0) return <TrendingUp className="h-4 w-4 text-success-600" />
      if (trend < 0) return <TrendingDown className="h-4 w-4 text-danger-600" />
      return null
    }

    const getTrendColor = (trend: number) => {
      if (trend > 0) return "text-success-600"
      if (trend < 0) return "text-danger-600"
      return "text-neutral-600"
    }

    if (loading) {
      return (
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
            <div className="flex space-x-2">
              <div className="h-9 w-24 bg-neutral-200 rounded animate-pulse" />
              <div className="h-9 w-20 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>
          
          {/* Metrics skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded-lg animate-pulse" />
            ))}
          </div>
          
          {/* Chart skeleton */}
          <div className="h-96 bg-neutral-200 rounded-lg animate-pulse" />
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          
          <div className="flex items-center space-x-3">
            {/* Period selector */}
            <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
              {(["7d", "30d", "90d", "1y"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => onPeriodChange?.(period)}
                  className={cn(
                    "px-3 py-1 text-sm rounded-md transition-colors",
                    data.period === period
                      ? "bg-white dark:bg-neutral-700 shadow-sm"
                      : "hover:bg-white/50 dark:hover:bg-neutral-700/50"
                  )}
                >
                  {periodLabels[period]}
                </button>
              ))}
            </div>

            {/* Actions */}
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Views */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(data.metrics.totalViews)}</div>
              <div className="flex items-center space-x-2 text-xs">
                {getTrendIcon(data.trends.views)}
                <span className={getTrendColor(data.trends.views)}>
                  {Math.abs(data.trends.views)}%
                </span>
                <span className="text-muted-foreground">vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          {/* Students */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userType === "professor" ? "Alunos" : "Usuários Ativos"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(data.metrics.totalStudents)}</div>
              <div className="flex items-center space-x-2 text-xs">
                {getTrendIcon(data.trends.students)}
                <span className={getTrendColor(data.trends.students)}>
                  {Math.abs(data.trends.students)}%
                </span>
                <span className="text-muted-foreground">vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          {/* Classes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userType === "professor" ? "Aulas" : "Aulas Ativas"}
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(data.metrics.totalClasses)}</div>
              <div className="flex items-center space-x-2 text-xs">
                {getTrendIcon(data.trends.classes)}
                <span className={getTrendColor(data.trends.classes)}>
                  {Math.abs(data.trends.classes)}%
                </span>
                <span className="text-muted-foreground">vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.averageRating.toFixed(1)}</div>
              <div className="flex items-center space-x-2 text-xs">
                {getTrendIcon(data.trends.rating)}
                <span className={getTrendColor(data.trends.rating)}>
                  {Math.abs(data.trends.rating)}%
                </span>
                <span className="text-muted-foreground">vs período anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Engajamento ao Longo do Tempo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simplified chart representation */}
              <div className="h-64 flex items-end space-x-2">
                {data.chartData.labels.map((label, index) => {
                  const value = data.chartData.datasets[0]?.data[index] || 0
                  const maxValue = Math.max(...(data.chartData.datasets[0]?.data || []))
                  const height = (value / maxValue) * 100
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-primary-500 rounded-t-sm transition-all duration-300 hover:bg-primary-600"
                        style={{ height: `${height}%`, minHeight: "4px" }}
                      />
                      <span className="text-xs text-muted-foreground mt-2 transform -rotate-45">
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Completion Rate */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Taxa de Conclusão</span>
                  <span className="font-medium">{data.metrics.completionRate}%</span>
                </div>
                <Progress value={data.metrics.completionRate} className="h-2" />
              </div>

              {/* Engagement */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Engajamento</span>
                  <span className="font-medium">{data.metrics.engagement}%</span>
                </div>
                <Progress value={data.metrics.engagement} className="h-2" />
              </div>

              {/* Revenue (if applicable) */}
              {data.metrics.revenue !== undefined && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">Receita</div>
                  <div className="text-2xl font-bold text-success-600">
                    R$ {data.metrics.revenue.toLocaleString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Top Aulas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.topPerforming.classes.map((classItem, index) => (
                  <div key={classItem.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{classItem.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{classItem.students} alunos</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{classItem.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {formatNumber(classItem.views)} views
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Categorias Populares</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topPerforming.categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{category.percentage}%</span>
                        {getTrendIcon(category.growth)}
                        <span className={cn("text-xs", getTrendColor(category.growth))}>
                          {Math.abs(category.growth)}%
                        </span>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
)
AnalyticsDashboard.displayName = "AnalyticsDashboard"

// 📤 EXPORTS
export {
  AnalyticsDashboard
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Analytics Dashboard para professor
 * <AnalyticsDashboard
 *   data={{
 *     period: "30d",
 *     metrics: {
 *       totalViews: 15420,
 *       totalStudents: 286,
 *       totalClasses: 24,
 *       averageRating: 4.7,
 *       completionRate: 85,
 *       engagement: 92,
 *       revenue: 5420
 *     },
 *     trends: {
 *       views: 12.5,
 *       students: 8.3,
 *       classes: 4.2,
 *       rating: 2.1
 *     },
 *     chartData: {
 *       labels: ["Jan", "Fev", "Mar", "Abr"],
 *       datasets: [{
 *         name: "Visualizações",
 *         data: [1200, 1350, 1100, 1420],
 *         color: "#3b82f6"
 *       }]
 *     },
 *     topPerforming: {
 *       classes: [
 *         {
 *           id: "1",
 *           name: "React Fundamentals",
 *           students: 45,
 *           rating: 4.9,
 *           views: 1250
 *         }
 *       ],
 *       categories: [
 *         {
 *           name: "Programação",
 *           percentage: 65,
 *           growth: 12.5
 *         }
 *       ]
 *     }
 *   }}
 *   userType="professor"
 *   onPeriodChange={(period) => console.log('Period changed:', period)}
 *   onRefresh={() => console.log('Refreshing...')}
 *   onExport={() => console.log('Exporting...')}
 * />
 */
