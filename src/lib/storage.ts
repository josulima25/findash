'use client'

import { CreditCard, Transaction, FinancialGoal, UserProfile } from '@/types'

const STORAGE_KEYS = {
  CARDS: 'findash_cards',
  TRANSACTIONS: 'findash_transactions',
  GOALS: 'findash_goals',
  PROFILE: 'findash_profile',
}

const initialCards: CreditCard[] = [
  {
    id: '1',
    nome: 'Nubank',
    banco: 'Nubank',
    bandeira: 'mastercard',
    final: '1234',
    limiteTotal: 5000,
    faturaAtual: 850.50,
    fechamento: 10,
    vencimento: 15,
  },
  {
    id: '2',
    nome: 'Inter',
    banco: 'Banco Inter',
    bandeira: 'visa',
    final: '5678',
    limiteTotal: 8000,
    faturaAtual: 1240.00,
    fechamento: 15,
    vencimento: 20,
  },
]

const initialTransactions: Transaction[] = [
  {
    id: '1',
    descricao: 'Salário',
    valor: 8500,
    tipo: 'entrada',
    categoria: 'Renda',
    data: new Date().toISOString(),
  },
  {
    id: '2',
    descricao: 'Supermercado',
    valor: 450,
    tipo: 'saida',
    categoria: 'Alimentação',
    data: new Date().toISOString(),
    cartaoId: '1',
  },
  {
    id: '3',
    descricao: 'Restaurante',
    valor: 120,
    tipo: 'saida',
    categoria: 'Alimentação',
    data: new Date().toISOString(),
    cartaoId: '2',
  },
]

export const getCards = (): CreditCard[] => {
  if (typeof window === 'undefined') return initialCards
  const stored = localStorage.getItem(STORAGE_KEYS.CARDS)
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(initialCards))
    return initialCards
  }
  return JSON.parse(stored)
}

export const saveCards = (cards: CreditCard[]): void => {
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards))
}

export const getTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return initialTransactions
  const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initialTransactions))
    return initialTransactions
  }
  return JSON.parse(stored)
}

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
}

export const updateCard = (cardId: string, updatedCard: Partial<CreditCard>): void => {
  const cards = getCards()
  const index = cards.findIndex(c => c.id === cardId)
  if (index !== -1) {
    cards[index] = { ...cards[index], ...updatedCard }
    saveCards(cards)
  }
}

export const getCardById = (cardId: string): CreditCard | undefined => {
  const cards = getCards()
  return cards.find(c => c.id === cardId)
}

export const calculateMelhorDia = (fechamento: number): number => {
  return fechamento + 1 > 31 ? 1 : fechamento + 1
}

export const getLimiteDisponivel = (limiteTotal: number, faturaAtual: number): number => {
  return limiteTotal - faturaAtual
}

// Goals Functions
const initialGoals: FinancialGoal[] = [
  {
    id: '1',
    nome: 'Viagem Internacional',
    valorAlvo: 15000,
    valorAcumulado: 6500,
    prazoFinal: '2025-12-31',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Reserva de Emergência',
    valorAlvo: 24000,
    valorAcumulado: 12000,
    prazoFinal: '2025-06-30',
    createdAt: new Date().toISOString(),
  },
]

export const getGoals = (): FinancialGoal[] => {
  if (typeof window === 'undefined') return initialGoals
  const stored = localStorage.getItem(STORAGE_KEYS.GOALS)
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(initialGoals))
    return initialGoals
  }
  return JSON.parse(stored)
}

export const saveGoals = (goals: FinancialGoal[]): void => {
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals))
}

