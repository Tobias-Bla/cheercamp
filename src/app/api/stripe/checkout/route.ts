export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import {
  BookingRequestError,
  createPendingBookingFromPayload,
  formatBookingValidationError,
} from '@/lib/bookings/create-booking';
import { getPrismaClient } from '@/lib/prisma';
import { getStripeClient } from '@/lib/stripe';

export async function POST(request: Request): Promise<Response> {
  try {
    const { booking, camp, payload } = await createPendingBookingFromPayload(await request.json());
    const requestUrl = new URL(request.url);
    const baseUrl = requestUrl.origin === 'null' ? process.env.NEXT_PUBLIC_SITE_URL ?? '' : requestUrl.origin;

    if (!baseUrl) {
      return NextResponse.json({ error: 'Die Basis-URL ist nicht konfiguriert.' }, { status: 500 });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      billing_address_collection: 'auto',
      success_url: `${baseUrl}/checkout/success?bookingId=${booking.id}`,
      cancel_url: `${baseUrl}/checkout/cancel?bookingId=${booking.id}`,
      customer_email: payload.contactEmail,
      metadata: {
        bookingId: booking.id,
        campSlug: camp.slug,
        stuntFormat: payload.stuntFormat,
        privateInterest: payload.privateInterest,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: camp.priceCents,
            product_data: {
              name: camp.title,
              description: `${camp.venue} - General Camp`,
            },
          },
        },
      ],
    });

    await getPrismaClient().booking.update({
      where: {
        id: booking.id,
      },
      data: {
        stripeCheckoutSessionId: session.id,
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe Checkout konnte nicht erzeugt werden.' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: formatBookingValidationError(error) }, { status: 400 });
    }

    if (error instanceof BookingRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
