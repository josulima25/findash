'use client'

import { useState, useEffect } from 'react'
import { Home, CreditCard, BarChart3, Settings, TrendingUp, Wallet, Plus, Target, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getCards, getGoals, getGoalProgress } from '@/lib/storage'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onNewTransaction: () => void
  onNewCard: () => void
  onNewGoal: () => void
  isOpen?: boolean
}

export function Sidebar({ activeTab, onTabChange, onNewTransaction, onNewCard, onNewGoal, isOpen = true }: SidebarProps) {
  const [mainCardUsage, setMainCardUsage] = useState(0)
  const [mainGoalProgress, setMainGoalProgress] = useState(0)

  useEffect(() => {
    const cards = getCards()
    if (cards.length > 0) {
      const mainCard = cards[0]
      const usage = (mainCard.faturaAtual / mainCard.limiteTotal) * 100
      setMainCardUsage(usage)
    }

    const goals = getGoals()
    if (goals.length > 0) {
      const mainGoal = goals[0]
      const progress = getGoalProgress(mainGoal)
      setMainGoalProgress(progress.percentual)
    }
  }, [])

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'cards', label: 'Cartões', icon: CreditCard },
    { id: 'transactions', label: 'Transações', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'goals', label: 'Metas', icon: TrendingUp },
  ]

  const quickActions = [
    { id: 'transaction', label: 'Novo Lançamento', icon: Plus, onClick: onNewTransaction },
    { id: 'card', label: 'Novo Cartão', icon: CreditCard, onClick: onNewCard },
    { id: 'goal', label: 'Nova Meta', icon: Target, onClick: onNewGoal },
  ]

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 h-screen w-64 border-r bg-card transition-transform duration-300',
        !isOpen && '-translate-x-full'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FinDash</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Quick Actions */}
        <div className="border-t px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground px-3 py-1">Ações Rápidas</p>
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </button>
            )
          })}
        </div>

        {/* Stats Preview */}
        <div className="border-t px-4 py-3 space-y-3">
          {/* Main Card Usage */}
          {mainCardUsage > 0 && (
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Cartão Principal</span>
                </div>
                <span className="text-xs font-semibold text-primary">{mainCardUsage.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min(100, mainCardUsage)}%` }}
                />
              </div>
            </div>
          )}

          {/* Main Goal Progress */}
          {mainGoalProgress > 0 && (
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Meta Principal</span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{mainGoalProgress.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, mainGoalProgress)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="border-t p-4">
          <button
            onClick={() => onTabChange('settings')}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
              activeTab === 'settings'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Settings className="h-5 w-5" />
            Configurações
          </button>
        </div>
      </div>
    </aside>
  )
}
