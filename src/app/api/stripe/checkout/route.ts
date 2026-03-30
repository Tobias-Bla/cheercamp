export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getCampBySlug } from '@/lib/camps';
import { getPrismaClient } from '@/lib/prisma';
import { getStripeClient } from '@/lib/stripe';
import { bookingRequestSchema } from '@/lib/validations/booking';

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = bookingRequestSchema.parse(await request.json());
    const camp = getCampBySlug(payload.campSlug);

    if (!camp) {
      return NextResponse.json({ error: 'Das ausgewählte Camp existiert nicht.' }, { status: 404 });
    }

    const prisma = getPrismaClient();
    const requestUrl = new URL(request.url);
    const baseUrl = requestUrl.origin === 'null' ? process.env.NEXT_PUBLIC_SITE_URL ?? '' : requestUrl.origin;

    if (!baseUrl) {
      return NextResponse.json({ error: 'Die Basis-URL ist nicht konfiguriert.' }, { status: 500 });
    }

    const stripe = getStripeClient();

    const booking = await prisma.booking.create({
      data: {
        campSlug: camp.slug,
        campTitle: camp.title,
        campLocation: camp.location,
        campStartDate: new Date(camp.startDate),
        campEndDate: new Date(camp.endDate),
        participantFirstName: payload.participantFirstName,
        participantLastName: payload.participantLastName,
        participantBirthDate: new Date(payload.participantBirthDate),
        guardianName: payload.guardianName,
        guardianEmail: payload.guardianEmail,
        guardianPhone: payload.guardianPhone,
        emergencyContactName: payload.emergencyContactName,
        emergencyContactPhone: payload.emergencyContactPhone,
        experienceLevel: payload.experienceLevel,
        stuntFormat: payload.stuntFormat,
        teamName: payload.teamName || null,
        stuntPartnerOrGroup: payload.stuntPartnerOrGroup || null,
        saturdayWish: payload.saturdayWish || null,
        privateInterest: payload.privateInterest,
        tshirtSize: payload.tshirtSize,
        allergies: payload.allergies || null,
        notes: payload.notes || null,
        photoConsent: payload.photoConsent,
        acceptedTerms: payload.acceptedTerms,
        amountCents: camp.priceCents,
        currency: 'EUR',
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      billing_address_collection: 'auto',
      success_url: `${baseUrl}/checkout/success?bookingId=${booking.id}`,
      cancel_url: `${baseUrl}/checkout/cancel?bookingId=${booking.id}`,
      customer_email: payload.guardianEmail,
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
              description: `${camp.venue} · General Camp · ${camp.startDate} bis ${camp.endDate}`,
            },
          },
        },
      ],
    });

    await prisma.booking.update({
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
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
