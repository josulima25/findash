'use client'

import { useState, useEffect } from 'react'
import { CreditCardDisplay } from './CreditCardDisplay'
import { EditCardModal } from './EditCardModal'
import { CreditCard } from '@/types'
import { getCards, updateCard } from '@/lib/storage'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CardsSection() {
  const [cards, setCards] = useState<CreditCard[]>([])
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    setCards(getCards())
  }, [])

  const handleCardClick = (card: CreditCard) => {
    setSelectedCard(card)
    setIsEditModalOpen(true)
  }

  const handleSaveCard = (updatedCard: CreditCard) => {
    updateCard(updatedCard.id, updatedCard)
    setCards(getCards())
    setSelectedCard(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cartões de Crédito</h2>
          <p className="text-muted-foreground">
            Gerencie seus cartões e acompanhe os limites
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cartão
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <CreditCardDisplay
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      <EditCardModal
        card={selectedCard}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveCard}
      />
    </div>
  )
}
