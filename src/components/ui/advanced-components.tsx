import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Bell,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Share2,
  Download,
  Eye,
  MoreVertical
} from "lucide-react"

// ✨ STUDY TIMER VARIANTS
const studyTimerVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      size: {
        compact: "p-4",
        default: "p-6",
        large: "p-8"
      },
      variant: {
        default: "border-neutral-200",
        focus: "border-primary-300 bg-primary-50 dark:bg-primary-950",
        break: "border-success-300 bg-success-50 dark:bg-success-950",
        pomodoro: "border-danger-300 bg-danger-50 dark:bg-danger-950"
      },
      mode: {
        study: "",
        break: "",
        longBreak: ""
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      mode: "study"
    }
  }
)

// 🎯 TYPES
export interface StudySession {
  id: string
  subject: string
  duration: number // em minutos
  breakDuration?: number
  longBreakDuration?: number
  sessionsBeforeLongBreak?: number
  autoStartBreaks?: boolean
  enableNotifications?: boolean
  soundEnabled?: boolean
}

export interface StudyTimerProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof studyTimerVariants> {
  /**
   * Configuração da sessão de estudo
   */
  session: StudySession
  /**
   * Tempo inicial em segundos
   */
  initialTime?: number
  /**
   * Se está ativo/executando
   */
  isActive?: boolean
  /**
   * Modo atual (estudo, pausa, pausa longa)
   */
  currentMode?: "study" | "break" | "longBreak"
  /**
   * Número da sessão atual
   */
  sessionNumber?: number
  /**
   * Callback quando inicia
   */
  onStart?: () => void
  /**
   * Callback quando pausa
   */
  onPause?: () => void
  /**
   * Callback quando para
   */
  onStop?: () => void
  /**
   * Callback quando reseta
   */
  onReset?: () => void
  /**
   * Callback quando completa
   */
  onComplete?: (mode: "study" | "break" | "longBreak") => void
  /**
   * Callback para configurações
   */
  onSettings?: () => void
}

