'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)

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

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-5xl">📩</div>
          <h2 className="text-2xl font-bold text-white">Verifique seu email</h2>
          <p className="text-white/60">
            Enviamos um link de acesso para <span className="text-white font-medium">{email}</span>. Clique no link para entrar no dashboard.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            Usar outro email
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">

        {/* Lado esquerdo — copy */}
        <div className="space-y-8">
          <p className="text-sm tracking-[0.3em] text-white/40 uppercase">
            FinDash Premium
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Controle suas finanças com clareza
          </h1>
          <p className="text-xl text-white/60 leading-relaxed">
            Organize receitas, gastos, cartões e metas em um dashboard premium. Comece grátis por 7 dias.
          </p>

          <div className="space-y-3">
            {[
              'Dashboard completo com gráficos',
              'Controle de cartões e parcelas',
              'Metas financeiras inteligentes',
              'Analytics e insights automáticos',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-white/70">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lado direito — formulário */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Começar agora</h2>
            <p className="text-white/50 mt-1 text-sm">7 dias grátis, sem cartão de crédito</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/60">Seu melhor email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                required
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold rounded-xl py-3 hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Começar 7 dias grátis 🚀'}
            </button>
          </form>

          <p className="text-xs text-white/30 text-center">
            Já tem conta? Digite seu email acima para entrar.
          </p>
        </div>
      </div>
    </main>
  )
}