export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getRequiredEnv } from '@/lib/env';
import { getPrismaClient } from '@/lib/prisma';
import { getStripeClient } from '@/lib/stripe';

export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  try {
    const payload = await request.text();
    const stripe = getStripeClient();
    const webhookSecret = getRequiredEnv('STRIPE_WEBHOOK_SECRET');
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    const prisma = getPrismaClient();

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;

        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            stripePaymentIntentId: paymentIntentId,
          },
        });
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'CANCELLED',
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook verification failed.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
