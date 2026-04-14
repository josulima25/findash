'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const { data } = await supabase.auth.getUser()

      if (data.user) {
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
      } else {
        router.push('/')
      }
    }

    handleAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      Validando acesso...
    </div>
  )
}