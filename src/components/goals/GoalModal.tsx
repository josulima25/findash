'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FinancialGoal } from '@/types'

interface GoalModalProps {
  goal: FinancialGoal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void
}

export function GoalModal({ goal, open, onOpenChange, onSave }: GoalModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    valorAlvo: 0,
    valorAcumulado: 0,
    prazoFinal: '',
  })

  useEffect(() => {
    if (goal) {
      setFormData({
        nome: goal.nome,
        valorAlvo: goal.valorAlvo,
        valorAcumulado: goal.valorAcumulado,
        prazoFinal: goal.prazoFinal,
      })
    } else {
      setFormData({
        nome: '',
        valorAlvo: 0,
        valorAcumulado: 0,
        prazoFinal: '',
      })
    }
  }, [goal, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.valorAlvo || !formData.prazoFinal) return

    onSave(formData)
    setFormData({
      nome: '',
      valorAlvo: 0,
      valorAcumulado: 0,
      prazoFinal: '',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{goal ? 'Editar Meta' : 'Nova Meta Financeira'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Meta</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Viagem Internacional"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="valorAlvo">Valor Alvo (R$)</Label>
              <Input
                id="valorAlvo"
                type="number"
                step="0.01"
                value={formData.valorAlvo}
                onChange={(e) => setFormData({ ...formData, valorAlvo: Number(e.target.value) })}
                placeholder="15000,00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="valorAcumulado">Valor Acumulado (R$)</Label>
              <Input
                id="valorAcumulado"
                type="number"
                step="0.01"
                value={formData.valorAcumulado}
                onChange={(e) => setFormData({ ...formData, valorAcumulado: Number(e.target.value) })}
                placeholder="0,00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prazoFinal">Prazo Final</Label>
              <Input
                id="prazoFinal"
                type="date"
                value={formData.prazoFinal}
                onChange={(e) => setFormData({ ...formData, prazoFinal: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Meta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
