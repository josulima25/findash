'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const forceLogout = async () => {
      const params = new URLSearchParams(window.location.search)
      const shouldLogout = params.get('logout')

      if (shouldLogout === 'true') {
        await supabase.auth.signOut()
        window.history.replaceState({}, '', '/')
      }
    }

    forceLogout()
  }, [])

  const handleContinue = async () => {
    if (!email) return

    try {
      setLoading(true)
      setMessage('')

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'https://findash-premium.vercel.app/auth/callback',
        },
      })

      if (error) {
        setMessage('Erro ao enviar link.')
      } else {
        setMessage('Magic link enviado com sucesso. Confira seu e-mail ✨')
      }
    } catch {
      setMessage('Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Bem-vindo ao FinDash 🚀</h1>
      <p>Digite seu melhor e-mail para receber seu acesso por 7 dias grátis.</p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seuemail@gmail.com"
        style={{ padding: '10px', width: 300, marginRight: 10 }}
      />

      <button
        onClick={handleContinue}
        disabled={loading}
        style={{ padding: '10px 16px' }}
      >
        {loading ? 'Enviando...' : 'Continuar'}
      </button>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  )
}