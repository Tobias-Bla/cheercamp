export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import {
  BookingRequestError,
  createPendingBookingFromPayload,
  formatBookingValidationError,
} from '@/lib/bookings/create-booking';

export async function POST(request: Request): Promise<Response> {
  try {
    const { booking } = await createPendingBookingFromPayload(await request.json());
    const requestUrl = new URL(request.url);
    const baseUrl = requestUrl.origin === 'null' ? process.env.NEXT_PUBLIC_SITE_URL ?? '' : requestUrl.origin;

    if (!baseUrl) {
      return NextResponse.json({ error: 'Die Basis-URL ist nicht konfiguriert.' }, { status: 500 });
    }

    return NextResponse.json({ url: `${baseUrl}/checkout/paypal?bookingId=${booking.id}` });
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
