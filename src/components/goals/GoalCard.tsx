'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Target, Calendar, TrendingUp, Edit, Trash2, CheckCircle2 } from 'lucide-react'
import { FinancialGoal } from '@/types'
import { getGoalProgress } from '@/lib/storage'
import { cn } from '@/lib/utils'

interface GoalCardProps {
  goal: FinancialGoal
  onEdit: (goal: FinancialGoal) => void
  onDelete: (goalId: string) => void
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const progress = getGoalProgress(goal)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('pt-BR')
  }

  const isOverdue = !progress.concluida && progress.diasRestantes === 0

  return (
    <Card className={cn(
      "overflow-hidden border-2 transition-all hover:shadow-lg",
      progress.concluida && "border-emerald-600/50",
      isOverdue && "border-rose-600/50"
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Target className={cn(
              "h-5 w-5",
              progress.concluida ? "text-emerald-600 dark:text-emerald-400" : "text-primary"
            )} />
            <CardTitle className={cn(
              "text-base",
              progress.concluida && "line-through text-muted-foreground"
            )}>
              {goal.nome}
            </CardTitle>
            {progress.concluida && (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(goal)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/20"
            onClick={() => onDelete(goal.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className={cn(
              "font-semibold",
              progress.concluida ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
            )}>
              {progress.percentual.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={progress.percentual}
            className={cn(
              "h-3",
              progress.concluida && "[&>div]:bg-emerald-600"
            )}
          />
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Acumulado</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(goal.valorAcumulado)}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs text-muted-foreground">Meta</p>
            <p className="text-lg font-bold">
              {formatCurrency(goal.valorAlvo)}
            </p>
          </div>
        </div>

        {/* Remaining Value */}
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Falta</span>
            <span className={cn(
              "font-semibold",
              progress.valorRestante <= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-foreground"
            )}>
              {formatCurrency(Math.max(0, progress.valorRestante))}
            </span>
          </div>
        </div>

        {/* Deadline Info */}
        <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground">Prazo</p>
              <p className={cn(
                "text-sm font-semibold",
                isOverdue && "text-rose-600 dark:text-rose-400"
              )}>
                {formatDate(goal.prazoFinal)}
              </p>
            </div>
          </div>
          <Badge
            variant={isOverdue ? "destructive" : progress.concluida ? "default" : "secondary"}
            className="text-xs"
          >
            {progress.concluida
              ? "Concluída"
              : isOverdue
              ? "Atrasada"
              : `${progress.diasRestantes} dias`}
          </Badge>
        </div>

        {/* Forecast */}
        {progress.previsaoConclusao && !progress.concluida && (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground">Previsão de conclusão</p>
              <p className="text-sm font-semibold text-primary">
                {formatDate(progress.previsaoConclusao)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
