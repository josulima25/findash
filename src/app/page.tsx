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
  const [checkingSession, setCheckingSession] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkExistingSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        window.location.href = '/dashboard'
        return
      }

      setCheckingSession(false)
    }

    checkExistingSession()
  }, [])

  const handleContinue = async () => {
    if (!email.trim()) {
      setMessage('Digite um e-mail válido.')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'https://findash-premium.vercel.app',
        },
      })

      if (error) {
        setMessage(`Erro: ${error.message}`)
        return
      }

      // IMPORTANTE: não redireciona aqui
      setMessage('Magic link enviado com sucesso. Confira seu e-mail ✨')
    } catch (error) {
      console.error(error)
      setMessage('Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return <div style={{ padding: 40 }}>Validando acesso...</div>
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Bem-vindo ao FinDash 🚀</h1>
      <p>Digite seu melhor e-mail para receber seu acesso por 7 dias grátis.</p>

      <input
        type="email"
        placeholder="seuemail@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: '10px',
          width: '300px',
          marginTop: '20px',
          marginRight: '10px',
        }}
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