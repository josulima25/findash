'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Carregando dashboard...')
  const [email, setEmail] = useState('')
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          router.push('/')
          return
        }

        setEmail(user.email ?? '')

        const { data: access, error } = await supabase
          .from('user_access')
          .select('trial_ends_at, is_premium')
          .eq('email', user.email)
          .maybeSingle()

        if (error || !access) {
          router.push('/')
          return
        }

        if (access.is_premium) {
          setStatus('Premium ativo')
          return
        }

        const trialEndsAt = new Date(access.trial_ends_at)
        const now = new Date()

        if (now > trialEndsAt) {
          setStatus('Seu trial expirou. Faça upgrade para continuar.')
          return
        }

        const diffMs = trialEndsAt.getTime() - now.getTime()
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

        setDaysLeft(diffDays)
        setStatus('Acesso liberado')
      } catch {
        router.push('/')
      }
    }

    validateAccess()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (status === 'Seu trial expirou. Faça upgrade para continuar.') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0b0b0f',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 460,
            padding: 32,
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>
            Trial expirado 🚫
          </h1>
          <p style={{ opacity: 0.8, marginBottom: 24 }}>
            Seu período grátis terminou. Faça upgrade para continuar usando o
            FinDash.
          </p>
          <button
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Fazer upgrade
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0b0f',
        color: 'white',
        padding: 40,
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 10 }}>
        Dashboard FinDash 💸
      </h1>

      <p style={{ opacity: 0.8, marginBottom: 10 }}>
        Usuário: {email}
      </p>

      {daysLeft !== null && (
        <p style={{ opacity: 0.8, marginBottom: 24 }}>
          Trial restante: {daysLeft} dia(s)
        </p>
      )}

      <button
        onClick={handleLogout}
        style={{
          padding: 12,
          borderRadius: 10,
          border: 'none',
          cursor: 'pointer',
          fontWeight: 700,
        }}
      >
        Sair
      </button>
    </div>
  )
}