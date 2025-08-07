import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerComponentClient } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Erreur webhook signature:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createServerComponentClient();

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
          // Mettre à jour le statut premium de l'utilisateur
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              premium_activated_at: new Date().toISOString(),
              is_premium: true,
            })
            .eq('id', userId);
        }
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Désactiver le premium pour cet utilisateur
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            is_premium: false,
            premium_activated_at: null,
          })
          .eq('stripe_customer_id', customerId);
        break;

      default:
        console.log(`Event non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du webhook' },
      { status: 500 }
    );
  }
}

