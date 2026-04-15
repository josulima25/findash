import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()

    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const customerEmail = session.customer_details?.email

      if (!customerEmail) {
        return NextResponse.json(
          { error: 'Customer email missing' },
          { status: 400 }
        )
      }

      const { error } = await supabase
        .from('user_access')
        .update({
          is_premium: true,
        })
        .eq('email', customerEmail)

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}