export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getCampBySlug } from '@/lib/camps';
import { getPrismaClient } from '@/lib/prisma';
import { getStripeClient } from '@/lib/stripe';
import { bookingRequestSchema } from '@/lib/validations/booking';

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = bookingRequestSchema.parse(await request.json());
    const [camp, currentUser] = await Promise.all([getCampBySlug(payload.campSlug), getCurrentUser()]);

    if (!camp) {
      return NextResponse.json({ error: 'Das ausgewählte Camp existiert nicht.' }, { status: 404 });
    }

    if (!camp.bookingOpen) {
      return NextResponse.json({ error: 'Dieses Camp ist noch nicht zur Buchung freigegeben.' }, { status: 400 });
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
        userId: currentUser?.id ?? null,
        campSlug: camp.slug,
        campTitle: camp.title,
        campLocation: camp.location,
        campStartDate: camp.startDate ? new Date(camp.startDate) : null,
        campEndDate: camp.endDate ? new Date(camp.endDate) : null,
        participantFirstName: payload.participantFirstName,
        participantLastName: payload.participantLastName,
        participantBirthDate: new Date(payload.participantBirthDate),
        contactName: payload.contactName,
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone,
        emergencyContactName: payload.emergencyContactName,
        emergencyContactPhone: payload.emergencyContactPhone,
        experienceLevel: payload.experienceLevel,
        stuntFormat: payload.stuntFormat,
        teamName: payload.teamName || null,
        stuntPartnerOrGroup: payload.stuntPartnerOrGroup || null,
        participantMobile: payload.participantMobile,
        saturdayWish: payload.saturdayWish || null,
        privateInterest: payload.privateInterest,
        allergies: payload.allergies || null,
        notes: payload.notes || null,
        photoConsent: payload.photoConsent,
        acceptedTerms: payload.acceptedTerms,
        amountCents: camp.priceCents,
        currency: 'EUR',
      },
    });

    if (currentUser) {
      await prisma.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          name: payload.contactName || null,
          participantFirstName: payload.participantFirstName,
          participantLastName: payload.participantLastName,
          participantBirthDate: new Date(payload.participantBirthDate),
          contactPhone: payload.contactPhone,
          participantMobile: payload.participantMobile,
          emergencyContactName: payload.emergencyContactName,
          emergencyContactPhone: payload.emergencyContactPhone,
          teamName: payload.teamName || null,
          stuntPartnerOrGroup: payload.stuntPartnerOrGroup || null,
          allergies: payload.allergies || null,
          notes: payload.notes || null,
        },
      });
    }

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
              description: `${camp.venue} · General Camp`,
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
