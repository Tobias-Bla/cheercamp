'use server';

import { revalidatePath } from 'next/cache';
import { getPrismaClient } from '@/lib/prisma';

export async function markBookingPaidAction(formData: FormData): Promise<void> {
  const bookingId = String(formData.get('bookingId') ?? '').trim();

  if (!bookingId) {
    throw new Error('Booking ID fehlt.');
  }

  await getPrismaClient().booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: 'PAID',
      paidAt: new Date(),
    },
  });

  revalidatePath('/admin/bookings');
}
