'use client'

import { useState, useEffect } from 'react'
import { CreditCard as CreditCardIcon, Calendar, CreditCard, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { CreditCard as CreditCardType } from '@/types'
import { getLimiteDisponivel, calculateMelhorDia, getCardPurchasesWithInstallments, type FuturePurchaseDetail } from '@/lib/storage'

interface CreditCardDisplayProps {
  card: CreditCardType
  onClick: () => void
}

export function CreditCardDisplay({ card, onClick }: CreditCardDisplayProps) {
  const [purchasesWithInstallments, setPurchasesWithInstallments] = useState<FuturePurchaseDetail[]>([])
  const [limiteDisponivel, setLimiteDisponivel] = useState(0)
  const [usoPercentual, setUsoPercentual] = useState(0)
  const [melhorDia, setMelhorDia] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPurchasesWithInstallments(getCardPurchasesWithInstallments(card.id, 6))
      setLimiteDisponivel(getLimiteDisponivel(card.limiteTotal, card.faturaAtual))
      setUsoPercentual((card.faturaAtual / card.limiteTotal) * 100)
      setMelhorDia(calculateMelhorDia(card.fechamento))
    }
  }, [card.id, card.limiteTotal, card.faturaAtual, card.fechamento])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getGradient = () => {
    switch (card.bandeira) {
      case 'visa':
        return 'from-blue-600 to-blue-800'
      case 'mastercard':
        return 'from-orange-600 to-red-700'
      case 'amex':
        return 'from-gray-700 to-gray-900'
      case 'elo':
        return 'from-red-600 to-yellow-600'
      case 'hipercard':
        return 'from-yellow-600 to-yellow-800'
      default:
        return 'from-purple-600 to-purple-800'
    }
  }

  const formatMonth = (monthStr: string) => {
    if (!monthStr) return 'Data inválida'
    const parts = monthStr.split('-')
    if (parts.length < 2) return monthStr
    const [year, month] = parts
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const monthIndex = parseInt(month) - 1
    if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return monthStr
    return `${monthNames[monthIndex]} ${year}`
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '--/--/--'
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return '--/--/--'
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
    } catch {
      return '--/--/--'
    }
  }

  const getBandeiraIcon = () => {
    switch (card.bandeira) {
      case 'visa':
        return <CreditCard className="h-6 w-6" />
      case 'mastercard':
        return <CreditCardIcon className="h-6 w-6" />
      default:
        return <CreditCard className="h-6 w-6" />
    }
  }

  return (
    <Card
      className="group overflow-hidden cursor-pointer border-2 transition-all hover:scale-[1.02] hover:shadow-xl"
      onClick={onClick}
    >
      <div className={cn('relative h-48 bg-gradient-to-br p-6 text-white', getGradient())}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        </div>

        {/* Card Header */}
        <div className="relative flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">{card.nome}</h3>
            <p className="text-sm opacity-80">{card.banco}</p>
          </div>
          <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
            {getBandeiraIcon()}
          </div>
        </div>

        {/* Card Number */}
        <div className="relative mt-6 flex items-center justify-center">
          <div className="flex items-center gap-2 text-2xl font-mono tracking-wider">
            <span>••••</span>
            <span>••••</span>
            <span>••••</span>
            <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
              {card.final}
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="relative mt-auto flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-xs opacity-70">Vencimento</p>
            <p className="text-sm font-semibold">Dia {card.vencimento}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-70">Fechamento</p>
            <p className="text-sm font-semibold">Dia {card.fechamento}</p>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <CardContent className="space-y-3 p-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uso do limite</span>
            <span className="font-semibold">{usoPercentual.toFixed(0)}%</span>
          </div>
          <Progress value={usoPercentual} className="h-2" />
        </div>

        {/* Limits Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-semibold">{formatCurrency(card.limiteTotal)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Disponível</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(limiteDisponivel)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Fatura</p>
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
              {formatCurrency(card.faturaAtual)}
            </p>
          </div>
        </div>

        {/* Próximas Parcelas */}
        {purchasesWithInstallments.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <p className="text-xs font-medium text-muted-foreground">Próximas Parcelas</p>
            <div className="space-y-3">
              {purchasesWithInstallments.map((purchase, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-foreground">{purchase.descricao || 'Compra sem nome'}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDate(purchase.dataCompraOriginal)}</p>
                  </div>
                  <div className="space-y-0.5">
                    {purchase.proximasParcelas?.slice(0, 3).map((installment) => (
                      <div key={installment.month || idx} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{formatMonth(installment.month || '')}</span>
                        <span className="font-medium">{formatCurrency(installment.value || 0)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {purchase.parcelasRestantes} parcela(s) restante(s)
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Row */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Fechamento: {card.fechamento}</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-[10px]">
              Melhor dia: {melhorDia}
            </Badge>
          </div>
        </div>

        {/* Best Day Highlight */}
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground">Melhor dia de compra</p>
            <p className="text-sm font-semibold text-primary">Dia {melhorDia}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
