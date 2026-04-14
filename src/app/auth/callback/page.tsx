'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuth = async () => {
      const code = searchParams.get('code')

      if (!code) {
        router.push('/')
        return
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

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
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      Validando acesso...
    </div>
  )
}