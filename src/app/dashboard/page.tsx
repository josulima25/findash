'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const STRIPE_CHECKOUT_URL = https://buy.stripe.com/test_6oU4grgTvdqGfqr50L8Vi04

export default function DashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [expired, setExpired] = useState(false)
  const [premium, setPremium] = useState(false)
  const [email, setEmail] = useState('')
  const [daysLeft, setDaysLeft] = useState(0)

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      setEmail(user.email ?? '')

      const { data } = await supabase
        .from('user_access')
        .select('*')
        .eq('email', user.email)
        .single()

      if (!data) {
        router.push('/')
        return
      }

      const isPremium = data.is_premium === true
      const trialEndsAt = new Date(data.trial_ends_at)
      const now = new Date()

      const remainingMs = trialEndsAt.getTime() - now.getTime()
      const remainingDays = Math.max(
        0,
        Math.ceil(remainingMs / (1000 * 60 * 60 * 24))
      )

      setPremium(isPremium)
      setDaysLeft(remainingDays)

      if (!isPremium && remainingMs <= 0) {
        setExpired(true)
      }

      setLoading(false)
    }

    loadUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleUpgrade = () => {
    window.location.href = STRIPE_CHECKOUT_URL
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Carregando dashboard...
      </div>
    )
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <h1 className="text-4xl font-bold mb-4">
            Trial expirado 🚫
          </h1>
          <p className="text-lg opacity-80 mb-8">
            Seu período grátis terminou. Faça upgrade para continuar usando o FinDash.
          </p>

          <button
            onClick={handleUpgrade}
            className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:opacity-90 transition"
          >
            Fazer upgrade
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-6">
        Dashboard FinDash 💸
      </h1>

      <p className="text-xl mb-3">Usuário: {email}</p>

      {premium ? (
        <p className="text-green-400 text-lg mb-8">
          Premium ativo ✅
        </p>
      ) : (
        <p className="text-lg mb-8">
          Trial restante: {daysLeft} dia(s)
        </p>
      )}

      <button
        onClick={handleLogout}
        className="px-5 py-3 rounded-xl bg-white text-black font-bold"
      >
        Sair
      </button>
    </div>
  )
}