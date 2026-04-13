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
import { getCards, getTransactions, saveTransactions, getGoalsSummary, getProfile, getGreeting } from '@/lib/storage'
import { CreditCard } from '@/types'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [cards, setCards] = useState<CreditCard[]>([])
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [userName, setUserName] = useState('')
  const [greeting, setGreeting] = useState('Olá')

  useEffect(() => {
    setIsMounted(true)
    setCards(getCards())
    const profile = getProfile()
    setUserName(profile.name)
    setGreeting(getGreeting())
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

  const handleOpenTransactionModal = () => {
    setIsNewTransactionOpen(true)
  }

  const handleCloseTransactionModal = () => {
    setIsNewTransactionOpen(false)
  }

  const handleExportPDF = () => {
    // Placeholder para exportação PDF
    alert('Funcionalidade de exportação PDF será implementada em breve!')
  }

  const handleNewCard = () => {
    // Placeholder para novo cartão
    setActiveTab('cards')
  }

  const handleNewGoal = () => {
    // Placeholder para nova meta
    setActiveTab('goals')
  }

  const handleProfileClick = () => {
    setIsProfileModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewTransaction={handleOpenTransactionModal}
        onNewCard={handleNewCard}
        onNewGoal={handleNewGoal}
        isOpen={sidebarOpen}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onNewTransaction={handleOpenTransactionModal}
          onExportPDF={handleExportPDF}
          showActions={activeTab === 'dashboard'}
          onProfileClick={handleProfileClick}
        />

        <main className="p-4 md:p-6 pb-20">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Personalized Greeting */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {greeting}, {userName || 'Usuário'} 👋
                </h1>
                <p className="text-muted-foreground">
                  Visão geral das suas finanças
                </p>
              </div>

              {/* Stats */}
              <StatsCards
                stats={{
                  totalEntradas: 8500,
                  totalSaidas: 4532,
                  saldo: 3968,
                  totalCartoes: cards.length,
                  faturaTotal: cards.reduce((acc, card) => acc + card.faturaAtual, 0),
                }}
              />

              {/* Charts */}
              <ChartsSection />
            </div>
          )}

          {/* Cards Tab */}
          {activeTab === 'cards' && (
            <CardsSection />
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Transações</h2>
                  <p className="text-muted-foreground">
                    Histórico completo de suas movimentações
                  </p>
                </div>
                <Button
                  onClick={handleOpenTransactionModal}
                  disabled={!isMounted}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Novo Lançamento
                </Button>
              </div>

              <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-muted-foreground">
                  Histórico de transações será exibido aqui
                </p>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && <AnalyticsSection />}

          {/* Goals Tab */}
          {activeTab === 'goals' && <GoalsSection />}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
                <p className="text-muted-foreground">
                  Personalize sua experiência
                </p>
              </div>

              <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-muted-foreground">
                  Configurações serão exibidas aqui
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Sticky Footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-12 items-center justify-between px-4 md:px-6">
            <p className="text-xs text-muted-foreground">
              © 2025 FinDash Pro. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Feito com ❤️ para gestão financeira
            </p>
          </div>
          <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}></div>
        </footer>
      </div>

      {/* New Transaction Modal */}
      {isMounted && (
        <NewTransactionModal
          open={isNewTransactionOpen}
          onOpenChange={handleCloseTransactionModal}
          cards={cards}
          onSave={handleNewTransaction}
        />
      )}

      {/* Profile Modal */}
      <ProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
    </div>
  )
}
