'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard } from '@/types'
import { Plus, Minus } from 'lucide-react'

interface NewTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cards: CreditCard[]
  onSave: (transaction: any) => void
}

export function NewTransactionModal({ open, onOpenChange, cards, onSave }: NewTransactionModalProps) {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'saida' as 'entrada' | 'saida',
    categoria: '',
    cartaoId: '',
    parcelas: '1',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!formData.descricao || !formData.valor || !formData.categoria) return

      const valorTotal = parseFloat(formData.valor)
      const numParcelas = parseInt(formData.parcelas) || 1
      const valorPorParcela = valorTotal / numParcelas
      const isCardPayment = !!formData.cartaoId

      const transaction = {
        id: Date.now().toString(),
        descricao: formData.descricao,
        valor: isCardPayment && numParcelas > 1 ? valorPorParcela : valorTotal,
        valorTotal: isCardPayment && numParcelas > 1 ? valorTotal : undefined,
        tipo: formData.tipo,
        categoria: formData.categoria,
        data: new Date().toISOString(),
        cartaoId: formData.cartaoId || undefined,
        parcelas: isCardPayment && numParcelas > 1 ? numParcelas : undefined,
        parcelaAtual: isCardPayment && numParcelas > 1 ? 1 : undefined,
        valorPorParcela: isCardPayment && numParcelas > 1 ? valorPorParcela : undefined,
      }

      onSave(transaction)
      setFormData({
        descricao: '',
        valor: '',
        tipo: 'saida',
        categoria: '',
        cartaoId: '',
        parcelas: '1',
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao submeter formulário:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Transaction Type */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={formData.tipo === 'entrada' ? 'default' : 'outline'}
                className="flex items-center gap-2"
                onClick={() => setFormData({ ...formData, tipo: 'entrada' })}
              >
                <Plus className="h-4 w-4" />
                Entrada
              </Button>
              <Button
                type="button"
                variant={formData.tipo === 'saida' ? 'default' : 'outline'}
                className="flex items-center gap-2"
                onClick={() => setFormData({ ...formData, tipo: 'saida' })}
              >
                <Minus className="h-4 w-4" />
                Saída
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: Supermercado"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder="0,00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              >
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alimentacao">Alimentação</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="lazer">Lazer</SelectItem>
                  <SelectItem value="moradia">Moradia</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="renda">Renda</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tipo === 'saida' && cards.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="cartao">Cartão (opcional)</Label>
                <Select
                  value={formData.cartaoId}
                  onValueChange={(value) => setFormData({ ...formData, cartaoId: value })}
                >
                  <SelectTrigger id="cartao">
                    <SelectValue placeholder="Selecione o cartão ou deixe vazio para Dinheiro/PIX" />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.nome} (•••• {card.final})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.tipo === 'saida' && formData.cartaoId && (
              <div className="grid gap-2">
                <Label htmlFor="parcelas">Parcelas</Label>
                <Input
                  id="parcelas"
                  type="number"
                  min="1"
                  max="24"
                  value={formData.parcelas}
                  onChange={(e) => setFormData({ ...formData, parcelas: e.target.value })}
                  placeholder="1"
                />
                {formData.valor && parseInt(formData.parcelas) > 1 && (
                  <p className="text-xs text-muted-foreground">
                    Valor por parcela: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(formData.valor || '0') / (parseInt(formData.parcelas) || 1))}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Lançamento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
