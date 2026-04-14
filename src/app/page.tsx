'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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
        setMessage('Erro ao enviar magic link.')
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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0b0f',
        color: 'white',
      }}
    >
      <div
        style={{
          width: 420,
          padding: 32,
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 10 }}>
          Bem-vindo ao FinDash 🚀
        </h1>

        <p style={{ opacity: 0.7, marginBottom: 20 }}>
          Digite seu melhor e-mail para receber seu acesso por 7 dias grátis.
        </p>

        <input
          type="email"
          placeholder="seuemail@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: 14,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#111',
            color: 'white',
            marginBottom: 16,
          }}
        />

        <button
          onClick={handleContinue}
          disabled={loading}
          style={{
            width: '100%',
            padding: 14,
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          {loading ? 'Enviando...' : 'Continuar'}
        </button>

        {message && (
          <p style={{ marginTop: 16, fontSize: 14, opacity: 0.8 }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}