export const addGoal = (goal: Omit<FinancialGoal, 'id' | 'createdAt'>): FinancialGoal => {
  const goals = getGoals()
  const newGoal: FinancialGoal = {
    ...goal,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  goals.push(newGoal)
  saveGoals(goals)
  return newGoal
}

export const updateGoal = (goalId: string, updatedGoal: Partial<FinancialGoal>): void => {
  const goals = getGoals()
  const index = goals.findIndex(g => g.id === goalId)
  if (index !== -1) {
    goals[index] = { ...goals[index], ...updatedGoal }
    saveGoals(goals)
  }
}

export const deleteGoal = (goalId: string): void => {
  const goals = getGoals()
  const filtered = goals.filter(g => g.id !== goalId)
  saveGoals(filtered)
}

export const getGoalProgress = (goal: FinancialGoal) => {
  const percentual = (goal.valorAcumulado / goal.valorAlvo) * 100
  const valorRestante = goal.valorAlvo - goal.valorAcumulado
  const prazoFinal = new Date(goal.prazoFinal)
  const hoje = new Date()
  const diasRestantes = Math.max(0, Math.ceil((prazoFinal.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)))

  // Previsão de conclusão baseada no ritmo atual
  const diasDesdeCriacao = Math.max(1, Math.ceil((hoje.getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
  const ritmoDiario = goal.valorAcumulado / diasDesdeCriacao
  const diasParaConcluir = ritmoDiario > 0 ? Math.ceil(valorRestante / ritmoDiario) : 0
  const previsaoConclusao = diasParaConcluir > 0
    ? new Date(hoje.getTime() + diasParaConcluir * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : null

  return {
    percentual: Math.min(100, percentual),
    valorRestante,
    diasRestantes,
    previsaoConclusao,
    concluida: percentual >= 100,
  }
}

export const getGoalsSummary = () => {
  const goals = getGoals()
  const totalMetas = goals.length
  const metasConcluidas = goals.filter(g => (g.valorAcumulado / g.valorAlvo) >= 1).length
  const valorTotalAlvo = goals.reduce((acc, g) => acc + g.valorAlvo, 0)
  const valorTotalAcumulado = goals.reduce((acc, g) => acc + g.valorAcumulado, 0)
  const progressoGeral = valorTotalAlvo > 0 ? (valorTotalAcumulado / valorTotalAlvo) * 100 : 0

  return {
    totalMetas,
    metasConcluidas,
    metasEmAndamento: totalMetas - metasConcluidas,
    valorTotalAlvo,
    valorTotalAcumulado,
    valorRestante: valorTotalAlvo - valorTotalAcumulado,
    progressoGeral,
  }
}

// Analytics Functions
export interface CategorySpending {
  category: string
  amount: number
  percentage: number
  trend: number
}

export interface MonthlyEvolution {
  month: string
  entradas: number
  saidas: number
  saldo: number
}

export interface TopExpense {
  id: string
  descricao: string
  valor: number
  categoria: string
  data: string
}

export interface AnalyticsData {
  categorySpending: CategorySpending[]
  monthlyEvolution: MonthlyEvolution[]
  topExpenses: TopExpense[]
  dailyAverage: number
  totalEntradas: number
  totalSaidas: number
  saldoAtual: number
  projectedBalance: number
  insights: Insight[]
  excessCategories: CategorySpending[]
}

export interface Insight {
  type: 'warning' | 'success' | 'info' | 'alert'
  title: string
  description: string
  icon?: string
}

export const getCategorySpending = (): CategorySpending[] => {
  const transactions = getTransactions()
  const expenses = transactions.filter(t => t.tipo === 'saida')

  const categoryMap = new Map<string, number>()
  expenses.forEach(t => {
    const current = categoryMap.get(t.categoria) || 0
    categoryMap.set(t.categoria, current + t.valor)
  })

  const total = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0)

  return Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount,
    percentage: total > 0 ? (amount / total) * 100 : 0,
    trend: Math.random() * 20 - 10, // Simulated trend for demo
  })).sort((a, b) => b.amount - a.amount)
}

export const getMonthlyEvolution = (): MonthlyEvolution[] => {
  const transactions = getTransactions()
  const months: Map<string, { entradas: number; saidas: number }> = new Map()

  transactions.forEach(t => {
    const date = new Date(t.data)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!months.has(monthKey)) {
      months.set(monthKey, { entradas: 0, saidas: 0 })
    }

    const monthData = months.get(monthKey)!
    if (t.tipo === 'entrada') {
      monthData.entradas += t.valor
    } else {
      monthData.saidas += t.valor
    }
  })

  return Array.from(months.entries())
    .map(([month, data]) => ({
      month: formatMonth(month),
      entradas: data.entradas,
      saidas: data.saidas,
      saldo: data.entradas - data.saidas,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6) // Last 6 months
}

export const getTopExpenses = (limit: number = 3): TopExpense[] => {
  const transactions = getTransactions()
  const expenses = transactions
    .filter(t => t.tipo === 'saida')
    .sort((a, b) => b.valor - a.valor)
    .slice(0, limit)

  return expenses.map(t => ({
    id: t.id,
    descricao: t.descricao,
    valor: t.valor,
    categoria: t.categoria,
    data: t.data,
  }))
}

export const getDailyAverage = (): number => {
  const transactions = getTransactions()
  const expenses = transactions.filter(t => t.tipo === 'saida')
  const totalExpenses = expenses.reduce((sum, t) => sum + t.valor, 0)

  // Calculate days from first transaction
  if (expenses.length === 0) return 0

  const dates = expenses.map(t => new Date(t.data).getTime())
  const minDate = Math.min(...dates)
  const maxDate = Math.max(...dates)
  const daysDiff = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)))

  return totalExpenses / daysDiff
}

