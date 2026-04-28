import { z } from 'zod';

const experienceLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
const stuntFormats = ['PARTNER_STUNT', 'GROUP_STUNT'] as const;
const privateOptions = ['NONE', 'PAIR_60', 'PAIR_90', 'GROUP_60', 'GROUP_90', 'INDIVIDUAL_60', 'INDIVIDUAL_90'] as const;

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

export const bookingRequestSchema = z.object({
  campSlug: z.string().min(1),
  participantFirstName: z.string().trim().min(2).max(60),
  participantLastName: z.string().trim().min(2).max(60),
  participantBirthDate: z.string().refine(isIsoDate, 'Bitte ein gültiges Geburtsdatum angeben.'),
  contactName: z.string().trim().min(2).max(80),
  contactEmail: z.string().trim().email().max(120),
  contactPhone: z.string().trim().min(6).max(30),
  emergencyContactName: z.string().trim().min(2).max(80),
  emergencyContactPhone: z.string().trim().min(6).max(30),
  experienceLevel: z.enum(experienceLevels),
  stuntFormat: z.enum(stuntFormats),
  teamName: z.string().trim().max(100).optional().or(z.literal('')),
  stuntPartnerOrGroup: z.string().trim().max(180).optional().or(z.literal('')),
  participantMobile: z.string().trim().min(6).max(30),
  saturdayWish: z.string().trim().max(500).optional().or(z.literal('')),
  privateInterest: z.enum(privateOptions),
  allergies: z.string().trim().max(1000).optional().or(z.literal('')),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
  photoConsent: z.boolean(),
  acceptedTerms: z.boolean().refine((value) => value, {
    message: 'Die Buchung erfordert die Zustimmung zu Datenschutz und Bedingungen.',
  }),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
