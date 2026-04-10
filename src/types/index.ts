export interface CreditCard {
  id: string
  nome: string
  banco: string
  bandeira: 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard'
  final: string
  limiteTotal: number
  faturaAtual: number
  fechamento: number
  vencimento: number
}

export interface Transaction {
  id: string
  descricao: string
  valor: number
  tipo: 'entrada' | 'saida'
  categoria: string
  data: string
  cartaoId?: string
  parcelas?: number
  parcelaAtual?: number
  valorPorParcela?: number
}

export interface DashboardStats {
  totalEntradas: number
  totalSaidas: number
  saldo: number
  totalCartoes: number
  faturaTotal: number
}

export interface FinancialGoal {
  id: string
  nome: string
  valorAlvo: number
  valorAcumulado: number
  prazoFinal: string
  createdAt: string
}

export interface UserProfile {
  name: string
  currency: string
  monthlyIncome: number
  mainGoal: string
}