export const getProjectedBalance = (): number => {
  const transactions = getTransactions()
  const currentBalance = transactions.reduce(
    (sum, t) => sum + (t.tipo === 'entrada' ? t.valor : -t.valor),
    0
  )

  const dailyAvg = getDailyAverage()
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const daysRemaining = daysInMonth - new Date().getDate()

  // Considerar parcelas futuras do mês atual
  const futureInstallments = getFutureInstallments()
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const currentMonthInstallments = futureInstallments
    .filter(inst => {
      const instDate = new Date(inst.data)
      return instDate.getMonth() === currentMonth && instDate.getFullYear() === currentYear
    })
    .reduce((sum, inst) => sum + inst.valor, 0)

  return currentBalance - (dailyAvg * daysRemaining) - currentMonthInstallments
}

export const generateInsights = (): Insight[] => {
  const insights: Insight[] = []
  const categorySpending = getCategorySpending()
  const goals = getGoals()
  const dailyAvg = getDailyAverage()

  // Future installments insight
  const futureInstallments = getFutureInstallments()
  const currentMonthInstallments = futureInstallments.filter(inst => {
    const instDate = new Date(inst.data)
    const now = new Date()
    return instDate.getMonth() === now.getMonth() && instDate.getFullYear() === now.getFullYear()
  })

  if (currentMonthInstallments.length > 0) {
    const totalMonthlyInstallments = currentMonthInstallments.reduce((sum, inst) => sum + inst.valor, 0)
    insights.push({
      type: 'info',
      title: `${currentMonthInstallments.length} parcela(s) este mês`,
      description: `Você tem ${currentMonthInstallments.length} parcela(s) no valor total de ${formatCurrency(totalMonthlyInstallments)} para pagar este mês.`,
      icon: 'calendar',
    })
  }

  const futureTotal = futureInstallments.reduce((sum, inst) => sum + inst.valor, 0)
  if (futureTotal > 0) {
    insights.push({
      type: 'warning',
      title: 'Compromissos futuros',
      description: `Você tem ${formatCurrency(futureTotal)} em parcelas futuras nos próximos meses. Planeje seu orçamento!`,
      icon: 'trending-down',
    })
  }

  // Category spending insights
  categorySpending.forEach(cat => {
    if (cat.percentage > 30) {
      insights.push({
        type: 'warning',
        title: `${cat.category} acima da média`,
        description: `Você gastou ${cat.percentage.toFixed(0)}% em ${cat.category}. Considere reduzir este gasto.`,
        icon: 'alert-triangle',
      })
    } else if (cat.percentage > 20) {
      insights.push({
        type: 'info',
        title: `Gasto moderado em ${cat.category}`,
        description: `${cat.percentage.toFixed(0)}% do seu orçamento vai para ${cat.category}.`,
        icon: 'info',
      })
    }
  })

  // Goals insights
  goals.forEach(goal => {
    const progress = getGoalProgress(goal)
    const diasParaConcluir = progress.diasRestantes > 0 ? (progress.valorRestante / (goal.valorAcumulado / Math.max(1, Math.ceil((new Date().getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24))))) : 0
    if (progress.diasRestantes <= 30 && !progress.concluida) {
      const mesesParaConcluir = diasParaConcluir > 0 ? Math.ceil(diasParaConcluir / 30) : 0
      insights.push({
        type: 'alert',
        title: `Meta "${goal.nome}" com prazo próximo`,
        description: progress.diasRestantes <= 0
          ? `Meta atrasada! Faltam ${formatCurrency(progress.valorRestante)}.`
          : `Faltam ${progress.diasRestantes} dias. Mantenha o ritmo para concluir.`,
        icon: 'clock',
      })
    } else if (progress.previsaoConclusao) {
      const previsaoDate = new Date(progress.previsaoConclusao + 'T00:00:00')
      const prazoDate = new Date(goal.prazoFinal + 'T00:00:00')
      const vaiConcluirNoPrazo = previsaoDate <= prazoDate

      if (!vaiConcluirNoPrazo) {
        insights.push({
          type: 'warning',
          title: `Meta "${goal.nome}" pode atrasar`,
          description: `No ritmo atual, será concluída em ${formatDate(progress.previsaoConclusao)}. Aumente os depósitos para atingir o prazo de ${formatDate(goal.prazoFinal)}.`,
          icon: 'trending-down',
        })
      } else {
        insights.push({
          type: 'success',
          title: `Meta "${goal.nome}" no caminho certo`,
          description: `Mantendo este ritmo, você concluirá antes do prazo! Previsão: ${formatDate(progress.previsaoConclusao)}.`,
          icon: 'check-circle',
        })
      }
    }
  })

  // Spending habits insight
  if (dailyAvg > 0) {
    const monthlyProjection = dailyAvg * 30
    insights.push({
      type: 'info',
      title: 'Média diária de gastos',
      description: `Você gasta em média ${formatCurrency(dailyAvg)} por dia. Projeção mensal: ${formatCurrency(monthlyProjection)}.`,
      icon: 'calendar',
    })
  }

  return insights.slice(0, 5) // Limit to top 5 insights
}

