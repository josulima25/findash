'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { ChartsSection } from '@/components/dashboard/ChartsSection'
import { CardsSection } from '@/components/cards/CardsSection'
import { GoalsSection } from '@/components/goals/GoalsSection'
import { AnalyticsSection } from '@/components/analytics/AnalyticsSection'
import { NewTransactionModal } from '@/components/transactions/NewTransactionModal'
import { ProfileModal } from '@/components/profile/ProfileModal'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCards, getTransactions, saveTransactions, getProfile, getGreeting } from '@/lib/storage'
import { createClient } from '@/lib/supabase/client'
import { CreditCard } from '@/types'
import UpgradeButton from '@/components/UpgradeButton'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [cards, setCards] = useState<CreditCard[]>([])
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [userName, setUserName] = useState('')
  const [greeting, setGreeting] = useState('Olá')
  const [isPremium, setIsPremium] = useState(false)
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null)
  const [trialExpired, setTrialExpired] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const initializeDashboard = async () => {
      setIsMounted(true)
      setCards(getCards())

      const profile = getProfile()
      setUserName(profile.name)
      setGreeting(getGreeting())

      const { data: { user } } = await supabase.auth.getUser()

      if (user?.email) {
        const { data: access } = await supabase
          .from('user_access')
          .select('*')
          .eq('email', user.email)
          .single()

        if (!access) {
          const trialStart = new Date()
          const trialEnd = new Date()
          trialEnd.setDate(trialEnd.getDate() + 7)

          await supabase.from('user_access').insert({
            email: user.email,
            trial_started_at: trialStart.toISOString(),
            trial_ends_at: trialEnd.toISOString(),
            is_premium: false,
            status: 'active_trial',
          })

          setIsPremium(false)
          setTrialEndsAt(trialEnd)
          setTrialExpired(false)
        } else {
          setIsPremium(access.is_premium ?? false)

          if (access.trial_ends_at) {
            const trialEnd = new Date(access.trial_ends_at)
            setTrialEndsAt(trialEnd)
            setTrialExpired(!access.is_premium && new Date() > trialEnd)
          }
        }
      }
    }

    initializeDashboard()
  }, [])

  const handleNewTransaction = (transaction: any) => {
    try {
      const transactions = getTransactions()
      transactions.push(transaction)
      saveTransactions(transactions)
      setIsNewTransactionOpen(false)
    } catch (error) {
      console.error('Erro ao salvar transação:', error)
    }
  }

  const handleExportPDF = () => {
    alert('Funcionalidade de exportação PDF será implementada em breve!')
  }

  if (trialExpired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-4 rounded-2xl border bg-card p-8 text-center space-y-4">
          <div className="text-4xl">🔒</div>
          <h1 className="text-2xl font-bold">Trial expirado</h1>
          <p className="text-muted-foreground">
            Seu período gratuito de 7 dias terminou. Faça upgrade para continuar acessando o FinDash.
          </p>
          <UpgradeButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewTransaction={() => setIsNewTransactionOpen(true)}
        onNewCard={() => setActiveTab('cards')}
        onNewGoal={() => setActiveTab('goals')}
        isOpen={sidebarOpen}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onNewTransaction={() => setIsNewTransactionOpen(true)}
          onExportPDF={handleExportPDF}
          showActions={activeTab === 'dashboard'}
          onProfileClick={() => setIsProfileModalOpen(true)}
        />

        <main className="p-4 md:p-6 pb-20">

          {!isPremium && trialEndsAt && (
            <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                  Você está no plano trial.
                </p>
                <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">
                  Expira em {trialEndsAt.toLocaleDateString('pt-BR')}
                </p>
              </div>
              <UpgradeButton />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {greeting}, {userName || 'Usuário'} 👋
                </h1>
                <p className="text-muted-foreground">Visão geral das suas finanças</p>
              </div>

              <StatsCards
                stats={{
                  totalEntradas: 8500,
                  totalSaidas: 4532,
                  saldo: 3968,
                  totalCartoes: cards.length,
                  faturaTotal: cards.reduce((acc, card) => acc + card.faturaAtual, 0),
                }}
              />

              <ChartsSection />
            </div>
          )}

          {activeTab === 'cards' && <CardsSection />}
          {activeTab === 'analytics' && <AnalyticsSection />}
          {activeTab === 'goals' && <GoalsSection />}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Transações</h2>
                  <p className="text-muted-foreground">Histórico completo de suas movimentações</p>
                </div>
                <Button onClick={() => setIsNewTransactionOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Lançamento
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-muted-foreground">Histórico de transações será exibido aqui</p>
              </div>
            </div>
          )}
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur">
          <div className="flex h-12 items-center justify-between px-4 md:px-6">
            <p className="text-xs text-muted-foreground">© 2025 FinDash Pro. Todos os direitos reservados.</p>
            <p className="text-xs text-muted-foreground">Feito com ❤️ para gestão financeira</p>
          </div>
        </footer>
      </div>

      {isMounted && (
        <NewTransactionModal
          open={isNewTransactionOpen}
          onOpenChange={() => setIsNewTransactionOpen(false)}
          cards={cards}
          onSave={handleNewTransaction}
        />
      )}

      <ProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
    </div>
  )
} 