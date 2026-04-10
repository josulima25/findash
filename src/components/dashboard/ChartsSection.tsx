'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'
import { getMonthlyEvolution, getMonthlyFutureExpenses } from '@/lib/storage'

const categoryData = [
  { name: 'Alimentação', value: 35, color: '#f97316' },
  { name: 'Transporte', value: 20, color: '#3b82f6' },
  { name: 'Lazer', value: 15, color: '#8b5cf6' },
  { name: 'Moradia', value: 20, color: '#10b981' },
  { name: 'Outros', value: 10, color: '#6b7280' },
]

const formatMonthShort = (monthStr: string) => {
  if (!monthStr) return 'Data inválida'
  const parts = monthStr.split('-')
  if (parts.length < 2) return monthStr
  const [year, month] = parts
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const monthIndex = parseInt(month) - 1
  if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11 || !year) return monthStr
  return `${monthNames[monthIndex]} ${year.slice(2)}`
}

export function ChartsSection() {
  const [chartData, setChartData] = useState<any[]>([])
  const [futureExpensesData, setFutureExpensesData] = useState<any[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const monthlyEvolution = getMonthlyEvolution()
    const futureExpenses = getMonthlyFutureExpenses(6)

    // Combinar dados históricos com projeções futuras
    const combinedData = monthlyEvolution.map(month => ({
      ...month,
      parcelasFuturas: 0,
      saldoComParcelas: month.saldo,
    }))

    // Adicionar parcelas futuras aos meses correspondentes
    futureExpenses.forEach(future => {
      if (!future.month) return

      const existingMonth = combinedData.find(m => m.month === formatMonthShort(future.month))
      if (existingMonth) {
        existingMonth.parcelasFuturas = future.value || 0
        existingMonth.saldoComParcelas = existingMonth.saldo - (future.value || 0)
      } else {
        // Adicionar novo mês se não existir
        const newMonth = {
          month: formatMonthShort(future.month),
          entradas: 0,
          saidas: 0,
          saldo: 0,
          parcelasFuturas: future.value || 0,
          saldoComParcelas: -(future.value || 0),
        }
        combinedData.push(newMonth)
      }
    })

    setChartData(combinedData)
    setFutureExpensesData(futureExpenses)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Fluxo Financeiro com Parcelas Futuras</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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
              <Bar dataKey="entrada" fill="hsl(var(--success))" name="Entradas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saida" fill="hsl(var(--destructive))" name="Saídas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="parcelasFuturas" fill="hsl(var(--primary))" name="Parcelas Futuras" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2 md:col-span-1">
        <CardHeader>
          <CardTitle>Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                formatter={(value: number) => [`${value}%`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2 md:col-span-1">
        <CardHeader>
          <CardTitle>Projeção de Saldo Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
              <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} name="Saldo Atual" />
              <Line type="monotone" dataKey="saldoComParcelas" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" name="Saldo c/ Parcelas" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
