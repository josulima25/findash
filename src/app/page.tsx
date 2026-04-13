'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleContinue = () => {
    if (!email) return
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl">
        <h1 className="text-2xl font-bold tracking-tight">
          Bem-vindo ao FinDash 🚀
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Digite seu melhor e-mail para receber seu acesso por 7 dias grátis.
        </p>

        <input
          type="email"
          placeholder="seuemail@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-6 w-full rounded-lg border bg-background px-4 py-3 outline-none"
        />

        <Button
          onClick={handleContinue}
          className="mt-4 w-full"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}