// ⏰ STUDY TIMER COMPONENT
const StudyTimer = React.forwardRef<HTMLDivElement, StudyTimerProps>(
  (
    {
      className,
      session,
      initialTime = 25 * 60, // 25 minutos padrão
      isActive = false,
      currentMode = "study",
      sessionNumber = 1,
      onStart,
      onPause,
      onStop,
      onReset,
      onComplete,
      onSettings,
      size,
      variant,
      mode,
      ...props
    },
    ref
  ) => {
    const [timeLeft, setTimeLeft] = React.useState(initialTime)
    const [isRunning, setIsRunning] = React.useState(isActive)
    const intervalRef = React.useRef<NodeJS.Timeout>()

    // Determinar variante baseada no modo
    const getVariant = () => {
      switch (currentMode) {
        case "study": return "focus"
        case "break": return "break"
        case "longBreak": return "pomodoro"
        default: return variant || "default"
      }
    }

    // Formatação do tempo
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // Configuração do modo
    const getModeConfig = () => {
      switch (currentMode) {
        case "study":
          return {
            title: session.subject,
            subtitle: `Sessão ${sessionNumber} - Foco`,
            color: "#3b82f6",
            duration: session.duration * 60
          }
        case "break":
          return {
            title: "Pausa Curta",
            subtitle: "Relaxe um pouco",
            color: "#10b981",
            duration: (session.breakDuration || 5) * 60
          }
        case "longBreak":
          return {
            title: "Pausa Longa",
            subtitle: "Descanso merecido!",
            color: "#f59e0b",
            duration: (session.longBreakDuration || 15) * 60
          }
        default:
          return {
            title: session.subject,
            subtitle: "Sessão de estudo",
            color: "#3b82f6",
            duration: session.duration * 60
          }
      }
    }

    const modeConfig = getModeConfig()
    const progress = ((modeConfig.duration - timeLeft) / modeConfig.duration) * 100

    // Timer logic
    React.useEffect(() => {
      if (isRunning && timeLeft > 0) {
        intervalRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setIsRunning(false)
              onComplete?.(currentMode)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }, [isRunning, timeLeft, currentMode, onComplete])

    const handleStart = () => {
      setIsRunning(true)
      onStart?.()
    }

    const handlePause = () => {
      setIsRunning(false)
      onPause?.()
    }

    const handleReset = () => {
      setIsRunning(false)
      setTimeLeft(modeConfig.duration)
      onReset?.()
    }

    return (
      <Card
        ref={ref}
        className={cn(
          studyTimerVariants({ size, variant: getVariant(), mode: currentMode }),
          className
        )}
        {...props}
      >
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{modeConfig.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{modeConfig.subtitle}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {session.soundEnabled && (
                <Button variant="ghost" size="sm">
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onSettings}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Timer circular */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-neutral-200 dark:text-neutral-700"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={modeConfig.color}
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              
              {/* Time display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold" style={{ color: modeConfig.color }}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {Math.round(progress)}% completo
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-2"
              style={{ 
                '--progress-background': modeConfig.color 
              } as React.CSSProperties}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Início</span>
              <span>{formatTime(modeConfig.duration - timeLeft)} / {formatTime(modeConfig.duration)}</span>
              <span>Fim</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <Button 
                onClick={handleStart}
                size="lg"
                style={{ backgroundColor: modeConfig.color }}
                className="min-w-[120px]"
              >
                <Play className="h-5 w-5 mr-2" />
                Iniciar
              </Button>
            ) : (
              <Button 
                onClick={handlePause}
                variant="outline"
                size="lg"
                className="min-w-[120px]"
              >
                <Pause className="h-5 w-5 mr-2" />
                Pausar
              </Button>
            )}
            
            <Button 
              onClick={handleReset}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          {/* Session info */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold">{sessionNumber}</div>
              <div className="text-xs text-muted-foreground">Sessão</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{session.duration}min</div>
              <div className="text-xs text-muted-foreground">Duração</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {session.sessionsBeforeLongBreak || 4}
              </div>
              <div className="text-xs text-muted-foreground">Meta</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)
StudyTimer.displayName = "StudyTimer"

// 📅 AGENDA COMPONENT
export interface AgendaEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  type: "aula" | "prova" | "reuniao" | "estudo" | "outros"
  location?: string
  participants?: number
  professor?: {
    nome: string
    avatar?: string
  }
  isOnline?: boolean
  status: "confirmado" | "pendente" | "cancelado"
  canJoin?: boolean
  meetingUrl?: string
}

export interface AgendaProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Eventos do dia
   */
  events: AgendaEvent[]
  /**
   * Data selecionada
   */
  selectedDate?: Date
  /**
   * Se deve mostrar horários
   */
  showTimeSlots?: boolean
  /**
   * Callback ao clicar em evento
   */
  onEventClick?: (event: AgendaEvent) => void
  /**
   * Callback para entrar na aula
   */
  onJoinClass?: (event: AgendaEvent) => void
  /**
   * Callback para criar evento
   */
  onCreateEvent?: (time?: Date) => void
}

const Agenda = React.forwardRef<HTMLDivElement, AgendaProps>(
  (
    {
      className,
      events,
      selectedDate = new Date(),
      showTimeSlots = true,
      onEventClick,
      onJoinClass,
      onCreateEvent,
      ...props
    },
    ref
  ) => {
    const typeColors = {
      aula: "bg-blue-500",
      prova: "bg-red-500",
      reuniao: "bg-purple-500",
      estudo: "bg-green-500",
      outros: "bg-gray-500"
    }

    const typeLabels = {
      aula: "Aula",
      prova: "Prova",
      reuniao: "Reunião",
      estudo: "Estudo",
      outros: "Outros"
    }

    const statusColors = {
      confirmado: "text-success-600",
      pendente: "text-warning-600",
      cancelado: "text-danger-600"
    }

    // Gerar slots de tempo (7h às 22h)
    const generateTimeSlots = () => {
      const slots = []
      for (let hour = 7; hour <= 22; hour++) {
        slots.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, 0))
      }
      return slots
    }

    const timeSlots = generateTimeSlots()

    // Encontrar eventos para um horário específico
    const getEventsForTime = (time: Date) => {
      return events.filter(event => {
        const eventStart = new Date(event.startTime)
        return eventStart.getHours() === time.getHours()
      })
    }

    // Verificar se um horário está ocupado
    const isTimeOccupied = (time: Date) => {
      return events.some(event => {
        const eventStart = new Date(event.startTime)
        const eventEnd = new Date(event.endTime)
        return time >= eventStart && time < eventEnd
      })
    }

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    return (
      <Card ref={ref} className={cn("", className)} {...props}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Agenda - {selectedDate.toLocaleDateString()}</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onCreateEvent?.()}>
              Novo evento
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {showTimeSlots ? (
            // Vista com slots de tempo
            <div className="space-y-2">
              {timeSlots.map((time, index) => {
                const eventsAtTime = getEventsForTime(time)
                const isOccupied = isTimeOccupied(time)
                
                return (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-center space-x-4 p-3 rounded-lg border transition-colors",
                      {
                        "bg-neutral-50 dark:bg-neutral-900": isOccupied,
                        "hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer": !isOccupied
                      }
                    )}
                    onClick={!isOccupied ? () => onCreateEvent?.(time) : undefined}
                  >
                    {/* Horário */}
                    <div className="w-20 text-sm font-medium text-muted-foreground">
                      {formatTime(time)}
                    </div>

                    {/* Eventos ou slot vazio */}
                    <div className="flex-1">
                      {eventsAtTime.length > 0 ? (
                        <div className="space-y-2">
                          {eventsAtTime.map((event) => (
                            <div
                              key={event.id}
                              className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow"
                              onClick={() => onEventClick?.(event)}
                            >
                              <div className="flex items-center space-x-3">
                                {/* Indicador de tipo */}
                                <div 
                                  className={cn("w-3 h-3 rounded-full", typeColors[event.type])}
                                />
                                
                                <div>
                                  <h4 className="font-medium">{event.title}</h4>
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {typeLabels[event.type]}
                                    </Badge>
                                    <span className={statusColors[event.status]}>
                                      {event.status}
                                    </span>
                                  </div>
                                  
                                  {event.location && (
                                    <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Ações */}
                              <div className="flex items-center space-x-2">
                                {event.canJoin && (
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onJoinClass?.(event)
                                    }}
                                  >
                                    Entrar
                                  </Button>
                                )}
                                
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground italic">
                          Clique para adicionar evento
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Vista de lista simples
            <div className="space-y-3">
              {events.length > 0 ? (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn("w-4 h-4 rounded-full", typeColors[event.type])} />
                      
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                          {event.location && (
                            <>
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{typeLabels[event.type]}</Badge>
                      {event.canJoin && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onJoinClass?.(event)
                          }}
                        >
                          Entrar
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum evento agendado para hoje</p>
                  <Button variant="outline" className="mt-4" onClick={() => onCreateEvent?.()}>
                    Criar primeiro evento
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)
Agenda.displayName = "Agenda"

// 📤 EXPORTS
export {
  StudyTimer,
  Agenda,
  studyTimerVariants
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Study Timer
 * <StudyTimer
 *   session={{
 *     id: "1",
 *     subject: "Matemática",
 *     duration: 25,
 *     breakDuration: 5,
 *     longBreakDuration: 15,
 *     sessionsBeforeLongBreak: 4,
 *     enableNotifications: true,
 *     soundEnabled: true
 *   }}
 *   currentMode="study"
 *   sessionNumber={1}
 *   onStart={() => console.log('Started')}
 *   onComplete={(mode) => console.log('Completed:', mode)}
 * />
 * 
 * // Agenda
 * <Agenda
 *   events={[
 *     {
 *       id: "1",
 *       title: "Aula de React",
 *       startTime: new Date(2024, 0, 15, 14, 0),
 *       endTime: new Date(2024, 0, 15, 16, 0),
 *       type: "aula",
 *       status: "confirmado",
 *       canJoin: true,
 *       professor: { nome: "João Silva" }
 *     }
 *   ]}
 *   selectedDate={new Date()}
 *   showTimeSlots
 *   onEventClick={(event) => console.log('Event clicked:', event)}
 *   onJoinClass={(event) => console.log('Joining:', event)}
 * />
 */
