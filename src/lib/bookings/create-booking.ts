import { ZodError } from 'zod';
import { Prisma } from '@/generated/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getCampBySlug } from '@/lib/camps';
import { getPrismaClient } from '@/lib/prisma';
import { bookingRequestSchema } from '@/lib/validations/booking';

const fieldLabels: Record<string, string> = {
  participantFirstName: 'den Vornamen',
  participantLastName: 'den Nachnamen',
  participantBirthDate: 'das Geburtsdatum',
  contactName: 'den Namen der Kontaktperson',
  contactEmail: 'eine gültige E-Mail-Adresse',
  contactPhone: 'eine Telefonnummer',
  emergencyContactName: 'den Namen des Notfallkontakts',
  emergencyContactPhone: 'eine Telefonnummer für den Notfallkontakt',
  participantMobile: 'eine Handynummer',
  acceptedTerms: 'die Zustimmung zu Datenschutz und Buchungsbedingungen',
};

export class BookingRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export function formatBookingValidationError(error: ZodError): string {
  const firstIssue = error.issues[0];

  if (!firstIssue) {
    return 'Bitte prüfe deine Eingaben.';
  }

  const field = firstIssue.path[0];

  if (typeof field !== 'string') {
    return 'Bitte prüfe deine Eingaben.';
  }

  const label = fieldLabels[field];

  if (!label) {
    return firstIssue.message || 'Bitte prüfe deine Eingaben.';
  }

  if (field === 'acceptedTerms') {
    return 'Bitte stimme Datenschutz und Buchungsbedingungen zu.';
  }

  if (field === 'participantBirthDate') {
    return 'Bitte gib ein gültiges Geburtsdatum an.';
  }

  if (field === 'contactEmail') {
    return 'Bitte gib eine gültige E-Mail-Adresse an.';
  }

  return `Bitte gib ${label} an.`;
}

export async function createPendingBookingFromPayload(payloadJson: unknown) {
  const payload = bookingRequestSchema.parse(payloadJson);
  const [camp, currentUser] = await Promise.all([getCampBySlug(payload.campSlug), getCurrentUser()]);

  if (!camp) {
    throw new BookingRequestError('Das ausgewählte Camp existiert nicht.', 404);
  }

  if (!camp.bookingOpen) {
    throw new BookingRequestError('Dieses Camp ist noch nicht zur Buchung freigegeben.', 400);
  }

  const prisma = getPrismaClient();
  const contactPhone = payload.contactPhone?.trim() || payload.participantMobile;
  const allergies = payload.allergies?.trim() || null;

  const booking = await prisma.$transaction(async (transaction) => {
    await transaction.$executeRaw(Prisma.sql`SELECT pg_advisory_xact_lock(hashtext(${camp.slug}))`);

    const reservedPlaces = await transaction.booking.count({
      where: {
        campSlug: camp.slug,
        status: {
          in: ['PENDING', 'PAID'],
        },
      },
    });

    if (reservedPlaces >= camp.capacity) {
      throw new BookingRequestError('Das Camp ist leider ausgebucht.', 400);
    }

    return transaction.booking.create({
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
        contactPhone,
        emergencyContactName: payload.emergencyContactName,
        emergencyContactPhone: payload.emergencyContactPhone,
        experienceLevel: payload.experienceLevel,
        stuntFormat: payload.stuntFormat,
        teamName: payload.teamName || null,
        stuntPartnerOrGroup: payload.stuntPartnerOrGroup || null,
        participantMobile: payload.participantMobile,
        saturdayWish: payload.saturdayWish || null,
        privateInterest: payload.privateInterest,
        allergies,
        notes: payload.notes || null,
        photoConsent: payload.photoConsent,
        acceptedTerms: payload.acceptedTerms,
        amountCents: camp.priceCents,
        currency: 'EUR',
      },
    });
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
        participantMobile: payload.participantMobile,
        emergencyContactName: payload.emergencyContactName,
        emergencyContactPhone: payload.emergencyContactPhone,
        teamName: payload.teamName || null,
        stuntPartnerOrGroup: payload.stuntPartnerOrGroup || null,
        notes: payload.notes || null,
        ...(payload.contactPhone ? { contactPhone } : {}),
        ...(payload.allergies !== undefined ? { allergies } : {}),
      },
    });
  }

  return {
    booking,
    camp,
    payload,
  };
}
