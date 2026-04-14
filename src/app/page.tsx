'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
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
import {
  getCards,
  getTransactions,
  saveTransactions,
  getProfile,
  getGreeting,
} from '@/lib/storage'
import { CreditCard } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardPage() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [cards, setCards] = useState<CreditCard[]>([])
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [userName, setUserName] = useState('')
  const [greeting, setGreeting] = useState('Olá')
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const validateSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/')
        return
      }

      setIsMounted(true)
      setCards(getCards())

      const profile = getProfile()
      setUserName(profile.name)
      setGreeting(getGreeting())

      setCheckingAuth(false)
    }

    validateSession()
  }, [router])

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

  if (checkingAuth) {
    return <div className="p-10">Validando acesso...</div>
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
          onExportPDF={() => alert('PDF em breve')}
          showActions={activeTab === 'dashboard'}
          onProfileClick={() => setIsProfileModalOpen(true)}
        />

        <main className="p-4 md:p-6 pb-20">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {greeting}, {userName || 'Usuário'} 👋
              </h1>
              <p className="text-muted-foreground">
                Visão geral das suas finanças
              </p>
            </div>

            <StatsCards
              stats={{
                totalEntradas: 8500,
                totalSaidas: 4532,
                saldo: 3968,
                totalCartoes: cards.length,
                faturaTotal: cards.reduce(
                  (acc, card) => acc + card.faturaAtual,
                  0
                ),
              }}
            />

            <ChartsSection />
          </div>
        </main>
      </div>

      {isMounted && (
        <NewTransactionModal
          open={isNewTransactionOpen}
          onOpenChange={setIsNewTransactionOpen}
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