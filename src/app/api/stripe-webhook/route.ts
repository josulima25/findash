import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Stripe signature missing' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('[webhook] constructEvent falhou:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const customerEmail = session.customer_details?.email

    if (!customerEmail) {
      return NextResponse.json({ error: 'Email não encontrado' }, { status: 400 })
    }

    const { error } = await supabase
      .from('user_access')
      .upsert({ email: customerEmail, is_premium: true }, { onConflict: 'email' })

    if (error) {
      console.error('[webhook] erro supabase:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[webhook] premium liberado:', customerEmail)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
