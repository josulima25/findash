'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Validando acesso...')

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(
          window.location.hash.replace('#', '')
        )

        const code = searchParams.get('code')
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const authError = hashParams.get('error')
        const errorCode = hashParams.get('error_code')
        const errorDescription = hashParams.get('error_description')

        if (authError || errorCode) {
          const expired =
            errorCode === 'otp_expired' ||
            errorDescription?.toLowerCase().includes('expired')

          setStatus(
            expired
              ? 'Link expirado ou já utilizado. Solicite um novo acesso.'
              : `Erro no login: ${errorCode || authError}`
          )

          setTimeout(() => router.push('/'), 1800)
          return
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)

          if (error) {
            setStatus(`Erro ao validar login: ${error.message}`)
            return
          }
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            setStatus(`Erro ao validar sessão: ${error.message}`)
            return
          }
        } else {
          setStatus('Link inválido. Solicite um novo acesso.')
          setTimeout(() => router.push('/'), 1800)
          return
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          setStatus('Sessão criada, mas usuário não encontrado.')
          return
        }

        const now = new Date()
        const trialEnds = new Date(now)
        trialEnds.setDate(now.getDate() + 7)

        const { data: existingAccess } = await supabase
          .from('user_access')
          .select('id, trial_started_at')
          .eq('email', user.email)
          .maybeSingle()

        const payload =
          existingAccess?.trial_started_at
            ? {
                user_id: user.id,
                email: user.email ?? '',
              }
            : {
                user_id: user.id,
                email: user.email ?? '',
                trial_started_at: now.toISOString(),
                trial_ends_at: trialEnds.toISOString(),
              }

        const { error: upsertError } = await supabase
          .from('user_access')
          .upsert(payload, {
            onConflict: 'email',
          })

        if (upsertError) {
          setStatus(`Erro ao salvar acesso: ${upsertError.message}`)
          return
        }

        setStatus('Acesso validado. Redirecionando...')
        setTimeout(() => router.push('/dashboard'), 500)
      } catch (err: any) {
        setStatus(`Erro inesperado: ${err.message}`)
      }
    }

    handleAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p>{status}</p>
    </div>
  )
}