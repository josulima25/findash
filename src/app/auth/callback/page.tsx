'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (!code) {
        router.push('/')
        return
      }

      const { data, error } =
        await supabase.auth.exchangeCodeForSession(code)

      if (error || !data.user) {
        router.push('/')
        return
      }

      const email = data.user.email ?? ''
      const userId = data.user.id

      await supabase
        .from('user_access')
        .upsert(
          {
            user_id: userId,
            email,
          },
          {
            onConflict: 'email',
          }
        )

      router.push('/dashboard')
    }

    handleAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      Validando acesso...
    </div>
  )
}