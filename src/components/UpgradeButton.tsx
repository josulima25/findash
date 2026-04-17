'use client'

import { useState } from 'react'

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    const res = await fetch('/api/create-checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Erro ao iniciar checkout')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      style={{
        marginTop: 12,
        padding: '10px 20px',
        background: '#7c3aed',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 16,
      }}
    >
      {loading ? 'Redirecionando...' : 'Fazer upgrade para Premium →'}
    </button>
  )
}