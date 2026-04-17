'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HomePage() {
  const [loading, setLoading] = useState(false)

  const sendMagicLink = async () => {
    setLoading(true)
    const email = prompt('Digite seu email:')
    if (!email) {
      setLoading(false)
      return
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }
    alert('Verifique seu email para acessar o dashboard 📩')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black px-8 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-sm tracking-[0.3em] text-white/50">
          FINDASH PREMIUM
        </p>
        <h1 className="mb-8 text-6xl font-bold leading-tight">
          Controle suas finanças com
          <br />
          clareza e teste grátis por 7 dias
        </h1>
        <div className="mb-8 text-6xl">💸</div>
        <p className="mb-10 max-w-3xl text-2xl text-white/70">
          Organize receitas, gastos, cartões e projeções inteligentes em um
          dashboard premium. Comece no trial de 7 dias e desbloqueie insights
          avançados quando quiser.
        </p>
        <div className="mb-16 flex gap-4">
          <button
            onClick={sendMagicLink}
            className="rounded-2xl border border-white/10 px-8 py-4 text-xl"
          >
            Começar 7 dias grátis 🚀
          </button>
          <button
            onClick={sendMagicLink}
            disabled={loading}
            className="rounded-2xl border border-white/10 px-8 py-4 text-xl"
          >
            {loading ? 'Enviando...' : 'Já tenho conta'}
          </button>
        </div>
      </div>
    </main>
  )
}