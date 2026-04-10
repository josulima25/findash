'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard } from '@/types'

interface EditCardModalProps {
  card: CreditCard | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (card: CreditCard) => void
}

export function EditCardModal({ card, open, onOpenChange, onSave }: EditCardModalProps) {
  const [formData, setFormData] = useState<Partial<CreditCard>>({
    nome: '',
    banco: '',
    bandeira: 'visa',
    final: '',
    limiteTotal: 0,
    fechamento: 1,
    vencimento: 1,
  })

  useEffect(() => {
    if (card) {
      setFormData({
        nome: card.nome,
        banco: card.banco,
        bandeira: card.bandeira,
        final: card.final,
        limiteTotal: card.limiteTotal,
        fechamento: card.fechamento,
        vencimento: card.vencimento,
      })
    }
  }, [card])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!card || !formData.nome || !formData.final) return

    const melhorDia = formData.fechamento && formData.fechamento >= 1 && formData.fechamento <= 31
      ? formData.fechamento + 1 > 31 ? 1 : formData.fechamento + 1
      : 1

    const updatedCard: CreditCard = {
      ...card,
      nome: formData.nome!,
      banco: formData.banco || '',
      bandeira: formData.bandeira || 'visa',
      final: formData.final!,
      limiteTotal: formData.limiteTotal || 0,
      fechamento: formData.fechamento || 1,
      vencimento: formData.vencimento || 1,
    }

    onSave(updatedCard)
    onOpenChange(false)
  }

  const melhorDia = formData.fechamento
    ? formData.fechamento + 1 > 31 ? 1 : formData.fechamento + 1
    : 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Cartão</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do Cartão</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Nubank"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="banco">Banco</Label>
              <Input
                id="banco"
                value={formData.banco}
                onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
                placeholder="Ex: Nubank"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bandeira">Bandeira</Label>
              <Select
                value={formData.bandeira}
                onValueChange={(value: any) => setFormData({ ...formData, bandeira: value })}
              >
                <SelectTrigger id="bandeira">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="amex">American Express</SelectItem>
                  <SelectItem value="elo">Elo</SelectItem>
                  <SelectItem value="hipercard">Hipercard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="final">Final do Cartão</Label>
              <Input
                id="final"
                value={formData.final}
                onChange={(e) => setFormData({ ...formData, final: e.target.value })}
                placeholder="Ex: 1234"
                maxLength={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="limite">Limite Total (R$)</Label>
              <Input
                id="limite"
                type="number"
                value={formData.limiteTotal}
                onChange={(e) => setFormData({ ...formData, limiteTotal: Number(e.target.value) })}
                placeholder="Ex: 5000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fechamento">Fechamento</Label>
                <Input
                  id="fechamento"
                  type="number"
                  min={1}
                  max={31}
                  value={formData.fechamento}
                  onChange={(e) => setFormData({ ...formData, fechamento: Number(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="vencimento">Vencimento</Label>
                <Input
                  id="vencimento"
                  type="number"
                  min={1}
                  max={31}
                  value={formData.vencimento}
                  onChange={(e) => setFormData({ ...formData, vencimento: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Melhor dia de compra:</span>
                <span className="text-lg font-bold text-primary">Dia {melhorDia}</span>
              Modal para editar cartão
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Calculado automaticamente: fechamento + 1 dia
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
