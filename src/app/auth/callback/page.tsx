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
        const hashAccessToken = hashParams.get('access_token')
        const hashRefreshToken = hashParams.get('refresh_token')

        if (code) {
          const { data, error } =
            await supabase.auth.exchangeCodeForSession(code)

          if (error) {
            setStatus(`Erro ao validar code: ${error.message}`)
            return
          }

          if (!data?.user) {
            setStatus('Usuário não retornado no code flow.')
            return
          }
        } else if (hashAccessToken && hashRefreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: hashAccessToken,
            refresh_token: hashRefreshToken,
          })

          if (error) {
            setStatus(`Erro ao validar hash: ${error.message}`)
            return
          }
        } else {
          setStatus('Token ausente no callback. Voltando...')
          setTimeout(() => router.push('/'), 1200)
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

        const { error: upsertError } = await supabase
          .from('user_access')
          .upsert(
            {
              user_id: user.id,
              email: user.email ?? '',
            },
            {
              onConflict: 'email',
            }
          )

        if (upsertError) {
          setStatus(`Erro ao salvar acesso: ${upsertError.message}`)
          return
        }

        setStatus('Acesso validado. Redirecionando...')
        router.push('/dashboard')
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