export const getExcessCategories = (): CategorySpending[] => {
  const categorySpending = getCategorySpending()
  return categorySpending.filter(cat => cat.percentage > 25)
}

export const getAnalyticsData = (): AnalyticsData => {
  const transactions = getTransactions()
  const totalEntradas = transactions.filter(t => t.tipo === 'entrada').reduce((sum, t) => sum + t.valor, 0)
  const totalSaidas = transactions.filter(t => t.tipo === 'saida').reduce((sum, t) => sum + t.valor, 0)

  return {
    categorySpending: getCategorySpending(),
    monthlyEvolution: getMonthlyEvolution(),
    topExpenses: getTopExpenses(3),
    dailyAverage: getDailyAverage(),
    totalEntradas,
    totalSaidas,
    saldoAtual: totalEntradas - totalSaidas,
    projectedBalance: getProjectedBalance(),
    insights: generateInsights(),
    excessCategories: getExcessCategories(),
  }
}

// Helper functions
function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${monthNames[parseInt(month) - 1]} ${year}`
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR')
}

// User Profile Functions
const initialProfile: UserProfile = {
  name: 'Usuário',
  currency: 'BRL',
  monthlyIncome: 0,
  mainGoal: 'Economizar',
}

export const getProfile = (): UserProfile => {
  if (typeof window === 'undefined') return initialProfile
  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE)
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialProfile))
    return initialProfile
  }
  return JSON.parse(stored)
}

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile))
}

export const updateProfile = (updatedProfile: Partial<UserProfile>): void => {
  const profile = getProfile()
  const newProfile = { ...profile, ...updatedProfile }
  saveProfile(newProfile)
}

export const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const getGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

// Installments Functions
export interface FutureInstallment {
  id: string
  descricao: string
  valor: number
  data: string
  cartaoId: string
  cartaoNome: string
  parcelaAtual: number
  totalParcelas: number
}

export const getFutureInstallments = (cardId?: string): FutureInstallment[] => {
  const transactions = getTransactions()
  const cards = getCards()
  const futureInstallments: FutureInstallment[] = []

  transactions.forEach(t => {
    if (t.parcelas && t.cartaoId && t.parcelaAtual) {
      const card = cards.find(c => c.id === t.cartaoId)
      if (!card) return

      if (cardId && card.id !== cardId) return

      const remainingInstallments = t.parcelas - t.parcelaAtual

      for (let i = 1; i <= remainingInstallments; i++) {
        const futureMonth = new Date(t.data)
        futureMonth.setMonth(futureMonth.getMonth() + i)

        futureInstallments.push({
          id: `${t.id}_${i}`,
          descricao: t.descricao,
          valor: t.valorPorParcela || t.valor,
          data: futureMonth.toISOString(),
          cartaoId: card.id,
          cartaoNome: card.nome,
          parcelaAtual: t.parcelaAtual + i,
          totalParcelas: t.parcelas,
        })
      }
    }
  })

  return futureInstallments.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
}

export const getCardFutureBillings = (cardId: string, monthsAhead: number = 6): { month: string; value: number }[] => {
  const futureInstallments = getFutureInstallments(cardId)
  const bills: { [key: string]: number } = {}

  futureInstallments.forEach(inst => {
    const date = new Date(inst.data)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!bills[monthKey]) {
      bills[monthKey] = 0
    }
    bills[monthKey] += inst.valor
  })

  const result = Object.entries(bills)
    .map(([month, value]) => ({ month, value }))
    .filter(item => {
      const itemDate = new Date(item.month + '-01')
      const now = new Date()
      const maxDate = new Date()
      maxDate.setMonth(maxDate.getMonth() + monthsAhead)
      return itemDate >= now && itemDate <= maxDate
    })
    .sort((a, b) => a.month.localeCompare(b.month))

  return result
}

export interface FuturePurchaseDetail {
  descricao: string
  dataCompraOriginal: string
  valorPorParcela: number
  parcelasRestantes: number
  proximasParcelas: { month: string; value: number }[]
}

export const getCardPurchasesWithInstallments = (cardId: string, monthsAhead: number = 6): FuturePurchaseDetail[] => {
  const transactions = getTransactions()
  const cards = getCards()
  const purchases: FuturePurchaseDetail[] = []

  transactions.forEach(t => {
    if (t.parcelas && t.cartaoId && t.parcelaAtual && t.cartaoId === cardId) {
      const card = cards.find(c => c.id === t.cartaoId)
      if (!card) return

      const remainingInstallments = t.parcelas - t.parcelaAtual

      if (remainingInstallments <= 0) return

      // Validar data da transação
      if (!t.data) return

      const futureMonths: { month: string; value: number }[] = []
      const now = new Date()
      const maxDate = new Date()
      maxDate.setMonth(maxDate.getMonth() + monthsAhead)

      try {
        for (let i = 1; i <= remainingInstallments; i++) {
          const futureMonth = new Date(t.data)
          if (isNaN(futureMonth.getTime())) continue

          futureMonth.setMonth(futureMonth.getMonth() + i)

          const monthKey = `${futureMonth.getFullYear()}-${String(futureMonth.getMonth() + 1).padStart(2, '0')}`
          const itemDate = new Date(monthKey + '-01')

          if (itemDate >= now && itemDate <= maxDate) {
            futureMonths.push({
              month: monthKey,
              value: t.valorPorParcela || t.valor || 0,
            })
          }
        }
      } catch (error) {
        console.error('Erro ao calcular parcelas futuras:', error)
        return
      }

      if (futureMonths.length > 0) {
        purchases.push({
          descricao: t.descricao || 'Compra sem nome',
          dataCompraOriginal: t.data,
          valorPorParcela: t.valorPorParcela || t.valor || 0,
          parcelasRestantes: remainingInstallments,
          proximasParcelas: futureMonths,
        })
      }
    }
  })

  return purchases
}

export const getMonthlyFutureExpenses = (monthsAhead: number = 6): { month: string; value: number }[] => {
  const futureInstallments = getFutureInstallments()
  const monthlyExpenses: { [key: string]: number } = {}

  futureInstallments.forEach(inst => {
    const date = new Date(inst.data)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!monthlyExpenses[monthKey]) {
      monthlyExpenses[monthKey] = 0
    }
    monthlyExpenses[monthKey] += inst.valor
  })

  const result = Object.entries(monthlyExpenses)
    .map(([month, value]) => ({ month, value }))
    .filter(item => {
      const itemDate = new Date(item.month + '-01')
      const now = new Date()
      const maxDate = new Date()
      maxDate.setMonth(maxDate.getMonth() + monthsAhead)
      return itemDate >= now && itemDate <= maxDate
    })
    .sort((a, b) => a.month.localeCompare(b.month))

  return result
}
