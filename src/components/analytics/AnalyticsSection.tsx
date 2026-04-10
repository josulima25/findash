'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle2, Info, TrendingUp, TrendingDown, Calendar, Clock, DollarSign, Target, AlertCircle } from 'lucide-react'
import { getAnalyticsData, AnalyticsData } from '@/lib/storage'
import { cn } from '@/lib/utils'

const COLORS = ['#f97316', '#3b82f6', '#8b5cf6', '#10b981', '#6b7280']

export function AnalyticsSection() {
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    setData(getAnalyticsData())
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Carregando analytics...</p>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-rose-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getInsightBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-500/10 border-orange-500/20'
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20'
      case 'alert':
        return 'bg-rose-500/10 border-rose-500/20'
      default:
        return 'bg-blue-500/10 border-blue-500/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics Inteligente</h2>
        <p className="text-muted-foreground">
          Análises detalhadas e insights automáticos das suas finanças
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.saldoAtual)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total disponível
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projeção Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              data.projectedBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}>
              {formatCurrency(data.projectedBalance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Saldo projetado final do mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.dailyAverage)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Gasto médio por dia
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Mensal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalEntradas - data.totalSaidas)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Entradas - Saídas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Evolution */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyEvolution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                />
                <Line type="monotone" dataKey="entradas" stroke="#10b981" strokeWidth={2} name="Entradas" />
                <Line type="monotone" dataKey="saidas" stroke="#f43f5e" strokeWidth={2} name="Saídas" />
                <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} name="Saldo" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Spending */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categorySpending}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {data.categorySpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown Chart */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Detalhamento por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.categorySpending}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="category" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Expenses */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Top 3 Maiores Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.topExpenses.length > 0 ? (
              data.topExpenses.map((expense, index) => {
                const formattedDate = (() => {
                  try {
                    return new Date(expense.data).toLocaleDateString('pt-BR')
                  } catch {
                    return '--/--/--'
                  }
                })()
                return (
                  <div key={expense.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{expense.descricao}</p>
                        <p className="text-xs text-muted-foreground">{expense.categoria}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-rose-600 dark:text-rose-400">
                        {formatCurrency(expense.valor)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma despesa registrada
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Excess Categories Alert */}
      {data.excessCategories.length > 0 && (
        <Card className="border-2 border-orange-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Categorias com Excesso de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {data.excessCategories.map((cat, index) => (
                <div key={index} className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{cat.category}</span>
                    <Badge variant="destructive" className="text-xs">
                      {cat.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(cat.amount)} gasto nesta categoria
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                    ⚠️ Acima do limite recomendado de 25%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Insights Automáticos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {data.insights.length > 0 ? (
              data.insights.map((insight, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4",
                    getInsightBgColor(insight.type)
                  )}
                >
                  <div className="mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Adicione transações e metas para gerar insights automáticos
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
