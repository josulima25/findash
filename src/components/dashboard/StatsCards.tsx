'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, CreditCard, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getGoalsSummary, getProfile } from '@/lib/storage'

interface StatsCardsProps {
  stats: {
    totalEntradas: number
    totalSaidas: number
    saldo: number
    totalCartoes: number
    faturaTotal: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const [mainGoal, setMainGoal] = useState('')
  const [goalsSummary, setGoalsSummary] = useState({
    totalMetas: 0,
    metasConcluidas: 0,
    metasEmAndamento: 0,
    valorTotalAlvo: 0,
    valorTotalAcumulado: 0,
    valorRestante: 0,
    progressoGeral: 0,
  })

  useEffect(() => {
    const profile = getProfile()
    setMainGoal(profile.mainGoal)
    setGoalsSummary(getGoalsSummary())
  }, [])

  const cards = [
    {
      title: 'Saldo Total',
      value: stats.saldo,
      icon: Wallet,
      trend: stats.saldo >= 0 ? 12.5 : -8.3,
      trendUp: stats.saldo >= 0,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    },
    {
      title: 'Entradas',
      value: stats.totalEntradas,
      icon: TrendingUp,
      trend: 8.2,
      trendUp: true,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    },
    {
      title: 'Saídas',
      value: stats.totalSaidas,
      icon: TrendingDown,
      trend: -3.1,
      trendUp: false,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-100 dark:bg-rose-900/20',
    },
    {
      title: mainGoal || 'Metas',
      value: goalsSummary.totalMetas,
      icon: Target,
      trend: goalsSummary.progressoGeral,
      trendUp: true,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      isGoalsCard: true,
      goalsSummary,
    },
  ]

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatTrend = (trend: number) => {
    return `${Math.abs(trend)}% vs mês anterior`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="overflow-hidden border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={cn('rounded-lg p-2', card.bgColor)}>
                <Icon className={cn('h-4 w-4', card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.isGoalsCard ? `${card.value} metas` : formatValue(card.value)}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {card.isGoalsCard ? (
                  <>
                    <span className="font-semibold text-primary">
                      {card.goalsSummary.progressoGeral.toFixed(1)}%
                    </span>
                    <span> concluído</span>
                  </>
                ) : (
                  <>
                    {card.trendUp ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-rose-600" />
                    )}
                    <span className={cn(card.trendUp ? 'text-emerald-600' : 'text-rose-600')}>
                      {formatTrend(card.trend)}
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
