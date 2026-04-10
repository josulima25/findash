'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GoalCard } from './GoalCard'
import { GoalModal } from './GoalModal'
import { Button } from '@/components/ui/button'
import { Plus, Target, TrendingUp, CheckCircle2 } from 'lucide-react'
import { FinancialGoal } from '@/types'
import { getGoals, addGoal, updateGoal, deleteGoal, getGoalsSummary } from '@/lib/storage'

export function GoalsSection() {
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    setGoals(getGoals())
  }

  const handleCreateGoal = () => {
    setSelectedGoal(null)
    setIsModalOpen(true)
  }

  const handleEditGoal = (goal: FinancialGoal) => {
    setSelectedGoal(goal)
    setIsModalOpen(true)
  }

  const handleSaveGoal = (goalData: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    if (selectedGoal) {
      updateGoal(selectedGoal.id, goalData)
    } else {
      addGoal(goalData)
    }
    loadGoals()
  }

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      deleteGoal(goalId)
      loadGoals()
    }
  }

  const summary = getGoalsSummary()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Metas Financeiras</h2>
          <p className="text-muted-foreground">
            Defina e acompanhe seus objetivos financeiros
          </p>
        </div>
        <Button onClick={handleCreateGoal} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Metas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalMetas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.metasConcluidas} concluídas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Alvo Total</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.valorTotalAlvo)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Somatório de todas as metas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Acumulado</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(summary.valorTotalAcumulado)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.progressoGeral.toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Falta</CardTitle>
            <Target className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(summary.valorRestante)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.metasEmAndamento} em andamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-base">Progresso Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total acumulado</span>
              <span className="font-semibold">{summary.progressoGeral.toFixed(1)}%</span>
            </div>
            <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${summary.progressoGeral}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card className="border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhuma meta financeira criada ainda.
              <br />
              Clique em "Nova Meta" para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <GoalModal
        goal={selectedGoal}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveGoal}
      />
    </div>
  )
}
